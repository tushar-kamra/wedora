import 'server-only';
import type { ApiErrorCode } from '@/types/api';

export class AppError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, string>;

  constructor(
    code: ApiErrorCode,
    message: string,
    statusCode: number,
    details?: Record<string, string>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function createValidationError(
  message = 'Invalid request data',
  details?: Record<string, string>
): AppError {
  return new AppError('VALIDATION_ERROR', message, 400, details);
}

export function createUnauthenticatedError(
  message = 'Authentication is required'
): AppError {
  return new AppError('UNAUTHENTICATED', message, 401);
}

export function createForbiddenError(
  message = 'You do not have permission to perform this action'
): AppError {
  return new AppError('FORBIDDEN', message, 403);
}

export function createNotFoundError(
  message = 'Requested resource was not found'
): AppError {
  return new AppError('NOT_FOUND', message, 404);
}

export function createConflictError(
  code: ApiErrorCode = 'CONFLICT',
  message = 'Resource state conflict',
  details?: Record<string, string>
): AppError {
  return new AppError(code, message, 409, details);
}

export function createInvalidTokenError(
  message = 'Invalid or already used token'
): AppError {
  return new AppError('INVALID_TOKEN', message, 400);
}

export function createTokenExpiredError(
  message = 'Token has expired'
): AppError {
  return new AppError('TOKEN_EXPIRED', message, 400);
}

export function createRateLimitedError(
  message = 'Too many requests. Please wait a moment and try again.'
): AppError {
  return new AppError('RATE_LIMITED', message, 429);
}

