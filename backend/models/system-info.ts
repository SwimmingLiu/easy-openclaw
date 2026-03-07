// backend/models/system-info.ts
// System information models and helpers

import os from 'node:os';
import type { SystemInfo, OSInfo, PackageManager } from '../../shared/types.js';

/**
 * Get base OS info from Node.js process
 */
export function getBaseOSInfo(): Pick<OSInfo, 'platform' | 'release' | 'hostname'> {
  return {
    platform: process.platform as OSInfo['platform'],
    release: os.release(),
    hostname: os.hostname(),
  };
}

/**
 * Create empty SystemInfo placeholder
 */
export function createEmptySystemInfo(): SystemInfo {
  return {
    os: {
      platform: process.platform as OSInfo['platform'],
      release: os.release(),
      hostname: os.hostname(),
    },
    arch: process.arch,
    nodejs: null,
    npm: null,
    packageManager: 'unknown',
    openclaw: null,
  };
}

/**
 * Detect package manager from platform
 */
export function getDefaultPackageManager(): PackageManager {
  switch (process.platform) {
    case 'darwin':
      return 'homebrew';
    case 'win32':
      return 'winget';
    case 'linux':
      return 'apt'; // default, will be refined by detector
    default:
      return 'unknown';
  }
}

/**
 * Check if Node.js version satisfies minimum requirement (22+)
 */
export function isNodeVersionSatisfied(version: string): boolean {
  const parts = version.replace(/^v/, '').split('.');
  const major = parseInt(parts[0] ?? '0', 10);
  return major >= 22;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`;
}
