// backend/middleware/request-tracing.ts
// Request tracing middleware for generating and propagating trace IDs

import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { randomUUID } from 'crypto';
import { createChildLogger } from '../utils/logger';

const logger = createChildLogger('request-tracing');

// Extend FastifyRequest to include traceId
declare module 'fastify' {
  interface FastifyRequest {
    traceId: string;
  }
}

/**
 * Middleware to generate and propagate trace IDs for request tracing
 */
export function requestTracingMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
): void {
  // Get traceId from request header or generate a new one
  const traceId = (request.headers['x-trace-id'] as string) || randomUUID();
  request.traceId = traceId;

  // Set traceId in response header for frontend correlation
  reply.header('x-trace-id', traceId);

  // Log request start
  logger.debug({
    traceId,
    msg: 'Request started',
    method: request.method,
    path: request.url,
    userAgent: request.headers['user-agent'],
  });

  done();
}

/**
 * Hook to log response time
 */
export function responseTimeHook(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
): void {
  const start = Date.now();

  // Use onSend hook via the reply instance
  reply.raw.on('finish', () => {
    const responseTime = Date.now() - start;
    const logData = {
      traceId: request.traceId,
      msg: 'Request completed',
      method: request.method,
      path: request.url,
      statusCode: reply.statusCode,
      responseTime,
    };

    // Log at different levels based on status code
    if (reply.statusCode >= 500) {
      logger.error(logData);
    } else if (reply.statusCode >= 400) {
      logger.warn(logData);
    } else {
      logger.info(logData);
    }
  });

  done();
}
