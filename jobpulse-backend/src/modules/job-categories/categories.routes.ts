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

// POST /api/v1/categories - Create new job category dynamically
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description, iconName } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const baseSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let finalSlug = baseSlug || 'category';
    let counter = 1;
    while (await prisma.jobCategory.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const category = await prisma.jobCategory.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        description: description || null,
        iconName: iconName || 'Work'
      }
    });

    return sendSuccess(res, category, 201);
  } catch (error) {
    next(error);
  }
});

export default router;
