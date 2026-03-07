// backend/executors/npm.ts
// Typed npm command executor

import { execCommand, type ExecOptions } from './shell.js';
import { createChildLogger } from '../utils/logger.js';

const log = createChildLogger('npm');

export interface NpmInstallOptions {
  /** Install globally */
  global?: boolean;
  /** Working directory for local installs */
  cwd?: string;
  /** Additional env vars */
  env?: NodeJS.ProcessEnv;
  /** Command timeout in ms (default: 120s) */
  timeout?: number;
}

export interface NpmListOptions {
  /** List global packages */
  global?: boolean;
  /** Depth to list (default: 0) */
  depth?: number;
  /** Working directory */
  cwd?: string;
}

export interface NpmListResult {
  dependencies: Record<string, { version: string }>;
}

/**
 * Install an npm package
 */
export async function npmInstall(
  pkg: string,
  options: NpmInstallOptions = {},
): Promise<void> {
  const flags: string[] = ['install'];

  if (options.global) {
    flags.push('-g');
  }

  flags.push(pkg);

  const command = `npm ${flags.join(' ')}`;
  log.info({ command, options }, 'Installing npm package');

  const execOpts: ExecOptions = {
    cwd: options.cwd,
    env: options.env,
    timeout: options.timeout ?? 120_000,
  };

  await execCommand(command, execOpts);
}

/**
 * List installed npm packages (returns parsed JSON)
 */
export async function npmList(options: NpmListOptions = {}): Promise<NpmListResult> {
  const flags: string[] = ['list'];

  if (options.global) {
    flags.push('-g');
  }

  flags.push(`--depth=${options.depth ?? 0}`);
  flags.push('--json');

  const command = `npm ${flags.join(' ')}`;
  log.debug({ command }, 'Listing npm packages');

  const { stdout } = await execCommand(command, {
    cwd: options.cwd,
    timeout: 30_000,
  });

  try {
    return JSON.parse(stdout) as NpmListResult;
  } catch {
    log.warn({ stdout }, 'Failed to parse npm list output');
    return { dependencies: {} };
  }
}

/**
 * Get an npm config value
 */
export async function npmConfigGet(key: string): Promise<string> {
  const command = `npm config get ${key}`;
  log.debug({ key }, 'Getting npm config');

  const { stdout } = await execCommand(command, { timeout: 10_000 });
  return stdout.trim();
}

/**
 * Set an npm config value
 */
export async function npmConfigSet(key: string, value: string): Promise<void> {
  const command = `npm config set ${key} ${value}`;
  log.info({ key }, 'Setting npm config');

  await execCommand(command, { timeout: 10_000 });
}
