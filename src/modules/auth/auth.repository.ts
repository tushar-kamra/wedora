import 'server-only';
import type mongoose from 'mongoose';
import { UserModel, type IUserDocument } from '@/modules/auth/user.model';
import { SessionModel, type ISessionDocument } from '@/modules/auth/session.model';
import {
  PasswordResetTokenModel,
  type IPasswordResetTokenDocument,
} from '@/modules/auth/password-reset-token.model';
import {
  WeddingMembershipModel,
  type IWeddingMembershipDocument,
} from '@/modules/members/membership.model';
import { WeddingModel, type IWeddingDocument } from '@/modules/wedding/wedding.model';

export class AuthRepository {
  static async findUserByNormalizedEmail(
    emailNormalized: string
  ): Promise<IUserDocument | null> {
    return UserModel.findOne({ emailNormalized }).exec();
  }

  static async findUserById(
    userId: mongoose.Types.ObjectId | string
  ): Promise<IUserDocument | null> {
    return UserModel.findById(userId).exec();
  }

  static async createUser(params: {
    name: string;
    email: string;
    emailNormalized: string;
    passwordHash: string;
  }): Promise<IUserDocument> {
    return UserModel.create(params);
  }

  static async updateUserPassword(
    userId: mongoose.Types.ObjectId | string,
    passwordHash: string
  ): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { passwordHash } }
    ).exec();
  }

  static async createSession(params: {
    userId: mongoose.Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<ISessionDocument> {
    return SessionModel.create({
      userId: params.userId,
      tokenHash: params.tokenHash,
      expiresAt: params.expiresAt,
      lastUsedAt: new Date(),
    });
  }

  static async findActiveSessionByTokenHash(
    tokenHash: string
  ): Promise<ISessionDocument | null> {
    return SessionModel.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
    }).exec();
  }

  static async touchSession(sessionId: mongoose.Types.ObjectId): Promise<void> {
    await SessionModel.updateOne(
      { _id: sessionId },
      { $set: { lastUsedAt: new Date() } }
    ).exec();
  }

  static async deleteSessionByTokenHash(tokenHash: string): Promise<void> {
    await SessionModel.deleteOne({ tokenHash }).exec();
  }

  static async deleteAllUserSessions(
    userId: mongoose.Types.ObjectId | string
  ): Promise<void> {
    await SessionModel.deleteMany({ userId }).exec();
  }

  static async findMembershipByUserId(
    userId: mongoose.Types.ObjectId | string
  ): Promise<IWeddingMembershipDocument | null> {
    return WeddingMembershipModel.findOne({ userId }).exec();
  }

  static async findActiveWeddingById(
    weddingId: mongoose.Types.ObjectId | string
  ): Promise<IWeddingDocument | null> {
    return WeddingModel.findOne({
      _id: weddingId,
      deletedAt: null,
    }).exec();
  }

  static async invalidateUnusedResetTokensForUser(
    userId: mongoose.Types.ObjectId
  ): Promise<void> {
    await PasswordResetTokenModel.deleteMany({
      userId,
      usedAt: null,
    }).exec();
  }

  static async createPasswordResetToken(params: {
    userId: mongoose.Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<IPasswordResetTokenDocument> {
    return PasswordResetTokenModel.create({
      userId: params.userId,
      tokenHash: params.tokenHash,
      expiresAt: params.expiresAt,
      usedAt: null,
    });
  }

  static async findPasswordResetTokenByHash(
    tokenHash: string
  ): Promise<IPasswordResetTokenDocument | null> {
    return PasswordResetTokenModel.findOne({ tokenHash }).exec();
  }

  static async markPasswordResetTokenUsed(
    tokenId: mongoose.Types.ObjectId
  ): Promise<void> {
    await PasswordResetTokenModel.updateOne(
      { _id: tokenId },
      { $set: { usedAt: new Date() } }
    ).exec();
  }
}

