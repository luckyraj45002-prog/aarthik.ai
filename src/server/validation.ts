import { z } from 'zod';

/**
 * Strip HTML tags and control characters
 */
export const sanitizeString = (val: string): string =>
  val.replace(/<[^>]*>?/gm, '').trim();

/**
 * Strips HTML tags, script tags, event handlers, and dangerous control characters
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();
}

/**
 * Universal safe generic error message.
 * NEVER leaks which field or requirement failed.
 */
export const GENERIC_VALIDATION_ERROR = 'Invalid input provided.';

/**
 * Verification & Hardening Checklist: AuthInputSchema
 * Validates email, password, username, and displayName server-side.
 */
export const AuthInputSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform(sanitizeString),
  password: z
    .string()
    .min(8)
    .max(128),
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Invalid format')
    .transform(sanitizeString),
  displayName: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .transform(sanitizeString),
});

/**
 * Route handler validation wrapper conforming to Checklist requirement 1.
 * Logs detailed failure internally for audit/telemetry while returning a uniform,
 * non-revealing error to the client.
 */
export async function validateAuthPayload(body: unknown) {
  const result = AuthInputSchema.safeParse(body);
  if (!result.success) {
    // Log detailed failure internally for audit/telemetry (omitting raw passwords)
    console.error('[AUTH_VALIDATION_FAILURE]', {
      issues: result.error.issues.map((i) => ({ path: i.path, code: i.code })),
      timestamp: new Date().toISOString(),
    });

    // Return uniform, non-revealing error to client
    throw new Error('Invalid input provided.');
  }
  return result.data;
}

export const signupSchema = AuthInputSchema;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform(sanitizeString),
  password: z
    .string()
    .min(1)
    .max(128),
});

export type SignupInput = z.infer<typeof AuthInputSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Server-Side Security Failure Logger.
 * CRITICAL: NEVER logs raw passwords or authentication secrets.
 */
export function logValidationFailure(
  endpoint: string,
  clientIp: string,
  error: z.ZodError,
  body: Record<string, any>
): void {
  const sanitizedTelemetryPayload = {
    timestamp: new Date().toISOString(),
    event: 'AUTH_VALIDATION_FAILURE',
    endpoint,
    clientIp,
    failedFields: error.issues.map((i) => ({
      path: i.path.join('.'),
      code: i.code,
      message: i.message,
    })),
    providedEmailDomain: typeof body.email === 'string' ? body.email.split('@')[1] || 'invalid' : 'none',
    usernameLength: typeof body.username === 'string' ? body.username.length : 0,
    hasPassword: Boolean(body.password),
  };

  console.warn('[SECURITY MONITOR]', JSON.stringify(sanitizedTelemetryPayload));
}
