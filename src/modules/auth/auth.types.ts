import type { MemberRole } from '@/modules/members/membership.model';

export interface AuthUserDTO {
  id: string;
  name: string;
  email: string;
}

export interface AuthSessionResult {
  user: AuthUserDTO;
  hasWedding: boolean;
}

export interface AuthMeMembershipDTO {
  role: MemberRole;
}

export interface AuthMeWeddingDTO {
  id: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
}

export interface AuthMeResult {
  user: AuthUserDTO;
  membership: AuthMeMembershipDTO | null;
  wedding: AuthMeWeddingDTO | null;
}

