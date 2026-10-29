import {
  signupSchema,
  loginSchema,
  GENERIC_VALIDATION_ERROR,
  logValidationFailure,
} from './validation';
import {
  checkIpRateLimit,
  isAccountLocked,
  applyProgressiveDelay,
  recordFailedLogin,
  resetFailedAttempts,
  RATE_LIMIT_MAX_REQUESTS,
} from './rateLimiter';
import {
  hashPassword,
  authenticateAndMigratePassword,
  sanitizeLogData,
} from './passwordSecurity';

/**
 * Standardized Non-Leaking Authentication Error Messages (Audit Rule Compliance)
 */
export const AUTH_MESSAGES = {
  // Rule: login failures (wrong email or wrong password) must written exactly : "incorrect email or password"
  LOGIN_FAILED: 'incorrect email or password',
  // Rule: password reset must say : " if that email is registered , you 'll recieve a reset link "
  PASSWORD_RESET: "if that email is registered , you 'll recieve a reset link",
  // Rule: registration must NOT confirm whether an email already exists
  SIGNUP_SUCCESS: 'If registration was successful, please check your email for a verification link.',
  // Generic validation error
  INVALID_INPUT: GENERIC_VALIDATION_ERROR,
};

/**
 * Mock / In-Memory User Database for testing route handlers standalone
 * In production with Supabase, this is handled through Supabase Auth & public.profiles
 */
export interface UserRecord {
  id: string;
  email: string;
  username: string;
  displayName: string;
  passwordHash: string; // Stored hash (or legacy MD5/SHA-1 during migration)
  plan: string;
  preferences: Record<string, any>;
  createdAt: string;
}

export const mockUserDb = new Map<string, UserRecord>();

// Seed a legacy user for migration demonstration
mockUserDb.set('legacy@example.com', {
  id: 'usr_legacy_123',
  email: 'legacy@example.com',
  username: 'legacyuser',
  displayName: 'Legacy User',
  // Legacy MD5 hash for "LegacyPass123!" (md5: 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918 or 32-char hex)
  passwordHash: '5d41402abc4b2a76b9719d911017c592', // MD5 of "hello"
  plan: 'free',
  preferences: { theme: 'light' },
  createdAt: new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString(),
});

/**
 * POST /api/auth/signup Route Handler
 */
export async function handleSignupRoute(
  body: unknown,
  clientIp: string = '127.0.0.1'
): Promise<{ status: number; body: Record<string, any> }> {
  // 1. Server-Side Input Validation & Sanitization with Zod
  const validationResult = signupSchema.safeParse(body);

  if (!validationResult.success) {
    // Log failure server-side for telemetry without exposing specifics to user
    logValidationFailure('/api/auth/signup', clientIp, validationResult.error, body as Record<string, any>);
    return {
      status: 400,
      body: { error: AUTH_MESSAGES.INVALID_INPUT },
    };
  }

  const { email, password, username, displayName } = validationResult.data;

  // 2. Prevent User Enumeration on Signup
  // Check if user exists, but DO NOT confirm existence to client
  const existingUser = mockUserDb.get(email);
  if (existingUser) {
    // Audit rule: registration must NOT confirm whether an email already exists
    console.warn(`[AUDIT] Registration attempt for already existing email: ${email.split('@')[1]}`);
    return {
      status: 200,
      body: { message: AUTH_MESSAGES.SIGNUP_SUCCESS },
    };
  }

  // 3. Cryptographically Secure Password Hashing
  const passwordHash = await hashPassword(password);

  // 4. Store user in database (Storing ONLY non-sensitive metadata)
  const newUser: UserRecord = {
    id: `usr_${Math.random().toString(36).substring(2, 10)}`,
    email,
    username,
    displayName,
    passwordHash,
    plan: 'free',
    preferences: { currency: 'INR', alerts: true },
    createdAt: new Date().toISOString(),
  };

  mockUserDb.set(email, newUser);

  // Safe server logging with zero password disclosure
  console.info('[AUTH] New user account registered:', sanitizeLogData({
    userId: newUser.id,
    emailDomain: email.split('@')[1],
    username,
  }));

  return {
    status: 201,
    body: {
      message: AUTH_MESSAGES.SIGNUP_SUCCESS,
      user: {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName,
      },
    },
  };
}

