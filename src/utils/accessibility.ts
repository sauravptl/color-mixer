import chroma from 'chroma-js';

export interface ContrastResult {
  ratio: number;
  aa: {
    normal: boolean;
    large: boolean;
  };
  aaa: {
    normal: boolean;
    large: boolean;
  };
  level: 'AAA' | 'AA' | 'FAIL';
  recommendation: string;
}

export interface ColorBlindnessFilter {
  name: string;
  description: string;
  matrix: number[][];
}

export interface AccessibilitySuggestion {
  type: 'lighten' | 'darken' | 'adjust_hue' | 'complement';
  description: string;
  suggestedColor: string;
  improvement: number; // contrast ratio improvement
}

// WCAG contrast requirements
const WCAG_REQUIREMENTS = {
  aa: {
    normal: 4.5,
    large: 3.0
  },
  aaa: {
    normal: 7.0,
    large: 4.5
  }
};

/**
 * Calculate contrast ratio between two colors
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  try {
    const c1 = chroma(color1);
    const c2 = chroma(color2);

    // Calculate relative luminance
    const lum1 = getRelativeLuminance(c1);
    const lum2 = getRelativeLuminance(c2);

    // Contrast ratio formula
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 1;
  }
}

/**
 * Calculate relative luminance using WCAG formula
 */
function getRelativeLuminance(color: chroma.Color): number {
  const rgb = color.rgb();
  const rsRGB = rgb[0] / 255;
  const gsRGB = rgb[1] / 255;
  const bsRGB = rgb[2] / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Check WCAG compliance for text contrast
 */
export function checkWCAGCompliance(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): ContrastResult {
  const ratio = calculateContrastRatio(foreground, background);

  const aa = {
    normal: ratio >= WCAG_REQUIREMENTS.aa.normal,
    large: ratio >= WCAG_REQUIREMENTS.aa.large
  };

  const aaa = {
    normal: ratio >= WCAG_REQUIREMENTS.aaa.normal,
    large: ratio >= WCAG_REQUIREMENTS.aaa.large
  };

  let level: 'AAA' | 'AA' | 'FAIL';
  let recommendation = '';

  if (aaa.normal || (aaa.large && isLargeText)) {
    level = 'AAA';
    recommendation = 'Excellent contrast! Meets highest accessibility standards.';
  } else if (aa.normal || (aa.large && isLargeText)) {
    level = 'AA';
    recommendation = 'Good contrast! Meets basic accessibility requirements.';
  } else {
    level = 'FAIL';
    recommendation = `Poor contrast (${ratio.toFixed(2)}:1). Consider adjusting colors for better accessibility.`;
  }

  return {
    ratio,
    aa,
    aaa,
    level,
    recommendation
  };
}

/**
 * Color blindness simulation matrices
 */
export const COLOR_BLINDNESS_FILTERS: ColorBlindnessFilter[] = [
  {
    name: 'Normal Vision',
    description: 'Standard color vision',
    matrix: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]
  },
  {
    name: 'Protanopia',
    description: 'Red-blind (missing L-cones)',
    matrix: [
      [0.567, 0.433, 0, 0],
      [0.558, 0.442, 0, 0],
      [0, 0.242, 0.758, 0],
      [0, 0, 0, 1]
    ]
  },
  {
    name: 'Deuteranopia',
    description: 'Green-blind (missing M-cones)',
    matrix: [
      [0.625, 0.375, 0, 0],
      [0.7, 0.3, 0, 0],
      [0, 0.3, 0.7, 0],
      [0, 0, 0, 1]
    ]
  },
  {
    name: 'Tritanopia',
    description: 'Blue-blind (missing S-cones)',
    matrix: [
      [0.95, 0.05, 0, 0],
      [0, 0.433, 0.567, 0],
      [0, 0.475, 0.525, 0],
      [0, 0, 0, 1]
    ]
  },
  {
    name: 'Achromatopsia',
    description: 'Complete color blindness (monochrome)',
    matrix: [
      [0.299, 0.587, 0.114, 0],
      [0.299, 0.587, 0.114, 0],
      [0.299, 0.587, 0.114, 0],
      [0, 0, 0, 1]
    ]
  },
  {
    name: 'Protanomaly',
    description: 'Reduced sensitivity to red',
    matrix: [
      [0.817, 0.183, 0, 0],
      [0.333, 0.667, 0, 0],
      [0, 0.125, 0.875, 0],
      [0, 0, 0, 1]
    ]
  },
  {
    name: 'Deuteranomaly',
    description: 'Reduced sensitivity to green',
    matrix: [
      [0.8, 0.2, 0, 0],
      [0.258, 0.742, 0, 0],
      [0, 0.142, 0.858, 0],
      [0, 0, 0, 1]
    ]
  },
  {
    name: 'Tritanomaly',
    description: 'Reduced sensitivity to blue',
    matrix: [
      [0.967, 0.033, 0, 0],
      [0, 0.733, 0.267, 0],
      [0, 0.183, 0.817, 0],
      [0, 0, 0, 1]
    ]
  }
];

