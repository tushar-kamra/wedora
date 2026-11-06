import { apiRequest } from '@/lib/api/client';
import type {
  AcceptMemberInvitationDTO,
  MemberInvitationDTO,
  PublicMemberInvitationDTO,
  WeddingMemberDTO,
} from '@/modules/members/members.types';
import type {
  InviteMemberInput,
  UpdateMemberRoleInput,
} from '@/modules/members/members.validation';
import type { ApiActionResponse, ApiSuccessResponse } from '@/types/api';

export async function listMembersApi(): Promise<
  ApiSuccessResponse<WeddingMemberDTO[]>
> {
  return apiRequest<ApiSuccessResponse<WeddingMemberDTO[]>>('/api/members', {
    method: 'GET',
  });
}

export async function listPendingInvitationsApi(): Promise<
  ApiSuccessResponse<MemberInvitationDTO[]>
> {
  return apiRequest<ApiSuccessResponse<MemberInvitationDTO[]>>(
    '/api/members/invitations',
    {
      method: 'GET',
    }
  );
}

export async function inviteMemberApi(
  input: InviteMemberInput
): Promise<ApiSuccessResponse<MemberInvitationDTO>> {
  return apiRequest<ApiSuccessResponse<MemberInvitationDTO>>(
    '/api/members/invitations',
    {
      method: 'POST',
      body: JSON.stringify(input),
    }
  );
}

export async function revokeInvitationApi(
  invitationId: string
): Promise<ApiActionResponse> {
  return apiRequest<ApiActionResponse>(
    `/api/members/invitations/${encodeURIComponent(invitationId)}`,
    {
      method: 'DELETE',
    }
  );
}

export async function updateMemberRoleApi(
  membershipId: string,
  input: UpdateMemberRoleInput
): Promise<ApiSuccessResponse<{ membershipId: string; role: 'ADMIN' | 'MANAGER' }>> {
  return apiRequest<
    ApiSuccessResponse<{ membershipId: string; role: 'ADMIN' | 'MANAGER' }>
  >(`/api/members/${encodeURIComponent(membershipId)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function removeMemberApi(
  membershipId: string
): Promise<ApiActionResponse> {
  return apiRequest<ApiActionResponse>(
    `/api/members/${encodeURIComponent(membershipId)}`,
    {
      method: 'DELETE',
    }
  );
}

export async function getPublicMemberInvitationApi(
  token: string
): Promise<ApiSuccessResponse<PublicMemberInvitationDTO>> {
  return apiRequest<ApiSuccessResponse<PublicMemberInvitationDTO>>(
    `/api/public/member-invitations/${encodeURIComponent(token)}`,
    {
      method: 'GET',
    }
  );
}

export async function acceptMemberInvitationApi(
  token: string
): Promise<ApiSuccessResponse<AcceptMemberInvitationDTO>> {
  return apiRequest<ApiSuccessResponse<AcceptMemberInvitationDTO>>(
    `/api/member-invitations/${encodeURIComponent(token)}/accept`,
    {
      method: 'POST',
    }
  );
}

