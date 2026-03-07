# OpenClaw 安装指南

本指南帮助你在任意平台上快速安装 OpenClaw AI 助手。无论你使用 Linux、macOS、Windows 还是
Docker，都能在 10 分钟内完成安装并开始使用。

## 快速开始

对于大多数用户，一键安装脚本是最简单的方式：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

安装完成后，运行以下命令验证：

```bash
openclaw doctor
```

## 选择安装平台

根据你的操作系统选择对应的安装指南：

| 平台 | 推荐方式 | 难度 | 指南 |
|------|----------|------|------|
| **Linux** | 安装脚本 | 简单 | [Linux 安装指南](./linux.md) |
| **macOS** | macOS 应用 / 安装脚本 | 简单 | [macOS 安装指南](./macos.md) |
| **Windows** | WSL2 + 安装脚本 | 中等 | [Windows 安装指南](./windows.md) |
| **Docker** | docker-compose | 中等 | [Docker 安装指南](./docker.md) |

> **提示**：Windows 用户强烈建议使用 WSL2 方式安装，可获得与 Linux 完全一致的体验。

## 安装方式对比

OpenClaw 提供多种安装方式，适合不同场景：

| 安装方式 | 适用场景 | 优点 |
|----------|----------|------|
| **安装脚本**（推荐）| 首次安装 | 自动处理依赖，最简单 |
| **macOS 应用** | macOS 用户 | 图形化界面，菜单栏集成 |
| **npm / pnpm** | 已有 Node.js | 版本可控，便于升级 |
| **源码构建** | 开发者 / 定制化 | 最新特性，完全可控 |
| **Docker** | 服务器 / 隔离环境 | 环境隔离，易于迁移 |

## 系统要求

所有平台的基本要求：

- **Node.js** 22 或更高版本
- **操作系统**：macOS 12+、Ubuntu 20.04+、Debian 11+、CentOS 8+、Windows 10+（WSL2）
- **磁盘空间**：至少 500MB 可用空间
- **内存**：至少 1GB 可用 RAM

## 中国大陆用户

如果你在中国大陆，建议在安装前配置 npm 镜像源以加快下载速度：

```bash
npm config set registry https://registry.npmmirror.com
```

同时，你可能需要配置自定义 API 代理。详见各平台指南中的"中国大陆网络优化"章节。

## 常见问题

安装过程中遇到问题？查阅[常见问题排查手册](./troubleshooting.md)，涵盖：

- `openclaw` 命令找不到（PATH 问题）
- `sharp` 构建错误（macOS）
- Gateway 服务无法启动
- Node.js 版本不匹配
- 权限问题（EACCES）
- 网络连接问题

## 参考资源

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [GitHub 仓库](https://github.com/openclaw/openclaw)
- [Discord 社区](https://discord.gg/clawd)
- [安装脚本源码](https://openclaw.ai/install.sh)
