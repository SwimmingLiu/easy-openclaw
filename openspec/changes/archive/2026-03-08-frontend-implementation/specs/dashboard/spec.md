## ADDED Requirements

### Requirement: 系统状态展示

Dashboard 页面 SHALL 显示 OpenClaw Gateway 的运行状态。

#### Scenario: 显示运行状态
- **WHEN** 用户进入 Dashboard 页面
- **THEN** 系统显示 Gateway 运行状态（运行中/已停止）、版本号、运行时间

#### Scenario: Gateway 运行中
- **WHEN** Gateway 正在运行
- **THEN** 系统显示绿色圆点和"运行中"状态，以及 PID 和端口信息

#### Scenario: Gateway 已停止
- **WHEN** Gateway 已停止
- **THEN** 系统显示灰色圆点和"已停止"状态

### Requirement: Gateway 控制按钮

系统 SHALL 提供 Gateway 启动/停止/重启按钮。

#### Scenario: 启动 Gateway
- **WHEN** 用户点击"启动服务"按钮
- **THEN** 系统发送启动请求，更新状态为"运行中"

#### Scenario: 停止 Gateway
- **WHEN** 用户点击"停止服务"按钮
- **THEN** 系统发送停止请求，更新状态为"已停止"

#### Scenario: 重启 Gateway
- **WHEN** 用户点击"重启服务"按钮
- **THEN** 系统发送重启请求，更新状态

### Requirement: 打开 Dashboard 链接

系统 SHALL 提供打开 OpenClaw Dashboard 的快捷入口。

#### Scenario: 打开 Dashboard
- **WHEN** 用户点击"打开 Dashboard"按钮
- **THEN** 系统在浏览器中打开 OpenClaw Dashboard URL

### Requirement: 当前配置展示

Dashboard 页面 SHALL 显示当前 AI 模型和消息渠道配置。

#### Scenario: 显示 AI 模型配置
- **WHEN** 用户查看 Dashboard
- **THEN** 系统显示当前配置的 AI 提供商和模型名称

#### Scenario: 显示消息渠道配置
- **WHEN** 用户查看 Dashboard
- **THEN** 系统显示已配置的消息渠道列表

### Requirement: 快速配置入口

系统 SHALL 提供 AI 模型和消息渠道的快速配置入口。

#### Scenario: 跳转 AI 配置
- **WHEN** 用户点击"配置 AI 模型"按钮
- **THEN** 系统导航到 ModelsConfig 页面

#### Scenario: 跳转渠道配置
- **WHEN** 用户点击"配置消息渠道"按钮
- **THEN** 系统导航到 ChannelsConfig 页面

### Requirement: 系统信息展示

Dashboard 页面 SHALL 显示系统信息。

#### Scenario: 显示系统信息
- **WHEN** 用户查看 Dashboard
- **THEN** 系统显示操作系统、Node.js 版本、配置目录等信息

### Requirement: 运行诊断功能

系统 SHALL 提供运行诊断功能。

#### Scenario: 运行诊断
- **WHEN** 用户点击"运行诊断"按钮
- **THEN** 系统执行诊断命令，显示诊断结果
