# Tasks: OpenClaw 安装指南

## 1. 准备工作

- [ ] 1.1 创建文档目录结构 `docs/install-guide/`
- [ ] 1.2 从调研文档中提取各平台安装步骤和常见问题

## 2. 安装指南总览文档

- [ ] 2.1 编写 `docs/install-guide/README.md`
  - 项目定位说明
  - 快速开始（一键安装命令）
  - 平台选择指引表格
  - 各平台文档链接
  - 常见问题链接

## 3. Linux 安装指南

- [ ] 3.1 编写 `docs/install-guide/linux.md`
  - 系统要求（Node.js 22+）
  - 安装 Node.js（NodeSource / nvm）
  - 安装 OpenClaw（脚本 / npm / pnpm / 源码）
  - 中国大陆网络优化（镜像源、代理配置）
  - 安装验证步骤（doctor / status / dashboard）
  - 更新与卸载

## 4. macOS 安装指南

- [ ] 4.1 编写 `docs/install-guide/macos.md`
  - 系统要求（Node.js 22+）
  - 安装 Node.js（Homebrew / 官方包 / nvm）
  - 安装 OpenClaw（macOS 应用 / 脚本 / npm / pnpm / 源码）
  - macOS 特殊配置（权限授权、菜单栏应用）
  - 中国大陆网络优化
  - 安装验证步骤
  - 更新与卸载

## 5. Windows 安装指南

- [ ] 5.1 编写 `docs/install-guide/windows.md`
  - 系统要求（WSL2 强烈推荐）
  - 安装 WSL2 详细步骤
  - 在 WSL2 中安装（参考 Linux 指南）
  - 原生 Windows 安装（PowerShell）
    - 安装 Node.js（官方安装包）
    - 安装 OpenClaw（PowerShell 脚本 / npm）
  - 中国大陆网络优化
  - 安装验证步骤
  - 更新与卸载

## 6. Docker 安装指南

- [ ] 6.1 编写 `docs/install-guide/docker.md`
  - 系统要求（Docker Desktop / Docker Engine）
  - 快速启动（docker-setup.sh）
  - 使用远程镜像（OPENCLAW_IMAGE）
  - 访问 Gateway（http://127.0.0.1:18789/）
  - 配置持久化（volume 挂载）
  - 健康检查
  - 常见 Docker 问题

## 7. 常见问题排查手册

- [ ] 7.1 编写 `docs/install-guide/troubleshooting.md`
  - PATH 环境变量问题（诊断 + 修复）
  - sharp 构建错误（macOS）
  - pnpm 构建脚本警告
  - Gateway 服务无法启动（macOS / Linux）
  - Node.js 版本不匹配
  - 权限问题（EACCES）
  - 更新 OpenClaw
  - 卸载 OpenClaw
  - 网络问题（中国大陆）
  - WSL2 常见问题

## 8. README.md 更新

- [ ] 8.1 更新项目根目录 `README.md`
  - 项目定位（一句话说明）
  - 快速开始（一键安装命令）
  - 平台选择指引表格
  - 文档链接（指向 docs/install-guide/）
  - 常见问题链接
  - 贡献指南（可选）

## 9. 验证与测试

- [ ] 9.1 检查所有文档链接是否正确
- [ ] 9.2 验证所有命令示例是否可执行
- [ ] 9.3 检查文档格式是否符合 Markdown 规范
- [ ] 9.4 运行 `openspec validate explore-install-guide` 验证 OpenSpec 格式

## 10. 完成与归档

- [ ] 10.1 提交所有文档变更到 Git
- [ ] 10.2 运行 `openspec archive explore-install-guide` 归档变更

---

**任务总数**: 19
**预计工时**: 4-6 小时
**优先级**: P0（核心文档）
