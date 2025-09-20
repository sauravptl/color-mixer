import React from 'react';
import KeyboardAccessibility from './KeyboardAccessibility';

// Higher-order component for responsive components
export const withResponsive = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const WrappedComponent = (props: P) => (
    <KeyboardAccessibility>
      <Component {...props} />
    </KeyboardAccessibility>
  );

  WrappedComponent.displayName = `withResponsive(${Component.displayName || Component.name})`;

  return WrappedComponent;
};
