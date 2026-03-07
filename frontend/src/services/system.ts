// services/system.ts
// System information and prerequisite check APIs

import { ipcClient } from './api'
import type { SystemInfo, PrerequisiteCheck } from '@shared/types'

/**
 * Get system information
 */
export async function getSystemInfo(): Promise<SystemInfo> {
  const result = await ipcClient.getSystemInfo()
  return result as SystemInfo
}

/**
 * Check system prerequisites
 */
export async function checkPrerequisites(): Promise<PrerequisiteCheck[]> {
  const result = await ipcClient.checkPrerequisites()
  return result as PrerequisiteCheck[]
}

/**
 * Check if OpenClaw is installed
 */
export async function isOpenClawInstalled(): Promise<boolean> {
  const systemInfo = await getSystemInfo()
  return systemInfo.openclaw?.installed ?? false
}

/**
 * Check if Gateway is running
 */
export async function isGatewayRunning(): Promise<boolean> {
  const systemInfo = await getSystemInfo()
  return systemInfo.openclaw?.gatewayRunning ?? false
}
