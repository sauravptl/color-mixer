import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    const newColorStops = colorStops.map(stop =>
      stop.locked ? stop : {
        ...stop,
        color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
      }
    );
    setColorStops(newColorStops);
    updatePalette(newColorStops);
  }, [colorStops, updatePalette]);

  const handleNewPalette = useCallback(() => {
    const newColors: ColorStop[] = [
      { id: '1', position: 0, color: '#3b82f6', locked: false }, // Blue
      { id: '2', position: 1, color: '#ec4899', locked: false }  // Pink
    ];
    setColorStops(newColors);
    updatePalette(newColors);
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

  const gradientString = `linear-gradient(to right, ${colorStops.map(stop => `${stop.color} ${stop.position * 100}%`).join(', ')})`;

  return (
    <div
      className={`bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow transition-shadow p-4 sm:p-5 flex flex-col items-center gap-6 transition-colors ${isDragOver ? 'ring-2 ring-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-lg font-semibold">Color Mixer</div>
      {isDragOver && (
        <div className="text-indigo-600 dark:text-indigo-300 font-medium">Drop image here to extract colors</div>
      )}

      {/* Quick Actions */}
      <div className="w-full max-w-4xl" data-onboarding="quick-actions">
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow transition-shadow">
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">Quick Actions</h3>
            </div>
            <QuickActions actions={quickActions} />
          </div>
        </div>
      </div>

      {/* Gradient Bar */}
      <div
        className="relative rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-crosshair"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: gradientString
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const position = (e.clientX - rect.left) / rect.width;
          addColorStop(position);
        }}
        data-onboarding="gradient-bar"
      >
        {/* Color Stops */}
        {colorStops.map((stop) => (
          <motion.div
            key={stop.id}
            className={`absolute top-0 w-4 h-full flex items-center justify-center ${stop.locked ? 'cursor-not-allowed' : 'cursor-move'}`}
            style={{
              left: `${stop.position * 100}%`,
              transform: 'translateX(-50%)'
            }}
            drag={stop.locked ? false : "x"}
            dragConstraints={stop.locked ? undefined : { left: 0, right: width - 16 }}
            dragElastic={0}
            onDrag={(_, info) => {
              const newPosition = (stop.position * width + info.delta.x) / width;
              handleStopDrag(stop.id, newPosition);
            }}
            whileHover={{ scale: 1.2 }}
            whileDrag={{ scale: 1.3, zIndex: 10 }}
          >
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
              style={{ backgroundColor: stop.color }}
            />
          </motion.div>
        ))}
      </div>

      {/* Color Inputs */}
      <div className="w-full max-w-md space-y-4" data-onboarding="color-inputs">
        {colorStops.map((stop) => {
          const colorValues = getColorValues(stop.color);
          return (
            <div key={stop.id} className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow transition-shadow">
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-6 h-6 rounded border border-slate-200 dark:border-slate-700"
                    style={{ backgroundColor: stop.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={colorValues.hex}
                        onChange={(e) => handleStopColorChange(stop.id, e.target.value)}
                        className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={colorValues.hex}
                        onChange={(e) => handleStopColorChange(stop.id, e.target.value)}
                        className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                        placeholder="#000000"
                      />
                      <button
                        onClick={() => copyToClipboard(colorValues.hex, 'HEX color')}
                        className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                        title="Copy HEX"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleLock(stop.id)}
                    className={`inline-flex items-center justify-center rounded-lg px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${stop.locked ? 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400' : 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'}`}
                  >
                    {stop.locked ? '🔒' : '🔓'}
                  </button>
                  <button
                    onClick={() => removeColorStop(stop.id)}
                    className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed bg-rose-500 text-white hover:bg-rose-600"
                    disabled={colorStops.length <= 2}
                  >
                    ✕
                  </button>
                </div>

                {/* RGB Inputs */}
                <div className="mb-3">
                  <div className="text-xs font-medium text-gray-600 mb-2">RGB</div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="255"
                      value={Math.round(colorValues.rgb[0])}
                      onChange={(e) => handleRGBChange(stop.id, parseInt(e.target.value) || 0, colorValues.rgb[1], colorValues.rgb[2])}
                      className="w-16 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      placeholder="R"
                    />
                    <input
                      type="number"
                      min="0"
                      max="255"
                      value={Math.round(colorValues.rgb[1])}
                      onChange={(e) => handleRGBChange(stop.id, colorValues.rgb[0], parseInt(e.target.value) || 0, colorValues.rgb[2])}
                      className="w-16 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      placeholder="G"
                    />
                    <input
                      type="number"
                      min="0"
                      max="255"
                      value={Math.round(colorValues.rgb[2])}
                      onChange={(e) => handleRGBChange(stop.id, colorValues.rgb[0], colorValues.rgb[1], parseInt(e.target.value) || 0)}
                      className="w-16 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      placeholder="B"
                    />
                  </div>
                </div>

                {/* HSL Inputs */}
                <div className="mb-3">
                  <div className="text-xs font-medium text-gray-600 mb-2">HSL</div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="360"
                      value={Math.round(colorValues.hsl[0])}
                      onChange={(e) => handleHSLChange(stop.id, parseInt(e.target.value) || 0, colorValues.hsl[1], colorValues.hsl[2])}
                      className="w-16 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      placeholder="H"
                    />
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={colorValues.hsl[1].toFixed(2)}
                      onChange={(e) => handleHSLChange(stop.id, colorValues.hsl[0], parseFloat(e.target.value) || 0, colorValues.hsl[2])}
                      className="w-16 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      placeholder="S"
                    />
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={colorValues.hsl[2].toFixed(2)}
                      onChange={(e) => handleHSLChange(stop.id, colorValues.hsl[0], colorValues.hsl[1], parseFloat(e.target.value) || 0)}
                      className="w-16 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      placeholder="L"
                    />
                  </div>
                </div>

                {/* HSV Inputs */}
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-2">HSV</div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="360"
                      value={Math.round(colorValues.hsv[0])}
                      onChange={(e) => handleHSVChange(stop.id, parseInt(e.target.value) || 0, colorValues.hsv[1], colorValues.hsv[2])}
                      className="w-16 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      placeholder="H"
                    />
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={colorValues.hsv[1].toFixed(2)}
                      onChange={(e) => handleHSVChange(stop.id, colorValues.hsv[0], parseFloat(e.target.value) || 0, colorValues.hsv[2])}
                      className="w-16 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      placeholder="S"
                    />
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={colorValues.hsv[2].toFixed(2)}
                      onChange={(e) => handleHSVChange(stop.id, colorValues.hsv[0], colorValues.hsv[1], parseFloat(e.target.value) || 0)}
                      className="w-16 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      placeholder="V"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={randomizeColors}
          className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          🎲 Randomize
        </button>
        <button
          onClick={openEyedropper}
          className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          title="Pick color from screen (EyeDropper)"
        >
          👁️ Eyedropper
        </button>
      </div>

      {/* Mixed Color Preview */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm font-medium">Mixed Color Preview</div>
        <div className="flex items-center gap-2">
          <div
            className="w-16 h-16 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer"
            style={{ backgroundColor: mixedColor }}
            onClick={() => copyToClipboard(mixedColor, 'Mixed color')}
            title="Click to copy mixed color"
          />
          <button
            onClick={() => copyToClipboard(mixedColor, 'Mixed color')}
            className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            title="Copy mixed color"
          >
            📋
          </button>
        </div>
        <div className="text-xs text-gray-500 font-mono">{mixedColor.toUpperCase()}</div>
      </div>

      {/* Smart Color Generation */}
      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-xl font-bold mb-6 text-center">Smart Color Generation</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Harmony Selector */}
          <div className="space-y-4" data-onboarding="harmonies">
            <HarmonySelector
              baseColor={colorStops[0]?.color || '#ff0000'}
              onHarmonySelect={handleHarmonySelect}
            />
            {selectedHarmony && (
              <button
                onClick={applyHarmony}
                className="w-full inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
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
                className="w-full inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                Apply Generated Shades
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Export Panel */}
      <div className="w-full max-w-4xl mt-8" data-onboarding="export">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Export Options</h2>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg px-6 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            🎯 Advanced Export
          </button>
        </div>

        <ExportPanel
          baseColor={colorStops[0]?.color || '#ff0000'}
          paletteName="my-palette"
        />
      </div>

      {/* Modal Export Dialog */}
      <ModalExportDialog
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        baseColor={colorStops[0]?.color || '#ff0000'}
        paletteName="my-palette"
      />

      {/* Accessibility Panel */}
      <div className="w-full max-w-4xl mt-8">
        <AccessibilityPanel
          colors={colorStops.map(stop => stop.color)}
          backgroundColor="#ffffff"
          onColorFix={handleColorFix}
        />
      </div>

      {/* Example Galleries */}
      <div className="w-full max-w-6xl mt-8">
        <ExampleGalleries
          onPaletteSelect={(colors) => {
            setColorStops(colors);
            updatePalette(colors);
          }}
        />
      </div>

      {/* Color Theory Tips */}
      <div className="w-full max-w-4xl mt-8">
        <ColorTheoryTips
          currentContext="general"
          isVisible={true}
        />
      </div>

      {/* Palette History */}
      <div className="w-full max-w-4xl mt-8">
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
        <div className="w-full max-w-6xl mt-8">
          <PaletteComparison
            palettes={comparisonPalettes}
            onRemovePalette={(id) => removeFromComparison(id)}
            onClose={() => clearComparison()}
          />
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default ColorMixer;