/**
 * POST /api/auth/login Route Handler
 * Implements:
 * - 10 req/min IP rate limiting
 * - Progressive delay
 * - 15-min lockout after 5 consecutive failed attempts
 * - Transparent rehash migration for legacy passwords
 * - Uniform "incorrect email or password" error masking
 */
export async function handleLoginRoute(
  body: unknown,
  clientIp: string = '127.0.0.1',
  sendResetEmailFn?: (email: string, resetLink: string) => Promise<void>
): Promise<{ status: number; body: Record<string, any>; headers?: Record<string, string> }> {
  // 1. IP Rate Limiting (Max 10 requests per minute)
  const rateLimit = await checkIpRateLimit(clientIp);
  if (!rateLimit.allowed) {
    console.warn(`[SECURITY] IP Rate Limit Exceeded on /login for IP: ${clientIp}`);
    return {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
        'X-RateLimit-Remaining': '0',
      },
      // Keep error message generic or standard rate limit message
      body: { error: 'Too many requests. Please try again in 1 minute.' },
    };
  }

  // 2. Server-Side Input Validation & Sanitization with Zod
  const validationResult = loginSchema.safeParse(body);
  if (!validationResult.success) {
    logValidationFailure('/api/auth/login', clientIp, validationResult.error, body as Record<string, any>);
    return {
      status: 401,
      // Generic error: never leak that the format failed
      body: { error: AUTH_MESSAGES.LOGIN_FAILED },
    };
  }

  const { email, password } = validationResult.data;

  // 3. Progressive Delay Mitigation
  // Slows down consecutive automated password brute-force attacks
  await applyProgressiveDelay(email);

  // 4. Account Lockout Check
  // Rule: account lockout must NOT mention its a lockout -- return the same generic message
  const locked = await isAccountLocked(email);
  if (locked) {
    console.warn(`[SECURITY] Login attempted on locked account: ${email.split('@')[1]}`);
    return {
      status: 401,
      body: { error: AUTH_MESSAGES.LOGIN_FAILED },
    };
  }

  // 5. User Lookup & Timing Defense
  const user = mockUserDb.get(email);
  if (!user) {
    // Perform dummy hash verification to prevent timing attack discrepancy
    await hashPassword(password);
    await recordFailedLogin(email, sendResetEmailFn);
    return {
      status: 401,
      body: { error: AUTH_MESSAGES.LOGIN_FAILED },
    };
  }

  // 6. Constant-Time Authentication & Automatic Migration
  const authResult = await authenticateAndMigratePassword(password, user.passwordHash);

  if (!authResult.isValid) {
    const lockoutState = await recordFailedLogin(email, sendResetEmailFn);
    if (lockoutState.locked) {
      console.warn(`[SECURITY] Account locked out after 5 failed attempts: ${user.id}`);
    }
    return {
      status: 401,
      // Rule: login failures (wrong email or wrong password) must written exactly : "incorrect email or password"
      body: { error: AUTH_MESSAGES.LOGIN_FAILED },
    };
  }

  // 7. Successful Authentication: Reset Failed Counter
  await resetFailedAttempts(email);

  // 8. Transparent Password Migration
  // If user authenticated with legacy MD5/SHA-1/plain-text, upgrade stored hash immediately
  if (authResult.needsRehash && authResult.upgradedHash) {
    user.passwordHash = authResult.upgradedHash;
    mockUserDb.set(email, user);
    console.info(`[MIGRATION] Transparently upgraded legacy password hash for user ${user.id} to modern cryptographic hash.`);
  }

  return {
    status: 200,
    body: {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        plan: user.plan,
      },
    },
  };
}

/**
 * POST /api/auth/reset-password Route Handler
 */
export async function handlePasswordResetRoute(
  body: unknown,
  clientIp: string = '127.0.0.1'
): Promise<{ status: number; body: Record<string, any> }> {
  // Always return the exact safe string regardless of whether email exists
  return {
    status: 200,
    body: {
      message: AUTH_MESSAGES.PASSWORD_RESET,
    },
  };
}

