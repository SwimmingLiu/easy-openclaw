## ADDED Requirements

### Requirement: AI 提供商卡片展示

系统 SHALL 以卡片形式展示所有支持的 AI 提供商。

#### Scenario: 显示提供商列表
- **WHEN** 用户进入 AI 模型配置页面
- **THEN** 系统显示所有支持的 AI 提供商卡片（Anthropic、OpenAI、DeepSeek、Kimi、Google、OpenRouter、Groq、Mistral、Ollama 等）

#### Scenario: 推荐标签显示
- **WHEN** 某提供商被标记为推荐
- **THEN** 该卡片显示"推荐"标签

#### Scenario: 已配置状态显示
- **WHEN** 某提供商已配置
- **THEN** 该卡片显示"已配置 ✓"状态

### Requirement: AI 提供商配置面板

点击提供商卡片后系统 SHALL 显示配置面板。

#### Scenario: 打开配置面板
- **WHEN** 用户点击某提供商卡片
- **THEN** 系统显示配置面板，包含 API Key 输入框、模型选择、高级设置

#### Scenario: API Key 输入
- **WHEN** 用户输入 API Key
- **THEN** 系统实时验证 API Key 格式，显示验证结果

#### Scenario: 模型选择
- **WHEN** 用户展开模型选择下拉框
- **THEN** 系统显示该提供商支持的所有模型，推荐模型高亮显示

### Requirement: 自定义 API 地址

系统 SHALL 支持配置自定义 API 地址（Base URL）。

#### Scenario: 展开高级设置
- **WHEN** 用户点击"高级设置"
- **THEN** 系统显示 Base URL 输入框和 API 类型选择

#### Scenario: 输入自定义地址
- **WHEN** 用户输入自定义 Base URL
- **THEN** 系统保存该地址，用于后续 API 调用

### Requirement: API 连接测试

系统 SHALL 提供 API 连接测试功能。

#### Scenario: 测试连接成功
- **WHEN** 用户点击"测试连接"按钮且 API Key 有效
- **THEN** 系统显示"API 连接成功"提示

#### Scenario: 测试连接失败
- **WHEN** 用户点击"测试连接"按钮且 API Key 无效
- **THEN** 系统显示"API Key 无效"错误信息

### Requirement: 保存配置

系统 SHALL 允许用户保存 AI 提供商配置。

#### Scenario: 保存配置成功
- **WHEN** 用户点击"保存配置"按钮且所有必填项已填写
- **THEN** 系统保存配置到后端，显示"配置保存成功"提示
