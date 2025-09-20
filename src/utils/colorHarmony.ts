import chroma from 'chroma-js';

export interface ColorHarmony {
  name: string;
  colors: string[];
  description: string;
}

export interface ColorPalette {
  base: string;
  shades: string[];
  tints: string[];
  tailwindScale: { [key: string]: string };
  materialDesign: string[];
}

/**
 * Generate monochromatic harmony (variations of the same hue)
 */
export function generateMonochromatic(baseColor: string, count: number = 5): ColorHarmony {
  try {
    const base = chroma(baseColor);
    const hsl = base.hsl();
    const colors: string[] = [];

    // Generate variations by adjusting lightness
    for (let i = 0; i < count; i++) {
      const lightness = 0.1 + (i / (count - 1)) * 0.8; // From 10% to 90%
      const color = chroma.hsl(hsl[0], hsl[1], lightness);
      colors.push(color.hex());
    }

    return {
      name: 'Monochromatic',
      colors,
      description: 'Variations of the same hue with different lightness values'
    };
  } catch {
    return { name: 'Monochromatic', colors: [baseColor], description: 'Error generating monochromatic harmony' };
  }
}

/**
 * Generate analogous harmony (adjacent hues on color wheel)
 */
export function generateAnalogous(baseColor: string, count: number = 5): ColorHarmony {
  try {
    const base = chroma(baseColor);
    const hsl = base.hsl();
    const colors: string[] = [];
    const hueStep = 30; // 30 degrees on color wheel

    for (let i = 0; i < count; i++) {
      const hue = (hsl[0] + (i - Math.floor(count / 2)) * hueStep + 360) % 360;
      const color = chroma.hsl(hue, hsl[1], hsl[2]);
      colors.push(color.hex());
    }

    return {
      name: 'Analogous',
      colors,
      description: 'Colors adjacent to each other on the color wheel'
    };
  } catch {
    return { name: 'Analogous', colors: [baseColor], description: 'Error generating analogous harmony' };
  }
}

/**
 * Generate triadic harmony (three equally spaced colors)
 */
export function generateTriadic(baseColor: string): ColorHarmony {
  try {
    const base = chroma(baseColor);
    const hsl = base.hsl();
    const colors: string[] = [];

    for (let i = 0; i < 3; i++) {
      const hue = (hsl[0] + i * 120) % 360;
      const color = chroma.hsl(hue, hsl[1], hsl[2]);
      colors.push(color.hex());
    }

    return {
      name: 'Triadic',
      colors,
      description: 'Three colors equally spaced around the color wheel'
    };
  } catch {
    return { name: 'Triadic', colors: [baseColor], description: 'Error generating triadic harmony' };
  }
}

/**
 * Generate complementary harmony (opposite colors)
 */
export function generateComplementary(baseColor: string): ColorHarmony {
  try {
    const base = chroma(baseColor);
    const hsl = base.hsl();
    const colors: string[] = [];

    // Base color
    colors.push(base.hex());

    // Complementary color (180 degrees opposite)
    const complementaryHue = (hsl[0] + 180) % 360;
    const complementary = chroma.hsl(complementaryHue, hsl[1], hsl[2]);
    colors.push(complementary.hex());

    return {
      name: 'Complementary',
      colors,
      description: 'Two colors opposite each other on the color wheel'
    };
  } catch {
    return { name: 'Complementary', colors: [baseColor], description: 'Error generating complementary harmony' };
  }
}

/**
 * Generate split-complementary harmony (base + two adjacent to complement)
 */
export function generateSplitComplementary(baseColor: string): ColorHarmony {
  try {
    const base = chroma(baseColor);
    const hsl = base.hsl();
    const colors: string[] = [];

    // Base color
    colors.push(base.hex());

    // Split complementary colors (±150° from complementary)
    const complementaryHue = (hsl[0] + 180) % 360;
    const split1 = chroma.hsl((complementaryHue + 30) % 360, hsl[1], hsl[2]);
    const split2 = chroma.hsl((complementaryHue - 30 + 360) % 360, hsl[1], hsl[2]);

    colors.push(split1.hex(), split2.hex());

    return {
      name: 'Split-Complementary',
      colors,
      description: 'Base color with two colors adjacent to its complement'
    };
  } catch {
    return { name: 'Split-Complementary', colors: [baseColor], description: 'Error generating split-complementary harmony' };
  }
}

