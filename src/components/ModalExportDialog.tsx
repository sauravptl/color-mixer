import React, { useState } from 'react';
import { generateAllExports, type ExportFormat } from '../utils/colorHarmony';

interface ModalExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  baseColor: string;
  paletteName?: string;
}

const ModalExportDialog: React.FC<ModalExportDialogProps> = ({
  isOpen,
  onClose,
  baseColor,
  paletteName = 'palette'
}) => {
  const [selectedExports, setSelectedExports] = useState<Set<string>>(new Set());
  const [exports, setExports] = useState<ExportFormat[]>([]);
  const [currentName, setCurrentName] = useState(paletteName);

  const allFormats = generateAllExports(baseColor, currentName);

  const handleGenerateSelected = () => {
    const selectedFormats = allFormats.filter(format => selectedExports.has(format.name));
    setExports(selectedFormats);
  };

  const handleSelectAll = () => {
    const allNames = new Set(allFormats.map(format => format.name));
    setSelectedExports(allNames);
  };

  const handleSelectNone = () => {
    setSelectedExports(new Set());
  };

  const handleFormatToggle = (formatName: string) => {
    const newSelected = new Set(selectedExports);
    if (newSelected.has(formatName)) {
      newSelected.delete(formatName);
    } else {
      newSelected.add(formatName);
    }
    setSelectedExports(newSelected);
  };

  const handleBulkDownload = () => {
    exports.forEach(exportFormat => {
      const blob = new Blob([exportFormat.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = exportFormat.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Export Color Palette</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Configuration */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700"
                  style={{ backgroundColor: baseColor }}
                />
                <span className="font-medium">Base Color: {baseColor}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Palette Name:</label>
              <input
                type="text"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter palette name"
              />
            </div>
          </div>

          {/* Format Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Export Formats</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Select All
                </button>
                <button
                  onClick={handleSelectNone}
                  className="px-3 py-1 text-sm rounded-md bg-slate-500 text-white hover:bg-slate-600"
                >
                  Select None
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {allFormats.map((format) => (
                <div key={format.name} className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/70 shadow-sm">
                  <input
                    type="checkbox"
                    checked={selectedExports.has(format.name)}
                    onChange={() => handleFormatToggle(format.name)}
                    className="w-4 h-4 text-indigo-600 accent-indigo-600"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-lg">
                      {format.format === 'css' ? '🎨' :
                       format.format === 'scss' ? '💅' :
                       format.format === 'js' ? '⚛️' :
                       format.format === 'json' ? '📄' :
                       format.format === 'svg' ? '🎭' :
                       format.format === 'ase' ? '🎨' :
                       format.format === 'vue' ? '💚' : '📁'}
                    </span>
                    <div>
                      <div className="font-medium text-sm">{format.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 uppercase">{format.format}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {selectedExports.size} format{selectedExports.size !== 1 ? 's' : ''} selected
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              {exports.length === 0 ? (
                <button
                  onClick={handleGenerateSelected}
                  disabled={selectedExports.size === 0}
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-300"
                >
                  Generate Exports
                </button>
              ) : (
                <button
                  onClick={handleBulkDownload}
                  className="px-4 py-2 rounded-md bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  Download All ({exports.length})
                </button>
              )}
            </div>
          </div>

          {/* Generated Exports Preview */}
          {exports.length > 0 && (
            <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6">
              <h3 className="text-lg font-semibold mb-4">Generated Exports</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {exports.map((exportFormat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {exportFormat.format === 'css' ? '🎨' :
                         exportFormat.format === 'scss' ? '💅' :
                         exportFormat.format === 'js' ? '⚛️' :
                         exportFormat.format === 'json' ? '📄' :
                         exportFormat.format === 'svg' ? '🎭' :
                         exportFormat.format === 'ase' ? '🎨' :
                         exportFormat.format === 'vue' ? '💚' : '📁'}
                      </span>
                      <div>
                        <div className="font-medium text-sm">{exportFormat.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{exportFormat.filename}</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {exportFormat.content.length} chars
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalExportDialog;
