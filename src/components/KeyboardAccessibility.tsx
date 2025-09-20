import React, { useEffect, useState } from 'react';
import './KeyboardAccessibility.css';

interface KeyboardAccessibilityProps {
  children: React.ReactNode;
  className?: string;
}

const KeyboardAccessibility: React.FC<KeyboardAccessibilityProps> = ({
  children,
  className = ''
}) => {
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [currentFocus, setCurrentFocus] = useState<Element | null>(null);

  useEffect(() => {
    // Detect keyboard vs mouse navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only Tab key indicates keyboard navigation
      if (e.key === 'Tab') {
        setIsKeyboardMode(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardMode(false);
    };

    const handleFocus = (e: FocusEvent) => {
      setCurrentFocus(e.target as Element);
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('focusin', handleFocus);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('focusin', handleFocus);

      // Restore focus to the element that was focused before component unmount
      if (currentFocus && document.contains(currentFocus)) {
        (currentFocus as HTMLElement).focus();
      }
    };
  }, [currentFocus]);

  // Apply keyboard-specific styles when in keyboard mode
  useEffect(() => {
    if (isKeyboardMode) {
      document.body.classList.add('keyboard-navigation');
    } else {
      document.body.classList.remove('keyboard-navigation');
    }

    return () => {
      document.body.classList.remove('keyboard-navigation');
    };
  }, [isKeyboardMode]);

  return (
    <>
      {/* Skip navigation link */}
      <a
        href="#main-content"
        className="skip-link"
        onFocus={() => setIsKeyboardMode(true)}
      >
        Skip to main content
      </a>

      {/* Responsive container */}
      <div className={`responsive-container ${className}`}>
        {children}
      </div>
    </>
  );
};

export default KeyboardAccessibility;
