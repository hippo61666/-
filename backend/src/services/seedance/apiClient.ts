import { SeedanceGenerationParams } from '../../types/brandKit';
import { 
  SeedanceApiResponse, 
  SeedanceTaskResponse, 
  SeedanceStatusResponse,
  SeedanceApiError 
} from '../../types/seedanceApi';

/**
 * Seedance 2 API 客户端服务
 * 负责与 Seedance 2 大模型进行实际的 HTTP 通信
 */
export class SeedanceApiClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  
  // 假设 Seedance 2 支持 Webhook，我们可以提供回调地址
  private readonly webhookUrl?: string;

  // 重试配置
  private readonly maxRetries = 3;
  private readonly baseRetryDelay = 1000; // 基础延迟 1 秒

  constructor() {
    // 实际项目中这些应该从环境变量 process.env 中读取
    this.baseUrl = process.env.SEEDANCE_API_BASE_URL || 'https://api.seedance.ai/v2';
    this.apiKey = process.env.SEEDANCE_API_KEY || 'your-default-api-key';
    this.webhookUrl = process.env.SEEDANCE_WEBHOOK_URL;
  }

  /**
   * 带指数退避的自动重试封装
   */
  private async fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        
        // 遇到 429 Too Many Requests (限流) 或 5xx (服务器错误) 时进行重试
        if (!response.ok && (response.status === 429 || response.status >= 500)) {
          if (attempt === this.maxRetries) {
             throw new Error(`HTTP ${response.status} after ${this.maxRetries} retries`);
          }
          
          // 解析可能的 Retry-After 头部
          const retryAfterHeader = response.headers.get('Retry-After');
          let delay = this.baseRetryDelay * Math.pow(2, attempt); // 指数退避: 1s, 2s, 4s...
          
          if (retryAfterHeader) {
            const parsedHeader = parseInt(retryAfterHeader, 10);
            if (!isNaN(parsedHeader)) {
              delay = parsedHeader * 1000; // 转换为毫秒
            }
          }
          
          console.warn(`[Seedance API] 遇到 ${response.status} 错误，准备第 ${attempt + 1} 次重试，等待 ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue; // 继续下一次尝试
        }
        
        return response; // 成功响应或其他非重试错误 (如 400, 401) 直接返回
      } catch (error) {
        // 捕获网络错误 (如 ECONNREFUSED, 超时)
        lastError = error;
        
        if (attempt === this.maxRetries) {
          break;
        }
        
        const delay = this.baseRetryDelay * Math.pow(2, attempt);
        console.warn(`[Seedance API] 遇到网络错误: ${(error as Error).message}，准备第 ${attempt + 1} 次重试，等待 ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError || new Error(`Failed to fetch after ${this.maxRetries} retries`);
  }

  /**
   * 提交视频生成任务
   * @param params 通过 PromptBuilderService 组装好的生成参数
   * @returns 包含 task_id 的任务信息
   */
  public async submitGenerationTask(params: SeedanceGenerationParams): Promise<SeedanceTaskResponse> {
    try {
      // 组装最终请求 Payload，合并 webhook 地址
      const payload = {
        ...params,
        webhook_url: this.webhookUrl
      };

      const response = await this.fetchWithRetry(`${this.baseUrl}/video/generate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      return await this.handleResponse<SeedanceTaskResponse>(response);
    } catch (error) {
      this.handleFetchError('submitGenerationTask', error);
      throw error; // typescript需要
    }
  }

  /**
   * 轮询查询任务状态 (当不使用 Webhook 或 Webhook 失败时使用)
   * @param taskId 提交任务时返回的 task_id
   * @returns 任务的当前状态、进度和视频链接
   */
  public async getTaskStatus(taskId: string): Promise<SeedanceStatusResponse> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}/video/task/${taskId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return await this.handleResponse<SeedanceStatusResponse>(response);
    } catch (error) {
      this.handleFetchError('getTaskStatus', error);
      throw error;
    }
  }

  /**
   * 取消正在生成的任务
   * @param taskId 任务 ID
   */
  public async cancelTask(taskId: string): Promise<boolean> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}/video/task/${taskId}/cancel`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      await this.handleResponse(response);
      return true;
    } catch (error) {
      console.error(`Failed to cancel task ${taskId}:`, error);
      return false;
    }
  }

  /**
   * 统一构建 HTTP Headers
   */
  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      // 假设 Seedance 需要特定的客户端标识
      'X-Client-Version': 'AdPlatform-1.0'
    };
  }

  /**
   * 统一处理 API 响应和错误
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    let data: any;
    
    try {
      data = await response.json();
    } catch (e) {
      throw new SeedanceApiError(
        response.status, 
        `Invalid JSON response from Seedance API: ${response.statusText}`
      );
    }

    if (!response.ok) {
      // 处理 HTTP 错误 (如 400, 401, 429 等)
      throw new SeedanceApiError(
        response.status,
        data?.message || `HTTP Error ${response.status}: ${response.statusText}`,
        data
      );
    }

    // 假设 Seedance API 的成功响应体总是 { code: 0, message: "ok", data: {...} }
    const apiResponse = data as SeedanceApiResponse<T>;
    
    if (apiResponse.code !== 0) {
      throw new SeedanceApiError(
        apiResponse.code,
        apiResponse.message || 'Seedance API returned a business error',
        apiResponse.data
      );
    }

    return apiResponse.data;
  }

  /**
   * 处理网络层面的错误 (如 DNS 解析失败、超时)
   */
  private handleFetchError(methodName: string, error: unknown): void {
    if (error instanceof SeedanceApiError) {
      console.error(`[Seedance API] ${methodName} business error: ${error.message}`, error.details);
    } else {
      console.error(`[Seedance API] ${methodName} network error:`, error);
      throw new SeedanceApiError(500, `Network error during Seedance API call: ${(error as Error).message}`);
    }
  }
}
