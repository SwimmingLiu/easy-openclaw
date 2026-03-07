// pages/ChannelsConfig.tsx
// Notification channels configuration page

import * as React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { Alert } from '@/components/ui/Alert'
import { ChannelCard } from '@/components/channels/ChannelCard'
import { ChannelConfigModal } from '@/components/channels/ChannelConfigModal'
import { useConfig } from '@/hooks/useConfig'
import type { Channel } from '@shared/types'

const ChannelsConfig: React.FC = () => {
  const {
    supportedChannels,
    isLoadingChannels,
    currentChannels,
    testChannel,
    isTestingChannel,
    deleteChannel,
    isDeletingChannel,
    refreshAll,
  } = useConfig()

  const [selectedChannel, setSelectedChannel] = React.useState<Channel | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [testingChannelId, setTestingChannelId] = React.useState<string | null>(null)
  const [deletingChannelId, setDeletingChannelId] = React.useState<string | null>(null)

  const handleConfigure = (channel: Channel) => {
    setSelectedChannel(channel)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedChannel(null)
  }

  const handleConfigSuccess = () => {
    refreshAll()
  }

  const handleTest = (channelId: string, fields: Record<string, string>) => {
    setTestingChannelId(channelId)
    testChannel(
      { channelId, fields },
      {
        onSuccess: () => {
          setTestingChannelId(null)
        },
        onError: () => {
          setTestingChannelId(null)
        },
      }
    )
  }

  const handleDelete = (channelId: string) => {
    if (confirm('确定要删除此渠道配置吗？')) {
      setDeletingChannelId(channelId)
      deleteChannel(channelId, {
        onSuccess: () => {
          setDeletingChannelId(null)
          refreshAll()
        },
        onError: () => {
          setDeletingChannelId(null)
        },
      })
    }
  }

  const getCurrentConfig = (channelId: string) => {
    return currentChannels.find((c) => c.channelId === channelId)
  }

  if (isLoadingChannels) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" label="加载消息渠道..." />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">消息渠道配置</h1>
        <p className="mt-1 text-neutral-500">
          配置消息通知渠道，让 OpenClaw 能够向您发送通知
        </p>
      </div>

      {/* Configured channels summary */}
      {currentChannels.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">
              已配置 {currentChannels.length} 个消息渠道
            </span>
          </div>
        </motion.div>
      )}

      {/* Channel grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {supportedChannels.map((channel, index) => {
          const currentConfig = getCurrentConfig(channel.id)
          return (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ChannelCard
                channel={channel}
                currentConfig={currentConfig}
                onConfigure={() => handleConfigure(channel)}
                isTesting={testingChannelId === channel.id}
                isDeleting={deletingChannelId === channel.id}
              />
            </motion.div>
          )
        })}
      </div>

      {/* Config modal */}
      <ChannelConfigModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        channel={selectedChannel}
        currentConfig={
          selectedChannel ? getCurrentConfig(selectedChannel.id) : undefined
        }
        onSuccess={handleConfigSuccess}
      />
    </div>
  )
}

export default ChannelsConfig
