# 系统要求

本文档列出了在各平台上安装 OpenClaw 的最低系统要求和推荐配置。

## 通用要求

无论你使用哪个平台，都需要满足以下基本要求：

| 组件 | 最低要求 | 推荐配置 |
|------|----------|----------|
| **Node.js** | 22.x LTS 或更高 | 最新 LTS 版本 |
| **内存** | 1GB 可用 RAM | 4GB 或更多 |
| **磁盘空间** | 500MB 可用空间 | 2GB 或更多 |
| **网络** | 能访问 npm 仓库 | 稳定的宽带连接 |

> **重要**：OpenClaw 要求 Node.js **22 或更高版本**。较低版本（如 Node.js 18、20）不受支持。

---

## Linux

### 支持的发行版

| 发行版 | 最低版本 | 状态 |
|--------|----------|------|
| Ubuntu | 20.04 LTS | ✅ 完全支持 |
| Debian | 11 (Bullseye) | ✅ 完全支持 |
| CentOS | 8 | ✅ 支持 |
| RHEL | 8 | ✅ 支持 |
| Fedora | 35+ | ✅ 支持 |
| Arch Linux | 最新滚动更新 | ✅ 支持 |
| 其他 Linux | - | ⚠️ 未经测试，可能支持 |

### Linux 软件依赖

- **curl** 或 **wget**：用于下载安装脚本
- **bash** 4.0+：运行安装脚本
- **git**（可选）：从源码构建时需要
- **pnpm**（可选）：使用 pnpm 安装方式时需要

### Linux 硬件要求

| 组件 | 最低要求 | 推荐配置 |
|------|----------|----------|
| CPU | 任意 64 位处理器 | 多核处理器 |
| 内存 | 1GB 可用 RAM | 2GB 或更多 |
| 磁盘空间 | 500MB | 1GB 或更多 |

---

## macOS

### 支持的版本

| macOS 版本 | 状态 |
|------------|------|
| macOS 15 Sequoia | ✅ 完全支持 |
| macOS 14 Sonoma | ✅ 完全支持 |
| macOS 13 Ventura | ✅ 完全支持 |
| macOS 12 Monterey | ✅ 完全支持 |
| macOS 11 Big Sur | ⚠️ 可能支持，未经充分测试 |
| macOS 10.x 及更早 | ❌ 不支持 |

### 支持的芯片架构

| 架构 | 支持状态 |
|------|----------|
| Apple Silicon（M1/M2/M3/M4） | ✅ 原生支持 |
| Intel x86_64 | ✅ 完全支持 |

### macOS 软件依赖

- **Homebrew**（推荐）：用于安装 Node.js 和其他依赖
- **Xcode Command Line Tools**：如果从源码构建

安装 Xcode Command Line Tools：

```bash
xcode-select --install
```

### macOS 权限要求

OpenClaw 在 macOS 上可能需要以下权限（首次启动时会弹出授权请求）：

- **辅助功能**：用于键盘快捷键功能
- **通知**：用于消息通知
- **屏幕录制**（可选）：用于截图功能

---

## Windows

### 支持的 Windows 版本

| Windows 版本 | WSL2 方式 | 原生 PowerShell |
|-------------|-----------|-----------------|
| Windows 11 | ✅ 推荐 | ⚠️ 功能有限 |
| Windows 10 v2004+ (Build 19041+) | ✅ 推荐 | ⚠️ 功能有限 |
| Windows 10 v1903 以下 | ❌ 不支持 WSL2 | ⚠️ 功能有限 |
| Windows Server 2019+ | ✅ 支持 | ⚠️ 功能有限 |

> **强烈建议**：使用 WSL2 方式安装。原生 Windows 安装功能可能不完整。

### WSL2 要求

- **CPU 虚拟化**：需要在 BIOS 中启用 Intel VT-x 或 AMD-V
- **Windows 功能**：需要启用"适用于 Linux 的 Windows 子系统"和"虚拟机平台"
- **内存**：至少 2GB 可用 RAM（WSL2 需要额外内存）
- **磁盘空间**：至少 2GB 可用空间（WSL2 需要额外空间）

