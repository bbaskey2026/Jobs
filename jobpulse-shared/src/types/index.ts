import {
  UserRole,
  JobSector,
  JobStatus,
  EmploymentType,
  ExperienceLevel,
  AlertFrequency,
  NotificationChannel,
  VerificationStatus,
  ApplicationStatus,
  SyncStatus,
  SalaryPeriod
} from '../enums/index.js';

export { ExperienceLevel };

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
  requestId?: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  requestId?: string;
  timestamp: string;
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfileDto | null;
}

export interface UserProfileDto {
  id: string;
  userId: string;
  phoneNumber?: string | null;
  state?: string | null;
  city?: string | null;
  currentEducation?: string | null;
  experienceYears?: number | null;
  preferredSectors: JobSector[];
  preferredLocations: string[];
  skills: string[];
  bio?: string | null;
  resumeUrl?: string | null;
  resumeFileName?: string | null;
}

export interface OrganizationDto {
  id: string;
  name: string;
  slug: string;
  sector: JobSector;
  category?: string | null;
  description?: string | null;
  websiteUrl?: string | null;
  officialNotificationDomain?: string | null;
  logoUrl?: string | null;
  verificationStatus: VerificationStatus;
  headquartersState?: string | null;
  activeJobsCount?: number;
  createdAt: string;
}

export interface JobCategoryDto {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  iconName?: string | null;
  jobCount?: number;
}

export interface JobDto {
  id: string;
  externalId?: string | null;
  title: string;
  slug: string;
  summary: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    sector: JobSector;
    verificationStatus: VerificationStatus;
    logoUrl?: string | null;
  };
  department?: string | null;
  sector: JobSector;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  employmentType: EmploymentType;
  vacanciesCount?: number | null;
  state: string;
  city?: string | null;
  isAllIndia: boolean;
  remoteType?: 'ON_SITE' | 'HYBRID' | 'REMOTE';
  qualificationSummary: string;
  experienceMin?: number | null;
  experienceMax?: number | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryPeriod?: SalaryPeriod | null;
  salaryCustomDisplay?: string | null;
  publishDate: string;
  applicationStartDate?: string | null;
  applicationDeadline?: string | null;
  status: JobStatus;
  sourceProvider?: string | null;
  officialNotificationUrl?: string | null;
  applicationUrl?: string | null;
  isBookmarked?: boolean;
  isDemoData?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobDetailDto extends JobDto {
  fullDescription: string;
  eligibilityCriteria?: string | null;
  selectionProcess?: string | null;
  applicationFee?: string | null;
  howToApply?: string | null;
  importantDates?: Record<string, string> | null;
  attachments?: {
    id: string;
    title: string;
    fileUrl: string;
    fileType: string;
    fileSizeBytes: number;
  }[];
}

export interface JobAlertDto {
  id: string;
  userId: string;
  title: string;
  keywords?: string | null;
  sector?: JobSector | null;
  categorySlug?: string | null;
  state?: string | null;
  qualification?: string | null;
  frequency: AlertFrequency;
  channels: NotificationChannel[];
  isActive: boolean;
  lastDeliveredAt?: string | null;
  matchCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobBookmarkDto {
  id: string;
  userId: string;
  jobId: string;
  createdAt: string;
  job: JobDto;
}

export interface SavedSearchDto {
  id: string;
  userId: string;
  name: string;
  searchParams: Record<string, any>;
  hasAlert: boolean;
  createdAt: string;
}

export interface NotificationDto {
  id: string;
  userId: string;
  title: string;
  message: string;
  linkUrl?: string | null;
  isRead: boolean;
  type: 'JOB_ALERT' | 'STATUS_UPDATE' | 'SYSTEM' | 'APPLICATION_UPDATE';
  createdAt: string;
}

export interface ApplicationRecordDto {
  id: string;
  userId: string;
  jobId: string;
  status: ApplicationStatus;
  isExternalLinkClick: boolean;
  appliedDate: string;
  notes?: string | null;
  job: {
    id: string;
    title: string;
    organizationName: string;
    applicationUrl?: string | null;
    applicationDeadline?: string | null;
    status: JobStatus;
  };
}

export interface JobSourceDto {
  id: string;
  name: string;
  code: string;
  sourceType: 'API_NOAUTH' | 'RSS_FEED' | 'OFFICIAL_CRAWLER' | 'MANUAL_ENTRY';
  baseUrl: string;
  isEnabled: boolean;
  syncIntervalMinutes: number;
  lastRunStatus: SyncStatus;
  lastRunAt?: string | null;
  nextRunAt?: string | null;
  consecutiveFailures: number;
  createdAt: string;
}

export interface JobSourceRunDto {
  id: string;
  jobSourceId: string;
  jobSourceName: string;
  status: SyncStatus;
  recordsFound: number;
  recordsIngested: number;
  recordsUpdated: number;
  recordsSkippedDuplicates: number;
  errorMessage?: string | null;
  startedAt: string;
  finishedAt?: string | null;
  durationSeconds?: number | null;
}

export interface DashboardMetricsDto {
  activeJobsCount: number;
  upcomingJobsCount: number;
  expiredJobsCount: number;
  pendingReviewCount: number;
  verifiedOrganizationsCount: number;
  activeSourcesCount: number;
  totalAlertsActive: number;
  notificationsDeliveredLast24h: number;
  reportedJobsCount: number;
  recentSourceRuns: JobSourceRunDto[];
}
