## Context

Easy OpenClaw 是一个 Electron 桌面应用，后端已使用 Fastify + TypeScript 实现。现在需要构建前端界面，目标是让不懂技术的用户也能轻松安装和配置 OpenClaw。

**约束条件**:
- 必须与现有后端 API 完美对接（localhost:18790）
- 必须与现有 Electron IPC 通信
- 仅支持中文界面
- 目标用户：小白用户、普通用户、进阶用户

**技术背景**:
- 后端 API 已完成：`/api/system/*`, `/api/install/*`, `/api/models/*`, `/api/channels/*`, `/api/gateway/*`
- Electron 主进程已完成：`electron/main.ts`, `electron/preload.ts`, `electron/ipc/*`
- 共享类型已定义：`shared/types.ts`

## Goals / Non-Goals

**Goals:**
- 实现**极简主义**界面，每屏只做一件事
- 实现**渐进式引导**，分步骤完成复杂任务
- 实现**即时反馈**，每个操作都有明确响应
- 实现**容错设计**，用户不会迷失
- 实现**一致性**，统一的设计系统和组件库
- 支持安装向导、AI 模型配置、消息渠道配置、仪表盘四大核心功能

**Non-Goals:**
- 不实现 OpenClaw Dashboard（由 OpenClaw 本体提供）
- 不实现复杂的日志查看器
- 不实现多语言支持
- 不实现多用户管理
- 不实现云端同步

## Decisions

### 1. 框架选择：React 19 + Vite

**理由**:
- React 19 生态成熟，组件丰富
- Vite 提供快速开发体验，HMR 速度快
- 与 Electron 兼容性好

**备选方案**:
- Vue 3 + Vite：生态较小，组件库选择少
- Svelte + Vite：生态更小，团队不熟悉

### 2. 样式方案：Tailwind CSS 4 + shadcn/ui

**理由**:
- Tailwind CSS 4 原子化 CSS，快速开发
- shadcn/ui 提供无样式组件 + 预设样式，可定制性强
- 与设计系统色彩、字体、间距规范一致

**备选方案**:
- CSS Modules：需要手写 CSS，开发效率低
- Styled Components：运行时开销，性能差

### 3. 状态管理：Zustand + TanStack Query

**理由**:
- Zustand 轻量级，API 简单，TypeScript 友好
- TanStack Query 处理服务端状态，自动缓存、重试
- 两者配合，职责清晰

**备选方案**:
- Redux Toolkit：过于复杂，小题大做
- Jotai/Recoil：生态较小

### 4. 动画方案：Framer Motion

**理由**:
- 流畅的过渡动画，提升用户体验
- API 简单，声明式
- 与 React 19 兼容

**备选方案**:
- React Spring：API 复杂
- CSS Transitions：功能有限

### 5. 页面结构

```
Welcome → Install → ModelsConfig → Complete
                         ↓
                    Dashboard ← ChannelsConfig
```

**设计理念**:
- 首次用户：走完整安装向导
- 老用户：直接进入 Dashboard

### 6. 组件架构

```
pages/           # 页面组件（路由级别）
components/
  ui/            # 基础 UI 组件（Button, Card, Input...）
  layout/        # 布局组件（AppLayout, Sidebar, Header）
  install/       # 安装相关组件（InstallWizard, StepProgress, LogViewer）
  models/        # 模型配置组件（ProviderCard, ModelSelector, ApiKeyInput）
  channels/      # 渠道配置组件（ChannelCard, ConfigForm, TestButton）
hooks/           # 自定义 Hooks（useInstall, useSystemInfo, useConfig）
stores/          # Zustand 状态（appStore, installStore）
services/        # API 服务（api, system, install, config）
```

## Risks / Trade-offs

**[Risk 1] SSE 事件流兼容性**
- 风险：浏览器 SSE 支持不一致，可能导致安装进度显示异常
- 缓解：使用 `eventsource` 库，添加心跳检测和重连机制

**[Risk 2] Electron IPC 通信延迟**
- 风险：IPC 通信可能导致 UI 卡顿
- 缓解：使用异步通信，添加 Loading 状态，避免阻塞主线程

**[Risk 3] Tailwind CSS 打包体积**
- 风险：未使用的 CSS 类可能增加打包体积
- 缓解：启用 Tailwind JIT 模式，PurgeCSS 清理未使用样式

**[Risk 4] API Key 安全存储**
- 风险：前端无法安全存储敏感信息
- 缓解：API Key 仅存储在后端配置文件，前端只显示脱敏版本

**[Risk 5] 网络请求失败处理**
- 风险：后端服务未启动或网络异常时，前端无法正常工作
- 缓解：添加健康检查，优雅降级，重试机制

**Trade-offs**:
- **性能 vs 功能**：Framer Motion 动画可能影响性能，但提升用户体验
- **简洁 vs 完整**：不实现日志查看器，但减少维护成本
- **定制 vs 效率**：使用 shadcn/ui 减少 UI 开发时间，但定制性受限
