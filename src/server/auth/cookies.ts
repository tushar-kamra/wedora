import 'server-only';
import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'wedora_session';
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function setSessionCookie(
  rawToken: string,
  expiresAt: Date
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  return cookie?.value ?? null;
}

