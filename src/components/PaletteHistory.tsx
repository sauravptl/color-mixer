import React from 'react';
import type { Palette } from '../stores/colorMixerStore';

interface PaletteHistoryProps {
  history: Palette[];
  onRestorePalette: (palette: Palette) => void;
  onAddToComparison: (palette: Palette) => void;
  onSaveToFavorites: (palette: Palette) => void;
  className?: string;
}

const PaletteHistory: React.FC<PaletteHistoryProps> = ({
  history,
  onRestorePalette,
  onAddToComparison,
  onSaveToFavorites,
  className = ''
}) => {
  if (history.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <div className="text-4xl mb-2">📚</div>
        <p>No palette history yet</p>
        <p className="text-sm">Your recent palettes will appear here</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold">Palette History</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {history.map((palette, index) => (
          <div
            key={`${palette.id}-${index}-${palette.createdAt.getTime()}`}
            className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex gap-1">
                {palette.colors.slice(0, 5).map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700"
                    style={{ backgroundColor: color.color }}
                    title={color.color}
                  />
                ))}
                {palette.colors.length > 5 && (
                  <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs">
                    +{palette.colors.length - 5}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{palette.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {palette.createdAt.toLocaleTimeString()}
                </div>
              </div>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => onRestorePalette(palette)}
                className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                title="Restore this palette"
              >
                ↺
              </button>
              <button
                onClick={() => onAddToComparison(palette)}
                className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600"
                title="Add to comparison"
              >
                ⚖️
              </button>
              <button
                onClick={() => onSaveToFavorites(palette)}
                className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium bg-amber-500 text-white hover:bg-amber-600"
                title="Save to favorites"
              >
                ⭐
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaletteHistory;
