import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import chroma from 'chroma-js';
import AccessibilityPanel from './AccessibilityPanel';
import ExportPanel from './ExportPanel';
import HarmonySelector from './HarmonySelector';
import ShadeGenerator from './ShadeGenerator';
import QuickActions from './QuickActions';
import ModalExportDialog from './ModalExportDialog';
import PaletteHistory from './PaletteHistory';
import PaletteComparison from './PaletteComparison';
import ColorTheoryTips from './ColorTheoryTips';
import ExampleGalleries from './ExampleGalleries';
import type { ColorHarmony } from '../utils/colorHarmony';
import { useColorMixerStore } from '../stores/colorMixerStore';
import { useKeyboardShortcuts, createColorMixerShortcuts } from '../hooks/useKeyboardShortcuts';
import { quickExportPalette } from '../utils/zipExport';
import { ChevronDown, ChevronUp, Palette, Settings, Eye, Download } from 'lucide-react';

interface ColorStop {
  id: string;
  position: number; // 0-1
  color: string;
  locked: boolean;
}

interface ColorMixerProps {
  width?: number;
  height?: number;
}

const ColorMixer: React.FC<ColorMixerProps> = ({
  width = 400,
  height = 60
}) => {
  // Zustand store integration
  const {
    currentPalette,
    history,
    favorites,
    comparisonPalettes,
    showComparison,
    updatePalette,
    undo,
    redo,
    addToFavorites,
    addToComparison,
    removeFromComparison,
    clearComparison
  } = useColorMixerStore();

  // Local state
  const [colorStops, setColorStops] = useState<ColorStop[]>(currentPalette.colors);
  const [isDragOver, setIsDragOver] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [selectedHarmony, setSelectedHarmony] = useState<ColorHarmony | null>(null);
  const [generatedShades, setGeneratedShades] = useState<string[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [expandedColorInputs, setExpandedColorInputs] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string>('colors');
  const [isMobileView, setIsMobileView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Sync with store
  useEffect(() => {
    setColorStops(currentPalette.colors);
  }, [currentPalette.colors]);

  // Keyboard shortcuts
  const handleCopyAll = useCallback(() => {
    const allColors = colorStops.map(stop => stop.color).join(', ');
    navigator.clipboard.writeText(allColors);
    setToastMessage(`Copied ${colorStops.length} colors to clipboard!`);
    setTimeout(() => setToastMessage(''), 2000);
  }, [colorStops]);

  const handleRandomize = useCallback(() => {
    setIsLoading(true);
    const newColorStops = colorStops.map(stop =>
      stop.locked ? stop : {
        ...stop,
        color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
      }
    );
    setColorStops(newColorStops);
    updatePalette(newColorStops);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [colorStops, updatePalette]);

  const handleNewPalette = useCallback(() => {
    setIsLoading(true);
    const newColors: ColorStop[] = [
      { id: '1', position: 0, color: '#3b82f6', locked: false }, // Blue
      { id: '2', position: 1, color: '#ec4899', locked: false }  // Pink
    ];
    setColorStops(newColors);
    updatePalette(newColors);
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, [updatePalette]);

  const handleToggleComparison = useCallback(() => {
    if (showComparison) {
      clearComparison();
    } else {
      addToComparison({
        id: currentPalette.id,
        name: currentPalette.name,
        colors: colorStops,
        createdAt: new Date()
      });
    }
  }, [showComparison, clearComparison, addToComparison, currentPalette, colorStops]);

  // Keyboard shortcuts setup
  useKeyboardShortcuts({
    shortcuts: createColorMixerShortcuts(
      handleCopyAll,
      handleRandomize,
      handleNewPalette,
      undo,
      redo,
      handleToggleComparison
    )
  });

  // Quick actions configuration
  const quickActions = [
    {
      id: 'copy',
      label: 'Copy Colors',
      icon: '📋',
      action: handleCopyAll,
      description: 'Copy all colors to clipboard',
      shortcut: 'C'
    },
    {
      id: 'randomize',
      label: 'Randomize',
      icon: '🎲',
      action: handleRandomize,
      description: 'Randomize unlocked colors',
      shortcut: 'R'
    },
    {
      id: 'new',
      label: 'New Palette',
      icon: '🆕',
      action: handleNewPalette,
      description: 'Create new palette',
      shortcut: 'Space'
    },
    {
      id: 'undo',
      label: 'Undo',
      icon: '↶',
      action: undo,
      description: 'Undo last action',
      shortcut: 'Ctrl+Z'
    },
    {
      id: 'redo',
      label: 'Redo',
      icon: '↷',
      action: redo,
      description: 'Redo last undone action',
      shortcut: 'Ctrl+Y'
    },
    {
      id: 'favorite',
      label: 'Save Favorite',
      icon: '⭐',
      action: () => addToFavorites({
        id: `fav_${Date.now()}`,
        name: `Favorite ${favorites.length + 1}`,
        colors: colorStops,
        createdAt: new Date()
      }),
      description: 'Save current palette to favorites'
    },
    {
      id: 'export',
      label: 'Quick Export',
      icon: '💾',
      action: () => quickExportPalette({
        id: currentPalette.id,
        name: currentPalette.name,
        colors: colorStops,
        createdAt: currentPalette.createdAt
      }),
      description: 'Export palette as ZIP with all formats'
    },
    {
      id: 'compare',
      label: 'Compare',
      icon: '⚖️',
      action: handleToggleComparison,
      description: 'Toggle palette comparison view',
      shortcut: 'B'
    }
  ];

  const handleStopDrag = useCallback((id: string, newPosition: number) => {
    const updatedStops = colorStops.map(stop =>
      stop.id === id
        ? { ...stop, position: Math.max(0, Math.min(1, newPosition)) }
        : stop
    );
    setColorStops(updatedStops);
    updatePalette(updatedStops);
  }, [colorStops, updatePalette]);

  const getColorValues = useCallback((color: string) => {
    try {
      const chromaColor = chroma(color);
      return {
        hex: chromaColor.hex(),
        rgb: chromaColor.rgb(),
        hsl: chromaColor.hsl(),
        hsv: chromaColor.hsv()
      };
    } catch {
      return {
        hex: '#000000',
        rgb: [0, 0, 0],
        hsl: [0, 0, 0],
        hsv: [0, 0, 0]
      };
    }
  }, []);

  const handleStopColorChange = useCallback((id: string, newColor: string) => {
    const updatedStops = colorStops.map(stop =>
      stop.id === id ? { ...stop, color: newColor } : stop
    );
    setColorStops(updatedStops);
    updatePalette(updatedStops);
  }, [colorStops, updatePalette]);

  const handleRGBChange = useCallback((id: string, r: number, g: number, b: number) => {
    try {
      const newColor = chroma([r, g, b]).hex();
      handleStopColorChange(id, newColor);
    } catch {
      // Invalid RGB values, ignore
    }
  }, [handleStopColorChange]);

  const handleHSLChange = useCallback((id: string, h: number, s: number, l: number) => {
    try {
      const newColor = chroma(h, s, l, 'hsl').hex();
      handleStopColorChange(id, newColor);
    } catch {
      // Invalid HSL values, ignore
    }
  }, [handleStopColorChange]);

  const handleHSVChange = useCallback((id: string, h: number, s: number, v: number) => {
    try {
      const newColor = chroma(h, s, v, 'hsv').hex();
      handleStopColorChange(id, newColor);
    } catch {
      // Invalid HSV values, ignore
    }
  }, [handleStopColorChange]);

  const addColorStop = useCallback((position: number) => {
    const newStop: ColorStop = {
      id: Date.now().toString(),
      position,
      color: '#ffffff',
      locked: false
    };
    setColorStops(prev => [...prev, newStop].sort((a, b) => a.position - b.position));
  }, []);

  const removeColorStop = useCallback((id: string) => {
    setColorStops(prev => prev.filter(stop => stop.id !== id));
  }, []);

  const toggleLock = useCallback((id: string) => {
    setColorStops(prev => prev.map(stop =>
      stop.id === id ? { ...stop, locked: !stop.locked } : stop
    ));
  }, []);

  const randomizeColors = useCallback(() => {
    const newColorStops = colorStops.map(stop =>
      stop.locked ? stop : {
        ...stop,
        color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
      }
    );
    setColorStops(newColorStops);
    updatePalette(newColorStops);
  }, [colorStops, updatePalette]);

  const extractColorsFromImage = useCallback(async (file: File): Promise<string[]> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Set canvas size to image size
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image to canvas
        ctx?.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) {
          resolve([]);
          return;
        }

        // Extract colors using a simple sampling approach
        const colors: { [key: string]: number } = {};
        const step = Math.max(1, Math.floor(Math.sqrt(imageData.data.length / 4) / 50)); // Sample about 2500 pixels

        for (let i = 0; i < imageData.data.length; i += 4 * step) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const alpha = imageData.data[i + 3];

          // Skip transparent pixels
          if (alpha < 128) continue;

          const color = chroma([r, g, b]).hex();
          colors[color] = (colors[color] || 0) + 1;
        }

        // Sort by frequency and take top colors
        const sortedColors = Object.entries(colors)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([color]) => color);

        resolve(sortedColors);
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      setToastMessage('Please drop an image file');
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }

    const file = imageFiles[0];
    try {
      const colors = await extractColorsFromImage(file);

      if (colors.length > 0) {
        // Add extracted colors as new stops
        const newStops: ColorStop[] = colors.map((color, index) => ({
          id: `img_${Date.now()}_${index}`,
          position: 0.2 + (index * 0.6) / (colors.length - 1), // Distribute between 0.2 and 0.8
          color,
          locked: false
        }));

        setColorStops(prev => [...prev, ...newStops].sort((a, b) => a.position - b.position));
        setToastMessage(`Extracted ${colors.length} colors from image!`);
        setTimeout(() => setToastMessage(''), 3000);
      } else {
        setToastMessage('Could not extract colors from image');
        setTimeout(() => setToastMessage(''), 2000);
      }
    } catch {
      setToastMessage('Error processing image');
      setTimeout(() => setToastMessage(''), 2000);
    }
  }, [extractColorsFromImage]);

  const copyToClipboard = useCallback(async (text: string, label: string = 'Color') => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage(`${label} copied to clipboard!`);
      setTimeout(() => setToastMessage(''), 2000);
    } catch {
      setToastMessage('Failed to copy to clipboard');
      setTimeout(() => setToastMessage(''), 2000);
    }
  }, []);

  const handleHarmonySelect = useCallback((harmony: ColorHarmony) => {
    setSelectedHarmony(harmony);
    setToastMessage(`Applied ${harmony.name} harmony with ${harmony.colors.length} colors`);
    setTimeout(() => setToastMessage(''), 3000);
  }, []);

  const handleShadesGenerated = useCallback((shades: string[]) => {
    setGeneratedShades(shades);
    setToastMessage(`Generated ${shades.length} shades`);
    setTimeout(() => setToastMessage(''), 2000);
  }, []);

  const applyHarmony = useCallback(() => {
    if (!selectedHarmony) return;

    const newStops: ColorStop[] = selectedHarmony.colors.map((color, index) => ({
      id: `harmony_${Date.now()}_${index}`,
      position: selectedHarmony.colors.length > 1 ? index / (selectedHarmony.colors.length - 1) : 0.5,
      color,
      locked: false
    }));

    setColorStops(newStops);
    setToastMessage(`Applied ${selectedHarmony.name} harmony!`);
    setTimeout(() => setToastMessage(''), 3000);
  }, [selectedHarmony]);

  const handleColorFix = useCallback((originalColor: string, fixedColor: string) => {
    setColorStops(prev => prev.map(stop =>
      stop.color === originalColor ? { ...stop, color: fixedColor } : stop
    ));
    setToastMessage(`Color adjusted to ${fixedColor} for better accessibility!`);
    setTimeout(() => setToastMessage(''), 3000);
  }, []);

  const applyShades = useCallback(() => {
    if (generatedShades.length === 0) return;

    const newStops: ColorStop[] = generatedShades.map((shade, index) => ({
      id: `shade_${Date.now()}_${index}`,
      position: generatedShades.length > 1 ? index / (generatedShades.length - 1) : 0.5,
      color: shade,
      locked: false
    }));

    setColorStops(newStops);
    setToastMessage(`Applied ${generatedShades.length} shades!`);
    setTimeout(() => setToastMessage(''), 3000);
  }, [generatedShades]);

  const mixedColor = useMemo(() => {
    if (colorStops.length < 2) return '#ffffff';

    try {
      // For a simple mix, we'll blend the two most prominent colors
      // In a real implementation, you'd want to do proper gradient interpolation
      const firstColor = chroma(colorStops[0].color);
      const lastColor = chroma(colorStops[colorStops.length - 1].color);

      // Simple blend - you could make this more sophisticated
      return chroma.mix(firstColor, lastColor, 0.5).hex();
    } catch {
      return '#ffffff';
    }
  }, [colorStops]);

  const openEyedropper = useCallback(async () => {
    if (!('EyeDropper' in window)) {
      setToastMessage('EyeDropper API not supported in this browser');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    try {
      // @ts-expect-error - EyeDropper API is not in TypeScript definitions yet
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();

      if (result.sRGBHex) {
        // Add the picked color as a new stop
        const newStop: ColorStop = {
          id: `eye_${Date.now()}`,
          position: Math.random() * 0.6 + 0.2, // Random position between 0.2 and 0.8
          color: result.sRGBHex,
          locked: false
        };

        setColorStops(prev => [...prev, newStop].sort((a, b) => a.position - b.position));
        setToastMessage(`Picked color: ${result.sRGBHex}`);
        setTimeout(() => setToastMessage(''), 2000);
      }
    } catch (error) {
      // User canceled the eyedropper
      if (error instanceof Error && error.name !== 'AbortError') {
        setToastMessage('Error using eyedropper');
        setTimeout(() => setToastMessage(''), 2000);
      }
    }
  }, []);

  const toggleColorInputExpansion = useCallback((stopId: string) => {
    setExpandedColorInputs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stopId)) {
        newSet.delete(stopId);
      } else {
        newSet.add(stopId);
      }
      return newSet;
    });
  }, []);

  const sections = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'harmonies', label: 'Harmonies', icon: Eye },
    { id: 'export', label: 'Export', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const gradientString = `linear-gradient(to right, ${colorStops.map(stop => `${stop.color} ${stop.position * 100}%`).join(', ')})`;

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Mobile Navigation */}
      {isMobileView && (
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div
        className={`bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow transition-all duration-300 transition-colors ${
          isDragOver ? 'ring-2 ring-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.02]' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Color Mixer</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Create beautiful color palettes with interactive mixing
              </p>
            </div>
            {isLoading && (
              <div className="flex items-center gap-2 text-indigo-600">
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </div>
          
          {isDragOver && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg border-2 border-dashed border-indigo-300 dark:border-indigo-700"
            >
              <div className="text-indigo-700 dark:text-indigo-300 font-medium text-center">
                📸 Drop image here to extract colors automatically
              </div>
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Quick Actions - Always Visible */}
          <div className="mb-6" data-onboarding="quick-actions">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Quick Actions</h3>
            </div>
            <QuickActions actions={quickActions} />
          </div>

          {/* Gradient Bar with Responsive Size */}
          <div className="mb-6" data-onboarding="gradient-bar">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Color Gradient</h3>
            <div className="flex justify-center">
              <div
                className="relative rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-crosshair transition-all hover:shadow-md"
                style={{
                  width: isMobileView ? Math.min(320, window.innerWidth - 64) : width,
                  height: isMobileView ? 80 : height,
                  background: gradientString
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const position = (e.clientX - rect.left) / rect.width;
                  addColorStop(position);
                }}
              >
                {/* Color Stops */}
                {colorStops.map((stop) => (
                  <motion.div
                    key={stop.id}
                    className={`absolute top-0 flex items-center justify-center ${
                      stop.locked ? 'cursor-not-allowed' : 'cursor-move'
                    }`}
                    style={{
                      width: isMobileView ? '24px' : '16px',
                      height: '100%',
                      left: `${stop.position * 100}%`,
                      transform: 'translateX(-50%)'
                    }}
                    drag={stop.locked ? false : "x"}
                    dragConstraints={stop.locked ? undefined : { 
                      left: 0, 
                      right: (isMobileView ? Math.min(320, window.innerWidth - 64) : width) - (isMobileView ? 24 : 16)
                    }}
                    dragElastic={0}
                    onDrag={(_, info) => {
                      const currentWidth = isMobileView ? Math.min(320, window.innerWidth - 64) : width;
                      const newPosition = (stop.position * currentWidth + info.delta.x) / currentWidth;
                      handleStopDrag(stop.id, newPosition);
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileDrag={{ scale: 1.3, zIndex: 10 }}
                  >
                    <div
                      className={`${isMobileView ? 'w-6 h-6' : 'w-4 h-4'} rounded-full border-2 border-white shadow-lg ring-1 ring-black/10`}
                      style={{ backgroundColor: stop.color }}
                    />
                    {stop.locked && (
                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-indigo-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2">
              Click anywhere on the gradient to add a color stop, or drag existing stops to reposition them
            </p>
          </div>

          {/* Section Content */}
          <AnimatePresence mode="wait">
            {(!isMobileView || activeSection === 'colors') && (
              <motion.div
                key="colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Color Inputs */}
                <div className="mb-8" data-onboarding="color-inputs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Color Controls</h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {colorStops.length} color{colorStops.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                    {colorStops.map((stop) => {
                      const colorValues = getColorValues(stop.color);
                      const isExpanded = expandedColorInputs.has(stop.id);
                      
                      return (
                        <motion.div 
                          key={stop.id} 
                          className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow transition-all"
                          layout
                        >
                          <div className="p-4">
                            {/* Main Color Controls */}
                            <div className="flex items-center gap-3 mb-3">
                              <div
                                className="w-8 h-8 rounded-lg border-2 border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0"
                                style={{ backgroundColor: stop.color }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={colorValues.hex}
                                    onChange={(e) => handleStopColorChange(stop.id, e.target.value)}
                                    className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                                    title="Pick color"
                                  />
                                  <input
                                    type="text"
                                    value={colorValues.hex}
                                    onChange={(e) => handleStopColorChange(stop.id, e.target.value)}
                                    className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono transition-colors"
                                    placeholder="#000000"
                                  />
                                  <button
                                    onClick={() => copyToClipboard(colorValues.hex, 'HEX color')}
                                    className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 active:scale-95"
                                    title="Copy HEX"
                                  >
                                    📋
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleColorInputExpansion(stop.id)}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                                  title={isExpanded ? "Hide advanced controls" : "Show advanced controls"}
                                >
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => toggleLock(stop.id)}
                                  className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                    stop.locked 
                                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400' 
                                      : 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                                  }`}
                                  title={stop.locked ? "Unlock color" : "Lock color"}
                                >
                                  {stop.locked ? '🔒' : '🔓'}
                                </button>
                                <button
                                  onClick={() => removeColorStop(stop.id)}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                  disabled={colorStops.length <= 2}
                                  title="Remove color"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>

                            {/* Advanced Color Controls - Collapsible */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                    {/* RGB Inputs */}
                                    <div className="mb-4">
                                      <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">RGB</div>
                                      <div className="grid grid-cols-3 gap-2">
                                        <div>
                                          <label className="text-xs text-slate-500 dark:text-slate-400">R</label>
                                          <input
                                            type="number"
                                            min="0"
                                            max="255"
                                            value={Math.round(colorValues.rgb[0])}
                                            onChange={(e) => handleRGBChange(stop.id, parseInt(e.target.value) || 0, colorValues.rgb[1], colorValues.rgb[2])}
                                            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500 dark:text-slate-400">G</label>
                                          <input
                                            type="number"
                                            min="0"
                                            max="255"
                                            value={Math.round(colorValues.rgb[1])}
                                            onChange={(e) => handleRGBChange(stop.id, colorValues.rgb[0], parseInt(e.target.value) || 0, colorValues.rgb[2])}
                                            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500 dark:text-slate-400">B</label>
                                          <input
                                            type="number"
                                            min="0"
                                            max="255"
                                            value={Math.round(colorValues.rgb[2])}
                                            onChange={(e) => handleRGBChange(stop.id, colorValues.rgb[0], colorValues.rgb[1], parseInt(e.target.value) || 0)}
                                            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* HSL Inputs */}
                                    <div className="mb-4">
                                      <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">HSL</div>
                                      <div className="grid grid-cols-3 gap-2">
                                        <div>
                                          <label className="text-xs text-slate-500 dark:text-slate-400">H</label>
                                          <input
                                            type="number"
                                            min="0"
                                            max="360"
                                            value={Math.round(colorValues.hsl[0])}
                                            onChange={(e) => handleHSLChange(stop.id, parseInt(e.target.value) || 0, colorValues.hsl[1], colorValues.hsl[2])}
                                            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500 dark:text-slate-400">S</label>
                                          <input
                                            type="number"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={colorValues.hsl[1].toFixed(2)}
                                            onChange={(e) => handleHSLChange(stop.id, colorValues.hsl[0], parseFloat(e.target.value) || 0, colorValues.hsl[2])}
                                            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500 dark:text-slate-400">L</label>
                                          <input
                                            type="number"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={colorValues.hsl[2].toFixed(2)}
                                            onChange={(e) => handleHSLChange(stop.id, colorValues.hsl[0], colorValues.hsl[1], parseFloat(e.target.value) || 0)}
                                            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* HSV Inputs */}
                                    <div>
                                      <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">HSV</div>
                                      <div className="grid grid-cols-3 gap-2">
                                        <div>
                                          <label className="text-xs text-slate-500 dark:text-slate-400">H</label>
                                          <input
                                            type="number"
                                            min="0"
                                            max="360"
                                            value={Math.round(colorValues.hsv[0])}
                                            onChange={(e) => handleHSVChange(stop.id, parseInt(e.target.value) || 0, colorValues.hsv[1], colorValues.hsv[2])}
                                            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500 dark:text-slate-400">S</label>
                                          <input
                                            type="number"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={colorValues.hsv[1].toFixed(2)}
                                            onChange={(e) => handleHSVChange(stop.id, colorValues.hsv[0], parseFloat(e.target.value) || 0, colorValues.hsv[2])}
                                            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500 dark:text-slate-400">V</label>
                                          <input
                                            type="number"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={colorValues.hsv[2].toFixed(2)}
                                            onChange={(e) => handleHSVChange(stop.id, colorValues.hsv[0], colorValues.hsv[1], parseFloat(e.target.value) || 0)}
                                            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {(!isMobileView || activeSection === 'harmonies') && (
              <motion.div
                key="harmonies"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="mb-8"
              >
                {/* Smart Color Generation */}
                <div data-onboarding="harmonies">
                  <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-slate-100">Smart Color Generation</h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Harmony Selector */}
                    <div className="space-y-4">
                      <HarmonySelector
                        baseColor={colorStops[0]?.color || '#ff0000'}
                        onHarmonySelect={handleHarmonySelect}
                      />
                      {selectedHarmony && (
                        <button
                          onClick={applyHarmony}
                          className="w-full inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 active:scale-[0.98]"
                        >
                          Apply {selectedHarmony.name} Harmony
                        </button>
                      )}
                    </div>

                    {/* Shade Generator */}
                    <div className="space-y-4">
                      <ShadeGenerator
                        color1={colorStops[0]?.color || '#ff0000'}
                        color2={colorStops[colorStops.length - 1]?.color || '#0000ff'}
                        onShadesGenerated={handleShadesGenerated}
                      />
                      {generatedShades.length > 0 && (
                        <button
                          onClick={applyShades}
                          className="w-full inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 bg-slate-600 text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 active:scale-[0.98]"
                        >
                          Apply Generated Shades
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {(!isMobileView || activeSection === 'export') && (
              <motion.div
                key="export"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Export Panel */}
                <div className="mb-8" data-onboarding="export">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Export Options</h2>
                    <button
                      onClick={() => setIsExportModalOpen(true)}
                      className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 active:scale-[0.98]"
                    >
                      🎯 Advanced Export
                    </button>
                  </div>

                  <ExportPanel
                    baseColor={colorStops[0]?.color || '#ff0000'}
                    paletteName="my-palette"
                  />
                </div>
              </motion.div>
            )}

            {(!isMobileView || activeSection === 'settings') && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Additional Controls */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Additional Tools</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={randomizeColors}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 active:scale-[0.98]"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Randomizing...
                        </>
                      ) : (
                        <>🎲 Randomize</>
                      )}
                    </button>
                    <button
                      onClick={openEyedropper}
                      className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 active:scale-[0.98]"
                      title="Pick color from screen (EyeDropper)"
                    >
                      👁️ Eyedropper
                    </button>
                  </div>
                </div>

                {/* Mixed Color Preview */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Mixed Color Preview</h3>
                  <div className="flex flex-col items-center gap-3 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-20 h-20 rounded-2xl border-2 border-white dark:border-slate-700 shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95"
                        style={{ backgroundColor: mixedColor }}
                        onClick={() => copyToClipboard(mixedColor, 'Mixed color')}
                        title="Click to copy mixed color"
                      />
                      <div>
                        <div className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">{mixedColor.toUpperCase()}</div>
                        <button
                          onClick={() => copyToClipboard(mixedColor, 'Mixed color')}
                          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 active:scale-95"
                          title="Copy mixed color"
                        >
                          📋 Copy Color
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Non-mobile sections - always visible */}
      {!isMobileView && (
        <>
          {/* Accessibility Panel */}
          <div className="mt-8">
            <AccessibilityPanel
              colors={colorStops.map(stop => stop.color)}
              backgroundColor="#ffffff"
              onColorFix={handleColorFix}
            />
          </div>

          {/* Example Galleries */}
          <div className="mt-8">
            <ExampleGalleries
              onPaletteSelect={(colors) => {
                setColorStops(colors);
                updatePalette(colors);
              }}
            />
          </div>

          {/* Color Theory Tips */}
          <div className="mt-8">
            <ColorTheoryTips
              currentContext="general"
              isVisible={true}
            />
          </div>

          {/* Palette History */}
          <div className="mt-8">
            <PaletteHistory
              history={history.past}
              onRestorePalette={(palette) => {
                setColorStops(palette.colors);
                updatePalette(palette.colors);
              }}
              onAddToComparison={(palette) => addToComparison(palette)}
              onSaveToFavorites={(palette) => addToFavorites(palette)}
            />
          </div>

          {/* Palette Comparison */}
          {comparisonPalettes.length > 0 && (
            <div className="mt-8">
              <PaletteComparison
                palettes={comparisonPalettes}
                onRemovePalette={(id) => removeFromComparison(id)}
                onClose={() => clearComparison()}
              />
            </div>
          )}
        </>
      )}

      {/* Modal Export Dialog */}
      <ModalExportDialog
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        baseColor={colorStops[0]?.color || '#ff0000'}
        paletteName="my-palette"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            {toastMessage}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ColorMixer;