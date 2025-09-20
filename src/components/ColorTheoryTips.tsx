import React, { useState, useEffect, useCallback } from 'react';

interface ColorTheoryTip {
  id: string;
  title: string;
  content: string;
  trigger: 'harmony' | 'contrast' | 'export' | 'gradient' | 'general';
  priority: 'low' | 'medium' | 'high';
}

const COLOR_THEORY_TIPS: ColorTheoryTip[] = [
  {
    id: 'analogous',
    title: 'Analogous Colors',
    content: 'Colors next to each other on the color wheel create harmonious, serene designs. They work well for backgrounds and subtle variations.',
    trigger: 'harmony',
    priority: 'medium'
  },
  {
    id: 'complementary',
    title: 'Complementary Colors',
    content: 'Colors opposite each other on the color wheel create maximum contrast and visual impact. Perfect for calls-to-action and important elements.',
    trigger: 'harmony',
    priority: 'high'
  },
  {
    id: 'triadic',
    title: 'Triadic Harmony',
    content: 'Three colors equally spaced on the color wheel create vibrant, balanced designs. They provide both contrast and harmony simultaneously.',
    trigger: 'harmony',
    priority: 'medium'
  },
  {
    id: 'contrast-ratio',
    title: 'WCAG Contrast Requirements',
    content: 'For accessibility, text should have a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (18pt+).',
    trigger: 'contrast',
    priority: 'high'
  },
  {
    id: 'color-blindness',
    title: 'Color Blindness Considerations',
    content: 'About 8% of men and 0.5% of women have some form of color blindness. Always test your designs with color blindness simulation tools.',
    trigger: 'contrast',
    priority: 'medium'
  },
  {
    id: 'gradient-tips',
    title: 'Gradient Best Practices',
    content: 'Gradients work best when using colors within 1-2 color families. Too many colors can create visual noise and reduce readability.',
    trigger: 'gradient',
    priority: 'medium'
  },
  {
    id: 'export-formats',
    title: 'Export Format Guide',
    content: 'Use CSS for web development, SCSS for preprocessor workflows, JSON for design tokens, and SVG for graphics. Choose based on your project needs.',
    trigger: 'export',
    priority: 'low'
  },
  {
    id: 'color-psychology',
    title: 'Color Psychology',
    content: 'Blue evokes trust and professionalism, red suggests energy and passion, green represents growth and harmony. Choose colors that match your brand personality.',
    trigger: 'general',
    priority: 'low'
  },
  {
    id: 'color-temperature',
    title: 'Color Temperature',
    content: 'Warm colors (reds, oranges, yellows) advance and create energy. Cool colors (blues, greens, purples) recede and create calm.',
    trigger: 'general',
    priority: 'low'
  }
];

interface ColorTheoryTipsProps {
  currentContext: 'harmony' | 'contrast' | 'export' | 'gradient' | 'general';
  isVisible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const ColorTheoryTips: React.FC<ColorTheoryTipsProps> = ({
  currentContext,
  isVisible = true,
  onDismiss,
  className = ''
}) => {
  const [currentTip, setCurrentTip] = useState<ColorTheoryTip | null>(null);
  const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set());

  // Load dismissed tips from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('color-theory-dismissed-tips');
    if (saved) {
      setDismissedTips(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save dismissed tips to localStorage
  const saveDismissedTips = (tips: Set<string>) => {
    localStorage.setItem('color-theory-dismissed-tips', JSON.stringify(Array.from(tips)));
  };

  // Get relevant tips for current context
  const getRelevantTips = useCallback(() => {
    return COLOR_THEORY_TIPS.filter(tip =>
      tip.trigger === currentContext &&
      !dismissedTips.has(tip.id)
    );
  }, [currentContext, dismissedTips]);

  // Set current tip based on context
  useEffect(() => {
    const relevantTips = getRelevantTips();

    if (relevantTips.length > 0) {
      // Prioritize high-priority tips
      const highPriorityTips = relevantTips.filter(tip => tip.priority === 'high');
      const mediumPriorityTips = relevantTips.filter(tip => tip.priority === 'medium');
      const lowPriorityTips = relevantTips.filter(tip => tip.priority === 'low');

      const priorityOrder = [...highPriorityTips, ...mediumPriorityTips, ...lowPriorityTips];
      setCurrentTip(priorityOrder[0]);
    } else {
      setCurrentTip(null);
    }
  }, [currentContext, dismissedTips, getRelevantTips]);

  const handleDismiss = () => {
    if (currentTip) {
      const newDismissed = new Set([...dismissedTips, currentTip.id]);
      setDismissedTips(newDismissed);
      saveDismissedTips(newDismissed);
      setCurrentTip(null);
    }

    if (onDismiss) {
      onDismiss();
    }
  };

  const handleShowNext = () => {
    if (currentTip) {
      const relevantTips = getRelevantTips();
      const currentIndex = relevantTips.findIndex(tip => tip.id === currentTip.id);

      if (currentIndex < relevantTips.length - 1) {
        setCurrentTip(relevantTips[currentIndex + 1]);
      } else {
        handleDismiss();
      }
    }
  };

  if (!isVisible || !currentTip) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 border border-indigo-200/70 dark:border-indigo-800/40 rounded-xl p-4 shadow-sm ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">💡</span>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">{currentTip.title}</h4>
          <p className="text-indigo-800 dark:text-indigo-200/90 text-sm leading-relaxed">{currentTip.content}</p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleDismiss}
              className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200 underline"
            >
              Don't show again
            </button>

            {getRelevantTips().length > 1 && (
              <button
                onClick={handleShowNext}
                className="text-xs inline-flex items-center justify-center rounded px-2 py-1 bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Next Tip
              </button>
            )}

            <button
              onClick={handleDismiss}
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 ml-auto"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorTheoryTips;