验证 CPU 虚拟化是否启用（任务管理器 > 性能 > CPU，查看"虚拟化"状态）。

---

## Docker

### Docker 版本要求

| 组件 | 最低版本 | 推荐版本 |
|------|----------|----------|
| Docker Engine | 20.10 | 最新稳定版 |
| Docker Desktop | 4.0 | 最新稳定版 |
| Docker Compose | v2 | 最新版 |

### Docker 宿主机系统要求

| 组件 | 要求 |
|------|------|
| 操作系统 | Linux、macOS 或 Windows（需要 WSL2） |
| 内存 | 至少 2GB 可用 RAM（容器本身约需 256MB） |
| 磁盘空间 | 至少 1GB（镜像约 150MB + 配置数据） |
| CPU 架构 | amd64（x86_64）或 arm64 |

---

## Node.js 详细要求

### 版本要求

OpenClaw 对 Node.js 版本有明确要求：

| Node.js 版本 | 支持状态 |
|-------------|----------|
| 22.x LTS | ✅ 推荐（官方支持） |
| 23.x 及更高 | ✅ 支持 |
| 20.x | ❌ 不支持 |
| 18.x 及更低 | ❌ 不支持 |

### 检查当前 Node.js 版本

```bash
node -v
```

输出应为 `v22.x.x` 或更高。

### 安装 Node.js 22

各平台的安装方式参见对应的安装指南：

- [Linux 安装指南 - Node.js 章节](./linux.md#第一步安装-nodejs-22)
- [macOS 安装指南 - Node.js 章节](./macos.md#第一步安装-nodejs-22)
- [Windows 安装指南 - Node.js 章节](./windows.md#第一步安装-nodejs-22)

---

## 网络要求

### 安装阶段

| 域名 | 用途 |
|------|------|
| `registry.npmjs.org` | npm 包下载 |
| `openclaw.ai` | 安装脚本下载 |
| `github.com` | 源码克隆（可选） |
| `deb.nodesource.com` | Node.js 安装包（Ubuntu/Debian） |
| `rpm.nodesource.com` | Node.js 安装包（CentOS/RHEL） |

### 运行阶段

| 域名 | 用途 |
|------|------|
| `api.anthropic.com` | Anthropic Claude API |
| `api.openai.com` | OpenAI API |
| 其他 AI 服务商域名 | 根据配置的 AI 提供商 |

### 中国大陆网络

如果你在中国大陆，以上域名可能需要特殊网络配置。参见各平台指南中的"中国大陆网络优化"章节，或查阅[常见问题排查手册 - 网络问题](./troubleshooting.md#网络问题中国大陆)。

**推荐方案**：
1. 配置 npm 镜像源（`registry.npmmirror.com`）加速包下载
2. 使用自定义 API Proxy 配置 OpenClaw 访问 AI API

---

## 版本兼容性矩阵

| 平台 | Node.js 22 | Node.js 23+ | 安装脚本 | npm 安装 | pnpm 安装 | Docker |
|------|-----------|------------|---------|---------|----------|--------|
| Linux (Ubuntu) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Linux (CentOS) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| macOS (ARM) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| macOS (Intel) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Windows (WSL2) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Windows (原生) | ✅ | ✅ | ⚠️ | ✅ | ✅ | N/A |

> **图例**：✅ = 完全支持，⚠️ = 部分支持，❌ = 不支持，N/A = 不适用

---

## 参考资源

- [Node.js 官方版本列表](https://nodejs.org/en/about/releases/)
- [Docker 系统要求](https://docs.docker.com/engine/install/)
- [WSL2 系统要求](https://docs.microsoft.com/zh-cn/windows/wsl/install)
- [OpenClaw 官方文档](https://docs.openclaw.ai)