/**
 * Generate tetradic harmony (four equally spaced colors)
 */
export function generateTetradic(baseColor: string): ColorHarmony {
  try {
    const base = chroma(baseColor);
    const hsl = base.hsl();
    const colors: string[] = [];

    for (let i = 0; i < 4; i++) {
      const hue = (hsl[0] + i * 90) % 360;
      const color = chroma.hsl(hue, hsl[1], hsl[2]);
      colors.push(color.hex());
    }

    return {
      name: 'Tetradic',
      colors,
      description: 'Four colors equally spaced around the color wheel'
    };
  } catch {
    return { name: 'Tetradic', colors: [baseColor], description: 'Error generating tetradic harmony' };
  }
}

/**
 * Generate shades between two colors
 */
export function generateShadesBetween(color1: string, color2: string, count: number = 5): string[] {
  try {
    const scale = chroma.scale([color1, color2]).mode('lch').colors(count);
    return scale;
  } catch {
    return [color1, color2];
  }
}

/**
 * Generate tints and shades for a single color
 */
export function generateTintsAndShades(baseColor: string, count: number = 5): { tints: string[], shades: string[] } {
  try {
    const base = chroma(baseColor);
    const tints: string[] = [];
    const shades: string[] = [];

    // Generate tints (lighter)
    for (let i = 1; i <= count; i++) {
      const lightness = Math.min(1, base.lch()[2] / 100 + (i / (count + 1)));
      const tint = base.set('lch.l', lightness * 100);
      tints.push(tint.hex());
    }

    // Generate shades (darker)
    for (let i = 1; i <= count; i++) {
      const lightness = Math.max(0, base.lch()[2] / 100 - (i / (count + 1)));
      const shade = base.set('lch.l', lightness * 100);
      shades.push(shade.hex());
    }

    return { tints, shades };
  } catch {
    return { tints: [baseColor], shades: [baseColor] };
  }
}

/**
 * Generate Tailwind CSS scale (50-950)
 */
export function generateTailwindScale(baseColor: string): { [key: string]: string } {
  try {
    const base = chroma(baseColor);
    const scale: { [key: string]: string } = {};

    // Tailwind scale goes from 50 (very light) to 950 (very dark)
    for (let i = 50; i <= 950; i += 50) {
      // Convert scale position to lightness (0-1)
      const lightness = 1 - ((i - 50) / 900);
      const color = base.set('lch.l', lightness * 100);
      scale[i.toString()] = color.hex();
    }

    return scale;
  } catch {
    return { '500': baseColor };
  }
}

/**
 * Generate Material Design color variations
 */
export function generateMaterialDesign(baseColor: string): string[] {
  try {
    const base = chroma(baseColor);
    const variations: string[] = [];

    // Material Design tonal palette values
    const tonalValues = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    tonalValues.forEach(value => {
      // Convert Material Design tonal value to lightness
      let lightness;
      if (value <= 500) {
        lightness = 0.95 - ((500 - value) / 500) * 0.7;
      } else {
        lightness = 0.5 - ((value - 500) / 400) * 0.4;
      }

      const color = base.set('lch.l', lightness * 100);
      variations.push(color.hex());
    });

    return variations;
  } catch {
    return [baseColor];
  }
}

/**
 * Generate complete color palette from base color
 */
export function generateColorPalette(baseColor: string): ColorPalette {
  try {
    const { tints, shades } = generateTintsAndShades(baseColor);
    const tailwindScale = generateTailwindScale(baseColor);
    const materialDesign = generateMaterialDesign(baseColor);

    return {
      base: baseColor,
      shades,
      tints,
      tailwindScale,
      materialDesign
    };
  } catch {
    return {
      base: baseColor,
      shades: [baseColor],
      tints: [baseColor],
      tailwindScale: { '500': baseColor },
      materialDesign: [baseColor]
    };
  }
}

export interface ExportFormat {
  name: string;
  format: 'css' | 'scss' | 'json' | 'js' | 'svg' | 'ase' | 'vue';
  content: string;
  filename: string;
}

/**
 * Generate Tailwind CSS color scale export
 */
