import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SolverErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Deterministic Solver Integrity Exception caught:', error, errorInfo);
  }

  private handleResetState = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F4EC] flex items-center justify-center p-4">
          <div className="clay-card max-w-lg w-full p-8 text-center space-y-6 border-2 border-red-200">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 shadow-clay-sm">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-100 px-3 py-1 rounded-full">
                500 — Mathematical Solver Guardrail Triggered
              </span>
              <h2 className="text-2xl font-black text-warm-900">
                Integrity Lock Engaged
              </h2>
              <p className="text-xs text-warm-600 leading-relaxed">
                To prevent unverified or corrupted financial figures from displaying, Aarthik.ai has halted rendering. Your encrypted financial state is protected.
              </p>
            </div>

            <div className="p-3 bg-warm-50 rounded-2xl border border-warm-200 text-left text-xs font-mono text-warm-800 break-words max-h-24 overflow-y-auto">
              {this.state.error?.message || 'Calculation invariant violated.'}
            </div>

            <div className="pt-2">
              <button
                onClick={this.handleResetState}
                className="w-full clay-btn-primary py-3 px-4 text-xs font-black flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-purple-200" />
                <span>Reset Application State &amp; Restore Baseline</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-warm-500 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Aarthik.ai Fiduciary Guard Guarantee</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
