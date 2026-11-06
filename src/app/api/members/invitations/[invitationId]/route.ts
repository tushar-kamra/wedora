import { requireWeddingAdmin } from '@/server/auth/session';
import { actionOk, handleApiError } from '@/server/http/response';
import { MembersService } from '@/modules/members/members.service';

interface RouteContext {
  params: Promise<{ invitationId: string }>;
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { wedding } = await requireWeddingAdmin();
    const { invitationId } = await context.params;
    await MembersService.revokeInvitation(wedding.id, invitationId);
    return actionOk();
  } catch (error) {
    return handleApiError(error);
  }
}

