## ADDED Requirements

### Requirement: 消息渠道卡片展示

系统 SHALL 以卡片形式展示所有支持的消息渠道。

#### Scenario: 显示渠道列表
- **WHEN** 用户进入消息渠道配置页面
- **THEN** 系统显示所有支持的消息渠道卡片（Telegram、Discord、WhatsApp、Slack、飞书、微信、iMessage）

#### Scenario: 已配置状态显示
- **WHEN** 某渠道已配置
- **THEN** 该卡片显示"已配置 ✓"状态，以及"编辑"、"测试"、"删除"按钮

#### Scenario: 未配置状态显示
- **WHEN** 某渠道未配置
- **THEN** 该卡片显示"未配置"状态，以及"+ 添加"按钮

### Requirement: 渠道配置表单

点击添加/编辑后系统 SHALL 显示配置表单。

#### Scenario: 打开配置表单
- **WHEN** 用户点击"+ 添加"按钮
- **THEN** 系统显示配置表单，包含该渠道所需的所有字段

#### Scenario: Telegram 配置字段
- **WHEN** 用户配置 Telegram 渠道
- **THEN** 系统显示 Bot Token 和 User ID 输入框

#### Scenario: Discord 配置字段
- **WHEN** 用户配置 Discord 渠道
- **THEN** 系统显示 Bot Token 和 Channel ID 输入框

### Requirement: 配置指南显示

系统 SHALL 为每个渠道提供配置指南。

#### Scenario: 显示配置指南
- **WHEN** 用户打开某渠道的配置表单
- **THEN** 系统显示该渠道的配置步骤指南

### Requirement: 渠道测试功能

系统 SHALL 提供渠道测试功能。

#### Scenario: 测试 Telegram
- **WHEN** 用户点击"测试"按钮
- **THEN** 系统发送测试消息到 Telegram，显示测试结果

#### Scenario: 测试成功
- **WHEN** 渠道测试成功
- **THEN** 系统显示"测试成功"提示

#### Scenario: 测试失败
- **WHEN** 渠道测试失败
- **THEN** 系统显示错误原因和解决方案

### Requirement: 删除渠道配置

系统 SHALL 允许用户删除已配置的渠道。

#### Scenario: 删除确认
- **WHEN** 用户点击"删除"按钮
- **THEN** 系统显示确认对话框

#### Scenario: 删除成功
- **WHEN** 用户确认删除
- **THEN** 系统删除该渠道配置，更新卡片状态为"未配置"
