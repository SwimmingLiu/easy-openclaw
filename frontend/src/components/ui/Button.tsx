import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',

          // Variants
          {
            'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700':
              variant === 'primary',
            'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300':
              variant === 'secondary',
            'border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100':
              variant === 'outline',
            'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200':
              variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600 active:bg-red-700':
              variant === 'danger',
          },

          // Sizes
          {
            'px-3 py-1.5 text-sm gap-1.5': size === 'sm',
            'px-4 py-2 text-base gap-2': size === 'md',
            'px-6 py-3 text-lg gap-2.5': size === 'lg',
          },

          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className={cn('animate-spin', { 'w-3.5 h-3.5': size === 'sm', 'w-4 h-4': size === 'md', 'w-5 h-5': size === 'lg' })} />
        ) : (
          icon && <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
