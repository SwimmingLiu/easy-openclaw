// hooks/useSystemInfo.ts
// Hook for fetching system information

import { useQuery } from '@tanstack/react-query'
import { getSystemInfo, checkPrerequisites, isOpenClawInstalled } from '@/services/system'
import { useAppStore } from '@/stores/appStore'

/**
 * Hook to fetch system information
 */
export function useSystemInfo() {
  const setSystemInfo = useAppStore((state) => state.setSystemInfo)
  const setIsInstalled = useAppStore((state) => state.setIsInstalled)

  return useQuery({
    queryKey: ['systemInfo'],
    queryFn: async () => {
      const info = await getSystemInfo()
      setSystemInfo(info)
      setIsInstalled(info.openclaw?.installed ?? false)
      return info
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to check system prerequisites
 */
export function usePrerequisites() {
  return useQuery({
    queryKey: ['prerequisites'],
    queryFn: checkPrerequisites,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to check if OpenClaw is installed
 */
export function useIsInstalled() {
  return useQuery({
    queryKey: ['isInstalled'],
    queryFn: isOpenClawInstalled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
