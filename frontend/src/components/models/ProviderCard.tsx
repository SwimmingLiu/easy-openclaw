// components/models/ProviderCard.tsx
// AI provider card component

import * as React from 'react'
import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { AIProvider } from '@shared/types'

export interface ProviderCardProps {
  provider: AIProvider
  isConfigured?: boolean
  isRecommended?: boolean
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  isConfigured = false,
  isRecommended = false,
  isSelected = false,
  onClick,
  className,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-xl border bg-white text-left transition-all duration-200',
        'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        isSelected
          ? 'border-primary-500 ring-2 ring-primary-100'
          : 'border-neutral-200 hover:border-neutral-300',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-2xl">
          {provider.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-neutral-900 truncate">{provider.name}</h3>
            {isRecommended && (
              <Badge variant="info" size="sm">
                <Star className="w-3 h-3 mr-1" />
                推荐
              </Badge>
            )}
            {isConfigured && (
              <Badge variant="success" size="sm">
                <Check className="w-3 h-3 mr-1" />
                已配置
              </Badge>
            )}
          </div>
          <p className="text-sm text-neutral-500 line-clamp-2">{provider.description}</p>
        </div>
      </div>
    </motion.button>
  )
}

export { ProviderCard }
