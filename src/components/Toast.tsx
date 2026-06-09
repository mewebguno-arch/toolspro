import React from 'react';
import { useToastContext } from '../context/ToastContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useToastContext();

  return (
    <div 
      id="toast-container" 
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0"
    >
      {toasts.map((item) => {
        let borderClass = 'border-l-indigo-600';
        let icon = <CheckCircle className="w-5 h-5 text-indigo-600" />;
        
        if (item.type === 'error') {
          borderClass = 'border-l-red-500';
          icon = <AlertCircle className="w-5 h-5 text-red-500" />;
        } else if (item.type === 'info') {
          borderClass = 'border-l-blue-500';
          icon = <Info className="w-5 h-5 text-blue-500" />;
        }

        return (
          <div
            key={item.id}
            className={`pointer-events-auto bg-surface dark:bg-[#1A1A2E] text-text-base flex items-start gap-3 p-4 rounded-xl shadow-xl border border-border/40 border-l-4 ${borderClass} transition-all duration-300 transform translate-y-0 opacity-100`}
            role="alert"
          >
            <div className="flex-shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 text-sm font-medium pr-2">
              {item.message}
            </div>
            <button
              onClick={() => removeToast(item.id)}
              className="flex-shrink-0 text-muted hover:text-text-base transition-colors rounded-lg p-0.5 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
