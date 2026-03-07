import * as React from 'react'
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AlertType = 'error' | 'warning' | 'info' | 'success'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type: AlertType
  title?: string
  children: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, type, title, children, ...props }, ref) => {
    const configs = {
      error: {
        icon: <AlertCircle className="w-5 h-5" />,
        bgClass: 'bg-red-50 border-red-200',
        iconClass: 'text-red-500',
        titleClass: 'text-red-800',
        textClass: 'text-red-700',
      },
      warning: {
        icon: <AlertTriangle className="w-5 h-5" />,
        bgClass: 'bg-yellow-50 border-yellow-200',
        iconClass: 'text-yellow-500',
        titleClass: 'text-yellow-800',
        textClass: 'text-yellow-700',
      },
      info: {
        icon: <Info className="w-5 h-5" />,
        bgClass: 'bg-blue-50 border-blue-200',
        iconClass: 'text-blue-500',
        titleClass: 'text-blue-800',
        textClass: 'text-blue-700',
      },
      success: {
        icon: <CheckCircle className="w-5 h-5" />,
        bgClass: 'bg-green-50 border-green-200',
        iconClass: 'text-green-500',
        titleClass: 'text-green-800',
        textClass: 'text-green-700',
      },
    }

    const config = configs[type]

    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-3 p-4 rounded-lg border',
          config.bgClass,
          className
        )}
        role="alert"
        {...props}
      >
        <div className={cn('flex-shrink-0', config.iconClass)}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn('text-sm font-medium', config.titleClass)}>
              {title}
            </h4>
          )}
          <div className={cn('text-sm', config.textClass, title && 'mt-1')}>
            {children}
          </div>
        </div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export { Alert }
