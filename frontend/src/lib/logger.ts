// frontend/src/lib/logger.ts
// Frontend logging utility with trace ID support and error reporting

import log from 'loglevel';

const TRACE_ID_KEY = 'x-trace-id';

// Log level configuration based on environment
const isProduction = import.meta.env?.PROD ?? process.env.NODE_ENV === 'production';
log.setLevel(isProduction ? 'info' : 'debug');

/**
 * Get or create a trace ID for request correlation
 */
export function getTraceId(): string {
  let traceId = sessionStorage.getItem(TRACE_ID_KEY);
  if (!traceId) {
    traceId = crypto.randomUUID();
    sessionStorage.setItem(TRACE_ID_KEY, traceId);
  }
  return traceId;
}

/**
 * Update trace ID from backend response
 */
export function setTraceId(traceId: string): void {
  sessionStorage.setItem(TRACE_ID_KEY, traceId);
}

/**
 * Redact sensitive fields in log context
 */
function redactSensitive(obj: Record<string, unknown>): Record<string, unknown> {
  const sensitiveFields = ['apiKey', 'token', 'password', 'secret', 'authorization'];
  const result = { ...obj };

  for (const field of sensitiveFields) {
    if (result[field] && typeof result[field] === 'string') {
      const value = result[field] as string;
      result[field] =
        value.length > 8 ? value.slice(0, 4) + '****' + value.slice(-4) : '******';
    }
  }

  return result;
}

/**
 * Report error to backend
 */
async function reportToBackend(
  level: string,
  message: string,
  context?: Record<string, unknown>
): Promise<void> {
  if (!isProduction) return;

  try {
    await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-trace-id': getTraceId(),
      },
      body: JSON.stringify({
        level,
        msg: message,
        traceId: getTraceId(),
        timestamp: new Date().toISOString(),
        ...redactSensitive(context || {}),
      }),
    });
  } catch {
    // Silently fail - don't block on logging errors
  }
}

/**
 * Logger interface matching loglevel API
 */
export const logger = {
  trace: (msg: string, context?: Record<string, unknown>): void => {
    log.trace(msg, context);
  },

  debug: (msg: string, context?: Record<string, unknown>): void => {
    log.debug(msg, context);
  },

  info: (msg: string, context?: Record<string, unknown>): void => {
    log.info(msg, context);
  },

  warn: (msg: string, context?: Record<string, unknown>): void => {
    log.warn(msg, context);
    reportToBackend('warn', msg, context);
  },

  error: (msg: string, context?: Record<string, unknown>): void => {
    log.error(msg, context);
    reportToBackend('error', msg, context);
  },
};

/**
 * Get headers with trace ID for API requests
 */
export function getTraceIdHeader(): { 'x-trace-id': string } {
  return { 'x-trace-id': getTraceId() };
}
