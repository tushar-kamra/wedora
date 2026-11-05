import 'server-only';
import { getSessionTokenFromCookies } from '@/server/auth/cookies';
import { AuthService } from '@/modules/auth/auth.service';
import type { AuthMeResult } from '@/modules/auth/auth.types';

export async function requireAuth(): Promise<AuthMeResult> {
  const rawToken = await getSessionTokenFromCookies();
  return AuthService.getCurrentUser(rawToken);
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

