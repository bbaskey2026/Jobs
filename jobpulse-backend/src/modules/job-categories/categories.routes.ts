import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma.js';
import { sendSuccess } from '../../utils/response.js';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.jobCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { jobs: { where: { status: 'PUBLISHED' } } }
        }
      }
    });

    const data = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      iconName: c.iconName,
      jobCount: c._count.jobs
    }));

    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
});

export default router;
