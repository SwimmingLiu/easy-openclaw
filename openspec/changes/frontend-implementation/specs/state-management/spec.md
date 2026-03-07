## ADDED Requirements

### Requirement: Zustand Store 状态管理

系统 SHALL 使用 Zustand 管理全局状态。

#### Scenario: 应用状态管理
- **WHEN** 应用启动
- **THEN** Zustand store 包含 systemInfo、installStatus、currentModel、channels、sidebarOpen 等状态

#### Scenario: 状态更新
- **WHEN** 调用 store 的 set 方法
- **THEN** 对应状态更新，UI 响应式刷新

### Requirement: TanStack Query 数据缓存

系统 SHALL 使用 TanStack Query 管理服务端状态。

#### Scenario: 查询缓存
- **WHEN** 首次调用 API
- **THEN** TanStack Query 缓存响应数据，5 分钟内再次调用使用缓存

#### Scenario: 缓存失效
- **WHEN** 执行 mutation 操作成功
- **THEN** 相关查询缓存自动失效，重新获取最新数据

### Requirement: useSystemInfo Hook

系统 SHALL 提供 useSystemInfo Hook 获取系统信息。

#### Scenario: 获取系统信息
- **WHEN** 组件调用 useSystemInfo()
- **THEN** 返回 { data, isLoading, error } 对象，data 包含系统信息

### Requirement: useInstall Hook

系统 SHALL 提供 useInstall Hook 执行安装操作。

#### Scenario: 启动安装
- **WHEN** 组件调用 useInstall().mutate(options)
- **THEN** 发送安装请求到后端，返回 installId

### Requirement: useConfig Hook

系统 SHALL 提供 useConfig Hook 管理配置。

#### Scenario: 获取当前配置
- **WHEN** 组件调用 useConfig().data
- **THEN** 返回当前 AI 模型和消息渠道配置

#### Scenario: 更新配置
- **WHEN** 组件调用 useConfig().mutate(config)
- **THEN** 发送配置更新请求到后端

### Requirement: 错误处理

系统 SHALL 统一处理 API 错误。

#### Scenario: 网络错误
- **WHEN** API 请求失败（网络错误）
- **THEN** TanStack Query 自动重试 3 次，显示错误提示

#### Scenario: 业务错误
- **WHEN** API 返回业务错误
- **THEN** 显示错误信息和解决方案
