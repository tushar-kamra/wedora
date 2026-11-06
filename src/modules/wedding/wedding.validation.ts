import { z } from 'zod';
import { createValidationError } from '@/server/http/errors';

const dateStringRegex = /^\d{4}-\d{2}-\d{2}$/;

function isValidCalendarDate(dateStr: string): boolean {
  if (!dateStringRegex.test(dateStr)) return false;
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

export const weddingLocationSchema = z
  .object({
    formattedAddress: z.string().trim().max(300).nullable().optional(),
    city: z.string().trim().max(120).nullable().optional(),
    state: z.string().trim().max(120).nullable().optional(),
    country: z.string().trim().max(120).nullable().optional(),
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
    googlePlaceId: z.string().trim().max(200).nullable().optional(),
  })
  .optional();

export const createWeddingSchema = z.object({
  brideName: z
    .string({ required_error: 'Bride name is required' })
    .trim()
    .min(1, 'Bride name is required')
    .max(120, 'Bride name must be at most 120 characters'),
  groomName: z
    .string({ required_error: 'Groom name is required' })
    .trim()
    .min(1, 'Groom name is required')
    .max(120, 'Groom name must be at most 120 characters'),
  title: z
    .string()
    .trim()
    .max(160, 'Wedding title must be at most 160 characters')
    .nullable()
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, 'Description must be at most 2000 characters')
    .nullable()
    .optional(),
  weddingDate: z
    .string({ required_error: 'Wedding date is required' })
    .trim()
    .refine(
      isValidCalendarDate,
      'Wedding date must be a valid YYYY-MM-DD date'
    ),
  timeZone: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .default('Asia/Kolkata')
    .optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug may only contain lowercase letters, numbers, and hyphens'
    )
    .max(100)
    .optional(),
  location: weddingLocationSchema,
});

export const updateWeddingSchema = z
  .object({
    brideName: z
      .string()
      .trim()
      .min(1, 'Bride name cannot be empty')
      .max(120)
      .optional(),
    groomName: z
      .string()
      .trim()
      .min(1, 'Groom name cannot be empty')
      .max(120)
      .optional(),
    title: z.string().trim().max(160).nullable().optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    weddingDate: z
      .string()
      .trim()
      .refine(
        isValidCalendarDate,
        'Wedding date must be a valid YYYY-MM-DD date'
      )
      .optional(),
    timeZone: z.string().trim().min(1).max(80).optional(),
    location: weddingLocationSchema,
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'At least one field must be provided to update the wedding',
  });

export type CreateWeddingInput = z.infer<typeof createWeddingSchema>;
export type UpdateWeddingInput = z.infer<typeof updateWeddingSchema>;

export function validateWeddingPayload<T>(
  schema: z.ZodSchema<T>,
  payload: unknown
): T {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    const details: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.') || 'body';
      if (!details[key]) {
        details[key] = issue.message;
      }
    }
    throw createValidationError('Validation failed', details);
  }
  return parsed.data;
}

export function slugifyPart(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/\s+/)[0]
    ?.replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'wedding';
}

export function generateBaseWeddingSlug(
  brideName: string,
  groomName: string,
  weddingDate: string
): string {
  const brideSlug = slugifyPart(brideName);
  const groomSlug = slugifyPart(groomName);
  const [yyyy = '2027', mm = '02', dd = '14'] = weddingDate.split('-');
  const ddmmyyyy = `${dd}${mm}${yyyy}`;
  return `${brideSlug}-${groomSlug}-${ddmmyyyy}`;
}

export function calculateDaysRemaining(
  weddingDate: string,
  now: Date = new Date()
): number {
  const [y, m, d] = weddingDate.split('-').map(Number);
  if (!y || !m || !d) return 0;
  const targetUtc = Date.UTC(y, m - 1, d);
  const todayUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  const diffDays = Math.ceil((targetUtc - todayUtc) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

