// backend/routes/system.ts
// System detection API routes

import type { FastifyInstance } from 'fastify';
import { DetectorService } from '../services/detector.js';
import { AppError } from '../utils/error.js';

const detector = new DetectorService();

export async function systemRoutes(app: FastifyInstance): Promise<void> {
  /**
   * GET /api/system/info
   * Get complete system information
   */
  app.get('/info', async (_request, reply) => {
    try {
      const info = await detector.getSystemInfo();
      return reply.send({ success: true, data: info });
    } catch (error) {
      app.log.error(error, 'Failed to get system info');
      const message = error instanceof Error ? error.message : '获取系统信息失败';
      return reply.status(500).send({ success: false, error: { code: 'SYSTEM_ERROR', message } });
    }
  });

  /**
   * GET /api/system/check-prerequisites
   * Check installation prerequisites
   */
  app.get('/check-prerequisites', async (_request, reply) => {
    try {
      const checks = await detector.checkPrerequisites();
      return reply.send({ success: true, data: checks });
    } catch (error) {
      app.log.error(error, 'Failed to check prerequisites');
      const message = error instanceof Error ? error.message : '检查前置条件失败';
      return reply.status(500).send({ success: false, error: { code: 'SYSTEM_ERROR', message } });
    }
  });
}
