import { z } from 'zod';
import { createValidationError } from '@/server/http/errors';

export const inviteMemberSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .email('Please provide a valid email address')
    .max(254, 'Email address must be at most 254 characters'),
  role: z.enum(['ADMIN', 'MANAGER'], {
    errorMap: () => ({ message: 'Role must be either ADMIN or MANAGER' }),
  }),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(['ADMIN', 'MANAGER'], {
    errorMap: () => ({ message: 'Role must be either ADMIN or MANAGER' }),
  }),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;

export function validateMembersPayload<T>(
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

