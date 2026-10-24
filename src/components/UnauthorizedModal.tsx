import React from 'react';
import { useDemo } from '../context/DemoContext';
import { Lock, Sparkles, LogIn, X, ShieldAlert } from 'lucide-react';

interface UnauthorizedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateLogin: () => void;
}

export const UnauthorizedModal: React.FC<UnauthorizedModalProps> = ({
  isOpen,
  onClose,
  onNavigateLogin,
}) => {
  const { enterDemoMode } = useDemo();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="clay-card p-6 sm:p-8 max-w-md w-full text-center space-y-6 relative border border-warm-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-warm-400 hover:text-warm-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-clay-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            401 / 403 Authentication Required
          </span>
          <h3 className="text-xl font-black text-warm-900">
            Protected Fiduciary Roadmap
          </h3>
          <p className="text-xs text-warm-600 leading-relaxed">
            This module requires an authenticated session with client-side Zero-Knowledge encryption keys, or activation of the Interactive Demo Sandbox.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => {
              enterDemoMode();
              onClose();
            }}
            className="w-full clay-btn-primary py-3 px-4 text-xs font-black flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Switch to Demo Account (Rohit Kumar)</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigateLogin();
            }}
            className="w-full clay-btn-secondary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 text-warm-600" />
            <span>Sign In to Existing Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
