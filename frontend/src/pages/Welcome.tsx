// pages/Welcome.tsx
// Welcome page for first-time users

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Bot, MessageSquare, Shield, ArrowRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/stores/appStore'

const features = [
  {
    icon: <Bot className="w-6 h-6" />,
    title: '多模型支持',
    description: '支持 Anthropic、OpenAI、DeepSeek、Google 等 16+ AI 模型',
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: '多渠道通知',
    description: '支持 Telegram、Discord、WhatsApp、飞书、微信等消息渠道',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: '安全可靠',
    description: '本地部署，数据安全，配置文件加密存储',
  },
]

const Welcome: React.FC = () => {
  const navigate = useNavigate()
  const isInstalled = useAppStore((state) => state.isInstalled)

  const handleStartInstall = () => {
    navigate('/install')
  }

  const handleOpenDashboard = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-neutral-900 mb-4"
          >
            欢迎使用 Easy OpenClaw
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-neutral-600 mb-8"
          >
            让 AI 助手安装变得简单
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid gap-4 mb-10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-white border border-neutral-200 text-left"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{feature.title}</h3>
                  <p className="text-sm text-neutral-500 mt-0.5">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <Button
              size="lg"
              onClick={handleStartInstall}
              icon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto min-w-[200px]"
            >
              开始安装
            </Button>

            {isInstalled && (
              <div className="pt-2">
                <button
                  onClick={handleOpenDashboard}
                  className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                >
                  已安装？打开 Dashboard
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="py-4 text-center text-sm text-neutral-400"
      >
        OpenClaw · 开源 AI 助手管理工具
      </motion.footer>
    </div>
  )
}

export default Welcome
