import { requireWeddingMember } from '@/server/auth/session';
import { handleApiError, ok } from '@/server/http/response';
import { MembersService } from '@/modules/members/members.service';

export async function GET() {
  try {
    const { wedding } = await requireWeddingMember();
    const members = await MembersService.listMembers(wedding.id);
    return ok(members);
  } catch (error) {
    return handleApiError(error);
  }
}

