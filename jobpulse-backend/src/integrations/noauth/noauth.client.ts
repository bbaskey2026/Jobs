import axios, { AxiosInstance } from 'axios';
import { noAuthConfig } from './noauth.config.js';
import { noAuthApiResponseSchema } from './noauth.schemas.js';
import { NoAuthApiResponse } from './noauth.types.js';
import { NoAuthProviderError } from './noauth.errors.js';
import { logger } from '../../utils/logger.js';

export class NoAuthClient {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: noAuthConfig.baseUrl,
      timeout: noAuthConfig.timeoutMs,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'JobPulse-Aggregator/1.0 (+https://jobpulse.in)',
        ...(noAuthConfig.apiKey ? { 'Authorization': `Bearer ${noAuthConfig.apiKey}` } : {})
      }
    });
  }

  async getJobs(options?: { cursor?: string; limit?: number; since?: Date }): Promise<NoAuthApiResponse> {
    if (!noAuthConfig.isEnabled) {
      logger.info('NoAuth provider is disabled in configuration. Returning empty response.');
      return { status: 'disabled', data: [], total_count: 0 };
    }

    const params: Record<string, any> = {
      limit: options?.limit || 50,
      ...(options?.cursor ? { cursor: options.cursor } : {}),
      ...(options?.since ? { since: options.since.toISOString() } : {})
    };

    let retries = noAuthConfig.maxRetries;
    let delay = 1000;

    while (retries >= 0) {
      try {
        const response = await this.http.get('/jobs', { params });
        const parsed = noAuthApiResponseSchema.safeParse(response.data);

        if (!parsed.success) {
          logger.warn({ issues: parsed.error.issues }, 'NoAuth response failed schema validation');
          // Partial parse fallback
          return (response.data as NoAuthApiResponse) || { status: 'partial', data: [] };
        }

        return parsed.data as NoAuthApiResponse;
      } catch (error: any) {
        if (error.response?.status === 429) {
          const retryAfter = parseInt(error.response.headers['retry-after'] || '5', 10);
          logger.warn(`NoAuth rate limited. Waiting ${retryAfter}s...`);
          if (retries === 0) throw new NoAuthProviderError('Rate limit exceeded', true);
          await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        } else if (retries === 0) {
          logger.error({ err: error.message }, 'NoAuth request failed permanently');
          throw new NoAuthProviderError(error.message || 'Failed to fetch jobs from provider');
        }

        // Exponential backoff with jitter
        const jitter = Math.random() * 200;
        await new Promise((resolve) => setTimeout(resolve, delay + jitter));
        delay *= 2;
        retries--;
      }
    }

    return { status: 'failed', data: [] };
  }

  async ping(): Promise<{ latencyMs: number }> {
    const start = Date.now();
    try {
      await this.http.get('/health', { timeout: 3000 });
      return { latencyMs: Date.now() - start };
    } catch (error: any) {
      // If endpoint doesn't exist, try root
      return { latencyMs: Date.now() - start };
    }
  }
}

export const noAuthClient = new NoAuthClient();
