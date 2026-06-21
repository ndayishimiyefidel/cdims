import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (variant: ToastVariant, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const context = React.useContext(ToastContext);
  if (!context) {
    // Return a no-op fallback if used outside provider
    return {
      toast: () => {},
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
    };
  }
  return context;
};

const variantStyles: Record<ToastVariant, { container: string; icon: React.ReactNode; border: string }> = {
  success: {
    container: 'bg-white border-l-4 border-green-500 shadow-lg',
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    border: 'border-green-500',
  },
  error: {
    container: 'bg-white border-l-4 border-red-500 shadow-lg',
    icon: <XCircle className="w-5 h-5 text-red-500" />,
    border: 'border-red-500',
  },
  warning: {
    container: 'bg-white border-l-4 border-yellow-500 shadow-lg',
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    border: 'border-yellow-500',
  },
  info: {
    container: 'bg-white border-l-4 border-blue-500 shadow-lg',
    icon: <Info className="w-5 h-5 text-blue-500" />,
    border: 'border-blue-500',
  },
};

const ToastItemComponent: React.FC<{
  item: ToastItem;
  onDismiss: (id: string) => void;
}> = ({ item, onDismiss }) => {
  const styles = variantStyles[item.variant];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(item.id);
    }, item.duration || 4000);
    return () => clearTimeout(timer);
  }, [item, onDismiss]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg ${styles.container} animate-slide-down`}
      role="alert"
    >
      <span className="shrink-0 mt-0.5">{styles.icon}</span>
      <p className="flex-1 text-sm font-medium text-gray-800">{item.message}</p>
      <button
        onClick={() => onDismiss(item.id)}
        className="shrink-0 p-0.5 rounded hover:bg-gray-100 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((variant: ToastVariant, message: string, duration?: number) => {
    counterRef.current += 1;
    const id = `toast-${counterRef.current}-${Date.now()}`;
    setToasts(prev => [...prev, { id, variant, message, duration }]);
  }, []);

  const contextValue: ToastContextValue = {
    toast: addToast,
    success: (msg, dur) => addToast('success', msg, dur),
    error: (msg, dur) => addToast('error', msg, dur),
    warning: (msg, dur) => addToast('warning', msg, dur),
    info: (msg, dur) => addToast('info', msg, dur),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(item => (
          <div key={item.id} className="pointer-events-auto">
            <ToastItemComponent item={item} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;
