import 'server-only';
import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { MemberRole } from '@/modules/members/membership.model';

export type MemberInvitationStatus = 'PENDING' | 'ACCEPTED' | 'REVOKED';

export interface IWeddingMemberInvitationDocument extends Document {
  _id: mongoose.Types.ObjectId;
  weddingId: mongoose.Types.ObjectId;
  email: string;
  emailNormalized: string;
  role: MemberRole;
  tokenHash: string;
  status: MemberInvitationStatus;
  invitedByUserId: mongoose.Types.ObjectId;
  acceptedByUserId?: mongoose.Types.ObjectId | null;
  expiresAt: Date;
  acceptedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const weddingMemberInvitationSchema =
  new Schema<IWeddingMemberInvitationDocument>(
    {
      weddingId: {
        type: Schema.Types.ObjectId,
        ref: 'Wedding',
        required: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        maxlength: 254,
      },
      emailNormalized: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 254,
      },
      role: {
        type: String,
        enum: ['ADMIN', 'MANAGER'],
        required: true,
      },
      tokenHash: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REVOKED'],
        default: 'PENDING',
        required: true,
      },
      invitedByUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      acceptedByUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      expiresAt: {
        type: Date,
        required: true,
      },
      acceptedAt: {
        type: Date,
        default: null,
      },
    },
    {
      collection: 'wedding_member_invitations',
      timestamps: true,
    }
  );

weddingMemberInvitationSchema.index({ tokenHash: 1 }, { unique: true });
weddingMemberInvitationSchema.index({ weddingId: 1, status: 1 });
weddingMemberInvitationSchema.index({ emailNormalized: 1 });
weddingMemberInvitationSchema.index({ expiresAt: 1 });
weddingMemberInvitationSchema.index(
  { weddingId: 1, emailNormalized: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'PENDING' },
  }
);

export const WeddingMemberInvitationModel: Model<IWeddingMemberInvitationDocument> =
  (mongoose.models
    .WeddingMemberInvitation as Model<IWeddingMemberInvitationDocument>) ||
  mongoose.model<IWeddingMemberInvitationDocument>(
    'WeddingMemberInvitation',
    weddingMemberInvitationSchema
  );

