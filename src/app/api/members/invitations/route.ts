import { requireWeddingAdmin } from '@/server/auth/session';
import { created, handleApiError, ok } from '@/server/http/response';
import { MembersService } from '@/modules/members/members.service';

export async function GET() {
  try {
    const { wedding } = await requireWeddingAdmin();
    const invitations = await MembersService.listPendingInvitations(wedding.id);
    return ok(invitations);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { user, wedding } = await requireWeddingAdmin();
    const body = await request.json().catch(() => ({}));
    const invitation = await MembersService.inviteMember({
      weddingId: wedding.id,
      invitedByUserId: user.id,
      invitedByName: user.name,
      payload: body,
    });
    return created(invitation);
  } catch (error) {
    return handleApiError(error);
  }
}

