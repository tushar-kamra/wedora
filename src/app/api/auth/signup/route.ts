import type { NextRequest } from 'next/server';
import { signupSchema } from '@/modules/auth/auth.validation';
import { AuthService } from '@/modules/auth/auth.service';
import { setSessionCookie } from '@/server/auth/cookies';
import { created, handleApiError } from '@/server/http/response';
import { assertRateLimit, getClientIp } from '@/server/security/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    assertRateLimit(`auth:signup:${clientIp}`, {
      maxRequests: 10,
      windowMs: 15 * 60 * 1000,
    });

    const body = await request.json();
    const input = signupSchema.parse(body);

    const { response, rawSessionToken, expiresAt } =
      await AuthService.signup(input);

    await setSessionCookie(rawSessionToken, expiresAt);

    return created(response);
  } catch (error) {
    return handleApiError(error);
  }
}

