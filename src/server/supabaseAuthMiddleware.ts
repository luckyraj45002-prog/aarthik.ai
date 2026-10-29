import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Server-side Supabase admin client for authenticated backend services
export const supabaseAdmin = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY || 'placeholder'
);

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role?: string;
  userMetadata?: Record<string, any>;
}

/**
 * Standard HTTP Request Interface for middleware compatibility (Express, Fastify, Next.js, Edge)
 */
export interface ServerRequest {
  headers: Record<string, string | string[] | undefined>;
  user?: AuthenticatedUser;
}

export interface ServerResponse {
  status: (code: number) => ServerResponse;
  json: (data: any) => void;
}

/**
 * Supabase Auth Guard / Protected Route Server Middleware
 *
 * 1. Extracts Bearer token from Authorization header
 * 2. Validates JWT cryptographically with Supabase Auth
 * 3. Enforces that only non-sensitive metadata is attached to req.user
 * 4. Blocks unauthenticated or tampered requests with 401
 */
export async function requireSupabaseAuth(
  req: ServerRequest,
  res: ServerResponse,
  next: () => void | Promise<void>
): Promise<void> {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Missing or malformed authorization token.' });
    return;
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  try {
    // Validate JWT session with Supabase
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Session expired or invalid credentials.' });
      return;
    }

    // Attach non-sensitive user metadata to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || user.role || 'user',
      userMetadata: {
        fullName: user.user_metadata?.full_name,
        plan: user.user_metadata?.plan || 'free',
      },
    };

    await next();
  } catch (err) {
    console.warn('[AUTH GUARD] Supabase JWT verification error:', err);
    res.status(401).json({ error: 'Authentication verification failure.' });
  }
}

