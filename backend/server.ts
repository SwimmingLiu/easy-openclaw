// backend/server.ts
// Fastify server entry point

import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { logger } from './utils/logger.js';
import { AppError } from './utils/error.js';
import { systemRoutes } from './routes/system.js';
import { installRoutes } from './routes/install.js';
import { modelRoutes } from './routes/models.js';
import { channelRoutes } from './routes/channels.js';
import { gatewayRoutes } from './routes/gateway.js';
import { logRoutes } from './routes/logs.js';
import { requestTracingMiddleware, responseTimeHook } from './middleware/request-tracing.js';

const PORT = parseInt(process.env['EASY_OPENCLAW_PORT'] ?? '18790', 10);
const HOST = process.env['EASY_OPENCLAW_HOST'] ?? '127.0.0.1';

/**
 * Build the Fastify app instance
 */
export async function buildApp() {
  const app = Fastify({
    loggerInstance: logger,
    disableRequestLogging: process.env['NODE_ENV'] === 'production',
  });

  // ==================== Middleware ====================

  // Request tracing - add traceId to every request
  app.addHook('onRequest', requestTracingMiddleware);
  app.addHook('onRequest', responseTimeHook);

  // ==================== Plugins ====================

  // CORS - allow frontend to call API
  await app.register(cors, {
    origin: [
      'http://localhost:3000', // Vite dev server
      'http://localhost:5173', // Vite default
      'http://localhost:18790', // Same-origin
      /^https?:\/\/localhost(:\d+)?$/, // Any localhost port
    ],
    credentials: true,
  });

  // Sensible - provides useful utilities
  await app.register(sensible);

  // ==================== Error Handler ====================

  app.setErrorHandler((error, request, reply) => {
    logger.error({ err: error, url: request.url, method: request.method }, 'Unhandled error');

    // AppError (known errors with codes)
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          suggestion: error.suggestion,
        },
      });
    }

    // System errors
    const sysErr = error as NodeJS.ErrnoException & { statusCode?: number };

    if (sysErr.code === 'ENOENT') {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '文件或目录不存在',
          suggestion: '请检查路径是否正确',
        },
      });
    }

    if (sysErr.code === 'EACCES' || sysErr.code === 'EPERM') {
      return reply.status(403).send({
        success: false,
        error: {
          code: 'PERMISSION_DENIED',
          message: '权限不足',
          suggestion: '请尝试以管理员身份运行',
        },
      });
    }

    // npm-related errors
    if (sysErr.message?.includes('npm')) {
      return reply.status(500).send({
        success: false,
        error: {
          code: 'NPM_ERROR',
          message: 'npm 命令执行失败',
          suggestion: '请检查网络连接，或尝试使用镜像源: npm config set registry https://registry.npmmirror.com',
        },
      });
    }

    // Fastify validation errors
    if (sysErr.statusCode === 400) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: sysErr.message ?? '请求参数错误',
        },
      });
    }

    // Generic error
    return reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '服务器内部错误',
        suggestion: '请查看日志或联系支持',
      },
    });
  });

  // 404 handler
  app.setNotFoundHandler((_request, reply) => {
    return reply.status(404).send({
      success: false,
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: '接口不存在',
      },
    });
  });

  // ==================== Routes ====================

  // Health endpoint
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API routes
  await app.register(systemRoutes, { prefix: '/api/system' });
  await app.register(installRoutes, { prefix: '/api/install' });
  await app.register(modelRoutes, { prefix: '/api/models' });
  await app.register(channelRoutes, { prefix: '/api/channels' });
  await app.register(gatewayRoutes, { prefix: '/api/gateway' });
  await app.register(logRoutes);

  return app;
}

/**
 * Start the server
 */
async function start() {
  try {
    const app = await buildApp();

    await app.listen({ port: PORT, host: HOST });

    logger.info(
      {
        url: `http://${HOST}:${PORT}`,
        pid: process.pid,
        nodeVersion: process.version,
      },
      'Easy OpenClaw backend started',
    );
  } catch (err) {
    logger.fatal(err, 'Failed to start server');
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start if run directly
start();
