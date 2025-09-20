import React, { useState } from 'react';
import ColorMixer from './components/ColorMixer';
import OnboardingTour from './components/OnboardingTour';
import HelpPanel from './components/HelpPanel';
import { AnimationProfiler } from './components/AnimationProfiler';
import { usePerformanceMonitoring } from './utils/performanceMonitor';
import { HelpCircle } from 'lucide-react';
import './App.css';

function App() {
  const { checkPerformance } = usePerformanceMonitoring();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Log performance metrics on mount
  React.useEffect(() => {
    // Check performance after initial render
    const timer = setTimeout(() => {
      const budget = checkPerformance();
      console.log('Performance Budget Check:', budget);

      if (!budget.passed) {
        console.warn('Performance violations detected:', budget.violations);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [checkPerformance]);

  return (
    <OnboardingTour>
      <AnimationProfiler>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8 relative" data-onboarding="welcome">
              <button
                onClick={() => setIsHelpOpen(true)}
                className="absolute right-0 top-0 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Help & Documentation"
              >
                <HelpCircle className="w-6 h-6" />
              </button>
              <h1 className="text-4xl font-bold mb-2">Color Mixer</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Create beautiful color palettes with interactive mixing
              </p>
            </header>

            <main className="flex justify-center">
              <ColorMixer />
            </main>
          </div>
        </div>
        <HelpPanel isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      </AnimationProfiler>
    </OnboardingTour>
  );
}

export default App;
