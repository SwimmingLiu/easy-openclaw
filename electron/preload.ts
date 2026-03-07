// electron/preload.ts
// IPC bridge preload script — exposes electronAPI to renderer via contextBridge

import { contextBridge, ipcRenderer } from 'electron';
import type { InstallOptions, ProviderConfig } from '../shared/types.js';

/**
 * Typed API exposed to the renderer process
 */
const electronAPI = {
  installer: {
    /** Start installation, returns installId */
    start: (options: InstallOptions): Promise<{ installId: string }> =>
      ipcRenderer.invoke('installer:start', options),

    /** Stream install events. Registers a listener and triggers the stream. */
    stream: (
      installId: string,
      options: InstallOptions,
      onEvent: (event: unknown) => void,
    ): Promise<{ done: boolean }> => {
      ipcRenderer.on(`installer:event:${installId}`, (_ipcEvent, data) => onEvent(data));
      return ipcRenderer.invoke('installer:stream', installId, options);
    },

    /** Cancel an active installation */
    cancel: (installId: string): Promise<{ success: boolean }> =>
      ipcRenderer.invoke('installer:cancel', installId),
  },

  config: {
    /** Get system info */
    getSystemInfo: () => ipcRenderer.invoke('config:getSystemInfo'),

    /** Check prerequisites */
    checkPrerequisites: () => ipcRenderer.invoke('config:checkPrerequisites'),

    /** Get supported AI providers */
    getProviders: () => ipcRenderer.invoke('config:getProviders'),

    /** Get currently configured model */
    getCurrentModel: () => ipcRenderer.invoke('config:getCurrentModel'),

    /** Configure an AI provider */
    configureProvider: (config: ProviderConfig) =>
      ipcRenderer.invoke('config:configureProvider', config),

    /** Test AI provider connection */
    testProvider: (config: ProviderConfig) =>
      ipcRenderer.invoke('config:testProvider', config),

    /** Get supported notification channels */
    getSupportedChannels: () => ipcRenderer.invoke('config:getSupportedChannels'),

    /** Get currently configured channels */
    getCurrentChannels: () => ipcRenderer.invoke('config:getCurrentChannels'),

    /** Configure a notification channel */
    configureChannel: (channelId: string, fields: Record<string, string>) =>
      ipcRenderer.invoke('config:configureChannel', channelId, fields),

    /** Test a notification channel */
    testChannel: (channelId: string, fields: Record<string, string>) =>
      ipcRenderer.invoke('config:testChannel', channelId, fields),

    /** Delete a notification channel */
    deleteChannel: (channelId: string) =>
      ipcRenderer.invoke('config:deleteChannel', channelId),

    /** Start gateway */
    gatewayStart: () => ipcRenderer.invoke('config:gatewayStart'),

    /** Stop gateway */
    gatewayStop: () => ipcRenderer.invoke('config:gatewayStop'),

    /** Restart gateway */
    gatewayRestart: () => ipcRenderer.invoke('config:gatewayRestart'),

    /** Get gateway status */
    gatewayStatus: () => ipcRenderer.invoke('config:gatewayStatus'),

    /** Get gateway dashboard URL */
    gatewayDashboardUrl: () => ipcRenderer.invoke('config:gatewayDashboardUrl'),
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// TypeScript augmentation for renderer usage
export type ElectronAPI = typeof electronAPI;
