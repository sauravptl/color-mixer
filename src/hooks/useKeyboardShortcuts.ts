import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

interface UseKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({ shortcuts, enabled = true }: UseKeyboardShortcutsProps) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when user is typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }

    const shortcut = shortcuts.find(s =>
      s.key.toLowerCase() === event.key.toLowerCase() &&
      !!s.ctrlKey === event.ctrlKey &&
      !!s.shiftKey === event.shiftKey &&
      !!s.altKey === event.altKey &&
      !!s.metaKey === event.metaKey
    );

    if (shortcut) {
      event.preventDefault();
      event.stopPropagation();
      shortcut.action();
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);

  return {
    shortcuts
  };
};

// Predefined shortcuts for the color mixer
export const createColorMixerShortcuts = (
  onCopy: () => void,
  onRandomize: () => void,
  onNewPalette: () => void,
  onUndo: () => void,
  onRedo: () => void,
  onToggleComparison: () => void
): KeyboardShortcut[] => [
  {
    key: 'c',
    action: onCopy,
    description: 'Copy current palette colors to clipboard'
  },
  {
    key: 'r',
    action: onRandomize,
    description: 'Randomize all unlocked colors'
  },
  {
    key: ' ',
    action: onNewPalette,
    description: 'Create new palette'
  },
  {
    key: 'z',
    ctrlKey: true,
    action: onUndo,
    description: 'Undo last action'
  },
  {
    key: 'y',
    ctrlKey: true,
    action: onRedo,
    description: 'Redo last undone action'
  },
  {
    key: 'z',
    ctrlKey: true,
    shiftKey: true,
    action: onRedo,
    description: 'Redo last undone action (alternative)'
  },
  {
    key: 'b',
    action: onToggleComparison,
    description: 'Toggle comparison view'
  },
  {
    key: 'f',
    action: () => {
      // Focus on first color input
      const firstInput = document.querySelector('input[type="color"]') as HTMLInputElement;
      if (firstInput) firstInput.focus();
    },
    description: 'Focus on color picker'
  },
  {
    key: 'h',
    action: () => {
      // Show/hide help or shortcuts
      console.log('Keyboard shortcuts help');
    },
    description: 'Show keyboard shortcuts help'
  }
];
