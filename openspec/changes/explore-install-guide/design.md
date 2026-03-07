# Design: OpenClaw 安装指南

## Context

### 背景

easy-openclaw 项目定位为 **OpenClaw 最佳安装体验** 的安装器项目。当前项目已有详尽的调研文档：

- `docs/plan/openclaw-install-ways.md` - 覆盖 Linux/macOS/Windows/Docker 的安装方案调研
- `docs/plan/openclaw-installer-analysis.md` - Installer 架构分析（配置系统、安全机制、Docker 方案）

但缺乏面向最终用户的安装指南文档。

### 当前状态

- ✅ 调研文档完善（技术细节充足）
- ✅ 安装方案清晰（多平台多方式）
- ❌ 缺少用户友好的安装指南
- ❌ README.md 几乎为空（仅 2 行）
- ❌ 无常见问题排查手册

### 约束

1. **纯文档变更** - 不涉及任何代码修改
2. **基于已有调研** - 不重复造轮子，将调研成果结构化
3. **中文优先** - 目标用户主要为中国大陆开发者
4. **Markdown 格式** - 使用 GitHub Flavored Markdown

### 相关方

- **主要受众**: 首次安装 OpenClaw 的用户（各技术水平）
- **次要受众**: 需要排查安装问题的用户
- **维护者**: easy-openclaw 项目贡献者

---

## Goals / Non-Goals

### Goals

1. **创建完整的安装指南体系** - 覆盖 Linux/macOS/Windows(WSL2)/Docker 四大平台
2. **降低安装门槛** - 任何技术水平的用户都能在 10 分钟内完成安装
3. **提供清晰的快速路径** - 用户无需阅读全部文档即可找到最适合自己的安装方式
4. **解决中国大陆网络问题** - 提供镜像源、代理配置、自定义 API Proxy 等方案
5. **提供验证清单** - 安装后可逐步验证是否成功
6. **提供排错手册** - 覆盖已知的 10+ 常见问题

### Non-Goals

1. **不涉及代码修改** - 本设计仅关注文档层面
2. **不创建新的安装脚本** - 使用 OpenClaw 官方提供的安装方式
3. **不翻译为英文** - 当前仅提供中文版本
4. **不涵盖高级配置** - 如自定义技能开发、多实例部署等（可在后续迭代中添加）
5. **不替代官方文档** - 本指南是指向官方文档的快速入口，而非完整替代

---

## Decisions

### D1: 文档结构设计

**决策**: 采用平台分目录结构 + 总览 README

```
docs/
└── install-guide/
    ├── README.md              # 安装指南总览 & 快速开始
    ├── linux.md               # Linux 安装指南
    ├── macos.md               # macOS 安装指南
    ├── windows.md             # Windows 安装指南（含 WSL2）
    ├── docker.md              # Docker 安装指南
    └── troubleshooting.md     # 常见问题排查手册
```

**理由**:
- ✅ 按平台分离，避免单文件过长
- ✅ 用户可快速定位自己平台的文档
- ✅ 便于后续维护和扩展

**备选方案**:
- ❌ 单文件包含所有平台 - 文件过长，难以维护
- ❌ 按安装方式分类（脚本/npm/源码） - 用户通常关心的是"我的平台怎么装"

### D2: 安装方式优先级

**决策**: 在每个平台指南中，按以下顺序排列安装方式：

1. **安装脚本**（推荐）- `curl -fsSL https://openclaw.ai/install.sh | bash`
2. **平台应用**（macOS 专属）- OpenClaw.app
3. **包管理器** - npm / pnpm
4. **源码构建** - 适合高级用户

**理由**:
- ✅ 安装脚本最简单，适合大多数用户
- ✅ 平台应用提供 GUI 体验（macOS）
- ✅ 包管理器适合已有 Node.js 环境的用户
- ✅ 源码构建满足高级用户需求

### D3: 中国大陆网络优化策略

**决策**: 在每个平台指南中包含"中国大陆网络优化"章节

**内容包括**:
1. **npm 镜像源配置**
   ```bash
   npm config set registry https://registry.npmmirror.com
   ```

2. **Node.js 镜像下载**
   - 淘宝镜像: https://npmmirror.com/mirrors/node/

3. **自定义 API Proxy 配置**
   - 环境变量方式: `ANTHROPIC_BASE_URL` / `OPENAI_BASE_URL`
   - OpenClaw 配置文件方式: `openclaw.json` 中的自定义 Provider

**理由**:
- ✅ 解决中国大陆用户的核心痛点
- ✅ 基于已有调研（`openclaw-installer-analysis.md` 中的自定义 Provider 机制）

