// backend/services/gateway.ts
// OpenClaw Gateway management service

import { createChildLogger } from '../utils/logger.js';
import { openclawCLI } from '../executors/openclaw-cli.js';
import type { GatewayStatus } from '../../shared/types.js';

const log = createChildLogger('gateway');

export class GatewayService {
  /**
   * Start the gateway
   */
  async start(): Promise<void> {
    log.info('Starting gateway');
    await openclawCLI.gatewayStart();
    log.info('Gateway started');
  }

  /**
   * Stop the gateway
   */
  async stop(): Promise<void> {
    log.info('Stopping gateway');
    await openclawCLI.gatewayStop();
    log.info('Gateway stopped');
  }

  /**
   * Restart the gateway
   */
  async restart(): Promise<void> {
    log.info('Restarting gateway');
    await openclawCLI.gatewayRestart();
    log.info('Gateway restarted');
  }

  /**
   * Get gateway status
   */
  async getStatus(): Promise<GatewayStatus> {
    return openclawCLI.getStatus();
  }

  /**
   * Get dashboard URL with auth token
   */
  async getDashboardUrl(): Promise<string> {
    return openclawCLI.getDashboardUrl();
  }

  /**
   * Perform health check
   */
  async healthCheck(): Promise<boolean> {
    return openclawCLI.healthCheck();
  }

  /**
   * Wait for gateway to be ready (polling)
   */
  async waitForReady(timeoutMs: number = 30_000): Promise<boolean> {
    const startTime = Date.now();
    const pollInterval = 1_000;

    while (Date.now() - startTime < timeoutMs) {
      const isHealthy = await this.healthCheck();
      if (isHealthy) return true;

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    return false;
  }
}
