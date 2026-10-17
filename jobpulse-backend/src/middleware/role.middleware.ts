import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@jobpulse/shared';
import { AppError } from '../utils/errors.js';

export function requireRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication is required to access this resource'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        AppError.forbidden(`Access forbidden. Required role: ${roles.join(' or ')}`)
      );
    }

    next();
  };
}
