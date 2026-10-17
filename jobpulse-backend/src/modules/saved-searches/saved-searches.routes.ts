import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { sendSuccess } from '../../utils/response.js';

const router = Router();
router.use(authenticate);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const searches = await prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return sendSuccess(res, searches);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { name, searchParams, hasAlert } = req.body;

    const saved = await prisma.savedSearch.create({
      data: {
        userId,
        name: name || 'Custom Job Search',
        searchParams: searchParams || {},
        hasAlert: Boolean(hasAlert)
      }
    });

    return sendSuccess(res, saved, 'Search saved successfully', 201);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id;

    await prisma.savedSearch.deleteMany({
      where: { id, userId }
    });

    return sendSuccess(res, { deleted: true }, 'Saved search deleted');
  } catch (error) {
    next(error);
  }
});

export default router;
