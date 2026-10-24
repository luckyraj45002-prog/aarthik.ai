import React from 'react';
import { useFinancialStore } from '../context/FinancialContext';
import { Sparkles, Home, LogIn, ShieldCheck } from 'lucide-react';

interface NotFoundPageProps {
  onNavigateRoute: (route: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateRoute }) => {
  const { enterDemoMode } = useFinancialStore();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 animate-in fade-in">
      <div className="max-w-md w-full clay-card p-8 sm:p-10 text-center space-y-6 border border-warm-200">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-white border border-warm-200 flex items-center justify-center shadow-clay-sm p-3">
          <img src="./aarthik-logo.png" alt="Aarthik.ai Logo" className="w-full h-full object-contain animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
            404 Error
          </span>
          <h1 className="text-2xl font-black text-warm-900">
            404 — Route Not Found in Your Financial Roadmap
          </h1>
          <p className="text-xs font-semibold text-warm-600 leading-relaxed pt-1">
            Even the Financial Time Machine couldn&apos;t locate this URL. Your capital and data remain safe inside your Lockbox.
          </p>
        </div>

        <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center gap-2 text-xs font-bold text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Fiduciary Lockbox Intact</span>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => onNavigateRoute('app')}
            className="w-full clay-btn-primary py-3 px-4 text-xs font-black flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-purple-200" />
            <span>Return to Dashboard</span>
          </button>

          <button
            onClick={() => {
              enterDemoMode();
              onNavigateRoute('app');
            }}
            className="w-full clay-btn-warm py-3 px-4 text-xs font-black flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Launch Demo Account (Rohit Kumar)</span>
          </button>

          <button
            onClick={() => onNavigateRoute('login')}
            className="w-full clay-btn-secondary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 text-warm-600" />
            <span>Go to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
