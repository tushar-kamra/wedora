export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'RATE_LIMITED'
  | 'UPLOAD_ERROR'
  | 'EXTERNAL_SERVICE_ERROR'
  | 'INTERNAL_ERROR'
  | 'EMAIL_ALREADY_EXISTS'
  | 'ALREADY_HAS_WEDDING'
  | 'LAST_ADMIN'
  | 'GUEST_LIMIT_EXCEEDED'
  | 'INVITATION_ALREADY_ACCEPTED'
  | 'INVITATION_EMAIL_MISMATCH';

export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  pagination: ApiPaginationMeta;
}

export interface ApiActionResponse {
  success: true;
}

export interface ApiErrorPayload {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, string>;
}

export interface ApiErrorResponse {
  error: ApiErrorPayload;
}

