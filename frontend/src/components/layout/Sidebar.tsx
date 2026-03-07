// components/layout/Sidebar.tsx
// Navigation sidebar with collapsible menu

import * as React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/appStore'

interface NavItem {
  to: string
  icon: React.ReactNode
  label: string
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: '仪表盘' },
  { to: '/models', icon: <Bot className="w-5 h-5" />, label: 'AI 模型' },
  { to: '/channels', icon: <MessageSquare className="w-5 h-5" />, label: '消息渠道' },
  { to: '/settings', icon: <Settings className="w-5 h-5" />, label: '设置' },
]

const Sidebar: React.FC = () => {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)
  const location = useLocation()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-white border-r border-neutral-200 transition-all duration-300 z-30',
        'flex flex-col',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-semibold text-neutral-900">OpenClaw</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to)
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    'hover:bg-neutral-100',
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-600',
                    !sidebarOpen && 'justify-center'
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Collapse button */}
      <div className="p-2 border-t border-neutral-200">
        <button
          onClick={toggleSidebar}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg',
            'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors'
          )}
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">收起</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  )
}

export { Sidebar }
