// import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export interface PerformanceMetrics {
  cls: number;
  fid: number;
  fcp: number;
  lcp: number;
  ttfb: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
}

export interface PerformanceBudget {
  cls: { good: number; needsImprovement: number };
  fid: { good: number; needsImprovement: number };
  fcp: { good: number; needsImprovement: number };
  lcp: { good: number; needsImprovement: number };
  ttfb: { good: number; needsImprovement: number };
  firstPaint: { good: number; needsImprovement: number };
}

// Web Vitals budgets (based on Lighthouse recommendations)
export const PERFORMANCE_BUDGETS: PerformanceBudget = {
  cls: { good: 0.1, needsImprovement: 0.25 },
  fid: { good: 100, needsImprovement: 300 },
  fcp: { good: 1800, needsImprovement: 3000 },
  lcp: { good: 2500, needsImprovement: 4000 },
  ttfb: { good: 800, needsImprovement: 1800 },
  firstPaint: { good: 1000, needsImprovement: 1500 }
};

export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeWebVitals();
    this.initializePaintMetrics();
    this.initializeLongTasks();
  }

  private initializeWebVitals() {
    // Web vitals temporarily disabled due to API changes
    // TODO: Update to latest web-vitals API
    console.log('Web vitals monitoring disabled');
  }

  private initializePaintMetrics() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint');

      paintEntries.forEach((entry: PerformanceEntry) => {
        if (entry.name === 'first-paint') {
          this.metrics.firstPaint = entry.startTime;
          console.log('First Paint:', entry.startTime);
        }
        if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime;
          console.log('First Contentful Paint:', entry.startTime);
        }
      });

      // Also monitor for largest contentful paint
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as LargestContentfulPaint[];
        entries.forEach((entry) => {
          if ('size' in entry && entry.size > (this.metrics.largestContentfulPaint || 0)) {
            this.metrics.largestContentfulPaint = entry.size;
          }
        });
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(observer);
    }
  }

  private initializeLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
          if (entry.duration > 50) { // Long task > 50ms
            console.warn('Long task detected:', entry.duration, 'ms');
          }
        });
      });

      observer.observe({ type: 'longtask', buffered: true });
      this.observers.push(observer);
    }
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public checkBudget(): {
    passed: boolean;
    violations: string[];
    scores: { [key: string]: 'good' | 'needs-improvement' | 'poor' };
  } {
    const violations: string[] = [];
    const scores: { [key: string]: 'good' | 'needs-improvement' | 'poor' } = {};

    // Check each metric against budget
    Object.entries(PERFORMANCE_BUDGETS).forEach(([metric, budget]) => {
      const value = this.metrics[metric as keyof PerformanceMetrics];

      if (value !== undefined) {
        if (value <= budget.good) {
          scores[metric] = 'good';
        } else if (value <= budget.needsImprovement) {
          scores[metric] = 'needs-improvement';
        } else {
          scores[metric] = 'poor';
          violations.push(`${metric.toUpperCase()}: ${value}ms (budget: ${budget.good}ms)`);
        }
      }
    });

    return {
      passed: violations.length === 0,
      violations,
      scores
    };
  }

  public measureOperation<T>(
    operationName: string,
    operation: () => T | Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const start = performance.now();

    return Promise.resolve(operation()).then((result) => {
      const duration = performance.now() - start;

      if (duration > 100) {
        console.warn(`${operationName} took ${duration.toFixed(2)}ms (should be < 100ms)`);
      } else {
        console.log(`${operationName} completed in ${duration.toFixed(2)}ms`);
      }

      return { result, duration };
    });
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for measuring performance
export const measureColorCalculation = async (operation: () => any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return performanceMonitor.measureOperation('Color calculation', operation);
};

export const measureContrastCheck = async (operation: () => any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return performanceMonitor.measureOperation('Contrast check', operation);
};

export const measureExportGeneration = async (operation: () => any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return performanceMonitor.measureOperation('Export generation', operation);
};

// React hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const checkPerformance = () => {
    const budget = performanceMonitor.checkBudget();
    return budget;
  };

  const getMetrics = () => {
    return performanceMonitor.getMetrics();
  };

  return {
    checkPerformance,
    getMetrics,
    measureColorCalculation,
    measureContrastCheck,
    measureExportGeneration
  };
};
