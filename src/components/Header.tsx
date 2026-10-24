import React, { useState } from 'react';
import { useFinancialStore } from '../context/FinancialContext';
import { ShieldCheck, RotateCcw, User, ExternalLink, LogOut, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onOpenAdvisorModal: () => void;
  onNavigateRoute: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdvisorModal, onNavigateRoute }) => {
  const { isDemoMode, enterDemoMode, exitDemoMode, resetDemoData, advisorVerified, profile } =
    useFinancialStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7DFD5]">
      {/* Top Demo Sub-Banner if in Demo Mode */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-[#2A1B14] via-[#3C271C] to-[#2A1B14] text-[#F5EDE1] px-4 py-1.5 text-xs font-medium flex items-center justify-between border-b border-[#523A2C]">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-purple-200">Prototype demo</span>
              <span className="hidden sm:inline text-warm-300">
                · All figures are live reactive sample data for {profile.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetDemoData}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-warm-800/90 hover:bg-warm-700 text-amber-200 text-xs font-bold transition-all border border-warm-600/60 shadow-sm"
                title="Revert all variables to Rohit Kumar canonical baseline"
              >
                <RotateCcw className="w-3 h-3 text-amber-300" />
                <span>Reset Demo Data</span>
              </button>
              <button
                onClick={exitDemoMode}
                className="text-warm-300 hover:text-white underline text-xs font-medium"
              >
                Exit Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Brand Logo with the exact user uploaded image */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => onNavigateRoute('app')}
          >
            <div className="w-11 h-11 rounded-2xl bg-white border border-[#E4D9CC] shadow-clay-sm p-1.5 flex items-center justify-center overflow-hidden">
              <img
                src="./aarthik-logo.png"
                alt="Aarthik.ai 3D Logo"
                className="w-full h-full object-contain filter drop-shadow-sm transition-transform hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-2xl font-black tracking-tight text-[#111827]">
                  Aarthik<span className="text-[#6D28D9]">.ai</span>
                </span>
              </div>
              <span className="text-[10px] tracking-wider uppercase font-extrabold text-warm-600 -mt-1">
                Diagnostic Financial Co-Pilot
              </span>
            </div>

            {/* Mode badge */}
            {isDemoMode ? (
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold clay-badge-green ml-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{profile.name} Sandbox</span>
              </span>
            ) : (
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 ml-2">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Zero-Knowledge Live</span>
              </span>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Switcher if not in demo */}
            {!isDemoMode && (
              <button
                onClick={enterDemoMode}
                className="clay-btn-warm text-xs px-3 py-2 font-bold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Launch Demo (Rohit Kumar)</span>
              </button>
            )}

            {/* SEBI-RIA Advisor Switch */}
            <button
              onClick={onOpenAdvisorModal}
              className={`text-xs px-3.5 py-2 rounded-xl font-extrabold flex items-center gap-1.5 transition-all ${
                advisorVerified
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm'
                  : 'clay-btn-primary'
              }`}
            >
              {advisorVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>SEBI-RIA Approved</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-purple-200" />
                  <span className="hidden sm:inline">Advisor Portal (B2B2C)</span>
                  <span className="sm:hidden">Advisor</span>
                </>
              )}
            </button>

            {/* User Avatar Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-10 h-10 rounded-2xl bg-white border border-[#DACFBF] shadow-clay-sm flex items-center justify-center hover:bg-[#F6F0E7] transition-colors focus:outline-none"
                aria-label="User profile menu"
              >
                <div className="w-7 h-7 rounded-xl bg-warm-200 flex items-center justify-center text-warm-900 font-extrabold text-xs">
                  {profile.name ? profile.name.charAt(0) : 'R'}
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-clay-lg border border-warm-200 py-2 z-50 text-sm animate-in fade-in zoom-in-95">
                  <div className="px-4 py-3 border-b border-warm-100">
                    <p className="font-extrabold text-warm-900">{profile.name}</p>
                    <p className="text-xs text-warm-500 truncate">{profile.occupation}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                      {isDemoMode ? 'Interactive Sandbox Mode' : 'Verified Private Vault'}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigateRoute('app');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-warm-50 flex items-center gap-2 text-warm-800 text-xs font-semibold"
                    >
                      <User className="w-4 h-4 text-warm-500" />
                      <span>Edit Financial Profile (Tab 1)</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenAdvisorModal();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-warm-50 flex items-center gap-2 text-warm-800 text-xs font-semibold"
                    >
                      <ExternalLink className="w-4 h-4 text-warm-500" />
                      <span>SEBI-RIA Review Dossier</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigateRoute('privacy-policy');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-warm-50 text-xs text-warm-600 font-medium"
                    >
                      Zero-Knowledge Privacy Policy
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigateRoute('terms-and-conditions');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-warm-50 text-xs text-warm-600 font-medium"
                    >
                      Terms &amp; SEBI Disclosures
                    </button>
                  </div>

                  <div className="border-t border-warm-100 pt-1">
                    {isDemoMode ? (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          exitDemoMode();
                          onNavigateRoute('login');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Exit Demo Mode</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onNavigateRoute('login');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    )}
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
