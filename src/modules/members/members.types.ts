import type { MemberRole } from '@/modules/members/membership.model';
import type { MemberInvitationStatus } from '@/modules/members/member-invitation.model';

export interface WeddingMemberDTO {
  membershipId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: MemberRole;
  joinedAt: string;
  isPrimaryCreator?: boolean;
}

export interface MemberInvitationDTO {
  id: string;
  email: string;
  role: MemberRole;
  status: MemberInvitationStatus;
  invitedBy: {
    id: string;
    name: string;
  };
  expiresAt: string;
  createdAt: string;
  acceptUrl?: string;
}

export interface PublicMemberInvitationDTO {
  email: string;
  role: MemberRole;
  status: MemberInvitationStatus | 'EXPIRED';
  expiresAt: string;
  invitedByName: string;
  wedding: {
    brideName: string;
    groomName: string;
    title: string | null;
    weddingDate: string;
    city: string | null;
  };
  requiresLogin: boolean;
}

export interface AcceptMemberInvitationDTO {
  weddingId: string;
  role: MemberRole;
}

