// components/install/StepProgress.tsx
// Individual step progress indicator

import * as React from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2, X, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StepStatus } from '@/components/ui/Stepper'

export interface StepProgressProps {
  name: string
  status: StepStatus
  isLast?: boolean
  className?: string
}

const StepProgress: React.FC<StepProgressProps> = ({
  name,
  status,
  isLast = false,
  className,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <Check className="w-3.5 h-3.5" />
      case 'running':
        return <Loader2 className="w-3.5 h-3.5 animate-spin" />
      case 'error':
        return <X className="w-3.5 h-3.5" />
      default:
        return <Circle className="w-3.5 h-3.5" />
    }
  }

  const getStatusStyles = (): string => {
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

  const getLineColor = (): string => {
    if (status === 'completed') return 'bg-green-500'
    if (status === 'error') return 'bg-red-500'
    return 'bg-neutral-200'
  }

  return (
    <div className={cn('flex', className)}>
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className={cn(
            'w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors',
            getStatusStyles()
          )}
        >
          {getStatusIcon()}
        </motion.div>
        {!isLast && (
          <div className={cn('w-0.5 h-6 mt-1', getLineColor())} />
        )}
      </div>
      <div className="ml-3">
        <p className={cn(
          'text-sm font-medium',
          status === 'pending' ? 'text-neutral-400' : 'text-neutral-900'
        )}>
          {name}
        </p>
      </div>
    </div>
  )
}

export { StepProgress }
