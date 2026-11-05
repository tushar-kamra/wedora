import { apiRequest } from '@/lib/api/client';
import type {
  AuthMeResult,
  AuthSessionResult,
} from '@/modules/auth/auth.types';
import type {
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  SignupInput,
} from '@/modules/auth/auth.validation';
import type { ApiActionResponse, ApiSuccessResponse } from '@/types/api';

export async function signupApi(
  input: SignupInput
): Promise<ApiSuccessResponse<AuthSessionResult>> {
  return apiRequest<ApiSuccessResponse<AuthSessionResult>>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function loginApi(
  input: LoginInput
): Promise<ApiSuccessResponse<AuthSessionResult>> {
  return apiRequest<ApiSuccessResponse<AuthSessionResult>>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function logoutApi(): Promise<ApiActionResponse> {
  return apiRequest<ApiActionResponse>('/api/auth/logout', {
    method: 'POST',
  });
}

export async function getMeApi(): Promise<ApiSuccessResponse<AuthMeResult>> {
  return apiRequest<ApiSuccessResponse<AuthMeResult>>('/api/auth/me', {
    method: 'GET',
  });
}

export async function forgotPasswordApi(
  input: ForgotPasswordInput
): Promise<ApiActionResponse> {
  return apiRequest<ApiActionResponse>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function resetPasswordApi(
  input: ResetPasswordInput
): Promise<ApiActionResponse> {
  return apiRequest<ApiActionResponse>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

