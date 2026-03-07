// electron/main.ts
// Electron main process — hosts Fastify backend and renders frontend

import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildApp } from '../backend/server.js';
import { registerInstallerHandlers } from './ipc/installer.js';
import { registerConfigHandlers } from './ipc/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env['EASY_OPENCLAW_PORT'] ?? '18790', 10);
const isDev = process.env['NODE_ENV'] !== 'production';

let mainWindow: BrowserWindow | null = null;
let fastifyServer: Awaited<ReturnType<typeof buildApp>> | null = null;

/**
 * Start the Fastify backend
 */
async function startBackend(): Promise<void> {
  fastifyServer = await buildApp();
  await fastifyServer.listen({ port: PORT, host: '127.0.0.1' });
  console.log(`[main] Fastify backend started on http://127.0.0.1:${PORT}`);
}

/**
 * Stop the Fastify backend gracefully
 */
async function stopBackend(): Promise<void> {
  if (fastifyServer) {
    await fastifyServer.close();
    fastifyServer = null;
  }
}

/**
 * Create the main browser window
 */
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    title: 'Easy OpenClaw',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Load the frontend
  const frontendUrl = isDev
    ? `http://localhost:3000`
    : `http://127.0.0.1:${PORT}`;

  mainWindow.loadURL(frontendUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * App lifecycle
 */
app.whenReady().then(async () => {
  // Register IPC handlers before creating the window
  registerInstallerHandlers();
  registerConfigHandlers();

  // Start backend
  await startBackend();

  // Create window
  createWindow();

  app.on('activate', () => {
    // Re-create window on macOS when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', async () => {
  await stopBackend();

  // On macOS, apps stay open until explicitly quit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async () => {
  await stopBackend();
});
