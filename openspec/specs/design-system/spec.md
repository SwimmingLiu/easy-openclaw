# design-system Specification

## Purpose
TBD - created by archiving change frontend-implementation. Update Purpose after archive.
## Requirements
### Requirement: 色彩系统

系统 SHALL 使用统一的色彩系统。

#### Scenario: 主色调验证
- **WHEN** 应用渲染完成
- **THEN** 主色调为 `#f97316`（橙色），与 OpenClaw 品牌一致

#### Scenario: 中性色验证
- **WHEN** 应用渲染完成
- **THEN** 中性色从 `#fafafa` 到 `#171717`，共 10 个层级

#### Scenario: 语义色验证
- **WHEN** 应用渲染完成
- **THEN** 语义色定义：success=#22c55e, warning=#eab308, error=#ef4444, info=#3b82f6

### Requirement: 字体系统

系统 SHALL 使用统一的字体系统。

#### Scenario: 字体家族验证
- **WHEN** 应用渲染完成
- **THEN** 无衬线字体为系统字体栈，等宽字体为 SF Mono / Monaco / Cascadia Code

#### Scenario: 字体大小验证
- **WHEN** 应用渲染完成
- **THEN** 字体大小从 xs (12px) 到 3xl (30px)，共 7 个层级

### Requirement: 间距系统

系统 SHALL 使用 8px 基准网格的间距系统。

#### Scenario: 间距验证
- **WHEN** 应用渲染完成
- **THEN** 间距从 space-0 (0) 到 space-16 (64px)，共 11 个层级

### Requirement: 圆角系统

系统 SHALL 使用统一的圆角系统。

#### Scenario: 圆角验证
- **WHEN** 应用渲染完成
- **THEN** 圆角从 radius-sm (4px) 到 radius-full (9999px)，共 6 个层级

### Requirement: 阴影系统

系统 SHALL 使用统一的阴影系统。

#### Scenario: 阴影验证
- **WHEN** 应用渲染完成
- **THEN** 阴影从 shadow-sm 到 shadow-xl，共 4 个层级

### Requirement: 组件规范

系统 SHALL 使用统一的组件规范。

#### Scenario: Button 组件验证
- **WHEN** Button 组件渲染
- **THEN** 支持 primary/secondary/outline/ghost/danger 5 种变体，sm/md/lg 3 种尺寸

#### Scenario: Card 组件验证
- **WHEN** Card 组件渲染
- **THEN** 支持标题、描述、图标、徽章、选中状态、点击回调

#### Scenario: Progress 组件验证
- **WHEN** Progress 组件渲染
- **THEN** 支持 0-100 进度值、标签、百分比显示、sm/md/lg 3 种尺寸

#### Scenario: Stepper 组件验证
- **WHEN** Stepper 组件渲染
- **THEN** 支持 pending/running/completed/error 4 种状态

### Requirement: 颜色对比度

系统 SHALL 确保文本与背景对比度 >= 4.5:1。

#### Scenario: 浅色背景对比度
- **WHEN** 文本显示在浅色背景上
- **THEN** 文本颜色为 `#404040` 或更深

#### Scenario: 深色背景对比度
- **WHEN** 文本显示在深色背景上
- **THEN** 文本颜色为 `#ffffff`

