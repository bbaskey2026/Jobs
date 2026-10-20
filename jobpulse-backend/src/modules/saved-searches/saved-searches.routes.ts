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

    const data = searches.map((s) => {
      let parsedParams = {};
      try {
        parsedParams = typeof s.searchParams === 'string' ? JSON.parse(s.searchParams) : (s.searchParams || {});
      } catch {
        parsedParams = {};
      }
      return {
        ...s,
        searchParams: parsedParams
      };
    });

    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { name, searchParams, hasAlert } = req.body;

    const searchParamsString = typeof searchParams === 'string'
      ? searchParams
      : JSON.stringify(searchParams || {});

    const saved = await prisma.savedSearch.create({
      data: {
        userId,
        name: name || 'Custom Job Search',
        searchParams: searchParamsString,
        hasAlert: Boolean(hasAlert)
      }
    });

    let parsedParams = {};
    try {
      parsedParams = JSON.parse(saved.searchParams);
    } catch {
      parsedParams = {};
    }

    return sendSuccess(res, { ...saved, searchParams: parsedParams }, 'Search saved successfully', 201);
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
