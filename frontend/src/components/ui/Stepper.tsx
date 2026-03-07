import * as React from 'react'
import { Check, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StepStatus = 'pending' | 'running' | 'completed' | 'error'

export interface Step {
  id: string
  name: string
  description?: string
  status: StepStatus
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[]
  orientation?: 'horizontal' | 'vertical'
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, steps, orientation = 'vertical', ...props }, ref) => {
    const getStatusIcon = (status: StepStatus) => {
      switch (status) {
        case 'completed':
          return <Check className="w-3.5 h-3.5" />
        case 'running':
          return <Loader2 className="w-3.5 h-3.5 animate-spin" />
        case 'error':
          return <X className="w-3.5 h-3.5" />
        default:
          return null
      }
    }

    const getStatusStyles = (status: StepStatus): string => {
      switch (status) {
        case 'completed':
          return 'bg-green-500 text-white border-green-500'
        case 'running':
          return 'bg-primary-500 text-white border-primary-500'
        case 'error':
          return 'bg-red-500 text-white border-red-500'
        default:
          return 'bg-white text-neutral-400 border-neutral-300'
      }
    }

    const getConnectorStyles = (index: number): string => {
      const currentStep = steps[index]
      const isCompleted = currentStep.status === 'completed'
      const isError = currentStep.status === 'error'
      
      if (orientation === 'vertical') {
        return cn(
          'absolute left-[15px] top-8 w-0.5 h-[calc(100%-16px)]',
          isCompleted ? 'bg-green-500' : isError ? 'bg-red-500' : 'bg-neutral-200'
        )
      }
      return ''
    }

    if (orientation === 'horizontal') {
      return (
        <div ref={ref} className={cn('flex items-start', className)} {...props}>
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors',
                    getStatusStyles(step.status)
                  )}
                >
                  {getStatusIcon(step.status) || index + 1}
                </div>
                <div className="mt-2 text-center">
                  <p className={cn(
                    'text-sm font-medium',
                    step.status === 'pending' ? 'text-neutral-400' : 'text-neutral-900'
                  )}>
                    {step.name}
                  </p>
                  {step.description && (
                    <p className="text-xs text-neutral-500 mt-0.5">{step.description}</p>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mt-4 mx-2',
                    step.status === 'completed' ? 'bg-green-500' : 'bg-neutral-200'
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )
    }

    return (
      <div ref={ref} className={cn('flex flex-col', className)} {...props}>
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex pb-6 last:pb-0">
            {index < steps.length - 1 && (
              <div className={getConnectorStyles(index)} />
            )}
            <div
              className={cn(
                'relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium flex-shrink-0 transition-colors',
                getStatusStyles(step.status)
              )}
            >
              {getStatusIcon(step.status) || index + 1}
            </div>
            <div className="ml-3 flex-1">
              <p className={cn(
                'text-sm font-medium',
                step.status === 'pending' ? 'text-neutral-400' : 'text-neutral-900'
              )}>
                {step.name}
              </p>
              {step.description && (
                <p className="text-sm text-neutral-500 mt-0.5">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }
)

Stepper.displayName = 'Stepper'

export { Stepper }
