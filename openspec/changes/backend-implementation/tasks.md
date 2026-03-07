## 1. Backend Verification

- [x] 1.1 Verify `backend/server.ts` — Fastify 5 entry point with CORS, sensible, error handler, and all route registrations ✅
- [x] 1.2 Verify `backend/routes/system.ts` — GET /api/system/info, GET /api/system/check-prerequisites ✅
- [x] 1.3 Verify `backend/routes/install.ts` — POST /start, GET /:id/events (SSE), POST /cancel ✅
- [x] 1.4 Verify `backend/routes/models.ts` — GET /providers, GET /current, POST /configure, POST /test ✅
- [x] 1.5 Verify `backend/routes/channels.ts` — GET /supported, GET /current, POST /:id/configure, POST /:id/test, DELETE /:id ✅
- [x] 1.6 Verify `backend/routes/gateway.ts` — POST /start, /stop, /restart; GET /status, /dashboard-url, /health ✅
- [x] 1.7 Verify `backend/services/detector.ts` — OS, Node.js, npm, package manager, OpenClaw detection ✅
- [x] 1.8 Verify `backend/services/installer.ts` — step-based install with SSE generator and rollback ✅
- [x] 1.9 Verify `backend/services/model-config.ts` — provider list, config read/write, test connection ✅
- [x] 1.10 Verify `backend/services/channel-config.ts` — channel list, configure, test, delete ✅
- [x] 1.11 Verify `backend/services/gateway.ts` — start/stop/restart/status/health/dashboard-url ✅
- [x] 1.12 Verify `backend/executors/shell.ts` — execCommand, spawnStream with streaming support ✅
- [x] 1.13 Verify `backend/executors/openclaw-cli.ts` — typed OpenClaw CLI wrapper ✅
- [x] 1.14 Verify `shared/types.ts` — SystemInfo, InstallEvent, AIProvider, Channel, GatewayStatus ✅
- [x] 1.15 Run `tsc --noEmit` — zero errors ✅

## 2. npm Executor

- [x] 2.1 Create `backend/executors/npm.ts` with `npmInstall(pkg, opts)`, `npmList(opts)`, `npmConfigGet(key)`, `npmConfigSet(key, value)` using `execCommand` from `shell.ts`
- [x] 2.2 Export typed interfaces: `NpmInstallOptions`, `NpmListOptions`, `NpmListResult`
- [x] 2.3 Run `tsc --noEmit` — zero errors

## 3. Electron Main Process

- [x] 3.1 Create `electron/main.ts` — starts Fastify via `buildApp()`, creates `BrowserWindow` loading frontend URL, registers IPC handlers, handles graceful shutdown
- [x] 3.2 Create `electron/preload.ts` — exposes `window.electronAPI` via `contextBridge` with `installer.*` and `config.*` methods using `ipcRenderer.invoke`
- [x] 3.3 Create `electron/ipc/installer.ts` — registers `ipcMain.handle('installer:start', ...)` → `InstallerService`, `installer:cancel`
- [x] 3.4 Create `electron/ipc/config.ts` — registers `ipcMain.handle('config:getSystemInfo', ...)` → `DetectorService`, `config:getProviders`, `config:configureProvider`, `config:getSupportedChannels`, `config:configureChannel`
- [x] 3.5 Run `tsc --noEmit` — zero errors

## 4. Final Verification

- [x] 4.1 Run `npm run type-check` — zero TypeScript errors across entire project
- [x] 4.2 Run `npm run dev` — server starts on port 18790
- [x] 4.3 Run `openclaw system event --text "Done: OpenSpec 后端实现完成" --mode now`
