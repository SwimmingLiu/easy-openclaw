## ADDED Requirements

### Requirement: 分步骤安装流程

系统 SHALL 提供分步骤的安装向导，每一步都有明确的状态（完成/进行中/等待）。

#### Scenario: 显示安装步骤
- **WHEN** 用户进入安装页面
- **THEN** 系统显示所有安装步骤：检查权限、安装 Node.js、验证 npm、安装 OpenClaw、创建配置目录、验证安装

#### Scenario: 步骤状态更新
- **WHEN** 某步骤完成
- **THEN** 该步骤显示"✓ 完成"状态，下一步自动开始

#### Scenario: 步骤失败回滚
- **WHEN** 某步骤失败
- **THEN** 系统执行回滚操作，显示错误信息和解决方案

### Requirement: SSE 实时进度显示

系统 SHALL 通过 SSE 事件流实时显示安装进度。

#### Scenario: 接收进度事件
- **WHEN** 后端发送 `step-start` 事件
- **THEN** 前端更新 UI 显示该步骤为"进行中"状态

#### Scenario: 接收完成事件
- **WHEN** 后端发送 `step-complete` 事件
- **THEN** 前端更新 UI 显示该步骤为"完成"状态

#### Scenario: 接收错误事件
- **WHEN** 后端发送 `step-error` 事件
- **THEN** 前端显示错误信息和解决方案

### Requirement: 安装取消功能

系统 SHALL 允许用户取消正在进行的安装。

#### Scenario: 取消安装
- **WHEN** 用户点击"取消安装"按钮
- **THEN** 系统发送取消请求到后端，停止安装流程

### Requirement: 安装完成跳转

安装完成后系统 SHALL 自动跳转到 AI 模型配置页面。

#### Scenario: 安装成功跳转
- **WHEN** 后端发送 `install-complete` 事件且 success=true
- **THEN** 系统显示成功动画，3 秒后自动跳转到 ModelsConfig 页面
