# macOS 安装指南

本指南介绍如何在 macOS 系统上安装 OpenClaw。支持 macOS 12 Monterey 及更高版本，兼容
Apple Silicon（M1/M2/M3）和 Intel 芯片。

## 系统要求

安装 OpenClaw 前，确保你的系统满足以下要求：

- **操作系统**：macOS 12 Monterey 或更高版本
- **Node.js**：22 或更高版本（安装脚本会自动处理）
- **内存**：至少 1GB 可用 RAM
- **磁盘空间**：至少 500MB 可用空间

## 第一步：安装 Node.js 22+

OpenClaw 需要 Node.js 22 或更高版本。安装脚本会自动检测并安装，如使用其他安装方式则需
手动安装。

### 方式 A：使用 Homebrew（推荐）

[Homebrew](https://brew.sh) 是 macOS 上最流行的包管理器：

```bash
brew install node@22
```

如果 Homebrew 未安装，先运行：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 方式 B：官方安装包

从 Node.js 官方网站下载 macOS 安装包：

1. 访问 [nodejs.org](https://nodejs.org/en/download/)
2. 下载 macOS 版本的 `.pkg` 安装包（选择 22.x LTS）
3. 双击安装包并按提示完成安装

### 方式 C：使用 nvm

如果你需要管理多个 Node.js 版本：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.zshrc
nvm install 22
nvm use 22
nvm alias default 22
```

### 验证 Node.js 安装

```bash
node -v   # 应显示 v22.x.x 或更高
npm -v    # 应显示 npm 版本
```

## 第二步：安装 OpenClaw

### 方式 A：macOS 应用（推荐，提供图形界面）

OpenClaw 提供原生 macOS 应用，集成菜单栏和 GUI 控制面板：

1. 从 [OpenClaw 官网](https://openclaw.ai/download) 下载 `OpenClaw.app`
2. 将 `OpenClaw.app` 拖入 **Applications** 文件夹
3. 双击启动应用并按提示完成 onboarding 流程

安装完成后，OpenClaw 图标会出现在菜单栏，可以随时访问控制面板。

### 方式 B：安装脚本

命令行安装脚本自动处理所有依赖和配置：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

如果你不需要交互式配置向导：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

### 方式 C：npm 安装

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

### 方式 D：pnpm 安装

```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```

> **提示**：运行 `pnpm approve-builds -g` 时，选择 `openclaw`、`node-llama-cpp`、`sharp`
> 等需要编译的包以授权构建脚本。

### 方式 E：从源码构建

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build
pnpm build
pnpm link --global
openclaw onboard --install-daemon
```

## macOS 特殊配置

### 权限授权

首次启动 OpenClaw 时，macOS 会请求以下权限：

- **辅助功能**：用于键盘快捷键功能
- **屏幕录制**（可选）：用于截图功能
- **通知**：用于消息通知

在弹出的对话框中点击 **好** 授权。如需手动管理权限，进入 **系统设置 > 隐私与安全性**。

### 菜单栏应用

OpenClaw.app 安装后会在菜单栏显示图标（🦞）。点击图标可以：

- 打开控制面板
- 查看 Gateway 状态
- 快速访问配置

### Gatekeeper 警告处理

如果 macOS 提示 "无法验证开发者"：

1. 进入 **系统设置 > 隐私与安全性**
2. 在 "安全性" 部分找到 OpenClaw 的提示
3. 点击 **仍要打开**

## 第三步：中国大陆网络优化

如果你在中国大陆，网络访问可能受限。以下方案可以帮助加速安装和使用。

### 配置 npm 镜像源

```bash
npm config set registry https://registry.npmmirror.com
```

验证配置：

```bash
npm config get registry
# 应显示 https://registry.npmmirror.com
```

### 解决 sharp 模块安装问题

在中国大陆，`sharp` 模块的预编译二进制文件下载可能失败。使用以下命令跳过本地 libvips
检测，强制从 npm 下载预构建版本：

```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

### 配置 AI API 代理

如果你无法直接访问 Anthropic、OpenAI 等 AI 服务商的 API，可以通过以下方式配置代理。

**方式 1：环境变量（在 `~/.zshrc` 中添加）**

```bash
# Anthropic API 代理
export ANTHROPIC_BASE_URL=https://your-api-proxy.com

# OpenAI API 代理
export OPENAI_BASE_URL=https://your-api-proxy.com/v1
```

然后重新加载配置：

```bash
source ~/.zshrc
```

**方式 2：OpenClaw 配置文件**

编辑 `~/.openclaw/openclaw.json`，添加自定义 Provider：

```json
{
  "models": {
    "default": "anthropic/claude-sonnet-4-5-20250929",
    "providers": {
      "anthropic-custom": {
        "baseUrl": "https://your-api-proxy.com",
        "apiKey": "your-api-key",
        "models": [
          {
            "id": "claude-sonnet-4-5-20250929",
            "api": "anthropic-messages",
            "contextWindow": 200000,
            "maxTokens": 8192
          }
        ]
      }
    }
  }
}
```

### 配置 Homebrew 镜像（可选）

如果 Homebrew 下载缓慢，可以配置中科大或清华大学镜像：

```bash
# 中科大镜像
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.ustc.edu.cn/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.ustc.edu.cn/homebrew-core.git"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.ustc.edu.cn/homebrew-bottles"
```

## 第四步：验证安装

安装完成后，逐步运行以下命令验证安装是否成功：

```bash
# 1. 检查命令是否可用
openclaw --version

# 2. 检查配置问题
openclaw doctor

# 3. 查看 Gateway 状态
openclaw status

# 4. 在浏览器中打开控制面板
openclaw dashboard

# 5. 运行健康检查
openclaw health
```

所有命令正常运行后，说明 OpenClaw 已成功安装。

## 更新 OpenClaw

### 使用安装脚本更新（推荐）

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### 使用 npm 更新

```bash
npm install -g openclaw@latest
```

### macOS 应用更新

打开 OpenClaw.app，在菜单栏图标的菜单中选择 **检查更新**。

### 使用内置更新命令

```bash
openclaw update
```

## 卸载 OpenClaw

### 使用内置卸载命令

```bash
openclaw uninstall
```

### 手动卸载

```bash
# 停止 Gateway 服务（macOS launchd）
launchctl kickstart -k gui/$UID/ai.openclaw.gateway

# 卸载 npm 包
npm rm -g openclaw

# 删除 macOS 应用
rm -rf /Applications/OpenClaw.app

# 删除配置目录（可选，删除后配置将无法恢复）
rm -rf ~/.openclaw

# 删除 launchd 服务（可选）
rm ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

## 下一步

- 安装完成后，访问 `openclaw dashboard` 打开控制面板
- 查阅[常见问题排查手册](./troubleshooting.md)解决安装问题
- 访问 [OpenClaw 官方文档](https://docs.openclaw.ai)了解更多功能
