import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { sendSuccess } from '../../utils/response.js';
import { AppError } from '../../utils/errors.js';

const router = Router();
router.use(authenticate);

// GET /api/v1/bookmarks
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const bookmarks = await prisma.jobBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        job: {
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
              select: { id: true, name: true, slug: true }
            }
          }
        }
      }
    });

    const data = bookmarks.map((b) => ({
      id: b.id,
      userId: b.userId,
      jobId: b.jobId,
      createdAt: b.createdAt.toISOString(),
      job: {
        ...b.job,
        publishDate: b.job.publishDate.toISOString(),
        applicationStartDate: b.job.applicationStartDate?.toISOString() || null,
        applicationDeadline: b.job.applicationDeadline?.toISOString() || null,
        createdAt: b.job.createdAt.toISOString(),
        updatedAt: b.job.updatedAt.toISOString(),
        isBookmarked: true
      }
    }));

    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/bookmarks/:jobId - toggle bookmark
router.post('/:jobId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const jobId = req.params.jobId;

    const existing = await prisma.jobBookmark.findUnique({
      where: { userId_jobId: { userId, jobId } }
    });

    if (existing) {
      await prisma.jobBookmark.delete({
        where: { id: existing.id }
      });
      return sendSuccess(res, { bookmarked: false }, 'Bookmark removed');
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw AppError.notFound('Job posting not found');

    const created = await prisma.jobBookmark.create({
      data: { userId, jobId }
    });

    return sendSuccess(res, { bookmarked: true, id: created.id }, 'Job bookmarked successfully', 201);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/bookmarks/:jobId
router.delete('/:jobId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const jobId = req.params.jobId;

    await prisma.jobBookmark.deleteMany({
      where: { userId, jobId }
    });

    return sendSuccess(res, { bookmarked: false }, 'Bookmark removed');
  } catch (error) {
    next(error);
  }
});

export default router;
