// hooks/useGateway.ts
// Hook for managing Gateway service

import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getGatewayStatus,
  startGateway,
  stopGateway,
  restartGateway,
  getGatewayDashboardUrl,
  formatUptime,
} from '@/services/gateway'
import type { GatewayStatus } from '@shared/types'

/**
 * Hook to get Gateway status
 */
export function useGatewayStatus() {
  return useQuery({
    queryKey: ['gatewayStatus'],
    queryFn: getGatewayStatus,
    refetchInterval: 5000, // Refresh every 5 seconds
    refetchOnWindowFocus: true,
  })
}

/**
 * Hook to start Gateway
 */
export function useStartGateway() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: startGateway,
    onSuccess: () => {
      // Invalidate and refetch status
      queryClient.invalidateQueries({ queryKey: ['gatewayStatus'] })
    },
  })
}

/**
 * Hook to stop Gateway
 */
export function useStopGateway() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: stopGateway,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gatewayStatus'] })
    },
  })
}

/**
 * Hook to restart Gateway
 */
export function useRestartGateway() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: restartGateway,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gatewayStatus'] })
    },
  })
}

/**
 * Hook to get Gateway dashboard URL
 */
export function useGatewayDashboardUrl() {
  return useQuery({
    queryKey: ['gatewayDashboardUrl'],
    queryFn: getGatewayDashboardUrl,
    staleTime: Infinity, // URL doesn't change
  })
}

/**
 * Combined hook for all Gateway operations
 */
export function useGateway() {
  const queryClient = useQueryClient()

  const statusQuery = useGatewayStatus()
  const startMutation = useStartGateway()
  const stopMutation = useStopGateway()
  const restartMutation = useRestartGateway()
  const dashboardUrlQuery = useGatewayDashboardUrl()

  const refreshStatus = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['gatewayStatus'] })
  }, [queryClient])

  const openDashboard = useCallback(async () => {
    const url = dashboardUrlQuery.data
    if (url) {
      window.open(url, '_blank')
    }
  }, [dashboardUrlQuery.data])

  const status = statusQuery.data
  const isRunning = status?.running ?? false
  const uptimeFormatted = status?.uptime ? formatUptime(status.uptime) : null

  return {
    // Status
    status,
    isRunning,
    uptime: status?.uptime,
    uptimeFormatted,
    pid: status?.pid,
    port: status?.port,
    version: status?.version,
    isLoadingStatus: statusQuery.isLoading,
    statusError: statusQuery.error,

    // Operations
    start: startMutation.mutate,
    stop: stopMutation.mutate,
    restart: restartMutation.mutate,
    isStarting: startMutation.isPending,
    isStopping: stopMutation.isPending,
    isRestarting: restartMutation.isPending,

    // Dashboard
    dashboardUrl: dashboardUrlQuery.data,
    openDashboard,

    // Utilities
    refreshStatus,
  }
}
