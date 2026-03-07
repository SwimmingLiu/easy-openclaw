// services/config.ts
// Configuration APIs for AI providers and notification channels

import { ipcClient } from './api'
import type {
  AIProvider,
  ProviderConfig,
  CurrentModelConfig,
  TestResult,
  Channel,
  CurrentChannelConfig,
} from '@shared/types'

export type {
  AIProvider,
  ProviderConfig,
  CurrentModelConfig,
  TestResult,
  Channel,
  CurrentChannelConfig,
}

// ==================== AI Providers ====================

/**
 * Get all supported AI providers
 */
export async function getProviders(): Promise<AIProvider[]> {
  const result = await ipcClient.getProviders()
  return result as AIProvider[]
}

/**
 * Get current model configuration
 */
export async function getCurrentModel(): Promise<CurrentModelConfig | null> {
  const result = await ipcClient.getCurrentModel()
  return result as CurrentModelConfig | null
}

/**
 * Configure an AI provider
 */
export async function configureProvider(config: ProviderConfig): Promise<{ success: boolean }> {
  return ipcClient.configureProvider(config)
}

/**
 * Test AI provider connection
 */
export async function testProvider(config: ProviderConfig): Promise<TestResult> {
  const result = await ipcClient.testProvider(config)
  return result as TestResult
}

// ==================== Notification Channels ====================

/**
 * Get all supported notification channels
 */
export async function getSupportedChannels(): Promise<Channel[]> {
  const result = await ipcClient.getSupportedChannels()
  return result as Channel[]
}

/**
 * Get currently configured channels
 */
export async function getCurrentChannels(): Promise<CurrentChannelConfig[]> {
  const result = await ipcClient.getCurrentChannels()
  return result as CurrentChannelConfig[]
}

/**
 * Configure a notification channel
 */
export async function configureChannel(
  channelId: string,
  fields: Record<string, string>
): Promise<{ success: boolean }> {
  return ipcClient.configureChannel(channelId, fields)
}

/**
 * Test a notification channel
 */
export async function testChannel(
  channelId: string,
  fields: Record<string, string>
): Promise<TestResult> {
  const result = await ipcClient.testChannel(channelId, fields)
  return result as TestResult
}

/**
 * Delete a notification channel
 */
export async function deleteChannel(channelId: string): Promise<{ success: boolean }> {
  return ipcClient.deleteChannel(channelId)
}
