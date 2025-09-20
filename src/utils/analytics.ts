// Analytics utility for tracking user interactions
// This is a basic implementation - in production, you'd integrate with Google Analytics, Mixpanel, etc.

export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
}

class AnalyticsTracker {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = this.shouldEnableAnalytics();
    this.initializeSessionTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldEnableAnalytics(): boolean {
    // Check if user has opted out via localStorage
    const optedOut = localStorage.getItem('analytics_opted_out');
    return optedOut !== 'true';
  }

  private initializeSessionTracking(): void {
    // Track session start
    this.trackEvent('session', 'engagement', 'start');

    // Track page visibility changes (return usage)
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.trackEvent('session', 'engagement', 'background');
        } else {
          this.trackEvent('session', 'engagement', 'foreground');
        }
      });

      // Track beforeunload for session end
      window.addEventListener('beforeunload', () => {
        this.trackEvent('session', 'engagement', 'end');
      });
    }
  }

  public trackEvent(
    category: string,
    action: string,
    label?: string,
    value?: number
  ): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      event: `${category}_${action}`,
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId
    };

    this.events.push(event);

    // Store events locally (in production, send to analytics service)
    this.persistEvent(event);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
    }
  }

  private persistEvent(event: AnalyticsEvent): void {
    try {
      const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      storedEvents.push(event);

      // Keep only last 1000 events to prevent storage bloat
      if (storedEvents.length > 1000) {
        storedEvents.splice(0, storedEvents.length - 1000);
      }

      localStorage.setItem('analytics_events', JSON.stringify(storedEvents));
    } catch (error) {
      console.warn('Failed to persist analytics event:', error);
    }
  }

  public getStoredEvents(): AnalyticsEvent[] {
    try {
      return JSON.parse(localStorage.getItem('analytics_events') || '[]');
    } catch (error) {
      console.warn('Failed to retrieve stored events:', error);
      return [];
    }
  }

  public clearStoredEvents(): void {
    localStorage.removeItem('analytics_events');
    this.events = [];
  }

  public optOut(): void {
    localStorage.setItem('analytics_opted_out', 'true');
    this.isEnabled = false;
    this.clearStoredEvents();
  }

  public optIn(): void {
    localStorage.removeItem('analytics_opted_out');
    this.isEnabled = true;
  }

  public isOptedOut(): boolean {
    return !this.isEnabled;
  }

  // Specific tracking methods for Color Mixer
  public trackColorCopy(colorValue: string, format: string): void {
    this.trackEvent('color', 'copy', `${format}:${colorValue}`);
  }

  public trackPaletteExport(format: string, paletteSize: number): void {
    this.trackEvent('palette', 'export', format, paletteSize);
  }

  public trackHarmonyGeneration(harmonyType: string): void {
    this.trackEvent('harmony', 'generate', harmonyType);
  }

  public trackAccessibilityCheck(passed: boolean): void {
    this.trackEvent('accessibility', 'check', passed ? 'passed' : 'failed');
  }

  public trackFeatureUsage(feature: string): void {
    this.trackEvent('feature', 'use', feature);
  }
}

// Singleton instance
export const analytics = new AnalyticsTracker();

// React hook for analytics
export const useAnalytics = () => {
  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackColorCopy: analytics.trackColorCopy.bind(analytics),
    trackPaletteExport: analytics.trackPaletteExport.bind(analytics),
    trackHarmonyGeneration: analytics.trackHarmonyGeneration.bind(analytics),
    trackAccessibilityCheck: analytics.trackAccessibilityCheck.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
    optOut: analytics.optOut.bind(analytics),
    optIn: analytics.optIn.bind(analytics),
    isOptedOut: analytics.isOptedOut.bind(analytics),
    getStoredEvents: analytics.getStoredEvents.bind(analytics),
    clearStoredEvents: analytics.clearStoredEvents.bind(analytics)
  };
};
