# Proposal: OpenClaw 安装指南

## Why

easy-openclaw 定位为 **OpenClaw 最佳安装体验**的安装器项目。当前问题：

1. **安装门槛高** — OpenClaw 跨平台（macOS / Linux / Windows / Docker）安装步骤复杂，用户需要自行解决 Node.js 版本、PATH 配置、npm 权限等问题，极易出错
2. **缺乏统一指南** — 各平台安装方式（脚本、npm、pnpm、源码、Docker）分散，没有一份权威、完整的最佳实践文档
3. **中国大陆用户痛点** — 网络访问限制导致安装中断，自定义 API Proxy 配置复杂
4. **配置后验证缺失** — 用户安装完成后不知道如何验证是否成功，常见错误无法快速排查
5. **现有分析未落地** — `docs/plan/` 下已有详尽的调研文档（安装方式分析 + Installer 架构分析），但尚未形成面向用户的安装指南

**解决的核心问题**: 让任何技术水平的用户，在任何平台上，能在 10 分钟内成功安装并运行 OpenClaw。

---

## What Changes

### 1. 创建完整安装指南文档体系

基于 `docs/plan/openclaw-install-ways.md` 和 `docs/plan/openclaw-installer-analysis.md` 的调研成果，创建面向用户的安装指南：

```
docs/
└── install-guide/
    ├── README.md                  # 安装指南总览 & 快速开始
    ├── linux.md                   # Linux 安装指南
    ├── macos.md                   # macOS 安装指南
    ├── windows.md                 # Windows 安装指南（含 WSL2）
    ├── docker.md                  # Docker 安装指南
    └── troubleshooting.md         # 常见问题排查手册
```

### 2. 更新 README.md

当前 README.md 仅有 2 行（项目名 + 一句话描述），需补充：
- 项目定位说明
- 快速开始（一键安装命令）
- 平台选择指引
- 文档链接

### 3. 核心内容制作

**每个平台指南包含**：
- 系统要求（Node.js 22+、OS 版本等）
- 推荐安装方式（加粗首选路径）
- 备选安装方式（npm / pnpm / 源码）
- 中国大陆网络优化（镜像源、代理配置、自定义 API Proxy）
- 安装验证步骤（`openclaw doctor` / `openclaw status`）

**常见问题手册包含**：
- PATH 环境变量问题
- `sharp` 构建错误（macOS）
- pnpm 构建脚本警告
- Gateway 服务无法启动
- Node.js 版本不匹配

---

## Capabilities

### 新增能力

| 能力 | 描述 |
|------|------|
| **平台指南** | 覆盖 Linux / macOS / Windows(WSL2) / Docker 四平台完整安装文档 |
| **快速安装路径** | 每个平台标记"最佳路径"，用户无需阅读全部内容即可完成安装 |
| **网络优化指南** | 针对中国大陆用户的 npm 镜像、API Proxy 配置说明 |
| **验证清单** | 安装后的逐步验证流程，确认安装成功 |
| **排错手册** | 覆盖已知的 10+ 常见问题，含具体修复命令 |

### 修改能力

| 能力 | 当前状态 | 修改后 |
|------|---------|--------|
| **README.md** | 2 行空白 | 完整项目介绍 + 快速开始 + 文档导航 |
| **文档结构** | 仅 `docs/plan/`（内部调研） | 增加 `docs/install-guide/`（面向用户） |

---

## Impact

### 用户影响

- **首次安装用户** — 安装成功率大幅提升，从"需要搜索解决方案"变为"文档内直接找到答案"
- **中国大陆用户** — 专项优化，解决网络访问和 API 代理配置问题
- **不同技术水平** — 提供"一键安装脚本"（低门槛）和"从源码构建"（高级用户）两条路径

### 项目影响

- **范围**: 纯文档变更，不涉及任何代码修改
- **新增文件**: `docs/install-guide/` 目录下 6 个 Markdown 文件
- **修改文件**: `README.md`（现有内容仅 2 行，近乎重写）
- **无破坏性变更**: 不影响任何现有功能

### 内容来源

基于项目已有调研成果：
- `docs/plan/openclaw-install-ways.md` — 多平台安装方案（Node.js / OpenClaw 各方法）
- `docs/plan/openclaw-installer-analysis.md` — Installer 架构分析（配置系统、安全机制、Docker 方案）

两份调研文档已覆盖所有必要的技术细节，安装指南是这些调研的**结构化落地**。