export function generateTailwindExport(baseColor: string, name: string = 'primary'): ExportFormat {
  try {
    const scale = generateTailwindScale(baseColor);
    const tailwindConfig = `export default {
  theme: {
    extend: {
      colors: {
        ${name}: {
${Object.entries(scale).map(([key]) => `          ${key}: 'var(--color-${name}-${key})',`).join('\n')}
        }
      }
    }
  }
}`;

    const cssVars = Object.entries(scale)
      .map(([key, value]) => `  --color-${name}-${key}: ${value};`)
      .join('\n');
    const cssContent = `:root {\n${cssVars}\n}`;

    return {
      name: 'Tailwind CSS Scale',
      format: 'js',
      content: `${cssContent}\n\n${tailwindConfig}`,
      filename: `tailwind-${name}-scale.js`
    };
  } catch {
    return {
      name: 'Tailwind CSS Scale',
      format: 'js',
      content: `// Error generating Tailwind scale for ${baseColor}`,
      filename: `tailwind-error.js`
    };
  }
}

/**
 * Generate Material Design color variations export
 */
export function generateMaterialDesignExport(baseColor: string, name: string = 'primary'): ExportFormat {
  try {
    const variations = generateMaterialDesign(baseColor);

    const materialPalette = {
      [name]: {
        50: variations[0],
        100: variations[1],
        200: variations[2],
        300: variations[3],
        400: variations[4],
        500: variations[5],
        600: variations[6],
        700: variations[7],
        800: variations[8],
        900: variations[9]
      }
    };

    const jsonContent = JSON.stringify(materialPalette, null, 2);

    return {
      name: 'Material Design Palette',
      format: 'json',
      content: jsonContent,
      filename: `material-${name}-palette.json`
    };
  } catch {
    return {
      name: 'Material Design Palette',
      format: 'json',
      content: `{"error": "Could not generate Material Design palette for ${baseColor}"}`,
      filename: `material-error.json`
    };
  }
}

/**
 * Generate CSS custom properties export
 */
export function generateCSSExport(colorPalette: ColorPalette, name: string = 'palette'): ExportFormat {
  try {
    const cssVars: string[] = [];

    // Base color
    cssVars.push(`  --color-${name}-base: ${colorPalette.base};`);

    // Shades
    colorPalette.shades.forEach((shade, index) => {
      cssVars.push(`  --color-${name}-shade-${index + 1}: ${shade};`);
    });

    // Tints
    colorPalette.tints.forEach((tint, index) => {
      cssVars.push(`  --color-${name}-tint-${index + 1}: ${tint};`);
    });

    // Tailwind scale
    Object.entries(colorPalette.tailwindScale).forEach(([key, value]) => {
      cssVars.push(`  --color-${name}-${key}: ${value};`);
    });

    // Material Design
    colorPalette.materialDesign.forEach((color, index) => {
      const level = (index + 1) * 50;
      cssVars.push(`  --color-${name}-material-${level}: ${color};`);
    });

    const cssContent = `:root {\n${cssVars.join('\n')}\n}`;

    return {
      name: 'CSS Custom Properties',
      format: 'css',
      content: cssContent,
      filename: `${name}-palette.css`
    };
  } catch {
    return {
      name: 'CSS Custom Properties',
      format: 'css',
      content: `/* Error generating CSS for ${name} */`,
      filename: `${name}-error.css`
    };
  }
}

/**
 * Generate SCSS variables export
 */
export function generateSCSSExport(colorPalette: ColorPalette, name: string = 'palette'): ExportFormat {
  try {
    const scssVars: string[] = [];

    // Base color
    scssVars.push(`$${name}-base: ${colorPalette.base};`);

    // Shades
    colorPalette.shades.forEach((shade, index) => {
      scssVars.push(`$${name}-shade-${index + 1}: ${shade};`);
    });

    // Tints
    colorPalette.tints.forEach((tint, index) => {
      scssVars.push(`$${name}-tint-${index + 1}: ${tint};`);
    });

    // Tailwind scale
    Object.entries(colorPalette.tailwindScale).forEach(([key, value]) => {
      scssVars.push(`$${name}-${key}: ${value};`);
    });

    // Material Design
    colorPalette.materialDesign.forEach((color, index) => {
      const level = (index + 1) * 50;
      scssVars.push(`$${name}-material-${level}: ${color};`);
    });

    const scssContent = scssVars.join('\n');

    return {
      name: 'SCSS Variables',
      format: 'scss',
      content: scssContent,
      filename: `${name}-palette.scss`
    };
  } catch {
    return {
      name: 'SCSS Variables',
      format: 'scss',
      content: `// Error generating SCSS for ${name}`,
      filename: `${name}-error.scss`
    };
  }
}

