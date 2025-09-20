import React from 'react';
import { useResponsive } from './useResponsive';

// Utility component for responsive conditional rendering
interface ResponsiveProps {
  children: React.ReactNode;
  breakpoint?: 'mobile' | 'tablet' | 'desktop';
  showOn?: 'mobile' | 'tablet' | 'desktop';
  hideOn?: 'mobile' | 'tablet' | 'desktop';
}

export const Responsive: React.FC<ResponsiveProps> = ({
  children,
  breakpoint,
  showOn,
  hideOn
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Handle showOn prop
  if (showOn) {
    if ((showOn === 'mobile' && !isMobile) ||
        (showOn === 'tablet' && !isTablet) ||
        (showOn === 'desktop' && !isDesktop)) {
      return null;
    }
  }

  // Handle hideOn prop
  if (hideOn) {
    if ((hideOn === 'mobile' && isMobile) ||
        (hideOn === 'tablet' && isTablet) ||
        (hideOn === 'desktop' && isDesktop)) {
      return null;
    }
  }

  // Handle breakpoint prop (for backwards compatibility)
  if (breakpoint) {
    if ((breakpoint === 'mobile' && !isMobile) ||
        (breakpoint === 'tablet' && !isTablet) ||
        (breakpoint === 'desktop' && !isDesktop)) {
      return null;
    }
  }

  return <>{children}</>;
};
