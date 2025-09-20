import React, { useState } from 'react';
import type { ColorHarmony } from '../utils/colorHarmony';
import { getAllHarmonies } from '../utils/colorHarmony';

interface HarmonySelectorProps {
  baseColor: string;
  onHarmonySelect: (harmony: ColorHarmony) => void;
}

const HarmonySelector: React.FC<HarmonySelectorProps> = ({ baseColor, onHarmonySelect }) => {
  const [selectedHarmony, setSelectedHarmony] = useState<string>('');

  const harmonies = getAllHarmonies(baseColor);

  const handleHarmonyClick = (harmony: ColorHarmony) => {
    setSelectedHarmony(harmony.name);
    onHarmonySelect(harmony);
  };

  return (
    <div className="w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Color Harmonies</h3>

      <div className="grid grid-cols-2 gap-3">
        {harmonies.map((harmony) => (
          <button
            key={harmony.name}
            onClick={() => handleHarmonyClick(harmony)}
            className={`p-3 rounded-xl border-2 transition-all bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm ${
              selectedHarmony === harmony.name ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''
            }`}
          >
            <div className="flex gap-1 mb-2">
              {harmony.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700"
                  style={{ backgroundColor: color }}
                />
              ))}
              {harmony.colors.length > 4 && (
                <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs">
                  +{harmony.colors.length - 4}
                </div>
              )}
            </div>
            <div className="text-sm font-medium">{harmony.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{harmony.description}</div>
          </button>
        ))}
      </div>

      {selectedHarmony && (
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-sm font-medium mb-2">Selected: {selectedHarmony}</div>
          <div className="flex flex-wrap gap-2">
            {harmonies.find(h => h.name === selectedHarmony)?.colors.map((color, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HarmonySelector;
