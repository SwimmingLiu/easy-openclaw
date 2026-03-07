// backend/services/detector.ts
// System environment detection service

import os from 'node:os';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execCommand, which } from '../executors/shell.js';
import { createChildLogger } from '../utils/logger.js';
import { isNodeVersionSatisfied } from '../models/system-info.js';
import type {
  SystemInfo,
  OSInfo,
  NodeJSInfo,
  NpmInfo,
  PackageManager,
  OpenClawInfo,
  PrerequisiteCheck,
} from '../../shared/types.js';

const log = createChildLogger('detector');

export class DetectorService {
  /**
   * Get complete system information
   */
  async getSystemInfo(): Promise<SystemInfo> {
    log.info('Detecting system information');

    const [osInfo, nodejs, npm, packageManager, openclaw] = await Promise.all([
      this.detectOS(),
      this.detectNodeJS(),
      this.detectNpm(),
      this.detectPackageManager(),
      this.detectOpenClaw(),
    ]);

    return {
      os: osInfo,
      arch: process.arch,
      nodejs,
      npm,
      packageManager,
      openclaw,
    };
  }

  /**
   * Check installation prerequisites
   */
  async checkPrerequisites(): Promise<PrerequisiteCheck[]> {
    const systemInfo = await this.getSystemInfo();
    const checks: PrerequisiteCheck[] = [];

    // Check OS support
    const supportedPlatforms = ['darwin', 'linux', 'win32', 'wsl'];
    checks.push({
      id: 'os-support',
      name: '操作系统支持',
      satisfied: supportedPlatforms.includes(systemInfo.os.platform),
      message: `当前系统: ${systemInfo.os.platform} ${systemInfo.os.release}`,
      suggestion: '请使用 macOS、Linux 或 Windows 系统',
    });

    // Check Node.js
    if (systemInfo.nodejs) {
      checks.push({
        id: 'nodejs-version',
        name: 'Node.js 版本',
        satisfied: systemInfo.nodejs.satisfied,
        message: `已安装 Node.js ${systemInfo.nodejs.version}${systemInfo.nodejs.satisfied ? ' ✓' : ' (需要 22+)'}`,
        suggestion: systemInfo.nodejs.satisfied
          ? undefined
          : '请升级到 Node.js 22 或更高版本',
      });
    } else {
      checks.push({
        id: 'nodejs-version',
        name: 'Node.js 版本',
        satisfied: false,
        message: '未检测到 Node.js',
        suggestion: '请安装 Node.js 22 或更高版本',
      });
    }

    // Check npm
    if (systemInfo.npm) {
      checks.push({
        id: 'npm-available',
        name: 'npm 可用',
        satisfied: true,
        message: `npm ${systemInfo.npm.version} 已可用`,
      });
    } else {
      checks.push({
        id: 'npm-available',
        name: 'npm 可用',
        satisfied: false,
        message: '未检测到 npm',
        suggestion: '安装 Node.js 后 npm 会自动安装',
      });
    }

    // Check network (can reach npm registry)
    const networkOk = await this.checkNetworkAccess();
    checks.push({
      id: 'network-access',
      name: '网络连接',
      satisfied: networkOk,
      message: networkOk ? '网络连接正常' : '无法连接到 npm 注册表',
      suggestion: networkOk ? undefined : '请检查网络连接，或配置 npm 镜像源',
    });

    // Check disk space (need at least 500MB)
    const diskOk = await this.checkDiskSpace(500 * 1024 * 1024);
    checks.push({
      id: 'disk-space',
      name: '磁盘空间',
      satisfied: diskOk,
      message: diskOk ? '磁盘空间充足' : '磁盘空间不足 (需要 500MB+)',
      suggestion: diskOk ? undefined : '请释放磁盘空间后重试',
    });

    return checks;
  }

  /**
   * Detect operating system details
   */
  async detectOS(): Promise<OSInfo> {
    const platform = process.platform;
    const release = os.release();
    const hostname = os.hostname();

    // Detect WSL
    if (platform === 'linux' && (await this.isWSL())) {
      const distro = await this.detectLinuxDistro();
      return { platform: 'wsl', distro, release, hostname };
    }

    // Detect Linux distro
    if (platform === 'linux') {
      const distro = await this.detectLinuxDistro();
      return { platform: 'linux', distro, release, hostname };
    }

    return {
      platform: platform as OSInfo['platform'],
      release,
      hostname,
    };
  }

