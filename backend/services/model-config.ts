// backend/services/model-config.ts
// AI model provider configuration management

import os from 'node:os';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createChildLogger } from '../utils/logger.js';
import { ConfigError } from '../utils/error.js';
import { maskApiKey } from '../utils/error.js';
import { AI_PROVIDERS, getApiKeyEnvName, getBaseUrlEnvName, getApiType } from '../models/ai-provider.js';
import { execCommand } from '../executors/shell.js';
import type {
  AIProvider,
  ProviderConfig,
  CurrentModelConfig,
  TestResult,
  OpenClawConfig,
} from '../../shared/types.js';

const log = createChildLogger('model-config');

export class ModelConfigService {
  private get configDir(): string {
    return process.env['EASY_OPENCLAW_CONFIG_DIR'] ?? path.join(os.homedir(), '.openclaw');
  }

  private get configPath(): string {
    return path.join(this.configDir, 'openclaw.json');
  }

  private get envPath(): string {
    return path.join(this.configDir, 'env');
  }

  /**
   * Get list of supported AI providers
   */
  getSupportedProviders(): AIProvider[] {
    return AI_PROVIDERS;
  }

  /**
   * Get currently configured model
   */
  async getCurrentConfig(): Promise<CurrentModelConfig | null> {
    try {
      const config = await this.loadConfig();
      const defaultModel = config.models?.default;

      if (!defaultModel) return null;

      // Parse "providerId/modelId" or "providerId-custom/modelId"
      const [providerPart, ...modelParts] = defaultModel.split('/');
      const modelId = modelParts.join('/');

      if (!providerPart || !modelId) return null;

      // Normalize provider ID (remove -custom suffix)
      const providerId = providerPart.replace(/-custom$/, '');

      // Get API key (masked)
      const apiKey = await this.getStoredApiKey(providerId);
      const providerDef = config.models?.providers?.[providerPart];

      return {
        providerId,
        model: modelId,
        baseUrl: providerDef?.baseUrl,
        hasApiKey: !!apiKey,
        maskedApiKey: apiKey ? maskApiKey(apiKey) : undefined,
      };
    } catch {
      return null;
    }
  }

  /**
   * Configure an AI provider
   */
  async configureProvider(config: ProviderConfig): Promise<void> {
    const { providerId, apiKey, baseUrl, apiType, model } = config;

    log.info({ providerId, model, hasBaseUrl: !!baseUrl }, 'Configuring AI provider');

    // 1. Write to env file
    await this.updateEnvFile(providerId, apiKey, baseUrl);

    // 2. Update openclaw.json
    if (baseUrl) {
      await this.configureCustomProvider(providerId, apiKey, baseUrl, model, apiType);
    } else {
      await this.configureStandardProvider(providerId, model);
    }

    log.info({ providerId, model }, 'AI provider configured');
  }

  /**
   * Configure standard provider (uses built-in provider config)
   */
  private async configureStandardProvider(providerId: string, model: string): Promise<void> {
    const openclawConfig = await this.loadConfig();

    if (!openclawConfig.models) {
      openclawConfig.models = {};
    }

    openclawConfig.models.default = `${providerId}/${model}`;

    await this.saveConfig(openclawConfig);
  }

  /**
   * Configure custom provider (supports third-party API proxies)
   */
  private async configureCustomProvider(
    providerId: string,
    apiKey: string,
    baseUrl: string,
    model: string,
    apiType?: string,
  ): Promise<void> {
    const openclawConfig = await this.loadConfig();

    if (!openclawConfig.models) {
      openclawConfig.models = {};
    }
    if (!openclawConfig.models.providers) {
      openclawConfig.models.providers = {};
    }

    const providerKey = `${providerId}-custom`;
    const resolvedApiType = apiType ?? getApiType(providerId);

    // Register custom provider
    openclawConfig.models.providers[providerKey] = {
      baseUrl,
      models: [
        {
          id: model,
          api: resolvedApiType,
          contextWindow: 200000,
          maxTokens: 8192,
        },
      ],
    };

    // Set as default model
    openclawConfig.models.default = `${providerKey}/${model}`;

    await this.saveConfig(openclawConfig);
  }

  /**
   * Test API connection
   */
  async testConnection(config: ProviderConfig): Promise<TestResult> {
    log.info({ providerId: config.providerId }, 'Testing API connection');

    const envOverrides: Record<string, string> = {
      [getApiKeyEnvName(config.providerId)]: config.apiKey,
    };

    if (config.baseUrl) {
      envOverrides[getBaseUrlEnvName(config.providerId)] = config.baseUrl;
    }

    try {
      await execCommand('openclaw agent --local --message "Say OK"', {
        env: { ...process.env, ...envOverrides } as NodeJS.ProcessEnv,
        timeout: 30_000,
      });

      return { success: true, message: 'API 连接成功' };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log.warn({ providerId: config.providerId, error: message }, 'API connection test failed');
      return { success: false, message: `API 连接失败: ${message}` };
    }
  }

  /**
   * Load openclaw.json config
   */
  async loadConfig(): Promise<OpenClawConfig> {
    try {
      const content = await fs.readFile(this.configPath, 'utf8');
      return JSON.parse(content) as OpenClawConfig;
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === 'ENOENT') {
        return {}; // Return empty config if not exists
      }
      throw new ConfigError(`无法读取配置文件: ${this.configPath}`, err.message);
    }
  }

  /**
   * Save openclaw.json config
   */
  async saveConfig(config: OpenClawConfig): Promise<void> {
    await fs.mkdir(this.configDir, { recursive: true });
    await fs.writeFile(this.configPath, JSON.stringify(config, null, 2), 'utf8');
    log.debug({ configPath: this.configPath }, 'Config saved');
  }

  /**
   * Update env file with API key and optional base URL
   */
  private async updateEnvFile(
    providerId: string,
    apiKey: string,
    baseUrl?: string,
  ): Promise<void> {
    const keyEnvName = getApiKeyEnvName(providerId);

    let envContent = '';
    try {
      envContent = await fs.readFile(this.envPath, 'utf8');
    } catch {
      // File doesn't exist yet
    }

    // Parse existing env vars
    const envVars = this.parseEnvFile(envContent);

    // Update/set the API key
    envVars[keyEnvName] = apiKey;

    // Update/set base URL if provided
    if (baseUrl) {
      const urlEnvName = getBaseUrlEnvName(providerId);
      envVars[urlEnvName] = baseUrl;
    }

    // Write back
    const newContent = Object.entries(envVars)
      .map(([k, v]) => `${k}="${v}"`)
      .join('\n') + '\n';

    await fs.mkdir(this.configDir, { recursive: true });
    await fs.writeFile(this.envPath, newContent, { mode: 0o600 });
  }

  /**
   * Parse env file content into key-value map
   */
  private parseEnvFile(content: string): Record<string, string> {
    const result: Record<string, string> = {};

    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;

      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();

      // Remove surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      if (key) {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Get stored API key from env file
   */
  private async getStoredApiKey(providerId: string): Promise<string | null> {
    try {
      const content = await fs.readFile(this.envPath, 'utf8');
      const envVars = this.parseEnvFile(content);
      const keyName = getApiKeyEnvName(providerId);
      return envVars[keyName] ?? null;
    } catch {
      return null;
    }
  }
}
