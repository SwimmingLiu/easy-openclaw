// services/gateway.ts
// Gateway management APIs

import { ipcClient } from './api'
import type { GatewayStatus } from '@shared/types'

export type { GatewayStatus }

/**
 * Get gateway status
 */
export async function getGatewayStatus(): Promise<GatewayStatus> {
  const result = await ipcClient.gatewayStatus()
  return result as GatewayStatus
}

/**
 * Start gateway
 */
export async function startGateway(): Promise<{ success: boolean }> {
  return ipcClient.gatewayStart()
}

/**
 * Stop gateway
 */
export async function stopGateway(): Promise<{ success: boolean }> {
  return ipcClient.gatewayStop()
}

/**
 * Restart gateway
 */
export async function restartGateway(): Promise<{ success: boolean }> {
  return ipcClient.gatewayRestart()
}

/**
 * Get gateway dashboard URL
 */
export async function getGatewayDashboardUrl(): Promise<string> {
  const result = await ipcClient.gatewayDashboardUrl()
  return result as string
}

/**
 * Open gateway dashboard in browser
 */
export async function openGatewayDashboard(): Promise<void> {
  const url = await getGatewayDashboardUrl()
  window.open(url, '_blank')
}

/**
 * Format uptime to human readable string
 */
export function formatUptime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)} 秒`
  }
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} 分钟`
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours} 小时 ${minutes} 分钟`
  }
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  return `${days} 天 ${hours} 小时`
}
