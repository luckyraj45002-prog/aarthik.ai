import React, { useState } from 'react';
import { useFinancialStore } from '../context/FinancialContext';
import {
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';

interface AuthPagesProps {
  initialView?: 'login' | 'signup';
  onNavigateRoute: (route: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  initialView = 'login',
  onNavigateRoute,
}) => {
  const { enterDemoMode, updateProfile, addToast } = useFinancialStore();

  const [view, setView] = useState<'login' | 'signup'>(initialView);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password modal state
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('rohit.kumar@techcorp.in');
  const [loginPassword, setLoginPassword] = useState('SuperSecret@2026');

  // Sign up form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [role, setRole] = useState<'Investor' | 'SEBI_Advisor'>('Investor');
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const passwordStrength = getPasswordStrength(signupPassword);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enterDemoMode();
    onNavigateRoute('app');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate +91 phone
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
    if (!phoneRegex.test(mobileNumber.replace(/[\s-]/g, ''))) {
      addToast({
        type: 'error',
        title: 'Invalid Mobile Number',
        description: 'Please enter a valid 10-digit Indian mobile number (+91 format).',
      });
      return;
    }

    if (!consentPrivacy || !consentTerms) {
      addToast({
        type: 'warning',
        title: 'Consent Required',
        description: 'Please accept the Zero-Knowledge Privacy Policy and Fiduciary Terms & Conditions.',
      });
      return;
    }

    updateProfile({ name: fullName });
    onNavigateRoute('app');
    addToast({
      type: 'success',
      title: `Account Created for ${fullName}!`,
      description: 'Your private, encrypted financial vault is initialized.',
    });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordOpen(false);
    addToast({
      type: 'info',
      title: 'Reset Link Dispatched',
      description: `Encrypted password reset token sent to ${forgotEmail}. Valid for 15 minutes.`,
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-white border border-[#E2D8CA] shadow-clay-sm p-2 flex items-center justify-center">
            <img src="./aarthik-logo.png" alt="Aarthik.ai Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-3xl font-black text-[#111827]">
            Aarthik<span className="text-[#6D28D9]">.ai</span>
          </h2>
          <p className="text-xs font-semibold text-warm-600">
            {view === 'login'
              ? 'Access your encrypted diagnostic roadmap'
              : 'Create your private, Zero-Knowledge financial vault'}
          </p>
        </div>

        {/* Prominent One-Click Demo Button */}
        <div className="clay-card-warm p-4 text-center space-y-2 border-2 border-purple-300">
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block">
            Instant Sandbox Access
          </span>
          <button
            onClick={() => {
              enterDemoMode();
              onNavigateRoute('app');
            }}
            className="w-full clay-btn-primary py-3 px-4 text-xs font-black flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Explore Interactive Demo Account (Rohit Kumar)</span>
          </button>
          <p className="text-[10px] text-warm-500 font-semibold">
            Bypasses registration · Pre-populates ₹4L salary, ₹4.5L savings &amp; ₹60L house goal
          </p>
        </div>

        {/* Main Auth Form Card */}
        <div className="clay-card p-6 sm:p-8 space-y-6">
          {/* Tab Switcher */}
          <div className="flex rounded-2xl bg-warm-100 p-1 border border-warm-200">
            <button
              onClick={() => setView('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                view === 'login'
                  ? 'bg-white text-warm-900 shadow-sm'
                  : 'text-warm-600 hover:text-warm-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setView('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                view === 'signup'
                  ? 'bg-white text-warm-900 shadow-sm'
                  : 'text-warm-600 hover:text-warm-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* LOGIN VIEW */}
          {view === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-warm-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 clay-input text-xs font-semibold text-warm-900"
                    placeholder="name@example.com or +91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-warm-800">Password</label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-[11px] font-bold text-purple-700 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-warm-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 clay-input text-xs font-semibold text-warm-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-warm-400 hover:text-warm-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-warm-700 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Remember me</span>
                </label>
                <span className="text-[11px] text-warm-400 font-medium">Client-side session</span>
              </div>

              <button
                type="submit"
                className="w-full clay-btn-primary py-3 text-xs font-black flex items-center justify-center gap-2"
              >
                <span>Sign In to Financial Co-Pilot</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Social Sign-In Buttons */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-warm-200" />
                  <span className="flex-shrink mx-3 text-[10px] font-bold text-warm-400 uppercase">
                    Or Continue With
                  </span>
                  <div className="flex-grow border-t border-warm-200" />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      enterDemoMode();
                      onNavigateRoute('app');
                    }}
                    className="clay-btn-secondary py-2 px-3 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <span className="font-black text-warm-800">G</span>
                    <span>Google OAuth</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      enterDemoMode();
                      onNavigateRoute('app');
                    }}
                    className="clay-btn-secondary py-2 px-3 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-warm-700" />
                    <span>Phone OTP</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* SIGN UP VIEW */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-warm-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohit Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 clay-input text-xs font-semibold text-warm-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-warm-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 clay-input text-xs font-semibold text-warm-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">
                  Mobile Number (+91 format)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-warm-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 clay-input text-xs font-semibold text-warm-900"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">I am registering as:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('Investor')}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      role === 'Investor'
                        ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-sm'
                        : 'bg-warm-50 border-warm-200 text-warm-700'
                    }`}
                  >
                    Individual Investor
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('SEBI_Advisor')}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      role === 'SEBI_Advisor'
                        ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-sm'
                        : 'bg-warm-50 border-warm-200 text-warm-700'
                    }`}
                  >
                    SEBI-Registered RIA
                  </button>
                </div>
              </div>

              {/* Password & Strength Meter */}
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-warm-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 8 characters with symbol"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 clay-input text-xs font-semibold text-warm-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-warm-400 hover:text-warm-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {signupPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="w-full h-1.5 rounded-full bg-warm-200 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength <= 25
                            ? 'bg-red-500 w-1/4'
                            : passwordStrength <= 50
                            ? 'bg-amber-500 w-2/4'
                            : passwordStrength <= 75
                            ? 'bg-blue-500 w-3/4'
                            : 'bg-emerald-500 w-full'
                        }`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-semibold text-warm-500">
                      <span>Strength</span>
                      <span
                        className={
                          passwordStrength >= 75 ? 'text-emerald-700 font-bold' : 'text-warm-600'
                        }
                      >
                        {passwordStrength <= 25 && 'Weak'}
                        {passwordStrength === 50 && 'Fair'}
                        {passwordStrength === 75 && 'Good'}
                        {passwordStrength === 100 && 'Strong (Client-side ready)'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mandatory Consent Checkboxes */}
              <div className="space-y-2 pt-1 border-t border-warm-100">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-warm-700 leading-snug font-medium">
                  <input
                    type="checkbox"
                    required
                    checked={consentPrivacy}
                    onChange={(e) => setConsentPrivacy(e.target.checked)}
                    className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>
                    I consent to the{' '}
                    <button
                      type="button"
                      onClick={() => onNavigateRoute('privacy-policy')}
                      className="text-purple-700 underline font-bold"
                    >
                      Zero-Knowledge Privacy Policy
                    </button>{' '}
                    and Account Aggregator read-only data framework.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer text-xs text-warm-700 leading-snug font-medium">
                  <input
                    type="checkbox"
                    required
                    checked={consentTerms}
                    onChange={(e) => setConsentTerms(e.target.checked)}
                    className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => onNavigateRoute('terms-and-conditions')}
                      className="text-purple-700 underline font-bold"
                    >
                      Terms &amp; Conditions
                    </button>{' '}
                    and SEBI Fiduciary Disclosures.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full clay-btn-primary py-3 text-xs font-black flex items-center justify-center gap-2"
              >
                <span>Complete Registration &amp; Start Intake</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="clay-card p-6 sm:p-8 max-w-sm w-full space-y-4 relative border border-warm-200">
            <button
              onClick={() => setForgotPasswordOpen(false)}
              className="absolute top-4 right-4 text-warm-400 hover:text-warm-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-warm-100 pb-2">
              <h3 className="text-lg font-black text-warm-900">Reset Password</h3>
              <p className="text-xs text-warm-500 font-medium mt-0.5">
                Enter your verified email to receive a recovery token.
              </p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-warm-800 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="rohit.kumar@techcorp.in"
                  className="w-full px-3.5 py-2.5 clay-input text-xs font-semibold text-warm-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="clay-btn-secondary px-3 py-2 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="clay-btn-primary px-4 py-2 text-xs font-black"
                >
                  Send Recovery Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
