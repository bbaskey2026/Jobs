import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ErrorCode, ApiErrorDetail } from '@jobpulse/shared';
import { AppError } from '../utils/errors.js';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export function errorHandlerMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const requestId = res.locals.requestId;

  // 1. Domain AppError
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error({ err, requestId }, 'Non-operational AppError occurred');
    }
    return sendError(res, err.statusCode, err.errorCode, err.message, err.errors);
  }

  // 2. Zod Validation Error
  if (err instanceof ZodError) {
    const errorDetails: ApiErrorDetail[] = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
      code: e.code
    }));
    return sendError(
      res,
      400,
      ErrorCode.VALIDATION_ERROR,
      'Request validation failed',
      errorDetails
    );
  }

  // 3. Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.warn({ errCode: err.code, meta: err.meta, requestId }, 'Prisma known error');
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[]) || [];
      return sendError(
        res,
        409,
        ErrorCode.CONFLICT,
        `Unique constraint failed on field(s): ${target.join(', ')}`
      );
    }
    if (err.code === 'P2025') {
      return sendError(res, 404, ErrorCode.NOT_FOUND, 'Requested record does not exist');
    }
  }

  // 4. Unhandled Internal Server Errors
  logger.error({ err, requestId }, 'Unhandled exception');
  const message =
    env.NODE_ENV === 'production'
      ? 'An unexpected internal error occurred'
      : err.message || 'Internal server error';

  return sendError(res, 500, ErrorCode.INTERNAL_SERVER_ERROR, message);
}
