'use client';

import React from 'react';
import { useForum } from '@/context/ForumContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useForum();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-indigo-500/30 dark:border-indigo-500/40 bg-zinc-900/95 text-white';
        let iconColor = 'text-indigo-400';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-emerald-500/40 bg-zinc-900/95 text-white shadow-emerald-500/10';
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'warning') {
          Icon = AlertCircle;
          borderClass = 'border-amber-500/40 bg-zinc-900/95 text-white shadow-amber-500/10';
          iconColor = 'text-amber-400';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          borderClass = 'border-red-500/40 bg-zinc-900/95 text-white shadow-red-500/10';
          iconColor = 'text-red-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl border shadow-2xl backdrop-blur-md text-xs animate-in slide-in-from-bottom-3 fade-in duration-200 ${borderClass}`}
          >
            <div className="flex items-center space-x-2.5 min-w-0 pr-2">
              <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
              <span className="leading-snug break-words">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
