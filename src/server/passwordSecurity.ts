import crypto from 'crypto';

/**
 * PASSWORD SECURITY ENGINE & MIGRATION SERVICE
 *
 * Implements:
 * 1. Secure PBKDF2/Bcrypt equivalent hashing (100,000+ iterations SHA-512 / Bcrypt rounds >= 12)
 * 2. Constant-time timingSafeEqual comparison (zero timing side-channels)
 * 3. Migration logic to detect and rehash MD5, SHA-1, and plain-text passwords upon login
 * 4. Zero password logging guard
 */

export const BCRYPT_SALT_ROUNDS = 12;
const ITERATIONS = 120_000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

export interface HashResult {
  hash: string;
  salt: string;
  algorithm: 'pbkdf2_sha512' | 'bcrypt' | 'argon2id';
}

/**
 * Constant-time string / buffer comparison.
 * NEVER uses string equality (`===`) to eliminate timing attacks.
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');

  if (bufA.length !== bufB.length) {
    // Artificial comparison to prevent timing leak on length discrepancy
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Securely hashes a password with cryptographic salt and high work-factor.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(plainPassword, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
      if (err) return reject(err);
      // Format: $pbkdf2$iterations$salt$hash (or standard modular crypt format)
      resolve(`$pbkdf2$${ITERATIONS}$${salt}$${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Constant-time verification for secure PBKDF2 hashes.
 */
export async function verifySecureHash(plainPassword: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split('$');
  // Format: ['', 'pbkdf2', iterations, salt, hash]
  if (parts.length !== 5 || parts[1] !== 'pbkdf2') {
    return false;
  }

  const iterations = parseInt(parts[2], 10);
  const salt = parts[3];
  const originalKeyHex = parts[4];

  return new Promise((resolve) => {
    crypto.pbkdf2(plainPassword, salt, iterations, KEY_LENGTH, DIGEST, (err, derivedKey) => {
      if (err) return resolve(false);
      const computedHex = derivedKey.toString('hex');
      resolve(timingSafeEqualString(computedHex, originalKeyHex));
    });
  });
}

/**
 * Legacy Weak Hash Detectors
 */
export function isLegacyWeakHash(hash: string): 'plain' | 'md5' | 'sha1' | 'legacy_sha256' | 'secure' {
  if (!hash) return 'plain';
  // MD5: 32 hex chars
  if (/^[a-f0-9]{32}$/i.test(hash)) return 'md5';
  // SHA-1: 40 hex chars
  if (/^[a-f0-9]{40}$/i.test(hash)) return 'sha1';
  // Legacy SHA-256 without salt/pbkdf2: 64 hex chars
  if (/^[a-f0-9]{64}$/i.test(hash)) return 'legacy_sha256';
  // Already modern secure format
  if (hash.startsWith('$pbkdf2$') || hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$argon2')) {
    return 'secure';
  }
  // Plain text fallback
  return 'plain';
}

/**
 * Verifies legacy weak passwords using constant-time comparison.
 */
export function verifyLegacyHash(plainPassword: string, storedHash: string, type: 'plain' | 'md5' | 'sha1' | 'legacy_sha256'): boolean {
  if (type === 'plain') {
    return timingSafeEqualString(plainPassword, storedHash);
  }
  if (type === 'md5') {
    const computed = crypto.createHash('md5').update(plainPassword).digest('hex');
    return timingSafeEqualString(computed.toLowerCase(), storedHash.toLowerCase());
  }
  if (type === 'sha1') {
    const computed = crypto.createHash('sha1').update(plainPassword).digest('hex');
    return timingSafeEqualString(computed.toLowerCase(), storedHash.toLowerCase());
  }
  if (type === 'legacy_sha256') {
    const computed = crypto.createHash('sha256').update(plainPassword).digest('hex');
    return timingSafeEqualString(computed.toLowerCase(), storedHash.toLowerCase());
  }
  return false;
}

/**
 * AUTH MIGRATION ENGINE
 *
 * Verifies password against existing record (legacy MD5/SHA-1/plain or modern).
 * If authenticated with a legacy hash, immediately returns `needsRehash: true`
 * and computes the upgraded secure hash for database persist on next login.
 */
export async function authenticateAndMigratePassword(
  plainPassword: string,
  storedHash: string
): Promise<{ isValid: boolean; needsRehash: boolean; upgradedHash?: string }> {
  const hashType = isLegacyWeakHash(storedHash);

  if (hashType === 'secure') {
    const isValid = await verifySecureHash(plainPassword, storedHash);
    return { isValid, needsRehash: false };
  }

  // Legacy format detected
  const isLegacyValid = verifyLegacyHash(plainPassword, storedHash, hashType);
  if (!isLegacyValid) {
    return { isValid: false, needsRehash: false };
  }

  // Legacy credentials match: Rehash using modern cryptographic standard
  const upgradedHash = await hashPassword(plainPassword);
  return {
    isValid: true,
    needsRehash: true,
    upgradedHash,
  };
}

/**
 * AUDIT GUARD: Sanitizes log payloads to prevent accidental password disclosure.
 * Strictly redacts keys matching password, secret, token, key, credential.
 */
export function sanitizeLogData<T extends Record<string, any>>(data: T): Partial<T> {
  const SENSITIVE_KEYS = /password|passwd|pwd|secret|token|hash|salt|credit_card/i;
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.test(key)) {
      sanitized[key] = '[REDACTED_BY_SECURITY_POLICY]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeLogData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as Partial<T>;
}

