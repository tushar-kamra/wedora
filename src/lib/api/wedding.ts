import { apiRequest } from '@/lib/api/client';
import type {
  CreateWeddingDTO,
  WeddingDashboardDTO,
  WeddingDetailDTO,
} from '@/modules/wedding/wedding.types';
import type {
  CreateWeddingInput,
  UpdateWeddingInput,
} from '@/modules/wedding/wedding.validation';
import type { ApiSuccessResponse } from '@/types/api';

export async function createWeddingApi(
  input: CreateWeddingInput
): Promise<ApiSuccessResponse<CreateWeddingDTO>> {
  return apiRequest<ApiSuccessResponse<CreateWeddingDTO>>('/api/wedding', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getWeddingApi(): Promise<
  ApiSuccessResponse<WeddingDetailDTO>
> {
  return apiRequest<ApiSuccessResponse<WeddingDetailDTO>>('/api/wedding', {
    method: 'GET',
  });
}

export async function updateWeddingApi(
  input: UpdateWeddingInput
): Promise<ApiSuccessResponse<WeddingDetailDTO>> {
  return apiRequest<ApiSuccessResponse<WeddingDetailDTO>>('/api/wedding', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function getDashboardApi(): Promise<
  ApiSuccessResponse<WeddingDashboardDTO>
> {
  return apiRequest<ApiSuccessResponse<WeddingDashboardDTO>>('/api/dashboard', {
    method: 'GET',
  });
}

