import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/errors.js';
import { SYSTEM_DEFAULTS } from '@jobpulse/shared';

export interface UploadedFileMetadata {
  originalFileName: string;
  storedFileName: string;
  mimeType: string;
  fileSizeBytes: number;
  storagePath: string;
  publicUrl?: string;
}

export interface StorageService {
  saveFile(buffer: Buffer, originalName: string, mimeType: string): Promise<UploadedFileMetadata>;
  deleteFile(storagePath: string): Promise<boolean>;
  getFilePath(storagePath: string): string;
}

class LocalStorageService implements StorageService {
  private baseDir: string;

  constructor() {
    this.baseDir = path.resolve(env.STORAGE_LOCAL_DIR);
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async saveFile(buffer: Buffer, originalName: string, mimeType: string): Promise<UploadedFileMetadata> {
    // 1. Validate file size
    if (buffer.length > env.STORAGE_MAX_FILE_SIZE_BYTES) {
      throw AppError.badRequest(`File exceeds maximum permitted size of ${env.STORAGE_MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`);
    }

    // 2. Validate MIME type
    if (!SYSTEM_DEFAULTS.ALLOWED_RESUME_TYPES.includes(mimeType as any)) {
      throw AppError.badRequest('Invalid file type. Only PDF and Word documents (.doc, .docx) are accepted.');
    }

    // 3. Generate secure randomized storage key
    const extension = path.extname(originalName) || '.pdf';
    const randomKey = randomBytes(16).toString('hex');
    const storedFileName = `${Date.now()}_${randomKey}${extension}`;
    const targetPath = path.join(this.baseDir, storedFileName);

    await fs.promises.writeFile(targetPath, buffer);

    return {
      originalFileName: path.basename(originalName),
      storedFileName,
      mimeType,
      fileSizeBytes: buffer.length,
      storagePath: targetPath,
      publicUrl: `/api/v1/resumes/download/${storedFileName}`
    };
  }

  async deleteFile(storagePath: string): Promise<boolean> {
    try {
      if (fs.existsSync(storagePath)) {
        await fs.promises.unlink(storagePath);
      }
      return true;
    } catch {
      return false;
    }
  }

  getFilePath(storagePath: string): string {
    return storagePath;
  }
}

export const storageService = new LocalStorageService();
