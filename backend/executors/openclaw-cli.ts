// backend/executors/openclaw-cli.ts
// OpenClaw CLI command wrapper

import { execCommand, spawnStream, type ExecOptions } from './shell.js';
import { createChildLogger } from '../utils/logger.js';
import type { GatewayStatus, OpenClawInfo } from '../../shared/types.js';

const log = createChildLogger('openclaw-cli');

/**
 * OpenClaw CLI executor
 * Wraps openclaw CLI commands with typed interfaces
 */
export class OpenClawCLI {
  private readonly binary: string;

  constructor(binary: string = 'openclaw') {
    this.binary = binary;
  }

  /**
   * Get OpenClaw version
   */
  async getVersion(): Promise<string | null> {
    try {
      const { stdout } = await execCommand(`${this.binary} --version`);
      return stdout.trim();
    } catch {
      return null;
    }
  }

  /**
   * Get OpenClaw status as JSON
   */
  async getStatus(): Promise<GatewayStatus> {
    try {
      const { stdout } = await execCommand(`${this.binary} status --json`);
      return JSON.parse(stdout) as GatewayStatus;
    } catch {
      return { running: false };
    }
  }

  /**
   * Detect if OpenClaw is installed and get info
   */
  async detect(): Promise<OpenClawInfo> {
    try {
      const version = await this.getVersion();
      if (!version) {
        return { installed: false };
      }

      const status = await this.getStatus();

      return {
        installed: true,
        version,
        gatewayRunning: status.running,
        configExists: await this.hasConfig(),
      };
    } catch {
      return { installed: false };
    }
  }

  /**
   * Check if openclaw config exists
   */
  async hasConfig(): Promise<boolean> {
    try {
      const { stdout } = await execCommand(`${this.binary} config list --json`);
      return stdout.trim() !== '' && stdout !== 'null';
    } catch {
      return false;
    }
  }

  /**
   * Start the gateway
   */
  async gatewayStart(): Promise<void> {
    log.info('Starting gateway');
    await execCommand(`${this.binary} gateway start`);
  }

  /**
   * Stop the gateway
   */
  async gatewayStop(): Promise<void> {
    log.info('Stopping gateway');
    await execCommand(`${this.binary} gateway stop`);
  }

  /**
   * Restart the gateway
   */
  async gatewayRestart(): Promise<void> {
    log.info('Restarting gateway');
    await execCommand(`${this.binary} gateway restart`);
  }

  /**
   * Get dashboard URL
   */
  async getDashboardUrl(): Promise<string> {
    const { stdout } = await execCommand(`${this.binary} dashboard --no-open`);
    return stdout.trim();
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await execCommand(`${this.binary} health`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Enable a plugin
   */
  async pluginEnable(pluginId: string): Promise<void> {
    await execCommand(`${this.binary} plugins enable ${pluginId}`);
  }

  /**
   * Add a channel with config
   */
  async channelAdd(channelId: string, token: string): Promise<void> {
    await execCommand(`${this.binary} channels add --channel ${channelId} --token "${token}"`);
  }

  /**
   * Remove a channel
   */
  async channelRemove(channelId: string): Promise<void> {
    await execCommand(`${this.binary} channels remove --channel ${channelId}`);
  }

  /**
   * Test connection with a specific API key (env override)
   */
  async testConnection(envOverrides: Record<string, string>): Promise<boolean> {
    try {
      await execCommand(`${this.binary} agent --local --message "Say OK"`, {
        env: { ...process.env, ...envOverrides } as NodeJS.ProcessEnv,
        timeout: 30_000,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Install openclaw globally via npm
   * Returns async generator with streaming output
   */
  async *install(): AsyncGenerator<{ type: 'stdout' | 'stderr'; data: string }> {
    yield* spawnStream('npm', ['install', '-g', 'openclaw@latest']);
  }

  /**
   * Run arbitrary openclaw command
   */
  async run(args: string[], options?: ExecOptions): Promise<string> {
    const { stdout } = await execCommand(`${this.binary} ${args.join(' ')}`, options);
    return stdout;
  }
}

// Default singleton instance
export const openclawCLI = new OpenClawCLI();
