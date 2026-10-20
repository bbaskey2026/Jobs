import {
  UserRole,
  JobSector,
  JobStatus,
  EmploymentType,
  AlertFrequency,
  NotificationChannel,
  SalaryPeriod
} from '../enums/index.js';
import { PaginationQuery, UserDto } from '../types/index.js';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  phoneNumber?: string;
}

export interface AuthResponse {
  user: UserDto;
  accessToken: string;
  refreshToken?: string;
  expiresInSeconds: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  state?: string;
  city?: string;
  currentEducation?: string;
  experienceYears?: number;
  preferredSectors?: JobSector[];
  preferredLocations?: string[];
  skills?: string[];
  bio?: string;
}

export interface JobFilterQuery extends PaginationQuery {
  q?: string;
  sector?: JobSector;
  categorySlug?: string;
  organizationId?: string;
  organizationSlug?: string;
  state?: string;
  city?: string;
  employmentType?: EmploymentType;
  status?: JobStatus;
  qualification?: string;
  experienceMin?: number;
  salaryMin?: number;
  hasOfficialNotification?: boolean;
  upcomingOnly?: boolean;
  deadlineApproachingDays?: number;
  stateOnly?: boolean;
  isGovernment?: boolean;
}

export interface CreateJobRequest {
  title: string;
  summary: string;
  fullDescription: string;
  organizationId: string;
  department?: string;
  sector: JobSector;
  categorySlug?: string;
  employmentType: EmploymentType;
  vacanciesCount?: number;
  state: string;
  city?: string;
  isAllIndia?: boolean;
  remoteType?: 'ON_SITE' | 'HYBRID' | 'REMOTE';
  qualificationSummary: string;
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: SalaryPeriod;
  salaryCustomDisplay?: string;
  applicationStartDate?: string;
  applicationDeadline?: string;
  officialNotificationUrl?: string;
  applicationUrl?: string;
  eligibilityCriteria?: string;
  selectionProcess?: string;
  applicationFee?: string;
  howToApply?: string;
  status?: JobStatus;
  isDemoData?: boolean;
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {
  status?: JobStatus;
}

export interface CreateJobAlertRequest {
  title: string;
  keywords?: string;
  sector?: JobSector;
  categorySlug?: string;
  state?: string;
  qualification?: string;
  frequency: AlertFrequency;
  channels: NotificationChannel[];
}

export interface UpdateJobAlertRequest extends Partial<CreateJobAlertRequest> {
  isActive?: boolean;
}

export interface TrackApplicationRequest {
  jobId: string;
  isExternalLinkClick: boolean;
  notes?: string;
}

export interface ReportJobRequest {
  jobId: string;
  reason: 'EXPIRED' | 'INACCURATE' | 'SUSPECTED_FRAUD' | 'BROKEN_LINK' | 'OTHER';
  description?: string;
}
