import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  generateRandomToken,
  hashPassword,
  hashToken,
  normalizeEmail,
  verifyPassword,
} from '@/server/auth/crypto';
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from '@/modules/auth/auth.validation';

describe('Authentication Security & Validation Unit Suite', () => {
  beforeAll(() => {
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/wedora-test';
    process.env.SESSION_SECRET =
      'test_session_secret_with_at_least_32_characters_entropy_12345';
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
  });

  describe('normalizeEmail', () => {
    it('trims whitespace and converts email to lowercase while preserving dots', () => {
      expect(normalizeEmail('  Akshay.Saini@Gmail.com  ')).toBe(
        'akshay.saini@gmail.com'
      );
    });
  });

  describe('Password Hashing (scrypt)', () => {
    it('hashes a password with random salt and verifies matching password', async () => {
      const hash1 = await hashPassword('MyStrongPassword!2027');
      const hash2 = await hashPassword('MyStrongPassword!2027');

      expect(hash1).not.toBe(hash2);
      expect(hash1.startsWith('scrypt:')).toBe(true);
      expect(await verifyPassword('MyStrongPassword!2027', hash1)).toBe(true);
      expect(await verifyPassword('WrongPassword!2027', hash1)).toBe(false);
    });
  });

  describe('Token Generation & HMAC-SHA-256 Hashing', () => {
    it('generates distinct high-entropy base64url tokens and deterministic hashes', () => {
      const tokenA = generateRandomToken(32);
      const tokenB = generateRandomToken(32);

      expect(tokenA).not.toBe(tokenB);
      expect(tokenA.length).toBeGreaterThanOrEqual(42);

      const hashA1 = hashToken(tokenA);
      const hashA2 = hashToken(tokenA);
      const hashB = hashToken(tokenB);

      expect(hashA1).toBe(hashA2);
      expect(hashA1).not.toBe(hashB);
      expect(hashA1).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('Zod Validation Schemas', () => {
    it('validates signup payloads and rejects short passwords or invalid emails', () => {
      const valid = signupSchema.safeParse({
        name: '  Akshay Saini ',
        email: 'akshay@wedora.in',
        password: 'securePassword123',
      });
      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.name).toBe('Akshay Saini');
      }

      const invalid = signupSchema.safeParse({
        name: 'A',
        email: 'not-an-email',
        password: 'short',
      });
      expect(invalid.success).toBe(false);
    });

    it('validates login, forgot-password, and reset-password payloads', () => {
      expect(
        loginSchema.safeParse({
          email: 'princi@wedora.in',
          password: 'password123',
        }).success
      ).toBe(true);

      expect(
        forgotPasswordSchema.safeParse({
          email: 'princi@wedora.in',
        }).success
      ).toBe(true);

      expect(
        resetPasswordSchema.safeParse({
          token: generateRandomToken(32),
          password: 'newSecurePassword123',
        }).success
      ).toBe(true);
    });
  });
});

