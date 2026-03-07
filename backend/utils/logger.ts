// backend/utils/logger.ts
// Structured logging utility using Pino

import pino from 'pino';

const isDev = process.env['NODE_ENV'] !== 'production';
const logLevel = process.env['EASY_OPENCLAW_LOG_LEVEL'] ?? 'info';

export const logger = pino(
  isDev
    ? {
        level: logLevel,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
        serializers: {
          err: pino.stdSerializers.err,
          error: pino.stdSerializers.err,
        },
      }
    : {
        level: logLevel,
        serializers: {
          err: pino.stdSerializers.err,
          error: pino.stdSerializers.err,
        },
      },
);

export function createChildLogger(name: string) {
  return logger.child({ module: name });
}
