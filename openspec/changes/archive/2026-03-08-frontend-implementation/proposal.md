## Why

Easy OpenClaw 需要一个**超级友好且操作简易、界面干净**的前端应用，让不懂技术的用户也能轻松安装和配置 OpenClaw。当前后端已完成，但缺乏可视化界面，用户仍需通过命令行操作，这与"零门槛"的目标相悖。

## What Changes

- **新增 React 19 前端应用**：基于 Vite + Tailwind CSS 4 + shadcn/ui 构建现代化 UI
- **新增安装向导页面**：分步骤引导用户完成 OpenClaw 安装，实时显示进度
- **新增 AI 模型配置界面**：支持 16+ AI 提供商的可视化配置，包括 API Key 输入、模型选择、自定义 API 地址
- **新增消息渠道配置界面**：支持 7 种消息渠道的可视化配置，包括 Telegram、Discord、WhatsApp 等
- **新增仪表盘页面**：显示系统状态、Gateway 运行状态、快速操作入口
- **新增设计系统**：统一的色彩、字体、间距、组件规范
- **新增状态管理**：Zustand + TanStack Query 实现全局状态和数据缓存
- **新增 IPC 通信层**：Electron 渲染进程与主进程的通信桥接

## Capabilities

### New Capabilities

- `welcome-page`: 欢迎页面，展示应用价值主张，引导用户开始安装
- `install-wizard`: 安装向导，分步骤执行安装流程，SSE 实时进度显示
- `models-config`: AI 模型配置界面，支持 16+ 提供商的可视化配置
- `channels-config`: 消息渠道配置界面，支持 7 种渠道的可视化配置
- `dashboard`: 仪表盘页面，显示系统状态和快速操作入口
- `design-system`: 设计系统，包含色彩、字体、间距、组件规范
- `state-management`: 状态管理，Zustand store 和 TanStack Query hooks
- `electron-ipc`: Electron IPC 通信层，渲染进程与主进程的桥接

### Modified Capabilities

(无 - 这是全新的前端实现)

## Impact

**新增代码**:
- `frontend/` 目录：完整的 React 应用
- `electron/preload.ts`：IPC 桥接脚本

**依赖**:
- React 19、React Router 7
- Vite 6、TypeScript 5.6
- Tailwind CSS 4、shadcn/ui
- Zustand 5、TanStack Query 5
- Framer Motion 11、Lucide Icons

**API 调用**:
- `/api/system/*` - 系统检测
- `/api/install/*` - 安装流程
- `/api/models/*` - 模型配置
- `/api/channels/*` - 渠道配置
- `/api/gateway/*` - Gateway 管理

**影响范围**:
- 需要与已完成后端 API 完美对接
- 需要与已完成 Electron 主进程 IPC 通信
