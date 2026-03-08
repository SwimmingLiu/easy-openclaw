## 1. 项目配置

- [x] 1.1 创建 frontend/ 目录结构
- [x] 1.2 配置 package.json（React 19、Vite 6、Tailwind CSS 4、Zustand 5、TanStack Query 5、Framer Motion 11、Lucide Icons）
- [x] 1.3 配置 tsconfig.json（TypeScript 5.6、ES2022 target、strict mode）
- [x] 1.4 配置 vite.config.ts（Electron 渲染进程、HMR、路径别名）
- [x] 1.5 配置 tailwind.config.ts（设计系统色彩、字体、间距、圆角、阴影）
- [x] 1.6 配置 postcss.config.js（Tailwind CSS、Autoprefixer）

## 2. 设计系统

- [x] 2.1 创建全局样式文件 `styles/globals.css`（CSS 变量、基础样式）
- [x] 2.2 创建 cn 工具函数 `lib/utils.ts`（clsx + tailwind-merge）
- [x] 2.3 创建 Button 组件 `components/ui/Button.tsx`（5 种变体、3 种尺寸、loading 状态）
- [x] 2.4 创建 Input 组件 `components/ui/Input.tsx`（password 类型、error 状态、placeholder）
- [x] 2.5 创建 Card 组件 `components/ui/Card.tsx`（title、description、icon、badge、selected 状态）
- [x] 2.6 创建 Progress 组件 `components/ui/Progress.tsx`（进度条、标签、百分比）
- [x] 2.7 创建 Stepper 组件 `components/ui/Stepper.tsx`（步骤列表、4 种状态）
- [x] 2.8 创建 Spinner 组件 `components/ui/Spinner.tsx`（加载动画）
- [x] 2.9 创建 Toast 组件 `components/ui/Toast.tsx`（成功/错误提示）
- [x] 2.10 创建 Alert 组件 `components/ui/Alert.tsx`（警告/错误信息）
- [x] 2.11 创建 Modal 组件 `components/ui/Modal.tsx`（模态框、遮罩层）
- [x] 2.12 创建 Badge 组件 `components/ui/Badge.tsx`（徽章、标签）

## 3. 状态管理

- [x] 3.1 创建 API 客户端 `services/api.ts`（fetch 封装、错误处理）
- [x] 3.2 创建系统 API `services/system.ts`（getSystemInfo、checkPrerequisites）
- [x] 3.3 创建安装 API `services/install.ts`（start、cancel、events SSE）
- [x] 3.4 创建配置 API `services/config.ts`（getProviders、configureProvider、getChannels、configureChannel）
- [x] 3.5 创建 Gateway API `services/gateway.ts`（getStatus、start、stop、restart）
- [x] 3.6 创建 Zustand appStore `stores/appStore.ts`（systemInfo、installStatus、currentModel、channels、sidebarOpen）
- [x] 3.7 创建 Zustand installStore `stores/installStore.ts`（installId、steps、progress）
- [x] 3.8 创建 useSystemInfo Hook `hooks/useSystemInfo.ts`
- [x] 3.9 创建 useInstall Hook `hooks/useInstall.ts`
- [x] 3.10 创建 useConfig Hook `hooks/useConfig.ts`
- [x] 3.11 创建 useGateway Hook `hooks/useGateway.ts`

## 4. 布局组件

- [x] 4.1 创建 AppLayout 组件 `components/layout/AppLayout.tsx`（整体布局、Sidebar + Main）
- [x] 4.2 创建 Sidebar 组件 `components/layout/Sidebar.tsx`（导航菜单、折叠功能）
- [x] 4.3 创建 Header 组件 `components/layout/Header.tsx`（标题栏、窗口控制按钮）

## 5. 欢迎页面

- [x] 5.1 创建 Welcome 页面 `pages/Welcome.tsx`（Logo、标题、简介、特性列表、按钮）
- [x] 5.2 实现"开始安装"按钮点击跳转
- [x] 5.3 实现"已安装？打开 Dashboard"链接跳转

## 6. 安装向导

- [x] 6.1 创建 InstallWizard 组件 `components/install/InstallWizard.tsx`（步骤列表、进度显示）
- [x] 6.2 创建 StepProgress 组件 `components/install/StepProgress.tsx`（单个步骤状态）
- [x] 6.3 创建 LogViewer 组件 `components/install/LogViewer.tsx`（日志输出、可折叠）
- [x] 6.4 创建 Install 页面 `pages/Install.tsx`（安装向导、SSE 事件处理）
- [x] 6.5 实现 SSE 事件流订阅（step-start、step-complete、step-error、install-complete）
- [x] 6.6 实现安装取消功能
- [x] 6.7 实现安装完成后跳转到 ModelsConfig

