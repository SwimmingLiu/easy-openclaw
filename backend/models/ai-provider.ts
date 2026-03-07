// backend/models/ai-provider.ts
// AI provider definitions - all supported providers

import type { AIProvider } from '../../shared/types.js';

/**
 * Complete list of supported AI providers
 */
export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    icon: '🟣',
    description: '最强大的 AI 助手，适合复杂任务',
    getKeyUrl: 'https://console.anthropic.com/',
    models: [
      { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5', recommended: true },
      { id: 'claude-opus-4-5-20251101', name: 'Claude Opus 4.5' },
      { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI GPT',
    icon: '🟢',
    description: 'GPT 系列模型，通用能力出色',
    getKeyUrl: 'https://platform.openai.com/',
    supportsCustomUrl: true,
    apiTypes: ['openai-responses', 'openai-completions'],
    models: [
      { id: 'gpt-5', name: 'GPT-5', recommended: true },
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'o1', name: 'o1' },
      { id: 'o3-mini', name: 'o3-mini' },
    ],
  },
  {
    id: 'google',
    name: 'Google Gemini',
    icon: '🔵',
    description: 'Google 最新多模态 AI 模型',
    getKeyUrl: 'https://aistudio.google.com/app/apikey',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', recommended: true },
      { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '🌊',
    description: '国产高性价比 AI 模型',
    getKeyUrl: 'https://platform.deepseek.com/',
    supportsCustomUrl: true,
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat', recommended: true },
      { id: 'deepseek-coder', name: 'DeepSeek Coder' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner' },
    ],
  },
  {
    id: 'qwen',
    name: 'Alibaba Qwen',
    icon: '🟡',
    description: '阿里云通义千问系列模型',
    getKeyUrl: 'https://dashscope.console.aliyun.com/',
    supportsCustomUrl: true,
    models: [
      { id: 'qwen-max', name: 'Qwen Max', recommended: true },
      { id: 'qwen-plus', name: 'Qwen Plus' },
      { id: 'qwen-turbo', name: 'Qwen Turbo' },
    ],
  },
  {
    id: 'moonshot',
    name: 'Moonshot Kimi',
    icon: '🌙',
    description: 'Kimi AI，长上下文能力强',
    getKeyUrl: 'https://platform.moonshot.cn/',
    supportsCustomUrl: true,
    models: [
      { id: 'moonshot-v1-128k', name: 'Moonshot 128k', recommended: true },
      { id: 'moonshot-v1-32k', name: 'Moonshot 32k' },
      { id: 'moonshot-v1-8k', name: 'Moonshot 8k' },
    ],
  },
  {
    id: 'zhipu',
    name: 'Zhipu GLM',
    icon: '🔴',
    description: '智谱 AI GLM 系列模型',
    getKeyUrl: 'https://open.bigmodel.cn/',
    supportsCustomUrl: true,
    models: [
      { id: 'glm-4', name: 'GLM-4', recommended: true },
      { id: 'glm-4-flash', name: 'GLM-4 Flash' },
      { id: 'glm-3-turbo', name: 'GLM-3 Turbo' },
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    icon: '🌬️',
    description: 'Mistral 开源优先 AI 模型',
    getKeyUrl: 'https://console.mistral.ai/',
    supportsCustomUrl: true,
    models: [
      { id: 'mistral-large-latest', name: 'Mistral Large', recommended: true },
      { id: 'mistral-small-latest', name: 'Mistral Small' },
      { id: 'codestral-latest', name: 'Codestral' },
    ],
  },
  {
    id: 'groq',
    name: 'Groq',
    icon: '⚡',
    description: '超高速推理，低延迟响应',
    getKeyUrl: 'https://console.groq.com/',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', recommended: true },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B' },
      { id: 'gemma2-9b-it', name: 'Gemma2 9B' },
    ],
  },
  {
    id: 'together',
    name: 'Together AI',
    icon: '🤝',
    description: '开源模型云端推理平台',
    getKeyUrl: 'https://api.together.xyz/',
    supportsCustomUrl: true,
    models: [
      { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', name: 'Llama 3.1 70B', recommended: true },
      { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B' },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama (本地)',
    icon: '🦙',
    description: '本地运行开源模型，无需 API Key',
    getKeyUrl: 'https://ollama.ai/',
    supportsCustomUrl: true,
    models: [
      { id: 'llama3.2', name: 'Llama 3.2', recommended: true },
      { id: 'qwen2.5-coder', name: 'Qwen2.5 Coder' },
      { id: 'deepseek-r1', name: 'DeepSeek R1' },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    icon: '🔀',
    description: '统一 API 接入多家模型提供商',
    getKeyUrl: 'https://openrouter.ai/keys',
    supportsCustomUrl: true,
    models: [
      { id: 'anthropic/claude-sonnet-4-5', name: 'Claude Sonnet 4.5', recommended: true },
      { id: 'openai/gpt-4o', name: 'GPT-4o' },
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B' },
    ],
  },
];

/**
 * Get provider by ID
 */
export function getProviderById(providerId: string): AIProvider | undefined {
  return AI_PROVIDERS.find((p) => p.id === providerId);
}

/**
 * Get API key environment variable name for a provider
 */
export function getApiKeyEnvName(providerId: string): string {
  const envMap: Record<string, string> = {
    anthropic: 'ANTHROPIC_API_KEY',
    openai: 'OPENAI_API_KEY',
    google: 'GOOGLE_API_KEY',
    deepseek: 'DEEPSEEK_API_KEY',
    qwen: 'DASHSCOPE_API_KEY',
    moonshot: 'MOONSHOT_API_KEY',
    zhipu: 'ZHIPU_API_KEY',
    mistral: 'MISTRAL_API_KEY',
    groq: 'GROQ_API_KEY',
    together: 'TOGETHER_API_KEY',
    openrouter: 'OPENROUTER_API_KEY',
    ollama: 'OLLAMA_BASE_URL',
  };
  return envMap[providerId] ?? `${providerId.toUpperCase()}_API_KEY`;
}

/**
 * Get base URL environment variable name for a provider
 */
export function getBaseUrlEnvName(providerId: string): string {
  const envMap: Record<string, string> = {
    openai: 'OPENAI_BASE_URL',
    deepseek: 'DEEPSEEK_BASE_URL',
    ollama: 'OLLAMA_BASE_URL',
    qwen: 'DASHSCOPE_BASE_URL',
  };
  return envMap[providerId] ?? `${providerId.toUpperCase()}_BASE_URL`;
}

/**
 * Get the API type for a provider
 */
export function getApiType(providerId: string): string {
  const apiTypeMap: Record<string, string> = {
    anthropic: 'anthropic',
    openai: 'openai-responses',
    google: 'google',
    deepseek: 'openai-completions',
    qwen: 'openai-completions',
    moonshot: 'openai-completions',
    zhipu: 'openai-completions',
    mistral: 'openai-completions',
    groq: 'openai-completions',
    together: 'openai-completions',
    ollama: 'openai-completions',
    openrouter: 'openai-completions',
  };
  return apiTypeMap[providerId] ?? 'openai-completions';
}
