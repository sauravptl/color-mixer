import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface ColorStop {
  id: string;
  position: number;
  color: string;
  locked: boolean;
}

export interface Palette {
  id: string;
  name: string;
  colors: ColorStop[];
  createdAt: Date;
  tags?: string[];
}

export interface PaletteHistory {
  past: Palette[];
  present: Palette;
  future: Palette[];
}

interface ColorMixerState {
  // Current palette
  currentPalette: Palette;

  // History for undo/redo
  history: PaletteHistory;

  // Favorites
  favorites: Palette[];

  // UI state
  showComparison: boolean;
  comparisonPalettes: Palette[];

  // Actions
  updatePalette: (colors: ColorStop[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Favorites
  addToFavorites: (palette: Palette) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Batch operations
  generateBatchPalettes: (baseColor: string, count: number) => Palette[];

  // Comparison
  addToComparison: (palette: Palette) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
}

// Create initial palette
const createInitialPalette = (): Palette => ({
  id: 'current',
  name: 'Current Palette',
  colors: [
    { id: '1', position: 0, color: '#3b82f6', locked: false }, // Blue
    { id: '2', position: 1, color: '#ec4899', locked: false }  // Pink
  ],
  createdAt: new Date()
});

export const useColorMixerStore = create<ColorMixerState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentPalette: createInitialPalette(),
        history: {
          past: [],
          present: createInitialPalette(),
          future: []
        },
        favorites: [],
        showComparison: false,
        comparisonPalettes: [],

        // Update palette with history tracking
        updatePalette: (colors: ColorStop[]) => {
          const currentPalette = get().currentPalette;
          const newPalette: Palette = {
            ...currentPalette,
            colors: [...colors],
            createdAt: new Date()
          };

          set((state) => ({
            currentPalette: newPalette,
            history: {
              past: [...state.history.past, state.history.present].slice(-10), // Keep last 10
              present: newPalette,
              future: []
            }
          }));
        },

        // Undo functionality
        undo: () => {
          const { history } = get();
          if (history.past.length > 0) {
            const previous = history.past[history.past.length - 1];
            const newPast = history.past.slice(0, -1);

            set((state) => ({
              currentPalette: previous,
              history: {
                past: newPast,
                present: previous,
                future: [state.history.present, ...state.history.future]
              }
            }));
          }
        },

        // Redo functionality
        redo: () => {
          const { history } = get();
          if (history.future.length > 0) {
            const next = history.future[0];
            const newFuture = history.future.slice(1);

            set((state) => ({
              currentPalette: next,
              history: {
                past: [...state.history.past, state.history.present],
                present: next,
                future: newFuture
              }
            }));
          }
        },

        // Check if undo is available
        canUndo: () => get().history.past.length > 0,

        // Check if redo is available
        canRedo: () => get().history.future.length > 0,

        // Favorites management
        addToFavorites: (palette: Palette) => {
          const favoritePalette: Palette = {
            ...palette,
            id: `fav_${Date.now()}`,
            name: palette.name || `Favorite ${get().favorites.length + 1}`,
            createdAt: new Date()
          };

          set((state) => ({
            favorites: [...state.favorites, favoritePalette]
          }));
        },

        removeFromFavorites: (id: string) => {
          set((state) => ({
            favorites: state.favorites.filter(fav => fav.id !== id)
          }));
        },

        isFavorite: (id: string) => {
          return get().favorites.some(fav => fav.id === id);
        },

        // Batch palette generation
        generateBatchPalettes: (baseColor: string, count: number) => {
          const palettes: Palette[] = [];

          for (let i = 0; i < count; i++) {
            // Generate variations of the base color
            const hue = (parseInt(baseColor.slice(1, 3), 16) + (i * 255) / count) % 255;
            const saturation = 0.5 + Math.random() * 0.5; // 0.5 to 1.0
            const lightness = 0.3 + Math.random() * 0.4; // 0.3 to 0.7

            // Simple HSL to hex conversion
            const h = Math.round(hue / 255 * 360);
            const s = Math.round(saturation * 100);
            const l = Math.round(lightness * 100);
            const newColor = `hsl(${h}, ${s}%, ${l}%)`;

            const palette: Palette = {
              id: `batch_${Date.now()}_${i}`,
              name: `Batch Palette ${i + 1}`,
              colors: [
                { id: '1', position: 0, color: baseColor, locked: false },
                { id: '2', position: 1, color: newColor, locked: false }
              ],
              createdAt: new Date(),
              tags: ['batch', 'generated']
            };

            palettes.push(palette);
          }

          return palettes;
        },

        // Comparison functionality
        addToComparison: (palette: Palette) => {
          // Ensure each comparison entry has a unique id to avoid React key collisions and to allow precise removal
          const uniqueId = `cmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          const paletteForComparison: Palette = {
            ...palette,
            id: uniqueId
          };

          set((state) => ({
            comparisonPalettes: [...state.comparisonPalettes, paletteForComparison].slice(0, 4), // Max 4 palettes
            showComparison: true
          }));
        },

        removeFromComparison: (id: string) => {
          set((state) => ({
            comparisonPalettes: state.comparisonPalettes.filter(p => p.id !== id)
          }));
        },

        clearComparison: () => {
          set(() => ({
            comparisonPalettes: [],
            showComparison: false
          }));
        }
      }),
      {
        name: 'color-mixer-storage',
        partialize: (state) => ({
          favorites: state.favorites,
          currentPalette: state.currentPalette
        })
      }
    ),
    {
      name: 'color-mixer'
    }
  )
);
