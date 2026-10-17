import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { UserRole, ErrorCode } from '@jobpulse/shared';
import { prisma } from '../../database/prisma.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/errors.js';
import { emailService } from '../../integrations/email/email.service.js';
import { logger } from '../../utils/logger.js';

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    fullName: string;
    role?: UserRole;
    phoneNumber?: string;
  }) {
    const normalizedEmail = data.email.toLowerCase().trim();

    // 1. Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });
    if (existing) {
      throw AppError.conflict('An account with this email address already exists', ErrorCode.EMAIL_ALREADY_EXISTS);
    }

    // 2. Hash password with Argon2id
    const passwordHash = await argon2.hash(data.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3
    });

    // 3. Create verification token
    const verificationToken = randomBytes(32).toString('hex');

    // 4. Create User and linked UserProfile
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        fullName: data.fullName.trim(),
        role: data.role || UserRole.JOB_SEEKER,
        emailVerificationToken: verificationToken,
        profile: {
          create: {
            phoneNumber: data.phoneNumber
          }
        }
      },
      include: {
        profile: true
      }
    });

    // 5. Send verification email asynchronously
    emailService.sendVerificationEmail(user.email, user.fullName, verificationToken).catch((err) => {
      logger.warn({ err }, 'Failed to queue verification email');
    });

    return this.generateAuthResponse(user);
  }

  async login(credentials: { email: string; password: string }) {
    const normalizedEmail = credentials.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true }
    });

    if (!user || !user.isActive) {
      throw AppError.unauthorized('Invalid email or password', ErrorCode.INVALID_CREDENTIALS);
    }

    const isValidPassword = await argon2.verify(user.passwordHash, credentials.password);
    if (!isValidPassword) {
      throw AppError.unauthorized('Invalid email or password', ErrorCode.INVALID_CREDENTIALS);
    }

    return this.generateAuthResponse(user);
  }

  async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token }
    });

    if (!user) {
      throw AppError.badRequest('Invalid or expired email verification token', ErrorCode.TOKEN_INVALID);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null
      }
    });

    return { message: 'Email verified successfully. You may now sign in.' };
  }

  async forgotPassword(email: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // Prevent account enumeration by always returning generic success
    if (user && user.isActive) {
      const resetToken = randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: expires
        }
      });

      emailService.sendPasswordResetEmail(user.email, user.fullName, resetToken).catch((err) => {
        logger.warn({ err }, 'Failed to queue password reset email');
      });
    }

    return { message: 'If an account exists with that email, instructions have been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() }
      }
    });

    if (!user) {
      throw AppError.badRequest('Invalid or expired password reset link', ErrorCode.TOKEN_EXPIRED);
    }

    const passwordHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    return { message: 'Password has been updated successfully. You may now log in.' };
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true
      }
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }

    const parseArr = (val: any) => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string' && val.startsWith('[')) {
        try { return JSON.parse(val); } catch { return []; }
      }
      return [];
    };

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role as UserRole,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      profile: user.profile
        ? {
            id: user.profile.id,
            userId: user.profile.userId,
            phoneNumber: user.profile.phoneNumber,
            state: user.profile.state,
            city: user.profile.city,
            currentEducation: user.profile.currentEducation,
            experienceYears: user.profile.experienceYears,
            preferredSectors: parseArr(user.profile.preferredSectors),
            preferredLocations: parseArr(user.profile.preferredLocations),
            skills: parseArr(user.profile.skills),
            bio: user.profile.bio,
            resumeUrl: user.profile.resumeUrl,
            resumeFileName: user.profile.resumeFileName
          }
        : null
    };
  }

  private generateAuthResponse(user: any) {
    const parseArr = (val: any) => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string' && val.startsWith('[')) {
        try { return JSON.parse(val); } catch { return []; }
      }
      return [];
    };

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any
    });

    const refreshToken = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as any
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role as UserRole,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        profile: user.profile
          ? {
              id: user.profile.id,
              userId: user.profile.userId,
              phoneNumber: user.profile.phoneNumber,
              state: user.profile.state,
              city: user.profile.city,
              currentEducation: user.profile.currentEducation,
              experienceYears: user.profile.experienceYears,
              preferredSectors: parseArr(user.profile.preferredSectors),
              preferredLocations: parseArr(user.profile.preferredLocations),
              skills: parseArr(user.profile.skills),
              bio: user.profile.bio,
              resumeUrl: user.profile.resumeUrl,
              resumeFileName: user.profile.resumeFileName
            }
          : null
      },
      accessToken,
      refreshToken,
      expiresInSeconds: 86400
    };
  }
}

export const authService = new AuthService();
