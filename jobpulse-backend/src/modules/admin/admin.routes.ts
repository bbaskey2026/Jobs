import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRoles } from '../../middleware/role.middleware.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { AppError } from '../../utils/errors.js';
import { UserRole, JobStatus, SyncStatus } from '@jobpulse/shared';
import { noAuthService } from '../../integrations/noauth/noauth.service.js';

const router = Router();

// Protect all admin endpoints with ADMIN or MODERATOR role
router.use(authenticate, requireRoles(UserRole.ADMIN, UserRole.MODERATOR));

// GET /api/v1/admin/dashboard - Real database-derived metrics
router.get('/dashboard', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();

    const [
      activeJobsCount,
      upcomingJobsCount,
      expiredJobsCount,
      pendingReviewCount,
      verifiedOrganizationsCount,
      activeSourcesCount,
      totalAlertsActive,
      reportedJobsCount,
      recentRuns
    ] = await Promise.all([
      prisma.job.count({
        where: {
          status: JobStatus.PUBLISHED,
          OR: [{ applicationDeadline: null }, { applicationDeadline: { gte: now } }]
        }
      }),
      prisma.job.count({ where: { status: JobStatus.UPCOMING } }),
      prisma.job.count({
        where: {
          OR: [
            { status: JobStatus.EXPIRED },
            { applicationDeadline: { lt: now } }
          ]
        }
      }),
      prisma.job.count({ where: { status: JobStatus.PENDING_REVIEW } }),
      prisma.organization.count({ where: { verificationStatus: 'VERIFIED' } }),
      prisma.jobSource.count({ where: { isEnabled: true } }),
      prisma.jobAlert.count({ where: { isActive: true } }),
      prisma.reportedJob.count({ where: { status: 'PENDING' } }),
      prisma.jobSourceRun.findMany({
        take: 5,
        orderBy: { startedAt: 'desc' },
        include: { jobSource: { select: { name: true } } }
      })
    ]);

    const metrics = {
      activeJobsCount,
      upcomingJobsCount,
      expiredJobsCount,
      pendingReviewCount,
      verifiedOrganizationsCount,
      activeSourcesCount,
      totalAlertsActive,
      notificationsDeliveredLast24h: 0,
      reportedJobsCount,
      recentSourceRuns: recentRuns.map((r) => ({
        id: r.id,
        jobSourceId: r.jobSourceId,
        jobSourceName: r.jobSource.name,
        status: r.status as SyncStatus,
        recordsFound: r.recordsFound,
        recordsIngested: r.recordsIngested,
        recordsUpdated: r.recordsUpdated,
        recordsSkippedDuplicates: r.recordsSkippedDuplicates,
        errorMessage: r.errorMessage,
        startedAt: r.startedAt.toISOString(),
        finishedAt: r.finishedAt?.toISOString() || null
      }))
    };

    return sendSuccess(res, metrics);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/jobs - list all jobs with status filtering for moderation
router.get('/jobs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string, 10) || 20);
    const status = req.query.status as JobStatus | undefined;

    const where: any = {};
    if (status) where.status = status;

    const [total, records] = await Promise.all([
      prisma.job.count({ where }),
      prisma.job.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          organization: { select: { name: true, sector: true } },
          category: { select: { name: true } }
        }
      })
    ]);

    return sendPaginated(res, records, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/admin/jobs/:id/status - moderate job status
router.patch('/jobs/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (!Object.values(JobStatus).includes(status)) {
      throw AppError.badRequest('Invalid job status');
    }

    const updated = await prisma.job.update({
      where: { id },
      data: { status }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE_JOB_STATUS',
        resourceType: 'JOB',
        details: JSON.stringify({ newStatus: status })
      }
    });

    return sendSuccess(res, updated, 'Job status updated');
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/jobs - manually post a job as recruiter or admin
router.post('/jobs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;

    const job = await prisma.job.create({
      data: {
        title: data.title,
        slug,
        summary: data.summary,
        fullDescription: data.fullDescription || data.summary,
        organizationId: data.organizationId,
        department: data.department,
        sector: data.sector,
        categoryId: data.categoryId,
        employmentType: data.employmentType || 'FULL_TIME',
        vacanciesCount: data.vacanciesCount ? parseInt(data.vacanciesCount, 10) : undefined,
        state: data.state || 'All India',
        city: data.city,
        isAllIndia: Boolean(data.isAllIndia),
        remoteType: data.remoteType || 'ON_SITE',
        qualificationSummary: data.qualificationSummary || 'Refer official notification',
        experienceMin: data.experienceMin ? parseInt(data.experienceMin, 10) : 0,
        experienceMax: data.experienceMax ? parseInt(data.experienceMax, 10) : undefined,
        salaryMin: data.salaryMin ? parseInt(data.salaryMin, 10) : undefined,
        salaryMax: data.salaryMax ? parseInt(data.salaryMax, 10) : undefined,
        salaryCustomDisplay: data.salaryCustomDisplay,
        applicationStartDate: data.applicationStartDate ? new Date(data.applicationStartDate) : undefined,
        applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : undefined,
        officialNotificationUrl: data.officialNotificationUrl,
        applicationUrl: data.applicationUrl,
        status: data.status || JobStatus.PUBLISHED,
        sourceProvider: 'MANUAL_ADMIN',
        isDemoData: Boolean(data.isDemoData)
      }
    });

    return sendSuccess(res, job, 'Job created successfully', 201);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/sources - list external job sources
router.get('/sources', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const sources = await prisma.jobSource.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        runs: {
          take: 3,
          orderBy: { startedAt: 'desc' }
        }
      }
    });
    return sendSuccess(res, sources);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/sources/sync - trigger manual synchronization of a source
