// stores/installStore.ts
// Installation flow state using Zustand

import { create } from 'zustand'
import type { StepStatus } from '@/components/ui/Stepper'

export interface InstallStep {
  id: string
  name: string
  status: StepStatus
  output?: string
}

interface InstallState {
  // Installation ID
  installId: string | null
  setInstallId: (id: string | null) => void

  // Installation steps
  steps: InstallStep[]
  setSteps: (steps: InstallStep[]) => void
  updateStep: (stepId: string, status: StepStatus, output?: string) => void

  // Overall progress (0-100)
  progress: number
  setProgress: (progress: number) => void

  // Current step being executed
  currentStep: string | null
  setCurrentStep: (stepId: string | null) => void

  // Error message
  error: string | null
  setError: (error: string | null) => void

  // Installation status
  status: 'idle' | 'installing' | 'completed' | 'failed' | 'cancelled'
  setStatus: (status: InstallState['status']) => void

  // Logs
  logs: string[]
  addLog: (log: string) => void
  clearLogs: () => void

  // Reset
  reset: () => void
}

const DEFAULT_STEPS: InstallStep[] = [
  { id: 'check-permissions', name: '检查权限', status: 'pending' },
  { id: 'install-nodejs', name: '安装 Node.js', status: 'pending' },
  { id: 'verify-npm', name: '验证 npm', status: 'pending' },
  { id: 'install-openclaw', name: '安装 OpenClaw', status: 'pending' },
  { id: 'create-config', name: '创建配置目录', status: 'pending' },
  { id: 'verify-install', name: '验证安装', status: 'pending' },
]

const initialState = {
  installId: null,
  steps: DEFAULT_STEPS,
  progress: 0,
  currentStep: null,
  error: null,
  status: 'idle' as const,
  logs: [],
}

export const useInstallStore = create<InstallState>((set) => ({
  ...initialState,

  setInstallId: (id) => set({ installId: id }),

  setSteps: (steps) => set({ steps }),

  updateStep: (stepId, status, output) =>
    set((state) => ({
      steps: state.steps.map((step) =>
        step.id === stepId ? { ...step, status, output } : step
      ),
    })),

  setProgress: (progress) => set({ progress: Math.min(100, Math.max(0, progress)) }),

  setCurrentStep: (stepId) => set({ currentStep: stepId }),

  setError: (error) => set({ error }),

  setStatus: (status) => set({ status }),

  addLog: (log) =>
    set((state) => ({
      logs: [...state.logs, log],
    })),

  clearLogs: () => set({ logs: [] }),

  reset: () => set(initialState),
}))
