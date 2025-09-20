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

export default ExportPanel;
