import type { NextRequest } from 'next/server';
import { loginSchema } from '@/modules/auth/auth.validation';
import { AuthService } from '@/modules/auth/auth.service';
import { setSessionCookie } from '@/server/auth/cookies';
import { ok, handleApiError } from '@/server/http/response';
import { assertRateLimit, getClientIp } from '@/server/security/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    assertRateLimit(`auth:login:${clientIp}`, {
      maxRequests: 15,
      windowMs: 15 * 60 * 1000,
    });

    const body = await request.json();
    const input = loginSchema.parse(body);

    const { response, rawSessionToken, expiresAt } =
      await AuthService.login(input);

    await setSessionCookie(rawSessionToken, expiresAt);

    return ok(response);
  } catch (error) {
    return handleApiError(error);
  }
}

