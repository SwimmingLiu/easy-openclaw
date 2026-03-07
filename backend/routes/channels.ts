// backend/routes/channels.ts
// Notification channel configuration API routes

import type { FastifyInstance } from 'fastify';
import { ChannelConfigService } from '../services/channel-config.js';
import { NotFoundError, ValidationError } from '../utils/error.js';

const channelConfig = new ChannelConfigService();

interface ChannelParams {
  id: string;
}

interface ChannelBody {
  fields?: Record<string, string>;
}

export async function channelRoutes(app: FastifyInstance): Promise<void> {
  /**
   * GET /api/channels/supported
   * Get list of supported channels
   */
  app.get('/supported', async (_request, reply) => {
    const channels = channelConfig.getSupportedChannels();
    return reply.send({ success: true, data: channels });
  });

  /**
   * GET /api/channels/current
   * Get currently configured channels
   */
  app.get('/current', async (_request, reply) => {
    try {
      const current = await channelConfig.getCurrentChannels();
      return reply.send({ success: true, data: current });
    } catch (error) {
      app.log.error(error, 'Failed to get current channels');
      return reply.status(500).send({
        success: false,
        error: { code: 'CONFIG_ERROR', message: '获取当前渠道配置失败' },
      });
    }
  });

  /**
   * POST /api/channels/:id/configure
   * Configure a notification channel
   */
  app.post<{ Params: ChannelParams; Body: ChannelBody }>('/:id/configure', async (request, reply) => {
    const { id } = request.params;
    const { fields = {} } = request.body ?? {};

    try {
      await channelConfig.configureChannel(id, fields);
      return reply.send({ success: true, data: { message: `渠道 ${id} 配置成功` } });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.status(404).send({
          success: false,
          error: { code: error.code, message: error.message, suggestion: error.suggestion },
        });
      }

      if (error instanceof ValidationError) {
        return reply.status(400).send({
          success: false,
          error: { code: error.code, message: error.message },
        });
      }

      app.log.error(error, 'Failed to configure channel');
      const message = error instanceof Error ? error.message : '配置渠道失败';
      return reply.status(500).send({
        success: false,
        error: { code: 'CONFIG_ERROR', message },
      });
    }
  });

  /**
   * POST /api/channels/:id/test
   * Test channel configuration
   */
  app.post<{ Params: ChannelParams; Body: ChannelBody }>('/:id/test', async (request, reply) => {
    const { id } = request.params;
    const { fields = {} } = request.body ?? {};

    try {
      const result = await channelConfig.testChannel(id, fields);
      return reply.send({ success: true, data: result });
    } catch (error) {
      app.log.error(error, 'Failed to test channel');
      const message = error instanceof Error ? error.message : '测试渠道失败';
      return reply.status(500).send({
        success: false,
        error: { code: 'CHANNEL_ERROR', message },
      });
    }
  });

  /**
   * DELETE /api/channels/:id
   * Remove a channel configuration
   */
  app.delete<{ Params: ChannelParams }>('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      await channelConfig.removeChannel(id);
      return reply.send({ success: true, data: { message: `渠道 ${id} 已删除` } });
    } catch (error) {
      app.log.error(error, 'Failed to remove channel');
      const message = error instanceof Error ? error.message : '删除渠道失败';
      return reply.status(500).send({
        success: false,
        error: { code: 'CONFIG_ERROR', message },
      });
    }
  });
}
