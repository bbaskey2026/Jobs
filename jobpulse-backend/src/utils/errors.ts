import { ErrorCode, ApiErrorDetail } from '@jobpulse/shared';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode | string;
  public readonly errors?: ApiErrorDetail[];
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    errorCode: ErrorCode | string,
    message: string,
    errors?: ApiErrorDetail[],
    isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errorCode: ErrorCode = ErrorCode.BAD_REQUEST, errors?: ApiErrorDetail[]) {
    return new AppError(400, errorCode, message, errors);
  }

  static unauthorized(message = 'Authentication required', errorCode: ErrorCode = ErrorCode.UNAUTHORIZED) {
    return new AppError(401, errorCode, message);
  }

  static forbidden(message = 'Access forbidden', errorCode: ErrorCode = ErrorCode.FORBIDDEN) {
    return new AppError(403, errorCode, message);
  }

  static notFound(message = 'Resource not found', errorCode: ErrorCode = ErrorCode.NOT_FOUND) {
    return new AppError(404, errorCode, message);
  }

  static conflict(message: string, errorCode: ErrorCode = ErrorCode.CONFLICT) {
    return new AppError(409, errorCode, message);
  }

  static internal(message = 'Internal server error', errorCode: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR) {
    return new AppError(500, errorCode, message, undefined, false);
  }
}
