// pages/Dashboard.tsx
// Dashboard page with system status, current config, and system info

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  Bot,
  MessageSquare,
  Settings,
  Terminal,
  Play,
  Square,
  ExternalLink,
  Cpu,
  HardDrive,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { useSystemInfo } from '@/hooks/useSystemInfo'
import { useGateway } from '@/hooks/useGateway'
import { useConfig } from '@/hooks/useConfig'
import type { SystemInfo } from '@shared/types'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { data: systemInfo, isLoading: isLoadingSystem, error: systemError } = useSystemInfo()
  const {
    isRunning,
    pid,
    port,
    version,
    uptimeFormatted,
    isLoadingStatus,
    start,
    stop,
    restart,
    isStarting,
    isStopping,
    isRestarting,
    openDashboard,
  } = useGateway()
  const { currentModel, currentChannels } = useConfig()

  const handleStartGateway = () => start()
  const handleStopGateway = () => stop()
  const handleRestartGateway = () => restart()

  if (isLoadingSystem) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" label="加载系统信息..." />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">仪表盘</h1>
        <p className="mt-1 text-neutral-500">查看系统状态和快速操作</p>
      </div>

      {/* Gateway Status */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-neutral-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isRunning ? 'bg-green-100' : 'bg-neutral-100'}`}>
              <Activity className={`w-5 h-5 ${isRunning ? 'text-green-600' : 'text-neutral-400'}`} />
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900">Gateway 服务</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-neutral-300'}`} />
                <span className={`text-sm ${isRunning ? 'text-green-600' : 'text-neutral-500'}`}>
                  {isRunning ? '运行中' : '已停止'}
                </span>
                {isRunning && version && (
                  <span className="text-xs text-neutral-400">v{version}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isRunning ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestartGateway}
                  loading={isRestarting}
                >
                  重启
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStopGateway}
                  loading={isStopping}
                >
                  停止
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={handleStartGateway}
                loading={isStarting}
                icon={<Play className="w-4 h-4" />}
              >
                启动服务
              </Button>
            )}
          </div>
        </div>

        {/* Gateway details */}
        {isRunning && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-lg">
            <div>
              <p className="text-xs text-neutral-500">进程 ID</p>
              <p className="text-sm font-medium text-neutral-900">{pid ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">端口</p>
              <p className="text-sm font-medium text-neutral-900">{port ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">运行时间</p>
              <p className="text-sm font-medium text-neutral-900">{uptimeFormatted ?? '-'}</p>
            </div>
          </div>
        )}

        {/* Open Dashboard button */}
        {isRunning && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <Button
              variant="outline"
              onClick={openDashboard}
              icon={<ExternalLink className="w-4 h-4" />}
            >
              打开 Dashboard
            </Button>
          </div>
        )}
      </motion.section>

      {/* Current Configuration */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">当前配置</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* AI Model */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary-600" />
                <span className="font-medium text-neutral-900">AI 模型</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/models')}
              >
                配置
              </Button>
            </div>
            {currentModel ? (
              <div className="space-y-1">
                <p className="text-sm text-neutral-900">{currentModel.providerId}</p>
                <p className="text-xs text-neutral-500">{currentModel.model}</p>
              </div>
            ) : (
              <p className="text-sm text-neutral-400">未配置</p>
            )}
          </div>

          {/* Message Channels */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary-600" />
                <span className="font-medium text-neutral-900">消息渠道</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/channels')}
              >
                配置
              </Button>
            </div>
            {currentChannels.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {currentChannels.map((channel) => (
                  <Badge key={channel.channelId} variant="success" size="sm">
                    {channel.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-400">未配置</p>
            )}
          </div>
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/models')}
            icon={<Bot className="w-4 h-4" />}
          >
            配置 AI 模型
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/channels')}
            icon={<MessageSquare className="w-4 h-4" />}
          >
            配置消息渠道
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/settings')}
            icon={<Settings className="w-4 h-4" />}
          >
            系统设置
          </Button>
          <Button
            variant="outline"
            onClick={() => {/* TODO: Run diagnostics */}}
            icon={<Terminal className="w-4 h-4" />}
          >
            运行诊断
          </Button>
        </div>
      </motion.section>

      {/* System Information */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">系统信息</h2>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="w-4 h-4 text-neutral-400" />
                <p className="text-xs text-neutral-500">操作系统</p>
              </div>
              <p className="text-sm font-medium text-neutral-900">
                {systemInfo?.os?.platform === 'darwin' ? 'macOS' :
                 systemInfo?.os?.platform === 'linux' ? 'Linux' :
                 systemInfo?.os?.platform === 'win32' ? 'Windows' :
                 systemInfo?.os?.platform || '-'}
              </p>
              {systemInfo?.os?.distro && (
                <p className="text-xs text-neutral-400">{systemInfo.os.distro}</p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-neutral-400" />
                <p className="text-xs text-neutral-500">Node.js 版本</p>
              </div>
              <p className="text-sm font-medium text-neutral-900">
                {systemInfo?.nodejs?.version || '未安装'}
              </p>
              {systemInfo?.nodejs && !systemInfo.nodejs.satisfied && (
                <p className="text-xs text-yellow-600">需要 22+</p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Terminal className="w-4 h-4 text-neutral-400" />
                <p className="text-xs text-neutral-500">npm 版本</p>
              </div>
              <p className="text-sm font-medium text-neutral-900">
                {systemInfo?.npm?.version || '未安装'}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <HardDrive className="w-4 h-4 text-neutral-400" />
                <p className="text-xs text-neutral-500">架构</p>
              </div>
              <p className="text-sm font-medium text-neutral-900">
                {systemInfo?.arch || '-'}
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Dashboard
