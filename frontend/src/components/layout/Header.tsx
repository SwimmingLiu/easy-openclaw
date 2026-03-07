// components/layout/Header.tsx
// Page header with title and optional actions

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface HeaderProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  actions,
  className,
}) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-neutral-200',
        className
      )}
    >
      <div className="flex items-center justify-between h-14 px-6">
        {/* Title */}
        <div>
          {title && (
            <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
          )}
          {subtitle && (
            <p className="text-sm text-neutral-500">{subtitle}</p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2">{actions}</div>
        )}
      </div>
    </header>
  )
}

export { Header }
