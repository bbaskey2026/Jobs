import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { sendSuccess } from '../../utils/response.js';

const router = Router();
router.use(authenticate);

// GET /api/v1/notifications
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false }
    });

    return sendSuccess(res, {
      notifications: notifications.map((n) => ({
        ...n,
        createdAt: n.createdAt.toISOString()
      })),
      unreadCount
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/notifications/:id/read
router.patch('/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id;

    await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true }
    });

    return sendSuccess(res, { success: true }, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/notifications/read-all
router.post('/read-all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });

    return sendSuccess(res, { success: true }, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
});

export default router;
