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
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4 ${className}`}>
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.action}
          disabled={action.disabled}
          className={`flex flex-col items-center justify-center p-4 sm:p-5 bg-white dark:bg-slate-900/70 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-blue-50 dark:hover:from-indigo-900/20 dark:hover:to-blue-900/20 transition-all duration-300 group shadow-sm hover:shadow-xl active:scale-95 min-h-[100px] sm:min-h-[110px] touch-manipulation ${
            action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'
          }`}
          title={`${action.description}${action.shortcut ? ` (${action.shortcut})` : ''}`}
        >
          <span className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-125 transition-all duration-300 filter group-hover:drop-shadow-sm">
            {action.icon}
          </span>
          <span className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 text-center leading-tight transition-colors duration-200">
            {action.label}
          </span>
          {action.shortcut && (
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 sm:mt-2 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full hidden sm:inline-block transition-colors">
              {action.shortcut}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
