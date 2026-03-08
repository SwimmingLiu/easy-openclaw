# electron-ipc Specification

## Purpose
TBD - created by archiving change frontend-implementation. Update Purpose after archive.
## Requirements
### Requirement: IPC 通信桥接

系统 SHALL 通过 Electron preload 脚本暴露 IPC API。

#### Scenario: 暴露 electronAPI
- **WHEN** Electron 渲染进程加载完成
- **THEN** window.electronAPI 可用，包含所有 IPC 方法

### Requirement: 安装相关 IPC

系统 SHALL 提供安装相关的 IPC 通信。

#### Scenario: 获取系统信息
- **WHEN** 调用 window.electronAPI.getSystemInfo()
- **THEN** 返回系统信息对象

#### Scenario: 启动安装
- **WHEN** 调用 window.electronAPI.startInstall(options)
- **THEN** 返回 installId，后端开始安装流程

#### Scenario: 取消安装
- **WHEN** 调用 window.electronAPI.cancelInstall(installId)
- **THEN** 后端取消安装流程

### Requirement: 配置相关 IPC

系统 SHALL 提供配置相关的 IPC 通信。

#### Scenario: 获取 AI 提供商列表
- **WHEN** 调用 window.electronAPI.getProviders()
- **THEN** 返回所有支持的 AI 提供商列表

#### Scenario: 配置 AI 提供商
- **WHEN** 调用 window.electronAPI.configureProvider(config)
- **THEN** 保存配置到后端

#### Scenario: 测试 API 连接
- **WHEN** 调用 window.electronAPI.testConnection(config)
- **THEN** 返回测试结果

#### Scenario: 获取消息渠道列表
- **WHEN** 调用 window.electronAPI.getChannels()
- **THEN** 返回所有支持的消息渠道列表

#### Scenario: 配置消息渠道
- **WHEN** 调用 window.electronAPI.configureChannel(channelId, config)
- **THEN** 保存配置到后端

### Requirement: Gateway 相关 IPC

系统 SHALL 提供 Gateway 相关的 IPC 通信。

#### Scenario: 获取 Gateway 状态
- **WHEN** 调用 window.electronAPI.getGatewayStatus()
- **THEN** 返回 Gateway 运行状态

#### Scenario: 启动 Gateway
- **WHEN** 调用 window.electronAPI.startGateway()
- **THEN** 启动 Gateway 服务

#### Scenario: 停止 Gateway
- **WHEN** 调用 window.electronAPI.stopGateway()
- **THEN** 停止 Gateway 服务

#### Scenario: 重启 Gateway
- **WHEN** 调用 window.electronAPI.restartGateway()
- **THEN** 重启 Gateway 服务

### Requirement: 安全约束

系统 SHALL 限制渲染进程的 Node.js 访问。

#### Scenario: 禁止直接访问 Node.js
- **WHEN** 渲染进程尝试直接使用 require 或 process
- **THEN** 抛出错误，阻止访问

#### Scenario: 仅通过 IPC 通信
- **WHEN** 渲染进程需要访问系统资源
- **THEN** 必须通过 window.electronAPI 进行

