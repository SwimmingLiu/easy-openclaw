// backend/models/channel.ts
// Channel definitions - all supported notification channels

import type { Channel } from '../../shared/types.js';

/**
 * Complete list of supported notification channels
 */
export const CHANNELS: Channel[] = [
  {
    id: 'telegram',
    name: 'Telegram',
    icon: '📨',
    description: 'Telegram 机器人消息通知',
    setupGuide:
      '1. 在 Telegram 中搜索 @BotFather\n2. 发送 /newbot 创建新机器人\n3. 复制获得的 Bot Token\n4. 获取你的 User ID（可通过 @userinfobot 查询）',
    configFields: [
      {
        id: 'token',
        label: 'Bot Token',
        type: 'password',
        required: true,
        placeholder: '1234567890:ABCDefGHIjklMNOpqrsTUVwxyz',
        description: '从 @BotFather 获取的机器人令牌',
      },
      {
        id: 'userId',
        label: 'User ID',
        type: 'text',
        required: true,
        placeholder: '123456789',
        description: '你的 Telegram 用户 ID',
      },
    ],
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: '🎮',
    description: 'Discord 机器人消息通知',
    setupGuide:
      '1. 前往 https://discord.com/developers/applications\n2. 创建新应用并添加 Bot\n3. 复制 Bot Token\n4. 邀请 Bot 到你的服务器\n5. 复制目标频道 ID（开启开发者模式后右键频道）',
    configFields: [
      {
        id: 'token',
        label: 'Bot Token',
        type: 'password',
        required: true,
        placeholder: 'MTxxxxx.GYxxxx.xxxxxx',
        description: '从 Discord Developer Portal 获取的机器人令牌',
      },
      {
        id: 'channelId',
        label: '频道 ID',
        type: 'text',
        required: true,
        placeholder: '1234567890123456789',
        description: '目标 Discord 频道的 ID',
      },
    ],
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    description: 'Slack 工作区消息通知',
    setupGuide:
      '1. 前往 https://api.slack.com/apps\n2. 创建新应用，选择 "From scratch"\n3. 添加 Bot Token Scopes: chat:write\n4. 安装到工作区并复制 Bot User OAuth Token\n5. 将 Bot 邀请到目标频道',
    configFields: [
      {
        id: 'token',
        label: 'Bot OAuth Token',
        type: 'password',
        required: true,
        placeholder: 'xoxb-xxxxxxxxxxxx',
        description: '以 xoxb- 开头的 Bot 令牌',
      },
      {
        id: 'channelId',
        label: '频道 ID 或名称',
        type: 'text',
        required: true,
        placeholder: 'C1234567890 或 #general',
        description: 'Slack 频道 ID 或频道名称',
      },
    ],
  },
  {
    id: 'feishu',
    name: '飞书',
    icon: '🐦',
    description: '飞书机器人消息通知',
    setupGuide:
      '1. 在飞书开放平台创建应用\n2. 添加机器人权限: im:message:send_as_bot\n3. 发布应用并获取 App ID 和 App Secret\n4. 将机器人添加到目标群组\n5. 获取群组 Chat ID',
    configFields: [
      {
        id: 'appId',
        label: 'App ID',
        type: 'text',
        required: true,
        placeholder: 'cli_xxxxxxxxxxxx',
        description: '飞书应用的 App ID',
      },
      {
        id: 'appSecret',
        label: 'App Secret',
        type: 'password',
        required: true,
        description: '飞书应用的 App Secret',
      },
      {
        id: 'chatId',
        label: '群组 Chat ID',
        type: 'text',
        required: true,
        placeholder: 'oc_xxxxxxxxxxxx',
        description: '目标飞书群组的 Chat ID',
      },
    ],
  },
  {
    id: 'dingtalk',
    name: '钉钉',
    icon: '📌',
    description: '钉钉机器人消息通知',
    setupGuide:
      '1. 在钉钉群中添加自定义机器人\n2. 选择"加签"安全设置并保存签名\n3. 复制 Webhook URL',
    configFields: [
      {
        id: 'webhook',
        label: 'Webhook URL',
        type: 'text',
        required: true,
        placeholder: 'https://oapi.dingtalk.com/robot/send?access_token=xxxx',
        description: '钉钉自定义机器人的 Webhook 地址',
      },
      {
        id: 'secret',
        label: '签名密钥',
        type: 'password',
        required: false,
        placeholder: 'SECxxxxxxxxxxxx',
        description: '加签安全设置的签名密钥（可选）',
      },
    ],
  },
  {
    id: 'wecom',
    name: '企业微信',
    icon: '💼',
    description: '企业微信机器人消息通知',
    setupGuide:
      '1. 在企业微信群中添加机器人\n2. 点击机器人配置获取 Webhook URL',
    configFields: [
      {
        id: 'webhook',
        label: 'Webhook URL',
        type: 'text',
        required: true,
        placeholder: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxx',
        description: '企业微信机器人的 Webhook 地址',
      },
    ],
  },
  {
    id: 'email',
    name: 'Email',
    icon: '📧',
    description: '电子邮件消息通知',
    setupGuide:
      '1. 获取 SMTP 服务器地址和端口\n2. 使用邮箱账号和应用密码（非登录密码）',
    configFields: [
      {
        id: 'host',
        label: 'SMTP 服务器',
        type: 'text',
        required: true,
        placeholder: 'smtp.gmail.com',
        description: 'SMTP 服务器地址',
      },
      {
        id: 'port',
        label: '端口',
        type: 'text',
        required: true,
        placeholder: '587',
        description: 'SMTP 端口（通常为 587 或 465）',
      },
      {
        id: 'user',
        label: '邮箱地址',
        type: 'text',
        required: true,
        placeholder: 'you@example.com',
        description: '发件人邮箱地址',
      },
      {
        id: 'pass',
        label: '应用密码',
        type: 'password',
        required: true,
        description: '邮箱应用专用密码',
      },
      {
        id: 'to',
        label: '收件人',
        type: 'text',
        required: true,
        placeholder: 'recipient@example.com',
        description: '接收通知的邮箱地址',
      },
    ],
  },
];

/**
 * Get channel by ID
 */
export function getChannelById(channelId: string): Channel | undefined {
  return CHANNELS.find((c) => c.id === channelId);
}

/**
 * Get required fields for a channel
 */
export function getRequiredFields(channelId: string): string[] {
  const channel = getChannelById(channelId);
  if (!channel) return [];
  return channel.configFields.filter((f) => f.required).map((f) => f.id);
}
