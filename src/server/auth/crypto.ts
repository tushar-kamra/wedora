import 'server-only';
import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { getServerEnv } from '@/server/config/env';

const scryptAsync = promisify(crypto.scrypt);
const SCRYPT_KEY_LENGTH = 64;

/**
 * Normalizes an email address per DATABASE_DESIGN.md §7:
 * - trims leading/trailing whitespace
 * - converts to lowercase
 * - does not perform provider-specific transformations
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Hashes a plaintext password using Node's built-in crypto.scrypt with a random 16-byte salt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(
    password,
    salt,
    SCRYPT_KEY_LENGTH
  )) as Buffer;
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verifies a plaintext password against a stored scrypt hash using constant-time comparison.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const parts = storedHash.split(':');
  if (parts.length !== 3 || parts[0] !== 'scrypt') {
    return false;
  }

  const [, salt, keyHex] = parts;
  if (!salt || !keyHex) {
    return false;
  }

  const expectedBuffer = Buffer.from(keyHex, 'hex');
  const derivedKey = (await scryptAsync(
    password,
    salt,
    expectedBuffer.length
  )) as Buffer;

  if (derivedKey.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(derivedKey, expectedBuffer);
}

/**
 * Generates a cryptographically random base64url token (default 32 bytes = 256 bits of entropy).
 */
export function generateRandomToken(byteLength = 32): string {
  return crypto.randomBytes(byteLength).toString('base64url');
}

/**
 * Computes an HMAC-SHA-256 hash of a raw token using SESSION_SECRET.
 * Used for storing one-way hashes of session tokens, password reset tokens, and member invitation tokens.
 */
export function hashToken(rawToken: string): string {
  const { SESSION_SECRET } = getServerEnv();
  return crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(rawToken)
    .digest('hex');
}

