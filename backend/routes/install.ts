// backend/routes/install.ts
// Installation API routes with SSE streaming

import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { InstallerService } from '../services/installer.js';
import type { InstallOptions, InstallEvent } from '../../shared/types.js';

const installer = new InstallerService();

// Track active install sessions
const installSessions = new Map<string, AsyncGenerator<InstallEvent>>();

interface StartInstallBody {
  nodejsMethod?: 'auto' | 'nvm' | 'official';
  skipOnboard?: boolean;
}

export async function installRoutes(app: FastifyInstance): Promise<void> {
  /**
   * POST /api/install/start
   * Start installation and return installId for SSE stream
   */
  app.post<{ Body: StartInstallBody }>('/start', async (request, reply) => {
    const { nodejsMethod = 'auto', skipOnboard = false } = request.body ?? {};

    const installId = randomUUID();

    const options: InstallOptions = {
      nodejsMethod,
      skipOnboard,
    };

    // Create the generator but don't start it yet
    const gen = installer.install(installId, options);
    installSessions.set(installId, gen);

    // Clean up after 30 minutes
    setTimeout(() => {
      installSessions.delete(installId);
    }, 30 * 60 * 1000);

    return reply.send({ success: true, data: { installId } });
  });

  /**
   * GET /api/install/:id/events
   * SSE stream of install events
   */
  app.get<{ Params: { id: string } }>('/:id/events', async (request, reply) => {
    const { id } = request.params;
    const gen = installSessions.get(id);

    if (!gen) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: '安装会话不存在或已过期' },
      });
    }

    // Set SSE headers
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.setHeader('X-Accel-Buffering', 'no');
    reply.raw.flushHeaders();

    // Handle client disconnect
    request.raw.on('close', () => {
      app.log.info({ installId: id }, 'SSE client disconnected');
    });

    try {
      for await (const event of gen) {
        const data = JSON.stringify(event);
        reply.raw.write(`event: ${event.type}\ndata: ${data}\n\n`);

        // Flush if possible
        if ('flush' in reply.raw && typeof reply.raw.flush === 'function') {
          (reply.raw.flush as () => void)();
        }

        // End stream when install is complete
        if (event.type === 'install-complete') {
          installSessions.delete(id);
          break;
        }
      }
    } catch (error) {
      app.log.error(error, 'SSE stream error');
      const message = error instanceof Error ? error.message : '安装过程中发生错误';
      reply.raw.write(`event: error\ndata: ${JSON.stringify({ message })}\n\n`);
      installSessions.delete(id);
    } finally {
      reply.raw.end();
    }
  });

  /**
   * POST /api/install/cancel
   * Cancel active installation
   */
  app.post<{ Body: { installId: string } }>('/cancel', async (request, reply) => {
    const { installId } = request.body ?? {};

    if (!installId) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'installId 是必填项' },
      });
    }

    const cancelled = installer.cancel(installId);
    installSessions.delete(installId);

    return reply.send({ success: true, data: { cancelled } });
  });
}
