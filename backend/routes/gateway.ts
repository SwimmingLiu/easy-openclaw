// backend/routes/gateway.ts
// Gateway management API routes

import type { FastifyInstance } from 'fastify';
import { GatewayService } from '../services/gateway.js';

const gateway = new GatewayService();

export async function gatewayRoutes(app: FastifyInstance): Promise<void> {
  /**
   * POST /api/gateway/start
   * Start the gateway
   */
  app.post('/start', async (_request, reply) => {
    try {
      await gateway.start();
      return reply.send({ success: true, data: { message: 'Gateway 已启动' } });
    } catch (error) {
      app.log.error(error, 'Failed to start gateway');
      const message = error instanceof Error ? error.message : '启动 Gateway 失败';
      return reply.status(500).send({
        success: false,
        error: { code: 'GATEWAY_ERROR', message },
      });
    }
  });

  /**
   * POST /api/gateway/stop
   * Stop the gateway
   */
  app.post('/stop', async (_request, reply) => {
    try {
      await gateway.stop();
      return reply.send({ success: true, data: { message: 'Gateway 已停止' } });
    } catch (error) {
      app.log.error(error, 'Failed to stop gateway');
      const message = error instanceof Error ? error.message : '停止 Gateway 失败';
      return reply.status(500).send({
        success: false,
        error: { code: 'GATEWAY_ERROR', message },
      });
    }
  });

  /**
   * POST /api/gateway/restart
   * Restart the gateway
   */
  app.post('/restart', async (_request, reply) => {
    try {
      await gateway.restart();
      return reply.send({ success: true, data: { message: 'Gateway 已重启' } });
    } catch (error) {
      app.log.error(error, 'Failed to restart gateway');
      const message = error instanceof Error ? error.message : '重启 Gateway 失败';
      return reply.status(500).send({
        success: false,
        error: { code: 'GATEWAY_ERROR', message },
      });
    }
  });

  /**
   * GET /api/gateway/status
   * Get gateway status
   */
  app.get('/status', async (_request, reply) => {
    try {
      const status = await gateway.getStatus();
      return reply.send({ success: true, data: status });
    } catch (error) {
      app.log.error(error, 'Failed to get gateway status');
      return reply.send({ success: true, data: { running: false } });
    }
  });

  /**
   * GET /api/gateway/dashboard-url
   * Get dashboard URL with auth token
   */
  app.get('/dashboard-url', async (_request, reply) => {
    try {
      const url = await gateway.getDashboardUrl();
      return reply.send({ success: true, data: { url } });
    } catch (error) {
      app.log.error(error, 'Failed to get dashboard URL');
      const message = error instanceof Error ? error.message : '获取 Dashboard URL 失败';
      return reply.status(500).send({
        success: false,
        error: { code: 'GATEWAY_ERROR', message },
      });
    }
  });

  /**
   * GET /api/gateway/health
   * Health check
   */
  app.get('/health', async (_request, reply) => {
    const healthy = await gateway.healthCheck();
    return reply.send({ success: true, data: { healthy } });
  });
}
