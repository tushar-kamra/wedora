import { getOptionalAuth } from '@/server/auth/session';
import { handleApiError, ok } from '@/server/http/response';
import { MembersService } from '@/modules/members/members.service';

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const auth = await getOptionalAuth();
    const { token } = await context.params;
    const invitation = await MembersService.getPublicInvitation(
      token,
      Boolean(auth)
    );
    return ok(invitation);
  } catch (error) {
    return handleApiError(error);
  }
}

