// hooks/useConfig.ts
// Hook for managing AI providers and notification channels configuration

import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProviders,
  getCurrentModel,
  configureProvider,
  testProvider,
  getSupportedChannels,
  getCurrentChannels,
  configureChannel,
  testChannel,
  deleteChannel,
} from '@/services/config'
import { useAppStore } from '@/stores/appStore'
import type { ProviderConfig } from '@shared/types'

/**
 * Hook to get AI providers list
 */
export function useProviders() {
  return useQuery({
    queryKey: ['providers'],
    queryFn: getProviders,
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}

/**
 * Hook to get current model configuration
 */
export function useCurrentModel() {
  const setCurrentModel = useAppStore((state) => state.setCurrentModel)

  return useQuery({
    queryKey: ['currentModel'],
    queryFn: async () => {
      const model = await getCurrentModel()
      setCurrentModel(model)
      return model
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to configure an AI provider
 */
export function useConfigureProvider() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (config: ProviderConfig) => configureProvider(config),
    onSuccess: () => {
      // Invalidate and refetch current model
      queryClient.invalidateQueries({ queryKey: ['currentModel'] })
    },
  })
}

/**
 * Hook to test an AI provider
 */
export function useTestProvider() {
  return useMutation({
    mutationFn: (config: ProviderConfig) => testProvider(config),
  })
}

/**
 * Hook to get supported notification channels
 */
export function useSupportedChannels() {
  return useQuery({
    queryKey: ['supportedChannels'],
    queryFn: getSupportedChannels,
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}

/**
 * Hook to get current channels configuration
 */
export function useCurrentChannels() {
  const setChannels = useAppStore((state) => state.setChannels)

  return useQuery({
    queryKey: ['currentChannels'],
    queryFn: async () => {
      const channels = await getCurrentChannels()
      setChannels(channels)
      return channels
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to configure a notification channel
 */
export function useConfigureChannel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ channelId, fields }: { channelId: string; fields: Record<string, string> }) =>
      configureChannel(channelId, fields),
    onSuccess: () => {
      // Invalidate and refetch current channels
      queryClient.invalidateQueries({ queryKey: ['currentChannels'] })
    },
  })
}

/**
 * Hook to test a notification channel
 */
export function useTestChannel() {
  return useMutation({
    mutationFn: ({ channelId, fields }: { channelId: string; fields: Record<string, string> }) =>
      testChannel(channelId, fields),
  })
}

/**
 * Hook to delete a notification channel
 */
export function useDeleteChannel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (channelId: string) => deleteChannel(channelId),
    onSuccess: () => {
      // Invalidate and refetch current channels
      queryClient.invalidateQueries({ queryKey: ['currentChannels'] })
    },
  })
}

/**
 * Combined hook for all configuration operations
 */
export function useConfig() {
  const providers = useProviders()
  const currentModel = useCurrentModel()
  const configureProviderMutation = useConfigureProvider()
  const testProviderMutation = useTestProvider()
  const supportedChannels = useSupportedChannels()
  const currentChannels = useCurrentChannels()
  const configureChannelMutation = useConfigureChannel()
  const testChannelMutation = useTestChannel()
  const deleteChannelMutation = useDeleteChannel()

  const refreshAll = useCallback(() => {
    providers.refetch()
    currentModel.refetch()
    supportedChannels.refetch()
    currentChannels.refetch()
  }, [providers, currentModel, supportedChannels, currentChannels])

  return {
    // Providers
    providers: providers.data ?? [],
    isLoadingProviders: providers.isLoading,
    providersError: providers.error,

    // Current model
    currentModel: currentModel.data,
    isLoadingModel: currentModel.isLoading,

    // Provider operations
    configureProvider: configureProviderMutation.mutate,
    testProvider: testProviderMutation.mutate,
    isConfiguringProvider: configureProviderMutation.isPending,
    isTestingProvider: testProviderMutation.isPending,

    // Channels
    supportedChannels: supportedChannels.data ?? [],
    isLoadingChannels: supportedChannels.isLoading,
    currentChannels: currentChannels.data ?? [],

    // Channel operations
    configureChannel: configureChannelMutation.mutate,
    testChannel: testChannelMutation.mutate,
    deleteChannel: deleteChannelMutation.mutate,
    isConfiguringChannel: configureChannelMutation.isPending,
    isTestingChannel: testChannelMutation.isPending,
    isDeletingChannel: deleteChannelMutation.isPending,

    // Utilities
    refreshAll,
  }
}
