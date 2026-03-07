// backend/utils/validator.ts
// Input validation utilities

import { ValidationError } from './error.js';

/**
 * Validate that a string is not empty
 */
export function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ValidationError(`${fieldName} 不能为空`, fieldName);
  }
  return value.trim();
}

/**
 * Validate API key format (basic check)
 */
export function validateApiKey(apiKey: string, providerId: string): void {
  if (!apiKey || apiKey.trim() === '') {
    throw new ValidationError('API Key 不能为空', 'apiKey');
  }

  // Minimum length check
  if (apiKey.trim().length < 8) {
    throw new ValidationError('API Key 格式不正确，长度过短', 'apiKey');
  }

  // Provider-specific validation
  switch (providerId) {
    case 'anthropic':
      if (!apiKey.startsWith('sk-ant-')) {
        throw new ValidationError('Anthropic API Key 格式不正确，应以 sk-ant- 开头', 'apiKey');
      }
      break;
    case 'openai':
      if (!apiKey.startsWith('sk-')) {
        throw new ValidationError('OpenAI API Key 格式不正确，应以 sk- 开头', 'apiKey');
      }
      break;
    case 'google':
      // Google API keys don't have a strict prefix
      break;
    default:
      // For unknown providers, just check minimum length
      break;
  }
}

/**
 * Validate URL format
 */
export function validateUrl(url: string, fieldName: string = 'url'): void {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new ValidationError(`${fieldName} 必须是 http 或 https 协议`, fieldName);
    }
  } catch (e) {
    if (e instanceof ValidationError) throw e;
    throw new ValidationError(`${fieldName} 格式不正确`, fieldName);
  }
}

/**
 * Validate channel config fields
 */
export function validateChannelConfig(
  channelId: string,
  fields: Record<string, string>,
  requiredFields: string[],
): void {
  for (const fieldId of requiredFields) {
    const value = fields[fieldId];
    if (!value || value.trim() === '') {
      throw new ValidationError(`渠道 ${channelId} 的 ${fieldId} 字段不能为空`, fieldId);
    }
  }
}

/**
 * Validate provider config
 */
export function validateProviderConfig(config: {
  providerId: string;
  apiKey: string;
  baseUrl?: string;
  model: string;
}): void {
  requireString(config.providerId, 'providerId');
  requireString(config.model, 'model');
  validateApiKey(config.apiKey, config.providerId);

  if (config.baseUrl) {
    validateUrl(config.baseUrl, 'baseUrl');
  }
}
