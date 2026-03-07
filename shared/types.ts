// shared/types.ts
// Shared TypeScript type definitions for Easy OpenClaw

// ==================== System ====================

export interface SystemInfo {
  os: OSInfo;
  arch: string;
  nodejs: NodeJSInfo | null;
  npm: NpmInfo | null;
  packageManager: PackageManager;
  openclaw: OpenClawInfo | null;
}

export interface OSInfo {
  platform: 'darwin' | 'linux' | 'win32' | 'wsl';
  distro?: string; // Linux distro
  release: string;
  hostname: string;
}

export interface NodeJSInfo {
  version: string;
  satisfied: boolean; // meets 22+ requirement
  path: string;
}

export interface NpmInfo {
  version: string;
  path: string;
}

export type PackageManager = 'homebrew' | 'apt' | 'yum' | 'dnf' | 'pacman' | 'winget' | 'choco' | 'unknown';

export interface OpenClawInfo {
  installed: boolean;
  version?: string;
  gatewayRunning?: boolean;
  configExists?: boolean;
}

export interface PrerequisiteCheck {
  id: string;
  name: string;
  satisfied: boolean;
  message: string;
  suggestion?: string;
}

// ==================== Install ====================

export interface InstallOptions {
  nodejsMethod: 'auto' | 'nvm' | 'official';
  skipOnboard?: boolean;
}

export type InstallEvent =
  | { type: 'step-start'; step: string; name: string }
  | { type: 'progress'; step: string; output: string }
  | { type: 'step-complete'; step: string; result: unknown }
  | { type: 'step-error'; step: string; error: string }
  | { type: 'install-complete'; success: boolean };

export interface InstallStatus {
  installId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  currentStep?: string;
  progress?: number;
  error?: string;
}

// ==================== AI Models ====================

export interface AIProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  models: AIModel[];
  getKeyUrl: string;
  supportsCustomUrl?: boolean;
  apiTypes?: string[]; // ['openai-responses', 'openai-completions']
}

export interface AIModel {
  id: string;
  name: string;
  recommended?: boolean;
  contextWindow?: number;
  maxTokens?: number;
}

export interface ProviderConfig {
  providerId: string;
  apiKey: string;
  baseUrl?: string;
  apiType?: string; // only for OpenAI
  model: string;
}

export interface CurrentModelConfig {
  providerId: string;
  model: string;
  baseUrl?: string;
  hasApiKey: boolean;
  maskedApiKey?: string;
}

export interface TestResult {
  success: boolean;
  message: string;
  details?: string;
}

// ==================== Channels ====================

export interface Channel {
  id: string;
  name: string;
  icon: string;
  description: string;
  configFields: ConfigField[];
  setupGuide: string;
}

export interface ConfigField {
  id: string;
  label: string;
  type: 'text' | 'password';
  required: boolean;
  placeholder?: string;
  description?: string;
}

export interface ChannelConfig {
  channelId: string;
  fields: Record<string, string>;
}

export interface CurrentChannelConfig {
  channelId: string;
  name: string;
  enabled: boolean;
  maskedFields?: Record<string, string>;
}

// ==================== Gateway ====================

export interface GatewayStatus {
  running: boolean;
  pid?: number;
  port?: number;
  uptime?: number;
  version?: string;
}

// ==================== API Responses ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  suggestion?: string;
  details?: string;
}

// ==================== Config ====================

export interface OpenClawConfig {
  models?: {
    default?: string;
    providers?: Record<string, ProviderDefinition>;
  };
  channels?: Record<string, ChannelDefinition>;
  plugins?: {
    allow?: string[];
    [key: string]: unknown;
  };
}

export interface ProviderDefinition {
  baseUrl?: string;
  apiKey?: string;
  models?: ModelDefinition[];
}

export interface ModelDefinition {
  id: string;
  api?: string;
  contextWindow?: number;
  maxTokens?: number;
}

export interface ChannelDefinition {
  token?: string;
  [key: string]: unknown;
}