/**
 * Generate SVG color definitions export
 */
export function generateSVGExport(colorPalette: ColorPalette, name: string = 'palette'): ExportFormat {
  try {
    const svgDefinitions = colorPalette.shades.map((shade, index) =>
      `  <linearGradient id="${name}-shade-${index + 1}" x1="0%" y1="0%" x2="100%" y2="0%">\n    <stop offset="0%" style="stop-color:${shade};stop-opacity:1" />\n    <stop offset="100%" style="stop-color:${shade};stop-opacity:1" />\n  </linearGradient>`
    ).join('\n');

    const colorSwatches = colorPalette.shades.map((_, index) =>
      `  <rect x="${index * 60}" y="10" width="50" height="50" fill="${colorPalette.shades[index]}" stroke="#000" stroke-width="1"/>`
    ).join('\n');

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${colorPalette.shades.length * 60 + 20}" height="80">
  <defs>
${svgDefinitions}
  </defs>

  <!-- Color swatches -->
${colorSwatches}

  <!-- Color names -->
${colorPalette.shades.map((_, index) =>
  `  <text x="${index * 60 + 25}" y="75" text-anchor="middle" font-family="Arial" font-size="10" fill="#000">${name}-shade-${index + 1}</text>`
).join('\n')}
</svg>`;

    return {
      name: 'SVG Color Definitions',
      format: 'svg',
      content: svgContent,
      filename: `${name}-colors.svg`
    };
  } catch {
    return {
      name: 'SVG Color Definitions',
      format: 'svg',
      content: `<!-- Error generating SVG for ${name} -->`,
      filename: `${name}-error.svg`
    };
  }
}

/**
 * Generate Adobe ASE (Adobe Swatch Exchange) file
 */
export function generateASEExport(colorPalette: ColorPalette, name: string = 'palette'): ExportFormat {
  try {
    // ASE file format is binary, but we'll create a simplified text representation
    // In a real implementation, you'd generate proper binary ASE format
    const aseHeader = `ASEF
00010000
0000
${(name.length + colorPalette.shades.length * 2).toString(16).padStart(4, '0')}`;

    const colorBlocks = colorPalette.shades.map((shade, index) => {
      const rgb = chroma(shade).rgb();
      const r = (rgb[0] / 255).toFixed(6);
      const g = (rgb[1] / 255).toFixed(6);
      const b = (rgb[2] / 255).toFixed(6);

      return `0001
${(name + '-shade-' + (index + 1)).length.toString(16).padStart(4, '0')}
${name}-shade-${index + 1}
RGB
${r}
${g}
${b}`;
    }).join('\n');

    const aseContent = `${aseHeader}
${colorBlocks}`;

    return {
      name: 'Adobe ASE Swatch File',
      format: 'ase',
      content: aseContent,
      filename: `${name}-palette.ase`
    };
  } catch {
    return {
      name: 'Adobe ASE Swatch File',
      format: 'ase',
      content: `// Error generating ASE for ${name}`,
      filename: `${name}-error.ase`
    };
  }
}

/**
 * Generate Figma design tokens
 */
export function generateFigmaTokens(colorPalette: ColorPalette, name: string = 'palette'): ExportFormat {
  try {
    const tokens: {
      version: string;
      tokens: { [key: string]: { value: string; type: string } };
    } = {
      version: '1.0.0',
      tokens: {}
    };

    // Add base colors
    tokens.tokens[`${name}.base`] = {
      value: colorPalette.base,
      type: 'color'
    };

    // Add shades
    colorPalette.shades.forEach((shade, index) => {
      tokens.tokens[`${name}.shade.${index + 1}`] = {
        value: shade,
        type: 'color'
      };
    });

    // Add tints
    colorPalette.tints.forEach((tint, index) => {
      tokens.tokens[`${name}.tint.${index + 1}`] = {
        value: tint,
        type: 'color'
      };
    });

    // Add Tailwind scale
    Object.entries(colorPalette.tailwindScale).forEach(([key, value]) => {
      tokens.tokens[`${name}.tailwind.${key}`] = {
        value: value,
        type: 'color'
      };
    });

    const jsonContent = JSON.stringify(tokens, null, 2);

    return {
      name: 'Figma Design Tokens',
      format: 'json',
      content: jsonContent,
      filename: `${name}-figma-tokens.json`
    };
  } catch {
    return {
      name: 'Figma Design Tokens',
      format: 'json',
      content: `{"error": "Could not generate Figma tokens for ${name}"}`,
      filename: `${name}-error.json`
    };
  }
}

