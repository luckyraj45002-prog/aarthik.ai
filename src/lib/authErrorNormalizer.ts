/**
 * Strict Anti-Enumeration Error Mapping
 *
 * Normalizes Supabase, network, or server authentication errors to ensure
 * zero information leakage (user existence, lockout status, or password clues).
 */
export function normalizeAuthError(error: any): string {
  if (!error) return '';

  const rawMessage = (typeof error === 'string' ? error : error.message || '').toLowerCase();
  const rawStatus = error.status || 0;

  // Login failures, lockout events, or missing users
  if (
    rawMessage.includes('invalid login credentials') ||
    rawMessage.includes('invalid credentials') ||
    rawMessage.includes('wrong password') ||
    rawMessage.includes('not found') ||
    rawMessage.includes('doesn\'t exist') ||
    rawMessage.includes('too many requests') ||
    rawMessage.includes('rate limit') ||
    rawMessage.includes('lockout') ||
    rawMessage.includes('locked') ||
    rawStatus === 400 ||
    rawStatus === 422 ||
    rawStatus === 429
  ) {
    return 'incorrect email or password';
  }

  // Password reset requests
  if (rawMessage.includes('reset') || rawMessage.includes('recovery')) {
    return "if that email is registered, you'll receive a reset link";
  }

  // Registration duplicates
  if (rawMessage.includes('already registered') || rawMessage.includes('user already exists')) {
    return 'registration cannot be completed with this information';
  }

  return 'an unexpected error occurred. please try again later.';
}

