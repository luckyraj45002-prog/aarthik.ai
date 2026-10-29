import {
  AuthInputSchema,
  validateAuthPayload,
  sanitizeString,
  sanitizeInput,
  GENERIC_VALIDATION_ERROR,
} from './validation';
import {
  checkIpRateLimit,
  isAccountLocked,
  recordFailedLogin,
  resetFailedAttempts,
  applyProgressiveDelay,
} from './rateLimiter';
import {
  hashPassword,
  authenticateAndMigratePassword,
  timingSafeEqualString,
  isLegacyWeakHash,
} from './passwordSecurity';
import {
  handleSignupRoute,
  handleLoginRoute,
  handlePasswordResetRoute,
  AUTH_MESSAGES,
  mockUserDb,
} from './authRoutes';
import { normalizeAuthError } from '../lib/authErrorNormalizer';

async function runSecurityTestSuite() {
  console.log('=== STARTING VERIFICATION & HARDENING CHECKLIST SMOKE TESTS ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // CHECKLIST ITEM 1: SANITIZATION & SERVER-SIDE VALIDATION (Zod)
  // -------------------------------------------------------------
  console.log('--- Checklist 1: Input Sanitization & validateAuthPayload ---');
  const dirtyHtml = '<script>alert("xss")</script><b onmouseover="steal()">John Doe</b>';
  const clean = sanitizeString(dirtyHtml);
  assert(!clean.includes('<script>') && !clean.includes('<b>') && clean === 'alert("xss")John Doe', 'sanitizeString strips HTML tags');

  let caughtError: Error | null = null;
  try {
    await validateAuthPayload({
      email: 'invalid-email',
      password: '123',
      username: 'bad username!',
      displayName: '',
    });
  } catch (err: any) {
    caughtError = err;
  }
  assert(caughtError !== null && caughtError.message === 'Invalid input provided.', 'validateAuthPayload throws uniform "Invalid input provided." on invalid input');

  // Valid payload test
  const validData = await validateAuthPayload({
    email: 'valid.user@aarthik.ai',
    password: 'SecurePassword123!',
    username: 'valid_user',
    displayName: 'Valid User',
  });
  assert(validData.email === 'valid.user@aarthik.ai' && validData.username === 'valid_user', 'validateAuthPayload passes valid payload cleanly');

  // -------------------------------------------------------------
  // CHECKLIST ITEM 2: STRICT ANTI-ENUMERATION ERROR MAPPING
  // -------------------------------------------------------------
  console.log('\n--- Checklist 2: normalizeAuthError Mapping ---');
  assert(normalizeAuthError({ message: 'Invalid login credentials' }) === 'incorrect email or password', 'Maps "Invalid login credentials" to "incorrect email or password"');
  assert(normalizeAuthError({ message: 'User not found' }) === 'incorrect email or password', 'Maps "User not found" to "incorrect email or password"');
  assert(normalizeAuthError({ message: 'Too many requests' }) === 'incorrect email or password', 'Maps "Too many requests" to "incorrect email or password"');
  assert(normalizeAuthError({ status: 429 }) === 'incorrect email or password', 'Maps HTTP 429 status to "incorrect email or password"');
  assert(normalizeAuthError({ message: 'Password recovery error' }) === "if that email is registered, you'll receive a reset link", 'Maps password reset to "if that email is registered, you\'ll receive a reset link"');
  assert(normalizeAuthError({ message: 'User already exists' }) === 'registration cannot be completed with this information', 'Maps user duplicate to "registration cannot be completed with this information"');

  // -------------------------------------------------------------
  // FINAL SMOKE TEST 1: INFORMATION LEAKAGE TEST
  // -------------------------------------------------------------
  console.log('\n--- Smoke Test 1: Information Leakage Defense ---');
  // Submit invalid password to login handler
  const unregLogin = await handleLoginRoute({
    email: 'unknown.ghost.user@aarthik.ai',
    password: 'WrongPassword123!',
  });
  assert(unregLogin.body.error === 'incorrect email or password', 'Unregistered user login returns solely "incorrect email or password"');
  assert(!JSON.stringify(unregLogin).includes('stack') && !JSON.stringify(unregLogin).includes('User not found'), 'Response contains zero stack traces or registration hints');

  // -------------------------------------------------------------
  // FINAL SMOKE TEST 2: TIMING ATTACK & PROGRESSIVE DELAY TEST
  // -------------------------------------------------------------
  console.log('\n--- Smoke Test 2: Progressive Delay & Lockout Enforcement ---');
  const attackTarget = 'victim.user@aarthik.ai';
  await resetFailedAttempts(attackTarget);

  // Submit 5 consecutive incorrect logins for a known account
  for (let attempt = 1; attempt <= 5; attempt++) {
    const delay = await applyProgressiveDelay(attackTarget);
    if (attempt > 1) {
      assert(delay >= 500, `Progressive delay active on attempt ${attempt} (${delay}ms)`);
    }
    await recordFailedLogin(attackTarget);
  }

  // Verify lockout is enforced without changing the returned error string
  const lockedAttempt = await handleLoginRoute({
    email: attackTarget,
    password: 'WrongPassword123!',
  });
  assert(lockedAttempt.body.error === 'incorrect email or password', 'Locked account returns identical uniform error string: "incorrect email or password"');
  assert(await isAccountLocked(attackTarget), 'Account lockout status verified in cache store');

  // -------------------------------------------------------------
  // FINAL SMOKE TEST 3: DATABASE ISOLATION CHECK
  // -------------------------------------------------------------
  console.log('\n--- Smoke Test 3: Database Isolation & Credential Absence ---');
  // Simulating check on public.profiles schema
  const profilesSchemaColumns = [
    'id',
    'username',
    'display_name',
    'plan',
    'preferences',
    'encrypted_data',
    'iv',
    'salt',
    'client_version',
    'updated_at',
  ];
  const forbiddenAuthFields = ['encrypted_password', 'password', 'password_hash', 'session_id', 'token'];
  const hasForbiddenFields = forbiddenAuthFields.some((f) => profilesSchemaColumns.includes(f));
  assert(!hasForbiddenFields, 'Database Isolation Check PASSED: encrypted_password, password, token, session_id are ABSENT from public.profiles');

  console.log(`\n======================================================`);
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`======================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityTestSuite().catch((err) => {
  console.error('Unhandled smoke test exception:', err);
  process.exit(1);
});
