import React from 'react';
import type { Palette } from '../stores/colorMixerStore';

interface PaletteComparisonProps {
  palettes: Palette[];
  onRemovePalette: (id: string) => void;
  onClose: () => void;
  className?: string;
}

const PaletteComparison: React.FC<PaletteComparisonProps> = ({
  palettes,
  onRemovePalette,
  onClose,
  className = ''
}) => {
  if (palettes.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white dark:bg-slate-900/70 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-semibold">Palette Comparison</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xl"
        >
          ×
        </button>
      </div>

      <div className="p-4">
        <div className={`grid gap-4 ${palettes.length === 1 ? 'grid-cols-1' : palettes.length === 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
          {palettes.map((palette, index) => (
            <div key={palette.id || index} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900/70 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">{palette.name}</h4>
                <button
                  onClick={() => onRemovePalette(palette.id)}
                  className="text-slate-400 hover:text-rose-500 text-sm"
                  title="Remove from comparison"
                >
                  ✕
                </button>
              </div>

              {/* Color swatches */}
              <div className="space-y-2 mb-3">
                {palette.colors.map((color, colorIndex) => (
                  <div key={colorIndex} className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700 flex-shrink-0"
                      style={{ backgroundColor: color.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono truncate">{color.color}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Position: {(color.position * 100).toFixed(0)}%
                        {color.locked && ' 🔒'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample text */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-600">Sample Text:</div>
                {palette.colors.slice(0, 2).map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="text-sm p-2 rounded border"
                    style={{
                      backgroundColor: colorIndex === 0 ? color.color : '#ffffff',
                      color: colorIndex === 0 ? '#ffffff' : color.color,
                      borderColor: color.color
                    }}
                  >
                    The quick brown fox
                  </div>
                ))}
              </div>

              <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Created: {palette.createdAt.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {palettes.length > 1 && (
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-medium mb-3">Comparison Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Total Palettes:</span> {palettes.length}
              </div>
              <div>
                <span className="font-medium">Total Colors:</span> {palettes.reduce((sum, p) => sum + p.colors.length, 0)}
              </div>
              <div>
                <span className="font-medium">Avg Colors/Palette:</span> {(palettes.reduce((sum, p) => sum + p.colors.length, 0) / palettes.length).toFixed(1)}
              </div>
              <div>
                <span className="font-medium">Locked Colors:</span> {palettes.reduce((sum, p) => sum + p.colors.filter(c => c.locked).length, 0)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaletteComparison;
