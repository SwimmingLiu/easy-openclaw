// backend/utils/logger.ts
// Structured logging utility using Pino with sensitive data redaction

import pino from 'pino';

const isDev = process.env['NODE_ENV'] !== 'production';
const logLevel = process.env['EASY_OPENCLAW_LOG_LEVEL'] ?? (isDev ? 'debug' : 'info');

// Sensitive fields that need to be redacted in logs
const sensitiveFields = [
  'apiKey',
  'token',
  'password',
  'secret',
  'authorization',
  'accessToken',
  'refreshToken',
  'privateKey',
];

// Redaction configuration
const redactConfig = {
  paths: sensitiveFields.flatMap((field) => [`*.${field}`, `${field}`]),
  censor: (value: string, path: string[]) => {
    const field = path[path.length - 1];
    // Completely hide passwords and secrets
    if (field === 'password' || field === 'secret' || field === 'authorization') {
      return '******';
    }
    // Partially mask other sensitive fields (show first 4 and last 4 chars)
    if (typeof value === 'string' && value.length > 8) {
      return value.slice(0, 4) + '****' + value.slice(-4);
    }
    return '******';
  },
};

export const logger = pino({
  level: logLevel,
  redact: redactConfig,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
  },
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

/**
 * Create a child logger with module context
 * @param module - Module name for the logger
 * @returns Child logger instance
 */
export function createChildLogger(module: string) {
  return logger.child({
    service: 'easy-openclaw-backend',
    module,
  });
}

/**
 * Create a child logger with trace ID support
 * @param module - Module name for the logger
 * @param traceId - Request trace ID
 * @returns Child logger instance with trace context
 */
export function createTracedLogger(module: string, traceId: string) {
  return logger.child({
    service: 'easy-openclaw-backend',
    module,
    traceId,
  });
}