/**
 * Generate Sketch design tokens
 */
export function generateSketchTokens(colorPalette: ColorPalette, name: string = 'palette'): ExportFormat {
  try {
    const tokens: {
      colors: { [key: string]: { value: string; type: string } };
    } = {
      colors: {}
    };

    // Add base colors
    tokens.colors[`${name}/base`] = {
      value: colorPalette.base,
      type: 'color'
    };

    // Add shades
    colorPalette.shades.forEach((shade, index) => {
      tokens.colors[`${name}/shades/${index + 1}`] = {
        value: shade,
        type: 'color'
      };
    });

    // Add tints
    colorPalette.tints.forEach((tint, index) => {
      tokens.colors[`${name}/tints/${index + 1}`] = {
        value: tint,
        type: 'color'
      };
    });

    const jsonContent = JSON.stringify(tokens, null, 2);

    return {
      name: 'Sketch Design Tokens',
      format: 'json',
      content: jsonContent,
      filename: `${name}-sketch-tokens.json`
    };
  } catch {
    return {
      name: 'Sketch Design Tokens',
      format: 'json',
      content: `{"error": "Could not generate Sketch tokens for ${name}"}`,
      filename: `${name}-error.json`
    };
  }
}

/**
 * Generate CSS gradient generators
 */
export function generateGradientExport(colorPalette: ColorPalette, name: string = 'palette'): ExportFormat {
  try {
    const gradients: string[] = [];

    // Linear gradients
    gradients.push(`/* Linear Gradients */
.${name}-gradient-linear {
  background: linear-gradient(45deg, ${colorPalette.shades.join(', ')});
}

.${name}-gradient-radial {
  background: radial-gradient(circle, ${colorPalette.shades.join(', ')});
}

.${name}-gradient-conic {
  background: conic-gradient(${colorPalette.shades.join(', ')});
}`);

    // CSS custom properties for gradients
    gradients.push(`
/* Gradient Custom Properties */
:root {
  --${name}-gradient-linear: linear-gradient(45deg, ${colorPalette.shades.join(', ')});
  --${name}-gradient-radial: radial-gradient(circle, ${colorPalette.shades.join(', ')});
  --${name}-gradient-conic: conic-gradient(${colorPalette.shades.join(', ')});
}

.${name}-gradient-custom {
  background: var(--${name}-gradient-linear);
}`);

    const cssContent = gradients.join('\n');

    return {
      name: 'CSS Gradient Generators',
      format: 'css',
      content: cssContent,
      filename: `${name}-gradients.css`
    };
  } catch {
    return {
      name: 'CSS Gradient Generators',
      format: 'css',
      content: `/* Error generating gradients for ${name} */`,
      filename: `${name}-error.css`
    };
  }
}

/**
 * Generate React component snippets
 */
