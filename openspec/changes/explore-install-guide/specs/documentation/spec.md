# Documentation: OpenClaw 安装指南

本文档定义安装指南文档体系的需求。

## ADDED Requirements

### Requirement: 安装指南总览文档

系统 **MUST** 提供一份安装指南总览文档（`docs/install-guide/README.md`），包含：
- 项目定位说明
- 快速开始（一键安装命令）
- 平台选择指引
- 各平台文档链接

#### Scenario: 用户访问安装指南总览

**Given** 用户访问 `docs/install-guide/README.md`
**When** 用户阅读文档
**Then** 用户能够快速了解项目定位
**And** 用户能够找到适合自己平台的安装方式
**And** 用户能够通过链接跳转到详细安装指南

---

### Requirement: Linux 安装指南

系统 **MUST** 提供 Linux 平台的完整安装指南（`docs/install-guide/linux.md`），包含：
- 系统要求（Node.js 22+）
- 多种安装方式（脚本、npm、pnpm、源码）
- 中国大陆网络优化方案
- 安装验证步骤

#### Scenario: Linux 用户使用安装脚本

**Given** 用户使用 Linux 系统
**And** 用户已安装 Node.js 22+
**When** 用户执行 `curl -fsSL https://openclaw.ai/install.sh | bash`
**Then** OpenClaw 应成功安装
**And** 用户能够运行 `openclaw doctor` 验证安装

#### Scenario: Linux 用户使用 npm 安装

**Given** 用户使用 Linux 系统
**And** 用户已安装 Node.js 22+ 和 npm
**When** 用户执行 `npm install -g openclaw@latest`
**Then** OpenClaw 应成功安装
**And** 用户能够运行 `openclaw --version` 查看版本

---

### Requirement: macOS 安装指南

系统 **MUST** 提供 macOS 平台的完整安装指南（`docs/install-guide/macos.md`），包含：
- 系统要求（Node.js 22+）
- macOS 应用安装方式
- 脚本、npm、pnpm、源码安装方式
- macOS 特殊配置（权限授权、菜单栏应用）
- 安装验证步骤

#### Scenario: macOS 用户使用 macOS 应用

**Given** 用户使用 macOS 系统
**When** 用户下载并安装 OpenClaw.app
**Then** OpenClaw 应成功安装
**And** 用户能够在菜单栏看到 OpenClaw 图标
**And** 用户能够完成 onboarding 流程

#### Scenario: macOS 用户使用 Homebrew 安装 Node.js

**Given** 用户使用 macOS 系统
**And** 用户已安装 Homebrew
**When** 用户执行 `brew install node@22`
**Then** Node.js 22 应成功安装
**And** 用户能够继续安装 OpenClaw

---

### Requirement: Windows 安装指南

系统 **MUST** 提供 Windows 平台的完整安装指南（`docs/install-guide/windows.md`），包含：
- WSL2 安装步骤（强烈推荐）
- 在 WSL2 中安装 OpenClaw
- 原生 Windows 安装（PowerShell）
- 安装验证步骤

#### Scenario: Windows 用户使用 WSL2 安装

**Given** 用户使用 Windows 系统
**When** 用户执行 `wsl --install` 并重启
**Then** WSL2 应成功安装
**And** 用户能够在 WSL2 中按照 Linux 指南安装 OpenClaw

#### Scenario: Windows 用户使用 PowerShell 脚本安装

**Given** 用户使用 Windows 系统
**And** 用户已安装 Node.js 22+
**When** 用户执行 `iwr -useb https://openclaw.ai/install.ps1 | iex`
**Then** OpenClaw 应成功安装
**And** 用户能够运行 `openclaw doctor` 验证安装

---

### Requirement: Docker 安装指南

系统 **MUST** 提供 Docker 部署的完整安装指南（`docs/install-guide/docker.md`），包含：
- 系统要求（Docker Desktop / Docker Engine）
- 快速启动步骤
- 配置持久化
- 健康检查

#### Scenario: 用户使用 Docker 快速启动

**Given** 用户已安装 Docker
**When** 用户执行 `./docker-setup.sh`
**Then** OpenClaw 容器应成功启动
**And** 用户能够访问 http://127.0.0.1:18789/

#### Scenario: 用户使用远程镜像

**Given** 用户已安装 Docker
**When** 用户设置 `export OPENCLAW_IMAGE=ghcr.io/openclaw/openclaw:latest`
**And** 用户执行 `./docker-setup.sh`
**Then** OpenClaw 容器应使用远程镜像启动

---

### Requirement: 常见问题排查手册

系统 **MUST** 提供常见问题排查手册（`docs/install-guide/troubleshooting.md`），包含：
- PATH 环境变量问题
- sharp 构建错误（macOS）
- pnpm 构建脚本警告
- Gateway 服务无法启动
- Node.js 版本不匹配
- 权限问题（EACCES）
- 更新和卸载 OpenClaw

#### Scenario: 用户遇到 PATH 问题

**Given** 用户安装 OpenClaw 后
**When** 用户执行 `openclaw --version` 提示命令未找到
**And** 用户查阅 troubleshooting.md
**Then** 用户能够找到 PATH 问题的诊断步骤
**And** 用户能够找到修复命令

#### Scenario: macOS 用户遇到 sharp 构建错误

**Given** 用户使用 macOS 系统
**When** 用户安装 OpenClaw 时遇到 sharp 构建错误
**And** 用户查阅 troubleshooting.md
**Then** 用户能够找到修复命令 `SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest`

---

### Requirement: README.md 更新

系统 **MUST** 更新项目根目录的 README.md，包含：
- 项目定位说明
- 快速开始（一键安装命令）
- 平台选择指引表格
- 文档链接

#### Scenario: 用户访问项目主页

**Given** 用户访问项目 GitHub 主页
**When** 用户阅读 README.md
**Then** 用户能够快速了解项目定位
**And** 用户能够看到一键安装命令
**And** 用户能够通过链接跳转到详细安装指南

---

## MODIFIED Requirements

无（本次为纯新增文档）

## REMOVED Requirements

无（本次为纯新增文档）
