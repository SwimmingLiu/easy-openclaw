# Proposal: Logging Implementation

## Why

当前项目缺乏完善的日志监控体系，存在以下问题：
- 无请求追踪 ID，前后端日志无法关联
- 无敏感信息脱敏，API Key 等可能泄露
- 无文件持久化，重启后日志丢失
- 前端无统一日志管理，无 ErrorBoundary
- 无错误上报机制

## What Changes

实现 `docs/plan/logging-monitoring.md` 中定义的日志监控方案：

### Phase 1: 后端日志增强 (P0)
- [x] 敏感字段脱敏（API Key、Token 等）
- [x] 请求追踪 ID（traceId）
- [x] 响应时间记录

### Phase 2: 前端日志体系 (P0)
- [x] Logger 工具类（基于 loglevel）
- [x] API 集成 traceId
- [x] ErrorBoundary 组件
- [x] 全局错误处理

### Phase 3: 文件存储与轮转 (P1)
- [x] 文件输出配置
- [x] 日志轮转策略
- [x] 清理策略

### Phase 4: 错误上报 (P1)
- [x] 后端日志收集接口
- [x] 前端上报集成

## Capabilities

### New Capabilities

- `request-tracing`: 每个请求唯一 traceId，前后端可关联
- `sensitive-redaction`: 敏感字段自动脱敏
- `structured-logging`: 统一的结构化日志格式
- `log-persistence`: 日志文件持久化与轮转
- `error-reporting`: 前端错误自动上报到后端
- `error-boundary`: React 错误边界优雅降级

### Modified Capabilities

- `backend-logging`: 增强 Pino logger，支持脱敏和追踪
- `frontend-api`: API 请求携带 traceId

## Impact

### Backend
- 增强 `backend/utils/logger.ts`：脱敏配置、child logger 工厂
- 新增 `backend/middleware/request-tracing.ts`：请求追踪中间件
- 新增 `backend/routes/logs.ts`：日志收集接口
- 新增 `backend/utils/logger-file.ts`：文件输出配置
- 新增 `backend/jobs/log-cleanup.ts`：日志清理任务
- 修改所有 service 文件：集成 traceId

### Frontend
- 新增 `frontend/src/lib/logger.ts`：Logger 工具类
- 新增 `frontend/src/components/common/ErrorBoundary.tsx`：错误边界
- 修改 `frontend/src/services/api.ts`：集成 traceId
- 修改 `frontend/src/main.tsx`：全局错误处理

### Dependencies
- 后端新增：无（使用现有 pino）
- 前端新增：loglevel
