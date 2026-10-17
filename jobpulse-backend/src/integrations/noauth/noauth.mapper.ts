import { createHash } from 'crypto';
import { JobSector, EmploymentType } from '@jobpulse/shared';
import { NoAuthRawJob } from './noauth.types.js';
import { ProviderJobRecord } from './noauth.provider.js';

export function mapNoAuthJobToDomain(raw: NoAuthRawJob): ProviderJobRecord {
  const externalId = raw.external_id || raw.id || `na_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const title = (raw.job_title || raw.title || 'Untitled Vacancy').trim();
  const organizationName = (raw.organization || raw.company_name || 'Government / Recruitment Authority').trim();

  // Sector classification mapper
  let sector: JobSector = JobSector.CENTRAL_GOVERNMENT;
  const rawSector = (raw.sector_type || '').toLowerCase();
  if (rawSector.includes('state')) sector = JobSector.STATE_GOVERNMENT;
  else if (rawSector.includes('bank') || rawSector.includes('insurance')) sector = JobSector.BANKING_INSURANCE;
  else if (rawSector.includes('rail')) sector = JobSector.RAILWAYS;
  else if (rawSector.includes('defence') || rawSector.includes('army') || rawSector.includes('navy')) sector = JobSector.DEFENCE_PARAMILITARY;
  else if (rawSector.includes('psu') || rawSector.includes('public sector')) sector = JobSector.PSU;
  else if (rawSector.includes('teach') || rawSector.includes('education')) sector = JobSector.TEACHING_EDUCATION;
  else if (rawSector.includes('police')) sector = JobSector.POLICE_SECURITY;
  else if (rawSector.includes('it') || rawSector.includes('software')) sector = JobSector.PRIVATE_IT;
  else if (rawSector.includes('finance')) sector = JobSector.PRIVATE_FINANCE;
  else if (rawSector.includes('private')) sector = JobSector.PRIVATE_OTHER;

  // Employment type mapper
  let employmentType: EmploymentType = EmploymentType.FULL_TIME;
  const rawType = (raw.job_type || '').toLowerCase();
  if (rawType.includes('contract')) employmentType = EmploymentType.CONTRACT;
  else if (rawType.includes('intern')) employmentType = EmploymentType.INTERNSHIP;
  else if (rawType.includes('apprentice')) employmentType = EmploymentType.APPRENTICESHIP;
  else if (rawType.includes('part')) employmentType = EmploymentType.PART_TIME;

  // Safe date parsing
  const publishDate = raw.posted_at ? new Date(raw.posted_at) : new Date();
  const applicationDeadline = raw.last_date_to_apply ? new Date(raw.last_date_to_apply) : undefined;

  // Vacancy count
  let vacanciesCount: number | undefined;
  if (typeof raw.vacancies === 'number') {
    vacanciesCount = raw.vacancies;
  } else if (typeof raw.vacancies === 'string') {
    const parsed = parseInt(raw.vacancies, 10);
    if (!isNaN(parsed)) vacanciesCount = parsed;
  }

  // Deterministic deduplication hash
  const hashPayload = [
    'NOAUTH',
    externalId,
    title.toLowerCase().replace(/\s+/g, ' '),
    organizationName.toLowerCase().replace(/\s+/g, ' '),
    applicationDeadline ? applicationDeadline.toISOString().split('T')[0] : ''
  ].join('|');
  const deduplicationHash = createHash('sha256').update(hashPayload).digest('hex');

  return {
    externalId,
    sourceProvider: 'API_NOAUTH',
    title,
    organizationName,
    organizationWebsite: raw.org_website,
    department: raw.department,
    sector,
    employmentType,
    vacanciesCount,
    state: raw.location_state || 'All India',
    city: raw.location_city,
    isAllIndia: raw.is_national ?? (raw.location_state ? raw.location_state.toLowerCase().includes('all india') : true),
    qualificationSummary: raw.qualification_needed || 'As per official recruitment notification',
    salaryMin: raw.salary_min,
    salaryMax: raw.salary_max,
    salaryCustomDisplay: raw.salary_text,
    publishDate,
    applicationDeadline,
    officialNotificationUrl: raw.official_pdf_url,
    applicationUrl: raw.apply_url,
    rawPayload: raw,
    deduplicationHash
  };
}
