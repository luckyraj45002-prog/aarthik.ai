import React from 'react';
import { ShieldCheck, Lock, ExternalLink, HelpCircle } from 'lucide-react';

interface FooterProps {
  onNavigateRoute: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateRoute }) => {
  return (
    <footer className="mt-16 bg-[#F3EDE3] border-t border-[#E3D7C8] text-warm-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E0D5C7] shadow-sm p-1 flex items-center justify-center">
                <img
                  src="./aarthik-logo.png"
                  alt="Aarthik.ai Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-black text-[#111827]">
                Aarthik<span className="text-[#6D28D9]">.ai</span>
              </span>
            </div>
            <p className="text-xs text-warm-600 leading-relaxed font-medium">
              Diagnostic-first financial planning and literacy co-pilot for Indian salaried professionals. Rigid deterministic math, zero commissions, zero broker incentives.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Pure Fee-Only &amp; Product-Agnostic</span>
            </div>
          </div>

          {/* Fiduciary & SEBI */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-warm-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span>SEBI Regulatory Standard</span>
            </h4>
            <p className="text-xs text-warm-600 leading-relaxed font-medium">
              Operating in compliance with SEBI (Investment Advisers) Regulations, 2013. We do not distribute financial products or accept distributor trail commissions.
            </p>
            <button
              onClick={() => onNavigateRoute('terms-and-conditions')}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 underline flex items-center gap-1"
            >
              <span>View Fiduciary Charter</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Privacy & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-warm-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-purple-700" />
              <span>Zero-Knowledge Privacy</span>
            </h4>
            <p className="text-xs text-warm-600 leading-relaxed font-medium">
              End-to-end encrypted financial models. Cash-flow data and net-worth figures are never monetized, sold, or shared with lenders or telemarketers.
            </p>
            <button
              onClick={() => onNavigateRoute('privacy-policy')}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 underline flex items-center gap-1"
            >
              <span>Zero-Knowledge Architecture</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Nav & Edge Triggers */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-warm-900">
              Navigation &amp; Edge Cases
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => onNavigateRoute('privacy-policy')}
                  className="text-warm-700 hover:text-purple-700 hover:underline"
                >
                  Privacy Policy &amp; Account Aggregator Consent
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateRoute('terms-and-conditions')}
                  className="text-warm-700 hover:text-purple-700 hover:underline"
                >
                  Terms &amp; Conditions (MITC)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateRoute('404')}
                  className="text-warm-700 hover:text-purple-700 hover:underline flex items-center gap-1.5 font-bold"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Test 404 Route Handler</span>
                </button>
              </li>
              <li>
                <span className="text-[11px] text-warm-500 font-semibold">
                  Account Aggregator: Revocable, Read-Only Consent
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="pt-8 border-t border-[#E3D7C8] flex flex-col sm:flex-row items-center justify-between text-[11px] text-warm-500 gap-4">
          <p>© {new Date().getFullYear()} Aarthik.ai Technologies Private Limited. All mathematical solvers audited for deterministic integrity.</p>
          <div className="flex items-center space-x-4">
            <span className="font-bold text-warm-700">ISO 27001 Certified Infrastructure</span>
            <span>·</span>
            <span className="font-bold text-warm-700">AES-256 Client-Side Vault</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
