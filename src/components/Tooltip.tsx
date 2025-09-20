import React, { useState, useEffect } from 'react';

interface TooltipProps {
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  targetRef: React.RefObject<HTMLElement>;
  onDismiss: () => void;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  title,
  description,
  position,
  targetRef,
  onDismiss,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        let top = 0;
        let left = 0;

        switch (position) {
          case 'top':
            top = rect.top + scrollTop - 10;
            left = rect.left + scrollLeft + rect.width / 2;
            break;
          case 'bottom':
            top = rect.bottom + scrollTop + 10;
            left = rect.left + scrollLeft + rect.width / 2;
            break;
          case 'left':
            top = rect.top + scrollTop + rect.height / 2;
            left = rect.left + scrollLeft - 10;
            break;
          case 'right':
            top = rect.top + scrollTop + rect.height / 2;
            left = rect.right + scrollLeft + 10;
            break;
        }

        setTooltipPosition({ top, left });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [targetRef, position]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-xs ${className}`}
      style={{
        top: tooltipPosition.top,
        left: tooltipPosition.left,
        transform: position === 'top' || position === 'bottom' ? 'translateX(-50%)' : 'translateY(-50%)'
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 ml-2 text-lg leading-none"
          aria-label="Close tooltip"
        >
          ×
        </button>
      </div>
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      <button
        onClick={handleDismiss}
        className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Got it!
      </button>
    </div>
  );
};

export default Tooltip;
