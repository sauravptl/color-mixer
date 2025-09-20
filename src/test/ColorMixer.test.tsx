import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ColorMixer from '../components/ColorMixer'

// Mock the store
vi.mock('../stores/colorMixerStore', () => ({
  useColorMixerStore: vi.fn(() => ({
    currentPalette: {
      id: 'test',
      name: 'Test Palette',
      colors: [
        { id: '1', position: 0, color: '#ff0000', locked: false },
        { id: '2', position: 1, color: '#0000ff', locked: false }
      ],
      createdAt: new Date()
    },
    history: { past: [], present: {}, future: [] },
    favorites: [],
    comparisonPalettes: [],
    showComparison: false,
    updatePalette: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    canUndo: () => false,
    canRedo: () => false,
    addToFavorites: vi.fn(),
    removeFromFavorites: vi.fn(),
    isFavorite: () => false,
    addToComparison: vi.fn(),
    removeFromComparison: vi.fn(),
    clearComparison: vi.fn()
  }))
}))

describe('ColorMixer Component', () => {
  it('renders the color mixer interface', () => {
    render(<ColorMixer />)

    expect(screen.getByText('Color Mixer')).toBeInTheDocument()
    expect(screen.getByText('Quick Actions')).toBeInTheDocument()
  })

  it('displays color stops', () => {
    render(<ColorMixer />)

    // Should render the gradient bar and controls
    const colorInputs = screen.getAllByDisplayValue(/^#[0-9a-f]{6}$/i)
    expect(colorInputs.length).toBeGreaterThan(0)
  })

  it('handles color changes', async () => {
    const user = userEvent.setup()
    render(<ColorMixer />)

    const colorInput = screen.getByDisplayValue('#ff0000')
    await user.clear(colorInput)
    await user.type(colorInput, '#00ff00')

    // The input value should be updated
    expect(colorInput).toHaveValue('#00ff00')
  })

  it('shows quick actions', () => {
    render(<ColorMixer />)

    expect(screen.getByText('Copy Colors')).toBeInTheDocument()
    expect(screen.getByText('Randomize')).toBeInTheDocument()
    expect(screen.getByText('New Palette')).toBeInTheDocument()
    expect(screen.getByText('Undo')).toBeInTheDocument()
    expect(screen.getByText('Redo')).toBeInTheDocument()
  })

  it('handles drag and drop events', () => {
    const mockDataTransfer = {
      files: [],
      items: [],
      types: []
    }

    render(<ColorMixer />)

    const container = screen.getByText('Color Mixer').closest('div')

    // Mock drag over
    fireEvent.dragOver(container!, {
      dataTransfer: mockDataTransfer
    })

    // Should show drag feedback
    expect(container).toHaveClass('border-blue-500')
  })
})

describe('Performance Requirements', () => {
  it('should render within performance budget', async () => {
    const startTime = performance.now()

    render(<ColorMixer />)

    const renderTime = performance.now() - startTime

    // Should render in less than 100ms for good UX
    expect(renderTime).toBeLessThan(100)
  })

  it('should handle rapid color changes without performance issues', async () => {
    const user = userEvent.setup()
    render(<ColorMixer />)

    const startTime = performance.now()

    // Simulate rapid color changes
    const colorInput = screen.getByDisplayValue('#ff0000')
    for (let i = 0; i < 10; i++) {
      await user.clear(colorInput)
      await user.type(colorInput, `#${i.toString().repeat(6)}`)
    }

    const totalTime = performance.now() - startTime

    // Should handle 10 rapid changes in reasonable time
    expect(totalTime).toBeLessThan(1000)
  })
})
