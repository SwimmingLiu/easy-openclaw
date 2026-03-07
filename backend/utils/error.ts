// backend/utils/error.ts
// Custom error classes and error handling utilities

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly suggestion?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, suggestion?: string) {
    super(message, 'NOT_FOUND', 404, suggestion);
    this.name = 'NotFoundError';
  }
}

export class PermissionError extends AppError {
  constructor(message: string = '权限不足', suggestion?: string) {
    super(message, 'PERMISSION_DENIED', 403, suggestion ?? '请尝试以管理员身份运行');
    this.name = 'PermissionError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, suggestion?: string) {
    super(message, 'NETWORK_ERROR', 503, suggestion ?? '请检查网络连接');
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public readonly field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class CommandError extends AppError {
  constructor(
    message: string,
    public readonly command: string,
    public readonly exitCode: number,
    suggestion?: string,
  ) {
    super(message, 'COMMAND_ERROR', 500, suggestion);
    this.name = 'CommandError';
  }
}

export class ConfigError extends AppError {
  constructor(message: string, suggestion?: string) {
    super(message, 'CONFIG_ERROR', 500, suggestion);
    this.name = 'ConfigError';
  }
}

/**
 * Convert system error codes to AppError
 */
export function fromSystemError(err: NodeJS.ErrnoException): AppError {
  switch (err.code) {
    case 'ENOENT':
      return new NotFoundError(err.message ?? '文件或目录不存在', '请检查路径是否正确');
    case 'EACCES':
    case 'EPERM':
      return new PermissionError(err.message ?? '权限不足', '请尝试以管理员身份运行');
    case 'ECONNREFUSED':
    case 'ECONNRESET':
    case 'ETIMEDOUT':
      return new NetworkError(err.message ?? '网络连接失败', '请检查网络连接');
    default:
      return new AppError(err.message ?? '未知错误', 'SYSTEM_ERROR', 500);
  }
}

/**
 * Mask API key for safe display
 */
export function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 12) {
    return '****';
  }
  return `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`;
}
