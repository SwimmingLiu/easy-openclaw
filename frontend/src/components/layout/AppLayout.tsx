// components/layout/AppLayout.tsx
// Main application layout with sidebar and main content area

import * as React from 'react'
import { Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useAppStore } from '@/stores/appStore'

export interface AppLayoutProps {
  showSidebar?: boolean
  showHeader?: boolean
  title?: string
  children?: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({
  showSidebar = true,
  showHeader = true,
  title,
  children,
}) => {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen)

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      {showSidebar && <Sidebar />}

      {/* Main content */}
      <div
        className={cn(
          'flex flex-col flex-1 min-w-0 transition-all duration-300',
          showSidebar && sidebarOpen && 'ml-64',
          showSidebar && !sidebarOpen && 'ml-16'
        )}
      >
        {/* Header */}
        {showHeader && <Header title={title} />}

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}

export { AppLayout }
