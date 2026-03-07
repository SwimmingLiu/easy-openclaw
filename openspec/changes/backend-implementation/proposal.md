## Why

The Easy OpenClaw backend provides the REST API and business logic layer for a one-click OpenClaw installer GUI. The core backend code (`backend/`) is already implemented but several components from the design spec are missing: the `electron/` main process scaffolding, the `npm.ts` executor, and the OpenSpec change artifacts to track and verify this implementation.

## What Changes

- Add `backend/executors/npm.ts` — typed npm command executor missing from design spec
- Add `electron/main.ts` — Electron main process entry point
- Add `electron/preload.ts` — IPC bridge preload script
- Add `electron/ipc/installer.ts` — Installer IPC handlers
- Add `electron/ipc/config.ts` — Config IPC handlers
- Verify all existing backend files match the design spec (`backend-design.md`)
- No modifications to the existing, working backend code

## Capabilities

### New Capabilities

- `npm-executor`: Typed npm command executor wrapping shell commands for install, list, and config operations
- `electron-main`: Electron main process that hosts the Fastify backend and manages the renderer window with IPC bridge

### Modified Capabilities

## Impact

- New files: `backend/executors/npm.ts`, `electron/main.ts`, `electron/preload.ts`, `electron/ipc/installer.ts`, `electron/ipc/config.ts`
- No changes to existing working code
- Requires `electron` and `electron-builder` dev dependencies for the Electron shell
