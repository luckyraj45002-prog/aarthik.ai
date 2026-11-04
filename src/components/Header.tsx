import React, { useState, useRef, useEffect } from 'react';
import { useFinancialStore } from '../context/FinancialContext';
import {
  RotateCcw,
  User,
  ShieldCheck,
  LogOut,
  ExternalLink,
  ChevronDown,
  Lock,
  Cloud,
  RefreshCw,
} from 'lucide-react';

interface HeaderProps {
  onOpenAdvisorModal: () => void;
  onNavigateRoute: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdvisorModal, onNavigateRoute }) => {
  const {
    profile,
    isDemoMode,
    enterDemoMode,
    exitDemoMode,
    resetToDefault,
    isCloudSyncActive,
    authUserEmail,
    signOutUser,
  } = useFinancialStore();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full px-3 py-2.5 flex items-center justify-between gap-2 bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80 pt-[max(0.6rem,env(safe-area-inset-top))] transition-all">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* ============================================================== */}
        {/* LEFT: Official Logo + Wordmark + Subtitle                     */}
        {/* ============================================================== */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none group transition-transform active:scale-[0.98] shrink-0"
          onClick={() => onNavigateRoute('app')}
        >
          <img
            src="/logo.png"
            onError={(e) => {
              (e.target as HTMLImageElement).src = './aarthik-logo.png';
            }}
            alt="Aarthik.ai Logo"
            className="w-10 h-10 object-contain mix-blend-multiply shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
              Aarthik<span className="text-violet-600">.ai</span>
            </span>
            <span className="text-[10px] font-semibold text-violet-600 tracking-wider block">
              DIAGNOSTIC FINANCIAL CO-PILOT
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT: Compact Demo/Live Status, Reset, and Account Avatar    */}
        {/* ============================================================== */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* User Profile / Auth Status Badge */}
          {isCloudSyncActive ? (
            <div
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shrink-0"
              title="Continuous encrypted synchronization with Supabase cloud vault"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="hidden sm:inline">Live Cloud Sync</span>
              <span className="sm:hidden">Live</span>
            </div>
          ) : (
            <div
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-violet-600 border border-purple-200/80 shrink-0"
              title="Running locally with Zero-Knowledge encryption in offline sandbox mode"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
              <span>Demo</span>
            </div>
          )}

          {/* Single Minimal "Reset to Default" Button */}
          <button
            onClick={resetToDefault}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all shrink-0 active:scale-95"
            title="Reset all mathematical solvers & variables to default baseline"
          >
            <RotateCcw className="w-3 h-3 text-violet-600" />
            <span>Reset</span>
          </button>

          {/* Account / Sign Out Dropdown */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 text-white font-bold text-xs shadow-xs focus:outline-none transition-transform active:scale-95 shrink-0"
              aria-label="User account menu"
            >
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'R'}
            </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-clay-lg border border-[#E7DFD5] py-2.5 z-50 text-sm animate-in fade-in zoom-in-95 duration-150">
                  {/* User Profile Header */}
                  <div className="px-4 py-2.5 border-b border-[#F0E8DC]">
                    <p className="font-black text-[#0F172A] text-sm truncate">{profile.name}</p>
                    <p className="text-xs text-warm-600 truncate">{authUserEmail}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-50 text-[#7C3AED] border border-purple-200">
                        <Lock className="w-2.5 h-2.5 text-[#7C3AED]" />
                        Zero-Knowledge AES-256
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-warm-100 text-warm-800">
                        {isCloudSyncActive ? 'Cloud Synced' : 'Local Sandbox'}
                      </span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigateRoute('app');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FAF6F0] flex items-center gap-2.5 text-warm-900 text-xs font-semibold"
                    >
                      <User className="w-4 h-4 text-[#7C3AED]" />
                      <span>Edit Diagnostic Profile (Tab 1)</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenAdvisorModal();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FAF6F0] flex items-center gap-2.5 text-warm-900 text-xs font-semibold"
                    >
                      <ExternalLink className="w-4 h-4 text-[#7C3AED]" />
                      <span>SEBI-RIA Review Dossier</span>
                    </button>

                    {/* Mode Toggle */}
                    {isDemoMode ? (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          exitDemoMode();
                          onNavigateRoute('login');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#FAF6F0] flex items-center gap-2.5 text-warm-900 text-xs font-semibold"
                      >
                        <Cloud className="w-4 h-4 text-emerald-600" />
                        <span>Switch to Live Cloud Account</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          enterDemoMode();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#FAF6F0] flex items-center gap-2.5 text-warm-900 text-xs font-semibold"
                      >
                        <RefreshCw className="w-4 h-4 text-amber-600" />
                        <span>Switch to Offline Sandbox</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-[#F0E8DC]" />

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigateRoute('privacy-policy');
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#FAF6F0] text-xs text-warm-600 font-medium"
                    >
                      Zero-Knowledge Privacy Architecture
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigateRoute('terms-and-conditions');
                      }}
                      className="w-full text-left px-4 py-1.5 hover:bg-[#FAF6F0] text-xs text-warm-600 font-medium"
                    >
                      Terms of Service &amp; Fiduciary Disclosures
                    </button>
                  </div>

                  {/* Sign Out / Exit Action */}
                  <div className="border-t border-[#F0E8DC] pt-1 mt-1">
                    <button
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await signOutUser();
                        onNavigateRoute('login');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{isDemoMode ? 'Exit Demo to Login' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
  );
};
