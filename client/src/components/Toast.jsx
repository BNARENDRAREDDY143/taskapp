import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-card border backdrop-blur-md transition-all ${
          isSuccess
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-100 bg-white/95 dark:bg-slate-900/95'
            : isError
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-100 bg-white/95 dark:bg-slate-900/95'
            : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-900 dark:text-indigo-100 bg-white/95 dark:bg-slate-900/95'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-500 flex-shrink-0" />}

        <p className="text-sm font-medium">{message}</p>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
