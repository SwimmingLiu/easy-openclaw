// electron/ipc/config.ts
// IPC handlers for configuration operations (system detection, models, channels, gateway)

import { ipcMain } from 'electron';
import { DetectorService } from '../../backend/services/detector.js';
import { ModelConfigService } from '../../backend/services/model-config.js';
import { ChannelConfigService } from '../../backend/services/channel-config.js';
import { GatewayService } from '../../backend/services/gateway.js';
import type { ProviderConfig } from '../../shared/types.js';

const detector = new DetectorService();
const modelConfig = new ModelConfigService();
const channelConfig = new ChannelConfigService();
const gateway = new GatewayService();

/**
 * Register all config-related IPC handlers
 */
export function registerConfigHandlers(): void {
  // ==================== System ====================

  ipcMain.handle('config:getSystemInfo', async () => {
    return detector.getSystemInfo();
  });

  ipcMain.handle('config:checkPrerequisites', async () => {
    return detector.checkPrerequisites();
  });

  // ==================== AI Models ====================

  ipcMain.handle('config:getProviders', () => {
    return modelConfig.getSupportedProviders();
  });

  ipcMain.handle('config:getCurrentModel', async () => {
    return modelConfig.getCurrentConfig();
  });

  ipcMain.handle('config:configureProvider', async (_event, config: ProviderConfig) => {
    await modelConfig.configureProvider(config);
    return { success: true };
  });

  ipcMain.handle('config:testProvider', async (_event, config: ProviderConfig) => {
    return modelConfig.testConnection(config);
  });

  // ==================== Channels ====================

  ipcMain.handle('config:getSupportedChannels', () => {
    return channelConfig.getSupportedChannels();
  });

  ipcMain.handle('config:getCurrentChannels', async () => {
    return channelConfig.getCurrentChannels();
  });

  ipcMain.handle(
    'config:configureChannel',
    async (_event, channelId: string, fields: Record<string, string>) => {
      await channelConfig.configureChannel(channelId, fields);
      return { success: true };
    },
  );

  ipcMain.handle(
    'config:testChannel',
    async (_event, channelId: string, fields: Record<string, string>) => {
      return channelConfig.testChannel(channelId, fields);
    },
  );

  ipcMain.handle('config:deleteChannel', async (_event, channelId: string) => {
    await channelConfig.removeChannel(channelId);
    return { success: true };
  });

  // ==================== Gateway ====================

  ipcMain.handle('config:gatewayStart', async () => {
    await gateway.start();
    return { success: true };
  });

  ipcMain.handle('config:gatewayStop', async () => {
    await gateway.stop();
    return { success: true };
  });

  ipcMain.handle('config:gatewayRestart', async () => {
    await gateway.restart();
    return { success: true };
  });

  ipcMain.handle('config:gatewayStatus', async () => {
    return gateway.getStatus();
  });

  ipcMain.handle('config:gatewayDashboardUrl', async () => {
    const url = await gateway.getDashboardUrl();
    return { url };
  });
}
