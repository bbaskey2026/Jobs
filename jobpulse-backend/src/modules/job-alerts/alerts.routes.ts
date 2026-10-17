import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { sendSuccess } from '../../utils/response.js';
import { AppError } from '../../utils/errors.js';
import { AlertFrequency } from '@jobpulse/shared';

const router = Router();
router.use(authenticate);

// GET /api/v1/alerts
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const alerts = await prisma.jobAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { deliveries: true } }
      }
    });

    const data = alerts.map((a) => ({
      id: a.id,
      userId: a.userId,
      title: a.title,
      keywords: a.keywords,
      sector: a.sector,
      categorySlug: a.categorySlug,
      state: a.state,
      qualification: a.qualification,
      frequency: a.frequency as AlertFrequency,
      channels: a.channels,
      isActive: a.isActive,
      lastDeliveredAt: a.lastDeliveredAt?.toISOString() || null,
      matchCount: a._count.deliveries,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString()
    }));

    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/alerts - create alert
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { title, keywords, sector, categorySlug, state, qualification, frequency, channels } = req.body;

    if (!title) {
      throw AppError.badRequest('Alert title is required');
    }

    const alert = await prisma.jobAlert.create({
      data: {
        userId,
        title,
        keywords,
        sector,
        categorySlug,
        state,
        qualification,
        frequency: frequency || AlertFrequency.DAILY_DIGEST,
        channels: channels && channels.length > 0 ? channels : ['EMAIL', 'IN_APP'],
        isActive: true
      }
    });

    return sendSuccess(res, alert, 'Job alert configured successfully', 201);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/alerts/:id - update or toggle active
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id;

    const alert = await prisma.jobAlert.findFirst({ where: { id, userId } });
    if (!alert) throw AppError.notFound('Job alert not found');

    const updated = await prisma.jobAlert.update({
      where: { id },
      data: {
        ...req.body
      }
    });

    return sendSuccess(res, updated, 'Job alert updated');
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/alerts/:id
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id;

    await prisma.jobAlert.deleteMany({
      where: { id, userId }
    });

    return sendSuccess(res, { deleted: true }, 'Job alert deleted');
  } catch (error) {
    next(error);
  }
});

export default router;
