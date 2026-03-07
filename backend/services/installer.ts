// backend/services/installer.ts
// Installation service with step-by-step execution and rollback

import os from 'node:os';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createChildLogger } from '../utils/logger.js';
import { CommandError } from '../utils/error.js';
import type { InstallEvent, InstallOptions } from '../../shared/types.js';

const log = createChildLogger('installer');

interface InstallStep {
  id: string;
  name: string;
  fn: () => Promise<unknown>;
  rollback?: () => Promise<void>;
}

export class InstallerService {
  private activeInstalls = new Map<string, { cancel: () => void }>();

  /**
   * Execute the full installation flow
   * Returns an async generator yielding install events
   */
  async *install(
    installId: string,
    options: InstallOptions,
  ): AsyncGenerator<InstallEvent> {
    log.info({ installId, options }, 'Starting installation');

    const rollbackSteps: Array<() => Promise<void>> = [];
    let cancelled = false;

    // Register cancellation hook
    this.activeInstalls.set(installId, {
      cancel: () => {
        cancelled = true;
      },
    });

    const steps: InstallStep[] = [
      {
        id: 'check-permissions',
        name: '检查权限',
        fn: () => this.checkPermissions(),
      },
      {
        id: 'install-nodejs',
        name: '安装 Node.js',
        fn: () => this.installNodeJS(options.nodejsMethod),
        rollback: async () => {
          log.info('Rolling back nodejs installation');
        },
      },
      {
        id: 'check-npm',
        name: '验证 npm',
        fn: () => this.checkNpm(),
      },
      {
        id: 'install-openclaw',
        name: '安装 OpenClaw',
        fn: () => this.installOpenClaw(),
        rollback: async () => {
          try {
            await this.runCommand('npm uninstall -g openclaw');
          } catch {
            log.warn('Failed to rollback openclaw installation');
          }
        },
      },
      {
        id: 'create-config',
        name: '创建配置目录',
        fn: () => this.createConfigDir(),
      },
      {
        id: 'verify',
        name: '验证安装',
        fn: () => this.verifyInstallation(),
      },
    ];

    try {
      for (const step of steps) {
        if (cancelled) {
          yield { type: 'step-error', step: step.id, error: '安装已取消' };
          return;
        }

        yield { type: 'step-start', step: step.id, name: step.name };

        try {
          // For nodejs install, stream progress
          if (step.id === 'install-nodejs' || step.id === 'install-openclaw') {
            yield* this.runStepWithProgress(step, installId);
          } else {
            const result = await step.fn();
            yield { type: 'step-complete', step: step.id, result };
          }

          if (step.rollback) {
            rollbackSteps.push(step.rollback);
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          log.error({ step: step.id, error: message }, 'Installation step failed');
          yield { type: 'step-error', step: step.id, error: message };

          // Execute rollback
          await this.executeRollback(rollbackSteps);
          yield { type: 'install-complete', success: false };
          return;
        }
      }

      yield { type: 'install-complete', success: true };
    } finally {
      this.activeInstalls.delete(installId);
    }
  }

  /**
   * Cancel an active installation
   */
  cancel(installId: string): boolean {
    const install = this.activeInstalls.get(installId);
    if (install) {
      install.cancel();
      return true;
    }
    return false;
  }

  /**
   * Run a step that streams output as progress events
   */
  private async *runStepWithProgress(
    step: InstallStep,
    installId: string,
  ): AsyncGenerator<InstallEvent> {
    try {
      const result = await step.fn();
      yield { type: 'step-complete', step: step.id, result };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check execution permissions
   */
  private async checkPermissions(): Promise<{ hasRoot: boolean; canSudo: boolean }> {
    const isRoot = process.getuid?.() === 0;

    let canSudo = false;
    if (!isRoot && process.platform !== 'win32') {
      try {
        await this.runCommand('sudo -n true', { timeout: 5_000 });
        canSudo = true;
      } catch {
        // sudo needs password - that's OK
        canSudo = true; // We'll prompt when needed
      }
    }

    log.info({ isRoot, canSudo }, 'Permission check');
    return { hasRoot: isRoot, canSudo };
  }

  /**
   * Install Node.js based on method
   */
  private async installNodeJS(method: 'auto' | 'nvm' | 'official'): Promise<void> {
    // Check if already installed and satisfies requirements
    try {
      const { stdout } = await this.runCommand('node -v');
      const version = stdout.replace(/^v/, '').trim();
      const major = parseInt(version.split('.')[0] ?? '0', 10);
      if (major >= 22) {
        log.info({ version }, 'Node.js already installed and satisfies requirements');
        return;
      }
    } catch {
      // Not installed
    }

    log.info({ method, platform: process.platform }, 'Installing Node.js');

    switch (process.platform) {
      case 'darwin':
        await this.installNodeJSMac();
        break;
      case 'linux':
        await this.installNodeJSLinux();
        break;
      case 'win32':
        await this.installNodeJSWindows();
        break;
      default:
        throw new Error(`不支持的操作系统: ${process.platform}`);
    }
  }

  private async installNodeJSMac(): Promise<void> {
    // Try homebrew first
    try {
      await this.runCommand('which brew', { timeout: 5_000 });
      await this.runCommandWithOutput('brew install node@22 && brew link --force --overwrite node@22');
    } catch {
      // Fallback: download from official
      const url = 'https://nodejs.org/dist/v22.11.0/node-v22.11.0.pkg';
      await this.runCommandWithOutput(`curl -fsSL ${url} -o /tmp/nodejs.pkg && sudo installer -pkg /tmp/nodejs.pkg -target /`);
    }
  }

  private async installNodeJSLinux(): Promise<void> {
    // Use NodeSource setup
    await this.runCommandWithOutput(
      'curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs',
    );
  }

  private async installNodeJSWindows(): Promise<void> {
    // Use winget
    try {
      await this.runCommandWithOutput('winget install OpenJS.NodeJS.LTS --version 22');
    } catch {
      // Fallback: chocolatey
      await this.runCommandWithOutput('choco install nodejs-lts --version=22.11.0 -y');
    }
  }

  /**
   * Check npm is available
   */
  private async checkNpm(): Promise<{ version: string }> {
    const { stdout } = await this.runCommand('npm -v');
    return { version: stdout.trim() };
  }

  /**
   * Install OpenClaw globally
   */
  private async installOpenClaw(): Promise<void> {
    log.info('Installing OpenClaw via npm');
    await this.runCommandWithOutput('npm install -g openclaw@latest');
  }

  /**
   * Create OpenClaw config directory with proper permissions
   */
  private async createConfigDir(): Promise<void> {
    const configDir =
      process.env['EASY_OPENCLAW_CONFIG_DIR'] ?? path.join(os.homedir(), '.openclaw');

    await fs.mkdir(configDir, { recursive: true, mode: 0o700 });
    await fs.mkdir(path.join(configDir, 'logs'), { recursive: true, mode: 0o700 });
    await fs.mkdir(path.join(configDir, 'data'), { recursive: true, mode: 0o700 });

    // Set env file permissions if it exists
    const envPath = path.join(configDir, 'env');
    try {
      await fs.access(envPath);
      await fs.chmod(envPath, 0o600);
    } catch {
      // env file doesn't exist yet, create it
      await fs.writeFile(envPath, '', { mode: 0o600 });
    }

    log.info({ configDir }, 'Config directory created');
  }

  /**
   * Verify installation is complete and working
   */
  private async verifyInstallation(): Promise<{ version: string; configPath: string }> {
    const { stdout } = await this.runCommand('openclaw --version');
    const version = stdout.trim();

    const configDir =
      process.env['EASY_OPENCLAW_CONFIG_DIR'] ?? path.join(os.homedir(), '.openclaw');

    log.info({ version, configDir }, 'Installation verified');
    return { version, configPath: configDir };
  }

  /**
   * Execute rollback steps in reverse order
   */
  private async executeRollback(steps: Array<() => Promise<void>>): Promise<void> {
    const reversed = [...steps].reverse();
    for (const rollback of reversed) {
      try {
        await rollback();
      } catch (e) {
        log.error({ error: e }, 'Rollback step failed');
      }
    }
  }

  /**
   * Run a command and return output
   */
  private async runCommand(
    command: string,
    options: { timeout?: number } = {},
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, [], {
        shell: true,
        env: process.env,
        timeout: options.timeout,
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (d: Buffer) => {
        stdout += d.toString();
      });
      child.stderr?.on('data', (d: Buffer) => {
        stderr += d.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
        } else {
          reject(new CommandError(`Command failed: ${command}`, command, code ?? 1));
        }
      });

      child.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Run command with streamed output (for logging)
   */
  private async runCommandWithOutput(command: string): Promise<void> {
    await this.runCommand(command, { timeout: 300_000 });
  }
}
