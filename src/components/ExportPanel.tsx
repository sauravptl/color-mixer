import React, { useState } from 'react';
import { generateAllExports, type ExportFormat } from '../utils/colorHarmony';

interface ExportPanelProps {
  baseColor: string;
  paletteName?: string;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ baseColor, paletteName = 'palette' }) => {
  const [exportName, setExportName] = useState(paletteName);
  const [exports, setExports] = useState<ExportFormat[]>([]);

  const handleGenerateExports = () => {
    const generatedExports = generateAllExports(baseColor, exportName);
    setExports(generatedExports);
  };

  const handleCopyToClipboard = async (content: string, formatName: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // Could add toast notification here
      alert(`${formatName} copied to clipboard!`);
    } catch {
      alert('Failed to copy to clipboard');
    }
  };

  const handleDownloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFileIcon = (format: string) => {
    switch (format) {
      case 'css': return '🎨';
      case 'scss': return '💅';
      case 'js': return '⚛️';
      case 'json': return '📄';
      case 'svg': return '🎭';
      case 'ase': return '🎨';
      case 'vue': return '💚';
      default: return '📁';
    }
  };

  const categorizeExports = (exports: ExportFormat[]) => {
    const categories = {
      'Stylesheets': ['css', 'scss'],
      'Design Systems': ['js', 'json'],
      'Graphics': ['svg', 'ase'],
      'Components': ['vue']
    };

    const categorized: { [key: string]: ExportFormat[] } = {};

    Object.entries(categories).forEach(([category, formats]) => {
      categorized[category] = exports.filter(exp => formats.includes(exp.format));
    });

    return categorized;
  };

  return (
    <div className="w-full space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Export Your Palette</h3>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
          Export your color palette in multiple formats for any design workflow
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          From CSS variables to design tokens, we've got all your export needs covered
        </p>
      </div>

      {/* Export Configuration */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border-2 border-indigo-200 dark:border-indigo-800 shadow-sm">
        <div className="text-center mb-6">
          <h4 className="text-2xl font-bold text-indigo-900 dark:text-indigo-200 mb-2">Configure Your Export</h4>
          <p className="text-indigo-700 dark:text-indigo-300">
            Customize the name and preview your base color before generating exports
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-6">
          <div className="text-center">
            <div
              className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-700 shadow-xl mb-4"
              style={{ backgroundColor: baseColor }}
            />
            <div className="text-xl font-mono font-bold text-indigo-900 dark:text-indigo-200">{baseColor}</div>
            <div className="text-sm text-indigo-700 dark:text-indigo-300">Base Color</div>
          </div>
          
          <div className="flex-1 max-w-md">
            <label className="block text-lg font-semibold text-indigo-900 dark:text-indigo-200 mb-3">
              Palette Name
            </label>
            <input
              type="text"
              value={exportName}
              onChange={(e) => setExportName(e.target.value)}
              placeholder="Enter palette name..."
              className="w-full rounded-xl border-2 border-indigo-300 dark:border-indigo-600 bg-white dark:bg-slate-900 px-6 py-4 text-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
            <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">
              This name will be used in variable names and file names
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={handleGenerateExports}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 text-lg"
          >
            🚀 Generate All Export Formats
          </button>
        </div>
      </div>

      {/* Export Results */}
      {exports.length > 0 && (
        <div className="space-y-10">
          {Object.entries(categorizeExports(exports)).map(([category, categoryExports]) => (
            categoryExports.length > 0 && (
              <div key={category} className="bg-white dark:bg-slate-900/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h4 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200 text-center">
                  {category === 'Stylesheets' ? '🎨' : category === 'Design Systems' ? '🔧' : category === 'Graphics' ? '🎭' : '⚛️'} {category}
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {categoryExports.map((exportFormat, index) => (
                    <div key={index} className="group bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:shadow-lg">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-200">
                          <span className="text-3xl">{getFileIcon(exportFormat.format)}</span>
                        </div>
                        <h5 className="font-bold text-lg text-slate-900 dark:text-slate-100">{exportFormat.name}</h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400 uppercase font-semibold tracking-wider">
                          {exportFormat.format} FORMAT
                        </p>
                      </div>

                      {/* Code Preview */}
                      <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-4 mb-4 max-h-32 overflow-y-auto border border-slate-700">
                        <pre className="text-xs font-mono text-slate-300 dark:text-slate-400 whitespace-pre-wrap">
                          {exportFormat.content.length > 150
                            ? exportFormat.content.substring(0, 150) + '...'
                            : exportFormat.content
                          }
                        </pre>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleCopyToClipboard(exportFormat.content, exportFormat.name)}
                          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-md active:scale-95"
                        >
                          <span>📋</span>
                          Copy
                        </button>
                        <button
                          onClick={() => handleDownloadFile(exportFormat.content, exportFormat.filename)}
                          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-purple-500 text-white hover:bg-purple-600 hover:shadow-md active:scale-95"
                        >
                          <span>💾</span>
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Usage Instructions */}
      {exports.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800">
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-2">📚 How to Use Your Exports</h4>
            <p className="text-blue-700 dark:text-blue-300">
              Quick integration guide for each export format
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
              <h5 className="font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                🎨 CSS/SCSS
              </h5>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <p>• Import custom properties into your stylesheets</p>
                <p>• Use variables for consistent theming</p>
                <p>• Perfect for design system implementation</p>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
              <h5 className="font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                ⚛️ JavaScript
              </h5>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <p>• Extend your Tailwind config theme</p>
                <p>• Use in React, Vue, or any JS framework</p>
                <p>• Dynamic color management</p>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
              <h5 className="font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                🎭 Design Tools
              </h5>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <p>• Import JSON tokens into Figma/Sketch</p>
                <p>• Use SVG files in graphics software</p>
                <p>• ASE files work with Adobe Creative Suite</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No exports message */}
      {exports.length === 0 && (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🎨</div>
          <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Ready to Export?</h4>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            Configure your palette name above and click "Generate All Export Formats"
          </p>
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 border border-slate-300 dark:border-slate-600">
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p>✨ CSS custom properties</p>
                <p>🎯 Tailwind CSS config</p>
                <p>📄 Design tokens (JSON)</p>
                <p>🎨 SVG color definitions</p>
                <p>⚛️ React/Vue components</p>
                <p>💎 Adobe ASE swatches</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
                        </div>
                      </div>

                      {/* Code Preview */}
                      <div className="bg-slate-50 dark:bg-slate-800/60 rounded p-3 mb-3 max-h-32 overflow-y-auto border border-slate-200 dark:border-slate-700">
                        <pre className="text-xs font-mono whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                          {exportFormat.content.length > 200
                            ? exportFormat.content.substring(0, 200) + '...'
                            : exportFormat.content
                          }
                        </pre>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopyToClipboard(exportFormat.content, exportFormat.name)}
                          className="flex-1 inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          📋 Copy
                        </button>
                        <button
                          onClick={() => handleDownloadFile(exportFormat.content, exportFormat.filename)}
                          className="flex-1 inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-purple-500 text-white hover:bg-purple-600"
                        >
                          💾 Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Usage Instructions */}
      {exports.length > 0 && (
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200/60">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">How to use:</h4>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200/90">
            <p><strong>CSS/SCSS:</strong> Copy the custom properties into your stylesheets</p>
            <p><strong>JavaScript:</strong> Use the Tailwind config to extend your theme</p>
            <p><strong>JSON:</strong> Import design tokens into Figma, Sketch, or other design tools</p>
            <p><strong>SVG:</strong> Use in web graphics or design applications</p>
            <p><strong>ASE:</strong> Import into Adobe applications (Photoshop, Illustrator, etc.)</p>
            <p><strong>Vue/React:</strong> Copy component code into your projects</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportPanel;
