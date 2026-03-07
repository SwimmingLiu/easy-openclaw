// components/channels/ChannelCard.tsx
// Notification channel card component

import * as React from 'react'
import { motion } from 'framer-motion'
import { Check, Settings, Trash2, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Channel, CurrentChannelConfig } from '@shared/types'

export interface ChannelCardProps {
  channel: Channel
  currentConfig?: CurrentChannelConfig
  onConfigure: () => void
  onTest?: () => void
  onDelete?: () => void
  isTesting?: boolean
  isDeleting?: boolean
  className?: string
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  currentConfig,
  onConfigure,
  onTest,
  onDelete,
  isTesting = false,
  isDeleting = false,
  className,
}) => {
  const isConfigured = currentConfig?.enabled ?? false

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-xl border bg-white transition-all duration-200',
        isConfigured ? 'border-green-200 bg-green-50/30' : 'border-neutral-200',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl',
          isConfigured ? 'bg-green-100' : 'bg-neutral-100'
        )}>
          {channel.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-neutral-900">{channel.name}</h3>
            {isConfigured && (
              <Badge variant="success" size="sm">
                <Check className="w-3 h-3 mr-1" />
                已配置
              </Badge>
            )}
          </div>
          <p className="text-sm text-neutral-500 line-clamp-2">{channel.description}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-100">
        {isConfigured ? (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={onConfigure}
              icon={<Settings className="w-4 h-4" />}
            >
              编辑
            </Button>
            {onTest && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onTest}
                loading={isTesting}
                icon={<Play className="w-4 h-4" />}
              >
                测试
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                loading={isDeleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                icon={<Trash2 className="w-4 h-4" />}
              >
                删除
              </Button>
            )}
          </>
        ) : (
          <Button
            size="sm"
            onClick={onConfigure}
          >
            + 添加
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export { ChannelCard }
