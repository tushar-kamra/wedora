import 'server-only';
import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IPasswordResetTokenDocument extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
}

const passwordResetTokenSchema = new Schema<IPasswordResetTokenDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: 'password_reset_tokens',
    timestamps: { createdAt: true, updatedAt: false },
  }
);

passwordResetTokenSchema.index({ tokenHash: 1 }, { unique: true });
passwordResetTokenSchema.index({ userId: 1 });
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetTokenModel: Model<IPasswordResetTokenDocument> =
  (mongoose.models.PasswordResetToken as Model<IPasswordResetTokenDocument>) ||
  mongoose.model<IPasswordResetTokenDocument>(
    'PasswordResetToken',
    passwordResetTokenSchema
  );

