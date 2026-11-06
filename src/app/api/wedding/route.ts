import { requireAuth, requireWeddingMember } from '@/server/auth/session';
import { created, handleApiError, ok } from '@/server/http/response';
import { WeddingService } from '@/modules/wedding/wedding.service';

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    const body = await request.json().catch(() => ({}));
    const result = await WeddingService.createWedding(auth.user.id, body);
    return created(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const { wedding } = await requireWeddingMember();
    const result = await WeddingService.getWedding(wedding.id);
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { wedding } = await requireWeddingMember();
    const body = await request.json().catch(() => ({}));
    const result = await WeddingService.updateWedding(wedding.id, body);
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

