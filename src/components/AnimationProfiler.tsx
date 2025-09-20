import React, { Profiler, useState, useCallback, useEffect, useRef } from 'react';
import { useMemo } from 'react';

interface ProfilerData {
  id: string;
  phase: 'mount' | 'update' | 'nested-update';
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
}

interface AnimationProfilerProps {
  children: React.ReactNode;
  onPerformanceData?: (data: ProfilerData) => void;
}

export const AnimationProfiler: React.FC<AnimationProfilerProps> = ({
  children,
  onPerformanceData
}) => {
  const [performanceData, setPerformanceData] = useState<ProfilerData[]>([]);
  const [frameDrops, setFrameDrops] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [position, setPosition] = useState<'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'>('bottom-left');
  // Guard to prevent Profiler-triggered state updates from causing another commit loop
  const isSelfUpdateRef = useRef(false);

  const handleProfilerCallback = useCallback((
    id: string,
    phase: 'mount' | 'update' | 'nested-update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => {

    const data: ProfilerData = {
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime
    };

    // If this render was caused by our own state update, skip handling to avoid loops
    if (isSelfUpdateRef.current) {
      return;
    }

    // If paused, do not collect or update stats
    if (isPaused) {
      return;
    }

    // Mark as self update so the next Profiler onRender doesn't trigger another state change
    isSelfUpdateRef.current = true;

    setPerformanceData(prev => [...prev.slice(-49), data]); // Keep last 50 measurements

    if (onPerformanceData) {
      onPerformanceData(data);
    }

    // Check for frame drops (60fps = 16.67ms per frame)
    if (actualDuration > 16.67) {
      setFrameDrops(prev => prev + 1);
    }

    // Log performance warnings
    if (actualDuration > 16.67) {
      console.warn(`${id} took ${actualDuration.toFixed(2)}ms (${phase}) - Frame drop detected!`);
    } else if (actualDuration > 8.33) { // 120fps threshold
      console.log(`${id} took ${actualDuration.toFixed(2)}ms (${phase}) - Near frame budget`);
    }
  }, [onPerformanceData, isPaused]);

  // After a commit that we triggered, clear the self-update flag
  useEffect(() => {
    if (isSelfUpdateRef.current) {
      // Defer clearing to the end of the tick to ensure we don't re-enter within the same commit
      const t = setTimeout(() => {
        isSelfUpdateRef.current = false;
      }, 0);
      return () => clearTimeout(t);
    }
  });

  const stats = useMemo(() => {
    if (performanceData.length === 0) {
      return {
        averageFrameTime: 0,
        frameRate: 0,
        frameDrops,
        totalSamples: 0,
        isWithinBudget: true,
        performance: 'excellent' as 'excellent' | 'good' | 'fair' | 'poor',
      };
    }
    const averageFrameTime = performanceData.reduce((sum, d) => sum + d.actualDuration, 0) / performanceData.length;
    const frameRate = averageFrameTime > 0 ? Math.round(1000 / averageFrameTime) : 0;
    const performance = averageFrameTime <= 8.33 ? 'excellent' :
      averageFrameTime <= 16.67 ? 'good' :
      averageFrameTime <= 33.33 ? 'fair' : 'poor';
    return {
      averageFrameTime,
      frameRate,
      frameDrops,
      totalSamples: performanceData.length,
      isWithinBudget: averageFrameTime <= 16.67,
      performance,
    };
  }, [performanceData, frameDrops]);

  const resetStats = () => {
    isSelfUpdateRef.current = true; // avoid profiler callback during reset
    setPerformanceData([]);
    setFrameDrops(0);
    // clear self update flag next tick
    setTimeout(() => { isSelfUpdateRef.current = false; }, 0);
  };

  const positionClass = useMemo(() => {
    switch (position) {
      case 'bottom-right':
        return 'fixed bottom-4 right-4';
      case 'top-left':
        return 'fixed top-4 left-4';
      case 'top-right':
        return 'fixed top-4 right-4';
      case 'bottom-left':
      default:
        return 'fixed bottom-4 left-4';
    }
  }, [position]);

  return (
    <div className="relative">
      <Profiler id="ColorMixer" onRender={handleProfilerCallback}>
        {children}
      </Profiler>

      {/* Performance Overlay (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className={`${positionClass} bg-zinc-900/90 text-white p-3 rounded-lg text-xs font-mono z-50 shadow-lg border border-zinc-700/50 w-64`}
             role="region" aria-label="Animation profiler panel">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="font-bold">Animation Profiler</div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className={`px-2 py-1 rounded border border-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isPaused ? 'bg-amber-600/30' : ''}`}
                onClick={() => setIsPaused(p => !p)}
                aria-pressed={isPaused}
                aria-label={isPaused ? 'Resume profiling' : 'Pause profiling'}
                title={isPaused ? 'Resume profiling' : 'Pause profiling'}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                type="button"
                className="px-2 py-1 rounded border border-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={resetStats}
                aria-label="Reset stats"
                title="Reset stats"
              >
                Reset
              </button>
              <button
                type="button"
                className="px-2 py-1 rounded border border-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setIsOpen(o => !o)}
                aria-expanded={isOpen}
                aria-controls="profiler-details"
                aria-label={isOpen ? 'Collapse panel' : 'Expand panel'}
                title={isOpen ? 'Collapse' : 'Expand'}
              >
                {isOpen ? '–' : '+'}
              </button>
            </div>
          </div>

          {isOpen && (
            <div id="profiler-details" className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-zinc-400">FPS</div>
                <div className="text-right">{stats.frameRate}</div>
                <div className="text-zinc-400">Avg Frame</div>
                <div className="text-right">{stats.averageFrameTime.toFixed(2)} ms</div>
                <div className="text-zinc-400">Frame Drops</div>
                <div className="text-right">{stats.frameDrops}</div>
                <div className="text-zinc-400">Samples</div>
                <div className="text-right">{stats.totalSamples}</div>
              </div>

              <div className="mt-1">
                <div className={`inline-block px-2 py-1 rounded text-xs ${stats.isWithinBudget ? 'bg-green-600' : 'bg-red-600'}`}
                     title={stats.isWithinBudget ? 'Within 16.67ms frame budget (60fps)' : 'Exceeding 16.67ms frame budget (60fps)'}>
                  {stats.performance.toUpperCase()}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-700/50">
                <label htmlFor="profiler-position" className="block text-zinc-400 mb-1">Position</label>
                <select
                  id="profiler-position"
                  className="w-full bg-zinc-800 border border-zinc-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={position}
                  onChange={(e) => setPosition(e.target.value as typeof position)}
                >
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
