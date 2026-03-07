import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from './Badge'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: React.ReactNode
  badge?: string
  badgeVariant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  selected?: boolean
  onClick?: () => void
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    title, 
    description, 
    icon, 
    badge, 
    badgeVariant = 'default',
    selected = false, 
    onClick,
    children,
    ...props 
  }, ref) => {
    const Component = onClick ? 'button' : 'div'
    
    return (
      <Component
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(
          'w-full p-4 rounded-xl border bg-white transition-all duration-200',
          'text-left',
          onClick && 'cursor-pointer',
          selected
            ? 'border-primary-500 ring-2 ring-primary-100 bg-primary-50/50'
            : 'border-neutral-200 hover:border-neutral-300 hover:shadow-sm',
          onClick && 'hover:shadow-md active:scale-[0.99]',
          className
        )}
        onClick={onClick}
        {...props}
      >
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-neutral-900 truncate">{title}</h3>
              {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
            </div>
            {description && (
              <p className="mt-1 text-sm text-neutral-500 line-clamp-2">{description}</p>
            )}
          </div>
        </div>
        {children && <div className="mt-3">{children}</div>}
      </Component>
    )
  }
)

Card.displayName = 'Card'

export { Card }
