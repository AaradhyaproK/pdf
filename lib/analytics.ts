/**
 * Privacy-friendly event analytics helper for FileZenith.
 * Tracks non-sensitive product usage events without capturing user files, names, or image contents.
 */

export type AnalyticsEventName =
  | 'tool_page_view'
  | 'image_uploaded'
  | 'compression_completed'
  | 'download_clicked'
  | 'error_occurred';

export interface AnalyticsEventParams {
  toolSlug?: string;
  presetName?: string;
  fileType?: string;
  originalSizeKB?: number;
  outputSizeKB?: number;
  errorMessage?: string;
  [key: string]: any;
}

export function trackEvent(eventName: AnalyticsEventName, params?: AnalyticsEventParams) {
  if (typeof window === 'undefined') return;

  // Log in development or pass to window.gtag / analytics provider if present
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Event] ${eventName}:`, params);
  }

  try {
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', eventName, params);
    }
  } catch {
    // Ignore tracking failures gracefully
  }
}
