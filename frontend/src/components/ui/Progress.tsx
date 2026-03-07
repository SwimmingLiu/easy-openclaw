import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number // 0-100
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value = 0, 
    label, 
    showPercentage = false, 
    size = 'md',
    variant = 'default',
    ...props 
  }, ref) => {
    const clampedValue = Math.min(100, Math.max(0, value))

    const heightClasses = {
      sm: 'h-1.5',
      md: 'h-2',
      lg: 'h-3',
    }

    const variantClasses = {
      default: 'bg-primary-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
    }

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(label || showPercentage) && (
          <div className="flex items-center justify-between mb-1.5">
            {label && (
              <span className="text-sm font-medium text-neutral-700">{label}</span>
            )}
            {showPercentage && (
              <span className="text-sm text-neutral-500">{clampedValue}%</span>
            )}
          </div>
        )}
        <div className={cn('w-full bg-neutral-200 rounded-full overflow-hidden', heightClasses[size])}>
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300 ease-out',
              variantClasses[variant]
            )}
            style={{ width: `${clampedValue}%` }}
          />
        </div>
      </div>
    )
  }
)

Progress.displayName = 'Progress'

export { Progress }
