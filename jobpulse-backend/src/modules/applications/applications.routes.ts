import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { sendSuccess } from '../../utils/response.js';
import { AppError } from '../../utils/errors.js';
import { ApplicationStatus, JobStatus } from '@jobpulse/shared';

const router = Router();
router.use(authenticate);

// GET /api/v1/applications - list user applications
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const records = await prisma.applicationRecord.findMany({
      where: { userId },
      orderBy: { appliedDate: 'desc' },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            applicationUrl: true,
            applicationDeadline: true,
            status: true,
            organization: { select: { name: true } }
          }
        }
      }
    });

    const data = records.map((r) => ({
      id: r.id,
      userId: r.userId,
      jobId: r.jobId,
      status: r.status as ApplicationStatus,
      isExternalLinkClick: r.isExternalLinkClick,
      appliedDate: r.appliedDate.toISOString(),
      notes: r.notes,
      job: {
        id: r.job.id,
        title: r.job.title,
        organizationName: r.job.organization.name,
        applicationUrl: r.job.applicationUrl,
        applicationDeadline: r.job.applicationDeadline?.toISOString() || null,
        status: r.job.status as JobStatus
      }
    }));

    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/applications/track-outbound - track external application link click
router.post('/track-outbound', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { jobId, notes } = req.body;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw AppError.notFound('Job posting not found');

    const record = await prisma.applicationRecord.create({
      data: {
        userId,
        jobId,
        status: ApplicationStatus.OUTBOUND_CLICK,
        isExternalLinkClick: true,
        notes: notes || 'Redirected to official application portal'
      }
    });

    return sendSuccess(
      res,
      record,
      'Outbound application link click tracked successfully',
      201
    );
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/applications/:id - update self-reported application status
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id;
    const { status, notes } = req.body;

    const record = await prisma.applicationRecord.findFirst({ where: { id, userId } });
    if (!record) throw AppError.notFound('Application record not found');

    const updated = await prisma.applicationRecord.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {})
      }
    });

    return sendSuccess(res, updated, 'Application status updated');
  } catch (error) {
    next(error);
  }
});

export default router;
