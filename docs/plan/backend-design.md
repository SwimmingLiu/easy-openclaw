# Easy OpenClaw 后端设计方案

> 版本: 1.0.0
> 更新时间: 2026-03-07
> 目标: 让不懂技术的用户能够"一键式"自动安装 OpenClaw

---

## 📋 目录

1. [设计目标](#1-设计目标)
2. [技术选型](#2-技术选型)
3. [整体架构](#3-整体架构)
4. [核心模块设计](#4-核心模块设计)
5. [API 设计](#5-api-设计)
6. [数据模型](#6-数据模型)
7. [安装流程](#7-安装流程)
8. [配置管理](#8-配置管理)
9. [错误处理](#9-错误处理)
10. [安全设计](#10-安全设计)

---

## 1. 设计目标

### 1.1 核心原则

| 原则 | 说明 |
|------|------|
| **零门槛** | 用户无需了解 Node.js、npm、终端命令 |
| **自动化** | 自动检测系统环境、自动安装依赖、自动配置 |
| **可视化** | 所有操作通过 GUI 完成，无需命令行 |
| **容错性** | 安装失败自动回滚，提供清晰的错误提示 |
| **跨平台** | 支持 macOS、Linux、Windows (原生 + WSL) |

### 1.2 目标用户画像

- **小白用户**: 完全不懂技术，只会双击安装
- **普通用户**: 知道基本电脑操作，但不会用终端
- **进阶用户**: 懂一些技术，但希望简化安装流程

### 1.3 功能边界

**✅ 必须实现:**
- 一键安装 OpenClaw 及所有依赖
- 自动检测系统环境 (OS、Node.js 版本、包管理器)
- GUI 配置 AI 模型 (16+ 提供商)
- GUI 配置消息渠道 (7 种渠道)
- 配置测试与验证

**❌ 不实现:**
- OpenClaw 核心功能 (由 OpenClaw 本体提供)
- 多用户管理
- 云端同步

---

## 2. 技术选型

### 2.1 核心技术栈

| 层级 | 技术 | 理由 |
|------|------|------|
| **运行时** | Node.js 22+ | 与 OpenClaw 一致，避免版本冲突 |
| **框架** | Fastify | 高性能、低开销、TypeScript 友好 |
| **桌面壳** | Electron | 跨平台桌面应用，一套代码三端运行 |
| **进程管理** | Node.js child_process | 执行 shell 命令 |
| **配置存储** | JSON + YAML | 与 OpenClaw 配置格式一致 |
| **日志** | Pino | 高性能结构化日志 |

### 2.2 为什么选择 Electron + Fastify

```
┌─────────────────────────────────────────────────────────┐
│                    Electron 应用                         │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐    IPC    ┌─────────────────────┐     │
│  │   Renderer  │ ◄──────► │     Main Process    │     │
│  │   (前端)     │          │                     │     │
│  │             │          │  ┌───────────────┐  │     │
│  │  React/Vue  │          │  │   Fastify     │  │     │
│  │  UI 组件    │          │  │   HTTP Server │  │     │
│  │             │          │  │   (localhost) │  │     │
│  └─────────────┘          │  └───────────────┘  │     │
│                           │         │           │     │
│                           │         ▼           │     │
│                           │  ┌───────────────┐  │     │
│                           │  │   Services    │  │     │
│                           │  │   (核心逻辑)   │  │     │
│                           │  └───────────────┘  │     │
│                           └─────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

**优势:**
- Fastify 提供 REST API，前端可以像调用后端一样操作
- Electron Main Process 与 Fastify 共享 Node.js 环境，可直接执行 shell
- 前后端分离，便于维护和测试

### 2.3 目录结构

```
easy-openclaw/
├── electron/                    # Electron 主进程
│   ├── main.ts                  # Electron 入口
│   ├── preload.ts               # 预加载脚本 (IPC 桥接)
│   └── ipc/                     # IPC 处理器
│       ├── installer.ts         # 安装相关 IPC
│       └── config.ts            # 配置相关 IPC
│
├── backend/                     # 后端核心
│   ├── server.ts                # Fastify 服务器入口
│   ├── routes/                  # API 路由
│   │   ├── system.ts            # 系统检测 API
│   │   ├── install.ts           # 安装 API
│   │   ├── models.ts            # AI 模型配置 API
│   │   └── channels.ts          # 渠道配置 API
│   │
│   ├── services/                # 业务逻辑层
│   │   ├── detector.ts          # 系统环境检测
│   │   ├── installer.ts         # 安装执行器
│   │   ├── model-config.ts      # 模型配置管理
│   │   ├── channel-config.ts    # 渠道配置管理
│   │   └── gateway.ts           # Gateway 管理
│   │
│   ├── executors/               # 命令执行器
│   │   ├── shell.ts             # Shell 命令执行
│   │   ├── npm.ts               # npm 命令封装
│   │   └── openclaw-cli.ts      # OpenClaw CLI 封装
│   │
│   ├── models/                  # 数据模型
│   │   ├── system-info.ts       # 系统信息
│   │   ├── ai-provider.ts       # AI 提供商配置
│   │   └── channel.ts           # 渠道配置
│   │
│   └── utils/                   # 工具函数
│       ├── logger.ts            # 日志工具
│       ├── validator.ts         # 输入验证
│       └── error.ts             # 错误处理
│
├── frontend/                    # 前端 (React/Vue)
│   └── ... (见前端设计文档)
│
└── shared/                      # 共享类型定义
    └── types.ts                 # TypeScript 类型
```

---

## 3. 整体架构

### 3.1 系统架构图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Easy OpenClaw (Electron App)                    │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            │                         │                         │
            ▼                         ▼                         ▼
    ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
    │   Renderer    │        │ Main Process  │        │  Fastify API  │
    │   (前端 UI)    │◄─IPC──►│  (Electron)   │◄─HTTP─►│  (后端服务)    │
    │               │        │               │        │               │
    │ React + UI    │        │ 窗口管理      │        │ REST API      │
    │ 组件库        │        │ IPC 桥接      │        │ 业务逻辑      │
    └───────────────┘        └───────────────┘        └───────────────┘
                                        │                       │
                                        └───────────┬───────────┘
                                                    ▼
                                        ┌───────────────────────┐
                                        │      Services 层       │
                                        ├───────────────────────┤
                                        │ • DetectorService     │
                                        │ • InstallerService    │
                                        │ • ModelConfigService  │
                                        │ • ChannelConfigService│
                                        │ • GatewayService      │
                                        └───────────────────────┘
                                                    │
                    ┌───────────────────────────────┼───────────────────┐
                    │                               │                   │
                    ▼                               ▼                   ▼
            ┌───────────────┐            ┌───────────────┐    ┌───────────────┐
            │ ShellExecutor │            │  NpmExecutor  │    │ OpenClawCLI   │
            │ (执行命令)     │            │  (npm 命令)   │    │ (openclaw)    │
            └───────────────┘            └───────────────┘    └───────────────┘
                    │                               │                   │
                    └───────────────────────────────┴───────────────────┘
                                                    │
                                                    ▼
                                        ┌───────────────────────┐
                                        │    操作系统 / 外部     │
                                        ├───────────────────────┤
                                        │ • 系统包管理器         │
                                        │ • Node.js / npm       │
                                        │ • OpenClaw CLI        │
                                        │ • ~/.openclaw/        │
                                        └───────────────────────┘
```

### 3.2 数据流

```
用户操作 (前端)
      │
      ▼
IPC 调用 (Electron Preload)
      │
      ▼
Fastify API (HTTP)
      │
      ▼
Service 层 (业务逻辑)
      │
      ├──► Executor 层 (执行命令)
      │         │
      │         ▼
      │    Shell / OpenClaw CLI
      │
      └──► 配置文件 (~/.openclaw/)
```

---

## 4. 核心模块设计

### 4.1 DetectorService - 系统检测服务

**职责:** 检测系统环境、依赖版本、安装状态

```typescript
// backend/services/detector.ts

export class DetectorService {
  /**
   * 获取完整系统信息
   */
  async getSystemInfo(): Promise<SystemInfo> {
    return {
      os: await this.detectOS(),
      arch: process.arch,
      nodejs: await this.detectNodeJS(),
      npm: await this.detectNpm(),
      packageManager: await this.detectPackageManager(),
      openclaw: await this.detectOpenClaw(),
    };
  }

  /**
   * 检测操作系统
   */
  private async detectOS(): Promise<OSInfo> {
    const platform = process.platform; // 'darwin' | 'win32' | 'linux'
    const release = os.release();
    const hostname = os.hostname();

    // 检测 Linux 发行版
    if (platform === 'linux') {
      const distro = await this.detectLinuxDistro();
      return { platform, distro, release, hostname };
    }

    // 检测 WSL
    if (platform === 'linux' && await this.isWSL()) {
      return { platform: 'wsl', distro: await this.detectLinuxDistro(), release };
    }

    return { platform, release, hostname };
  }

  /**
   * 检测 Node.js 版本
   */
  private async detectNodeJS(): Promise<NodeJSInfo | null> {
    try {
      const { stdout } = await execAsync('node -v');
      const version = stdout.trim().replace('v', '');
      const satisfied = semver.gte(version, '22.0.0');
      return { version, satisfied, path: await this.which('node') };
    } catch {
      return null;
    }
  }

  /**
   * 检测 OpenClaw 安装状态
   */
  private async detectOpenClaw(): Promise<OpenClawInfo | null> {
    try {
      const { stdout: version } = await execAsync('openclaw --version');
      const { stdout: status } = await execAsync('openclaw status --json');
      const configExists = fs.existsSync(path.join(os.homedir(), '.openclaw', 'openclaw.json'));

      return {
        installed: true,
        version: version.trim(),
        gatewayRunning: JSON.parse(status).running,
        configExists,
      };
    } catch {
      return { installed: false };
    }
  }
}
```

### 4.2 InstallerService - 安装服务

**职责:** 执行 OpenClaw 及依赖的安装

```typescript
// backend/services/installer.ts

export class InstallerService {
  private eventEmitter = new EventEmitter();

  /**
   * 执行完整安装流程
   * 返回事件流供前端实时显示进度
   */
  async *install(options: InstallOptions): AsyncGenerator<InstallEvent> {
    const steps: InstallStep[] = [
      { id: 'check-root', name: '检查权限', fn: () => this.checkPermissions() },
      { id: 'install-nodejs', name: '安装 Node.js', fn: () => this.installNodeJS(options.nodejs) },
      { id: 'install-npm', name: '检查 npm', fn: () => this.checkNpm() },
      { id: 'install-openclaw', name: '安装 OpenClaw', fn: () => this.installOpenClaw() },
      { id: 'create-config', name: '创建配置', fn: () => this.createConfigDir() },
      { id: 'verify', name: '验证安装', fn: () => this.verifyInstallation() },
    ];

    for (const step of steps) {
      yield { type: 'step-start', step: step.id, name: step.name };

      try {
        const result = await step.fn();
        yield { type: 'step-complete', step: step.id, result };
      } catch (error) {
        yield { type: 'step-error', step: step.id, error: error.message };
        throw error; // 中断安装
      }
    }

    yield { type: 'install-complete' };
  }

  /**
   * 安装 Node.js
   */
  private async installNodeJS(method: 'auto' | 'nvm' | 'official'): Promise<void> {
    const os = process.platform;

    if (os === 'darwin') {
      // macOS: 优先使用 Homebrew
      await this.execWithProgress('brew install node@22');
    } else if (os === 'linux') {
      // Linux: 使用 NodeSource
      await this.execWithProgress(`
        curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - &&
        sudo apt-get install -y nodejs
      `);
    } else if (os === 'win32') {
      // Windows: 下载官方安装包
      const installerUrl = 'https://nodejs.org/dist/v22.11.0/node-v22.11.0-x64.msi';
      await this.downloadAndRunInstaller(installerUrl);
    }
  }

  /**
   * 安装 OpenClaw
   */
  private async installOpenClaw(): Promise<void> {
    await this.execWithProgress('npm install -g openclaw@latest');
  }

  /**
   * 带进度输出的命令执行
   */
  private async execWithProgress(command: string): Promise<void> {
    const child = spawn(command, [], { shell: true });

    child.stdout.on('data', (data) => {
      this.eventEmitter.emit('progress', data.toString());
    });

    child.stderr.on('data', (data) => {
      this.eventEmitter.emit('progress', data.toString());
    });

    return new Promise((resolve, reject) => {
      child.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Command failed with code ${code}`));
      });
    });
  }
}
```

### 4.3 ModelConfigService - 模型配置服务

**职责:** 管理 AI 模型提供商配置

```typescript
// backend/services/model-config.ts

export class ModelConfigService {
  private configPath = path.join(os.homedir(), '.openclaw', 'openclaw.json');
  private envPath = path.join(os.homedir(), '.openclaw', 'env');

  /**
   * 获取支持的 AI 提供商列表
   */
  getSupportedProviders(): AIProvider[] {
    return [
      {
        id: 'anthropic',
        name: 'Anthropic Claude',
        icon: '🟣',
        description: '最强大的 AI 助手',
        models: [
          { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5', recommended: true },
          { id: 'claude-opus-4-5-20251101', name: 'Claude Opus 4.5' },
          { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5' },
        ],
        getKeyUrl: 'https://console.anthropic.com/',
      },
      {
        id: 'openai',
        name: 'OpenAI GPT',
        icon: '🟢',
        description: 'GPT 系列模型',
        models: [
          { id: 'gpt-5', name: 'GPT-5', recommended: true },
          { id: 'gpt-4o', name: 'GPT-4o' },
          { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
        ],
        getKeyUrl: 'https://platform.openai.com/',
        supportsCustomUrl: true,
      },
      // ... 其他 16+ 提供商
    ];
  }

  /**
   * 配置 AI 提供商
   */
  async configureProvider(config: ProviderConfig): Promise<void> {
    const { providerId, apiKey, baseUrl, model } = config;

    // 1. 写入环境变量
    await this.updateEnvFile(providerId, apiKey, baseUrl);

    // 2. 更新 openclaw.json
    if (baseUrl) {
      // 自定义 Provider 模式
      await this.configureCustomProvider(providerId, apiKey, baseUrl, model);
    } else {
      // 标准 Provider 模式
      await this.configureStandardProvider(providerId, model);
    }
  }

  /**
   * 配置自定义 Provider (支持第三方 API 代理)
   */
  private async configureCustomProvider(
    providerId: string,
    apiKey: string,
    baseUrl: string,
    model: string
  ): Promise<void> {
    const config = await this.loadConfig();

    // 注册自定义 Provider
    config.models.providers[`${providerId}-custom`] = {
      baseUrl,
      apiKey, // 或从环境变量读取
      models: [
        {
          id: model,
          api: this.getApiType(providerId),
          contextWindow: 200000,
          maxTokens: 8192,
        },
      ],
    };

    // 设置为默认模型
    config.models.default = `${providerId}-custom/${model}`;

    await this.saveConfig(config);
  }

  /**
   * 测试 API 连接
   */
  async testConnection(config: ProviderConfig): Promise<TestResult> {
    try {
      const result = await execAsync('openclaw agent --local --message "Say OK"', {
        env: {
          ...process.env,
          [this.getApiKeyEnvName(config.providerId)]: config.apiKey,
          ...(config.baseUrl && { [this.getBaseUrlEnvName(config.providerId)]: config.baseUrl }),
        },
      });

      return { success: true, message: 'API 连接成功' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
```

### 4.4 ChannelConfigService - 渠道配置服务

**职责:** 管理消息渠道配置

```typescript
// backend/services/channel-config.ts

export class ChannelConfigService {
  /**
   * 获取支持的渠道列表
   */
  getSupportedChannels(): Channel[] {
    return [
      {
        id: 'telegram',
        name: 'Telegram',
        icon: '📨',
        description: 'Telegram 机器人',
        configFields: [
          { id: 'token', label: 'Bot Token', type: 'text', required: true },
          { id: 'userId', label: 'User ID', type: 'text', required: true },
        ],
        setupGuide: '...',
      },
      {
        id: 'discord',
        name: 'Discord',
        icon: '🎮',
        description: 'Discord 机器人',
        configFields: [
          { id: 'token', label: 'Bot Token', type: 'text', required: true },
          { id: 'channelId', label: '频道 ID', type: 'text', required: true },
        ],
        setupGuide: '...',
      },
      // ... 其他渠道
    ];
  }

  /**
   * 配置渠道
   */
  async configureChannel(channelId: string, config: Record<string, string>): Promise<void> {
    // 1. 启用插件
    await execAsync(`openclaw plugins enable ${channelId}`);

    // 2. 更新 plugins.allow
    await this.ensurePluginAllowed(channelId);

    // 3. 添加渠道配置
    await execAsync(`openclaw channels add --channel ${channelId} --token "${config.token}"`);

    // 4. 重启 Gateway
    await this.restartGateway();
  }

  /**
   * 测试渠道配置
   */
  async testChannel(channelId: string, config: Record<string, string>): Promise<TestResult> {
    switch (channelId) {
      case 'telegram':
        return this.testTelegram(config.token, config.userId);
      case 'discord':
        return this.testDiscord(config.token, config.channelId);
      // ... 其他渠道
    }
  }

  /**
   * 测试 Telegram
   */
  private async testTelegram(token: string, userId: string): Promise<TestResult> {
    try {
      // 验证 Token
      const botInfo = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const data = await botInfo.json();

      if (!data.ok) {
        return { success: false, message: 'Bot Token 无效' };
      }

      // 发送测试消息
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: userId,
          text: '🦞 OpenClaw 配置成功！',
        }),
      });

      return { success: true, message: `Bot @${data.result.username} 配置成功` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
```

### 4.5 GatewayService - Gateway 管理服务

**职责:** 管理 OpenClaw Gateway 服务

```typescript
// backend/services/gateway.ts

export class GatewayService {
  /**
   * 启动 Gateway
   */
  async start(): Promise<void> {
    await execAsync('openclaw gateway start');
  }

  /**
   * 停止 Gateway
   */
  async stop(): Promise<void> {
    await execAsync('openclaw gateway stop');
  }

  /**
   * 重启 Gateway
   */
  async restart(): Promise<void> {
    await execAsync('openclaw gateway restart');
  }

  /**
   * 获取 Gateway 状态
   */
  async getStatus(): Promise<GatewayStatus> {
    try {
      const { stdout } = await execAsync('openclaw status --json');
      return JSON.parse(stdout);
    } catch {
      return { running: false };
    }
  }

  /**
   * 获取 Dashboard URL (带 token)
   */
  async getDashboardUrl(): Promise<string> {
    const { stdout } = await execAsync('openclaw dashboard --no-open');
    return stdout.trim();
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      await execAsync('openclaw health');
      return true;
    } catch {
      return false;
    }
  }
}
```

---

## 5. API 设计

### 5.1 REST API 端点

#### 系统检测

```yaml
GET /api/system/info
  描述: 获取完整系统信息
  响应: SystemInfo

GET /api/system/check-prerequisites
  描述: 检查安装前置条件
  响应: PrerequisiteCheck[]
```

#### 安装

```yaml
POST /api/install/start
  描述: 开始安装
  请求: { nodejsMethod: 'auto' | 'nvm' | 'official' }
  响应: { installId: string }

GET /api/install/:id/events
  描述: 获取安装事件流 (SSE)
  响应: SSE 流 InstallEvent

POST /api/install/cancel
  描述: 取消安装
  响应: { success: boolean }
```

#### AI 模型配置

```yaml
GET /api/models/providers
  描述: 获取支持的 AI 提供商列表
  响应: AIProvider[]

GET /api/models/current
  描述: 获取当前配置的模型
  响应: CurrentModelConfig

POST /api/models/configure
  描述: 配置 AI 提供商
  请求: ProviderConfig
  响应: { success: boolean }

POST /api/models/test
  描述: 测试 API 连接
  请求: ProviderConfig
  响应: TestResult
```

#### 渠道配置

```yaml
GET /api/channels/supported
  描述: 获取支持的渠道列表
  响应: Channel[]

GET /api/channels/current
  描述: 获取当前配置的渠道
  响应: CurrentChannelConfig[]

POST /api/channels/:id/configure
  描述: 配置渠道
  请求: ChannelConfig
  响应: { success: boolean }

POST /api/channels/:id/test
  描述: 测试渠道配置
  请求: ChannelConfig
  响应: TestResult

DELETE /api/channels/:id
  描述: 删除渠道配置
  响应: { success: boolean }
```

#### Gateway 管理

```yaml
POST /api/gateway/start
  描述: 启动 Gateway
  响应: { success: boolean }

POST /api/gateway/stop
  描述: 停止 Gateway
  响应: { success: boolean }

POST /api/gateway/restart
  描述: 重启 Gateway
  响应: { success: boolean }

GET /api/gateway/status
  描述: 获取 Gateway 状态
  响应: GatewayStatus

GET /api/gateway/dashboard-url
  描述: 获取 Dashboard URL
  响应: { url: string }
```

### 5.2 API 响应示例

#### GET /api/system/info

```json
{
  "os": {
    "platform": "darwin",
    "release": "23.0.0",
    "hostname": "MacBook-Pro"
  },
  "arch": "arm64",
  "nodejs": {
    "version": "22.11.0",
    "satisfied": true,
    "path": "/usr/local/bin/node"
  },
  "npm": {
    "version": "10.9.0",
    "path": "/usr/local/bin/npm"
  },
  "packageManager": "homebrew",
  "openclaw": {
    "installed": true,
    "version": "1.2.0",
    "gatewayRunning": true,
    "configExists": true
  }
}
```

#### POST /api/install/start 响应流

```
event: step-start
data: {"step": "check-root", "name": "检查权限"}

event: progress
data: {"step": "check-root", "output": "检测到 macOS 系统..."}

event: step-complete
data: {"step": "check-root", "result": {"hasRoot": false, "canSudo": true}}

event: step-start
data: {"step": "install-nodejs", "name": "安装 Node.js"}

event: progress
data: {"step": "install-nodejs", "output": "已安装 Node.js 22.11.0"}

event: step-complete
data: {"step": "install-nodejs", "result": {"version": "22.11.0"}}

...

event: install-complete
data: {"success": true}
```

---

## 6. 数据模型

### 6.1 TypeScript 类型定义

```typescript
// shared/types.ts

// ==================== 系统 ====================

export interface SystemInfo {
  os: OSInfo;
  arch: string;
  nodejs: NodeJSInfo | null;
  npm: NpmInfo | null;
  packageManager: PackageManager;
  openclaw: OpenClawInfo | null;
}

export interface OSInfo {
  platform: 'darwin' | 'linux' | 'win32' | 'wsl';
  distro?: string;  // Linux 发行版
  release: string;
  hostname: string;
}

export interface NodeJSInfo {
  version: string;
  satisfied: boolean;  // 是否满足 22+ 要求
  path: string;
}

export interface OpenClawInfo {
  installed: boolean;
  version?: string;
  gatewayRunning?: boolean;
  configExists?: boolean;
}

// ==================== 安装 ====================

export interface InstallOptions {
  nodejsMethod: 'auto' | 'nvm' | 'official';
  skipOnboard?: boolean;
}

export type InstallEvent =
  | { type: 'step-start'; step: string; name: string }
  | { type: 'progress'; step: string; output: string }
  | { type: 'step-complete'; step: string; result: any }
  | { type: 'step-error'; step: string; error: string }
  | { type: 'install-complete'; success: boolean };

// ==================== AI 模型 ====================

export interface AIProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  models: AIModel[];
  getKeyUrl: string;
  supportsCustomUrl?: boolean;
  apiTypes?: string[];  // ['openai-responses', 'openai-completions']
}

export interface AIModel {
  id: string;
  name: string;
  recommended?: boolean;
}

export interface ProviderConfig {
  providerId: string;
  apiKey: string;
  baseUrl?: string;
  apiType?: string;  // 仅 OpenAI 需要
  model: string;
}

export interface TestResult {
  success: boolean;
  message: string;
}

// ==================== 渠道 ====================

export interface Channel {
  id: string;
  name: string;
  icon: string;
  description: string;
  configFields: ConfigField[];
  setupGuide: string;
}

export interface ConfigField {
  id: string;
  label: string;
  type: 'text' | 'password';
  required: boolean;
  placeholder?: string;
}

export interface ChannelConfig {
  channelId: string;
  fields: Record<string, string>;
}

// ==================== Gateway ====================

export interface GatewayStatus {
  running: boolean;
  pid?: number;
  port?: number;
  uptime?: number;
}
```

---

## 7. 安装流程

### 7.1 安装流程图

```
用户点击"开始安装"
        │
        ▼
┌───────────────────┐
│  检测系统环境      │
│  DetectorService  │
└───────────────────┘
        │
        ▼
┌───────────────────┐     不满足
│  检查前置条件      │ ──────────► 显示缺少什么，提供安装建议
│  Node.js 22+?     │
└───────────────────┘
        │ 满足
        ▼
┌───────────────────┐
│  执行安装步骤      │
│  (SSE 实时推送进度)│
└───────────────────┘
        │
        ├── Step 1: 安装 Node.js (如需要)
        ├── Step 2: 安装 OpenClaw
        ├── Step 3: 创建配置目录
        └── Step 4: 验证安装
        │
        ▼
┌───────────────────┐
│  显示配置向导      │
│  (AI 模型配置)     │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  启动 Gateway      │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  打开 Dashboard    │
│  (或显示配置成功)  │
└───────────────────┘
```

### 7.2 错误恢复机制

```typescript
// 安装失败时自动回滚

export class InstallerService {
  private rollbackSteps: (() => Promise<void>)[] = [];

  async install() {
    try {
      await this.step1();
      this.rollbackSteps.push(() => this.rollbackStep1());

      await this.step2();
      this.rollbackSteps.push(() => this.rollbackStep2());

      // ...
    } catch (error) {
      // 执行回滚
      await this.rollback();
      throw error;
    }
  }

  private async rollback() {
    // 从后往前执行回滚
    for (const rollback of this.rollbackSteps.reverse()) {
      try {
        await rollback();
      } catch (e) {
        // 记录但继续
        logger.error('Rollback failed', e);
      }
    }
  }
}
```

---

## 8. 配置管理

### 8.1 配置文件映射

| OpenClaw 配置 | Easy OpenClaw 管理 |
|---------------|-------------------|
| `~/.openclaw/openclaw.json` | 核心配置 (模型、插件、渠道) |
| `~/.openclaw/env` | 环境变量 (API Keys) |
| `~/.openclaw/config.yaml` | 用户配置 (可选) |

### 8.2 配置同步策略

```typescript
export class ConfigManager {
  /**
   * 读取配置 (合并多个来源)
   */
  async loadConfig(): Promise<MergedConfig> {
    const openclawJson = await this.loadOpenClawJson();
    const env = await this.loadEnvFile();
    const yaml = await this.loadYamlConfig();

    return {
      models: openclawJson.models,
      channels: openclawJson.channels,
      plugins: openclawJson.plugins,
      env: this.parseEnv(env),
      ...yaml,
    };
  }

  /**
   * 保存配置 (分别写入)
   */
  async saveConfig(config: Partial<MergedConfig>): Promise<void> {
    if (config.models) {
      await this.updateOpenClawJson({ models: config.models });
    }

    if (config.env) {
      await this.updateEnvFile(config.env);
    }
  }
}
```

---

## 9. 错误处理

### 9.1 错误分类

| 错误类型 | 示例 | 处理方式 |
|---------|------|---------|
| **系统错误** | 权限不足、磁盘空间不足 | 显示明确提示，提供解决方案 |
| **网络错误** | npm 下载失败、API 连接失败 | 提供重试按钮，建议检查网络 |
| **配置错误** | API Key 格式错误 | 即时验证，高亮错误字段 |
| **未知错误** | 其他异常 | 记录日志，显示通用错误信息 |

### 9.2 错误处理示例

```typescript
// 统一错误处理中间件

app.setErrorHandler((error, request, reply) => {
  logger.error('Unhandled error', error);

  // 判断错误类型
  if (error.code === 'ENOENT') {
    return reply.status(404).send({
      error: 'NOT_FOUND',
      message: '文件或目录不存在',
      suggestion: '请检查路径是否正确',
    });
  }

  if (error.code === 'EACCES') {
    return reply.status(403).send({
      error: 'PERMISSION_DENIED',
      message: '权限不足',
      suggestion: '请尝试以管理员身份运行',
    });
  }

  if (error.message.includes('npm')) {
    return reply.status(500).send({
      error: 'NPM_ERROR',
      message: 'npm 命令执行失败',
      suggestion: '请检查网络连接，或尝试使用镜像源',
    });
  }

  // 通用错误
  return reply.status(500).send({
    error: 'INTERNAL_ERROR',
    message: '发生未知错误',
    suggestion: '请查看日志或联系支持',
  });
});
```

---

## 10. 安全设计

### 10.1 敏感信息处理

```typescript
// API Key 存储

export class SecretManager {
  private keytar: Keytar;  // 使用系统密钥链

  /**
   * 存储 API Key (加密)
   */
  async storeApiKey(providerId: string, apiKey: string): Promise<void> {
    await this.keytar.setPassword('easy-openclaw', providerId, apiKey);
  }

  /**
   * 读取 API Key
   */
  async getApiKey(providerId: string): Promise<string | null> {
    return this.keytar.getPassword('easy-openclaw', providerId);
  }

  /**
   * 删除 API Key
   */
  async deleteApiKey(providerId: string): Promise<void> {
    await this.keytar.deletePassword('easy-openclaw', providerId);
  }
}
```

### 10.2 API Key 脱敏显示

```typescript
export function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 12) {
    return '****';
  }
  return `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`;
}
```

### 10.3 配置文件权限

```typescript
// 创建配置文件时设置权限

async createConfigDir(): Promise<void> {
  const configDir = path.join(os.homedir(), '.openclaw');

  await fs.mkdir(configDir, { recursive: true, mode: 0o700 });
  await fs.mkdir(path.join(configDir, 'logs'), { mode: 0o700 });
  await fs.mkdir(path.join(configDir, 'data'), { mode: 0o700 });

  // 环境变量文件仅所有者可读写
  const envPath = path.join(configDir, 'env');
  if (await fs.exists(envPath)) {
    await fs.chmod(envPath, 0o600);
  }
}
```

---

## 附录

### A. 依赖列表

```json
{
  "dependencies": {
    "fastify": "^5.0.0",
    "pino": "^9.0.0",
    "pino-pretty": "^11.0.0",
    "semver": "^7.6.0",
    "keytar": "^7.9.0",
    "yaml": "^2.5.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/node": "^22.0.0",
    "vitest": "^2.0.0"
  }
}
```

### B. 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `EASY_OPENCLAW_PORT` | Fastify 服务端口 | `18790` |
| `EASY_OPENCLAW_LOG_LEVEL` | 日志级别 | `info` |
| `EASY_OPENCLAW_CONFIG_DIR` | 配置目录 | `~/.openclaw` |

---

**文档版本**: 1.0
**最后更新**: 2026-03-07
