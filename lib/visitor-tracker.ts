'use client';

export interface VisitorInfo {
  visitorId: string;
  sessionToken: string;
  isFirstEverVisit: boolean;
  isNewDailyUnique: boolean;
  isNewSession: boolean;
  pagePath: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  isBot: boolean;
}

const VISITOR_ID_KEY = 'fz_vid';
const LAST_DAILY_DATE_KEY = 'fz_last_daily_date';
const SESSION_TOKEN_KEY = 'fz_sid';
const SESSION_EXPIRY_KEY = 'fz_sid_expiry';
const SESSION_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Privacy-friendly Bot Detection Helper
 */
export function isObviousBot(): boolean {
  if (typeof window === 'undefined') return false;

  const ua = navigator.userAgent || '';
  const botPattern = /bot|crawler|spider|googlebot|bingbot|slurp|duckduckbot|facebookexternalhit|headlesschrome|phantomjs|puppeteer|lighthouse/i;

  if (botPattern.test(ua)) return true;
  if ((navigator as any).webdriver === true) return true;

  return false;
}

/**
 * Get or initialize Client Visitor Identifier & Session Tracking Info
 */
export function getVisitorTrackingPayload(pagePath: string): VisitorInfo {
  if (typeof window === 'undefined') {
    return {
      visitorId: '',
      sessionToken: '',
      isFirstEverVisit: false,
      isNewDailyUnique: false,
      isNewSession: false,
      pagePath,
      deviceType: 'desktop',
      isBot: true,
    };
  }

  const now = Date.now();
  const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // 1. First-Party Visitor ID (localStorage)
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  let isFirstEverVisit = false;

  if (!visitorId) {
    visitorId = `v_${Math.random().toString(36).substring(2, 9)}_${now}`;
    try {
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
      isFirstEverVisit = true;
    } catch {
      // Memory fallback if cookies/storage blocked
    }
  }

  // 2. Daily Unique Guard (localStorage)
  let isNewDailyUnique = false;
  const lastDailyDate = localStorage.getItem(LAST_DAILY_DATE_KEY);

  if (lastDailyDate !== todayStr) {
    isNewDailyUnique = true;
    try {
      localStorage.setItem(LAST_DAILY_DATE_KEY, todayStr);
    } catch {
      // Storage guard fallback
    }
  }

  // 3. 30-Minute Session Window (sessionStorage/localStorage)
  let sessionToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
  const sessionExpiry = parseInt(localStorage.getItem(SESSION_EXPIRY_KEY) || '0', 10);
  let isNewSession = false;

  if (!sessionToken || now > sessionExpiry) {
    sessionToken = `s_${Math.random().toString(36).substring(2, 9)}_${now}`;
    isNewSession = true;
    try {
      sessionStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
      localStorage.setItem(SESSION_EXPIRY_KEY, (now + SESSION_WINDOW_MS).toString());
    } catch {
      // Storage fallback
    }
  } else {
    // Extend session expiry on active interaction
    try {
      localStorage.setItem(SESSION_EXPIRY_KEY, (now + SESSION_WINDOW_MS).toString());
    } catch {
      //
    }
  }

  // 4. Device Type Detection
  const ua = navigator.userAgent;
  let deviceType: 'mobile' | 'desktop' | 'tablet' = 'desktop';
  if (/iPad|tablet/i.test(ua)) {
    deviceType = 'tablet';
  } else if (/Mobile|iPhone|Android/i.test(ua)) {
    deviceType = 'mobile';
  }

  return {
    visitorId,
    sessionToken,
    isFirstEverVisit,
    isNewDailyUnique,
    isNewSession,
    pagePath,
    deviceType,
    isBot: isObviousBot(),
  };
}

/**
 * Asynchronously Dispatch Analytics Tracking Event (Non-blocking)
 */
export function trackVisitorEventAsync(pagePath: string): void {
  if (typeof window === 'undefined') return;

  const payload = getVisitorTrackingPayload(pagePath);
  if (payload.isBot) return; // Ignore obvious bots

  const runTrack = () => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Silently catch tracking errors so page execution is never impacted
    });
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(runTrack);
  } else {
    setTimeout(runTrack, 500);
  }
}
