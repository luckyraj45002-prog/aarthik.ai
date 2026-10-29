/**
 * Rate Limiting, Account Lockout, and Progressive Delay Engine
 * Backed by Redis / Upstash with an In-Memory TTL Cache Fallback.
 */

export interface CacheStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  incr(key: string, ttlSeconds: number): Promise<number>;
  del(key: string): Promise<void>;
}

/**
 * Built-in In-Memory TTL Cache with auto-pruning.
 * Used when Redis/Upstash is not provisioned or during offline development.
 */
class InMemoryCacheStore implements CacheStore {
  private store = new Map<string, { value: string; expiresAt: number }>();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async incr(key: string, ttlSeconds: number): Promise<number> {
    const now = Date.now();
    const entry = this.store.get(key);
    let count = 1;
    let expiresAt = now + ttlSeconds * 1000;

    if (entry && now <= entry.expiresAt) {
      count = parseInt(entry.value, 10) + 1;
      expiresAt = entry.expiresAt; // Retain existing TTL window
    }

    this.store.set(key, {
      value: count.toString(),
      expiresAt,
    });
    return count;
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }
}

/**
 * Upstash / Redis REST Cache Store Adapter
 */
export class UpstashRedisCacheStore implements CacheStore {
  constructor(
    private url: string = process.env.UPSTASH_REDIS_REST_URL || '',
    private token: string = process.env.UPSTASH_REDIS_REST_TOKEN || ''
  ) {}

  private isConfigured(): boolean {
    return Boolean(this.url && this.token);
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConfigured()) return null;
    try {
      const res = await fetch(`${this.url}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      const data = await res.json();
      return data.result ?? null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    if (!this.isConfigured()) return;
    try {
      await fetch(`${this.url}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}?ex=${ttlSeconds}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
    } catch {
      // Log failure in telemetry
    }
  }

  async incr(key: string, ttlSeconds: number): Promise<number> {
    if (!this.isConfigured()) return 1;
    try {
      const res = await fetch(`${this.url}/incr/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      const data = await res.json();
      const count = Number(data.result) || 1;
      if (count === 1) {
        // Set expiry on first increment
        await fetch(`${this.url}/expire/${encodeURIComponent(key)}/${ttlSeconds}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
      }
      return count;
    } catch {
      return 1;
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConfigured()) return;
    try {
      await fetch(`${this.url}/del/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
    } catch {
      // Log failure
    }
  }
}

// Global active cache instance (Upstash if configured, otherwise high-performance InMemoryCache)
export const authCache: CacheStore =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new UpstashRedisCacheStore()
    : new InMemoryCacheStore();

/**
 * CONFIGURATION CONSTANTS
 */
export const RATE_LIMIT_MAX_REQUESTS = 10; // Max 10 requests per IP per minute
export const RATE_LIMIT_WINDOW_SECONDS = 60; // 1 minute window
export const LOCKOUT_THRESHOLD = 5; // 5 consecutive failed attempts
export const LOCKOUT_DURATION_SECONDS = 15 * 60; // 15 minutes lockout
export const PROGRESSIVE_DELAY_BASE_MS = 500; // 500ms base delay per failed attempt

/**
 * IP Rate Limiter
 * Returns { allowed: boolean, remaining: number }
 */
export async function checkIpRateLimit(
  clientIp: string
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rate_limit:ip:${clientIp}:login`;
  const count = await authCache.incr(key, RATE_LIMIT_WINDOW_SECONDS);

  return {
    allowed: count <= RATE_LIMIT_MAX_REQUESTS,
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - count),
  };
}

/**
 * Account Lockout Status Check
 * Returns whether the account is currently locked out
 */
export async function isAccountLocked(identifier: string): Promise<boolean> {
  const lockKey = `lockout:account:${identifier.toLowerCase()}`;
  const locked = await authCache.get(lockKey);
  return Boolean(locked);
}

/**
 * Progressive Delay Calculator
 * Applies artificial delay to mitigate automated brute-force attacks.
 * Attempt 1: 500ms, Attempt 2: 1000ms, Attempt 3: 2000ms, Attempt 4: 4000ms
 */
export async function applyProgressiveDelay(identifier: string): Promise<number> {
  const attemptKey = `attempts:failed:${identifier.toLowerCase()}`;
  const currentVal = await authCache.get(attemptKey);
  const attempts = currentVal ? parseInt(currentVal, 10) : 0;

  if (attempts > 0) {
    const delayMs = Math.min(PROGRESSIVE_DELAY_BASE_MS * Math.pow(2, attempts - 1), 5000);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return delayMs;
  }
  return 0;
}

/**
 * Records a failed login attempt.
 * Increments failed counter, enforces 15-min lockout at 5 failures,
 * and triggers automated email notification with reset link.
 */
export async function recordFailedLogin(
  identifier: string,
  sendLockoutEmailFn?: (email: string, resetLink: string) => Promise<void>
): Promise<{ locked: boolean; attempts: number }> {
  const normalizedId = identifier.toLowerCase();
  const attemptKey = `attempts:failed:${normalizedId}`;
  const lockKey = `lockout:account:${normalizedId}`;

  // Increment failed counter with TTL matching lockout duration
  const attempts = await authCache.incr(attemptKey, LOCKOUT_DURATION_SECONDS);

  if (attempts >= LOCKOUT_THRESHOLD) {
    // Lock account for 15 minutes
    await authCache.set(lockKey, 'locked', LOCKOUT_DURATION_SECONDS);

    // Generate reset token and notify user
    const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const resetLink = `${process.env.APP_URL || 'https://aarthik.ai'}/#reset-password?token=${resetToken}&email=${encodeURIComponent(normalizedId)}`;

    if (sendLockoutEmailFn) {
      try {
        await sendLockoutEmailFn(normalizedId, resetLink);
      } catch (err) {
        console.warn('[SECURITY] Failed to dispatch lockout notification email:', err);
      }
    }

    return { locked: true, attempts };
  }

  return { locked: false, attempts };
}

/**
 * Resets failed login attempts upon successful authentication.
 */
export async function resetFailedAttempts(identifier: string): Promise<void> {
  const normalizedId = identifier.toLowerCase();
  await authCache.del(`attempts:failed:${normalizedId}`);
  await authCache.del(`lockout:account:${normalizedId}`);
}