## 7. AI 模型配置

- [x] 7.1 创建 ProviderCard 组件 `components/models/ProviderCard.tsx`（提供商卡片、推荐标签、已配置状态）
- [x] 7.2 创建 ModelSelector 组件 `components/models/ModelSelector.tsx`（模型下拉选择、推荐高亮）
- [x] 7.3 创建 ApiKeyInput 组件 `components/models/ApiKeyInput.tsx`（API Key 输入、格式验证、显示/隐藏）
- [x] 7.4 创建 ProviderConfigModal 组件 `components/models/ProviderConfigModal.tsx`（配置面板、API Key、模型选择、高级设置）
- [x] 7.5 创建 ModelsConfig 页面 `pages/ModelsConfig.tsx`（提供商网格、配置面板）
- [x] 7.6 实现获取 AI 提供商列表
- [x] 7.7 实现配置保存功能
- [x] 7.8 实现 API 连接测试功能

## 8. 消息渠道配置

- [x] 8.1 创建 ChannelCard 组件 `components/channels/ChannelCard.tsx`（渠道卡片、已配置/未配置状态、操作按钮）
- [x] 8.2 创建 ConfigForm 组件 `components/channels/ConfigForm.tsx`（配置表单、动态字段）
- [x] 8.3 创建 TestButton 组件 `components/channels/TestButton.tsx`（测试按钮、测试结果）
- [x] 8.4 创建 ChannelConfigModal 组件 `components/channels/ChannelConfigModal.tsx`（配置面板、配置指南）
- [x] 8.5 创建 ChannelsConfig 页面 `pages/ChannelsConfig.tsx`（渠道列表、配置面板）
- [x] 8.6 实现获取消息渠道列表
- [x] 8.7 实现渠道配置保存功能
- [x] 8.8 实现渠道测试功能
- [x] 8.9 实现渠道删除功能

## 9. 仪表盘

- [x] 9.1 创建 Dashboard 页面 `pages/Dashboard.tsx`（系统状态、当前配置、系统信息）
- [x] 9.2 实现 Gateway 状态显示（运行中/已停止、版本、运行时间）
- [x] 9.3 实现 Gateway 控制按钮（启动、停止、重启）
- [x] 9.4 实现打开 Dashboard 链接
- [x] 9.5 实现当前配置显示（AI 模型、消息渠道）
- [x] 9.6 实现快速配置入口（跳转到 ModelsConfig、ChannelsConfig）
- [x] 9.7 实现系统信息显示（操作系统、Node.js 版本、配置目录）
- [x] 9.8 实现运行诊断功能

## 10. 路由与入口

- [x] 10.1 创建 App.tsx 根组件（路由配置、TanStack Query Provider）
- [x] 10.2 创建 main.tsx 应用入口（React 渲染、Electron IPC 初始化）
- [x] 10.3 实现路由守卫（未安装跳转 Welcome，已安装跳转 Dashboard）
- [x] 10.4 实现页面切换动画（Framer Motion）

## 11. Electron IPC

- [x] 11.1 扩展 preload.ts（暴露 window.electronAPI）
- [x] 11.2 实现 getSystemInfo IPC
- [x] 11.3 实现 startInstall/cancelInstall IPC
- [x] 11.4 实现 getProviders/configureProvider/testConnection IPC
- [x] 11.5 实现 getChannels/configureChannel/testChannel/deleteChannel IPC
- [x] 11.6 实现 getGatewayStatus/startGateway/stopGateway/restartGateway IPC

## 12. 测试与验证

- [x] 12.1 验证 TypeScript 编译通过
- [x] 12.2 验证 Vite 开发服务器启动成功
- [x] 12.3 验证欢迎页面渲染正确
- [x] 12.4 验证安装向导 SSE 事件流正常
- [x] 12.5 验证 AI 模型配置保存成功
- [x] 12.6 验证消息渠道配置保存成功
- [x] 12.7 验证 Dashboard 状态显示正确
- [x] 12.8 验证 Gateway 控制功能正常
- [x] 12.9 验证页面切换动画流畅
- [x] 12.10 验证响应式布局（sm/md/lg/xl 断点）
