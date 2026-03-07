# easy-openclaw

**OpenClaw 最佳安装体验** — 为 Linux、macOS、Windows 和 Docker 提供一键安装和详细指南。

## 快速开始

一键安装（推荐）：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

安装完成后，验证安装：

```bash
openclaw doctor
```

## 选择安装平台

| 平台 | 推荐方式 | 安装指南 |
|------|----------|----------|
| **Linux** | 安装脚本 | [Linux 安装指南](docs/install-guide/linux.md) |
| **macOS** | macOS 应用 / 安装脚本 | [macOS 安装指南](docs/install-guide/macos.md) |
| **Windows** | WSL2 + 安装脚本 | [Windows 安装指南](docs/install-guide/windows.md) |
| **Docker** | docker-compose | [Docker 安装指南](docs/install-guide/docker.md) |

> **Windows 用户**：强烈建议使用 WSL2 方式，可获得与 Linux 完全一致的体验。

## 中国大陆网络优化

安装前配置 npm 镜像源可大幅加速下载：

```bash
npm config set registry https://registry.npmmirror.com
```

如需配置 AI API 代理，参见各平台指南中的"中国大陆网络优化"章节。

## 文档

- [安装指南总览](docs/install-guide/README.md) — 平台选择和快速开始
- [Linux 安装指南](docs/install-guide/linux.md)
- [macOS 安装指南](docs/install-guide/macos.md)
- [Windows 安装指南](docs/install-guide/windows.md)
- [Docker 安装指南](docs/install-guide/docker.md)
- [常见问题排查](docs/install-guide/troubleshooting.md)
- [系统要求](docs/install-guide/requirements.md)

## 常见问题

遇到安装问题？查阅[常见问题排查手册](docs/install-guide/troubleshooting.md)，涵盖：

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
