// pages/Install.tsx
// Installation page with wizard and log viewer

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { InstallWizard } from '@/components/install/InstallWizard'
import { LogViewer } from '@/components/install/LogViewer'
import { useInstall } from '@/hooks/useInstall'
import { useInstallStore } from '@/stores/installStore'
import type { InstallOptions } from '@shared/types'

const Install: React.FC = () => {
  const navigate = useNavigate()
  const { startInstall, cancelInstall, isStarting, isCancelling } = useInstall()
  const { status, logs, error } = useInstallStore()

  const handleStart = () => {
    const options: InstallOptions = {
      nodejsMethod: 'auto',
      skipOnboard: false,
    }
    startInstall(options)
  }

  const handleCancel = () => {
    cancelInstall()
  }

  const handleBack = () => {
    navigate('/')
  }

  const isInstalling = status === 'installing'
  const isCompleted = status === 'completed'
  const isFailed = status === 'failed'
  const isCancelled = status === 'cancelled'

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={isInstalling}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </button>
          <h1 className="text-lg font-semibold text-neutral-900">安装向导</h1>
          <div className="w-16" /> {/* Spacer */}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Status message */}
          {isCompleted && (
            <Alert type="success" title="安装成功">
              OpenClaw 已成功安装！即将跳转到 AI 模型配置页面...
            </Alert>
          )}

          {isFailed && (
            <Alert type="error" title="安装失败">
              {error || '安装过程中发生错误，请重试或查看日志了解详情。'}
            </Alert>
          )}

          {isCancelled && (
            <Alert type="warning" title="安装已取消">
              安装已被取消，您可以重新开始安装。
            </Alert>
          )}

          {/* Install wizard */}
          {(isInstalling || isCompleted || isFailed) && (
            <InstallWizard />
          )}

          {/* Log viewer */}
          {(isInstalling || logs.length > 0) && (
            <LogViewer logs={logs} className="mt-6" />
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4 pt-4">
            {!isInstalling && !isCompleted && (
              <Button
                size="lg"
                onClick={handleStart}
                loading={isStarting}
                className="min-w-[200px]"
              >
                开始安装
              </Button>
            )}

            {isInstalling && (
              <Button
                size="lg"
                variant="danger"
                onClick={handleCancel}
                loading={isCancelling}
                icon={<XCircle className="w-5 h-5" />}
              >
                取消安装
              </Button>
            )}

            {isFailed && (
              <Button
                size="lg"
                onClick={handleStart}
                loading={isStarting}
                className="min-w-[200px]"
              >
                重新安装
              </Button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default Install
