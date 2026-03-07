// components/models/ProviderConfigModal.tsx
// Provider configuration modal with API key, model selection, and advanced settings

import * as React from 'react'
import { motion } from 'framer-motion'
import { Settings, ExternalLink } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ApiKeyInput } from './ApiKeyInput'
import { ModelSelector } from './ModelSelector'
import { useConfigureProvider, useTestProvider } from '@/hooks/useConfig'
import type { AIProvider, ProviderConfig } from '@shared/types'

export interface ProviderConfigModalProps {
  isOpen: boolean
  onClose: () => void
  provider: AIProvider | null
  currentConfig?: {
    model?: string
    baseUrl?: string
    hasApiKey?: boolean
    maskedApiKey?: string
  }
  onSuccess?: () => void
}

const ProviderConfigModal: React.FC<ProviderConfigModalProps> = ({
  isOpen,
  onClose,
  provider,
  currentConfig,
  onSuccess,
}) => {
  const [apiKey, setApiKey] = React.useState('')
  const [model, setModel] = React.useState(currentConfig?.model || '')
  const [baseUrl, setBaseUrl] = React.useState(currentConfig?.baseUrl || '')
  const [apiType, setApiType] = React.useState('openai-responses')
  const [showAdvanced, setShowAdvanced] = React.useState(false)

  const configureMutation = useConfigureProvider()
  const testMutation = useTestProvider()

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen && provider) {
      setApiKey('')
      setModel(currentConfig?.model || provider.models[0]?.id || '')
      setBaseUrl(currentConfig?.baseUrl || '')
      setShowAdvanced(false)
    }
  }, [isOpen, provider, currentConfig])

  if (!provider) return null

  const handleSave = async () => {
    if (!apiKey || !model) return

    const config: ProviderConfig = {
      providerId: provider.id,
      apiKey,
      model,
      ...(baseUrl && { baseUrl }),
      ...(provider.apiTypes && { apiType }),
    }

    configureMutation.mutate(config, {
      onSuccess: () => {
        onSuccess?.()
        onClose()
      },
    })
  }

  const handleTest = async () => {
    if (!apiKey || !model) return

    const config: ProviderConfig = {
      providerId: provider.id,
      apiKey,
      model,
      ...(baseUrl && { baseUrl }),
      ...(provider.apiTypes && { apiType }),
    }

    testMutation.mutate(config)
  }

  const isValid = apiKey.length > 0 && model.length > 0
  const isSaving = configureMutation.isPending
  const isTesting = testMutation.isPending

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`配置 ${provider.name}`}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={!isValid}
            loading={isTesting}
          >
            测试连接
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid}
            loading={isSaving}
          >
            保存配置
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Provider info */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl">
            {provider.icon}
          </div>
          <div className="flex-1">
            <p className="font-medium text-neutral-900">{provider.name}</p>
            <p className="text-sm text-neutral-500">{provider.description}</p>
          </div>
          {provider.getKeyUrl && (
            <a
              href={provider.getKeyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              获取 API Key
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* API Key */}
        <ApiKeyInput
          value={apiKey}
          onChange={setApiKey}
          providerId={provider.id}
          getKeyUrl={provider.getKeyUrl}
          placeholder={
            currentConfig?.hasApiKey
              ? '已配置（输入新值以更新）'
              : '输入 API Key'
          }
        />

        {/* Model selector */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-neutral-700">
            模型 <span className="text-red-500">*</span>
          </label>
          <ModelSelector
            models={provider.models}
            value={model}
            onChange={setModel}
            placeholder="选择模型"
          />
        </div>

        {/* Advanced settings */}
        {provider.supportsCustomUrl && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <Settings className="w-4 h-4" />
              高级设置
            </button>

            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pl-6"
              >
                <Input
                  label="自定义 API 地址"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.example.com"
                  helperText="留空使用默认地址"
                />

                {provider.apiTypes && provider.apiTypes.length > 1 && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-neutral-700">
                      API 类型
                    </label>
                    <select
                      value={apiType}
                      onChange={(e) => setApiType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="openai-responses">Responses API</option>
                      <option value="openai-completions">Completions API</option>
                    </select>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* Test result */}
        {testMutation.isSuccess && (
          <div
            className={`p-3 rounded-lg ${
              testMutation.data?.success
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {testMutation.data?.success
              ? '✓ API 连接成功'
              : `✗ ${testMutation.data?.message || '连接失败'}`}
          </div>
        )}
      </div>
    </Modal>
  )
}

export { ProviderConfigModal }
