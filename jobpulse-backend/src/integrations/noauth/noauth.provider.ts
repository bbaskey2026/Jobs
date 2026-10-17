import { JobSector, EmploymentType } from '@jobpulse/shared';

export interface ProviderJobRecord {
  externalId: string;
  sourceProvider: string;
  title: string;
  organizationName: string;
  organizationWebsite?: string;
  department?: string;
  sector: JobSector;
  employmentType: EmploymentType;
  vacanciesCount?: number;
  state: string;
  city?: string;
  isAllIndia: boolean;
  qualificationSummary: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCustomDisplay?: string;
  publishDate: Date;
  applicationDeadline?: Date;
  officialNotificationUrl?: string;
  applicationUrl?: string;
  rawPayload: Record<string, any>;
  deduplicationHash: string;
}

export interface ProviderSyncResult {
  recordsFetched: number;
  recordsNormalized: ProviderJobRecord[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface JobSourceProvider {
  readonly providerCode: string;
  readonly providerName: string;

  checkHealth(): Promise<{ isHealthy: boolean; message: string; latencyMs?: number }>;
  fetchJobs(options?: { cursor?: string; limit?: number; since?: Date }): Promise<ProviderSyncResult>;
  fetchJobById(externalId: string): Promise<ProviderJobRecord | null>;
}
