// hooks/useInstall.ts
// Hook for managing installation flow

import { useCallback, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { startInstall, streamInstallEvents, cancelInstall } from '@/services/install'
import { useInstallStore } from '@/stores/installStore'
import { useAppStore } from '@/stores/appStore'
import type { InstallOptions, InstallEvent } from '@shared/types'

/**
 * Hook to manage installation flow
 */
export function useInstall() {
  const navigate = useNavigate()
  const cleanupRef = useRef<(() => void) | null>(null)

  const {
    setInstallId,
    updateStep,
    setProgress,
    setCurrentStep,
    setError,
    setStatus,
    addLog,
    reset,
    steps,
  } = useInstallStore()

  const setIsInstalled = useAppStore((state) => state.setIsInstalled)

  // Handle installation events
  const handleEvent = useCallback(
    (event: InstallEvent) => {
      switch (event.type) {
        case 'step-start':
          updateStep(event.step, 'running')
          setCurrentStep(event.step)
          addLog(`开始: ${event.name}`)
          break

        case 'progress':
          addLog(event.output)
          break

        case 'step-complete':
          updateStep(event.step, 'completed')
          // Calculate progress based on completed steps
          const completedCount = steps.filter(
            (s) => s.status === 'completed' || s.id === event.step
          ).length
          setProgress((completedCount / steps.length) * 100)
          break

        case 'step-error':
          updateStep(event.step, 'error')
          setError(event.error)
          addLog(`错误: ${event.error}`)
          break

        case 'install-complete':
          if (event.success) {
            setStatus('completed')
            setProgress(100)
            setIsInstalled(true)
            addLog('安装完成！')
            // Navigate to model config after 2 seconds
            setTimeout(() => {
              navigate('/models')
            }, 2000)
          } else {
            setStatus('failed')
            setError('安装失败')
          }
          // Cleanup event listener
          if (cleanupRef.current) {
            cleanupRef.current()
            cleanupRef.current = null
          }
          break
      }
    },
    [updateStep, setCurrentStep, addLog, setProgress, setError, setStatus, setIsInstalled, steps, navigate]
  )

  // Start installation mutation
  const startMutation = useMutation({
    mutationFn: async (options: InstallOptions) => {
      reset()
      setStatus('installing')

      // Start installation
      const { installId } = await startInstall(options)
      setInstallId(installId)

      // Subscribe to events
      cleanupRef.current = streamInstallEvents(installId, options, handleEvent)

      return { installId }
    },
    onError: (error) => {
      setStatus('failed')
      setError(error instanceof Error ? error.message : '启动安装失败')
    },
  })

  // Cancel installation mutation
  const cancelMutation = useMutation({
    mutationFn: async () => {
      const installId = useInstallStore.getState().installId
      if (!installId) return

      await cancelInstall(installId)
      setStatus('cancelled')

      // Cleanup event listener
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : '取消安装失败')
    },
  })

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }
  }, [])

  return {
    startInstall: startMutation.mutate,
    cancelInstall: cancelMutation.mutate,
    isStarting: startMutation.isPending,
    isCancelling: cancelMutation.isPending,
    cleanup,
  }
}
