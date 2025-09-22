import React, { useState } from 'react';
import ColorMixer from './components/ColorMixer';
import OnboardingTour from './components/OnboardingTour';
import HelpPanel from './components/HelpPanel';
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
      <div className="min-h-screen w-full">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
          <div className="w-full min-h-screen">
            <header className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-40" data-onboarding="welcome">
              <div className="w-full px-2 sm:px-4 lg:px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-1">
                      Color Mixer
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                      Professional color palette creation and design system tools
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span>Live Preview</span>
                    </div>
                    <button
                      onClick={() => setIsHelpOpen(true)}
                      className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-md"
                      title="Help & Documentation"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <main className="w-full">
              <ColorMixer />
            </main>
          </div>
        </div>
        <HelpPanel isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      </div>
    </OnboardingTour>
  );
}

export default App;
