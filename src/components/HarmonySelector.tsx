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
    <div className="w-full space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Color Harmonies</h3>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
          Choose from professionally designed color relationships based on color theory
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Each harmony follows proven design principles for creating balanced, beautiful color schemes
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">Current Base Color</h4>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl border-4 border-white dark:border-slate-700 shadow-lg"
            style={{ backgroundColor: baseColor }}
          />
          <div>
            <div className="text-xl font-mono font-bold text-blue-900 dark:text-blue-200">{baseColor}</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">All harmonies will be based on this color</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {harmonies.map((harmony) => (
          <div
            key={harmony.name}
            className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
              selectedHarmony === harmony.name ? 'scale-105' : ''
            }`}
            onClick={() => handleHarmonyClick(harmony)}
          >
            <div className={`relative bg-white dark:bg-slate-900/70 rounded-2xl border-2 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden ${
              selectedHarmony === harmony.name 
                ? 'border-indigo-500 shadow-indigo-200/50 dark:shadow-indigo-900/30' 
                : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600'
            }`}>
              {selectedHarmony === harmony.name && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}

              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="flex gap-2">
                    {harmony.colors.slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded-xl border-2 border-white dark:border-slate-700 shadow-lg group-hover:scale-110 transition-transform duration-200"
                        style={{ 
                          backgroundColor: color,
                          transitionDelay: `${index * 50}ms`
                        }}
                        title={color}
                      />
                    ))}
                    {harmony.colors.length > 4 && (
                      <div className="w-8 h-8 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
                        +{harmony.colors.length - 4}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{harmony.name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{harmony.description}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedHarmony && (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <h4 className="text-2xl font-bold text-indigo-900 dark:text-indigo-200 mb-2">
                {selectedHarmony} Harmony Selected
              </h4>
              <p className="text-indigo-700 dark:text-indigo-300">
                Click "Apply Harmony" to use these colors in your palette
              </p>
            </div>
            
            <div className="flex justify-center flex-wrap gap-3 mb-6">
              {harmonies.find(h => h.name === selectedHarmony)?.colors.map((color, index) => (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => navigator.clipboard?.writeText(color)}
                >
                  <div
                    className="w-16 h-16 rounded-2xl border-4 border-white dark:border-slate-700 shadow-xl hover:scale-110 transition-all duration-200 group-hover:shadow-2xl"
                    style={{ backgroundColor: color }}
                    title={`${color} - Click to copy`}
                  />
                  <div className="text-center mt-2">
                    <div className="text-xs font-mono text-indigo-700 dark:text-indigo-300">{color}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button
                onClick={() => handleHarmonyClick(harmonies.find(h => h.name === selectedHarmony)!)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                Apply {selectedHarmony} Harmony
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
};

export default HarmonySelector;
