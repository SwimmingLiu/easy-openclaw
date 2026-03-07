# OpenClaw 多平台安装方案调研

## 概述

OpenClaw 是一个 AI Agent 平台，支持在 macOS、Linux 和 Windows 上运行。本文档详细描述了各平台的完整安装流程。

## 系统要求

- **Node.js**: 22+ (安装脚本会自动检测并安装)
- **操作系统**: macOS、Linux 或 Windows
- **pnpm**: 仅在从源码构建时需要
- **Windows 用户**: 强烈建议使用 WSL2

---

## 一、Linux 安装指南

### 1.1 安装 Node.js 22+

#### 方法 A: 使用 NodeSource (推荐)

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL/Fedora
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs
```

#### 方法 B: 使用 nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
```

#### 验证 Node.js 安装

```bash
node -v   # 应显示 v22.x.x
npm -v    # 应显示 npm 版本
```

### 1.2 安装 OpenClaw

#### 方法 A: 安装脚本 (推荐)

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

跳过 onboarding:
```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

#### 方法 B: npm

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

#### 方法 C: pnpm

```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```

#### 方法 D: 从源码

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build
pnpm build
pnpm link --global
openclaw onboard --install-daemon
```

### 1.3 验证安装

```bash
openclaw doctor         # 检查配置问题
openclaw status         # 查看网关状态
openclaw dashboard      # 打开浏览器 UI
```

---

## 二、macOS 安装指南

### 2.1 安装 Node.js 22+

#### 方法 A: Homebrew (推荐)

```bash
brew install node@22
```

#### 方法 B: 官方安装包

下载: https://nodejs.org/en/download/

#### 方法 C: nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.zshrc
nvm install 22
nvm use 22
```

### 2.2 安装 OpenClaw

#### 方法 A: macOS 应用 (推荐)

1. 下载 OpenClaw.app
2. 拖入 Applications 文件夹
3. 启动并完成 onboarding

#### 方法 B: 安装脚本

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

#### 方法 C: npm/pnpm

同 Linux 安装方法。

### 2.3 macOS 特殊配置

- 权限授权: 首次启动会弹出 TCC 权限请求
- 菜单栏应用: OpenClaw.app 会在菜单栏显示图标

### 2.4 验证安装

```bash
openclaw doctor
openclaw status
openclaw health
```

---

## 三、Windows 安装指南

### 3.1 安装 WSL2 (强烈推荐)

```powershell
wsl --install
```

重启后，WSL2 会自动安装 Ubuntu。

### 3.2 在 WSL2 中安装

进入 WSL2 后，按照 Linux 安装指南操作。

### 3.3 原生 Windows (PowerShell)

#### 安装 Node.js 22+

1. 下载: https://nodejs.org/en/download/
2. 运行安装程序

#### 安装 OpenClaw

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

跳过 onboarding:
```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -NoOnboard
```

#### 验证安装

```powershell
openclaw doctor
openclaw status
openclaw dashboard
```

---

## 四、Docker 安装方式

### 4.1 系统要求

- Docker Desktop 或 Docker Engine
- Docker Compose v2
- 至少 2GB RAM
- 足够的磁盘空间

### 4.2 快速启动

```bash
cd openclaw
./docker-setup.sh
```

### 4.3 使用远程镜像

```bash
export OPENCLAW_IMAGE=ghcr.io/openclaw/openclaw:latest
./docker-setup.sh
```

### 4.4 访问

- 打开 http://127.0.0.1:18789/
- 输入 gateway token

---

## 五、验证安装

### 5.1 基本验证

```bash
# 检查配置
openclaw doctor

# 查看网关状态
openclaw status

# 打开控制面板
openclaw dashboard

# 健康检查
openclaw health
```

### 5.2 PATH 问题排查

如果 `openclaw` 命令找不到:

```bash
# 诊断
node -v
npm -v
npm prefix -g
echo "$PATH"

# 修复 (添加到 ~/.zshrc 或 ~/.bashrc)
export PATH="$(npm prefix -g)/bin:$PATH"
```

---

## 六、常见问题

### 6.1 sharp 构建错误 (macOS)

```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

### 6.2 pnpm 构建脚本警告

```bash
pnpm approve-builds -g
# 选择 openclaw, node-llama-cpp, sharp 等
```

### 6.3 Gateway 服务问题

```bash
# macOS
launchctl kickstart -k gui/$UID/ai.openclaw.gateway

# Linux
systemctl --user restart openclaw-gateway.service
```

### 6.4 更新 OpenClaw

```bash
# 推荐: 重新运行安装脚本
curl -fsSL https://openclaw.ai/install.sh | bash

# 或使用 npm
npm i -g openclaw@latest
```

---

## 七、更新与卸载

### 7.1 更新

```bash
openclaw update
# 或
npm i -g openclaw@latest
```

### 7.2 卸载

```bash
openclaw uninstall
# 或手动
npm rm -g openclaw
rm -rf ~/.openclaw
```

---

## 参考资源

- 官方文档: https://docs.openclaw.ai
- GitHub: https://github.com/openclaw/openclaw
- Discord 社区: https://discord.gg/clawd
- 安装脚本: https://openclaw.ai/install.sh
