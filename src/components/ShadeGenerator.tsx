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
    <div className="w-full max-w-md space-y-4">
      <h3 className="text-lg font-semibold">Shade Generation</h3>

      {/* Between Colors Shades */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900/70 shadow-sm">
        <div className="text-sm font-medium mb-3">Generate Shades Between Colors</div>
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded border border-slate-300 dark:border-slate-700"
            style={{ backgroundColor: color1 }}
          />
          <span className="text-sm">to</span>
          <div
            className="w-6 h-6 rounded border border-slate-300 dark:border-slate-700"
            style={{ backgroundColor: color2 }}
          />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm">Number of shades:</label>
          <input
            type="number"
            min="2"
            max="11"
            value={shadeCount}
            onChange={(e) => setShadeCount(parseInt(e.target.value) || 5)}
            className="w-16 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={handleGenerateShades}
          className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600"
        >
          Generate Shades
        </button>

        {generatedShades.length > 0 && (
          <div className="mt-3">
            <div className="text-sm font-medium mb-2">Generated Shades:</div>
            <div className="flex flex-wrap gap-1">
              {generatedShades.map((shade, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded border border-slate-300 dark:border-slate-700"
                  style={{ backgroundColor: shade }}
                  title={shade}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tints and Shades for Single Color */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900/70 shadow-sm">
        <div className="text-sm font-medium mb-3">Tints & Shades</div>
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700"
            style={{ backgroundColor: color1 }}
          />
          <span className="text-sm">{color1}</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-xs font-medium text-gray-600 mb-2">Tints (Lighter)</div>
            <div className="flex flex-wrap gap-1">
              {tints.map((tint, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded border border-slate-300 dark:border-slate-700"
                  style={{ backgroundColor: tint }}
                  title={tint}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-600 mb-2">Shades (Darker)</div>
            <div className="flex flex-wrap gap-1">
              {shades.map((shade, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded border border-slate-300 dark:border-slate-700"
                  style={{ backgroundColor: shade }}
                  title={shade}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShadeGenerator;
