import React, { useState, useMemo } from 'react';
import {
  checkWCAGCompliance,
  applyColorBlindnessFilter,
  COLOR_BLINDNESS_FILTERS,
  generateAccessibilitySuggestions,
  findBestAccessibleColor,
  type ContrastResult
} from '../utils/accessibility';

interface AccessibilityPanelProps {
  colors: string[];
  backgroundColor?: string;
  onColorFix?: (originalColor: string, fixedColor: string) => void;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  colors,
  backgroundColor = '#ffffff',
  onColorFix
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('Normal Vision');
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog');

  // Calculate accessibility for all color combinations
  const accessibilityResults = useMemo(() => {
    return colors.map(color => ({
      color,
      normalText: checkWCAGCompliance(color, backgroundColor, false),
      largeText: checkWCAGCompliance(color, backgroundColor, true),
      suggestions: generateAccessibilitySuggestions(color, backgroundColor, false)
    }));
  }, [colors, backgroundColor]);

  const getComplianceBadge = (result: ContrastResult, isLargeText: boolean) => {
    const meetsCriteria = isLargeText ? result.aa.large : result.aa.normal;
    const level = isLargeText ? 'AA Large' : 'AA Normal';

    return (
      <span
        className={`inline-block px-2 py-1 text-xs font-medium rounded ${
          meetsCriteria
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}
      >
        {level}
      </span>
    );
  };

  const handleFixColor = (originalColor: string, isLargeText: boolean = false) => {
    const fixedColor = findBestAccessibleColor(originalColor, backgroundColor, isLargeText);
    if (fixedColor && onColorFix) {
      onColorFix(originalColor, fixedColor);
    }
  };

  const getBlindnessSimulatedColor = (color: string) => {
    const filter = COLOR_BLINDNESS_FILTERS.find(f => f.name === selectedFilter);
    if (filter && selectedFilter !== 'Normal Vision') {
      return applyColorBlindnessFilter(color, filter);
    }
    return color;
  };

  return (
    <div className="w-full space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">♿ Accessibility Checker</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
          Ensure your color palette meets WCAG accessibility standards for inclusive design
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Test contrast ratios, simulate color blindness, and get suggestions for better accessibility
        </p>
      </div>

      {/* Background Color Setting */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-2">🎯 Background Color Settings</h3>
          <p className="text-blue-700 dark:text-blue-300">
            Set the background color to test your palette against
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-6">
          <div
            className="w-20 h-20 rounded-2xl border-4 border-white dark:border-slate-700 shadow-xl"
            style={{ backgroundColor }}
          />
          <div className="text-center">
            <div className="text-xl font-mono font-bold text-blue-900 dark:text-blue-200">{backgroundColor}</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Current background color</div>
          </div>
        </div>
      </div>

      {/* Contrast Analysis */}
      <div className="bg-white dark:bg-slate-900/70 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-semibold mb-4">Contrast Analysis</h3>

        <div className="space-y-4">
          {accessibilityResults.map((result, index) => (
            <div key={index} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700"
                    style={{ backgroundColor: result.color }}
                  />
                  <span className="font-mono text-sm">{result.color}</span>
                </div>
                <div className="flex gap-2">
                  {getComplianceBadge(result.normalText, false)}
                  {getComplianceBadge(result.largeText, true)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-sm font-medium">Normal Text</div>
                  <div className="text-lg font-bold">
                    {result.normalText.ratio.toFixed(2)}:1
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {result.normalText.recommendation}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Large Text (18pt+)</div>
                  <div className="text-lg font-bold">
                    {result.largeText.ratio.toFixed(2)}:1
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {result.largeText.recommendation}
                  </div>
                </div>
              </div>

              {/* Visual Preview */}
              <div className="mb-3">
                <div className="text-sm font-medium mb-2">Preview</div>
                <div
                  className="p-3 rounded border text-sm"
                  style={{
                    backgroundColor: backgroundColor,
                    color: result.color
                  }}
                >
                  {previewText}
                </div>
              </div>

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm font-medium mb-2">Suggestions</div>
                  <div className="space-y-2">
                    {result.suggestions.slice(0, 2).map((suggestion, sIndex) => (
                      <div key={sIndex} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-2 rounded border border-slate-200 dark:border-slate-700">
                        <div className="flex-1">
                          <div className="text-sm">{suggestion.description}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            +{(suggestion.improvement * 100).toFixed(1)}% improvement
                          </div>
                        </div>
                        <button
                          onClick={() => handleFixColor(result.color)}
                          className="ml-3 inline-flex items-center justify-center rounded-lg px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          Apply
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fix Buttons */}
              {(!result.normalText.aa.normal || !result.largeText.aa.large) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFixColor(result.color, false)}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600"
                  >
                    Fix for Normal Text
                  </button>
                  <button
                    onClick={() => handleFixColor(result.color, true)}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Fix for Large Text
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preview Text Input */}
      <div className="bg-white dark:bg-slate-900/70 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-semibold mb-4">Preview Text</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Color Blindness Filter</label>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {COLOR_BLINDNESS_FILTERS.map(filter => (
                <option key={filter.name} value={filter.name}>
                  {filter.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {COLOR_BLINDNESS_FILTERS.find(f => f.name === selectedFilter)?.description}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {colors.slice(0, 8).map((color, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-16 h-16 rounded-lg border-2 border-slate-300 dark:border-slate-700 mx-auto mb-2"
                  style={{ backgroundColor: getBlindnessSimulatedColor(color) }}
                />
                <div className="text-xs font-mono">{color}</div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Custom Preview Text</label>
            <textarea
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Enter text to preview with your colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPanel;
