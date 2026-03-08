## Context

The `easy-openclaw` project provides a one-click GUI installer for OpenClaw. The backend (`backend/`) is already fully implemented with Fastify 5 and TypeScript — it covers all REST API routes, services, executors, models, and utilities. The `shared/types.ts` is also complete.

Two components from `docs/plan/backend-design.md` are not yet implemented:
1. `backend/executors/npm.ts` — typed npm command wrapper (referenced in design but only `shell.ts` and `openclaw-cli.ts` exist)
2. `electron/` directory — the Electron main process that wraps the Fastify server and renders the frontend

## Goals / Non-Goals

**Goals:**
- Add the missing `backend/executors/npm.ts` executor with typed interfaces for npm install/list/config operations
- Scaffold the `electron/` directory: `main.ts`, `preload.ts`, `ipc/installer.ts`, `ipc/config.ts`
- Maintain zero TypeScript errors across the entire codebase

**Non-Goals:**
- Modifying any existing working backend code
- Implementing frontend React/Vue components (separate change)
- Adding Electron build tooling or packaging configuration
- Adding `keytar` (system keychain) — the design mentions it but existing code does not use it; out of scope

## Decisions

**npm.ts executor**: Wraps `shell.ts` `execCommand` with named functions: `npmInstall(pkg, opts)`, `npmList(opts)`, `npmConfigGet(key)`. Returns structured results. No new deps.

**Electron entry (`electron/main.ts`)**: Starts the Fastify backend in-process, creates a `BrowserWindow` that loads the frontend dev server (or built `dist/`). Uses IPC for privileged operations.

**Preload (`electron/preload.ts`)**: Exposes a minimal `electronAPI` via `contextBridge` for IPC communication. Allows renderer to call `installer.*` and `config.*` methods without direct Node access.

**IPC handlers**: `ipc/installer.ts` bridges `ipcMain` events to `InstallerService`; `ipc/config.ts` bridges to `ModelConfigService` and `ChannelConfigService`.

## Risks / Trade-offs

- Electron is listed as a dev dependency only until the project decides to package as a desktop app — the Fastify backend can also run standalone (no Electron needed for CLI usage)
- The IPC preload uses a type-unsafe `ipcRenderer.invoke` — accepted for now since the full type contract lives in `shared/types.ts`
