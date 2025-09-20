import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateAllExports } from './colorHarmony';
import type { Palette } from '../stores/colorMixerStore';

export interface ZipExportOptions {
  palettes: Palette[];
  includeFormats: string[];
  baseName?: string;
}

/**
 * Generate ZIP file containing all export formats for multiple palettes
 */
export const generatePaletteZip = async (options: ZipExportOptions): Promise<void> => {
  const { palettes, includeFormats, baseName = 'palettes' } = options;

  const zip = new JSZip();

  for (let i = 0; i < palettes.length; i++) {
    const palette = palettes[i];
    const paletteName = palette.name || `Palette ${i + 1}`;

    // Create a folder for this palette
    const paletteFolder = zip.folder(paletteName);

    if (!paletteFolder) continue;

    // Generate base color from first color stop
    const baseColor = palette.colors[0]?.color || '#000000';

    // Generate all export formats
    const exports = generateAllExports(baseColor, paletteName);

    // Filter by selected formats
    const filteredExports = exports.filter(exportFormat =>
      includeFormats.includes(exportFormat.format) ||
      includeFormats.length === 0 // Include all if no filter specified
    );

    // Add each export to the palette folder
    filteredExports.forEach(exportFormat => {
      paletteFolder.file(exportFormat.filename, exportFormat.content);
    });

    // Add a JSON file with the palette data
    const paletteData = {
      id: palette.id,
      name: palette.name,
      colors: palette.colors,
      createdAt: palette.createdAt,
      exportFormats: filteredExports.map(exp => ({
        name: exp.name,
        filename: exp.filename,
        format: exp.format
      }))
    };

    paletteFolder.file(`${paletteName}-data.json`, JSON.stringify(paletteData, null, 2));
  }

  // Add a summary file
  const summary = {
    generatedAt: new Date().toISOString(),
    totalPalettes: palettes.length,
    exportFormats: includeFormats,
    palettes: palettes.map(p => ({
      name: p.name,
      colorCount: p.colors.length,
      createdAt: p.createdAt
    }))
  };

  zip.file('export-summary.json', JSON.stringify(summary, null, 2));

  // Generate and download the ZIP file
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${baseName}-${new Date().toISOString().split('T')[0]}.zip`);
};

/**
 * Quick export of current palette in multiple formats
 */
export const quickExportPalette = async (palette: Palette): Promise<void> => {
  const baseColor = palette.colors[0]?.color || '#000000';
  const paletteName = palette.name || 'Current Palette';

  const exports = generateAllExports(baseColor, paletteName);
  const zip = new JSZip();

  // Add all export formats
  exports.forEach(exportFormat => {
    zip.file(exportFormat.filename, exportFormat.content);
  });

  // Add palette data
  const paletteData = {
    id: palette.id,
    name: palette.name,
    colors: palette.colors,
    createdAt: palette.createdAt,
    exportedAt: new Date().toISOString()
  };

  zip.file('palette-data.json', JSON.stringify(paletteData, null, 2));

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${paletteName.replace(/\s+/g, '-')}-export.zip`);
};
