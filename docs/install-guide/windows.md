# Windows 安装指南

本指南介绍如何在 Windows 系统上安装 OpenClaw。强烈建议使用 WSL2（Windows Subsystem for
Linux）方式，可获得与 Linux 完全一致的使用体验。

## 系统要求

- **操作系统**：Windows 10 版本 2004（Build 19041）或更高版本；Windows 11
- **内存**：至少 2GB 可用 RAM（WSL2 需要额外内存）
- **磁盘空间**：至少 2GB 可用空间（WSL2 需要额外空间）
- **虚拟化**：需要开启 CPU 虚拟化（大多数现代 PC 默认开启）

## 推荐方式：WSL2 安装

WSL2 提供了完整的 Linux 内核，让你在 Windows 上获得原生 Linux 体验。这是 OpenClaw
官方推荐的 Windows 安装方式。

### 第一步：安装 WSL2

以**管理员身份**打开 PowerShell 或命令提示符，运行：

```powershell
wsl --install
```

此命令会自动安装 WSL2 和 Ubuntu 发行版。安装完成后，**重启电脑**。

重启后，Windows 会自动打开 Ubuntu 终端，按提示设置 Linux 用户名和密码。

> **注意**：如果你的系统已安装旧版 WSL1，运行 `wsl --set-default-version 2` 切换到
> WSL2。

### 第二步：在 WSL2 中安装 Node.js

打开 Ubuntu（WSL2）终端，安装 Node.js 22：

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

验证安装：

```bash
node -v   # 应显示 v22.x.x 或更高
npm -v    # 应显示 npm 版本
```

### 第三步：在 WSL2 中安装 OpenClaw

在 Ubuntu（WSL2）终端中运行安装脚本：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

或使用 npm：

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

### 第四步：验证安装

```bash
# 检查命令是否可用
openclaw --version

# 检查配置问题
openclaw doctor

# 查看 Gateway 状态
openclaw status

# 打开控制面板（在 Windows 浏览器中打开）
openclaw dashboard
```

> **提示**：WSL2 中运行的服务可以通过 Windows 浏览器访问，地址为
> `http://localhost:18789/`。

## 原生 Windows 安装

如果你不想使用 WSL2，可以在原生 Windows 环境中安装 OpenClaw。

> **注意**：原生 Windows 安装的某些功能可能不如 WSL2 方式完整。我们仍建议使用 WSL2。

### 第一步：安装 Node.js 22+

1. 访问 [nodejs.org](https://nodejs.org/en/download/)
2. 下载 Windows 版本的安装包（选择 22.x LTS）
3. 运行 `.msi` 安装程序并按提示完成安装
4. 确保在安装过程中勾选 **Add to PATH** 选项

验证安装（在 PowerShell 或命令提示符中）：

```powershell
node -v
npm -v
```

### 第二步：使用 PowerShell 脚本安装

以**管理员身份**打开 PowerShell，运行：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

如果你不需要交互式配置向导：

```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -NoOnboard
```

### 方式 B：使用 npm 安装

```powershell
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

### 验证安装

```powershell
openclaw --version
openclaw doctor
openclaw status
openclaw dashboard
```

## 中国大陆网络优化

### 配置 npm 镜像源

在 PowerShell 或 WSL2 终端中运行：

```bash
npm config set registry https://registry.npmmirror.com
```

### 配置 AI API 代理（WSL2）

在 WSL2 的 `~/.bashrc` 中添加：

```bash
# Anthropic API 代理
export ANTHROPIC_BASE_URL=https://your-api-proxy.com

# OpenAI API 代理
export OPENAI_BASE_URL=https://your-api-proxy.com/v1
```

### 配置 AI API 代理（原生 Windows）

在 PowerShell 中设置环境变量：

```powershell
# 临时设置（当前会话）
$env:ANTHROPIC_BASE_URL = "https://your-api-proxy.com"
$env:OPENAI_BASE_URL = "https://your-api-proxy.com/v1"

# 永久设置（系统环境变量）
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", "https://your-api-proxy.com", "User")
[System.Environment]::SetEnvironmentVariable("OPENAI_BASE_URL", "https://your-api-proxy.com/v1", "User")
```

或通过 **系统设置 > 高级系统设置 > 环境变量** 添加用户变量。

### WSL2 访问 Windows 代理

如果你在 Windows 上使用代理软件（如 Clash），WSL2 需要特殊配置才能访问：

```bash
# 获取 Windows 宿主机 IP
export WIN_HOST=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}')

# 设置代理
export http_proxy=http://$WIN_HOST:7897
export https_proxy=http://$WIN_HOST:7897
```

> **提示**：确保 Windows 代理软件开启了"允许局域网访问"选项。

## 更新 OpenClaw

### 在 WSL2 中更新

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
# 或
npm install -g openclaw@latest
```

### 在原生 Windows 中更新

```powershell
npm install -g openclaw@latest
# 或
openclaw update
```

## 卸载 OpenClaw

### 在 WSL2 中卸载

```bash
# 停止 Gateway 服务
systemctl --user stop openclaw-gateway.service

# 卸载
openclaw uninstall
# 或手动卸载
npm rm -g openclaw
rm -rf ~/.openclaw
```

### 在原生 Windows 中卸载

```powershell
openclaw uninstall
# 或手动
npm rm -g openclaw
Remove-Item -Recurse -Force "$env:USERPROFILE\.openclaw"
```

## 常见 WSL2 问题

### WSL2 无法启动

如果 WSL2 启动失败，检查以下几点：

1. 确认 CPU 虚拟化已在 BIOS 中开启（Intel VT-x 或 AMD-V）
2. 在 PowerShell（管理员）中运行：
   ```powershell
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```
3. 重启电脑后再试

### WSL2 网络问题

如果 WSL2 中无法访问网络：

```bash
# 重置 DNS
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf

# 或使用
sudo sh -c "echo 'nameserver 8.8.8.8' > /etc/resolv.conf"
```

### WSL2 文件权限问题

在 WSL2 中操作 Windows 路径（如 `/mnt/c/`）时，权限可能与预期不同。建议将文件放在 WSL2
的主目录（`~/`）下操作。

## 下一步

- 安装完成后，访问 `openclaw dashboard` 打开控制面板
- 查阅[常见问题排查手册](./troubleshooting.md)解决安装问题
- 访问 [OpenClaw 官方文档](https://docs.openclaw.ai)了解更多功能
