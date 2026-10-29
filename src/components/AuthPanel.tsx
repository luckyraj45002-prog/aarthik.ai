import React, { useState } from 'react';
import {
  signInWithGoogle,
  signInWithEmailPassword,
  sendEmailOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
} from '../lib/authService';
import { normalizeAuthError } from '../lib/authErrorNormalizer';
import { Mail, Phone, Lock, Sparkles, KeyRound, Loader2, CheckCircle2 } from 'lucide-react';

interface AuthPanelProps {
  onSuccess?: () => void;
}

export default function AuthPanel({ onSuccess }: AuthPanelProps) {
  const [tab, setTab] = useState<'google' | 'email' | 'phone'>('google');
  const [emailMode, setEmailMode] = useState<'password' | 'magic_link'>('password');

  // Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Status & loading
  const [status, setStatus] = useState<string>('');
  const [statusType, setStatusType] = useState<'info' | 'error' | 'success'>('info');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Google OAuth
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setStatus('Redirecting to Google...');
      setStatusType('info');
      await signInWithGoogle();
    } catch (err: any) {
      setStatus(normalizeAuthError(err));
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Email Login (Password or Magic Link)
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('Authenticating...');
    setStatusType('info');

    try {
      if (emailMode === 'password') {
        await signInWithEmailPassword(email.trim(), password);
        setStatus('Signed in successfully!');
        setStatusType('success');
        if (onSuccess) onSuccess();
      } else {
        await sendEmailOtp(email.trim());
        setStatus(`Magic link sent to ${email}. Check your inbox!`);
        setStatusType('success');
      }
    } catch (err: any) {
      setStatus(normalizeAuthError(err));
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Phone - Send OTP
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/[\s-]/g, '');

    if (!cleanPhone.startsWith('+') || cleanPhone.length < 10) {
      setStatus('Please include country code (e.g. +91 98765 43210)');
      setStatusType('error');
      return;
    }

    setIsLoading(true);
    setStatus('Sending verification code via SMS...');
    setStatusType('info');

    try {
      await sendPhoneOtp(cleanPhone);
      setOtpSent(true);
      setStatus(`6-digit code sent to ${cleanPhone}`);
      setStatusType('success');
    } catch (err: any) {
      setStatus(normalizeAuthError(err));
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Phone - Verify OTP
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/[\s-]/g, '');

    setIsLoading(true);
    setStatus('Verifying 6-digit OTP code...');
    setStatusType('info');

    try {
      await verifyPhoneOtp(cleanPhone, otp.trim());
      setStatus('Phone verified! Logged in successfully.');
      setStatusType('success');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setStatus(normalizeAuthError(err));
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="clay-card p-6 sm:p-8 max-w-md w-full mx-auto space-y-6">
      {/* 3-Tab Selector: Google | Email | Phone */}
      <div className="flex rounded-2xl bg-warm-100 p-1 border border-warm-200">
        <button
          type="button"
          onClick={() => {
            setTab('google');
            setStatus('');
          }}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            tab === 'google'
              ? 'bg-white text-warm-900 shadow-sm'
              : 'text-warm-600 hover:text-warm-900'
          }`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setTab('email');
            setStatus('');
          }}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            tab === 'email'
              ? 'bg-white text-warm-900 shadow-sm'
              : 'text-warm-600 hover:text-warm-900'
          }`}
        >
          <Mail className="w-3.5 h-3.5 text-purple-700" />
          <span>Email</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setTab('phone');
            setStatus('');
          }}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            tab === 'phone'
              ? 'bg-white text-warm-900 shadow-sm'
              : 'text-warm-600 hover:text-warm-900'
          }`}
        >
          <Phone className="w-3.5 h-3.5 text-purple-700" />
          <span>Phone</span>
        </button>
      </div>

      {/* 1. GOOGLE TAB */}
      {tab === 'google' && (
        <div className="space-y-4 py-2">
          <p className="text-xs text-warm-600 text-center font-medium">
            Fast, one-click access using your verified Google credentials.
          </p>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full clay-btn-primary py-3 px-4 text-xs font-black flex items-center justify-center gap-2.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 2. EMAIL TAB */}
      {tab === 'email' && (
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="flex justify-end gap-2 text-[11px] font-bold text-purple-700">
            <button
              type="button"
              onClick={() => setEmailMode(emailMode === 'password' ? 'magic_link' : 'password')}
              className="hover:underline"
            >
              {emailMode === 'password' ? 'Switch to Magic Link OTP' : 'Switch to Password'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-warm-800 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-warm-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3.5 py-2.5 clay-input text-xs font-semibold text-warm-900"
              />
            </div>
          </div>

          {emailMode === 'password' && (
            <div>
              <label className="block text-xs font-bold text-warm-800 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-warm-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 clay-input text-xs font-semibold text-warm-900"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full clay-btn-primary py-3 px-4 text-xs font-black flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{emailMode === 'password' ? 'Sign In with Email' : 'Send Magic Link OTP'}</span>
            )}
          </button>
        </form>
      )}

      {/* 3. PHONE TAB */}
      {tab === 'phone' && !otpSent && (
        <form onSubmit={handleSendPhoneOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-warm-800 mb-1">
              Mobile Number (E.164 with country code)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-warm-400 absolute left-3 top-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3.5 py-2.5 clay-input text-xs font-semibold text-warm-900"
              />
            </div>
            <p className="text-[10px] text-warm-500 mt-1">
              Include country code like +91 (India) or +1 (USA).
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full clay-btn-primary py-3 px-4 text-xs font-black flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending SMS...</span>
              </>
            ) : (
              <span>Send SMS OTP</span>
            )}
          </button>
        </form>
      )}

      {tab === 'phone' && otpSent && (
        <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-warm-800">
                Enter 6-Digit SMS Code
              </label>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-[11px] font-bold text-purple-700 hover:underline"
              >
                Change Number
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-warm-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                maxLength={6}
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full pl-9 pr-3.5 py-2.5 clay-input tracking-widest text-sm font-black text-warm-900 text-center"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full clay-btn-primary py-3 px-4 text-xs font-black flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify &amp; Sign In</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Dynamic Feedback Banner */}
      {status && (
        <div
          className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
            statusType === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : statusType === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-warm-100 text-warm-800 border border-warm-200'
          }`}
        >
          <span>{status}</span>
        </div>
      )}
    </div>
  );
}

