import { createClient } from '@supabase/supabase-js';

/**
 * Standard Edge / Server Request & Response abstractions
 * Compatible with Next.js, Cloudflare Workers, Node.js, and Supabase Edge Functions.
 */
export interface EdgeRequest {
  url: string;
  nextUrl?: {
    pathname: string;
    clone: () => { pathname: string };
  };
  headers: Headers | Record<string, string | string[] | undefined>;
  cookies?: {
    getAll: () => Array<{ name: string; value: string }>;
    set: (name: string, value: string, options?: any) => void;
  };
}

/**
 * Supabase Auth Route Guard / Middleware
 * Intercepts unauthorized requests before protected data or server routes render.
 */
export async function authMiddleware(request: EdgeRequest) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  // Extract auth token from Authorization header or cookie
  let token = '';
  if (request.headers instanceof Headers) {
    token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') || '';
  } else if (typeof request.headers?.['authorization'] === 'string') {
    token = request.headers['authorization'].replace(/^Bearer\s+/i, '');
  }

  // Authenticate user session using getUser(token) to trigger token validation on server
  const { data: { user } } = await supabase.auth.getUser(token);

  const pathname = request.nextUrl?.pathname || (new URL(request.url).pathname);
  const isProtectedRoute = pathname.startsWith('/dashboard') ||
                           pathname.startsWith('/api/protected') ||
                           pathname.startsWith('/app');

  if (isProtectedRoute && !user) {
    return {
      authenticated: false,
      redirectUrl: '/login',
      status: 401,
      error: 'Authentication required',
    };
  }

  return {
    authenticated: true,
    user,
    status: 200,
  };
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*', '/app/:path*'],
};

