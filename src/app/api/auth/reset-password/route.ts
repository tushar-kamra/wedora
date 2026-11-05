import type { NextRequest } from 'next/server';
import { resetPasswordSchema } from '@/modules/auth/auth.validation';
import { AuthService } from '@/modules/auth/auth.service';
import { actionOk, handleApiError } from '@/server/http/response';
import { assertRateLimit, getClientIp } from '@/server/security/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    assertRateLimit(`auth:reset-password:${clientIp}`, {
      maxRequests: 10,
      windowMs: 15 * 60 * 1000,
    });

    const body = await request.json();
    const input = resetPasswordSchema.parse(body);

    await AuthService.resetPassword(input);

    return actionOk();
  } catch (error) {
    return handleApiError(error);
  }
}