export function generateReactSnippets(colorPalette: ColorPalette, name: string = 'palette'): ExportFormat {
  try {
    const componentName = name.charAt(0).toUpperCase() + name.slice(1);

    const reactCode = `import React from 'react';

// ${componentName} Color Palette Component
const ${componentName}Palette = () => {
  const colors = {
    base: '${colorPalette.base}',
    shades: [${colorPalette.shades.map(c => `'${c}'`).join(', ')}],
    tints: [${colorPalette.tints.map(c => `'${c}'`).join(', ')}]
  };

  return (
    <div className="${name}-palette">
      <h3>${componentName} Colors</h3>

      {/* Base Color */}
      <div
        className="${name}-color ${name}-color-base"
        style={{ backgroundColor: colors.base }}
      >
        Base: {colors.base}
      </div>

      {/* Shades */}
      <div className="${name}-shades">
        <h4>Shades</h4>
        {colors.shades.map((shade, index) => (
          <div
            key={index}
            className="${name}-color ${name}-color-shade"
            style={{ backgroundColor: shade }}
          >
            Shade {index + 1}: {shade}
          </div>
        ))}
      </div>

      {/* Tints */}
      <div className="${name}-tints">
        <h4>Tints</h4>
        {colors.tints.map((tint, index) => (
          <div
            key={index}
            className="${name}-color ${name}-color-tint"
            style={{ backgroundColor: tint }}
          >
            Tint {index + 1}: {tint}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ${componentName}Palette;

// CSS for ${componentName}Palette
/*
.${name}-palette {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.${name}-color {
  padding: 1rem;
  border-radius: 0.5rem;
  color: white;
  font-family: monospace;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.${name}-shades, .${name}-tints {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
}
*/`;

    return {
      name: 'React Component Snippet',
      format: 'js',
      content: reactCode,
      filename: `${componentName}Palette.jsx`
    };
  } catch {
    return {
      name: 'React Component Snippet',
      format: 'js',
      content: `// Error generating React component for ${name}`,
      filename: `${name}-error.jsx`
    };
  }
}

/**
 * Generate Vue component snippets
 */
export function generateVueSnippets(colorPalette: ColorPalette, name: string = 'palette'): ExportFormat {
  try {
    const componentName = name.charAt(0).toUpperCase() + name.slice(1);

    const vueCode = `<template>
  <div class="${name}-palette">
    <h3>${componentName} Color Palette</h3>

    <!-- Base Color -->
    <div
      class="${name}-color ${name}-color-base"
      :style="{ backgroundColor: colors.base }"
    >
      Base: {{ colors.base }}
    </div>

    <!-- Shades -->
    <div class="${name}-shades">
      <h4>Shades</h4>
      <div
        v-for="(shade, index) in colors.shades"
        :key="index"
        class="${name}-color ${name}-color-shade"
        :style="{ backgroundColor: shade }"
      >
        Shade {{ index + 1 }}: {{ shade }}
      </div>
    </div>

    <!-- Tints -->
    <div class="${name}-tints">
      <h4>Tints</h4>
      <div
        v-for="(tint, index) in colors.tints"
        :key="index"
        class="${name}-color ${name}-color-tint"
        :style="{ backgroundColor: tint }"
      >
        Tint {{ index + 1 }}: {{ tint }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '${componentName}Palette',
  data() {
    return {
      colors: {
        base: '${colorPalette.base}',
        shades: [${colorPalette.shades.map(c => `'${c}'`).join(', ')}],
        tints: [${colorPalette.tints.map(c => `'${c}'`).join(', ')}]
      }
    };
  }
};
</script>

<style scoped>
.${name}-palette {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.${name}-color {
  padding: 1rem;
  border-radius: 0.5rem;
  color: white;
  font-family: monospace;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.${name}-shades, .${name}-tints {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
}
</style>`;

    return {
      name: 'Vue Component Snippet',
      format: 'vue',
      content: vueCode,
      filename: `${componentName}Palette.vue`
    };
  } catch {
    return {
      name: 'Vue Component Snippet',
      format: 'vue',
      content: `<!-- Error generating Vue component for ${name} -->`,
      filename: `${name}-error.vue`
    };
  }
}

/**
 * Generate comprehensive color palette export in all formats
 */
export function generateAllExports(baseColor: string, name: string = 'palette'): ExportFormat[] {
  const colorPalette = generateColorPalette(baseColor);

  return [
    generateCSSExport(colorPalette, name),
    generateSCSSExport(colorPalette, name),
    generateTailwindExport(baseColor, name),
    generateMaterialDesignExport(baseColor, name),
    generateSVGExport(colorPalette, name),
    generateASEExport(colorPalette, name),
    generateFigmaTokens(colorPalette, name),
    generateSketchTokens(colorPalette, name),
    generateGradientExport(colorPalette, name),
    generateReactSnippets(colorPalette, name),
    generateVueSnippets(colorPalette, name)
  ];
}

/**
 * Generate all color harmonies for a given base color
 */
export function getAllHarmonies(baseColor: string): ColorHarmony[] {
  return [
    generateMonochromatic(baseColor),
    generateAnalogous(baseColor),
    generateTriadic(baseColor),
    generateComplementary(baseColor),
    generateSplitComplementary(baseColor),
    generateTetradic(baseColor)
  ];
}
