# Tasks: Logging Implementation

## Phase 1: Backend Logging Enhancement ✅

- [x] Enhance `backend/utils/logger.ts`
  - Add sensitive field redaction (apiKey, token, password, secret)
  - Create `createLogger` factory function
  - Create `createTracedLogger` for trace ID support

- [x] Create `backend/middleware/request-tracing.ts`
  - Generate or extract trace ID from request headers
  - Set trace ID in response headers
  - Log request start and completion
  - Record response time

- [x] Register middleware in `backend/server.ts`
  - Add `requestTracingMiddleware` hook
  - Add `responseTimeHook` hook

- [x] Create `backend/routes/logs.ts`
  - POST `/api/logs` endpoint for frontend error reporting
  - Rate limiting to prevent abuse
  - Log frontend messages with appropriate levels

## Phase 2: Frontend Logging System ✅

- [x] Install dependencies
  - `npm install loglevel @types/loglevel`

- [x] Create `frontend/src/lib/logger.ts`
  - Logger utility based on loglevel
  - Trace ID management (getTraceId, setTraceId)
  - Sensitive field redaction
  - Error reporting to backend
  - getTraceIdHeader() for API requests

- [x] Create `frontend/src/components/common/ErrorBoundary.tsx`
  - React ErrorBoundary component
  - Graceful error UI with reset/reload options
  - Automatic error logging

- [x] Modify `frontend/src/services/api.ts`
  - Integrate trace ID headers in apiFetch
  - Update trace ID from backend response

- [x] Modify `frontend/src/main.tsx`
  - Add global error handlers
  - Capture uncaught errors
  - Capture unhandled promise rejections
  - Capture resource loading errors

- [x] Modify `frontend/src/App.tsx`
  - Wrap application with ErrorBoundary

## Phase 3: File Storage & Rotation (Optional)

- [ ] Create `backend/utils/logger-file.ts`
  - Configure file output streams
  - Implement log rotation (rotato)
  - Support compression of old logs

- [ ] Create `backend/jobs/log-cleanup.ts`
  - Delete logs older than 7 days
  - Schedule daily cleanup

## Phase 4: Error Reporting Integration

- [x] Backend log collection endpoint created
- [x] Frontend error reporting integrated
- [ ] Test end-to-end error flow

## Verification

- [ ] Test trace ID propagation (frontend → backend → frontend)
- [ ] Test sensitive data redaction in logs
- [ ] Test ErrorBoundary error catching
- [ ] Test global error handlers
- [ ] Test error reporting to backend
