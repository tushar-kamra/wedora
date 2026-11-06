import { requireAuth } from '@/server/auth/session';
import { handleApiError, ok } from '@/server/http/response';
import { MembersService } from '@/modules/members/members.service';

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  try {
    const auth = await requireAuth();
    const { token } = await context.params;
    const result = await MembersService.acceptInvitation(token, auth.user);
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

