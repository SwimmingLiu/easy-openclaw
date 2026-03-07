// backend/services/channel-config.ts
// Notification channel configuration management

import os from 'node:os';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createChildLogger } from '../utils/logger.js';
import { NotFoundError } from '../utils/error.js';
import { validateChannelConfig } from '../utils/validator.js';
import { CHANNELS, getChannelById, getRequiredFields } from '../models/channel.js';
import { openclawCLI } from '../executors/openclaw-cli.js';
import type {
  Channel,
  ChannelConfig,
  CurrentChannelConfig,
  TestResult,
  OpenClawConfig,
} from '../../shared/types.js';

const log = createChildLogger('channel-config');

export class ChannelConfigService {
  private get configDir(): string {
    return process.env['EASY_OPENCLAW_CONFIG_DIR'] ?? path.join(os.homedir(), '.openclaw');
  }

  private get configPath(): string {
    return path.join(this.configDir, 'openclaw.json');
  }

  /**
   * Get list of supported channels
   */
  getSupportedChannels(): Channel[] {
    return CHANNELS;
  }

  /**
   * Get currently configured channels
   */
  async getCurrentChannels(): Promise<CurrentChannelConfig[]> {
    try {
      const config = await this.loadConfig();
      const channels = config.channels ?? {};

      return Object.entries(channels).map(([channelId, channelDef]) => {
        const channel = getChannelById(channelId);
        return {
          channelId,
          name: channel?.name ?? channelId,
          enabled: true,
          maskedFields: channelDef.token
            ? { token: maskToken(channelDef.token as string) }
            : undefined,
        };
      });
    } catch {
      return [];
    }
  }

  /**
   * Configure a notification channel
   */
  async configureChannel(channelId: string, config: Record<string, string>): Promise<void> {
    const channel = getChannelById(channelId);
    if (!channel) {
      throw new NotFoundError(`不支持的渠道: ${channelId}`, '请选择支持的渠道');
    }

    // Validate required fields
    const requiredFields = getRequiredFields(channelId);
    validateChannelConfig(channelId, config, requiredFields);

    log.info({ channelId }, 'Configuring channel');

    // 1. Enable plugin
    try {
      await openclawCLI.pluginEnable(channelId);
    } catch (e) {
      log.warn({ channelId, error: e }, 'Failed to enable plugin, continuing');
    }

    // 2. Ensure plugin is in allowed list
    await this.ensurePluginAllowed(channelId);

    // 3. Add channel config to openclaw.json
    await this.saveChannelConfig(channelId, config);

    // 4. Add via CLI if token is available
    if (config['token']) {
      try {
        await openclawCLI.channelAdd(channelId, config['token']);
      } catch (e) {
        log.warn({ channelId, error: e }, 'CLI channel add failed, config saved directly');
      }
    }

    log.info({ channelId }, 'Channel configured');
  }

  /**
   * Test a channel configuration
   */
  async testChannel(channelId: string, config: Record<string, string>): Promise<TestResult> {
    log.info({ channelId }, 'Testing channel');

    switch (channelId) {
      case 'telegram':
        return this.testTelegram(config['token'] ?? '', config['userId'] ?? '');
      case 'discord':
        return this.testDiscord(config['token'] ?? '', config['channelId'] ?? '');
      case 'slack':
        return this.testSlack(config['token'] ?? '', config['channelId'] ?? '');
      case 'feishu':
        return this.testFeishu(config['appId'] ?? '', config['appSecret'] ?? '', config['chatId'] ?? '');
      case 'dingtalk':
        return this.testDingtalk(config['webhook'] ?? '', config['secret']);
      case 'wecom':
        return this.testWecom(config['webhook'] ?? '');
      case 'email':
        return this.testEmail(config);
      default:
        return { success: false, message: `未知渠道: ${channelId}` };
    }
  }

  /**
   * Remove a channel configuration
   */
  async removeChannel(channelId: string): Promise<void> {
    log.info({ channelId }, 'Removing channel');

    // Remove from config
    const config = await this.loadConfig();
    if (config.channels) {
      delete config.channels[channelId];
      await this.saveConfig(config);
    }

    // Remove via CLI
    try {
      await openclawCLI.channelRemove(channelId);
    } catch (e) {
      log.warn({ channelId, error: e }, 'CLI channel remove failed');
    }
  }

  // ==================== Test Implementations ====================

