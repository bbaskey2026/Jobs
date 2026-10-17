import { env } from '../../config/env.js';

export interface NoAuthConfig {
  baseUrl: string;
  apiKey?: string;
  timeoutMs: number;
  isEnabled: boolean;
  maxRetries: number;
}

export const noAuthConfig: NoAuthConfig = {
  baseUrl: env.NOAUTH_API_BASE_URL,
  apiKey: env.NOAUTH_API_KEY,
  timeoutMs: env.NOAUTH_API_TIMEOUT_MS,
  isEnabled: env.NOAUTH_ENABLED,
  maxRetries: 3
};