### D4: 验证清单设计

**决策**: 提供逐步验证流程

```bash
# 1. 检查命令可用性
openclaw --version

# 2. 检查配置问题
openclaw doctor

# 3. 查看网关状态
openclaw status

# 4. 打开控制面板
openclaw dashboard

# 5. 健康检查
openclaw health
```

**理由**:
- ✅ 逐步验证，用户可快速定位问题
- ✅ 覆盖从"命令是否可用"到"服务是否正常"的全链路

### D5: 常见问题手册内容

**决策**: 基于调研文档中的常见问题，整理为独立章节

**覆盖问题**:
1. PATH 环境变量问题
2. `sharp` 构建错误（macOS）
3. pnpm 构建脚本警告
4. Gateway 服务无法启动
5. Node.js 版本不匹配
6. 权限问题（EACCES）
7. 更新 OpenClaw
8. 卸载 OpenClaw

**理由**:
- ✅ 基于实际用户反馈（调研文档中已记录）
- ✅ 每个问题提供具体修复命令

### D6: README.md 更新策略

**决策**: README.md 包含以下内容：

1. **项目定位** - 一句话说明 easy-openclaw 是什么
2. **快速开始** - 一键安装命令（最推荐的方式）
3. **平台选择指引** - 表格列出各平台的推荐安装方式
4. **文档链接** - 指向 `docs/install-guide/` 各平台指南
5. **常见问题链接** - 指向 troubleshooting.md

**理由**:
- ✅ README 是用户的第一入口，需要快速引导
- ✅ 不在 README 中重复详细步骤，保持简洁

---

## Risks / Trade-offs

### Risk 1: 文档与实际安装步骤不同步

**风险**: OpenClaw 官方更新安装方式后，文档未及时更新

**缓解措施**:
- 在每个文档中添加"最后更新时间"
- 在 README 中说明"如遇到问题，请先查看官方文档"
- 提供官方文档链接作为补充

### Risk 2: 中国大陆网络环境变化

**风险**: npm 镜像源或代理服务可能失效

**缓解措施**:
- 提供多个镜像源选项（淘宝、腾讯云等）
- 在 troubleshooting.md 中添加"网络问题"章节
- 建议用户使用稳定的代理服务

### Risk 3: 用户技术水平差异

**风险**: 文档可能对新手太复杂，或对高级用户太简单

**缓解措施**:
- 在每个平台指南中标记"推荐路径"（加粗显示）
- 提供"快速开始"和"详细步骤"两种阅读路径
- 在 troubleshooting 中使用"问题-解决方案"格式，便于搜索

### Risk 4: WSL2 安装复杂度

**风险**: Windows 用户可能不熟悉 WSL2，导致安装失败

**缓解措施**:
- 在 Windows 指南中优先推荐 WSL2
- 提供 WSL2 安装的详细步骤
- 在 troubleshooting 中添加 WSL2 常见问题

### Trade-off: 文档详细度 vs 可维护性

**权衡**: 文档越详细，用户越容易理解，但维护成本越高

**决策**:
- 在"快速开始"中提供最简步骤
- 在平台指南中提供详细步骤和解释
- 在 troubleshooting 中提供问题导向的解决方案
- 避免在多个地方重复相同内容（使用链接）

---

## Migration Plan

### 阶段 1: 文档创建（本次变更）

1. 创建 `docs/install-guide/` 目录结构
2. 编写各平台安装指南
3. 编写 troubleshooting.md
4. 更新 README.md

### 阶段 2: 验证与迭代（后续）

1. 邀请用户测试安装指南
2. 收集反馈并更新文档
3. 根据实际问题扩充 troubleshooting

### 回滚策略

由于本次为纯文档变更，回滚策略简单：

```bash
# 删除新增文档
rm -rf docs/install-guide/

# 恢复 README.md（使用 git）
git checkout README.md
```

---

## Open Questions

1. **是否需要视频教程？**
   - 文档中是否需要嵌入视频教程链接？
   - 如果需要，放在哪里？

2. **是否需要多语言支持？**
   - 当前仅提供中文，是否需要英文版本？
   - 优先级如何？

3. **是否需要 PDF 版本？**
   - 某些用户可能需要离线文档
   - 是否需要提供 PDF 下载？

4. **文档版本管理策略？**
   - 如何跟踪文档版本与 OpenClaw 版本的对应关系？
   - 是否需要在文档中标注"适用于 OpenClaw X.Y.Z"？

---

**文档版本**: 1.0
**最后更新**: 2026-03-07
**作者**: OpenSpec 自动生成