  private async testTelegram(token: string, userId: string): Promise<TestResult> {
    if (!token || !userId) {
      return { success: false, message: '请提供 Bot Token 和 User ID' };
    }

    try {
      const botInfoRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const botInfo = await botInfoRes.json() as { ok: boolean; result?: { username?: string } };

      if (!botInfo.ok) {
        return { success: false, message: 'Bot Token 无效，请检查 Token 是否正确' };
      }

      // Send test message
      const msgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: userId,
          text: '🦞 Easy OpenClaw: Telegram 配置成功！',
        }),
      });
      const msgData = await msgRes.json() as { ok: boolean; description?: string };

      if (!msgData.ok) {
        return {
          success: false,
          message: `发送测试消息失败: ${msgData.description ?? '未知错误'}`,
          details: '请确认 User ID 正确，且已与机器人开始对话',
        };
      }

      return {
        success: true,
        message: `Bot @${botInfo.result?.username ?? 'unknown'} 配置成功，测试消息已发送`,
      };
    } catch (error) {
      return {
        success: false,
        message: `连接失败: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  }

  private async testDiscord(token: string, channelId: string): Promise<TestResult> {
    if (!token || !channelId) {
      return { success: false, message: '请提供 Bot Token 和频道 ID' };
    }

    try {
      const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bot ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: '🦞 Easy OpenClaw: Discord 配置成功！' }),
      });

      if (res.ok) {
        return { success: true, message: 'Discord 配置成功，测试消息已发送' };
      }

      const data = await res.json() as { message?: string };
      return { success: false, message: `Discord API 错误: ${data.message ?? res.statusText}` };
    } catch (error) {
      return {
        success: false,
        message: `连接失败: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  }

  private async testSlack(token: string, channelId: string): Promise<TestResult> {
    if (!token || !channelId) {
      return { success: false, message: '请提供 Bot Token 和频道 ID' };
    }

    try {
      const res = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: channelId,
          text: '🦞 Easy OpenClaw: Slack 配置成功！',
        }),
      });

      const data = await res.json() as { ok: boolean; error?: string };

      if (data.ok) {
        return { success: true, message: 'Slack 配置成功，测试消息已发送' };
      }

      return { success: false, message: `Slack API 错误: ${data.error ?? '未知错误'}` };
    } catch (error) {
      return {
        success: false,
        message: `连接失败: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  }

  private async testFeishu(appId: string, appSecret: string, chatId: string): Promise<TestResult> {
    if (!appId || !appSecret || !chatId) {
      return { success: false, message: '请填写所有飞书配置字段' };
    }

    try {
      // Get tenant access token
      const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
      });
      const tokenData = await tokenRes.json() as { code: number; tenant_access_token?: string; msg?: string };

      if (tokenData.code !== 0) {
        return { success: false, message: `飞书认证失败: ${tokenData.msg ?? '未知错误'}` };
      }

      const token = tokenData.tenant_access_token;

      // Send test message
      const msgRes = await fetch('https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receive_id: chatId,
          msg_type: 'text',
          content: JSON.stringify({ text: '🦞 Easy OpenClaw: 飞书配置成功！' }),
        }),
      });

      if (msgRes.ok) {
        return { success: true, message: '飞书配置成功，测试消息已发送' };
      }

      return { success: false, message: '发送飞书消息失败，请检查 Chat ID' };
    } catch (error) {
      return {
        success: false,
        message: `连接失败: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  }

  private async testDingtalk(webhook: string, secret?: string): Promise<TestResult> {
    if (!webhook) {
      return { success: false, message: '请提供 Webhook URL' };
    }

    try {
      let url = webhook;

      // Add signature if secret is provided
      if (secret) {
        const timestamp = Date.now();
        const sign = await computeDingTalkSign(timestamp, secret);
        url = `${webhook}&timestamp=${timestamp}&sign=${sign}`;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          msgtype: 'text',
          text: { content: '🦞 Easy OpenClaw: 钉钉配置成功！' },
        }),
      });

      const data = await res.json() as { errcode: number; errmsg?: string };

      if (data.errcode === 0) {
        return { success: true, message: '钉钉配置成功，测试消息已发送' };
      }

      return { success: false, message: `钉钉 API 错误: ${data.errmsg ?? data.errcode}` };
    } catch (error) {
      return {
        success: false,
        message: `连接失败: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  }

  private async testWecom(webhook: string): Promise<TestResult> {
    if (!webhook) {
      return { success: false, message: '请提供 Webhook URL' };
    }

    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          msgtype: 'text',
          text: { content: '🦞 Easy OpenClaw: 企业微信配置成功！' },
        }),
      });

      const data = await res.json() as { errcode: number; errmsg?: string };

      if (data.errcode === 0) {
        return { success: true, message: '企业微信配置成功，测试消息已发送' };
      }

      return { success: false, message: `企业微信 API 错误: ${data.errmsg ?? data.errcode}` };
    } catch (error) {
      return {
        success: false,
        message: `连接失败: ${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  }

  private async testEmail(config: Record<string, string>): Promise<TestResult> {
    // Email testing requires a full SMTP connection - simplified check
    const required = ['host', 'port', 'user', 'pass', 'to'];
    for (const field of required) {
      if (!config[field]) {
        return { success: false, message: `请填写邮件配置: ${field}` };
      }
    }
    return {
      success: true,
      message: '邮件配置格式正确（实际发送需要重启 Gateway 后验证）',
    };
  }

  // ==================== Config Helpers ====================

  private async loadConfig(): Promise<OpenClawConfig> {
    try {
      const content = await fs.readFile(this.configPath, 'utf8');
      return JSON.parse(content) as OpenClawConfig;
    } catch {
      return {};
    }
  }

  private async saveConfig(config: OpenClawConfig): Promise<void> {
    await fs.mkdir(this.configDir, { recursive: true });
    await fs.writeFile(this.configPath, JSON.stringify(config, null, 2), 'utf8');
  }

  private async saveChannelConfig(
    channelId: string,
    fields: Record<string, string>,
  ): Promise<void> {
    const config = await this.loadConfig();

    if (!config.channels) {
      config.channels = {};
    }

    config.channels[channelId] = { ...fields };
    await this.saveConfig(config);
  }

  private async ensurePluginAllowed(channelId: string): Promise<void> {
    const config = await this.loadConfig();

    if (!config.plugins) {
      config.plugins = { allow: [] };
    }

    const allow = config.plugins['allow'] ?? [];
    if (!allow.includes(channelId)) {
      allow.push(channelId);
      config.plugins['allow'] = allow;
      await this.saveConfig(config);
    }
  }
}

/**
 * Mask sensitive token for display
 */
function maskToken(token: string): string {
  if (token.length <= 8) return '****';
  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}

/**
 * Compute DingTalk HMAC-SHA256 signature
 */
async function computeDingTalkSign(timestamp: number, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${timestamp}\n${secret}`);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, data);
  return encodeURIComponent(btoa(String.fromCharCode(...new Uint8Array(signature))));
}
