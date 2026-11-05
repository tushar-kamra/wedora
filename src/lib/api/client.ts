import type { ApiErrorPayload, ApiErrorResponse } from '@/types/api';

export class ApiClientError extends Error {
  public readonly code: ApiErrorPayload['code'];
  public readonly statusCode: number;
  public readonly details?: Record<string, string>;

  constructor(payload: ApiErrorPayload, statusCode: number) {
    super(payload.message);
    this.name = 'ApiClientError';
    this.code = payload.code;
    this.statusCode = statusCode;
    this.details = payload.details;
  }
}

export async function apiRequest<TResponse>(
  path: string,
  options: RequestInit = {}
): Promise<TResponse> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(path, {
    ...options,
    headers,
    credentials: 'same-origin',
  });

  let payload: unknown = null;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    payload = await response.json();
  }

  if (!response.ok) {
    const errorEnvelope = payload as ApiErrorResponse | null;
    if (errorEnvelope?.error) {
      throw new ApiClientError(errorEnvelope.error, response.status);
    }
    throw new ApiClientError(
      {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong. Please try again.',
      },
      response.status
    );
  }

  return payload as TResponse;
}

