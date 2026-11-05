import { requireAuth } from '@/server/auth/session';
import { ok, handleApiError } from '@/server/http/response';

export async function GET() {
  try {
    const me = await requireAuth();
    return ok(me);
  } catch (error) {
    return handleApiError(error);
  }
}

