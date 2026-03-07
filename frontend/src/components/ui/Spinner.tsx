import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', label, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center', className)}
        role="status"
        aria-label={label || '加载中'}
        {...props}
      >
        <Loader2
          className={cn(
            'animate-spin text-primary-500',
            sizeClasses[size]
          )}
        />
        {label && (
          <span className="ml-2 text-sm text-neutral-600">{label}</span>
        )}
      </div>
    )
  }
)

Spinner.displayName = 'Spinner'

export { Spinner }
