import React, { useState } from 'react';
import { generateShadesBetween, generateTintsAndShades } from '../utils/colorHarmony';

interface ShadeGeneratorProps {
  color1: string;
  color2: string;
  onShadesGenerated: (shades: string[]) => void;
}

const ShadeGenerator: React.FC<ShadeGeneratorProps> = ({ color1, color2, onShadesGenerated }) => {
  const [shadeCount, setShadeCount] = useState(5);
  const [generatedShades, setGeneratedShades] = useState<string[]>([]);

  const handleGenerateShades = () => {
    const shades = generateShadesBetween(color1, color2, shadeCount);
    setGeneratedShades(shades);
    onShadesGenerated(shades);
  };

  const { tints, shades } = generateTintsAndShades(color1);

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Shade Generation</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Generate intermediate colors and variations
      </p>

      {/* Between Colors Shades */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900/70 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-sm font-medium mb-3">Generate Shades Between Colors</div>
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm"
            style={{ backgroundColor: color1 }}
          />
          <span className="text-sm">to</span>
          <div
            className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm"
            style={{ backgroundColor: color2 }}
          />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Shades:</label>
          <input
            type="number"
            min="2"
            max="11"
            value={shadeCount}
            onChange={(e) => setShadeCount(parseInt(e.target.value) || 5)}
            className="w-20 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">2-11 colors</span>
        </div>
        <button
          onClick={handleGenerateShades}
          className="w-full inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98]"
        >
          Generate Shades
        </button>

        {generatedShades.length > 0 && (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="text-sm font-medium mb-2">Generated Shades:</div>
            <div className="flex justify-center flex-wrap gap-2">
              {generatedShades.map((shade, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: shade }}
                  title={shade}
                  onClick={() => navigator.clipboard?.writeText(shade)}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
              Click any shade to copy to clipboard
            </p>
          </div>
        )}
      </div>

      {/* Tints and Shades for Single Color */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900/70 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-sm font-medium mb-3">Tints & Shades</div>
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm"
            style={{ backgroundColor: color1 }}
          />
          <div>
            <span className="text-sm font-mono">{color1}</span>
            <div className="text-xs text-slate-500 dark:text-slate-400">Base color</div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">Tints (Lighter)</div>
            <div className="flex justify-center flex-wrap gap-2">
              {tints.map((tint, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: tint }}
                  title={tint}
                  onClick={() => navigator.clipboard?.writeText(tint)}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">Shades (Darker)</div>
            <div className="flex justify-center flex-wrap gap-2">
              {shades.map((shade, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: shade }}
                  title={shade}
                  onClick={() => navigator.clipboard?.writeText(shade)}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Click any color to copy to clipboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShadeGenerator;