router.post('/sources/sync', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.body;
    const sourceCode = code || 'API_NOAUTH';

    const source = await prisma.jobSource.findUnique({ where: { code: sourceCode } });
    if (!source) throw AppError.notFound('Job source not found');

    // Run synchronization pipeline
    const run = await prisma.jobSourceRun.create({
      data: {
        jobSourceId: source.id,
        status: SyncStatus.RUNNING,
        startedAt: new Date()
      }
    });

    try {
      const syncResult = await noAuthService.fetchJobs({ limit: 20 });
      let ingested = 0;
      let duplicates = 0;

      for (const rec of syncResult.recordsNormalized) {
        // Deduplication check
        const existing = await prisma.job.findUnique({
          where: { deduplicationHash: rec.deduplicationHash }
        });

        if (existing) {
          duplicates++;
          continue;
        }

        // Find or create organization
        let org = await prisma.organization.findFirst({
          where: { name: { equals: rec.organizationName } }
        });
        if (!org) {
          const orgSlug = `${rec.organizationName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
          org = await prisma.organization.create({
            data: {
              name: rec.organizationName,
              slug: orgSlug,
              sector: rec.sector,
              websiteUrl: rec.organizationWebsite
            }
          });
        }

        const jobSlug = `${rec.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
        await prisma.job.create({
          data: {
            externalId: rec.externalId,
            deduplicationHash: rec.deduplicationHash,
            title: rec.title,
            slug: jobSlug,
            summary: `${rec.title} recruitment at ${rec.organizationName}. ${rec.qualificationSummary}`,
            fullDescription: `${rec.title} vacancy announced by ${rec.organizationName}. For detailed recruitment notification, qualifications, selection criteria, and exam syllabus, refer to official notification.`,
            organizationId: org.id,
            department: rec.department,
            sector: rec.sector,
            employmentType: rec.employmentType,
            vacanciesCount: rec.vacanciesCount,
            state: rec.state,
            city: rec.city,
            isAllIndia: rec.isAllIndia,
            qualificationSummary: rec.qualificationSummary,
            salaryMin: rec.salaryMin,
            salaryMax: rec.salaryMax,
            salaryCustomDisplay: rec.salaryCustomDisplay,
            publishDate: rec.publishDate,
            applicationDeadline: rec.applicationDeadline,
            status: JobStatus.PUBLISHED,
            sourceProvider: rec.sourceProvider,
            officialNotificationUrl: rec.officialNotificationUrl,
            applicationUrl: rec.applicationUrl
          }
        });

        ingested++;
      }

      await prisma.jobSourceRun.update({
        where: { id: run.id },
        data: {
          status: SyncStatus.SUCCESS,
          recordsFound: syncResult.recordsFetched,
          recordsIngested: ingested,
          recordsSkippedDuplicates: duplicates,
          finishedAt: new Date()
        }
      });

      await prisma.jobSource.update({
        where: { id: source.id },
        data: {
          lastRunStatus: SyncStatus.SUCCESS,
          lastRunAt: new Date(),
          consecutiveFailures: 0
        }
      });

      return sendSuccess(res, {
        recordsFound: syncResult.recordsFetched,
        recordsIngested: ingested,
        recordsSkippedDuplicates: duplicates
      }, 'Source synchronization completed');
    } catch (syncErr: any) {
      await prisma.jobSourceRun.update({
        where: { id: run.id },
        data: {
          status: SyncStatus.FAILED,
          errorMessage: syncErr.message,
          finishedAt: new Date()
        }
      });
      throw syncErr;
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/reports - list reported jobs
router.get('/reports', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await prisma.reportedJob.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        job: { select: { id: true, title: true, slug: true, status: true } },
        user: { select: { id: true, email: true, fullName: true } }
      }
    });
    return sendSuccess(res, reports);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/audit-logs - view security and activity audit logs
router.get('/audit-logs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string, 10) || 20);

    const [total, records] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, fullName: true } } }
      })
    ]);

    return sendPaginated(res, records, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    });
  } catch (error) {
    next(error);
  }
});

export default router;
