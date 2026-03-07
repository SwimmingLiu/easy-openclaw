# 常见问题排查手册

本手册收录了安装和使用 OpenClaw 过程中最常见的问题及解决方案。如果你遇到的问题不在本手册中，
欢迎在 [GitHub Issues](https://github.com/openclaw/openclaw/issues) 或
[Discord 社区](https://discord.gg/clawd)反馈。

## 目录

- [PATH 环境变量问题](#path-环境变量问题)
- [sharp 构建错误（macOS）](#sharp-构建错误macos)
- [pnpm 构建脚本警告](#pnpm-构建脚本警告)
- [Gateway 服务无法启动](#gateway-服务无法启动)
- [Node.js 版本不匹配](#nodejs-版本不匹配)
- [权限问题（EACCES）](#权限问题eacces)
- [更新 OpenClaw](#更新-openclaw)
- [卸载 OpenClaw](#卸载-openclaw)
- [网络问题（中国大陆）](#网络问题中国大陆)
- [WSL2 常见问题](#wsl2-常见问题)

---

## PATH 环境变量问题

### 症状

安装完成后运行 `openclaw` 提示命令未找到：

```
-bash: openclaw: command not found
zsh: command not found: openclaw
```

### 诊断步骤

1. 检查 Node.js 和 npm 是否正常安装：

   ```bash
   node -v
   npm -v
   ```

2. 查找 npm 全局安装目录：

   ```bash
   npm prefix -g
   # 通常输出 /usr/local 或 /home/user/.local
   ```

3. 检查该目录的 `bin/` 路径是否在 PATH 中：

   ```bash
   echo $PATH
   ```

4. 确认 `openclaw` 二进制文件是否存在：

   ```bash
   ls $(npm prefix -g)/bin/openclaw
   ```

### 解决方案

将 npm 全局 `bin` 目录添加到 PATH。

**Linux / macOS（bash）：**

```bash
echo 'export PATH="$(npm prefix -g)/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**macOS（zsh）：**

```bash
echo 'export PATH="$(npm prefix -g)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**如果使用 nvm，添加以下内容：**

```bash
echo 'export PATH="$NVM_DIR/versions/node/$(nvm version)/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

验证修复：

```bash
openclaw --version
```

---

## sharp 构建错误（macOS）

### 症状

在 macOS 上安装 OpenClaw 时出现类似以下错误：

```
npm error gyp verb check ok
npm error gyp ERR! build error
npm error Error: Could not load the "sharp" module using the darwin-arm64 runtime
```

或：

```
npm error sharp: Installation error: sharp pre-built binaries are not yet available for this platform
```

### 原因

`sharp` 是一个 Node.js 图像处理库，在安装时需要编译原生模块或下载预编译二进制文件。在
macOS 上，如果本地已安装了旧版 `libvips`，会导致版本冲突。

### 解决方案

**方案 1：跳过本地 libvips 检测（推荐）**

```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

**方案 2：卸载本地 libvips 后重试**

```bash
brew uninstall vips libvips 2>/dev/null || true
npm install -g openclaw@latest
```

**方案 3：清理 npm 缓存后重试**

```bash
npm cache clean --force
npm install -g openclaw@latest
```

**方案 4：使用 pnpm 替代 npm**

```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g
```

---

## pnpm 构建脚本警告

### 症状

使用 pnpm 安装时看到警告：

```
 WARN  The following packages have scripts that are not trusted:
 - openclaw
 - node-llama-cpp
 - sharp
Run "pnpm approve-builds" to grant them build permissions.
```

### 原因

pnpm 出于安全考虑，默认不执行第三方包的构建脚本，需要用户手动授权。

### 解决方案

运行以下命令授权允许构建脚本的包：

```bash
pnpm approve-builds -g
```

在交互式菜单中，使用空格键选择需要授权的包（通常包括 `openclaw`、`node-llama-cpp`、
`sharp`），然后按回车确认。

如果安装完成后 openclaw 功能不正常，尝试重新安装：

```bash
pnpm remove -g openclaw
pnpm add -g openclaw@latest
pnpm approve-builds -g
```

---

## Gateway 服务无法启动

### 症状

运行 `openclaw status` 显示 Gateway 未运行，或 `openclaw dashboard` 无法打开控制面板。

### 诊断步骤

1. 检查 Gateway 状态：

   ```bash
   openclaw status
   openclaw health
   ```

2. 查看 Gateway 日志：

   ```bash
   # macOS
   cat ~/Library/Logs/openclaw/gateway.log

   # Linux
   journalctl --user -u openclaw-gateway.service -n 50
   ```

3. 检查端口是否被占用：

   ```bash
   lsof -i :18789
   # 或
   netstat -tlnp | grep 18789
   ```

### 解决方案

**重启 Gateway 服务：**

macOS：

```bash
launchctl kickstart -k gui/$UID/ai.openclaw.gateway
```

Linux（systemd）：

```bash
systemctl --user restart openclaw-gateway.service
```

如果服务未注册，手动启动：

```bash
openclaw gateway start
```

**端口被占用时：**

找到占用端口的进程并终止：

```bash
# 查找占用进程
lsof -i :18789

# 终止该进程（替换 PID 为实际进程号）
kill -9 <PID>
```

然后重新启动 Gateway：

```bash
openclaw gateway start
```

**重新运行配置向导：**

如果配置损坏，可以重新运行 onboarding：

```bash
openclaw onboard --install-daemon
```

---

## Node.js 版本不匹配

### 症状

安装或运行 OpenClaw 时出现：

```
Error: The module was compiled against a different Node.js version
node: bad option: --import
```

或：

```
Your Node.js version (v18.x.x) is not supported. Please upgrade to Node.js 22+.
```

### 诊断步骤

检查当前 Node.js 版本：

```bash
node -v
```

OpenClaw 需要 Node.js 22 或更高版本。

### 解决方案

**使用 nvm 升级（推荐）：**

```bash
nvm install 22
nvm use 22
nvm alias default 22

# 重新安装 OpenClaw
npm install -g openclaw@latest
```

**macOS（Homebrew）：**

```bash
brew upgrade node@22
# 或安装新版本
brew install node@22
brew link node@22 --force --overwrite
```

**Ubuntu / Debian：**

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

安装新版本后，重新安装 OpenClaw：

```bash
npm install -g openclaw@latest
```

---

## 权限问题（EACCES）

### 症状

使用 npm 全局安装时出现权限错误：

```
npm error code EACCES
npm error syscall mkdir
npm error path /usr/local/lib/node_modules/openclaw
npm error Error: EACCES: permission denied
```

### 原因

npm 全局安装目录需要 root 权限，但不推荐使用 `sudo npm install -g`，因为这会造成安全风险。

### 解决方案

**方案 1：更改 npm 全局安装目录（推荐）**

```bash
# 创建用户级别的 npm 目录
mkdir -p ~/.npm-global

# 配置 npm 使用该目录
npm config set prefix '~/.npm-global'

# 添加到 PATH（bash）
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 或 zsh
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 重新安装
npm install -g openclaw@latest
```

**方案 2：使用 nvm（彻底解决权限问题）**

nvm 安装的 Node.js 默认存储在用户目录，无需 sudo：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
npm install -g openclaw@latest
```

**方案 3：修复全局目录权限**

> **警告**：此方法会修改系统目录权限，仅在其他方法不可用时使用。

```bash
sudo chown -R $(whoami) $(npm prefix -g)
npm install -g openclaw@latest
```

---

## 更新 OpenClaw

### 查看当前版本

```bash
openclaw --version
```

### 更新方式

**推荐：使用安装脚本更新**

脚本会自动处理所有依赖和配置迁移：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**使用 npm 更新**

```bash
npm install -g openclaw@latest
```

**使用 pnpm 更新**

```bash
pnpm add -g openclaw@latest
```

**使用内置命令更新**

```bash
openclaw update
```

### 更新后 Gateway 服务未自动重启

手动重启：

```bash
# macOS
launchctl kickstart -k gui/$UID/ai.openclaw.gateway

# Linux
systemctl --user restart openclaw-gateway.service
```

---

## 卸载 OpenClaw

### 使用内置卸载命令（推荐）

```bash
openclaw uninstall
```

此命令会停止 Gateway 服务并清理系统服务注册。

### 手动完整卸载

**macOS：**

```bash
# 停止并删除 launchd 服务
launchctl unload ~/Library/LaunchAgents/ai.openclaw.gateway.plist 2>/dev/null || true
rm -f ~/Library/LaunchAgents/ai.openclaw.gateway.plist

# 卸载 npm 包
npm rm -g openclaw

# 删除 macOS 应用（如果安装过）
rm -rf /Applications/OpenClaw.app

# 删除配置目录（可选，删除后配置将无法恢复）
rm -rf ~/.openclaw
```

**Linux：**

```bash
# 停止并禁用 systemd 服务
systemctl --user stop openclaw-gateway.service 2>/dev/null || true
systemctl --user disable openclaw-gateway.service 2>/dev/null || true
rm -f ~/.config/systemd/user/openclaw-gateway.service

# 卸载 npm 包
npm rm -g openclaw

# 删除配置目录（可选，删除后配置将无法恢复）
rm -rf ~/.openclaw
```

---

## 网络问题（中国大陆）

### npm 下载速度慢

配置淘宝 npm 镜像：

```bash
npm config set registry https://registry.npmmirror.com
```

验证：

```bash
npm config get registry
```

### Node.js 下载速度慢

从淘宝镜像下载 Node.js 安装包：

```
https://npmmirror.com/mirrors/node/
```

### AI API 连接失败

如果无法连接 Anthropic 或 OpenAI 的 API，配置自定义代理。

**方式 1：环境变量**

```bash
# ~/.bashrc 或 ~/.zshrc
export ANTHROPIC_BASE_URL=https://your-api-proxy.com
export OPENAI_BASE_URL=https://your-api-proxy.com/v1
```

**方式 2：OpenClaw 配置文件**

编辑 `~/.openclaw/openclaw.json`：

```json
{
  "models": {
    "providers": {
      "anthropic-custom": {
        "baseUrl": "https://your-api-proxy.com",
        "apiKey": "your-api-key",
        "models": [
          {
            "id": "claude-sonnet-4-5-20250929",
            "api": "anthropic-messages"
          }
        ]
      }
    }
  }
}
```

### 安装脚本下载失败

如果 `curl https://openclaw.ai/install.sh` 失败，尝试：

1. 设置终端代理：

   ```bash
   export http_proxy=http://127.0.0.1:7897
   export https_proxy=http://127.0.0.1:7897
   curl -fsSL https://openclaw.ai/install.sh | bash
   ```

2. 手动下载安装脚本后执行：

   ```bash
   # 通过其他方式下载 install.sh，然后
   bash install.sh
   ```

### Homebrew 下载慢（macOS）

配置中科大镜像加速：

```bash
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.ustc.edu.cn/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.ustc.edu.cn/homebrew-core.git"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.ustc.edu.cn/homebrew-bottles"
brew update
```

---

## WSL2 常见问题

### WSL2 安装失败

**检查 Windows 版本**：需要 Windows 10 版本 2004（Build 19041）或更高版本。

```powershell
winver
```

**启用必要的 Windows 功能**（以管理员身份运行 PowerShell）：

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

重启电脑后，再次运行 `wsl --install`。

**确认 BIOS 开启虚拟化**：

重启电脑进入 BIOS，确认 Intel VT-x 或 AMD-V 已启用。

### WSL2 中无法访问网络

```bash
# 临时修复 DNS
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf

# 防止 WSL 自动覆盖 resolv.conf
sudo sh -c "echo '[network]\ngenerateResolvConf = false' >> /etc/wsl.conf"
```

### WSL2 中无法访问 Windows 代理

Windows 代理软件需要开启"允许局域网"选项。

```bash
# 获取 Windows 宿主 IP
WIN_HOST=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}')

# 设置代理
export http_proxy=http://$WIN_HOST:7897
export https_proxy=http://$WIN_HOST:7897
```

### openclaw dashboard 在 WSL2 中无法打开浏览器

WSL2 无法直接打开 Windows 浏览器，但可以手动在 Windows 浏览器中访问：

```
http://localhost:18789/
```

或者配置 WSL2 使用 Windows 浏览器（WSL2 会自动转发到 Windows）：

```bash
export BROWSER="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
```

---

如果以上方案都无法解决你的问题，请提供以下信息在
[GitHub Issues](https://github.com/openclaw/openclaw/issues) 中反馈：

- 操作系统及版本
- Node.js 版本（`node -v`）
- OpenClaw 版本（`openclaw --version`）
- 完整错误信息
- 运行 `openclaw doctor` 的输出
