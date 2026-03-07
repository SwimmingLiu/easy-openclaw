import * as React from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  type: ToastType
  message: string
  description?: string
  onClose?: () => void
  duration?: number
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, type, message, description, onClose, duration = 5000, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)

    React.useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false)
          onClose?.()
        }, duration)
        return () => clearTimeout(timer)
      }
    }, [duration, onClose])

    const icons = {
      success: <CheckCircle className="w-5 h-5 text-green-500" />,
      error: <XCircle className="w-5 h-5 text-red-500" />,
      warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      info: <Info className="w-5 h-5 text-blue-500" />,
    }

    const borderColors = {
      success: 'border-l-green-500',
      error: 'border-l-red-500',
      warning: 'border-l-yellow-500',
      info: 'border-l-blue-500',
    }

    if (!isVisible) return null

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start gap-3 p-4 bg-white rounded-lg shadow-lg border border-neutral-200 border-l-4',
          'animate-slide-up',
          borderColors[type],
          className
        )}
        role="alert"
        {...props}
      >
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900">{message}</p>
          {description && (
            <p className="mt-1 text-sm text-neutral-500">{description}</p>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={() => {
              setIsVisible(false)
              onClose()
            }}
            className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    )
  }
)

Toast.displayName = 'Toast'

// Toast Container for managing multiple toasts
export interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>
  removeToast: (id: string) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

export { Toast, ToastContainer }