/**
 * Apply color blindness filter to a color
 */
export function applyColorBlindnessFilter(color: string, filter: ColorBlindnessFilter): string {
  try {
    const c = chroma(color);
    const rgb = c.rgb();

    // Normalize RGB values
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    // Apply transformation matrix
    const matrix = filter.matrix;
    const newR = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
    const newG = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
    const newB = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;

    // Clamp and convert back
    const clampedR = Math.max(0, Math.min(1, newR));
    const clampedG = Math.max(0, Math.min(1, newG));
    const clampedB = Math.max(0, Math.min(1, newB));

    return chroma([clampedR * 255, clampedG * 255, clampedB * 255]).hex();
  } catch {
    return color;
  }
}

/**
 * Generate accessibility suggestions for a color pair
 */
export function generateAccessibilitySuggestions(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): AccessibilitySuggestion[] {
  const currentRatio = calculateContrastRatio(foreground, background);
  const suggestions: AccessibilitySuggestion[] = [];

  try {
    const fgColor = chroma(foreground);
    const fgHsl = fgColor.hsl();

    const targetRatio = isLargeText ? WCAG_REQUIREMENTS.aa.large : WCAG_REQUIREMENTS.aa.normal;

    if (currentRatio < targetRatio) {
      // Try lightening the foreground color
      const lightenedFg = fgColor.set('hsl.l', Math.min(1, fgHsl[2] + 0.3));
      const lightenedRatio = calculateContrastRatio(lightenedFg.hex(), background);

      if (lightenedRatio > currentRatio) {
        suggestions.push({
          type: 'lighten',
          description: `Lighten foreground color to ${lightenedFg.hex()}`,
          suggestedColor: lightenedFg.hex(),
          improvement: lightenedRatio - currentRatio
        });
      }

      // Try darkening the foreground color
      const darkenedFg = fgColor.set('hsl.l', Math.max(0, fgHsl[2] - 0.3));
      const darkenedRatio = calculateContrastRatio(darkenedFg.hex(), background);

      if (darkenedRatio > currentRatio) {
        suggestions.push({
          type: 'darken',
          description: `Darken foreground color to ${darkenedFg.hex()}`,
          suggestedColor: darkenedFg.hex(),
          improvement: darkenedRatio - currentRatio
        });
      }

      // Try adjusting hue for better contrast
      const adjustedHue = (fgHsl[0] + 180) % 360; // Opposite hue
      const adjustedFg = chroma.hsl(adjustedHue, fgHsl[1], fgHsl[2]);
      const adjustedRatio = calculateContrastRatio(adjustedFg.hex(), background);

      if (adjustedRatio > currentRatio) {
        suggestions.push({
          type: 'adjust_hue',
          description: `Change hue to complementary color ${adjustedFg.hex()}`,
          suggestedColor: adjustedFg.hex(),
          improvement: adjustedRatio - currentRatio
        });
      }
    }

    // Sort by improvement (best first)
    return suggestions.sort((a, b) => b.improvement - a.improvement);
  } catch {
    return suggestions;
  }
}

/**
 * Find the best accessible color alternative
 */
export function findBestAccessibleColor(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): string | null {
  const suggestions = generateAccessibilitySuggestions(foreground, background, isLargeText);

  if (suggestions.length > 0) {
    const targetRatio = isLargeText ? WCAG_REQUIREMENTS.aa.large : WCAG_REQUIREMENTS.aa.normal;

    // Find first suggestion that meets the target
    const bestSuggestion = suggestions.find(suggestion => {
      const newRatio = calculateContrastRatio(suggestion.suggestedColor, background);
      return newRatio >= targetRatio;
    });

    return bestSuggestion ? bestSuggestion.suggestedColor : null;
  }

  return null;
}

/**
 * Check accessibility for entire color palette
 */
export function checkPaletteAccessibility(
  colors: string[],
  background: string = '#ffffff'
): Array<{
  color: string;
  contrast: ContrastResult;
  suggestions: AccessibilitySuggestion[];
}> {
  return colors.map(color => ({
    color,
    contrast: checkWCAGCompliance(color, background),
    suggestions: generateAccessibilitySuggestions(color, background)
  }));
}
