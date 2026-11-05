import 'server-only';
import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type MemberRole = 'ADMIN' | 'MANAGER';

export interface IWeddingMembershipDocument extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  weddingId: mongoose.Types.ObjectId;
  role: MemberRole;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const weddingMembershipSchema = new Schema<IWeddingMembershipDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    weddingId: {
      type: Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'MANAGER'],
      required: true,
    },
    joinedAt: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    collection: 'wedding_memberships',
    timestamps: true,
  }
);

weddingMembershipSchema.index({ userId: 1 }, { unique: true });
weddingMembershipSchema.index({ weddingId: 1, userId: 1 }, { unique: true });
weddingMembershipSchema.index({ weddingId: 1, role: 1 });

export const WeddingMembershipModel: Model<IWeddingMembershipDocument> =
  (mongoose.models.WeddingMembership as Model<IWeddingMembershipDocument>) ||
  mongoose.model<IWeddingMembershipDocument>(
    'WeddingMembership',
    weddingMembershipSchema
  );

