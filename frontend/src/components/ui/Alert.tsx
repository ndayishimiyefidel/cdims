import React from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  message: string;
  onClose?: () => void;
  className?: string;
  dismissible?: boolean;
}

const variantStyles: Record<AlertVariant, { container: string; icon: React.ReactNode }> = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: <XCircle className="w-5 h-5 text-red-500" />,
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: <Info className="w-5 h-5 text-blue-500" />,
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  message,
  onClose,
  className = '',
  dismissible = true,
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 rounded-lg border
        ${styles.container}
        ${className}
      `}
      role="alert"
    >
      <span className="shrink-0 mt-0.5">{styles.icon}</span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="shrink-0 p-0.5 rounded hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Toast notification for floating alerts
interface ToastProps extends AlertProps {
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ duration = 3000, onClose, ...alertProps }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-down max-w-sm w-full">
      <Alert {...alertProps} onClose={onClose} dismissible />
    </div>
  );
};

export default Alert;
