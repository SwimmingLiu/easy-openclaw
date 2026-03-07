// backend/routes/models.ts
// AI model configuration API routes

import type { FastifyInstance } from 'fastify';
import { ModelConfigService } from '../services/model-config.js';
import { validateProviderConfig } from '../utils/validator.js';
import { AppError, ValidationError } from '../utils/error.js';
import type { ProviderConfig } from '../../shared/types.js';

const modelConfig = new ModelConfigService();

export async function modelRoutes(app: FastifyInstance): Promise<void> {
  /**
   * GET /api/models/providers
   * Get list of supported AI providers
   */
  app.get('/providers', async (_request, reply) => {
    const providers = modelConfig.getSupportedProviders();
    return reply.send({ success: true, data: providers });
  });

  /**
   * GET /api/models/current
   * Get currently configured model
   */
  app.get('/current', async (_request, reply) => {
    try {
      const current = await modelConfig.getCurrentConfig();
      return reply.send({ success: true, data: current });
    } catch (error) {
      app.log.error(error, 'Failed to get current model config');
      return reply.status(500).send({
        success: false,
        error: { code: 'CONFIG_ERROR', message: '获取当前模型配置失败' },
      });
    }
  });

  /**
   * POST /api/models/configure
   * Configure an AI provider
   */
  app.post<{ Body: ProviderConfig }>('/configure', async (request, reply) => {
    try {
      const config = request.body;
      validateProviderConfig(config);

      await modelConfig.configureProvider(config);

      return reply.send({ success: true, data: { message: 'AI 模型配置成功' } });
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.status(400).send({
          success: false,
          error: {
            code: error.code,
            message: error.message,
            suggestion: `请检查字段: ${error.field ?? '配置项'}`,
          },
        });
      }

      app.log.error(error, 'Failed to configure provider');
      const message = error instanceof Error ? error.message : '配置 AI 模型失败';
      return reply.status(500).send({
        success: false,
        error: { code: 'CONFIG_ERROR', message },
      });
    }
  });

  /**
   * POST /api/models/test
   * Test API connection
   */
  app.post<{ Body: ProviderConfig }>('/test', async (request, reply) => {
    try {
      const config = request.body;

      if (!config.providerId || !config.apiKey) {
        return reply.status(400).send({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'providerId 和 apiKey 是必填项' },
        });
      }

      const result = await modelConfig.testConnection(config);
      return reply.send({ success: true, data: result });
    } catch (error) {
      app.log.error(error, 'Failed to test API connection');
      const message = error instanceof Error ? error.message : '测试 API 连接失败';
      return reply.status(500).send({
        success: false,
        error: { code: 'CONNECTION_ERROR', message },
      });
    }
  });
}
