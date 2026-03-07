# Linux 安装指南

本指南介绍如何在 Linux 系统上安装 OpenClaw。支持 Ubuntu、Debian、CentOS、RHEL、Fedora
等主流发行版。

## 系统要求

安装 OpenClaw 前，确保你的系统满足以下要求：

- **操作系统**：Ubuntu 20.04+、Debian 11+、CentOS 8+、RHEL 8+、Fedora 35+
- **Node.js**：22 或更高版本
- **内存**：至少 1GB 可用 RAM
- **磁盘空间**：至少 500MB 可用空间
- **网络**：需要访问 npm 仓库（或配置镜像源）

## 第一步：安装 Node.js 22+

OpenClaw 需要 Node.js 22 或更高版本。如果你的系统已安装 Node.js 22+，可跳过此步骤。

### 方式 A：使用 NodeSource（推荐）

NodeSource 是 Node.js 的官方分发渠道，提供稳定的 LTS 版本。

**Ubuntu / Debian：**

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**CentOS / RHEL / Fedora：**

```bash
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs
```

### 方式 B：使用 nvm（适合多版本管理）

如果你需要在同一台机器上管理多个 Node.js 版本，nvm 是更灵活的选择：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc
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

### 方式 A：安装脚本（推荐）

安装脚本会自动检测系统环境、安装依赖并完成配置向导：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

如果你不需要交互式配置向导，可以跳过 onboarding：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

### 方式 B：npm 安装

如果你已有 Node.js 环境，可以直接通过 npm 安装：

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

### 方式 C：pnpm 安装

```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```

> **提示**：运行 `pnpm approve-builds -g` 时，选择 `openclaw`、`node-llama-cpp`、`sharp`
> 等需要编译的包以授权构建脚本。

### 方式 D：从源码构建

适合需要最新功能或进行二次开发的用户：

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build
pnpm build
pnpm link --global
openclaw onboard --install-daemon
```

## 第三步：中国大陆网络优化

如果你在中国大陆，网络访问可能受限。以下方案可以帮助加速安装和使用。

### 配置 npm 镜像源

使用淘宝 npm 镜像加速包下载：

```bash
npm config set registry https://registry.npmmirror.com
```

验证配置：

```bash
npm config get registry
# 应显示 https://registry.npmmirror.com
```

如需恢复官方源：

```bash
npm config set registry https://registry.npmjs.org
```

### 使用国内 Node.js 镜像下载

如果官方 NodeSource 下载缓慢，可以从淘宝镜像下载 Node.js 安装包：

```
https://npmmirror.com/mirrors/node/
```

### 配置 AI API 代理

如果你无法直接访问 Anthropic、OpenAI 等 AI 服务商的 API，可以通过以下方式配置代理。

**方式 1：环境变量**

在 `~/.bashrc` 或 `~/.zshrc` 中添加：

```bash
# Anthropic API 代理
export ANTHROPIC_BASE_URL=https://your-api-proxy.com

# OpenAI API 代理
export OPENAI_BASE_URL=https://your-api-proxy.com/v1
```

然后重新加载配置：

```bash
source ~/.bashrc
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

**方式 3：使用 OpenClaw 安装脚本的自定义 Provider 功能**

在安装向导中，选择对应的 AI 提供商后，填写自定义的 Base URL 即可自动完成配置。

### 配置系统代理

如果你使用 HTTP 代理，在终端中设置：

```bash
export http_proxy=http://127.0.0.1:7897
export https_proxy=http://127.0.0.1:7897
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
# 停止 Gateway 服务
systemctl --user stop openclaw-gateway.service

# 卸载 npm 包
npm rm -g openclaw

# 删除配置目录（可选，删除后配置将无法恢复）
rm -rf ~/.openclaw
```

## 下一步

- 安装完成后，访问 `openclaw dashboard` 打开控制面板
- 查阅[常见问题排查手册](./troubleshooting.md)解决安装问题
- 访问 [OpenClaw 官方文档](https://docs.openclaw.ai)了解更多功能
