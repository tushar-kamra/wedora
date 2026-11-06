import 'server-only';
import { getSessionTokenFromCookies } from '@/server/auth/cookies';
import { createForbiddenError } from '@/server/http/errors';
import { AuthService } from '@/modules/auth/auth.service';
import type {
  AuthMeMembershipDTO,
  AuthMeResult,
  AuthMeWeddingDTO,
  AuthUserDTO,
} from '@/modules/auth/auth.types';

export interface AuthenticatedWeddingContext {
  user: AuthUserDTO;
  membership: AuthMeMembershipDTO;
  wedding: AuthMeWeddingDTO;
}

export async function requireAuth(): Promise<AuthMeResult> {
  const rawToken = await getSessionTokenFromCookies();
  return AuthService.getCurrentUser(rawToken);
}

export async function requireWeddingMember(): Promise<AuthenticatedWeddingContext> {
  const auth = await requireAuth();
  if (!auth.wedding || !auth.membership) {
    throw createForbiddenError(
      'You must create or join a wedding workspace before accessing this resource'
    );
  }
  return {
    user: auth.user,
    membership: auth.membership,
    wedding: auth.wedding,
  };
}

export async function requireWeddingAdmin(): Promise<AuthenticatedWeddingContext> {
  const context = await requireWeddingMember();
  if (context.membership.role !== 'ADMIN') {
    throw createForbiddenError('Only Wedding Admins can perform this action');
  }
  return context;
}

export async function getOptionalAuth(): Promise<AuthMeResult | null> {
  try {
    const rawToken = await getSessionTokenFromCookies();
    if (!rawToken) {
      return null;
    }
    return await AuthService.getCurrentUser(rawToken);
  } catch {
    return null;
  }
}

