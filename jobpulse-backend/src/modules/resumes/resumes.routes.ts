import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../../database/prisma.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { storageService } from '../../integrations/storage/storage.service.js';
import { sendSuccess } from '../../utils/response.js';
import { AppError } from '../../utils/errors.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const router = Router();

// POST /api/v1/resumes/upload - upload user resume
router.post('/upload', authenticate, upload.single('resume'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const file = req.file;

    if (!file) {
      throw AppError.badRequest('Resume file is required');
    }

    const saved = await storageService.saveFile(file.buffer, file.originalname, file.mimetype);

    // Save resume record in DB
    const resume = await prisma.resume.create({
      data: {
        userId,
        originalFileName: saved.originalFileName,
        storedFileName: saved.storedFileName,
        fileSizeBytes: saved.fileSizeBytes,
        mimeType: saved.mimeType,
        storagePath: saved.storagePath,
        isPrimary: true
      }
    });

    // Update user profile resumeUrl
    await prisma.userProfile.upsert({
      where: { userId },
      update: {
        resumeUrl: saved.publicUrl,
        resumeFileName: saved.originalFileName
      },
      create: {
        userId,
        resumeUrl: saved.publicUrl,
        resumeFileName: saved.originalFileName
      }
    });

    return sendSuccess(res, resume, 'Resume uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/resumes/my-resume - get current user's primary resume
router.get('/my-resume', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const resume = await prisma.resume.findFirst({
      where: { userId, isPrimary: true },
      orderBy: { createdAt: 'desc' }
    });

    return sendSuccess(res, resume);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/resumes/download/:fileName - access-controlled download
router.get('/download/:fileName', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const fileName = path.basename(req.params.fileName);

    const resume = await prisma.resume.findFirst({
      where: {
        storedFileName: fileName,
        userId
      }
    });

    if (!resume || !fs.existsSync(resume.storagePath)) {
      throw AppError.notFound('Resume file not found or unauthorized access');
    }

    res.setHeader('Content-Type', resume.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${resume.originalFileName}"`);
    fs.createReadStream(resume.storagePath).pipe(res);
  } catch (error) {
    next(error);
  }
});

export default router;
