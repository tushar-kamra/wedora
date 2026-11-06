import 'server-only';
import { connectToDatabase } from '@/server/db/mongoose';
import { getServerEnv } from '@/server/config/env';
import {
  generateRandomToken,
  hashToken,
  normalizeEmail,
} from '@/server/auth/crypto';
import {
  AppError,
  createConflictError,
  createInvalidTokenError,
  createNotFoundError,
  createTokenExpiredError,
} from '@/server/http/errors';
import { sendMemberInvitationEmail } from '@/server/email/resend';
import { MembersRepository } from '@/modules/members/members.repository';
import {
  inviteMemberSchema,
  updateMemberRoleSchema,
  validateMembersPayload,
} from '@/modules/members/members.validation';
import type {
  AcceptMemberInvitationDTO,
  MemberInvitationDTO,
  PublicMemberInvitationDTO,
  WeddingMemberDTO,
} from '@/modules/members/members.types';
import type { AuthUserDTO } from '@/modules/auth/auth.types';

const INVITATION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const MembersService = {
  async listMembers(weddingId: string): Promise<WeddingMemberDTO[]> {
    await connectToDatabase();

    const [rows, wedding] = await Promise.all([
      MembersRepository.listWeddingMembers(weddingId),
      MembersRepository.findWeddingById(weddingId),
    ]);

    const creatorId = wedding?.createdByUserId.toString();

    return rows.map(({ membership, user }) => ({
      membershipId: membership._id.toString(),
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      role: membership.role,
      joinedAt: membership.joinedAt.toISOString(),
      isPrimaryCreator: creatorId === user._id.toString(),
    }));
  },

  async inviteMember(params: {
    weddingId: string;
    invitedByUserId: string;
    invitedByName: string;
    payload: unknown;
  }): Promise<MemberInvitationDTO> {
    const input = validateMembersPayload(inviteMemberSchema, params.payload);
    await connectToDatabase();

    const wedding = await MembersRepository.findWeddingById(params.weddingId);
    if (!wedding) {
      throw createNotFoundError('Wedding workspace not found');
    }

    const emailNormalized = normalizeEmail(input.email);

    // 1. Check if this email already belongs to an active member of this wedding
    const existingUser =
      await MembersRepository.findUserByNormalizedEmail(emailNormalized);
    if (existingUser) {
      const existingMembership =
        await MembersRepository.findMembershipByWeddingAndUser(
          params.weddingId,
          existingUser._id.toString()
        );
      if (existingMembership) {
        throw createConflictError(
          'CONFLICT',
          'This user is already an active member of your wedding workspace.'
        );
      }
    }

    // 2. Check if there is an active pending invitation for this email
    const existingPending =
      await MembersRepository.findPendingInvitationByEmail(
        params.weddingId,
        emailNormalized
      );

    const now = new Date();
    if (existingPending) {
      if (existingPending.expiresAt > now) {
        throw createConflictError(
          'CONFLICT',
          'A pending invitation already exists for this email address.'
        );
      }
      // If the prior PENDING invitation has already expired, mark it REVOKED so the partial unique index allows a fresh one
      await MembersRepository.revokeInvitation(
        existingPending._id.toString(),
        params.weddingId
      );
    }

    // 3. Create 32-byte random token + hash
    const rawToken = generateRandomToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(now.getTime() + INVITATION_EXPIRY_MS);

    const invitation = await MembersRepository.createInvitation({
      weddingId: params.weddingId,
      email: input.email.trim(),
      emailNormalized,
      role: input.role,
      tokenHash,
      invitedByUserId: params.invitedByUserId,
      expiresAt,
    });

    const env = getServerEnv();
    const acceptUrl = `${env.NEXT_PUBLIC_APP_URL}/member-invitations/${rawToken}`;

    // 4. Send invitation email via Resend
    await sendMemberInvitationEmail({
      to: invitation.email,
      invitedByName: params.invitedByName,
      brideName: wedding.brideName,
      groomName: wedding.groomName,
      role: invitation.role,
      acceptUrl,
    });

    return {
      id: invitation._id.toString(),
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      invitedBy: {
        id: params.invitedByUserId,
        name: params.invitedByName,
      },
      expiresAt: invitation.expiresAt.toISOString(),
      createdAt: invitation.createdAt.toISOString(),
      acceptUrl,
    };
  },

  async listPendingInvitations(
    weddingId: string
  ): Promise<MemberInvitationDTO[]> {
    await connectToDatabase();

    const rows = await MembersRepository.listPendingInvitations(weddingId);

    return rows.map(({ invitation, invitedByName }) => ({
      id: invitation._id.toString(),
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      invitedBy: {
        id: invitation.invitedByUserId.toString(),
        name: invitedByName,
      },
      expiresAt: invitation.expiresAt.toISOString(),
      createdAt: invitation.createdAt.toISOString(),
    }));
  },

  async revokeInvitation(
    weddingId: string,
    invitationId: string
  ): Promise<void> {
    await connectToDatabase();

    const revoked = await MembersRepository.revokeInvitation(
      invitationId,
      weddingId
    );
    if (!revoked) {
      throw createNotFoundError('Pending invitation not found');
    }
  },

  async getPublicInvitation(
    rawToken: string,
    isAuthenticated: boolean
  ): Promise<PublicMemberInvitationDTO> {
    if (!rawToken || rawToken.trim().length < 8) {
      throw createInvalidTokenError('Invalid invitation link');
    }

    await connectToDatabase();

    const tokenHash = hashToken(rawToken.trim());
    const found = await MembersRepository.findInvitationByTokenHash(tokenHash);
    if (!found) {
      throw createInvalidTokenError('Invitation link is invalid or not found');
    }

    const { invitation, wedding, invitedByName } = found;
    const now = new Date();
    const isExpired =
      invitation.status === 'PENDING' && invitation.expiresAt <= now;

    return {
      email: invitation.email,
      role: invitation.role,
      status: isExpired ? 'EXPIRED' : invitation.status,
      expiresAt: invitation.expiresAt.toISOString(),
      invitedByName,
      wedding: {
        brideName: wedding.brideName,
        groomName: wedding.groomName,
        title: wedding.title ?? `${wedding.brideName} & ${wedding.groomName}`,
        weddingDate: wedding.weddingDate,
        city: wedding.location?.city ?? null,
      },
      requiresLogin: !isAuthenticated,
    };
  },

  async acceptInvitation(
    rawToken: string,
    currentUser: AuthUserDTO
  ): Promise<AcceptMemberInvitationDTO> {
    if (!rawToken || rawToken.trim().length < 8) {
      throw createInvalidTokenError('Invalid invitation token');
    }

    await connectToDatabase();

    const tokenHash = hashToken(rawToken.trim());
    const found = await MembersRepository.findInvitationByTokenHash(tokenHash);
    if (!found) {
      throw createInvalidTokenError('Invitation link is invalid or not found');
    }

    const { invitation } = found;

    if (invitation.status === 'ACCEPTED') {
      throw createConflictError(
        'INVITATION_ALREADY_ACCEPTED',
        'This invitation has already been accepted.'
      );
    }

    if (invitation.status === 'REVOKED') {
      throw createInvalidTokenError('This invitation has been revoked.');
    }

    if (invitation.expiresAt <= new Date()) {
      throw createTokenExpiredError('This invitation link has expired.');
    }

    const userNormalizedEmail = normalizeEmail(currentUser.email);
    if (userNormalizedEmail !== invitation.emailNormalized) {
      throw new AppError(
        'INVITATION_EMAIL_MISMATCH',
        `This invitation was sent to ${invitation.email}, but you are signed in as ${currentUser.email}.`,
        403
      );
    }

    const existingMembership =
      await MembersRepository.findMembershipByUserId(currentUser.id);
    if (existingMembership) {
      throw createConflictError(
        'ALREADY_HAS_WEDDING',
        'You already belong to a wedding workspace.'
      );
    }

    const membership = await MembersRepository.acceptInvitationWithMembership({
      invitationId: invitation._id,
      weddingId: invitation.weddingId,
      userId: currentUser.id,
      role: invitation.role,
    });

    return {
      weddingId: membership.weddingId.toString(),
      role: membership.role,
    };
  },

  async updateMemberRole(
    weddingId: string,
    membershipId: string,
    payload: unknown
  ): Promise<{ membershipId: string; role: 'ADMIN' | 'MANAGER' }> {
    const input = validateMembersPayload(updateMemberRoleSchema, payload);
    await connectToDatabase();

    const target = await MembersRepository.findMembershipByIdInWedding(
      membershipId,
      weddingId
    );
    if (!target) {
      throw createNotFoundError('Wedding member not found');
    }

    if (target.role === 'ADMIN' && input.role === 'MANAGER') {
      const adminCount = await MembersRepository.countAdminsInWedding(weddingId);
      if (adminCount <= 1) {
        throw createConflictError(
          'LAST_ADMIN',
          'At least one Admin is required in the wedding workspace.'
        );
      }
    }

    const updated = await MembersRepository.updateMembershipRole(
      membershipId,
      weddingId,
      input.role
    );
    if (!updated) {
      throw createNotFoundError('Wedding member not found');
    }

    return {
      membershipId: updated._id.toString(),
      role: updated.role,
    };
  },

  async removeMember(weddingId: string, membershipId: string): Promise<void> {
    await connectToDatabase();

    const target = await MembersRepository.findMembershipByIdInWedding(
      membershipId,
      weddingId
    );
    if (!target) {
      throw createNotFoundError('Wedding member not found');
    }

    if (target.role === 'ADMIN') {
      const adminCount = await MembersRepository.countAdminsInWedding(weddingId);
      if (adminCount <= 1) {
        throw createConflictError(
          'LAST_ADMIN',
          'Cannot remove the last Admin from the wedding workspace.'
        );
      }
    }

    const deleted = await MembersRepository.deleteMembership(
      membershipId,
      weddingId
    );
    if (!deleted) {
      throw createNotFoundError('Wedding member not found');
    }
  },
};
