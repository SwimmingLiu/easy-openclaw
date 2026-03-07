// pages/ModelsConfig.tsx
// AI models configuration page

import * as React from 'react'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { Alert } from '@/components/ui/Alert'
import { ProviderCard } from '@/components/models/ProviderCard'
import { ProviderConfigModal } from '@/components/models/ProviderConfigModal'
import { useConfig } from '@/hooks/useConfig'
import type { AIProvider } from '@shared/types'

const ModelsConfig: React.FC = () => {
  const {
    providers,
    isLoadingProviders,
    providersError,
    currentModel,
    refreshAll,
  } = useConfig()

  const [selectedProvider, setSelectedProvider] = React.useState<AIProvider | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const handleProviderClick = (provider: AIProvider) => {
    setSelectedProvider(provider)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProvider(null)
  }

  const handleConfigSuccess = () => {
    refreshAll()
  }

  const isProviderConfigured = (providerId: string): boolean => {
    return currentModel?.providerId === providerId
  }

  const getProviderConfig = (providerId: string) => {
    if (currentModel?.providerId === providerId) {
      return {
        model: currentModel.model,
        baseUrl: currentModel.baseUrl,
        hasApiKey: currentModel.hasApiKey,
        maskedApiKey: currentModel.maskedApiKey,
      }
    }
    return undefined
  }

  const recommendedProviders = ['anthropic', 'openai', 'deepseek']

  if (isLoadingProviders) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" label="加载 AI 提供商..." />
      </div>
    )
  }

  if (providersError) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Alert type="error" title="加载失败">
          无法加载 AI 提供商列表，请检查网络连接后重试。
          <button
            onClick={refreshAll}
            className="ml-2 text-primary-600 hover:text-primary-700"
          >
            重试
          </button>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">AI 模型配置</h1>
        <p className="mt-1 text-neutral-500">
          选择并配置您想要使用的 AI 模型提供商
        </p>
      </div>

      {/* Current model info */}
      {currentModel && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200"
        >
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">
              当前使用：{currentModel.providerId} / {currentModel.model}
            </span>
          </div>
        </motion.div>
      )}

      {/* Provider grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider, index) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProviderCard
              provider={provider}
              isConfigured={isProviderConfigured(provider.id)}
              isRecommended={recommendedProviders.includes(provider.id)}
              isSelected={selectedProvider?.id === provider.id}
              onClick={() => handleProviderClick(provider)}
            />
          </motion.div>
        ))}
      </div>

      {/* Config modal */}
      <ProviderConfigModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        provider={selectedProvider}
        currentConfig={
          selectedProvider ? getProviderConfig(selectedProvider.id) : undefined
        }
        onSuccess={handleConfigSuccess}
      />
    </div>
  )
}

export default ModelsConfig
