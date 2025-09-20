import React, { useState } from 'react';
import type { ColorStop } from '../stores/colorMixerStore';

interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: ColorStop[];
  tags: string[];
  category: string;
}

const EXAMPLE_PALETTES: ColorPalette[] = [
  {
    id: 'sunset',
    name: 'Sunset Vibes',
    description: 'Warm sunset colors perfect for creative projects',
    category: 'Nature',
    tags: ['warm', 'sunset', 'creative'],
    colors: [
      { id: '1', position: 0, color: '#FF6B35', locked: false },
      { id: '2', position: 0.33, color: '#F7931E', locked: false },
      { id: '3', position: 0.67, color: '#FFD23F', locked: false },
      { id: '4', position: 1, color: '#06FFA5', locked: false }
    ]
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    description: 'Cool blue tones inspired by the ocean',
    category: 'Nature',
    tags: ['cool', 'ocean', 'calm'],
    colors: [
      { id: '1', position: 0, color: '#1E3A8A', locked: false },
      { id: '2', position: 0.33, color: '#3B82F6', locked: false },
      { id: '3', position: 0.67, color: '#06B6D4', locked: false },
      { id: '4', position: 1, color: '#67E8F9', locked: false }
    ]
  },
  {
    id: 'forest',
    name: 'Forest Greens',
    description: 'Rich green palette for natural, earthy designs',
    category: 'Nature',
    tags: ['green', 'forest', 'natural'],
    colors: [
      { id: '1', position: 0, color: '#064E3B', locked: false },
      { id: '2', position: 0.33, color: '#059669', locked: false },
      { id: '3', position: 0.67, color: '#10B981', locked: false },
      { id: '4', position: 1, color: '#6EE7B7', locked: false }
    ]
  },
  {
    id: 'minimal',
    name: 'Minimalist',
    description: 'Clean and simple grayscale palette',
    category: 'Design',
    tags: ['minimal', 'clean', 'simple'],
    colors: [
      { id: '1', position: 0, color: '#111827', locked: false },
      { id: '2', position: 0.33, color: '#6B7280', locked: false },
      { id: '3', position: 0.67, color: '#D1D5DB', locked: false },
      { id: '4', position: 1, color: '#F9FAFB', locked: false }
    ]
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bold and energetic color combinations',
    category: 'Design',
    tags: ['bold', 'energetic', 'vibrant'],
    colors: [
      { id: '1', position: 0, color: '#DC2626', locked: false },
      { id: '2', position: 0.25, color: '#EA580C', locked: false },
      { id: '3', position: 0.5, color: '#CA8A04', locked: false },
      { id: '4', position: 0.75, color: '#16A34A', locked: false },
      { id: '5', position: 1, color: '#2563EB', locked: false }
    ]
  },
  {
    id: 'pastel',
    name: 'Pastel Dreams',
    description: 'Soft pastel colors for gentle, calming designs',
    category: 'Design',
    tags: ['soft', 'pastel', 'calming'],
    colors: [
      { id: '1', position: 0, color: '#FBBF24', locked: false },
      { id: '2', position: 0.33, color: '#F472B6', locked: false },
      { id: '3', position: 0.67, color: '#A78BFA', locked: false },
      { id: '4', position: 1, color: '#60A5FA', locked: false }
    ]
  },
  {
    id: 'retro',
    name: 'Retro 80s',
    description: 'Neon colors inspired by 80s retro design',
    category: 'Theme',
    tags: ['retro', '80s', 'neon'],
    colors: [
      { id: '1', position: 0, color: '#FF0080', locked: false },
      { id: '2', position: 0.33, color: '#00FF80', locked: false },
      { id: '3', position: 0.67, color: '#8000FF', locked: false },
      { id: '4', position: 1, color: '#FF8000', locked: false }
    ]
  },
  {
    id: 'corporate',
    name: 'Corporate Blue',
    description: 'Professional blue palette for business applications',
    category: 'Business',
    tags: ['corporate', 'professional', 'trustworthy'],
    colors: [
      { id: '1', position: 0, color: '#1E40AF', locked: false },
      { id: '2', position: 0.33, color: '#3B82F6', locked: false },
      { id: '3', position: 0.67, color: '#93C5FD', locked: false },
      { id: '4', position: 1, color: '#EFF6FF', locked: false }
    ]
  }
];

interface ExampleGalleriesProps {
  onPaletteSelect: (colors: ColorStop[]) => void;
  className?: string;
}

const ExampleGalleries: React.FC<ExampleGalleriesProps> = ({
  onPaletteSelect,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Array.from(new Set(EXAMPLE_PALETTES.map(p => p.category)))];

  const filteredPalettes = EXAMPLE_PALETTES.filter(palette => {
    const categoryMatch = selectedCategory === 'All' || palette.category === selectedCategory;
    const searchMatch = searchQuery === '' ||
      palette.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      palette.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      palette.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return categoryMatch && searchMatch;
  });

  const handlePaletteSelect = (palette: ColorPalette) => {
    onPaletteSelect(palette.colors);
  };

  return (
    <div className={`w-full max-w-6xl ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Example Galleries</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Explore professionally designed color palettes and apply them to your projects
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search palettes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Showing {filteredPalettes.length} palette{filteredPalettes.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      </div>

      {/* Palettes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPalettes.map(palette => (
          <div
            key={palette.id}
            className="bg-white dark:bg-slate-900/70 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Color Preview */}
            <div className="h-24 flex">
              {palette.colors.map((color) => (
                <div
                  key={color.id}
                  className="flex-1"
                  style={{ backgroundColor: color.color }}
                  title={color.color}
                />
              ))}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{palette.name}</h3>
                <span className="text-xs bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 px-2 py-1 rounded">
                  {palette.category}
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">{palette.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {palette.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Colors List */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {palette.colors.slice(0, 4).map(color => (
                  <div key={color.id} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700"
                      style={{ backgroundColor: color.color }}
                    />
                    <span className="text-xs font-mono">{color.color}</span>
                  </div>
                ))}
                {palette.colors.length > 4 && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 col-span-2">
                    +{palette.colors.length - 4} more colors
                  </div>
                )}
              </div>

              {/* Apply Button */}
              <button
                onClick={() => handlePaletteSelect(palette)}
                className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Apply Palette
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPalettes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No palettes found</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your search or category filter
          </p>
        </div>
      )}
    </div>
  );
};

export default ExampleGalleries;
