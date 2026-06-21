import React from 'react';
import { Inbox, SearchX, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center py-16 px-6
        bg-white rounded-xl border border-gray-100 shadow-sm
        ${className}
      `}
    >
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        {icon || <Inbox className="w-8 h-8 text-gray-300" />}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 text-center max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {action.label}
        </button>
      )}
    </div>
  );
};

// Pre-configured empty states
export const SearchEmptyState: React.FC<{
  searchTerm: string;
  className?: string;
}> = ({ searchTerm, className = '' }) => (
  <EmptyState
    icon={<SearchX className="w-8 h-8 text-gray-300" />}
    title="No results found"
    description={`No records match "${searchTerm}". Try a different search term or clear filters.`}
    className={className}
  />
);

export default EmptyState;
