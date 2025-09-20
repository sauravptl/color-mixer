import { describe, it, expect } from 'vitest'
import {
  generateMonochromatic,
  generateAnalogous,
  generateTriadic,
  generateComplementary,
  generateTintsAndShades
} from '../utils/colorHarmony'
import {
  calculateContrastRatio,
  checkWCAGCompliance,
  applyColorBlindnessFilter,
  COLOR_BLINDNESS_FILTERS,
  generateAccessibilitySuggestions
} from '../utils/accessibility'

describe('Color Harmony Functions', () => {
  describe('calculateContrastRatio', () => {
    it('should calculate correct contrast ratio', () => {
      const ratio = calculateContrastRatio('#000000', '#ffffff')
      expect(ratio).toBeGreaterThan(20) // Black on white should have high contrast
    })

    it('should return 1 for identical colors', () => {
      const ratio = calculateContrastRatio('#808080', '#808080')
      expect(ratio).toBe(1)
    })

    it('should handle invalid colors gracefully', () => {
      const ratio = calculateContrastRatio('invalid', '#ffffff')
      expect(ratio).toBe(1)
    })
  })

  describe('checkWCAGCompliance', () => {
    it('should pass AA for high contrast', () => {
      const result = checkWCAGCompliance('#000000', '#ffffff')
      expect(result.aa.normal).toBe(true)
      expect(result.aaa.normal).toBe(true)
    })

    it('should fail AA for low contrast', () => {
      const result = checkWCAGCompliance('#888888', '#999999')
      expect(result.aa.normal).toBe(false)
      expect(result.level).toBe('FAIL')
    })

    it('should pass AA for large text with lower contrast', () => {
      const result = checkWCAGCompliance('#777777', '#ffffff', true)
      expect(result.aa.large).toBe(true)
    })
  })

  describe('generateMonochromatic', () => {
    it('should generate monochromatic variations', () => {
      const harmony = generateMonochromatic('#ff0000', 5)
      expect(harmony.name).toBe('Monochromatic')
      expect(harmony.colors).toHaveLength(5)
      expect(harmony.colors[0]).toBe('#ff0000') // Original color should be first
    })

    it('should handle invalid colors', () => {
      const harmony = generateMonochromatic('invalid')
      expect(harmony.colors).toHaveLength(1)
      expect(harmony.colors[0]).toBe('#ff0000')
    })
  })

  describe('generateAnalogous', () => {
    it('should generate analogous colors', () => {
      const harmony = generateAnalogous('#ff0000', 5)
      expect(harmony.name).toBe('Analogous')
      expect(harmony.colors).toHaveLength(5)
    })
  })

  describe('generateTriadic', () => {
    it('should generate triadic colors', () => {
      const harmony = generateTriadic('#ff0000')
      expect(harmony.name).toBe('Triadic')
      expect(harmony.colors).toHaveLength(3)
    })
  })

  describe('generateComplementary', () => {
    it('should generate complementary colors', () => {
      const harmony = generateComplementary('#ff0000')
      expect(harmony.name).toBe('Complementary')
      expect(harmony.colors).toHaveLength(2)
    })
  })

  describe('generateTintsAndShades', () => {
    it('should generate tints and shades', () => {
      const result = generateTintsAndShades('#ff0000', 3)
      expect(result.tints).toHaveLength(3)
      expect(result.shades).toHaveLength(3)
      expect(result.tints[0]).not.toBe('#ff0000') // Should be different from original
      expect(result.shades[0]).not.toBe('#ff0000')
    })

    it('should handle invalid colors', () => {
      const result = generateTintsAndShades('invalid')
      expect(result.tints).toHaveLength(1)
      expect(result.shades).toHaveLength(1)
    })
  })
})

describe('Accessibility Functions', () => {
  describe('applyColorBlindnessFilter', () => {
    it('should apply normal vision filter (no change)', () => {
      const result = applyColorBlindnessFilter('#ff0000', COLOR_BLINDNESS_FILTERS[0])
      expect(result).toBe('#ff0000')
    })

    it('should apply protanopia filter', () => {
      const result = applyColorBlindnessFilter('#ff0000', COLOR_BLINDNESS_FILTERS[1])
      expect(result).not.toBe('#ff0000') // Should be different
      expect(result).toMatch(/^#[0-9a-f]{6}$/) // Should be valid hex
    })

    it('should handle invalid colors', () => {
      const result = applyColorBlindnessFilter('invalid', COLOR_BLINDNESS_FILTERS[1])
      expect(result).toBe('invalid')
    })
  })

  describe('generateAccessibilitySuggestions', () => {
    it('should suggest improvements for low contrast', () => {
      const suggestions = generateAccessibilitySuggestions('#888888', '#999999')
      expect(suggestions.length).toBeGreaterThan(0)
      expect(suggestions[0]).toHaveProperty('type')
      expect(suggestions[0]).toHaveProperty('description')
      expect(suggestions[0]).toHaveProperty('suggestedColor')
    })

    it('should return empty array for high contrast', () => {
      const suggestions = generateAccessibilitySuggestions('#000000', '#ffffff')
      expect(suggestions.length).toBe(0)
    })

    it('should handle invalid colors', () => {
      const suggestions = generateAccessibilitySuggestions('invalid', '#ffffff')
      expect(Array.isArray(suggestions)).toBe(true)
    })
  })

  describe('COLOR_BLINDNESS_FILTERS', () => {
    it('should have 8 filter types', () => {
      expect(COLOR_BLINDNESS_FILTERS).toHaveLength(8)
    })

    it('should have valid filter structure', () => {
      COLOR_BLINDNESS_FILTERS.forEach(filter => {
        expect(filter).toHaveProperty('name')
        expect(filter).toHaveProperty('description')
        expect(filter).toHaveProperty('matrix')
        expect(Array.isArray(filter.matrix)).toBe(true)
        expect(filter.matrix).toHaveLength(4)
      })
    })
  })
})
