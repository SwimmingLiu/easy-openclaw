## ADDED Requirements

### Requirement: Electron application shell
The Electron main process SHALL host the Fastify backend and render the frontend UI in a desktop window.

#### Scenario: Application startup
- **WHEN** the Electron app launches
- **THEN** starts the Fastify backend on `localhost:18790`, creates a `BrowserWindow`, and loads the frontend URL

#### Scenario: IPC bridge for installer
- **WHEN** the renderer calls `window.electronAPI.installer.start(options)` via preload
- **THEN** the main process invokes `InstallerService` and streams events back to renderer via IPC

#### Scenario: IPC bridge for config
- **WHEN** the renderer calls `window.electronAPI.config.getSystemInfo()`
- **THEN** the main process returns the system info from `DetectorService`

#### Scenario: Context isolation
- **WHEN** the preload script runs
- **THEN** only the explicitly exposed `electronAPI` object is accessible in the renderer; no Node.js globals are exposed

#### Scenario: Graceful shutdown
- **WHEN** the BrowserWindow is closed
- **THEN** the Fastify server is stopped and the process exits cleanly
