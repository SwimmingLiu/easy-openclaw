// components/models/ModelSelector.tsx
// Model dropdown selector component

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { AIModel } from '@shared/types'

export interface ModelSelectorProps {
  models: AIModel[]
  value?: string
  onChange: (modelId: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  value,
  onChange,
  placeholder = '选择模型',
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedModel = models.find((m) => m.id === value)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (modelId: string) => {
    onChange(modelId)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 rounded-lg border bg-white transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:border-neutral-400 cursor-pointer',
          isOpen ? 'border-primary-500 ring-2 ring-primary-100' : 'border-neutral-300'
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedModel ? (
            <>
              <span className="truncate">{selectedModel.name}</span>
              {selectedModel.recommended && (
                <Badge variant="info" size="sm">
                  <Star className="w-3 h-3" />
                </Badge>
              )}
            </>
          ) : (
            <span className="text-neutral-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-neutral-400 transition-transform flex-shrink-0',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-neutral-200 shadow-lg max-h-60 overflow-y-auto"
          >
            {models.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => handleSelect(model.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-left hover:bg-neutral-50 transition-colors',
                  model.id === value && 'bg-primary-50'
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="truncate">{model.name}</span>
                  {model.recommended && (
                    <Badge variant="info" size="sm">
                      <Star className="w-3 h-3 mr-0.5" />
                      推荐
                    </Badge>
                  )}
                </div>
                {model.id === value && (
                  <Check className="w-4 h-4 text-primary-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { ModelSelector }
