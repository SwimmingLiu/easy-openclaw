// types/electron.d.ts
// TypeScript declarations for Electron IPC API

import type {
  SystemInfo,
  PrerequisiteCheck,
  InstallOptions,
  InstallEvent,
  AIProvider,
  ProviderConfig,
  CurrentModelConfig,
  TestResult,
  Channel,
  CurrentChannelConfig,
  GatewayStatus,
} from '@shared/types'

export type ElectronAPI = {
  installer: {
    start: (options: InstallOptions) => Promise<{ installId: string }>
    stream: (
      installId: string,
      options: InstallOptions,
      onEvent: (event: InstallEvent) => void
    ) => Promise<{ done: boolean }>
    cancel: (installId: string) => Promise<{ success: boolean }>
  }
  config: {
    getSystemInfo: () => Promise<SystemInfo>
    checkPrerequisites: () => Promise<PrerequisiteCheck[]>
    getProviders: () => Promise<AIProvider[]>
    getCurrentModel: () => Promise<CurrentModelConfig | null>
    configureProvider: (config: ProviderConfig) => Promise<{ success: boolean }>
    testProvider: (config: ProviderConfig) => Promise<TestResult>
    getSupportedChannels: () => Promise<Channel[]>
    getCurrentChannels: () => Promise<CurrentChannelConfig[]>
    configureChannel: (channelId: string, fields: Record<string, string>) => Promise<{ success: boolean }>
    testChannel: (channelId: string, fields: Record<string, string>) => Promise<TestResult>
    deleteChannel: (channelId: string) => Promise<{ success: boolean }>
    gatewayStart: () => Promise<{ success: boolean }>
    gatewayStop: () => Promise<{ success: boolean }>
    gatewayRestart: () => Promise<{ success: boolean }>
    gatewayStatus: () => Promise<GatewayStatus>
    gatewayDashboardUrl: () => Promise<string>
  }
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
