import 'server-only';
import { connectToDatabase } from '@/server/db/mongoose';
import { getServerEnv } from '@/server/config/env';
import {
  generateRandomToken,
  hashPassword,
  hashToken,
  normalizeEmail,
  verifyPassword,
} from '@/server/auth/crypto';
import {
  PASSWORD_RESET_TTL_MS,
  SESSION_TTL_MS,
} from '@/server/auth/cookies';
import {
  createConflictError,
  createInvalidTokenError,
  createTokenExpiredError,
  createUnauthenticatedError,
} from '@/server/http/errors';
import { sendPasswordResetEmail } from '@/server/email/resend';
import { AuthRepository } from '@/modules/auth/auth.repository';
import type {
  AuthMeResult,
  AuthSessionResult,
} from '@/modules/auth/auth.types';
import type {
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  SignupInput,
} from '@/modules/auth/auth.validation';

// Precomputed dummy scrypt hash used to equalize timing when a login email does not exist
const DUMMY_PASSWORD_HASH =
  'scrypt:00000000000000000000000000000000:' + '0'.repeat(128);

export class AuthService {
  static async signup(input: SignupInput): Promise<{
    response: AuthSessionResult;
    rawSessionToken: string;
    expiresAt: Date;
  }> {
    await connectToDatabase();

    const email = input.email.trim();
    const emailNormalized = normalizeEmail(email);

    const existingUser =
      await AuthRepository.findUserByNormalizedEmail(emailNormalized);

    if (existingUser) {
      throw createConflictError(
        'EMAIL_ALREADY_EXISTS',
        'An account with this email address already exists.',
        { email: 'An account with this email address already exists.' }
      );
    }

    const passwordHash = await hashPassword(input.password);

    let user;
    try {
      user = await AuthRepository.createUser({
        name: input.name.trim(),
        email,
        emailNormalized,
        passwordHash,
      });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: unknown }).code === 11000
      ) {
        throw createConflictError(
          'EMAIL_ALREADY_EXISTS',
          'An account with this email address already exists.',
          { email: 'An account with this email address already exists.' }
        );
      }
      throw error;
    }

    const rawSessionToken = generateRandomToken(32);
    const tokenHash = hashToken(rawSessionToken);
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await AuthRepository.createSession({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    const membership = await AuthRepository.findMembershipByUserId(user._id);

    return {
      response: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
        hasWedding: Boolean(membership),
      },
      rawSessionToken,
      expiresAt,
    };
  }

  static async login(input: LoginInput): Promise<{
    response: AuthSessionResult;
    rawSessionToken: string;
    expiresAt: Date;
  }> {
    await connectToDatabase();

    const emailNormalized = normalizeEmail(input.email);
    const user = await AuthRepository.findUserByNormalizedEmail(emailNormalized);

    if (!user) {
      await verifyPassword(input.password, DUMMY_PASSWORD_HASH);
      throw createUnauthenticatedError('Invalid email or password.');
    }

    const isPasswordValid = await verifyPassword(
      input.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw createUnauthenticatedError('Invalid email or password.');
    }

    const rawSessionToken = generateRandomToken(32);
    const tokenHash = hashToken(rawSessionToken);
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await AuthRepository.createSession({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    const membership = await AuthRepository.findMembershipByUserId(user._id);
    const activeWedding = membership
      ? await AuthRepository.findActiveWeddingById(membership.weddingId)
      : null;

    return {
      response: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
        hasWedding: Boolean(membership && activeWedding),
      },
      rawSessionToken,
      expiresAt,
    };
  }

  static async logout(rawSessionToken: string | null): Promise<void> {
    if (!rawSessionToken) {
      throw createUnauthenticatedError('No active session found.');
    }

    await connectToDatabase();
    const tokenHash = hashToken(rawSessionToken);
    const session = await AuthRepository.findActiveSessionByTokenHash(tokenHash);

    if (!session) {
      throw createUnauthenticatedError('No active session found.');
    }

    await AuthRepository.deleteSessionByTokenHash(tokenHash);
  }

  static async getCurrentUser(
    rawSessionToken: string | null
  ): Promise<AuthMeResult> {
    if (!rawSessionToken) {
      throw createUnauthenticatedError('Authentication is required.');
    }

    await connectToDatabase();

    const tokenHash = hashToken(rawSessionToken);
    const session = await AuthRepository.findActiveSessionByTokenHash(tokenHash);

    if (!session) {
      throw createUnauthenticatedError('Session expired or invalid.');
    }

    const user = await AuthRepository.findUserById(session.userId);
    if (!user) {
      await AuthRepository.deleteSessionByTokenHash(tokenHash);
      throw createUnauthenticatedError('User account no longer exists.');
    }

    // Asynchronously update lastUsedAt
    void AuthRepository.touchSession(session._id);

    const membership = await AuthRepository.findMembershipByUserId(user._id);
    if (!membership) {
      return {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
        membership: null,
        wedding: null,
      };
    }

    const wedding = await AuthRepository.findActiveWeddingById(
      membership.weddingId
    );

    if (!wedding) {
      return {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
        membership: null,
        wedding: null,
      };
    }

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      membership: {
        role: membership.role,
      },
      wedding: {
        id: wedding._id.toString(),
        brideName: wedding.brideName,
        groomName: wedding.groomName,
        weddingDate: wedding.weddingDate,
      },
    };
  }

  static async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    await connectToDatabase();

    const emailNormalized = normalizeEmail(input.email);
    const user = await AuthRepository.findUserByNormalizedEmail(emailNormalized);

    // Per API_DESIGN.md §15: Do not reveal whether the account exists.
    if (!user) {
      return;
    }

    await AuthRepository.invalidateUnusedResetTokensForUser(user._id);

    const rawResetToken = generateRandomToken(32);
    const tokenHash = hashToken(rawResetToken);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

    await AuthRepository.createPasswordResetToken({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    const { NEXT_PUBLIC_APP_URL } = getServerEnv();
    const baseUrl = NEXT_PUBLIC_APP_URL.replace(/\/+$/, '');
    const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(rawResetToken)}`;

    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
    });
  }

  static async resetPassword(input: ResetPasswordInput): Promise<void> {
    await connectToDatabase();

    const tokenHash = hashToken(input.token.trim());
    const resetTokenDoc =
      await AuthRepository.findPasswordResetTokenByHash(tokenHash);

    if (!resetTokenDoc || resetTokenDoc.usedAt) {
      throw createInvalidTokenError(
        'This password reset link is invalid or has already been used.'
      );
    }

    if (resetTokenDoc.expiresAt.getTime() <= Date.now()) {
      throw createTokenExpiredError(
        'This password reset link has expired. Please request a new reset link.'
      );
    }

    const user = await AuthRepository.findUserById(resetTokenDoc.userId);
    if (!user) {
      throw createInvalidTokenError('Account for this reset token was not found.');
    }

    const newPasswordHash = await hashPassword(input.password);

    await AuthRepository.updateUserPassword(user._id, newPasswordHash);
    await AuthRepository.markPasswordResetTokenUsed(resetTokenDoc._id);
    await AuthRepository.deleteAllUserSessions(user._id);
  }
}

