export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: string; // large emoji
  gradient: string; // Tailwind gradient classes
  route: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}
