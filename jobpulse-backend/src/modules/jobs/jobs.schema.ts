import { z } from 'zod';
import { JobSector, JobStatus, EmploymentType, SalaryPeriod } from '@jobpulse/shared';

const emptyStringToUndefined = z.preprocess((val) => (val === '' ? undefined : val), z.string().optional());
const emptyEnumToUndefined = <T extends [string, ...string[]]>(values: T) =>
  z.preprocess((val) => (val === '' ? undefined : val), z.enum(values).optional());

export const jobFilterSchema = z.object({
  query: z.object({
    page: z.preprocess((val) => (val === '' ? 1 : val), z.coerce.number().min(1).optional().default(1)),
    limit: z.preprocess((val) => (val === '' ? 12 : val), z.coerce.number().min(1).max(100).optional().default(12)),
    sortBy: z.preprocess(
      (val) => (val === '' ? 'publishDate' : val),
      z.enum(['publishDate', 'applicationDeadline', 'salaryMax', 'title']).optional().default('publishDate')
    ),
    sortOrder: z.preprocess(
      (val) => (val === '' ? 'desc' : val),
      z.enum(['asc', 'desc']).optional().default('desc')
    ),
    q: emptyStringToUndefined,
    sector: z.preprocess((val) => (val === '' ? undefined : val), z.nativeEnum(JobSector).or(z.string()).optional()),
    isGovernment: emptyEnumToUndefined(['true', 'false']),
    categorySlug: emptyStringToUndefined,
    organizationSlug: emptyStringToUndefined,
    organizationId: emptyStringToUndefined,
    state: emptyStringToUndefined,
    stateOnly: emptyEnumToUndefined(['true', 'false']),
    city: emptyStringToUndefined,
    employmentType: z.preprocess((val) => (val === '' ? undefined : val), z.nativeEnum(EmploymentType).or(z.string()).optional()),
    qualification: emptyStringToUndefined,
    experienceMin: z.preprocess((val) => (val === '' ? undefined : val), z.coerce.number().optional()),
    salaryMin: z.preprocess((val) => (val === '' ? undefined : val), z.coerce.number().optional()),
    hasOfficialNotification: emptyEnumToUndefined(['true', 'false']),
    upcomingOnly: emptyEnumToUndefined(['true', 'false']),
    deadlineApproachingDays: z.preprocess((val) => (val === '' ? undefined : val), z.coerce.number().optional()),
    status: z.preprocess((val) => (val === '' ? undefined : val), z.nativeEnum(JobStatus).optional())
  })
});

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Job title must be at least 3 characters'),
    summary: z.string().min(10, 'Summary must be at least 10 characters'),
    fullDescription: z.string().min(20, 'Full description must be provided'),
    organizationId: z.string().uuid('Invalid organization ID'),
    department: z.string().optional(),
    sector: z.nativeEnum(JobSector).or(z.string().min(1)),
    categoryId: z.string().uuid().optional(),
    employmentType: z.nativeEnum(EmploymentType).or(z.string().min(1)).default(EmploymentType.FULL_TIME),
    vacanciesCount: z.number().int().positive().optional(),
    state: z.string().default('All India'),
    city: z.string().optional(),
    isAllIndia: z.boolean().default(false),
    remoteType: z.enum(['ON_SITE', 'HYBRID', 'REMOTE']).default('ON_SITE'),
    qualificationSummary: z.string().min(2, 'Qualification requirements are required'),
    experienceMin: z.number().int().min(0).optional().default(0),
    experienceMax: z.number().int().min(0).optional(),
    salaryMin: z.number().int().optional(),
    salaryMax: z.number().int().optional(),
    salaryPeriod: z.nativeEnum(SalaryPeriod).optional().default(SalaryPeriod.MONTHLY),
    salaryCustomDisplay: z.string().optional(),
    applicationStartDate: z.string().datetime().optional(),
    applicationDeadline: z.string().datetime().optional(),
    officialNotificationUrl: z.string().url().optional().or(z.literal('')),
    applicationUrl: z.string().url().optional().or(z.literal('')),
    eligibilityCriteria: z.string().optional(),
    selectionProcess: z.string().optional(),
    applicationFee: z.string().optional(),
    howToApply: z.string().optional(),
    status: z.nativeEnum(JobStatus).default(JobStatus.PUBLISHED)
  })
});

export const updateJobSchema = z.object({
  body: createJobSchema.shape.body.partial()
});

export const reportJobSchema = z.object({
  body: z.object({
    jobId: z.string().uuid(),
    reason: z.enum(['EXPIRED', 'INACCURATE', 'SUSPECTED_FRAUD', 'BROKEN_LINK', 'OTHER']),
    description: z.string().optional()
  })
});
