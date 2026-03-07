// components/channels/ChannelConfigModal.tsx
// Channel configuration modal with form and guide

import * as React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, HelpCircle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ConfigForm } from './ConfigForm'
import { TestButton } from './TestButton'
import { useConfigureChannel, useTestChannel, useDeleteChannel } from '@/hooks/useConfig'
import type { Channel, CurrentChannelConfig, TestResult } from '@shared/types'

export interface ChannelConfigModalProps {
  isOpen: boolean
  onClose: () => void
  channel: Channel | null
  currentConfig?: CurrentChannelConfig
  onSuccess?: () => void
}

const ChannelConfigModal: React.FC<ChannelConfigModalProps> = ({
  isOpen,
  onClose,
  channel,
  currentConfig,
  onSuccess,
}) => {
  const [formValues, setFormValues] = React.useState<Record<string, string>>({})
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({})
  const [testResult, setTestResult] = React.useState<TestResult | null>(null)

  const configureMutation = useConfigureChannel()
  const testMutation = useTestChannel()
  const deleteMutation = useDeleteChannel()

  // Initialize form values when modal opens
  React.useEffect(() => {
    if (isOpen && channel) {
      if (currentConfig?.maskedFields) {
        setFormValues(currentConfig.maskedFields)
      } else {
        // Initialize empty values for all required fields
        const initialValues: Record<string, string> = {}
        channel.configFields.forEach((field) => {
          initialValues[field.id] = ''
        })
        setFormValues(initialValues)
      }
      setFormErrors({})
      setTestResult(null)
    }
  }, [isOpen, channel, currentConfig])

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }))
    // Clear error when field changes
    if (formErrors[fieldId]) {
      setFormErrors((prev) => {
        const next = { ...prev }
        delete next[fieldId]
        return next
      })
    }
  }

  const validateForm = (): boolean => {
    if (!channel) return false

    const errors: Record<string, string> = {}
    channel.configFields.forEach((field) => {
      if (field.required && !formValues[field.id]) {
        errors[field.id] = `${field.label}是必填项`
      }
    })

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = () => {
    if (!channel || !validateForm()) return

    configureMutation.mutate(
      { channelId: channel.id, fields: formValues },
      {
        onSuccess: () => {
          onSuccess?.()
          onClose()
        },
      }
    )
  }

  const handleTest = () => {
    if (!channel || !validateForm()) return

    setTestResult(null)
    testMutation.mutate(
      { channelId: channel.id, fields: formValues },
      {
        onSuccess: (result) => {
          setTestResult(result)
        },
      }
    )
  }

  const handleDelete = () => {
    if (!channel) return

    if (confirm('确定要删除此渠道配置吗？')) {
      deleteMutation.mutate(channel.id, {
        onSuccess: () => {
          onSuccess?.()
          onClose()
        },
      })
    }
  }

  if (!channel) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`配置 ${channel.name}`}
      size="md"
      footer={
        <>
          {currentConfig?.enabled && (
            <Button variant="danger" onClick={handleDelete} loading={deleteMutation.isPending}>
              删除
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleSave} loading={configureMutation.isPending}>
            保存
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Channel info */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl">
            {channel.icon}
          </div>
          <div className="flex-1">
            <p className="font-medium text-neutral-900">{channel.name}</p>
            <p className="text-sm text-neutral-500">{channel.description}</p>
          </div>
        </div>

        {/* Setup guide */}
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">配置指南</p>
              <p className="whitespace-pre-line">{channel.setupGuide}</p>
            </div>
          </div>
        </div>

        {/* Config form */}
        <ConfigForm
          fields={channel.configFields}
          values={formValues}
          onChange={handleFieldChange}
          errors={formErrors}
        />

        {/* Test button */}
        <TestButton
          onTest={handleTest}
          isTesting={testMutation.isPending}
          result={testResult}
          onClearResult={() => setTestResult(null)}
        />
      </div>
    </Modal>
  )
}

export { ChannelConfigModal }
