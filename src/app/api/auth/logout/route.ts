import { AuthService } from '@/modules/auth/auth.service';
import {
  clearSessionCookie,
  getSessionTokenFromCookies,
} from '@/server/auth/cookies';
import { actionOk, handleApiError } from '@/server/http/response';

export async function POST() {
  try {
    const rawToken = await getSessionTokenFromCookies();
    await AuthService.logout(rawToken);
    await clearSessionCookie();
    return actionOk();
  } catch (error) {
    return handleApiError(error);
  }
}

