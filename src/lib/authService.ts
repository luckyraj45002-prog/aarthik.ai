import { supabase } from './supabaseClient';

// In-flight request deduplication map to prevent race conditions on rapid button spamming
const inFlightRequests = new Map<string, Promise<any>>();

function deduplicate<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlightRequests.get(key);
  if (existing) return existing;

  const promise = fn().finally(() => {
    setTimeout(() => inFlightRequests.delete(key), 400);
  });

  inFlightRequests.set(key, promise);
  return promise;
}

/**
 * 1. Google OAuth Sign-In
 * Redirects the user to Google with offline access and returns to specified route
 */
export const signInWithGoogle = async (redirectTo?: string) => {
  return deduplicate('oauth:google', async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || `${window.location.origin}/#app`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google sign-in error:', error.message);
      throw error;
    }
    return data;
  });
};

/**
 * 2. Email Sign-In (Password Login)
 */
export const signInWithEmailPassword = async (email: string, password: string) => {
  return deduplicate(`login:${email.toLowerCase()}`, async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  });
};

/**
 * 3. Email Sign-Up
 */
export const signUpWithEmailPassword = async (
  email: string,
  password: string,
  metadata?: Record<string, any>
) => {
  return deduplicate(`signup:${email.toLowerCase()}`, async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {},
      },
    });
    if (error) throw error;
    return data;
  });
};

/**
 * 4. Passwordless Magic Link / Email OTP
 */
export const sendEmailOtp = async (email: string, redirectTo?: string) => {
  return deduplicate(`magiclink:${email.toLowerCase()}`, async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo || `${window.location.origin}/#app`,
      },
    });
    if (error) throw error;
    return data;
  });
};

/**
 * 5. Phone Number OTP Sign-In (Two-Step Flow)
 * Step A: Send OTP to Phone (E.164 format with country code, e.g., +919876543210)
 */
export const sendPhoneOtp = async (phone: string) => {
  return deduplicate(`phone:${phone}`, async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });
    if (error) throw error;
    return data;
  });
};

/**
 * Step B: Verify the SMS Token
 */
export const verifyPhoneOtp = async (phone: string, token: string) => {
  return deduplicate(`verify:${phone}:${token}`, async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    if (error) throw error;
    return data;
  });
};

/**
 * 6. Sign Out
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

