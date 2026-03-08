// services/api.ts
// API client wrapper - uses Electron IPC for communication

import type { ApiResponse, ApiError } from '@shared/types'
import { getTraceIdHeader, setTraceId } from '../lib/logger'

const API_BASE_URL = '/api'

export class ApiClientError extends Error {
  code: string
  suggestion?: string
  details?: string

  constructor(error: ApiError) {
    super(error.message)
    this.name = 'ApiClientError'
    this.code = error.code
    this.suggestion = error.suggestion
    this.details = error.details
  }
}

/**
 * Generic fetch wrapper with error handling and trace ID support
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...getTraceIdHeader(),
      ...options?.headers,
    },
    ...options,
  })

  // Update trace ID from backend response
  const backendTraceId = response.headers.get('x-trace-id')
  if (backendTraceId) {
    setTraceId(backendTraceId)
  }

  const data: ApiResponse<T> = await response.json()

  if (!data.success || data.error) {
    throw new ApiClientError(data.error || {
      code: 'UNKNOWN_ERROR',
      message: '发生未知错误',
    })
  }

  return data.data as T
}

/**
 * Electron IPC-based API client
 * Uses window.electronAPI exposed by preload script
 */
export const ipcClient = {
  // System APIs
  async getSystemInfo() {
    return window.electronAPI.config.getSystemInfo()
  },

  async checkPrerequisites() {
    return window.electronAPI.config.checkPrerequisites()
  },

  // Installer APIs
  async startInstall(options: { nodejsMethod: 'auto' | 'nvm' | 'official'; skipOnboard?: boolean }) {
    return window.electronAPI.installer.start(options)
  },

  async streamInstall(
    installId: string,
    options: { nodejsMethod: 'auto' | 'nvm' | 'official'; skipOnboard?: boolean },
    onEvent: (event: unknown) => void
  ) {
    return window.electronAPI.installer.stream(installId, options, onEvent)
  },

  async cancelInstall(installId: string) {
    return window.electronAPI.installer.cancel(installId)
  },

  // Provider APIs
  async getProviders() {
    return window.electronAPI.config.getProviders()
  },

  async getCurrentModel() {
    return window.electronAPI.config.getCurrentModel()
  },

  async configureProvider(config: {
    providerId: string
    apiKey: string
    baseUrl?: string
    apiType?: string
    model: string
  }) {
    return window.electronAPI.config.configureProvider(config)
  },

  async testProvider(config: {
    providerId: string
    apiKey: string
    baseUrl?: string
    apiType?: string
    model: string
  }) {
    return window.electronAPI.config.testProvider(config)
  },

  // Channel APIs
  async getSupportedChannels() {
    return window.electronAPI.config.getSupportedChannels()
  },

  async getCurrentChannels() {
    return window.electronAPI.config.getCurrentChannels()
  },

  async configureChannel(channelId: string, fields: Record<string, string>) {
    return window.electronAPI.config.configureChannel(channelId, fields)
  },

  async testChannel(channelId: string, fields: Record<string, string>) {
    return window.electronAPI.config.testChannel(channelId, fields)
  },

  async deleteChannel(channelId: string) {
    return window.electronAPI.config.deleteChannel(channelId)
  },

  // Gateway APIs
  async gatewayStart() {
    return window.electronAPI.config.gatewayStart()
  },

  async gatewayStop() {
    return window.electronAPI.config.gatewayStop()
  },

  async gatewayRestart() {
    return window.electronAPI.config.gatewayRestart()
  },

  async gatewayStatus() {
    return window.electronAPI.config.gatewayStatus()
  },

  async gatewayDashboardUrl() {
    return window.electronAPI.config.gatewayDashboardUrl()
  },
}

// Type guard to check if running in Electron
export function isElectron(): boolean {
  return typeof window !== 'undefined' && typeof window.electronAPI !== 'undefined'
}
