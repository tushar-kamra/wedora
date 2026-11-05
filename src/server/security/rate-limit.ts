import 'server-only';
import type { NextRequest } from 'next/server';
import { createRateLimitedError } from '@/server/http/errors';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __wedoraRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const rateLimitStore: Map<string, RateLimitEntry> =
  globalThis.__wedoraRateLimitStore ?? new Map<string, RateLimitEntry>();

if (!globalThis.__wedoraRateLimitStore) {
  globalThis.__wedoraRateLimitStore = rateLimitStore;
}

export interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

export function getClientIp(request: NextRequest | Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

export function assertRateLimit(
  key: string,
  options: RateLimitOptions
): void {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return;
  }

  if (existing.count >= options.maxRequests) {
    throw createRateLimitedError();
  }

  existing.count += 1;
}

