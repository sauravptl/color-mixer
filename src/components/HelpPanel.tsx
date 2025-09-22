import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Book, Keyboard, Palette, Zap } from 'lucide-react';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpPanel: React.FC<HelpPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'getting-started' | 'features' | 'shortcuts' | 'tips'>('getting-started');

  const tabs = [
    { id: 'getting-started', label: 'Getting Started', icon: Book },
    { id: 'features', label: 'Features', icon: Palette },
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
    { id: 'tips', label: 'Tips & Tricks', icon: Zap },
  ];

  const gettingStartedContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-3">Welcome to Color Mixer!</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Color Mixer is a powerful tool for creating beautiful color palettes through interactive mixing.
          Here's how to get started:
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-l-4 border-blue-500 pl-4">
          <h4 className="font-semibold mb-2">1. Create Your First Palette</h4>
          <p className="text-slate-600 dark:text-slate-400">
            Click on the gradient bar to add color stops, or drag existing stops to adjust colors.
            The center shows your mixed result in real-time.
          </p>
        </div>

        <div className="border-l-4 border-green-500 pl-4">
          <h4 className="font-semibold mb-2">2. Fine-tune Colors</h4>
          <p className="text-slate-600 dark:text-slate-400">
            Use the color picker or enter values in HEX, RGB, HSL, or HSV formats.
            Click the lock icon to prevent accidental changes to important colors.
          </p>
        </div>

        <div className="border-l-4 border-purple-500 pl-4">
          <h4 className="font-semibold mb-2">3. Generate Harmonies</h4>
          <p className="text-slate-600 dark:text-slate-400">
            Choose from various color harmony modes like monochromatic, analogous, triadic,
            complementary, and more to create professional color schemes.
          </p>
        </div>

        <div className="border-l-4 border-orange-500 pl-4">
          <h4 className="font-semibold mb-2">4. Check Accessibility</h4>
          <p className="text-slate-600 dark:text-slate-400">
            Use the accessibility panel to ensure your colors meet WCAG AA/AAA standards
            for text readability across different text sizes.
          </p>
        </div>

        <div className="border-l-4 border-red-500 pl-4">
          <h4 className="font-semibold mb-2">5. Export Your Work</h4>
          <p className="text-slate-600 dark:text-slate-400">
            Export your palettes in multiple formats including CSS variables, Tailwind config,
            SCSS variables, JSON tokens, and more.
          </p>
        </div>
      </div>
    </div>
  );

  const featuresContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-3">Core Features</h3>
        <div className="grid gap-4">
          <div className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Palette className="w-6 h-6 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-semibold">Interactive Color Mixing</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Drag color stops on the gradient bar to mix colors in real-time
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <HelpCircle className="w-6 h-6 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-semibold">Color Harmony Generation</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Generate palettes using proven color theory principles
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Zap className="w-6 h-6 text-purple-500 mt-0.5" />
            <div>
              <h4 className="font-semibold">Accessibility Checking</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Ensure your colors meet WCAG standards for inclusive design
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Book className="w-6 h-6 text-orange-500 mt-0.5" />
            <div>
              <h4 className="font-semibold">Multiple Export Formats</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Export to CSS, Tailwind, SCSS, JSON, and design tool formats
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Keyboard className="w-6 h-6 text-red-500 mt-0.5" />
            <div>
              <h4 className="font-semibold">Keyboard Shortcuts</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Full keyboard navigation and shortcuts for power users
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const shortcutsContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-3">Keyboard Shortcuts</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <span className="font-medium">Copy Color</span>
            <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm">C</kbd>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <span className="font-medium">Randomize Palette</span>
            <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm">R</kbd>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <span className="font-medium">New Palette</span>
            <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm">Space</kbd>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <span className="font-medium">Undo</span>
            <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm">Ctrl+Z</kbd>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <span className="font-medium">Redo</span>
            <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm">Ctrl+Y</kbd>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <span className="font-medium">Toggle Accessibility</span>
            <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm">A</kbd>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <span className="font-medium">Export Palette</span>
            <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm">E</kbd>
          </div>
        </div>
      </div>
    </div>
  );

  const tipsContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-3">Tips & Tricks</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🎨 Color Theory</h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              Use complementary colors (opposite on the color wheel) for high contrast,
              or analogous colors (adjacent) for harmonious palettes.
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">⚡ Performance</h4>
            <p className="text-green-700 dark:text-green-300 text-sm">
              The app is optimized for smooth 60fps animations. If you notice lag,
              try reducing the number of color stops or shades.
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded-r-lg">
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">♿ Accessibility</h4>
            <p className="text-purple-700 dark:text-purple-300 text-sm">
              Always check contrast ratios for text readability. Aim for AA (4.5:1)
              for normal text and AAA (7:1) for large text.
            </p>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-r-lg">
            <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">💾 Local Storage</h4>
            <p className="text-orange-700 dark:text-orange-300 text-sm">
              Your favorite palettes and recent work are automatically saved locally
              in your browser. Clear your browser data if you want to reset everything.
            </p>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg">
            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">🖼️ Image Import</h4>
            <p className="text-red-700 dark:text-red-300 text-sm">
              Drag and drop images to extract colors automatically. The eyedropper
              tool works best on high-contrast areas of your images.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'getting-started':
        return gettingStartedContent;
      case 'features':
        return featuresContent;
      case 'shortcuts':
        return shortcutsContent;
      case 'tips':
        return tipsContent;
      default:
        return gettingStartedContent;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: '100%' }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-800 shadow-xl z-50 overflow-y-auto text-slate-900 dark:text-slate-100"
          >
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Help & Documentation</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="flex p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'getting-started' | 'features' | 'shortcuts' | 'tips')}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                        activeTab === tab.id
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
              {renderContent()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HelpPanel;
