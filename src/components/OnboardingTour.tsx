import React, { useState, useEffect } from 'react';
import Tooltip from './Tooltip';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  target: string; // CSS selector
  required?: boolean; // If true, user must interact with target before proceeding
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Color Mixer!',
    description: 'This powerful tool helps you create beautiful color palettes. Let\'s take a quick tour!',
    position: 'bottom',
    target: 'h1'
  },
  {
    id: 'color-stops',
    title: 'Color Stops',
    description: 'These are your color stops. Click on the gradient bar to add more colors, or drag them to reposition.',
    position: 'bottom',
    target: '[data-onboarding="gradient-bar"]'
  },
  {
    id: 'color-inputs',
    title: 'Color Controls',
    description: 'Use these controls to fine-tune your colors. You can use color pickers, HEX codes, RGB, HSL, or HSV values.',
    position: 'right',
    target: '[data-onboarding="color-inputs"]'
  },
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    description: 'These buttons give you instant access to common actions like randomize, copy colors, and undo/redo.',
    position: 'top',
    target: '[data-onboarding="quick-actions"]'
  },
  {
    id: 'harmonies',
    title: 'Color Harmonies',
    description: 'Discover beautiful color combinations using color theory. Try monochromatic, analogous, or triadic harmonies!',
    position: 'left',
    target: '[data-onboarding="harmonies"]'
  },
  {
    id: 'export',
    title: 'Export Your Work',
    description: 'Export your palettes in multiple formats including CSS, JSON, SVG, and more. Perfect for your projects!',
    position: 'left',
    target: '[data-onboarding="export"]'
  }
];

const STORAGE_KEY = 'color-mixer-onboarding';

interface OnboardingTourProps {
  children: React.ReactNode;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Check if user has completed onboarding before
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedSteps(new Set(data.completedSteps || []));
      setIsActive(data.isActive || false);
    } else {
      // First time user - start onboarding
      setTimeout(() => setIsActive(true), 1000);
    }
  }, []);

  useEffect(() => {
    // Save progress to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      completedSteps: Array.from(completedSteps),
      isActive
    }));
  }, [completedSteps, isActive]);

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));

    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Tour completed
      setIsActive(false);
    }
  };

  const skipTour = () => {
    setIsActive(false);
    setCompletedSteps(new Set(ONBOARDING_STEPS.map(step => step.id)));
  };

  const restartTour = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setIsActive(true);
  };

  if (!isActive) {
    return (
      <>
        {children}
        {/* Hidden restart button for users who want to see the tour again */}
        <button
          onClick={restartTour}
          className="fixed bottom-4 right-4 bg-gray-500 text-white p-2 rounded-full opacity-50 hover:opacity-100 transition-opacity"
          title="Restart onboarding tour"
        >
          ❓
        </button>
      </>
    );
  }

  const currentStepData = ONBOARDING_STEPS[currentStep];

  // Find the target element
  const targetElement = document.querySelector(`[data-onboarding="${currentStepData.target.replace('[data-onboarding="', '').replace('"]', '')}"]`) as HTMLElement;

  return (
    <>
      {children}

      {/* Current tooltip */}
      {targetElement && (
        <Tooltip
          title={currentStepData.title}
          description={currentStepData.description}
          position={currentStepData.position}
          targetRef={{ current: targetElement }}
          onDismiss={() => handleStepComplete(currentStepData.id)}
        />
      )}

      {/* Tour progress indicator */}
      <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-40">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">Onboarding Tour</span>
          <span className="text-xs text-gray-500">
            {currentStep + 1} / {ONBOARDING_STEPS.length}
          </span>
        </div>
        <div className="flex gap-1 mb-2">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index < currentStep ? 'bg-green-500' :
                index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={skipTour}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Skip Tour
          </button>
          <button
            onClick={() => handleStepComplete(currentStepData.id)}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default OnboardingTour;
