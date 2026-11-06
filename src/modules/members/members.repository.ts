import 'server-only';
import mongoose from 'mongoose';
import {
  WeddingMembershipModel,
  type IWeddingMembershipDocument,
  type MemberRole,
} from '@/modules/members/membership.model';
import {
  WeddingMemberInvitationModel,
  type IWeddingMemberInvitationDocument,
} from '@/modules/members/member-invitation.model';
import { UserModel, type IUserDocument } from '@/modules/auth/user.model';
import { WeddingModel, type IWeddingDocument } from '@/modules/wedding/wedding.model';

export interface PopulatedMemberRow {
  membership: IWeddingMembershipDocument;
  user: IUserDocument;
}

export interface PopulatedInvitationRow {
  invitation: IWeddingMemberInvitationDocument;
  invitedByName: string;
}

export const MembersRepository = {
  async listWeddingMembers(weddingId: string): Promise<PopulatedMemberRow[]> {
    const weddingObjectId = new mongoose.Types.ObjectId(weddingId);
    const memberships = await WeddingMembershipModel.find({
      weddingId: weddingObjectId,
    }).sort({ joinedAt: 1 });

    if (memberships.length === 0) return [];

    const userIds = memberships.map((m) => m.userId);
    const users = await UserModel.find({ _id: { $in: userIds } });
    const userMap = new Map<string, IUserDocument>();
    for (const u of users) {
      userMap.set(u._id.toString(), u);
    }

    const rows: PopulatedMemberRow[] = [];
    for (const m of memberships) {
      const u = userMap.get(m.userId.toString());
      if (u) {
        rows.push({ membership: m, user: u });
      }
    }
    return rows;
  },

  async findWeddingById(weddingId: string): Promise<IWeddingDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(weddingId)) return null;
    return WeddingModel.findOne({
      _id: new mongoose.Types.ObjectId(weddingId),
      deletedAt: null,
    });
  },

  async findUserByNormalizedEmail(
    emailNormalized: string
  ): Promise<IUserDocument | null> {
    return UserModel.findOne({ emailNormalized });
  },

  async findMembershipByWeddingAndUser(
    weddingId: string,
    userId: string
  ): Promise<IWeddingMembershipDocument | null> {
    return WeddingMembershipModel.findOne({
      weddingId: new mongoose.Types.ObjectId(weddingId),
      userId: new mongoose.Types.ObjectId(userId),
    });
  },

  async findMembershipByUserId(
    userId: string
  ): Promise<IWeddingMembershipDocument | null> {
    return WeddingMembershipModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });
  },

  async findMembershipByIdInWedding(
    membershipId: string,
    weddingId: string
  ): Promise<IWeddingMembershipDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(membershipId)) return null;
    return WeddingMembershipModel.findOne({
      _id: new mongoose.Types.ObjectId(membershipId),
      weddingId: new mongoose.Types.ObjectId(weddingId),
    });
  },

  async countAdminsInWedding(weddingId: string): Promise<number> {
    return WeddingMembershipModel.countDocuments({
      weddingId: new mongoose.Types.ObjectId(weddingId),
      role: 'ADMIN',
    });
  },

  async updateMembershipRole(
    membershipId: string,
    weddingId: string,
    role: MemberRole
  ): Promise<IWeddingMembershipDocument | null> {
    return WeddingMembershipModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(membershipId),
        weddingId: new mongoose.Types.ObjectId(weddingId),
      },
      { $set: { role } },
      { new: true }
    );
  },

  async deleteMembership(
    membershipId: string,
    weddingId: string
  ): Promise<boolean> {
    const res = await WeddingMembershipModel.deleteOne({
      _id: new mongoose.Types.ObjectId(membershipId),
      weddingId: new mongoose.Types.ObjectId(weddingId),
    });
    return res.deletedCount > 0;
  },

  async findPendingInvitationByEmail(
    weddingId: string,
    emailNormalized: string
  ): Promise<IWeddingMemberInvitationDocument | null> {
    return WeddingMemberInvitationModel.findOne({
      weddingId: new mongoose.Types.ObjectId(weddingId),
      emailNormalized,
      status: 'PENDING',
    });
  },

  async createInvitation(params: {
    weddingId: string;
    email: string;
    emailNormalized: string;
    role: MemberRole;
    tokenHash: string;
    invitedByUserId: string;
    expiresAt: Date;
  }): Promise<IWeddingMemberInvitationDocument> {
    return WeddingMemberInvitationModel.create({
      weddingId: new mongoose.Types.ObjectId(params.weddingId),
      email: params.email,
      emailNormalized: params.emailNormalized,
      role: params.role,
      tokenHash: params.tokenHash,
      status: 'PENDING',
      invitedByUserId: new mongoose.Types.ObjectId(params.invitedByUserId),
      expiresAt: params.expiresAt,
    });
  },

  async listPendingInvitations(
    weddingId: string
  ): Promise<PopulatedInvitationRow[]> {
    const weddingObjectId = new mongoose.Types.ObjectId(weddingId);
    const now = new Date();

    const invitations = await WeddingMemberInvitationModel.find({
      weddingId: weddingObjectId,
      status: 'PENDING',
      expiresAt: { $gt: now },
    }).sort({ createdAt: -1 });

    if (invitations.length === 0) return [];

    const inviterIds = invitations.map((i) => i.invitedByUserId);
    const users = await UserModel.find({ _id: { $in: inviterIds } });
    const userMap = new Map<string, string>();
    for (const u of users) {
      userMap.set(u._id.toString(), u.name);
    }

    return invitations.map((invitation) => ({
      invitation,
      invitedByName:
        userMap.get(invitation.invitedByUserId.toString()) ?? 'Wedding Admin',
    }));
  },

  async revokeInvitation(
    invitationId: string,
    weddingId: string
  ): Promise<IWeddingMemberInvitationDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(invitationId)) return null;
    return WeddingMemberInvitationModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(invitationId),
        weddingId: new mongoose.Types.ObjectId(weddingId),
        status: 'PENDING',
      },
      { $set: { status: 'REVOKED' } },
      { new: true }
    );
  },

  async findInvitationByTokenHash(
    tokenHash: string
  ): Promise<{
    invitation: IWeddingMemberInvitationDocument;
    wedding: IWeddingDocument;
    invitedByName: string;
  } | null> {
    const invitation = await WeddingMemberInvitationModel.findOne({
      tokenHash,
    });
    if (!invitation) return null;

    const [wedding, inviter] = await Promise.all([
      WeddingModel.findOne({
        _id: invitation.weddingId,
        deletedAt: null,
      }),
      UserModel.findById(invitation.invitedByUserId),
    ]);

    if (!wedding) return null;

    return {
      invitation,
      wedding,
      invitedByName: inviter?.name ?? 'Wedding Admin',
    };
  },

  async acceptInvitationWithMembership(params: {
    invitationId: mongoose.Types.ObjectId;
    weddingId: mongoose.Types.ObjectId;
    userId: string;
    role: MemberRole;
  }): Promise<IWeddingMembershipDocument> {
    const userObjectId = new mongoose.Types.ObjectId(params.userId);
    const session = await mongoose.startSession();

    try {
      let createdMembership: IWeddingMembershipDocument | null = null;

      await session.withTransaction(async () => {
        const [membership] = await WeddingMembershipModel.create(
          [
            {
              userId: userObjectId,
              weddingId: params.weddingId,
              role: params.role,
              joinedAt: new Date(),
            },
          ],
          { session }
        );

        await WeddingMemberInvitationModel.updateOne(
          { _id: params.invitationId },
          {
            $set: {
              status: 'ACCEPTED',
              acceptedByUserId: userObjectId,
              acceptedAt: new Date(),
            },
          },
          { session }
        );

        createdMembership = membership;
      });

      if (!createdMembership) {
        throw new Error('Failed to accept invitation');
      }

      return createdMembership;
    } finally {
      await session.endSession();
    }
  },
};

