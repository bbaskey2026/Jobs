import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/prisma.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { sendSuccess } from '../../utils/response.js';

const router = Router();
router.use(authenticate);

// GET /api/v1/profile - current user full profile
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    let profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        educationRecords: { orderBy: { startYear: 'desc' } },
        experienceRecords: { orderBy: { startDate: 'desc' } }
      }
    });

    if (!profile) {
      profile = await prisma.userProfile.create({
        data: { userId },
        include: {
          educationRecords: true,
          experienceRecords: true
        }
      });
    }

    return sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/profile - update profile
router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const {
      fullName,
      phoneNumber,
      state,
      city,
      currentEducation,
      experienceYears,
      preferredSectors,
      preferredLocations,
      skills,
      bio
    } = req.body;

    if (fullName) {
      await prisma.user.update({
        where: { id: userId },
        data: { fullName }
      });
    }

    const updated = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        phoneNumber,
        state,
        city,
        currentEducation,
        experienceYears,
        preferredSectors: preferredSectors || [],
        preferredLocations: preferredLocations || [],
        skills: skills || [],
        bio
      },
      create: {
        userId,
        phoneNumber,
        state,
        city,
        currentEducation,
        experienceYears,
        preferredSectors: preferredSectors || [],
        preferredLocations: preferredLocations || [],
        skills: skills || [],
        bio
      },
      include: {
        educationRecords: true,
        experienceRecords: true
      }
    });

    return sendSuccess(res, updated, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/profile/education
router.post('/education', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const profile = await prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Profile not found');

    const edu = await prisma.educationRecord.create({
      data: {
        userProfileId: profile.id,
        degree: req.body.degree,
        institution: req.body.institution,
        fieldOfStudy: req.body.fieldOfStudy,
        startYear: req.body.startYear ? parseInt(req.body.startYear, 10) : undefined,
        endYear: req.body.endYear ? parseInt(req.body.endYear, 10) : undefined,
        grade: req.body.grade
      }
    });

    return sendSuccess(res, edu, 'Education record added', 201);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/profile/education/:id
router.delete('/education/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id;

    await prisma.educationRecord.deleteMany({
      where: {
        id,
        profile: { userId }
      }
    });

    return sendSuccess(res, { deleted: true }, 'Education record removed');
  } catch (error) {
    next(error);
  }
});

export default router;
