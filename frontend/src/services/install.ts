// services/install.ts
// Installation flow APIs with SSE events

import { ipcClient } from './api'
import type { InstallOptions, InstallEvent, InstallStatus } from '@shared/types'

export type { InstallOptions, InstallEvent, InstallStatus }

/**
 * Start installation process
 */
export async function startInstall(
  options: InstallOptions
): Promise<{ installId: string }> {
  return ipcClient.startInstall(options)
}

/**
 * Stream installation events
 * Returns a cleanup function to unsubscribe
 */
export function streamInstallEvents(
  installId: string,
  options: InstallOptions,
  onEvent: (event: InstallEvent) => void
): () => void {
  // The IPC stream method handles the subscription internally
  // We need to track if we should ignore further events
  let cancelled = false

  ipcClient.streamInstall(installId, options, (event) => {
    if (!cancelled) {
      onEvent(event as InstallEvent)
    }
  })

  // Return cleanup function
  return () => {
    cancelled = true
  }
}

/**
 * Cancel ongoing installation
 */
export async function cancelInstall(installId: string): Promise<{ success: boolean }> {
  return ipcClient.cancelInstall(installId)
}

/**
 * Installation step names for display
 */
export const INSTALL_STEPS = [
  { id: 'check-permissions', name: '检查权限' },
  { id: 'install-nodejs', name: '安装 Node.js' },
  { id: 'verify-npm', name: '验证 npm' },
  { id: 'install-openclaw', name: '安装 OpenClaw' },
  { id: 'create-config', name: '创建配置目录' },
  { id: 'verify-install', name: '验证安装' },
] as const

export type InstallStepId = typeof INSTALL_STEPS[number]['id']

/**
 * Get step name by ID
 */
export function getStepName(stepId: string): string {
  const step = INSTALL_STEPS.find(s => s.id === stepId)
  return step?.name ?? stepId
}
