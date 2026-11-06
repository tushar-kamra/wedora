import { requireWeddingMember } from '@/server/auth/session';
import { handleApiError, ok } from '@/server/http/response';
import { WeddingService } from '@/modules/wedding/wedding.service';

export async function GET() {
  try {
    const { wedding } = await requireWeddingMember();
    const result = await WeddingService.getDashboard(wedding.id);
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

