export interface SeedanceApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface SeedanceTaskResponse {
  task_id: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
}

export interface SeedanceStatusResponse {
  task_id: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  progress?: number; // 0-100
  video_url?: string;
  cover_url?: string;
  error_message?: string;
  created_at?: string;
  completed_at?: string;
}

export class SeedanceApiError extends Error {
  constructor(public code: number, message: string, public details?: any) {
    super(message);
    this.name = 'SeedanceApiError';
  }
}
