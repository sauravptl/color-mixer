import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import chroma from 'chroma-js';
import QuickActions from './QuickActions';
import HarmonySelector from './HarmonySelector';
import ShadeGenerator from './ShadeGenerator';
import ExportPanel from './ExportPanel';
import AccessibilityPanel from './AccessibilityPanel';
import ExampleGalleries from './ExampleGalleries';
import PaletteHistory from './PaletteHistory';
import PaletteComparison from './PaletteComparison';
import ColorTheoryTips from './ColorTheoryTips';
import { useColorMixerStore } from '../stores/colorMixerStore';
import { useKeyboardShortcuts, createColorMixerShortcuts } from '../hooks/useKeyboardShortcuts';
import { useAnalytics } from '../utils/analytics';
import type { ColorStop, ColorHarmony } from '../stores/colorMixerStore';
import { 
  Copy, 
  Shuffle, 
  Plus, 
  Undo, 
  Redo, 
  Download, 
  Heart,
  Eye,
  Palette,
  Settings,
  Zap,
  Target,
  Book,
  BarChart3,
  Lock,
  Unlock,
  Trash2,
  Pipette
} from 'lucide-react';

interface ColorInputProps {
  color: ColorStop;
  onColorChange: (color: string) => void;
  onPositionChange: (position: number) => void;
  onLockToggle: () => void;
  onRemove: () => void;
  isRemovable: boolean;
}

