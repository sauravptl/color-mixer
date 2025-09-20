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
    <div className="w-full space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Shade & Tint Generation</h3>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
          Generate intermediate colors, tints, and shades from your palette
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Create smooth color transitions and explore variations of your chosen colors
        </p>
      </p>

      {/* Between Colors Shades */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-8 border-2 border-emerald-200 dark:border-emerald-800 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="text-center mb-6">
          <h4 className="text-2xl font-bold text-emerald-900 dark:text-emerald-200 mb-2">Generate Shades Between Colors</h4>
          <p className="text-emerald-700 dark:text-emerald-300">
            Create smooth color transitions between any two colors from your palette
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-6 mb-8">
          <div
            className="text-center"
          >
            <div
              className="w-20 h-20 rounded-2xl border-4 border-white dark:border-slate-700 shadow-xl mb-3"
              style={{ backgroundColor: color1 }}
            />
            <div className="text-sm font-mono font-bold text-emerald-800 dark:text-emerald-200">{color1}</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400">Start Color</div>
          </div>
          
          <div className="flex items-center">
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
            <span className="mx-4 text-2xl text-emerald-600 dark:text-emerald-400">→</span>
            <div className="w-16 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"></div>
          </div>
          
          <div
            className="text-center"
          >
            <div
              className="w-20 h-20 rounded-2xl border-4 border-white dark:border-slate-700 shadow-xl mb-3"
              style={{ backgroundColor: color2 }}
            />
            <div className="text-sm font-mono font-bold text-emerald-800 dark:text-emerald-200">{color2}</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400">End Color</div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-6 mb-6">
          <label className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">Number of shades:</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="2"
              max="11"
              value={shadeCount}
              onChange={(e) => setShadeCount(parseInt(e.target.value))}
              className="w-32 h-3 bg-emerald-200 dark:bg-emerald-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-emerald-600 rounded-xl px-4 py-2 min-w-[60px] text-center">
              <span className="text-lg font-bold text-emerald-800 dark:text-emerald-200">{shadeCount}</span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={handleGenerateShades}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
          >
            Generate {shadeCount} Shades
          </button>
        </div>

        {generatedShades.length > 0 && (
          <div className="mt-8 p-6 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-emerald-200 dark:border-emerald-700">
            <h5 className="text-lg font-bold text-emerald-900 dark:text-emerald-200 mb-4 text-center">Generated Shades:</h5>
            <div className="flex justify-center flex-wrap gap-3 mb-4">
              {generatedShades.map((shade, index) => (
                <div
                  key={index}
                  className="group cursor-pointer text-center"
                  onClick={() => {
                    navigator.clipboard?.writeText(shade);
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-xl border-2 border-white dark:border-slate-700 shadow-lg hover:scale-110 transition-all duration-200 group-hover:shadow-xl"
                    style={{ backgroundColor: shade }}
                    title={`${shade} - Click to copy`}
                  />
                  <div className="text-xs font-mono text-emerald-700 dark:text-emerald-300 mt-1">{shade}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-emerald-600 dark:text-emerald-400 text-center">
              Click any shade to copy to clipboard • Use "Apply Shades" to replace your current palette
            </p>
          </div>
        )}
      </div>

      {/* Tints and Shades for Single Color */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="text-center mb-6">
          <h4 className="text-2xl font-bold text-purple-900 dark:text-purple-200 mb-2">Tints & Shades</h4>
          <p className="text-purple-700 dark:text-purple-300">
            Explore lighter (tints) and darker (shades) variations of your base color
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-4 mb-8">
          <div
            className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-700 shadow-xl"
            style={{ backgroundColor: color1 }}
          />
          <div
            className="text-center"
          >
            <div className="text-xl font-mono font-bold text-purple-900 dark:text-purple-200">{color1}</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Base Color</div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="text-center mb-6">
              <h5 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">✨ Tints (Lighter Variations)</h5>
              <p className="text-purple-600 dark:text-purple-400 text-sm">
                Mixed with white to create lighter, softer versions
              </p>
            </div>
            <div className="flex justify-center flex-wrap gap-3 mb-4">
              {tints.map((tint, index) => (
                <div
                  key={index}
                  className="group cursor-pointer text-center"
                  onClick={() => navigator.clipboard?.writeText(tint)}
                >
                  <div
                    className="w-14 h-14 rounded-xl border-2 border-white dark:border-slate-700 shadow-lg hover:scale-110 transition-all duration-200 group-hover:shadow-xl"
                    style={{ backgroundColor: tint }}
                    title={`${tint} - Click to copy`}
                  />
                  <div className="text-xs font-mono text-purple-700 dark:text-purple-300 mt-1">{tint}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-center mb-6">
              <h5 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">🌙 Shades (Darker Variations)</h5>
              <p className="text-purple-600 dark:text-purple-400 text-sm">
                Mixed with black to create deeper, richer versions
              </p>
            </div>
            <div className="flex justify-center flex-wrap gap-3 mb-4">
              {shades.map((shade, index) => (
                <div
                  key={index}
                  className="group cursor-pointer text-center"
                  onClick={() => navigator.clipboard?.writeText(shade)}
                >
                  <div
                    className="w-14 h-14 rounded-xl border-2 border-white dark:border-slate-700 shadow-lg hover:scale-110 transition-all duration-200 group-hover:shadow-xl"
                    style={{ backgroundColor: shade }}
                    title={`${shade} - Click to copy`}
                  />
                  <div className="text-xs font-mono text-purple-700 dark:text-purple-300 mt-1">{shade}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center pt-4 border-t border-purple-200 dark:border-purple-700">
            <p className="text-sm text-purple-600 dark:text-purple-400">
              💡 <strong>Pro Tip:</strong> Click any color to copy to clipboard • Perfect for creating design systems and consistent color scales
            </p>
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 border-2 border-amber-200 dark:border-amber-800">
        <div className="text-center">
          <h4 className="text-2xl font-bold text-amber-900 dark:text-amber-200 mb-4">🎨 Color Theory Tips</h4>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
              <h5 className="font-bold text-amber-800 dark:text-amber-200 mb-2">Best Practices for Tints</h5>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>• Use for backgrounds and subtle highlights</li>
                <li>• Perfect for hover states and light themes</li>
                <li>• Great for creating depth without contrast</li>
              </ul>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
              <h5 className="font-bold text-amber-800 dark:text-amber-200 mb-2">Best Practices for Shades</h5>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>• Use for text, borders, and emphasis</li>
                <li>• Perfect for dark themes and shadows</li>
                <li>• Creates strong visual hierarchy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
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
