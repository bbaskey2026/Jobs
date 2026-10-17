import { Response } from 'express';
import {
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
  ApiErrorResponse,
  ApiErrorDetail,
  ErrorCode
} from '@jobpulse/shared';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    requestId: res.locals.requestId,
    timestamp: new Date().toISOString()
  };
  return res.status(statusCode).json(response);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  statusCode = 200
): Response {
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination,
    requestId: res.locals.requestId,
    timestamp: new Date().toISOString()
  };
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  statusCode: number,
  errorCode: ErrorCode | string,
  message: string,
  errors?: ApiErrorDetail[]
): Response {
  const response: ApiErrorResponse = {
    success: false,
    statusCode,
    errorCode,
    message,
    errors,
    requestId: res.locals.requestId,
    timestamp: new Date().toISOString()
  };
  return res.status(statusCode).json(response);
}
