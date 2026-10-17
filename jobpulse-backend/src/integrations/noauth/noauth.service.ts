import { JobSourceProvider, ProviderJobRecord, ProviderSyncResult } from './noauth.provider.js';
import { noAuthClient } from './noauth.client.js';
import { mapNoAuthJobToDomain } from './noauth.mapper.js';
import { noAuthConfig } from './noauth.config.js';
import { logger } from '../../utils/logger.js';

export class NoAuthService implements JobSourceProvider {
  readonly providerCode = 'API_NOAUTH';
  readonly providerName = 'NoAuth Job Data Feed';

  async checkHealth(): Promise<{ isHealthy: boolean; message: string; latencyMs?: number }> {
    if (!noAuthConfig.isEnabled) {
      return {
        isHealthy: false,
        message: 'NoAuth provider is disabled or credentials pending configuration.'
      };
    }

    try {
      const pingResult = await noAuthClient.ping();
      return {
        isHealthy: true,
        message: 'Provider reachable',
        latencyMs: pingResult.latencyMs
      };
    } catch (error: any) {
      return {
        isHealthy: false,
        message: `Provider unreachable: ${error.message}`
      };
    }
  }

  async fetchJobs(options?: { cursor?: string; limit?: number; since?: Date }): Promise<ProviderSyncResult> {
    logger.info({ options }, 'Fetching jobs from NoAuth provider');

    const rawResponse = await noAuthClient.getJobs(options);
    const rawList = rawResponse.data || [];

    const normalized: ProviderJobRecord[] = rawList.map((raw) => mapNoAuthJobToDomain(raw));

    return {
      recordsFetched: rawList.length,
      recordsNormalized: normalized,
      nextCursor: rawResponse.next_page_cursor,
      hasMore: Boolean(rawResponse.next_page_cursor)
    };
  }

  async fetchJobById(externalId: string): Promise<ProviderJobRecord | null> {
    // Single record fetch fallback
    const res = await this.fetchJobs({ limit: 50 });
    const match = res.recordsNormalized.find((r) => r.externalId === externalId);
    return match || null;
  }
}

export const noAuthService = new NoAuthService();
