import React from 'react';
import { useDemo } from '../context/DemoContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useDemo();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
        let borderColor = 'border-emerald-300';
        let bgStyle = 'bg-[#FAF8F5]';

        if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
          borderColor = 'border-amber-300';
        } else if (toast.type === 'error') {
          icon = <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
          borderColor = 'border-red-300';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-purple-600 flex-shrink-0" />;
          borderColor = 'border-purple-300';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border ${borderColor} ${bgStyle} shadow-clay-lg transition-all transform animate-in fade-in slide-in-from-bottom-5`}
          >
            <div className="pt-0.5">{icon}</div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-warm-900">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-warm-700 mt-1 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-warm-400 hover:text-warm-700 p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
