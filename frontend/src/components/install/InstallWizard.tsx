// components/install/InstallWizard.tsx
// Installation wizard component with step progress

import * as React from 'react'
import { motion } from 'framer-motion'
import { Stepper } from '@/components/ui/Stepper'
import { Progress } from '@/components/ui/Progress'
import { useInstallStore } from '@/stores/installStore'

export interface InstallWizardProps {
  className?: string
}

const InstallWizard: React.FC<InstallWizardProps> = ({ className }) => {
  const { steps, progress, status, error } = useInstallStore()

  const stepperSteps = steps.map((step) => ({
    id: step.id,
    name: step.name,
    status: step.status,
  }))

  const getProgressVariant = (): 'default' | 'success' | 'error' => {
    if (status === 'completed') return 'success'
    if (status === 'failed') return 'error'
    return 'default'
  }

  return (
    <div className={className}>
      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Progress
          value={progress}
          showPercentage
          variant={getProgressVariant()}
          size="md"
        />
      </motion.div>

      {/* Steps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-neutral-200 p-6"
      >
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">安装进度</h2>
        <Stepper steps={stepperSteps} orientation="vertical" />
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200"
        >
          <p className="text-sm font-medium text-red-800">安装出错</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </motion.div>
      )}
    </div>
  )
}

export { InstallWizard }
