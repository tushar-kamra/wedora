import { requireWeddingAdmin } from '@/server/auth/session';
import { actionOk, handleApiError, ok } from '@/server/http/response';
import { MembersService } from '@/modules/members/members.service';

interface RouteContext {
  params: Promise<{ membershipId: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { wedding } = await requireWeddingAdmin();
    const { membershipId } = await context.params;
    const body = await request.json().catch(() => ({}));
    const updated = await MembersService.updateMemberRole(
      wedding.id,
      membershipId,
      body
    );
    return ok(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { wedding } = await requireWeddingAdmin();
    const { membershipId } = await context.params;
    await MembersService.removeMember(wedding.id, membershipId);
    return actionOk();
  } catch (error) {
    return handleApiError(error);
  }
}

