// components/channels/ConfigForm.tsx
// Dynamic configuration form based on channel fields

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import type { ConfigField } from '@shared/types'

export interface ConfigFormProps {
  fields: ConfigField[]
  values: Record<string, string>
  onChange: (fieldId: string, value: string) => void
  errors?: Record<string, string>
  disabled?: boolean
  className?: string
}

const ConfigForm: React.FC<ConfigFormProps> = ({
  fields,
  values,
  onChange,
  errors,
  disabled = false,
  className,
}) => {
  const [showPassword, setShowPassword] = React.useState<Record<string, boolean>>({})

  const togglePassword = (fieldId: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }))
  }

  return (
    <div className={cn('space-y-4', className)}>
      {fields.map((field) => {
        const isPassword = field.type === 'password'
        const shouldShowPassword = showPassword[field.id]

        return (
          <div key={field.id} className="space-y-1.5">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-neutral-700"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="relative">
              <input
                id={field.id}
                type={isPassword && !shouldShowPassword ? 'password' : 'text'}
                value={values[field.id] || ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                disabled={disabled}
                className={cn(
                  'w-full px-3 py-2 rounded-lg border bg-white transition-colors',
                  'placeholder:text-neutral-400',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                  errors?.[field.id]
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-neutral-300 hover:border-neutral-400',
                  isPassword && 'pr-10',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              />

              {isPassword && (
                <button
                  type="button"
                  onClick={() => togglePassword(field.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  tabIndex={-1}
                >
                  {shouldShowPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            {field.description && !errors?.[field.id] && (
              <p className="text-xs text-neutral-500">{field.description}</p>
            )}

            {errors?.[field.id] && (
              <p className="text-xs text-red-500">{errors[field.id]}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { ConfigForm }
