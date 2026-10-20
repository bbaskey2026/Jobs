import { Prisma } from '@prisma/client';
import {
  JobSector,
  JobStatus,
  PaginationMeta,
  JobDto,
  JobDetailDto,
  VerificationStatus,
  EmploymentType,
  SalaryPeriod
} from '@jobpulse/shared';
import { prisma } from '../../database/prisma.js';
import { AppError } from '../../utils/errors.js';

export class JobsService {
  async getJobs(params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    q?: string;
    sector?: JobSector;
    isGovernment?: boolean | string;
    categorySlug?: string;
    organizationSlug?: string;
    organizationId?: string;
    state?: string;
    stateOnly?: boolean | string;
    city?: string;
    employmentType?: EmploymentType;
    qualification?: string;
    experienceMin?: number;
    salaryMin?: number;
    hasOfficialNotification?: boolean | string;
    upcomingOnly?: boolean | string;
    deadlineApproachingDays?: number;
    status?: JobStatus;
    currentUserId?: string;
  }): Promise<{ jobs: JobDto[]; pagination: PaginationMeta }> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 12));
    const skip = (page - 1) * limit;

    const where: Prisma.JobWhereInput = {};
    const now = new Date();
    const andConditions: Prisma.JobWhereInput[] = [];

    // 1. Status and Deadline Enforcement (Strictly Genuine Real Data Only, No Demo Data)
    where.isDemoData = false;
    if (params.status) {
      where.status = params.status;
    } else {
      // By default, only show PUBLISHED jobs whose application deadline has not expired
      where.status = JobStatus.PUBLISHED;
      andConditions.push({
        OR: [
          { applicationDeadline: null },
          { applicationDeadline: { gte: now } }
        ]
      });
    }

    // 2. Upcoming Only
    const isUpcoming = typeof params.upcomingOnly === 'string' ? params.upcomingOnly === 'true' : Boolean(params.upcomingOnly);
    if (isUpcoming) {
      where.status = JobStatus.UPCOMING;
    }

    // 3. Deadline Approaching filter
    if (params.deadlineApproachingDays) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + params.deadlineApproachingDays);
      where.applicationDeadline = {
        gte: now,
        lte: targetDate
      };
    }

    // 4. Sector / Government classification
    const governmentSectors: JobSector[] = [
      JobSector.CENTRAL_GOVERNMENT,
      JobSector.STATE_GOVERNMENT,
      JobSector.UPSC_STATE_PSC,
      JobSector.SSC,
      JobSector.BANKING_INSURANCE,
      JobSector.RAILWAYS,
      JobSector.DEFENCE_PARAMILITARY,
      JobSector.PSU,
      JobSector.TEACHING_EDUCATION,
      JobSector.POLICE_SECURITY,
      JobSector.HEALTHCARE_PUBLIC
    ];

    if (params.sector) {
      where.sector = params.sector;
    } else if (params.isGovernment !== undefined && params.isGovernment !== '') {
      const isGov = typeof params.isGovernment === 'string' ? params.isGovernment === 'true' : Boolean(params.isGovernment);
      if (isGov) {
        where.sector = { in: governmentSectors };
      } else {
        where.sector = { notIn: governmentSectors };
      }
    }

    // 5. Category
    if (params.categorySlug) {
      where.category = { slug: params.categorySlug };
    }

    // 6. Organization
    if (params.organizationId) {
      where.organizationId = params.organizationId;
    } else if (params.organizationSlug) {
      where.organization = { slug: params.organizationSlug };
    }

    // 7. Location (State / City)
    if (params.state && params.state !== 'All India') {
      const isStateOnly = typeof params.stateOnly === 'string' ? params.stateOnly === 'true' : Boolean(params.stateOnly);
      if (isStateOnly) {
        where.state = params.state;
      } else {
        andConditions.push({
          OR: [
            { state: { equals: params.state } },
            { isAllIndia: true }
          ]
        });
      }
    }

    if (params.city) {
      where.city = { contains: params.city };
    }

    // 8. Employment type
    if (params.employmentType) {
      where.employmentType = params.employmentType;
    }

    // 9. Qualification & Experience
    if (params.qualification) {
      where.qualificationSummary = { contains: params.qualification };
    }
    if (params.experienceMin !== undefined) {
      where.experienceMin = { lte: params.experienceMin };
    }
    if (params.salaryMin !== undefined) {
      where.salaryMax = { gte: params.salaryMin };
    }

    // 10. Official Notification Available
    const hasNotification = typeof params.hasOfficialNotification === 'string'
      ? params.hasOfficialNotification === 'true'
      : Boolean(params.hasOfficialNotification);
    if (hasNotification) {
      where.officialNotificationUrl = { not: null };
    }

    // 11. Intelligent Multi-Word Keyword Search
    if (params.q && params.q.trim()) {
      const rawTerm = params.q.trim();
      const tokens = rawTerm.split(/[\s+,]+/).map((t) => t.trim()).filter((t) => t.length > 0);

      if (tokens.length <= 1) {
        andConditions.push({
          OR: [
            { title: { contains: rawTerm } },
            { summary: { contains: rawTerm } },
            { fullDescription: { contains: rawTerm } },
            { department: { contains: rawTerm } },
            { qualificationSummary: { contains: rawTerm } },
            { state: { contains: rawTerm } },
            { city: { contains: rawTerm } },
            { slug: { contains: rawTerm } },
            { organization: { name: { contains: rawTerm } } },
            { organization: { slug: { contains: rawTerm } } }
          ]
        });
      } else {
        // Multi-word search: Each word token must match across title, summary, department, org, or state
        tokens.forEach((token) => {
          andConditions.push({
            OR: [
              { title: { contains: token } },
              { summary: { contains: token } },
              { fullDescription: { contains: token } },
              { department: { contains: token } },
              { qualificationSummary: { contains: token } },
              { state: { contains: token } },
              { city: { contains: token } },
              { slug: { contains: token } },
              { organization: { name: { contains: token } } },
              { organization: { slug: { contains: token } } }
            ]
          });
        });
      }
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    // Sorting
    const orderBy: Prisma.JobOrderByWithRelationInput = {};
    const sortOrder = params.sortOrder || 'desc';
    if (params.sortBy === 'applicationDeadline') {
      orderBy.applicationDeadline = sortOrder;
    } else if (params.sortBy === 'salaryMax') {
      orderBy.salaryMax = sortOrder;
    } else if (params.sortBy === 'title') {
      orderBy.title = sortOrder;
    } else {
      orderBy.publishDate = sortOrder;
    }

    const [total, records] = await Promise.all([
      prisma.job.count({ where }),
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
              sector: true,
              verificationStatus: true,
              logoUrl: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          bookmarks: params.currentUserId
            ? {
                where: { userId: params.currentUserId },
                select: { id: true }
              }
            : false
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const jobs: JobDto[] = records.map((record) => ({
      id: record.id,
      externalId: record.externalId,
      title: record.title,
      slug: record.slug,
      summary: record.summary,
      organization: {
        id: record.organization.id,
        name: record.organization.name,
        slug: record.organization.slug,
        sector: record.organization.sector as JobSector,
        verificationStatus: record.organization.verificationStatus as VerificationStatus,
        logoUrl: record.organization.logoUrl
      },
      department: record.department,
      sector: record.sector as JobSector,
      category: record.category
        ? {
            id: record.category.id,
            name: record.category.name,
            slug: record.category.slug
          }
        : null,
      employmentType: record.employmentType as EmploymentType,
      vacanciesCount: record.vacanciesCount,
      state: record.state,
      city: record.city,
      isAllIndia: record.isAllIndia,
      remoteType: record.remoteType as any,
      qualificationSummary: record.qualificationSummary,
      experienceMin: record.experienceMin,
      experienceMax: record.experienceMax,
      salaryMin: record.salaryMin,
      salaryMax: record.salaryMax,
      salaryPeriod: record.salaryPeriod as SalaryPeriod,
      salaryCustomDisplay: record.salaryCustomDisplay,
      publishDate: record.publishDate.toISOString(),
      applicationStartDate: record.applicationStartDate?.toISOString() || null,
      applicationDeadline: record.applicationDeadline?.toISOString() || null,
      status: record.status as JobStatus,
      sourceProvider: record.sourceProvider,
      officialNotificationUrl: record.officialNotificationUrl,
      applicationUrl: record.applicationUrl,
      isBookmarked: Boolean(record.bookmarks && record.bookmarks.length > 0),
      isDemoData: record.isDemoData,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString()
    }));

    return {
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  async getJobBySlugOrId(identifier: string, currentUserId?: string): Promise<JobDetailDto> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);

    const record = await prisma.job.findFirst({
      where: isUuid ? { id: identifier } : { slug: identifier },
      include: {
        organization: true,
        category: true,
        attachments: true,
        bookmarks: currentUserId
          ? {
              where: { userId: currentUserId },
              select: { id: true }
            }
          : false
      }
    });

    if (!record) {
      throw AppError.notFound('Job posting not found');
    }

    return {
      id: record.id,
      externalId: record.externalId,
      title: record.title,
      slug: record.slug,
      summary: record.summary,
      fullDescription: record.fullDescription,
      organization: {
        id: record.organization.id,
        name: record.organization.name,
        slug: record.organization.slug,
        sector: record.organization.sector as JobSector,
        verificationStatus: record.organization.verificationStatus as VerificationStatus,
        logoUrl: record.organization.logoUrl,
        websiteUrl: record.organization.websiteUrl
      },
      department: record.department,
      sector: record.sector as JobSector,
      category: record.category
        ? {
            id: record.category.id,
            name: record.category.name,
            slug: record.category.slug
          }
        : null,
      employmentType: record.employmentType as EmploymentType,
      vacanciesCount: record.vacanciesCount,
      state: record.state,
      city: record.city,
      isAllIndia: record.isAllIndia,
      remoteType: record.remoteType as any,
      qualificationSummary: record.qualificationSummary,
      experienceMin: record.experienceMin,
      experienceMax: record.experienceMax,
      salaryMin: record.salaryMin,
      salaryMax: record.salaryMax,
      salaryPeriod: record.salaryPeriod as SalaryPeriod,
      salaryCustomDisplay: record.salaryCustomDisplay,
      publishDate: record.publishDate.toISOString(),
      applicationStartDate: record.applicationStartDate?.toISOString() || null,
      applicationDeadline: record.applicationDeadline?.toISOString() || null,
      status: record.status as JobStatus,
      sourceProvider: record.sourceProvider,
      officialNotificationUrl: record.officialNotificationUrl,
      applicationUrl: record.applicationUrl,
      eligibilityCriteria: record.eligibilityCriteria,
      selectionProcess: record.selectionProcess,
      applicationFee: record.applicationFee,
      howToApply: record.howToApply,
      isBookmarked: Boolean(record.bookmarks && record.bookmarks.length > 0),
      isDemoData: record.isDemoData,
      attachments: record.attachments.map((att) => ({
        id: att.id,
        title: att.title,
        fileUrl: att.fileUrl,
        fileType: att.fileType,
        fileSizeBytes: att.fileSizeBytes
      })),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString()
    };
  }

  async reportJob(jobId: string, reason: string, description?: string, userId?: string) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw AppError.notFound('Job posting not found');

    const report = await prisma.reportedJob.create({
      data: {
        jobId,
        userId,
        reason,
        description
      }
    });

    return { message: 'Thank you for reporting this issue. Our moderation team will review it.', reportId: report.id };
  }

  async getStateStats() {
    const now = new Date();
    const publishedJobs = await prisma.job.findMany({
      where: {
        status: JobStatus.PUBLISHED,
        OR: [
          { applicationDeadline: null },
          { applicationDeadline: { gte: now } }
        ]
      },
      select: {
        id: true,
        title: true,
        sector: true,
        state: true,
        isAllIndia: true,
        vacanciesCount: true
      }
    });

    const statsByState: Record<string, {
      state: string;
      totalJobs: number;
      totalVacancies: number;
      postTypes: {
        pscAndGovt: number;
        policeAndSecurity: number;
        teachingAndEdu: number;
        engineeringAndPsu: number;
        bankingAndFinance: number;
        healthcare: number;
        privateSector: number;
        other: number;
      };
    }> = {};

    for (const job of publishedJobs) {
      const stateKey = job.state || 'All India';
      if (!statsByState[stateKey]) {
        statsByState[stateKey] = {
          state: stateKey,
          totalJobs: 0,
          totalVacancies: 0,
          postTypes: {
            pscAndGovt: 0,
            policeAndSecurity: 0,
            teachingAndEdu: 0,
            engineeringAndPsu: 0,
            bankingAndFinance: 0,
            healthcare: 0,
            privateSector: 0,
            other: 0
          }
        };
      }

      const entry = statsByState[stateKey];
      entry.totalJobs += 1;
      entry.totalVacancies += job.vacanciesCount || 1;

      if (
        job.sector === JobSector.UPSC_STATE_PSC ||
        job.sector === JobSector.CENTRAL_GOVERNMENT ||
        job.sector === JobSector.STATE_GOVERNMENT ||
        job.sector === JobSector.SSC
      ) {
        entry.postTypes.pscAndGovt += 1;
      } else if (
        job.sector === JobSector.POLICE_SECURITY ||
        job.sector === JobSector.DEFENCE_PARAMILITARY
      ) {
        entry.postTypes.policeAndSecurity += 1;
      } else if (job.sector === JobSector.TEACHING_EDUCATION) {
        entry.postTypes.teachingAndEdu += 1;
      } else if (
        job.sector === JobSector.PSU ||
        job.sector === JobSector.PRIVATE_ENGINEERING
      ) {
        entry.postTypes.engineeringAndPsu += 1;
      } else if (
        job.sector === JobSector.BANKING_INSURANCE ||
        job.sector === JobSector.PRIVATE_FINANCE
      ) {
        entry.postTypes.bankingAndFinance += 1;
      } else if (
        job.sector === JobSector.HEALTHCARE_PUBLIC ||
        job.sector === JobSector.PRIVATE_HEALTHCARE
      ) {
        entry.postTypes.healthcare += 1;
      } else if (
        job.sector === JobSector.PRIVATE_IT ||
        job.sector === JobSector.PRIVATE_OTHER
      ) {
        entry.postTypes.privateSector += 1;
      } else {
        entry.postTypes.other += 1;
      }
    }

    return Object.values(statsByState).sort((a, b) => b.totalJobs - a.totalJobs);
  }
}

export const jobsService = new JobsService();
