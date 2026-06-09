import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useToastContext } from '../context/ToastContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useToastContext();

  return (
    <div 
      id="toast-container" 
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full"
    >
      <AnimatePresence>
        {toasts.map((item) => {
          // Determine color and icon scheme
          let borderClass = 'border-l-success';
          let icon = <CheckCircle className="w-5 h-5 text-success" />;
          
          if (item.type === 'error') {
            borderClass = 'border-l-red-500';
            icon = <AlertCircle className="w-5 h-5 text-red-500" />;
          } else if (item.type === 'info') {
            borderClass = 'border-l-blue-500';
            icon = <Info className="w-5 h-5 text-blue-500" />;
          }

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`pointer-events-auto bg-surface dark:bg-[#1A1A2E] text-text-base flex items-start gap-3 p-4 rounded-xl shadow-xl border border-border/40 border-l-4 ${borderClass}`}
              role="alert"
            >
              <div className="flex-shrink-0 mt-0.5">{icon}</div>
              <div className="flex-1 text-sm font-medium pr-2">
                {item.message}
              </div>
              <button
                onClick={() => removeToast(item.id)}
                className="flex-shrink-0 text-muted hover:text-text-base transition-colors rounded-lg p-0.5"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
export default Toast;
