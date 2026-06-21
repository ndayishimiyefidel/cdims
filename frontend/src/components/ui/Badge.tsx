import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  primary: 'bg-primary-50 text-primary-700 border-primary-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  gray: 'bg-gray-100 text-gray-600 border-gray-200',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-400',
  primary: 'bg-primary-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  gray: 'bg-gray-400',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

// Pre-configured status badges for common use cases
export const StatusBadge: React.FC<{
  status: string;
  size?: BadgeSize;
  className?: string;
}> = ({ status, size = 'md', className = '' }) => {
  const getVariant = (): BadgeVariant => {
    const s = status.toUpperCase();
    if (s === 'ACTIVE' || s === 'APPROVED' || s === 'COMPLETED' || s === 'RECEIVED' || s === 'DELIVERED') return 'success';
    if (s === 'PENDING' || s === 'INACTIVE' || s === 'WAITING_PADIRI_REVIEW') return 'warning';
    if (s === 'REJECTED' || s === 'ISSUED') return 'danger';
    if (s === 'CLOSED' || s === 'ARCHIVED') return 'gray';
    if (s === 'VERIFIED' || s === 'WAITING_PADIRI_REVIEW') return 'info';
    if (s === 'DRAFT') return 'default';
    return 'primary';
  };

  const getDisplayText = (): string => {
    const s = status.toUpperCase();
    if (s === 'WAITING_PADIRI_REVIEW') return 'Pending Review';
    if (s === 'WAITING_APPROVAL') return 'Pending Approval';
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <Badge variant={getVariant()} size={size} dot className={className}>
      {getDisplayText()}
    </Badge>
  );
};

export default Badge;
