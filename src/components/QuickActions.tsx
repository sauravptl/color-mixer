import React from 'react';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  description: string;
  shortcut?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions, className = '' }) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.action}
          className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-800/80 transition-all duration-200 group shadow-sm"
          title={`${action.description}${action.shortcut ? ` (${action.shortcut})` : ''}`}
        >
          <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">
            {action.icon}
          </span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
            {action.label}
          </span>
          {action.shortcut && (
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              {action.shortcut}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
