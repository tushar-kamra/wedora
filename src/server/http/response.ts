import 'server-only';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from '@/server/http/errors';
import type {
  ApiActionResponse,
  ApiErrorResponse,
  ApiPaginatedResponse,
  ApiPaginationMeta,
  ApiSuccessResponse,
} from '@/types/api';

export function ok<T>(
  data: T,
  status = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ data }, { status });
}

export function created<T>(data: T): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ data }, { status: 201 });
}

export function paginated<T>(
  data: T[],
  pagination: ApiPaginationMeta
): NextResponse<ApiPaginatedResponse<T>> {
  return NextResponse.json({ data, pagination }, { status: 200 });
}

export function actionOk(status = 200): NextResponse<ApiActionResponse> {
  return NextResponse.json({ success: true }, { status });
}

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const details: Record<string, string> = {};
    for (const issue of error.issues) {
      const pathKey = issue.path.join('.') || 'form';
      if (!details[pathKey]) {
        details[pathKey] = issue.message;
      }
    }

    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details,
        },
      },
      { status: 400 }
    );
  }

  // Handle MongoDB duplicate key errors (E11000)
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 11000
  ) {
    return NextResponse.json(
      {
        error: {
          code: 'CONFLICT',
          message: 'A record with these details already exists.',
        },
      },
      { status: 409 }
    );
  }

  console.error('[API Error]', error);

  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred. Please try again.',
      },
    },
    { status: 500 }
  );
}

