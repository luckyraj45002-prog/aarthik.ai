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
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7DFD5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3.5">
          {/* ============================================================== */}
          {/* LEFT: Official 3D Purple Arrow Logo + Wordmark + Subtitle     */}
          {/* ============================================================== */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => onNavigateRoute('app')}
          >
            <div className="w-11 h-11 rounded-2xl bg-white border border-[#E4D9CC] shadow-clay-sm p-1.5 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <img
                src="./aarthik-logo.png"
                alt="Aarthik.ai 3D Purple Ascending Rupee Arrow"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-2xl font-black tracking-tight text-[#0F172A]">
                  Aarthik<span className="text-[#7C3AED]">.ai</span>
                </span>
              </div>
              <span className="text-[10px] tracking-wider uppercase font-bold text-[#7C3AED] -mt-0.5">
                DIAGNOSTIC FINANCIAL CO-PILOT
              </span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT: Status Badge, Reset to Default, Account Dropdown        */}
          {/* ============================================================== */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* User Profile / Auth Status Badge (Live Cloud Sync vs. Offline Demo) */}
            {isCloudSyncActive ? (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs"
                title="Continuous encrypted synchronization with Supabase cloud vault"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="hidden sm:inline">Live Cloud Sync</span>
                <span className="sm:hidden">Live</span>
              </div>
            ) : (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-[#7C3AED] border border-purple-200/80 shadow-xs"
                title="Running locally with Zero-Knowledge encryption in offline sandbox mode"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span className="hidden sm:inline">Offline Demo</span>
                <span className="sm:hidden">Demo</span>
              </div>
            )}

            {/* Single Minimal "Reset to Default" Button */}
            <button
              onClick={resetToDefault}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DACFBF] hover:bg-[#F6F0E7] text-[#0F172A] text-xs font-bold shadow-clay-sm transition-all hover:scale-[1.02] active:scale-95"
              title="Reset all mathematical solvers & variables to default baseline"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span className="hidden sm:inline">Reset to Default</span>
              <span className="sm:hidden">Reset</span>
            </button>

            {/* Account / Sign Out Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-white border border-[#DACFBF] shadow-clay-sm hover:bg-[#F6F0E7] transition-all focus:outline-none"
                aria-label="User account menu"
              >
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center text-white font-black text-xs shadow-xs">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-warm-600 transition-transform duration-200 hidden sm:block ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`}
                />
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
      </div>
    </header>
  );
};
