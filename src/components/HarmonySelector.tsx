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
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">Color Harmonies</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Choose from professionally designed color relationships based on color theory
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {harmonies.map((harmony) => (
          <button
            key={harmony.name}
            onClick={() => handleHarmonyClick(harmony)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md active:scale-[0.98] ${
              selectedHarmony === harmony.name ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md' : ''
            }`}
          >
            <div className="flex justify-center gap-1 mb-3">
              {harmony.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {harmony.colors.length > 4 && (
                <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs">
                  +{harmony.colors.length - 4}
                </div>
              )}
            </div>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100 text-center mb-1">{harmony.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed">{harmony.description}</div>
          </button>
        ))}
      </div>

      {selectedHarmony && (
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <div className="text-sm font-medium mb-3 text-indigo-900 dark:text-indigo-200">Selected: {selectedHarmony}</div>
          <div className="flex justify-center flex-wrap gap-2">
            {harmonies.find(h => h.name === selectedHarmony)?.colors.map((color, index) => (
              <div
                key={index}
                className="w-10 h-10 rounded-lg border-2 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
                style={{ backgroundColor: color }}
                title={color}
                onClick={() => navigator.clipboard?.writeText(color)}
              />
            ))}
          </div>
          <p className="text-xs text-indigo-700 dark:text-indigo-300 text-center mt-2">
            Click any color to copy to clipboard
          </p>
        </div>
      )}
    </div>
  );
};

export default HarmonySelector;
