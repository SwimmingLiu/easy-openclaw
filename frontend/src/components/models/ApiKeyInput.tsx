// components/models/ApiKeyInput.tsx
// API Key input with validation and visibility toggle

import * as React from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ApiKeyInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  providerId?: string
  getKeyUrl?: string
  error?: string
  disabled?: boolean
  className?: string
}

// Common API key patterns for validation
const API_KEY_PATTERNS: Record<string, RegExp> = {
  anthropic: /^sk-ant-[a-zA-Z0-9_-]{95,}$/,
  openai: /^sk-[a-zA-Z0-9_-]{20,}$/,
  deepseek: /^sk-[a-zA-Z0-9]{32,}$/,
  google: /^AIza[a-zA-Z0-9_-]{35}$/,
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  value,
  onChange,
  placeholder = '输入 API Key',
  providerId,
  getKeyUrl,
  error,
  disabled = false,
  className,
}) => {
  const [showKey, setShowKey] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)

  // Validate API key format
  const validateApiKey = React.useCallback((key: string, provider: string): boolean => {
    if (!key) return false
    const pattern = API_KEY_PATTERNS[provider]
    if (pattern) {
      return pattern.test(key)
    }
    // Generic validation: at least 20 characters
    return key.length >= 20
  }, [])

  const isValid = providerId ? validateApiKey(value, providerId) : value.length >= 20
  const showValidation = value.length > 0 && !isFocused

  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-sm font-medium text-neutral-700">
        API Key <span className="text-red-500">*</span>
      </label>
      
      <div className="relative">
        <input
          type={showKey ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full px-3 py-2 pr-20 rounded-lg border bg-white transition-colors',
            'placeholder:text-neutral-400',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-neutral-300 hover:border-neutral-400 focus:ring-primary-500',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />

        {/* Visibility toggle and validation icon */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {showValidation && (
            isValid ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )
          )}
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
            tabIndex={-1}
          >
            {showKey ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Error or helper text */}
      <div className="flex items-center justify-between">
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <p className="text-sm text-neutral-500">
            {showValidation && !isValid && value.length > 0
              ? 'API Key 格式可能不正确'
              : 'API Key 将安全存储在本地'}
          </p>
        )}
        {getKeyUrl && (
          <a
            href={getKeyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            获取 API Key
          </a>
        )}
      </div>
    </div>
  )
}

export { ApiKeyInput }
