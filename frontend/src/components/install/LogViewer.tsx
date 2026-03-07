// components/install/LogViewer.tsx
// Log output viewer with collapsible panel

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LogViewerProps {
  logs: string[]
  className?: string
  defaultExpanded?: boolean
}

const LogViewer: React.FC<LogViewerProps> = ({
  logs,
  className,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)
  const logContainerRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new logs arrive
  React.useEffect(() => {
    if (logContainerRef.current && isExpanded) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs, isExpanded])

  return (
    <div className={cn('bg-neutral-900 rounded-xl overflow-hidden', className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-neutral-300 hover:text-white transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-medium">安装日志</span>
          {logs.length > 0 && (
            <span className="text-xs text-neutral-500">({logs.length} 行)</span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {/* Log content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              ref={logContainerRef}
              className="px-4 pb-4 max-h-64 overflow-y-auto font-mono text-xs"
            >
              {logs.length === 0 ? (
                <p className="text-neutral-500">等待日志输出...</p>
              ) : (
                logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-0.5 text-neutral-300"
                  >
                    {log}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { LogViewer }
