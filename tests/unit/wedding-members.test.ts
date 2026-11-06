import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
import {
  calculateDaysRemaining,
  createWeddingSchema,
  generateBaseWeddingSlug,
  updateWeddingSchema,
} from '@/modules/wedding/wedding.validation';
import {
  inviteMemberSchema,
  updateMemberRoleSchema,
} from '@/modules/members/members.validation';

describe('Wedding & Members Validation Unit Suite', () => {
  describe('generateBaseWeddingSlug', () => {
    it('generates lowercase bride-groom-ddmmyyyy slug from names and date', () => {
      const slug = generateBaseWeddingSlug(
        'Princi Kapoor',
        'Akshay Saini',
        '2027-02-14'
      );
      expect(slug).toBe('princi-akshay-14022027');
    });
  });

  describe('calculateDaysRemaining', () => {
    it('computes non-negative days remaining until weddingDate', () => {
      const refNow = new Date(Date.UTC(2027, 0, 15)); // 15 Jan 2027
      expect(calculateDaysRemaining('2027-02-14', refNow)).toBe(30);
      expect(calculateDaysRemaining('2027-01-10', refNow)).toBe(0);
    });
  });

  describe('createWeddingSchema & updateWeddingSchema', () => {
    it('validates createWedding payload and rejects invalid calendar dates', () => {
      const valid = createWeddingSchema.safeParse({
        brideName: 'Princi',
        groomName: 'Akshay',
        weddingDate: '2027-02-14',
        timeZone: 'Asia/Kolkata',
        location: {
          city: 'Udaipur',
          state: 'Rajasthan',
          country: 'India',
        },
      });
      expect(valid.success).toBe(true);

      const invalidDate = createWeddingSchema.safeParse({
        brideName: 'Princi',
        groomName: 'Akshay',
        weddingDate: '2027-02-31',
      });
      expect(invalidDate.success).toBe(false);
    });

    it('requires at least one field in updateWeddingSchema', () => {
      expect(updateWeddingSchema.safeParse({}).success).toBe(false);
      expect(
        updateWeddingSchema.safeParse({
          description: 'Updated welcome note',
        }).success
      ).toBe(true);
    });
  });

  describe('inviteMemberSchema & updateMemberRoleSchema', () => {
    it('validates member invitation email and ADMIN/MANAGER roles', () => {
      expect(
        inviteMemberSchema.safeParse({
          email: 'rahul.kapoor@example.com',
          role: 'MANAGER',
        }).success
      ).toBe(true);

      expect(
        inviteMemberSchema.safeParse({
          email: 'not-an-email',
          role: 'ADMIN',
        }).success
      ).toBe(false);

      expect(
        updateMemberRoleSchema.safeParse({
          role: 'ADMIN',
        }).success
      ).toBe(true);
    });
  });
});
