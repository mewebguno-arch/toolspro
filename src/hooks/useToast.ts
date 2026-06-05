import { useToastContext } from '../context/ToastContext';
import { ToastType } from '../types';

export function useToast() {
  const { addToast } = useToastContext();

  return {
    toast: (message: string, type?: ToastType) => addToast(message, type),
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    info: (message: string) => addToast(message, 'info'),
  };
}
