// backend/routes/logs.ts
// Log collection endpoint for frontend error reporting

import { FastifyInstance } from 'fastify';
import { createChildLogger } from '../utils/logger.js';

const logger = createChildLogger('log-collector');

export async function logRoutes(app: FastifyInstance) {
  /**
   * POST /api/logs
   * Collect frontend error logs
   * Rate limited to prevent abuse
   */
  app.post<{
    Body: {
      level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
      msg: string;
      traceId?: string;
      timestamp?: string;
      [key: string]: unknown;
    };
  }>(
    '/api/logs',
    {
      config: {
        rateLimit: {
          max: 100,
          timeWindow: '1 minute',
        },
      },
    },
    async (request, reply) => {
      const { level = 'info', msg, traceId, timestamp, ...context } = request.body;

      // Log frontend message with appropriate level
      const logData = {
        traceId: traceId || request.traceId,
        service: 'easy-openclaw-frontend',
        timestamp,
        ...context,
      };

      const message = `[Frontend] ${msg}`;

      switch (level) {
        case 'trace':
          logger.trace(logData, message);
          break;
        case 'debug':
          logger.debug(logData, message);
          break;
        case 'info':
          logger.info(logData, message);
          break;
        case 'warn':
          logger.warn(logData, message);
          break;
        case 'error':
          logger.error(logData, message);
          break;
        case 'fatal':
          logger.fatal(logData, message);
          break;
        default:
          logger.info(logData, message);
      }

      return { success: true };
    }
  );
}
