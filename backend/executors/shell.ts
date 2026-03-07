// backend/executors/shell.ts
// Shell command executor with streaming support

import { exec, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import { CommandError } from '../utils/error.js';
import { createChildLogger } from '../utils/logger.js';

const execAsync = promisify(exec);
const log = createChildLogger('shell');

export interface ExecOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  timeout?: number;
  encoding?: BufferEncoding;
}

export interface ExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface SpawnOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  shell?: boolean;
}

/**
 * Execute a shell command and return output
 */
export async function execCommand(command: string, options: ExecOptions = {}): Promise<ExecResult> {
  log.debug({ command, options }, 'Executing command');

  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      timeout: options.timeout ?? 60_000,
      encoding: options.encoding ?? 'utf8',
    });

    return { stdout: stdout.trim(), stderr: stderr.trim(), exitCode: 0 };
  } catch (err) {
    const error = err as NodeJS.ErrnoException & { code?: number; stdout?: string; stderr?: string };
    log.error({ command, error: error.message }, 'Command failed');

    throw new CommandError(
      `命令执行失败: ${command}\n${error.message}`,
      command,
      typeof error.code === 'number' ? error.code : 1,
    );
  }
}

/**
 * Check if a command exists in PATH
 */
export async function which(command: string): Promise<string | null> {
  try {
    const isWindows = process.platform === 'win32';
    const whichCmd = isWindows ? `where ${command}` : `which ${command}`;
    const { stdout } = await execCommand(whichCmd);
    return stdout.split('\n')[0]?.trim() ?? null;
  } catch {
    return null;
  }
}

/**
 * Spawn a command with streaming output
 * Returns an async generator yielding output lines
 */
export async function* spawnStream(
  command: string,
  args: string[] = [],
  options: SpawnOptions = {},
): AsyncGenerator<{ type: 'stdout' | 'stderr'; data: string }> {
  log.debug({ command, args }, 'Spawning command');

  const child = spawn(command, args, {
    cwd: options.cwd,
    env: options.env ?? process.env,
    shell: options.shell ?? true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const queue: Array<{ type: 'stdout' | 'stderr'; data: string } | null> = [];
  let resolve: (() => void) | null = null;
  let exitCode: number | null = null;

  function enqueue(item: { type: 'stdout' | 'stderr'; data: string } | null) {
    queue.push(item);
    resolve?.();
    resolve = null;
  }

  child.stdout?.on('data', (data: Buffer) => {
    enqueue({ type: 'stdout', data: data.toString() });
  });

  child.stderr?.on('data', (data: Buffer) => {
    enqueue({ type: 'stderr', data: data.toString() });
  });

  child.on('close', (code) => {
    exitCode = code ?? 1;
    enqueue(null); // signal end
  });

  while (true) {
    if (queue.length === 0) {
      await new Promise<void>((r) => {
        resolve = r;
      });
    }

    const item = queue.shift();
    if (item === null || item === undefined) break;
    yield item;
  }

  if (exitCode !== 0) {
    throw new CommandError(
      `命令退出码: ${exitCode}`,
      `${command} ${args.join(' ')}`,
      exitCode ?? 1,
    );
  }
}

/**
 * Execute command with shell=true and capture all output
 */
export async function execShell(
  command: string,
  options: ExecOptions = {},
): Promise<ExecResult> {
  return execCommand(command, { ...options });
}
