// components/channels/TestButton.tsx
// Test button with result display

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { TestResult } from '@shared/types'

export interface TestButtonProps {
  onTest: () => void
  isTesting?: boolean
  result?: TestResult | null
  onClearResult?: () => void
  disabled?: boolean
  className?: string
}

const TestButton: React.FC<TestButtonProps> = ({
  onTest,
  isTesting = false,
  result,
  onClearResult,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <Button
        variant="outline"
        onClick={onTest}
        disabled={disabled || isTesting}
        loading={isTesting}
        icon={<Play className="w-4 h-4" />}
      >
        测试连接
      </Button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'p-3 rounded-lg text-sm',
              result.success
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            )}
          >
            <div className="flex items-start gap-2">
              {result.success ? (
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium">{result.message}</p>
                {result.details && (
                  <p className="mt-1 text-xs opacity-80">{result.details}</p>
                )}
              </div>
              {onClearResult && (
                <button
                  onClick={onClearResult}
                  className="text-xs opacity-60 hover:opacity-100"
                >
                  清除
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { TestButton }