const ColorInput: React.FC<ColorInputProps> = ({
  color,
  onColorChange,
  onPositionChange,
  onLockToggle,
  onRemove,
  isRemovable
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hexValue, setHexValue] = useState(color.color);
  const [rgbValues, setRgbValues] = useState(() => {
    const rgb = chroma(color.color).rgb();
    return { r: rgb[0], g: rgb[1], b: rgb[2] };
  });

  useEffect(() => {
    setHexValue(color.color);
    const rgb = chroma(color.color).rgb();
    setRgbValues({ r: rgb[0], g: rgb[1], b: rgb[2] });
  }, [color.color]);

  const handleHexChange = (hex: string) => {
    setHexValue(hex);
    try {
      const validColor = chroma(hex);
      onColorChange(validColor.hex());
    } catch {
      // Invalid color, don't update
    }
  };

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgbValues, [component]: value };
    setRgbValues(newRgb);
    try {
      const newColor = chroma.rgb(newRgb.r, newRgb.g, newRgb.b);
      onColorChange(newColor.hex());
    } catch {
      // Invalid color, don't update
    }
  };

  return (
    <motion.div
      layout
      className="bg-white dark:bg-slate-900/70 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl border-2 border-slate-300 dark:border-slate-700 shadow-sm cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: color.color }}
            onClick={() => setShowAdvanced(!showAdvanced)}
          />
          <div>
            <div className="text-sm font-semibold">Color Stop</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Position: {Math.round(color.position * 100)}%
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onLockToggle}
            className={`p-2 rounded-lg transition-colors ${
              color.locked 
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
            title={color.locked ? 'Unlock color' : 'Lock color'}
          >
            {color.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
          
          {isRemovable && (
            <button
              onClick={onRemove}
              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Remove color stop"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Color Picker */}
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color.color}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-16 h-12 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer hover:scale-105 transition-transform shadow-sm"
          />
          <input
            type="text"
            value={hexValue}
            onChange={(e) => handleHexChange(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="#000000"
          />
        </div>

        {/* Position Slider */}
        <div>
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
            Position: {Math.round(color.position * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={color.position}
            onChange={(e) => onPositionChange(parseFloat(e.target.value))}
            className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Advanced Controls */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  RGB Values
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {(['r', 'g', 'b'] as const).map((component) => (
                    <div key={component}>
                      <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block uppercase">
                        {component}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        value={rgbValues[component]}
                        onChange={(e) => handleRgbChange(component, parseInt(e.target.value) || 0)}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-xs text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ColorMixer: React.FC = () => {
  const {
    currentPalette,
    updatePalette,
    undo,
    redo,
    canUndo,
    canRedo,
    addToFavorites,
    isFavorite,
    addToComparison,
    comparisonPalettes,
    showComparison,
    removeFromComparison,
    clearComparison
  } = useColorMixerStore();

  const { trackFeatureUsage, trackColorCopy } = useAnalytics();
  const [activeSection, setActiveSection] = useState<'colors' | 'harmonies' | 'shades' | 'accessibility' | 'export' | 'examples' | 'history'>('colors');
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const gradientRef = useRef<HTMLDivElement>(null);

  // Create mixed color from all color stops
  const mixedColor = React.useMemo(() => {
    if (currentPalette.colors.length < 2) return currentPalette.colors[0]?.color || '#000000';
    
    try {
      const sortedColors = [...currentPalette.colors].sort((a, b) => a.position - b.position);
      const scale = chroma.scale(sortedColors.map(c => c.color)).mode('lch');
      return scale(0.5).hex();
    } catch {
      return currentPalette.colors[0]?.color || '#000000';
    }
  }, [currentPalette.colors]);

  const showToastMessage = useCallback((message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  }, []);

  const copyColors = useCallback(() => {
    const colorString = currentPalette.colors.map(c => c.color).join(', ');
    navigator.clipboard?.writeText(colorString);
    showToastMessage('Colors copied to clipboard!');
    trackColorCopy(colorString, 'mixed');
  }, [currentPalette.colors, showToastMessage, trackColorCopy]);

  const randomizeColors = useCallback(() => {
    const newColors = currentPalette.colors.map(color => 
      color.locked ? color : { ...color, color: chroma.random().hex() }
    );
    updatePalette(newColors);
    showToastMessage('Colors randomized!');
    trackFeatureUsage('randomize');
  }, [currentPalette.colors, updatePalette, showToastMessage, trackFeatureUsage]);

  const addColorStop = useCallback(() => {
    const newPosition = Math.random();
    const newId = Date.now().toString();
    const newColor: ColorStop = {
      id: newId,
      position: newPosition,
      color: chroma.random().hex(),
      locked: false
    };
    
    updatePalette([...currentPalette.colors, newColor]);
    showToastMessage('Color stop added!');
  }, [currentPalette.colors, updatePalette, showToastMessage]);

  const quickActions = [
    {
      id: 'copy',
      label: 'Copy Colors',
      icon: '📋',
      action: copyColors,
      description: 'Copy all colors to clipboard',
      shortcut: 'C'
    },
    {
      id: 'randomize',
      label: 'Randomize',
      icon: '🎲',
      action: randomizeColors,
      description: 'Generate random colors',
      shortcut: 'R'
    },
    {
      id: 'add',
      label: 'Add Color',
      icon: '➕',
      action: addColorStop,
      description: 'Add new color stop',
      shortcut: '+'
    },
    {
      id: 'undo',
      label: 'Undo',
      icon: '↶',
      action: undo,
      description: 'Undo last action',
      shortcut: 'Ctrl+Z',
      disabled: !canUndo()
    },
    {
      id: 'redo',
      label: 'Redo',
      icon: '↷',
      action: redo,
      description: 'Redo last action',
      shortcut: 'Ctrl+Y',
      disabled: !canRedo()
    },
    {
      id: 'favorite',
      label: 'Favorite',
      icon: '⭐',
      action: () => {
        addToFavorites(currentPalette);
        showToastMessage('Added to favorites!');
      },
      description: 'Save to favorites'
    },
    {
      id: 'compare',
      label: 'Compare',
      icon: '⚖️',
      action: () => {
        addToComparison(currentPalette);
        showToastMessage('Added to comparison!');
      },
      description: 'Add to comparison view'
    },
    {
      id: 'eyedropper',
      label: 'Eyedropper',
      icon: '🎨',
      action: async () => {
        if ('EyeDropper' in window) {
          try {
            const eyeDropper = new (window as any).EyeDropper();
            const result = await eyeDropper.open();
            const newColor = { ...currentPalette.colors[0], color: result.sRGBHex };
            updatePalette([newColor, ...currentPalette.colors.slice(1)]);
            showToastMessage('Color picked!');
          } catch {
            showToastMessage('Eyedropper not available');
          }
        } else {
          showToastMessage('Eyedropper not supported');
        }
      },
      description: 'Pick color from screen'
    }
  ];

  // Keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: createColorMixerShortcuts(
      copyColors,
      randomizeColors,
      addColorStop,
      undo,
      redo,
      () => setActiveSection(showComparison ? 'colors' : 'colors')
    ),
    enabled: true
  });

  const sections = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'harmonies', label: 'Harmonies', icon: Target },
    { id: 'shades', label: 'Shades', icon: Zap },
    { id: 'accessibility', label: 'Accessibility', icon: Eye },
    { id: 'export', label: 'Export', icon: Download },
    { id: 'examples', label: 'Examples', icon: Book },
    { id: 'history', label: 'History', icon: BarChart3 }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Main Content */}
      <div className="w-full">
        {/* Mixed Color Preview */}
        <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Live Color Preview
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Your mixed color updates in real-time as you adjust the stops below
              </p>
            </div>
            
            <div className="flex justify-center mb-6">
              <div
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-3xl shadow-2xl border-4 border-white dark:border-slate-700 hover:scale-105 transition-transform duration-300 cursor-pointer"
                style={{ backgroundColor: mixedColor }}
                onClick={() => {
                  navigator.clipboard?.writeText(mixedColor);
                  showToastMessage(`Copied ${mixedColor}!`);
                }}
                title={`Click to copy ${mixedColor}`}
              />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-100 mb-2">
                {mixedColor}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Mixed from {currentPalette.colors.length} color stops
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-20 z-30">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto scrollbar-hide">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                      activeSection === section.id
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {activeSection === 'colors' && (
              <motion.div
                key="colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Quick Actions */}
                <div data-onboarding="quick-actions">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    Quick Actions
                  </h3>
                  <QuickActions actions={quickActions} />
                </div>

                {/* Color Controls */}
                <div data-onboarding="color-inputs">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    Color Stops
                  </h3>
                  <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {currentPalette.colors.map((color, index) => (
                      <ColorInput
                        key={color.id}
                        color={color}
                        onColorChange={(newColor) => {
                          const newColors = [...currentPalette.colors];
                          newColors[index] = { ...color, color: newColor };
                          updatePalette(newColors);
                        }}
                        onPositionChange={(position) => {
                          const newColors = [...currentPalette.colors];
                          newColors[index] = { ...color, position };
                          updatePalette(newColors);
                        }}
                        onLockToggle={() => {
                          const newColors = [...currentPalette.colors];
                          newColors[index] = { ...color, locked: !color.locked };
                          updatePalette(newColors);
                        }}
                        onRemove={() => {
                          const newColors = currentPalette.colors.filter((_, i) => i !== index);
                          updatePalette(newColors);
                        }}
                        isRemovable={currentPalette.colors.length > 2}
                      />
                    ))}
                  </div>
                </div>

                {/* Color Theory Tips */}
                <ColorTheoryTips currentContext="general" />
              </motion.div>
            )}

            {activeSection === 'harmonies' && (
              <motion.div
                key="harmonies"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div data-onboarding="harmonies">
                  <HarmonySelector
                    baseColor={currentPalette.colors[0]?.color || '#000000'}
                    onHarmonySelect={(harmony) => {
                      const newColors = harmony.colors.map((color, index) => ({
                        id: Date.now().toString() + index,
                        position: index / (harmony.colors.length - 1),
                        color,
                        locked: false
                      }));
                      updatePalette(newColors);
                      showToastMessage(`Applied ${harmony.name} harmony!`);
                    }}
                  />
                  <ColorTheoryTips currentContext="harmony" className="mt-6" />
                </div>
              </motion.div>
            )}

            {activeSection === 'shades' && (
              <motion.div
                key="shades"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ShadeGenerator
                  color1={currentPalette.colors[0]?.color || '#000000'}
                  color2={currentPalette.colors[1]?.color || '#ffffff'}
                  onShadesGenerated={(shades) => {
                    const newColors = shades.map((color, index) => ({
                      id: Date.now().toString() + index,
                      position: index / (shades.length - 1),
                      color,
                      locked: false
                    }));
                    updatePalette(newColors);
                    showToastMessage('Shades applied to palette!');
                  }}
                />
              </motion.div>
            )}

            {activeSection === 'accessibility' && (
              <motion.div
                key="accessibility"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AccessibilityPanel
                  colors={currentPalette.colors.map(c => c.color)}
                  onColorFix={(original, fixed) => {
                    const newColors = currentPalette.colors.map(color =>
                      color.color === original ? { ...color, color: fixed } : color
                    );
                    updatePalette(newColors);
                    showToastMessage('Color fixed for better accessibility!');
                  }}
                />
                <ColorTheoryTips currentContext="contrast" className="mt-6" />
              </motion.div>
            )}

            {activeSection === 'export' && (
              <motion.div
                key="export"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div data-onboarding="export">
                  <ExportPanel
                    baseColor={currentPalette.colors[0]?.color || '#000000'}
                    paletteName={currentPalette.name}
                  />
                  <ColorTheoryTips currentContext="export" className="mt-6" />
                </div>
              </motion.div>
            )}

            {activeSection === 'examples' && (
              <motion.div
                key="examples"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ExampleGalleries
                  onPaletteSelect={(colors) => {
                    updatePalette(colors);
                    showToastMessage('Example palette applied!');
                  }}
                />
              </motion.div>
            )}

            {activeSection === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid lg:grid-cols-2 gap-8">
                  <PaletteHistory
                    history={[]} // You'll need to implement history in the store
                    onRestorePalette={(palette) => {
                      updatePalette(palette.colors);
                      showToastMessage('Palette restored!');
                    }}
                    onAddToComparison={addToComparison}
                    onSaveToFavorites={addToFavorites}
                  />
                  
                  {showComparison && comparisonPalettes.length > 0 && (
                    <PaletteComparison
                      palettes={comparisonPalettes}
                      onRemovePalette={removeFromComparison}
                      onClose={clearComparison}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-2xl shadow-lg z-50 font-medium"
          >
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-slate-900 dark:text-slate-100 font-medium">Processing...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorMixer;