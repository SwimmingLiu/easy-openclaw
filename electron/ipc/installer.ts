// electron/ipc/installer.ts
// IPC handlers for installation operations

import { ipcMain } from 'electron';
import { InstallerService } from '../../backend/services/installer.js';
import type { InstallOptions } from '../../shared/types.js';

const installer = new InstallerService();

/**
 * Register all installer-related IPC handlers
 */
export function registerInstallerHandlers(): void {
  /**
   * Start installation — returns installId
   */
  ipcMain.handle('installer:start', async (_event, options: InstallOptions) => {
    const { randomUUID } = await import('node:crypto');
    const installId = randomUUID();
    return { installId };
  });

  /**
   * Stream install events — sends progress via IPC events back to renderer
   * The renderer should call installer:start first, then listen to installer:event-<installId>
   */
  ipcMain.handle(
    'installer:stream',
    async (event, installId: string, options: InstallOptions) => {
      const gen = installer.install(installId, options);

      try {
        for await (const installEvent of gen) {
          // Send events back to the specific renderer window
          event.sender.send(`installer:event:${installId}`, installEvent);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        event.sender.send(`installer:event:${installId}`, {
          type: 'step-error',
          step: 'unknown',
          error: message,
        });
      }

      return { done: true };
    },
  );

  /**
   * Cancel an active installation
   */
  ipcMain.handle('installer:cancel', async (_event, installId: string) => {
    installer.cancel(installId);
    return { success: true };
  });
}
