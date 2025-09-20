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
    <div className="w-full max-w-4xl">
      <h3 className="text-xl font-semibold mb-6 text-center">Export Color Palette</h3>

      {/* Export Configuration */}
      <div className="bg-white dark:bg-slate-900/70 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700"
              style={{ backgroundColor: baseColor }}
            />
            <span className="text-sm font-medium font-mono">{baseColor}</span>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={exportName}
              onChange={(e) => setExportName(e.target.value)}
              placeholder="Palette name"
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleGenerateExports}
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            Generate Exports
          </button>
        </div>
      </div>

      {/* Export Results */}
      {exports.length > 0 && (
        <div className="space-y-8">
          {Object.entries(categorizeExports(exports)).map(([category, categoryExports]) => (
            categoryExports.length > 0 && (
              <div key={category}>
                <h4 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-200">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryExports.map((exportFormat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-900/70 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{getFileIcon(exportFormat.format)}</span>
                        <div>
                          <h5 className="font-semibold text-sm">{exportFormat.name}</h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">{exportFormat.format}</p>
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
