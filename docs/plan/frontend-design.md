# Easy OpenClaw 前端设计方案

> 版本: 1.0.0
> 更新时间: 2026-03-07
> 目标: 超级友好且操作简易、界面干净的配置界面

---

## 📋 目录

1. [设计目标](#1-设计目标)
2. [技术选型](#2-技术选型)
3. [整体架构](#3-整体架构)
4. [设计系统](#4-设计系统)
5. [页面设计](#5-页面设计)
6. [核心组件](#6-核心组件)
7. [交互设计](#7-交互设计)
8. [状态管理](#8-状态管理)
9. [响应式设计](#9-响应式设计)
10. [无障碍设计](#10-无障碍设计)

---

## 1. 设计目标

### 1.1 核心原则

| 原则 | 说明 | 实现方式 |
|------|------|---------|
| **极简主义** | 界面干净，无多余元素 | 留白充足，每屏只做一件事 |
| **渐进式引导** | 分步骤完成复杂任务 | 向导式流程，清晰的进度指示 |
| **即时反馈** | 每个操作都有明确响应 | Loading 状态、成功/失败提示 |
| **容错设计** | 用户不会迷失 | 清晰的返回路径，撤销功能 |
| **一致性** | 相同功能相同交互 | 统一的设计系统和组件库 |

### 1.2 目标用户体验

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户旅程地图                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  首次用户:                                                       │
│  打开应用 → 看到欢迎页 → 点击"开始安装" → 等待安装 → 配置 AI → 完成 │
│     │           │            │            │           │        │
│     ▼           ▼            ▼            ▼           ▼        │
│  5秒内知道    明确下一步     实时进度      只需填API Key   庆祝动画  │
│  这是什么                                                 │
│                                                                 │
│  老用户:                                                         │
│  打开应用 → 看到状态页 → 快速切换配置 → 测试连接 → 关闭           │
│     │           │            │            │                    │
│     ▼           ▼            ▼            ▼                    │
│  1秒内知道    当前状态      2次点击      即时反馈               │
│  服务状态                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 设计边界

**✅ 必须实现:**
- 安装向导 (分步骤引导)
- AI 模型配置界面 (16+ 提供商)
- 消息渠道配置界面 (7 种渠道)
- 实时进度显示
- 错误提示和解决方案

**❌ 不实现:**
- OpenClaw Dashboard (由 OpenClaw 本体提供)
- 复杂的日志查看器
- 多语言 (仅中文)

---

## 2. 技术选型

### 2.1 核心技术栈

| 层级 | 技术 | 理由 |
|------|------|------|
| **框架** | React 19 | 生态成熟，组件丰富 |
| **构建** | Vite | 快速开发体验 |
| **样式** | Tailwind CSS 4 | 原子化 CSS，快速开发 |
| **组件库** | Radix UI + shadcn/ui | 无样式组件 + 预设样式 |
| **状态** | Zustand | 轻量级状态管理 |
| **请求** | TanStack Query | 数据获取和缓存 |
| **动画** | Framer Motion | 流畅的过渡动画 |
| **图标** | Lucide Icons | 清晰的图标集 |

### 2.2 目录结构

```
frontend/
├── src/
│   ├── main.tsx                 # 应用入口
│   ├── App.tsx                  # 根组件
│   │
│   ├── pages/                   # 页面组件
│   │   ├── Welcome.tsx          # 欢迎页
│   │   ├── Install.tsx          # 安装页
│   │   ├── Dashboard.tsx        # 仪表盘
│   │   ├── ModelsConfig.tsx     # 模型配置
│   │   └── ChannelsConfig.tsx   # 渠道配置
│   │
│   ├── components/              # 组件库
│   │   ├── ui/                  # 基础 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Progress.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/              # 布局组件
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   │
│   │   ├── install/             # 安装相关组件
│   │   │   ├── InstallWizard.tsx
│   │   │   ├── StepProgress.tsx
│   │   │   └── LogViewer.tsx
│   │   │
│   │   ├── models/              # 模型配置组件
│   │   │   ├── ProviderCard.tsx
│   │   │   ├── ModelSelector.tsx
│   │   │   └── ApiKeyInput.tsx
│   │   │
│   │   └── channels/            # 渠道配置组件
│   │       ├── ChannelCard.tsx
│   │       ├── ConfigForm.tsx
│   │       └── TestButton.tsx
│   │
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useInstall.ts        # 安装流程
│   │   ├── useSystemInfo.ts     # 系统信息
│   │   └── useConfig.ts         # 配置管理
│   │
│   ├── stores/                  # Zustand 状态
│   │   ├── appStore.ts          # 应用状态
│   │   └── installStore.ts      # 安装状态
│   │
│   ├── services/                # API 服务
│   │   ├── api.ts               # API 客户端
│   │   ├── system.ts            # 系统 API
│   │   ├── install.ts           # 安装 API
│   │   └── config.ts            # 配置 API
│   │
│   └── styles/                  # 样式文件
│       ├── globals.css          # 全局样式
│       └── themes/              # 主题配置
│
├── public/
│   └── assets/
│       ├── icons/
│       └── illustrations/
│
└── electron/                    # Electron 相关
    └── preload.ts               # IPC 桥接
```

---

## 3. 整体架构

### 3.1 前端架构图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Electron Renderer                               │
│                         (Chromium + React)                               │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
        ┌─────────────────────────────┴─────────────────────────────┐
        │                                                           │
        ▼                                                           ▼
┌───────────────────┐                                     ┌───────────────────┐
│     Pages         │                                     │   Electron IPC    │
│                   │                                     │                   │
│ • Welcome         │                                     │ • ipcRenderer     │
│ • Install         │◄────────────────────────────────────┤ • preload.ts      │
│ • Dashboard       │                                     │                   │
│ • ModelsConfig    │                                     └───────────────────┘
│ • ChannelsConfig  │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│   Components      │
│                   │
│ • Layout          │
│ • UI Components   │
│ • Feature Modules │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│   State Layer     │
│                   │
│ • Zustand Store   │
│ • TanStack Query  │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│   Service Layer   │
│                   │
│ • API Client      │──────► Fastify Backend (localhost:18790)
│ • IPC Client      │──────► Electron Main Process
└───────────────────┘
```

### 3.2 数据流

```
用户操作
    │
    ▼
React 组件
    │
    ├── 调用 Hook (useInstall, useConfig)
    │         │
    │         ▼
    │    TanStack Query (自动缓存、重试)
    │         │
    │         ▼
    │    Service (api.install.start())
    │         │
    │         ▼
    │    Fastify Backend (HTTP)
    │         │
    │         ▼
    │    Service 层执行
    │
    └── 更新 Zustand Store (全局状态)
              │
              ▼
         UI 响应式更新
```

---

## 4. 设计系统

### 4.1 色彩系统

```css
/* 主色调 - 温暖的橙色 (与 OpenClaw 品牌一致) */
--primary-50: #fff7ed;
--primary-100: #ffedd5;
--primary-200: #fed7aa;
--primary-300: #fdba74;
--primary-400: #fb923c;
--primary-500: #f97316;  /* 主色 */
--primary-600: #ea580c;
--primary-700: #c2410c;

/* 中性色 - 冷灰色 */
--neutral-50: #fafafa;
--neutral-100: #f5f5f5;
--neutral-200: #e5e5e5;
--neutral-300: #d4d4d4;
--neutral-400: #a3a3a3;
--neutral-500: #737373;
--neutral-600: #525252;
--neutral-700: #404040;
--neutral-800: #262626;
--neutral-900: #171717;

/* 语义色 */
--success: #22c55e;
--warning: #eab308;
--error: #ef4444;
--info: #3b82f6;
```

### 4.2 字体系统

```css
/* 字体家族 */
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
             "Helvetica Neue", Arial, "Noto Sans SC", sans-serif;
--font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", 
             Consolas, monospace;

/* 字体大小 */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* 行高 */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### 4.3 间距系统

```css
/* 8px 基准网格 */
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### 4.4 圆角系统

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-2xl: 1.5rem;   /* 24px */
--radius-full: 9999px;
```

### 4.5 阴影系统

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

---

## 5. 页面设计

### 5.1 页面流程

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           应用启动                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────┐
                        │  检测安装状态      │
                        └───────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
          ┌─────────────────┐             ┌─────────────────┐
          │   未安装        │             │   已安装        │
          │                 │             │                 │
          │   Welcome 页    │             │   Dashboard 页  │
          │   (安装向导)     │             │   (状态 + 配置)  │
          └─────────────────┘             └─────────────────┘
                    │                               │
                    ▼                               │
          ┌─────────────────┐                       │
          │   Install 页    │                       │
          │   (安装进度)     │                       │
          └─────────────────┘                       │
                    │                               │
                    ▼                               │
          ┌─────────────────┐                       │
          │   ModelsConfig  │◄──────────────────────┤
          │   (AI 配置)      │                       │
          └─────────────────┘                       │
                    │                               │
                    ▼                               │
          ┌─────────────────┐                       │
          │   Complete 页   │                       │
          │   (安装完成)     │                       │
          └─────────────────┘                       │
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
                          ┌─────────────────┐
                          │   Dashboard     │
                          │   (主界面)       │
                          └─────────────────┘
```

### 5.2 欢迎页 (Welcome)

**目的:** 第一印象，引导用户开始安装

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                                                                         │
│                              🦞                                         │
│                                                                         │
│                     欢迎使用 Easy OpenClaw                               │
│                                                                         │
│              让 AI 助手安装变得简单，只需三步即可完成                      │
│                                                                         │
│                                                                         │
│         ┌─────────────────────────────────────────────────┐            │
│         │                                                 │            │
│         │     ✓ 自动检测系统环境                           │            │
│         │     ✓ 一键安装所有依赖                           │            │
│         │     ✓ 可视化配置 AI 模型                         │            │
│         │                                                 │            │
│         └─────────────────────────────────────────────────┘            │
│                                                                         │
│                                                                         │
│                    ┌───────────────────────┐                            │
│                    │                       │                            │
│                    │    开始安装    →      │  ← 主按钮                  │
│                    │                       │                            │
│                    └───────────────────────┘                            │
│                                                                         │
│                                                                         │
│              已安装？点击这里打开 Dashboard                              │  ← 次要链接
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**设计要点:**
- 大量留白，视觉焦点集中
- 清晰的价值主张
- 单一主操作按钮

### 5.3 安装页 (Install)

**目的:** 显示安装进度，让用户了解每一步

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   ← 返回                                                                │
│                                                                         │
│   正在安装 OpenClaw...                                                  │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                                                                 │  │
│   │   ✓ 检查系统环境                              完成              │  │
│   │       已检测到 macOS 14.0, Apple Silicon                        │  │
│   │                                                                 │  │
│   │   ✓ 安装 Node.js                              完成              │  │
│   │       Node.js 22.11.0 已安装                                    │  │
│   │                                                                 │  │
│   │   ◉ 安装 OpenClaw                             进行中...         │  │
│   │       npm install -g openclaw@latest                            │  │
│   │       ████████████░░░░░░░░░░░░░░░░░░░░░░  45%                   │  │
│   │                                                                 │  │
│   │       下载中: openclaw@1.2.0                                    │  │
│   │       已下载: 2.3 MB / 5.1 MB                                   │  │
│   │                                                                 │  │
│   │   ○ 创建配置目录                              等待中             │  │
│   │   ○ 验证安装                                  等待中             │  │
│   │                                                                 │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│                                                                         │
│   预计剩余时间: 约 2 分钟                                                │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │   💡 安装过程中请勿关闭此窗口                                     │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**设计要点:**
- 实时进度显示 (SSE 流)
- 每一步都有明确状态 (完成/进行中/等待)
- 显示预计时间
- 可展开查看详细日志

### 5.4 模型配置页 (ModelsConfig)

**目的:** 让用户轻松配置 AI 提供商

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   AI 模型配置                                                           │
│   选择你想使用的 AI 服务商                                               │
│                                                                         │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
│   │ 🟣 Anthropic    │  │ 🟢 OpenAI       │  │ 🔵 DeepSeek     │        │
│   │                 │  │                 │  │                 │        │
│   │ Claude 系列     │  │ GPT 系列        │  │ 高性价比        │        │
│   │                 │  │                 │  │                 │        │
│   │ [推荐]          │  │                 │  │                 │        │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘        │
│                                                                         │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
│   │ 🌙 Kimi         │  │ 🔴 Google       │  │ 🔄 OpenRouter   │        │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘        │
│                                                                         │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
│   │ ⚡ Groq         │  │ 🌬️ Mistral     │  │ 🟠 Ollama       │        │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘        │
│                                                                         │
│   查看更多提供商...                                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

点击某个提供商后弹出配置面板:

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                                                                 │  │
│   │   🟣 Anthropic Claude                                           │  │
│   │   最强大的 AI 助手                                               │  │
│   │                                                                 │  │
│   │   ─────────────────────────────────────────────────────────     │  │
│   │                                                                 │  │
│   │   API Key *                                                     │  │
│   │   ┌─────────────────────────────────────────────────────────┐   │  │
│   │   │ sk-ant-api03-xxxx...                              👁️  │   │  │
│   │   └─────────────────────────────────────────────────────────┘   │  │
│   │   获取 API Key →                                                 │  │
│   │                                                                 │  │
│   │   模型选择                                                      │  │
│   │   ┌─────────────────────────────────────────────────────────┐   │  │
│   │   │ Claude Sonnet 4.5 (推荐)                            ▼  │   │  │
│   │   └─────────────────────────────────────────────────────────┘   │  │
│   │   ○ Claude Sonnet 4.5 - 平衡性能与速度 (推荐)                   │  │
│   │   ○ Claude Opus 4.5 - 最强性能                                 │  │
│   │   ○ Claude Haiku 4.5 - 最快速度                                │  │
│   │                                                                 │  │
│   │   ─────────────────────────────────────────────────────────     │  │
│   │                                                                 │  │
│   │   高级设置 (可选)                                           ▼  │  │
│   │                                                                 │  │
│   │   ─────────────────────────────────────────────────────────     │  │
│   │                                                                 │  │
│   │   ┌───────────────┐  ┌───────────────┐                         │  │
│   │   │   测试连接    │  │   保存配置    │                         │  │
│   │   └───────────────┘  └───────────────┘                         │  │
│   │                                                                 │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**设计要点:**
- 卡片式布局，每个提供商一张卡片
- 推荐标签突出显示
- 配置面板使用 Modal 或侧边栏
- 实时验证 API Key 格式

### 5.5 渠道配置页 (ChannelsConfig)

**目的:** 让用户配置消息渠道

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   消息渠道配置                                                          │
│   选择你想接入的聊天平台                                                 │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                                                                 │  │
│   │   📨 Telegram                                    [已配置] ✓   │  │
│   │   最常用的即时通讯平台                                           │  │
│   │                                                                 │  │
│   │   Bot: @MyOpenClawBot                                          │  │
│   │   状态: 运行中                                                  │  │
│   │                                                                 │  │
│   │                           [编辑]  [测试]  [删除]                │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                                                                 │  │
│   │   🎮 Discord                                      [未配置]     │  │
│   │   游戏社区首选                                                   │  │
│   │                                                                 │  │
│   │                           [+ 添加]                              │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                                                                 │  │
│   │   💬 WhatsApp                                    [未配置]     │  │
│   │   全球最流行的通讯软件                                           │  │
│   │                                                                 │  │
│   │                           [+ 添加]                              │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│   📦 更多渠道: Slack · 飞书 · 微信 · iMessage                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**设计要点:**
- 每个渠道一张卡片
- 清晰显示配置状态
- 快速操作按钮

### 5.6 仪表盘页 (Dashboard)

**目的:** 显示系统状态，快速操作入口

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │  Easy OpenClaw                                    🦞  ⚙️  ❌  │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │                                                              │     │
│   │   系统状态                                                   │     │
│   │                                                              │     │
│   │   OpenClaw Gateway    ● 运行中    PID: 12345                 │     │
│   │   版本: 1.2.0                                               │     │
│   │   运行时间: 2 天 3 小时                                       │     │
│   │                                                              │     │
│   │   ┌────────────┐  ┌────────────┐  ┌────────────┐            │     │
│   │   │  启动服务  │  │  停止服务  │  │ 重启服务   │            │     │
│   │   └────────────┘  └────────────┘  └────────────┘            │     │
│   │                                                              │     │
│   │   ┌────────────────────────────────────────────────────┐    │     │
│   │   │  打开 Dashboard (OpenClaw 控制面板)      →        │    │     │
│   │   └────────────────────────────────────────────────────┘    │     │
│   │                                                              │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │                                                              │     │
│   │   当前配置                                                   │     │
│   │                                                              │     │
│   │   AI 模型: 🟣 Claude Sonnet 4.5                              │     │
│   │   消息渠道: 📨 Telegram, 🎮 Discord                          │     │
│   │                                                              │     │
│   │   ┌────────────────────┐  ┌────────────────────┐            │     │
│   │   │   配置 AI 模型     │  │   配置消息渠道     │            │     │
│   │   └────────────────────┘  └────────────────────┘            │     │
│   │                                                              │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │                                                              │     │
│   │   系统信息                                                   │     │
│   │                                                              │     │
│   │   操作系统: macOS 14.0 (Apple Silicon)                       │     │
│   │   Node.js: 22.11.0                                          │     │
│   │   配置目录: ~/.openclaw                                      │     │
│   │                                                              │     │
│   │                                          [运行诊断]          │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. 核心组件

### 6.1 Button 组件

```tsx
// components/ui/Button.tsx

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  children,
}: ButtonProps) {
  return (
    <button
      className={cn(
        // 基础样式
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        
        // 变体
        {
          'bg-primary-500 text-white hover:bg-primary-600': variant === 'primary',
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-200': variant === 'secondary',
          'border border-neutral-300 hover:bg-neutral-50': variant === 'outline',
          'hover:bg-neutral-100': variant === 'ghost',
          'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
        },
        
        // 尺寸
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        }
      )}
      disabled={loading}
    >
      {loading ? <Spinner className="mr-2" /> : icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
```

### 6.2 Card 组件

```tsx
// components/ui/Card.tsx

interface CardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  selected?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function Card({
  title,
  description,
  icon,
  badge,
  selected,
  onClick,
  children,
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-6 transition-all duration-200',
        'cursor-pointer',
        selected
          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
          : 'border-neutral-200 hover:border-neutral-300 hover:shadow-md',
        onClick && 'hover:scale-[1.02]'
      )}
      onClick={onClick}
    >
      {(icon || badge) && (
        <div className="flex items-start justify-between mb-4">
          {icon && <span className="text-3xl">{icon}</span>}
          {badge && (
            <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
              {badge}
            </span>
          )}
        </div>
      )}
      
      {title && <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>}
      {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      
      {children}
    </div>
  );
}
```

### 6.3 Progress 组件

```tsx
// components/ui/Progress.tsx

interface ProgressProps {
  value: number;  // 0-100
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Progress({
  value,
  label,
  showPercentage = true,
  size = 'md',
}: ProgressProps) {
  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between mb-2 text-sm">
          {label && <span className="text-neutral-600">{label}</span>}
          {showPercentage && <span className="text-neutral-900 font-medium">{value}%</span>}
        </div>
      )}
      
      <div
        className={cn(
          'w-full bg-neutral-200 rounded-full overflow-hidden',
          { 'h-1': size === 'sm', 'h-2': size === 'md', 'h-3': size === 'lg' }
        )}
      >
        <motion.div
          className="h-full bg-primary-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
```

### 6.4 Stepper 组件

```tsx
// components/ui/Stepper.tsx

interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'running' | 'completed' | 'error';
}

interface StepperProps {
  steps: Step[];
  currentStep: string;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start">
          {/* 状态图标 */}
          <div
            className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
              {
                'bg-primary-500 text-white': step.status === 'running',
                'bg-green-500 text-white': step.status === 'completed',
                'bg-red-500 text-white': step.status === 'error',
                'bg-neutral-200 text-neutral-500': step.status === 'pending',
              }
            )}
          >
            {step.status === 'completed' && <CheckIcon />}
            {step.status === 'running' && <SpinnerIcon />}
            {step.status === 'error' && <XIcon />}
            {step.status === 'pending' && <span>{index + 1}</span>}
          </div>

          {/* 内容 */}
          <div className="ml-4 flex-1">
            <h4
              className={cn(
                'font-medium',
                step.status === 'running' ? 'text-primary-600' : 'text-neutral-900'
              )}
            >
              {step.title}
            </h4>
            {step.description && (
              <p className="text-sm text-neutral-500 mt-1">{step.description}</p>
            )}
          </div>

          {/* 状态标签 */}
          <div
            className={cn(
              'px-2 py-1 text-xs rounded',
              {
                'bg-primary-100 text-primary-700': step.status === 'running',
                'bg-green-100 text-green-700': step.status === 'completed',
                'bg-red-100 text-red-700': step.status === 'error',
              }
            )}
          >
            {step.status === 'running' && '进行中...'}
            {step.status === 'completed' && '完成'}
            {step.status === 'error' && '失败'}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 6.5 ProviderCard 组件

```tsx
// components/models/ProviderCard.tsx

interface ProviderCardProps {
  provider: AIProvider;
  selected?: boolean;
  configured?: boolean;
  onSelect: () => void;
}

export function ProviderCard({ provider, selected, configured, onSelect }: ProviderCardProps) {
  return (
    <Card
      icon={<span className="text-4xl">{provider.icon}</span>}
      title={provider.name}
      description={provider.description}
      badge={provider.models.some(m => m.recommended) ? '推荐' : undefined}
      selected={selected}
      onClick={onSelect}
    >
      {configured && (
        <div className="mt-4 flex items-center text-sm text-green-600">
          <CheckIcon className="w-4 h-4 mr-1" />
          已配置
        </div>
      )}
    </Card>
  );
}
```

### 6.6 ChannelCard 组件

```tsx
// components/channels/ChannelCard.tsx

interface ChannelCardProps {
  channel: Channel;
  config?: ChannelConfig;
  onConfigure: () => void;
  onEdit?: () => void;
  onTest?: () => void;
  onDelete?: () => void;
}

export function ChannelCard({
  channel,
  config,
  onConfigure,
  onEdit,
  onTest,
  onDelete,
}: ChannelCardProps) {
  const isConfigured = !!config;

  return (
    <Card
      icon={<span className="text-4xl">{channel.icon}</span>}
      title={channel.name}
      description={channel.description}
    >
      <div className="mt-4 flex items-center justify-between">
        <span
          className={cn(
            'px-2 py-1 text-xs rounded',
            isConfigured
              ? 'bg-green-100 text-green-700'
              : 'bg-neutral-100 text-neutral-500'
          )}
        >
          {isConfigured ? '已配置' : '未配置'}
        </span>

        <div className="flex gap-2">
          {isConfigured ? (
            <>
              <Button size="sm" variant="ghost" onClick={onEdit}>
                编辑
              </Button>
              <Button size="sm" variant="ghost" onClick={onTest}>
                测试
              </Button>
              <Button size="sm" variant="ghost" onClick={onDelete}>
                删除
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={onConfigure}>
              + 添加
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
```

---

## 7. 交互设计

### 7.1 过渡动画

```tsx
// 使用 Framer Motion 实现流畅过渡

// 页面切换
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

// 卡片悬停
const cardVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' },
};

// 进度条动画
const progressVariants = {
  initial: { width: 0 },
  animate: (value: number) => ({ width: `${value}%` }),
};
```

### 7.2 状态反馈

```tsx
// Loading 状态
{isLoading && (
  <div className="flex items-center gap-2 text-neutral-500">
    <Spinner />
    <span>加载中...</span>
  </div>
)}

// 成功状态
<Toast type="success" message="配置保存成功" />

// 错误状态
<Alert type="error">
  <p>API Key 无效</p>
  <p className="text-sm mt-1">请检查你的 API Key 是否正确</p>
</Alert>
```

### 7.3 表单验证

```tsx
// 实时验证 API Key 格式
const validateApiKey = (providerId: string, key: string): boolean => {
  const patterns = {
    anthropic: /^sk-ant-api03-/,
    openai: /^sk-/,
    deepseek: /^sk-/,
    google: /^AIza/,
  };
  return patterns[providerId]?.test(key) ?? true;
};

// 输入框实时反馈
<Input
  value={apiKey}
  onChange={setApiKey}
  onBlur={() => setTouched(true)}
  error={touched && !validateApiKey(providerId, apiKey) && 'API Key 格式不正确'}
/>
```

---

## 8. 状态管理

### 8.1 Zustand Store

```typescript
// stores/appStore.ts

interface AppState {
  // 系统信息
  systemInfo: SystemInfo | null;
  setSystemInfo: (info: SystemInfo) => void;

  // 安装状态
  installStatus: 'idle' | 'installing' | 'completed' | 'error';
  setInstallStatus: (status: string) => void;

  // 当前配置
  currentModel: CurrentModelConfig | null;
  channels: ChannelConfig[];
  
  // UI 状态
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  systemInfo: null,
  setSystemInfo: (info) => set({ systemInfo: info }),

  installStatus: 'idle',
  setInstallStatus: (status) => set({ installStatus: status }),

  currentModel: null,
  channels: [],

  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
```

### 8.2 TanStack Query

```typescript
// hooks/useSystemInfo.ts

export function useSystemInfo() {
  return useQuery({
    queryKey: ['systemInfo'],
    queryFn: () => api.system.getInfo(),
    staleTime: 5 * 60 * 1000,  // 5 分钟
  });
}

// hooks/useInstall.ts

export function useInstall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: InstallOptions) => api.install.start(options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemInfo'] });
    },
  });
}
```

---

## 9. 响应式设计

### 9.1 断点系统

```css
/* Tailwind CSS 断点 */
sm: 640px   /* 手机横屏 */
md: 768px   /* 平板 */
lg: 1024px  /* 笔记本 */
xl: 1280px  /* 桌面 */
2xl: 1536px /* 大屏 */
```

### 9.2 响应式布局

```tsx
// 卡片网格布局
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {providers.map(provider => (
    <ProviderCard key={provider.id} provider={provider} />
  ))}
</div>

// 侧边栏响应式
<aside className={cn(
  'fixed inset-y-0 left-0 w-64 bg-white border-r',
  'transform transition-transform duration-300',
  'lg:translate-x-0',  // 大屏显示
  sidebarOpen ? 'translate-x-0' : '-translate-x-full'  // 小屏可折叠
)}>
  {/* ... */}
</aside>
```

---

## 10. 无障碍设计

### 10.1 ARIA 标签

```tsx
<button
  aria-label="开始安装 OpenClaw"
  aria-busy={isLoading}
  aria-disabled={isDisabled}
>
  开始安装
</button>

<progress
  role="progressbar"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="安装进度"
/>
```

### 10.2 键盘导航

```tsx
// 支持键盘导航的卡片
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick();
    }
  }}
>
  {/* ... */}
</div>
```

### 10.3 颜色对比度

```css
/* 确保文本与背景对比度 >= 4.5:1 */

/* 正确 ✓ */
.text-on-light {
  color: #404040;  /* neutral-700 */
  background: #ffffff;
}

.text-on-dark {
  color: #ffffff;
  background: #171717;  /* neutral-900 */
}

/* 避免 ✗ */
.bad-contrast {
  color: #a3a3a3;  /* neutral-400 - 对比度不足 */
  background: #ffffff;
}
```

---

## 附录

### A. 依赖列表

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "typescript": "^5.6.0",
    "@types/react": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### B. 设计资源

- **设计稿**: Figma (待创建)
- **图标库**: Lucide Icons
- **色彩方案**: Tailwind Colors
- **字体**: Inter (英文) + Noto Sans SC (中文)

---

**文档版本**: 1.0
**最后更新**: 2026-03-07
