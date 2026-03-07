// stores/appStore.ts
// Global application state using Zustand

import { create } from 'zustand'
import type {
  SystemInfo,
  CurrentModelConfig,
  CurrentChannelConfig,
} from '@shared/types'

interface AppState {
  // System info
  systemInfo: SystemInfo | null
  setSystemInfo: (info: SystemInfo) => void

  // Installation status
  isInstalled: boolean
  setIsInstalled: (installed: boolean) => void

  // Current model configuration
  currentModel: CurrentModelConfig | null
  setCurrentModel: (model: CurrentModelConfig | null) => void

  // Current channels configuration
  channels: CurrentChannelConfig[]
  setChannels: (channels: CurrentChannelConfig[]) => void

  // Sidebar state
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // Error state
  error: string | null
  setError: (error: string | null) => void

  // Reset state
  reset: () => void
}

const initialState = {
  systemInfo: null,
  isInstalled: false,
  currentModel: null,
  channels: [],
  sidebarOpen: true,
  isLoading: false,
  error: null,
}

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setSystemInfo: (info) => set({ systemInfo: info }),
  setIsInstalled: (installed) => set({ isInstalled: installed }),
  setCurrentModel: (model) => set({ currentModel: model }),
  setChannels: (channels) => set({ channels }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  reset: () => set(initialState),
}))
