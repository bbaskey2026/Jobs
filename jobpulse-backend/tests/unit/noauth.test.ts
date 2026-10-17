import { describe, it, expect } from 'vitest';
import { mapNoAuthJobToDomain } from '../../src/integrations/noauth/noauth.mapper.js';
import { noAuthApiResponseSchema } from '../../src/integrations/noauth/noauth.schemas.js';
import { JobSector, EmploymentType } from '@jobpulse/shared';

describe('NoAuth Provider Ingestion & Mapping', () => {
  it('should normalize a raw external government job record correctly', () => {
    const rawJob = {
      external_id: 'upsc_2026_cse_01',
      job_title: 'Assistant Commissioner of Police',
      organization: 'Union Public Service Commission',
      sector_type: 'Central Government Public Service',
      job_type: 'Full Time Regular',
      vacancies: 45,
      location_state: 'Delhi',
      qualification_needed: 'Bachelor Degree',
      salary_min: 56100,
      salary_max: 177500,
      salary_text: 'Level 10 Pay Matrix',
      last_date_to_apply: '2026-11-30T18:00:00Z',
      official_pdf_url: 'https://upsc.gov.in/notification.pdf',
      apply_url: 'https://upsconline.nic.in'
    };

    const domain = mapNoAuthJobToDomain(rawJob);

    expect(domain.externalId).toBe('upsc_2026_cse_01');
    expect(domain.title).toBe('Assistant Commissioner of Police');
    expect(domain.organizationName).toBe('Union Public Service Commission');
    expect(domain.sector).toBe(JobSector.CENTRAL_GOVERNMENT);
    expect(domain.employmentType).toBe(EmploymentType.FULL_TIME);
    expect(domain.vacanciesCount).toBe(45);
    expect(domain.state).toBe('Delhi');
    expect(domain.qualificationSummary).toBe('Bachelor Degree');
    expect(domain.officialNotificationUrl).toBe('https://upsc.gov.in/notification.pdf');
    expect(domain.deduplicationHash).toBeDefined();
    expect(domain.deduplicationHash.length).toBe(64); // SHA-256 hex string
  });

  it('should validate provider API responses against Zod schema', () => {
    const validResponse = {
      status: 'ok',
      data: [
        {
          id: 'test_1',
          title: 'Staff Nurse',
          organization: 'AIIMS New Delhi'
        }
      ],
      next_page_cursor: 'cursor_abc123',
      total_count: 1
    };

    const parsed = noAuthApiResponseSchema.safeParse(validResponse);
    expect(parsed.success).toBe(true);
  });

  it('should compute identical hash for duplicate provider job payloads', () => {
    const raw1 = {
      external_id: 'job_duplicate_101',
      job_title: 'Junior Engineer',
      organization: 'CPWD',
      last_date_to_apply: '2026-12-01T00:00:00Z'
    };

    const raw2 = {
      external_id: 'job_duplicate_101',
      job_title: 'Junior Engineer  ',
      organization: 'CPWD',
      last_date_to_apply: '2026-12-01T00:00:00Z'
    };

    const domain1 = mapNoAuthJobToDomain(raw1);
    const domain2 = mapNoAuthJobToDomain(raw2);

    expect(domain1.deduplicationHash).toBe(domain2.deduplicationHash);
  });
});
