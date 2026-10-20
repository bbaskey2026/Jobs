import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { AppError } from '../../utils/errors.js';
import { JobSector, VerificationStatus } from '@jobpulse/shared';

const router = Router();

// GET /api/v1/organizations - list verified organizations
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string, 10) || 20);
    const sector = req.query.sector as JobSector | undefined;
    const q = req.query.q as string | undefined;

    const where: any = {};
    if (sector) where.sector = sector;
    if (q) where.name = { contains: q };

    const [total, records] = await Promise.all([
      prisma.organization.count({ where }),
      prisma.organization.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { jobs: { where: { status: 'PUBLISHED' } } }
          }
        }
      })
    ]);

    const data = records.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      sector: org.sector as JobSector,
      category: org.category,
      description: org.description,
      websiteUrl: org.websiteUrl,
      officialNotificationDomain: org.officialNotificationDomain,
      logoUrl: org.logoUrl,
      verificationStatus: org.verificationStatus as VerificationStatus,
      headquartersState: org.headquartersState,
      activeJobsCount: org._count.jobs,
      createdAt: org.createdAt.toISOString()
    }));

    return sendPaginated(res, data, {
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

// GET /api/v1/organizations/:slug - details with active jobs
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug;
    const org = await prisma.organization.findUnique({
      where: { slug },
      include: {
        jobs: {
          where: { status: 'PUBLISHED' },
          orderBy: { publishDate: 'desc' },
          take: 10
        }
      }
    });

    if (!org) throw AppError.notFound('Organization not found');

    return sendSuccess(res, org);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/organizations - Create new organization or company dynamically
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      slug,
      sector,
      category,
      description,
      websiteUrl,
      officialNotificationDomain,
      logoUrl,
      headquartersState,
      verificationStatus
    } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      throw AppError.badRequest('Organization / Company name is required');
    }

    // Auto-generate clean slug if not provided
    const baseSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let finalSlug = baseSlug || 'organization';
    let counter = 1;
    while (await prisma.organization.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    // Auto-extract domain from websiteUrl if not supplied
    let derivedDomain = officialNotificationDomain;
    if (!derivedDomain && websiteUrl) {
      try {
        const parsed = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
        derivedDomain = parsed.hostname.replace(/^www\./, '');
      } catch {
        derivedDomain = undefined;
      }
    }

    const org = await prisma.organization.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        sector: sector || JobSector.CENTRAL_GOVERNMENT,
        category: category || null,
        description: description || null,
        websiteUrl: websiteUrl || null,
        officialNotificationDomain: derivedDomain || null,
        logoUrl: logoUrl || null,
        headquartersState: headquartersState || 'All India',
        verificationStatus: verificationStatus || VerificationStatus.VERIFIED
      }
    });

    return sendSuccess(res, org, 201);
  } catch (error) {
    next(error);
  }
});

export default router;