  /**
   * Detect Node.js version and path
   */
  async detectNodeJS(): Promise<NodeJSInfo | null> {
    try {
      const { stdout } = await execCommand('node -v');
      const version = stdout.trim().replace(/^v/, '');
      const nodePath = await which('node');

      return {
        version,
        satisfied: isNodeVersionSatisfied(version),
        path: nodePath ?? 'node',
      };
    } catch {
      return null;
    }
  }

  /**
   * Detect npm version and path
   */
  async detectNpm(): Promise<NpmInfo | null> {
    try {
      const { stdout } = await execCommand('npm -v');
      const version = stdout.trim();
      const npmPath = await which('npm');

      return {
        version,
        path: npmPath ?? 'npm',
      };
    } catch {
      return null;
    }
  }

  /**
   * Detect the system package manager
   */
  async detectPackageManager(): Promise<PackageManager> {
    if (process.platform === 'darwin') {
      const hasBrew = await which('brew');
      if (hasBrew) return 'homebrew';
    }

    if (process.platform === 'linux') {
      const [hasApt, hasYum, hasDnf, hasPacman] = await Promise.all([
        which('apt-get'),
        which('yum'),
        which('dnf'),
        which('pacman'),
      ]);
      if (hasDnf) return 'dnf';
      if (hasYum) return 'yum';
      if (hasApt) return 'apt';
      if (hasPacman) return 'pacman';
    }

    if (process.platform === 'win32') {
      const hasWinget = await which('winget');
      if (hasWinget) return 'winget';
      const hasChoco = await which('choco');
      if (hasChoco) return 'choco';
    }

    return 'unknown';
  }

  /**
   * Detect OpenClaw installation status
   */
  async detectOpenClaw(): Promise<OpenClawInfo | null> {
    try {
      const { stdout: versionOut } = await execCommand('openclaw --version');
      const version = versionOut.trim();

      let gatewayRunning = false;
      try {
        const { stdout: statusOut } = await execCommand('openclaw status --json');
        const status = JSON.parse(statusOut) as { running?: boolean };
        gatewayRunning = status.running ?? false;
      } catch {
        // ignore status check failure
      }

      const configDir = process.env['EASY_OPENCLAW_CONFIG_DIR'] ?? path.join(os.homedir(), '.openclaw');
      let configExists = false;
      try {
        await fs.access(path.join(configDir, 'openclaw.json'));
        configExists = true;
      } catch {
        // config doesn't exist
      }

      return {
        installed: true,
        version,
        gatewayRunning,
        configExists,
      };
    } catch {
      return { installed: false };
    }
  }

  /**
   * Check if running in WSL
   */
  private async isWSL(): Promise<boolean> {
    try {
      const proc = await fs.readFile('/proc/version', 'utf8');
      return proc.toLowerCase().includes('microsoft');
    } catch {
      return false;
    }
  }

  /**
   * Detect Linux distribution
   */
  private async detectLinuxDistro(): Promise<string> {
    try {
      const osRelease = await fs.readFile('/etc/os-release', 'utf8');
      const nameMatch = /^NAME="?([^"\n]+)"?/m.exec(osRelease);
      return nameMatch?.[1] ?? 'Unknown Linux';
    } catch {
      try {
        const { stdout } = await execCommand('lsb_release -d -s');
        return stdout.trim();
      } catch {
        return 'Unknown Linux';
      }
    }
  }

  /**
   * Check network access to npm registry
   */
  private async checkNetworkAccess(): Promise<boolean> {
    try {
      await execCommand('npm ping --registry https://registry.npmjs.org', { timeout: 10_000 });
      return true;
    } catch {
      // Try China mirror
      try {
        await execCommand('npm ping --registry https://registry.npmmirror.com', { timeout: 10_000 });
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * Check available disk space
   */
  private async checkDiskSpace(requiredBytes: number): Promise<boolean> {
    try {
      if (process.platform !== 'win32') {
        const { stdout } = await execCommand(`df -B1 ${os.homedir()}`);
        const lines = stdout.trim().split('\n');
        const dataLine = lines[1] ?? lines[0] ?? '';
        const parts = dataLine.trim().split(/\s+/);
        const available = parseInt(parts[3] ?? '0', 10);
        return available >= requiredBytes;
      }
      return true; // Skip check on Windows for now
    } catch {
      return true; // Assume enough space if check fails
    }
  }
}
