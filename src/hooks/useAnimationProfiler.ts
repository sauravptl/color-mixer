import { useState, useCallback } from 'react';

export interface ProfilerData {
  id: string;
  phase: 'mount' | 'update' | 'nested-update';
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
}

export const useAnimationProfiler = () => {
  const [profilerData, setProfilerData] = useState<ProfilerData[]>([]);

  const handleProfilerData = useCallback((data: ProfilerData) => {
    setProfilerData(prev => [...prev.slice(-49), data]);
  }, []);

  const getStats = () => {
    if (profilerData.length === 0) return null;

    const avgDuration = profilerData.reduce((sum, d) => sum + d.actualDuration, 0) / profilerData.length;
    const maxDuration = Math.max(...profilerData.map(d => d.actualDuration));
    const minDuration = Math.min(...profilerData.map(d => d.actualDuration));

    return {
      averageDuration: avgDuration,
      maxDuration,
      minDuration,
      frameRate: Math.round(1000 / avgDuration),
      isWithin60fps: avgDuration <= 16.67,
      totalSamples: profilerData.length,
    };
  };

  return {
    profilerData,
    getStats,
    handleProfilerData,
  };
};
