import { Request, Response, NextFunction } from 'express';

// 定义自定义错误类
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
    public details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// 全局错误处理中间件
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 打印错误日志（在生产环境中可能需要接入 Sentry 等服务）
  console.error(`[Error] ${err.name}: ${err.message}`);
  if (err instanceof AppError && err.details) {
    console.error('[Error Details]', err.details);
  } else if (!('isOperational' in err)) {
    console.error('[Stack]', err.stack);
  }

  // 区分业务错误和未预期的服务器错误
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : 'Internal Server Error';

  res.status(statusCode).json({
    code: statusCode,
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: isAppError ? err.details : undefined
    })
  });
};
