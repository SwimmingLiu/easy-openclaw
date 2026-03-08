# Easy OpenClaw 日志监控解决方案

> 版本: 1.0.0
> 更新时间: 2026-03-08
> 目标: 建立完善的日志监控体系，便于问题排查和用户体验优化

---

## 📋 目录

1. [设计目标](#1-设计目标)
2. [现状分析](#2-现状分析)
3. [日志规范](#3-日志规范)
4. [后端日志方案](#4-后端日志方案)
5. [前端日志方案](#5-前端日志方案)
6. [错误追踪与上报](#6-错误追踪与上报)
7. [日志存储与轮转](#7-日志存储与轮转)
8. [环境配置](#8-环境配置)
9. [实施计划](#9-实施计划)

---

## 1. 设计目标

### 1.1 核心原则

| 原则 | 说明 |
|------|------|
| **可追溯** | 每个请求都有唯一 traceId，可追踪完整调用链路 |
| **结构化** | 日志格式统一，便于机器解析和查询 |
| **安全性** | 敏感信息（API Key、Token）自动脱敏 |
| **性能优先** | 异步写入，不阻塞主线程 |
| **分级控制** | 不同环境使用不同日志级别 |

### 1.2 目标场景

- **开发调试**: 快速定位问题，详细日志输出
- **问题排查**: 用户反馈问题后，通过日志重现场景
- **性能监控**: 识别慢请求、异常响应
- **安全审计**: 记录关键操作，防止恶意行为

---

## 2. 现状分析

### 2.1 后端现状

| 项目 | 状态 | 说明 |
|------|------|------|
| 日志框架 | ✅ Pino + pino-pretty | 已配置，性能优秀 |
| Child Logger | ✅ 统一模式 | 各模块使用 child logger |
| 请求日志 | ⚠️ 生产环境禁用 | `disableRequestLogging` 已开启 |
| 文件输出 | ❌ 未实现 | 仅输出到控制台 |
| 日志轮转 | ❌ 未实现 | 无文件轮转策略 |
| 敏感信息脱敏 | ❌ 未实现 | API Key 明文记录 |
| 请求追踪 ID | ❌ 未实现 | 无法关联前后端日志 |

### 2.2 前端现状

| 项目 | 状态 | 说明 |
|------|------|------|
| 日志库 | ❌ 未引入 | 无统一日志管理 |
| Console 调用 | ❌ 无规范 | 代码中无 console 调用 |
| ErrorBoundary | ❌ 未实现 | 错误无法优雅降级 |
| 全局 Toast | ⚠️ 部分 | 有 Toast 组件，无统一 hook |
| 安装日志 | ✅ Zustand 存储 | 字符串数组形式 |

### 2.3 核心缺口

1. **无请求追踪**: 前后端日志无法关联
2. **无文件持久化**: 重启后日志丢失
3. **无敏感信息保护**: API Key 等可能泄露
4. **无错误上报**: 无法收集用户端异常
5. **无日志轮转**: 文件可能无限增长

---

## 3. 日志规范

### 3.1 日志级别

| 级别 | 用途 | 生产环境 | 开发环境 |
|------|------|----------|----------|
| `trace` | 详细调用链路 | ❌ | ❌ |
| `debug` | 调试信息 | ❌ | ✅ |
| `info` | 正常业务流程 | ✅ | ✅ |
| `warn` | 潜在问题警告 | ✅ | ✅ |
| `error` | 错误但不影响服务 | ✅ | ✅ |
| `fatal` | 致命错误，服务中断 | ✅ | ✅ |

### 3.2 日志字段规范

#### 必需字段

```typescript
interface LogFields {
  // 时间戳 (ISO 8601)
  time: string;
  
  // 日志级别
  level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  
  // 日志消息
  msg: string;
  
  // 请求追踪 ID
  traceId: string;
  
  // 服务标识
  service: 'easy-openclaw-backend' | 'easy-openclaw-frontend';
  
  // 模块标识
  module: string;
}
```

#### 可选字段

```typescript
interface OptionalLogFields {
  // 用户标识（如果已登录）
  userId?: string;
  
  // 请求方法
  method?: string;
  
  // 请求路径
  path?: string;
  
  // 响应状态码
  statusCode?: number;
  
  // 响应时间 (ms)
  responseTime?: number;
  
  // 错误堆栈
  stack?: string;
  
  // 错误代码
  errorCode?: string;
  
  // 自定义上下文
  context?: Record<string, unknown>;
}
```

### 3.3 敏感字段脱敏

以下字段需要自动脱敏：

| 字段名 | 脱敏规则 | 示例 |
|--------|----------|------|
| `apiKey` | 保留前4位，其余用 `****` 替换 | `sk-a****b123` |
| `token` | 保留前8位，其余用 `****` 替换 | `ghp_xxxx****xxxx` |
| `password` | 完全替换为 `******` | `******` |
| `secret` | 完全替换为 `******` | `******` |
| `authorization` | 完全替换为 `******` | `******` |

---

## 4. 后端日志方案

### 4.1 技术选型

| 组件 | 技术 | 理由 |
|------|------|------|
| 日志框架 | Pino | 已有，性能优秀 |
| 格式化 | pino-pretty | 开发环境友好输出 |
| 文件传输 | pino/file | 官方文件输出插件 |
| 日志轮转 | rotato | 轻量级轮转方案 |
| 请求追踪 | @fastify/request-context | Fastify 官方方案 |

### 4.2 Logger 配置增强

```typescript
// backend/utils/logger.ts
import pino from 'pino';
import { randomUUID } from 'crypto';

// 敏感字段脱敏
const sensitiveFields = ['apiKey', 'token', 'password', 'secret', 'authorization'];

const redact = {
  paths: sensitiveFields.map(f => `*.${f}`),
  censor: (value: string, path: string[]) => {
    const field = path[path.length - 1];
    if (field === 'password' || field === 'secret' || field === 'authorization') {
      return '******';
    }
    if (typeof value === 'string' && value.length > 8) {
      return value.slice(0, 4) + '****' + value.slice(-4);
    }
    return '******';
  }
};

// 日志配置
const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: isProduction ? 'info' : 'debug',
  redact,
  formatters: {
    level: (label) => ({ level: label })
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: isProduction 
    ? undefined 
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      }
});

// 创建 child logger 工厂函数
export function createLogger(module: string) {
  return logger.child({ 
    service: 'easy-openclaw-backend',
    module 
  });
}
```

### 4.3 请求追踪中间件

```typescript
// backend/middleware/request-tracing.ts
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { randomUUID } from 'crypto';
import { createLogger } from '../utils/logger';

const logger = createLogger('request-tracing');

declare module 'fastify' {
  interface FastifyRequest {
    traceId: string;
  }
}

export function requestTracingMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  // 从请求头获取或生成 traceId
  const traceId = request.headers['x-trace-id'] as string || randomUUID();
  request.traceId = traceId;
  
  // 设置响应头
  reply.header('x-trace-id', traceId);
  
  // 记录请求开始
  logger.info({
    traceId,
    msg: 'Request started',
    method: request.method,
    path: request.url,
  });
  
  done();
}

// 响应时间记录
export function responseTimeHook(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  const start = Date.now();
  
  reply.addHook('onSend', async () => {
    const responseTime = Date.now() - start;
    logger.info({
      traceId: request.traceId,
      msg: 'Request completed',
      method: request.method,
      path: request.url,
      statusCode: reply.statusCode,
      responseTime
    });
  });
  
  done();
}
```

### 4.4 服务层日志规范

```typescript
// backend/services/installer.ts
import { createLogger } from '../utils/logger';
import type { FastifyRequest } from 'fastify';

const logger = createLogger('installer');

export class InstallerService {
  async install(packageName: string, request: FastifyRequest) {
    logger.info({
      traceId: request.traceId,
      msg: 'Starting installation',
      packageName
    });
    
    try {
      // 安装逻辑...
      
      logger.info({
        traceId: request.traceId,
        msg: 'Installation completed',
        packageName
      });
    } catch (error) {
      logger.error({
        traceId: request.traceId,
        msg: 'Installation failed',
        packageName,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
}
```

---

## 5. 前端日志方案

### 5.1 技术选型

| 组件 | 技术 | 理由 |
|------|------|------|
| 日志库 | loglevel | 轻量级，支持级别控制 |
| 错误边界 | React ErrorBoundary | 官方推荐方案 |
| 全局错误处理 | window.onerror + unhandledrejection | 捕获所有异常 |
| 日志上报 | fetch API | 发送到后端接口 |

### 5.2 Logger 工具类

```typescript
// frontend/src/lib/logger.ts
import log from 'loglevel';

const TRACE_ID_KEY = 'x-trace-id';

// 日志级别配置
const isProduction = import.meta.env.PROD;
log.setLevel(isProduction ? 'info' : 'debug');

// 获取或生成 traceId
function getTraceId(): string {
  let traceId = sessionStorage.getItem(TRACE_ID_KEY);
  if (!traceId) {
    traceId = crypto.randomUUID();
    sessionStorage.setItem(TRACE_ID_KEY, traceId);
  }
  return traceId;
}

// 敏感字段脱敏
function redactSensitive(obj: Record<string, unknown>): Record<string, unknown> {
  const sensitiveFields = ['apiKey', 'token', 'password', 'secret'];
  const result = { ...obj };
  
  for (const field of sensitiveFields) {
    if (result[field] && typeof result[field] === 'string') {
      const value = result[field] as string;
      result[field] = value.length > 8 
        ? value.slice(0, 4) + '****' + value.slice(-4)
        : '******';
    }
  }
  
  return result;
}

// 日志上报到后端
async function reportToBackend(level: string, message: string, context?: Record<string, unknown>) {
  if (!isProduction) return;
  
  try {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        msg: message,
        traceId: getTraceId(),
        service: 'easy-openclaw-frontend',
        timestamp: new Date().toISOString(),
        ...redactSensitive(context || {})
      })
    });
  } catch {
    // 上报失败不阻塞
  }
}

// 创建 logger
export const logger = {
  trace: (msg: string, context?: Record<string, unknown>) => {
    log.trace(msg, context);
  },
  debug: (msg: string, context?: Record<string, unknown>) => {
    log.debug(msg, context);
  },
  info: (msg: string, context?: Record<string, unknown>) => {
    log.info(msg, context);
  },
  warn: (msg: string, context?: Record<string, unknown>) => {
    log.warn(msg, context);
    reportToBackend('warn', msg, context);
  },
  error: (msg: string, context?: Record<string, unknown>) => {
    log.error(msg, context);
    reportToBackend('error', msg, context);
  }
};

// 获取当前 traceId（用于 API 请求）
export function getTraceIdHeader(): { 'x-trace-id': string } {
  return { 'x-trace-id': getTraceId() };
}
```

### 5.3 API 客户端集成

```typescript
// frontend/src/services/api.ts
import { getTraceIdHeader } from '../lib/logger';

const API_BASE = '/api';

async function request<T>(
  path: string, 
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getTraceIdHeader(),
    ...options.headers
  };
  
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });
  
  // 保存后端返回的 traceId
  const traceId = response.headers.get('x-trace-id');
  if (traceId) {
    sessionStorage.setItem('x-trace-id', traceId);
  }
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}
```

### 5.4 ErrorBoundary 组件

```typescript
// frontend/src/components/common/ErrorBoundary.tsx
import React from 'react';
import { logger } from '../../lib/logger';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('React ErrorBoundary caught error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 5.5 全局错误处理

```typescript
// frontend/src/main.tsx
import { logger } from './lib/logger';

// 捕获 JavaScript 错误
window.onerror = (message, source, lineno, colno, error) => {
  logger.error('Uncaught error', {
    message,
    source,
    lineno,
    colno,
    stack: error?.stack
  });
  return false;
};

// 捕获 Promise rejection
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection', {
    reason: event.reason
  });
});

// 捕获资源加载错误
window.addEventListener('error', (event) => {
  if (event.target !== window) {
    logger.error('Resource loading error', {
      target: (event.target as HTMLElement).tagName,
      src: (event.target as HTMLImageElement).src
    });
  }
}, true);
```

---

## 6. 错误追踪与上报

### 6.1 后端日志收集接口

```typescript
// backend/routes/logs.ts
import { FastifyInstance } from 'fastify';
import { createLogger } from '../utils/logger';

const logger = createLogger('log-collector');

export async function logRoutes(app: FastifyInstance) {
  app.post('/api/logs', {
    config: { 
      rateLimit: { max: 100, timeWindow: '1 minute' }
    }
  }, async (request, reply) => {
    const { level, msg, traceId, ...context } = request.body as any;
    
    // 记录前端上报的日志
    logger.info({
      traceId,
      msg: `[Frontend] ${msg}`,
      level,
      ...context
    });
    
    return { success: true };
  });
}
```

### 6.2 关键操作审计日志

```typescript
// backend/services/audit.ts
import { createLogger } from '../utils/logger';
import type { FastifyRequest } from 'fastify';

const logger = createLogger('audit');

export const AuditLog = {
  // 安装操作
  installStart(request: FastifyRequest, packageName: string) {
    logger.info({
      traceId: request.traceId,
      msg: 'AUDIT: Install started',
      action: 'install',
      packageName
    });
  },
  
  installComplete(request: FastifyRequest, packageName: string) {
    logger.info({
      traceId: request.traceId,
      msg: 'AUDIT: Install completed',
      action: 'install',
      packageName,
      status: 'success'
    });
  },
  
  // 配置变更
  configChange(request: FastifyRequest, configType: string, changes: Record<string, unknown>) {
    logger.info({
      traceId: request.traceId,
      msg: 'AUDIT: Configuration changed',
      action: 'config_change',
      configType,
      changes
    });
  },
  
  // 敏感操作
  apiKeySet(request: FastifyRequest, provider: string) {
    logger.warn({
      traceId: request.traceId,
      msg: 'AUDIT: API key set',
      action: 'api_key_set',
      provider
      // 注意：不记录实际的 key 值
    });
  }
};
```

---

## 7. 日志存储与轮转

### 7.1 文件存储配置

```typescript
// backend/utils/logger-file.ts
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import pino from 'pino';
import { rotato } from 'rotato';

const LOG_DIR = join(process.env.HOME || '.', '.easy-openclaw', 'logs');

// 确保日志目录存在
await mkdir(LOG_DIR, { recursive: true });

// 文件输出流
const fileStream = rotato({
  path: LOG_DIR,
  name: 'easy-openclaw',
  ext: '.log',
  size: '10m',      // 单文件最大 10MB
  interval: '1d',   // 每天轮转
  compress: 'gzip', // 压缩旧文件
  keep: 7           // 保留 7 天
});

// 多目标输出（控制台 + 文件）
const streams = [
  { level: 'debug', stream: process.stdout },
  { level: 'info', stream: fileStream }
];

export const fileLogger = pino({
  level: 'debug'
}, pino.multistream(streams));
```

### 7.2 日志文件结构

```
~/.easy-openclaw/logs/
├── easy-openclaw.2026-03-08.log      # 当天日志
├── easy-openclaw.2026-03-07.log.gz   # 昨天日志（压缩）
├── easy-openclaw.2026-03-06.log.gz
├── ...
└── easy-openclaw.2026-03-01.log.gz   # 7 天前的日志会被删除
```

### 7.3 日志清理策略

```typescript
// backend/jobs/log-cleanup.ts
import { readdir, unlink } from 'fs/promises';
import { join } from 'path';

const LOG_DIR = join(process.env.HOME || '.', '.easy-openclaw', 'logs');
const MAX_DAYS = 7;

export async function cleanupOldLogs() {
  const files = await readdir(LOG_DIR);
  const now = Date.now();
  const maxAge = MAX_DAYS * 24 * 60 * 60 * 1000;
  
  for (const file of files) {
    const filePath = join(LOG_DIR, file);
    const stat = await stat(filePath);
    
    if (now - stat.mtimeMs > maxAge) {
      await unlink(filePath);
      console.log(`Deleted old log: ${file}`);
    }
  }
}

// 每天执行一次
setInterval(cleanupOldLogs, 24 * 60 * 60 * 1000);
```

---

## 8. 环境配置

### 8.1 环境变量

```bash
# .env.development
NODE_ENV=development
LOG_LEVEL=debug
LOG_FILE_ENABLED=false
LOG_PRETTY=true

# .env.production
NODE_ENV=production
LOG_LEVEL=info
LOG_FILE_ENABLED=true
LOG_PRETTY=false
LOG_DIR=~/.easy-openclaw/logs
LOG_MAX_SIZE=10m
LOG_MAX_DAYS=7
```

### 8.2 配置加载

```typescript
// backend/config/logging.ts
export const loggingConfig = {
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  file: {
    enabled: process.env.LOG_FILE_ENABLED === 'true',
    dir: process.env.LOG_DIR || join(process.env.HOME || '.', '.easy-openclaw', 'logs'),
    maxSize: process.env.LOG_MAX_SIZE || '10m',
    maxDays: parseInt(process.env.LOG_MAX_DAYS || '7', 10)
  },
  pretty: process.env.LOG_PRETTY === 'true'
};
```

---

## 9. 实施计划

### 9.1 分阶段实施

| 阶段 | 任务 | 优先级 | 预估工时 |
|------|------|--------|----------|
| **Phase 1** | 后端日志增强 | P0 | 4h |
| | - 敏感字段脱敏 | | 1h |
| | - 请求追踪 ID | | 2h |
| | - 响应时间记录 | | 1h |
| **Phase 2** | 前端日志体系 | P0 | 4h |
| | - Logger 工具类 | | 1h |
| | - API 集成 traceId | | 1h |
| | - ErrorBoundary | | 1h |
| | - 全局错误处理 | | 1h |
| **Phase 3** | 文件存储与轮转 | P1 | 3h |
| | - 文件输出配置 | | 1h |
| | - 日志轮转 | | 1h |
| | - 清理策略 | | 1h |
| **Phase 4** | 错误上报 | P1 | 2h |
| | - 后端收集接口 | | 1h |
| | - 前端上报集成 | | 1h |
| **Phase 5** | 审计日志 | P2 | 2h |
| | - 关键操作记录 | | 2h |

### 9.2 总计

- **总工时**: 15 小时
- **优先级 P0**: 8 小时（必须完成）
- **优先级 P1**: 5 小时（推荐完成）
- **优先级 P2**: 2 小时（可选完成）

### 9.3 验收标准

1. ✅ 每个请求都有唯一 traceId，前后端可关联
2. ✅ 敏感信息（API Key、Token）在日志中脱敏
3. ✅ 生产环境日志写入文件，自动轮转
4. ✅ 前端错误能自动上报到后端
5. ✅ 关键操作有审计日志记录

---

## 附录

### A. 日志示例

#### 正常请求日志
```json
{
  "level": "info",
  "time": "2026-03-08T14:30:00.000Z",
  "traceId": "550e8400-e29b-41d4-a716-446655440000",
  "service": "easy-openclaw-backend",
  "module": "installer",
  "msg": "Installation completed",
  "packageName": "openclaw",
  "responseTime": 1234
}
```

#### 错误日志
```json
{
  "level": "error",
  "time": "2026-03-08T14:30:00.000Z",
  "traceId": "550e8400-e29b-41d4-a716-446655440001",
  "service": "easy-openclaw-backend",
  "module": "installer",
  "msg": "Installation failed",
  "packageName": "openclaw",
  "error": "npm install failed with exit code 1",
  "stack": "Error: npm install failed...\n    at InstallerService.install..."
}
```

#### 脱敏日志
```json
{
  "level": "info",
  "time": "2026-03-08T14:30:00.000Z",
  "traceId": "550e8400-e29b-41d4-a716-446655440002",
  "service": "easy-openclaw-backend",
  "module": "channel-config",
  "msg": "API key configured",
  "provider": "openai",
  "apiKey": "sk-a****1234"
}
```

### B. 参考资料

- [Pino 官方文档](https://getpino.io/)
- [Fastify 日志最佳实践](https://fastify.dev/docs/latest/Reference/Logging/)
- [React ErrorBoundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [OWASP 日志安全指南](https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/10-Logging_and_Monitoring_Testing/01_Testing_for_Logging)
