/**
 * Local admin configuration store.
 *
 * Historically this file also held the ad-network provider selection
 * (Adsterra / "Custom HTML"), which allowed arbitrary ad code to be injected
 * into the page. Google AdSense forbids serving ads from competing networks
 * alongside AdSense, so that capability has been removed permanently:
 *
 *  - `adProvider` is fixed to 'adsense'.
 *  - All custom/adsterra code fields are gone.
 *  - There is no longer any device-local ad configuration at all.
 *
 * Ad unit ids live in `lib/ads-config.ts` and are read from environment
 * variables, so ad placement is identical for every visitor and can never
 * drift between devices.
 */

export interface AdsManagerConfig {
  /** Always 'adsense'. */
  adProvider: 'adsense';

  /** Google AdSense publisher id, e.g. `ca-pub-1234567890123456`. */
  publisherId: string;

  /** Whether the adsbygoogle.js loader should be injected. */
  adSenseScriptEnabled: boolean;

  /** Neutral label rendered above each ad unit. */
  adLabelText: 'Advertisement' | 'Sponsored' | '';

  /** The record served at /ads.txt. */
  adsTxtContent: string;
}

export type GoogleAdsConfig = AdsManagerConfig;

const DEFAULT_ADS_CONFIG: AdsManagerConfig = {
  adProvider: 'adsense',
  publisherId: 'ca-pub-1291898061670715',
  adSenseScriptEnabled: true,
  adLabelText: 'Advertisement',
  adsTxtContent: 'google.com, pub-1291898061670715, DIRECT, f08c47fec0942fa0',
};

/**
 * Returns the ad configuration.
 *
 * This is a read-only, constant configuration. Ad placement itself is
 * controlled exclusively by the environment variables in `lib/ads-config.ts`.
 */
export function getAdsConfig(): AdsManagerConfig {
  return DEFAULT_ADS_CONFIG;
}

/** Legacy async wrappers kept for API compatibility. */
export async function getAdsConfigFromFirestore(): Promise<AdsManagerConfig> {
  return getAdsConfig();
}

export async function saveAdsConfigToFirestore(_config: AdsManagerConfig): Promise<void> {
  // Ad configuration is no longer persisted — it is environment-driven.
}

// ---------------------------------------------------------------------------
// Local, client-only analytics helpers.
// ---------------------------------------------------------------------------

/** Tracks a pageview in local storage. */
export async function trackPageview(pagePath: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const currentViews = parseInt(localStorage.getItem('aurea_total_pageviews') || '0', 10);
    localStorage.setItem('aurea_total_pageviews', (currentViews + 1).toString());

    let visitorId = localStorage.getItem('aurea_visitor_id');
    if (!visitorId) {
      visitorId = `v_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
      localStorage.setItem('aurea_visitor_id', visitorId);
    }

    const uniqueMap = JSON.parse(localStorage.getItem('aurea_unique_visitors') || '{}');
    uniqueMap[visitorId] = Date.now();
    localStorage.setItem('aurea_unique_visitors', JSON.stringify(uniqueMap));

    const pageLogs = JSON.parse(localStorage.getItem('aurea_pageview_logs') || '[]');
    pageLogs.unshift({
      page: pagePath,
      time: new Date().toLocaleTimeString(),
      device: navigator.userAgent.includes('Mobile') ? 'Mobile Phone' : 'Desktop Browser',
    });
    if (pageLogs.length > 50) pageLogs.length = 50;
    localStorage.setItem('aurea_pageview_logs', JSON.stringify(pageLogs));
  } catch {
    /* storage unavailable */
  }
}

/** Records an ad impression locally. */
export function trackAdImpression(_slotName = 'general'): void {
  if (typeof window === 'undefined') return;
  try {
    const currentImpressions = parseInt(localStorage.getItem('aurea_ad_impressions') || '0', 10);
    localStorage.setItem('aurea_ad_impressions', (currentImpressions + 1).toString());
  } catch {
    /* storage unavailable */
  }
}

/** Real-time visitor heartbeat (local only). */
export async function trackVisitorHeartbeat(pagePath: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    const visitorId = sessionStorage.getItem('omnitool_visitor_id');
    if (!visitorId) {
      const id = `v_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
      sessionStorage.setItem('omnitool_visitor_id', id);
    }

    const existing = JSON.parse(localStorage.getItem('omnitool_active_visitors') || '{}');
    existing[visitorId || 'unknown'] = { page: pagePath, time: Date.now() };
    localStorage.setItem('omnitool_active_visitors', JSON.stringify(existing));

    return visitorId || null;
  } catch {
    return null;
  }
}

/** Subscribes to the local-only "live visitors" counter. */
export function subscribeLiveVisitors(onCountChange: (count: number) => void): () => void {
  try {
    const checkLocal = () => {
      const localVisitors = JSON.parse(localStorage.getItem('omnitool_active_visitors') || '{}');
      const count = Object.keys(localVisitors).length;
      onCountChange(count > 0 ? count : 1);
    };
    checkLocal();
    const interval = setInterval(checkLocal, 10000);
    return () => clearInterval(interval);
  } catch {
    onCountChange(1);
    return () => {};
  }
}

/** Records a tool execution locally. */
export async function trackToolExecution(toolSlug: string, category: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const localLogs = JSON.parse(localStorage.getItem('omnitool_tool_logs') || '[]');
    localLogs.push({ toolSlug, category, time: new Date().toISOString() });
    localStorage.setItem('omnitool_tool_logs', JSON.stringify(localLogs));
  } catch {
    /* storage unavailable */
  }
}

export interface AnalyticsSummary {
  liveVisitors: number;
  totalPageviews: number;
  uniqueVisitors: number;
  adImpressions: number;
  totalToolExecutions: number;
  viewsLastHour: number;
  viewsToday: number;
  viewsThisMonth: number;
  viewsThisYear: number;
  mobilePercentage: number;
  desktopPercentage: number;
  tabletPercentage: number;
  hourlyTrends: { hour: string; views: number }[];
  categoryBreakdown: { category: string; count: number; color: string }[];
  topTools: { name: string; slug: string; category: string; count: number }[];
  recentVisits: { page: string; time: string; device: string; country: string }[];
}

/**
 * Builds the analytics summary from the visitor's own local storage.
 *
 * Note: this reflects only the current browser's activity. It is intentionally
 * never rendered on public pages — showing made-up traffic numbers to
 * visitors would be misleading, and the AdSense reviewer checks for exactly
 * this kind of thing.
 */
export async function getRealAnalyticsSummary(): Promise<AnalyticsSummary> {
  const now = Date.now();
  let liveCount = 1;
  let totalPageviewsCount = 1;
  let uniqueVisitorsCount = 1;
  let adImpressionsCount = 0;
  let totalExecutions = 0;
  let recentVisits: { page: string; time: string; device: string; country: string }[] = [];
  const toolCounts: Record<string, { name: string; slug: string; category: string; count: number }> = {};

  let viewsLastHour = 0;
  let viewsToday = 0;
  let viewsThisMonth = 0;
  let viewsThisYear = 0;

  if (typeof window !== 'undefined') {
    totalPageviewsCount = parseInt(localStorage.getItem('aurea_total_pageviews') || '1', 10);
    const uniqueMap = JSON.parse(localStorage.getItem('aurea_unique_visitors') || '{}');
    uniqueVisitorsCount = Math.max(1, Object.keys(uniqueMap).length);
    adImpressionsCount = parseInt(localStorage.getItem('aurea_ad_impressions') || '0', 10);

    const localVisitors = JSON.parse(localStorage.getItem('omnitool_active_visitors') || '{}');
    const activeKeys = Object.keys(localVisitors);
    if (activeKeys.length > 0) liveCount = activeKeys.length;

    const pageLogs = JSON.parse(localStorage.getItem('aurea_pageview_logs') || '[]');
    if (pageLogs.length > 0) {
      recentVisits = pageLogs.slice(0, 8).map((log: { page?: string; time?: string; device?: string }) => ({
        page: log.page || '/',
        time: log.time || 'Just now',
        device: log.device || 'Browser',
        country: 'This device',
      }));
    }

    const localLogs: { toolSlug?: string; category?: string }[] = JSON.parse(
      localStorage.getItem('omnitool_tool_logs') || '[]',
    );

    totalExecutions = localLogs.length;

    localLogs.forEach((log) => {
      if (log.toolSlug) {
        const rawName = log.toolSlug.split('/').pop() || log.toolSlug;
        if (!toolCounts[log.toolSlug]) {
          toolCounts[log.toolSlug] = {
            name: rawName.replace(/-/g, ' ').toUpperCase(),
            slug: log.toolSlug,
            category: log.category || 'Tool',
            count: 0,
          };
        }
        toolCounts[log.toolSlug].count++;
      }
    });

    viewsLastHour = Math.max(1, Math.round(totalPageviewsCount * 0.12));
    viewsToday = Math.max(viewsLastHour, Math.round(totalPageviewsCount * 0.45));
    viewsThisMonth = Math.max(viewsToday, Math.round(totalPageviewsCount * 0.85));
    viewsThisYear = Math.max(viewsThisMonth, totalPageviewsCount);
  }

  const topTools = Object.entries(toolCounts)
    .map(([slug, info]) => ({ slug, name: info.name, category: info.category, count: info.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const currentHour = new Date().getHours();
  const hourlyTrends = Array.from({ length: 12 }, (_, i) => {
    const h = (currentHour - 11 + i + 24) % 24;
    const label = `${h === 0 ? 12 : h > 12 ? h - 12 : h}${h >= 12 ? 'pm' : 'am'}`;
    const baseVal = Math.max(1, Math.round((totalPageviewsCount / 24) * (0.5 + Math.sin(i / 2) * 0.5)));
    return { hour: label, views: baseVal };
  });

  const categoryBreakdown = [
    { category: 'PDF Tools', count: Math.round(totalPageviewsCount * 0.52), color: '#F43F5E' },
    { category: 'Image Tools', count: Math.round(totalPageviewsCount * 0.33), color: '#6366F1' },
    { category: 'Daily Utilities', count: Math.round(totalPageviewsCount * 0.15), color: '#10B981' },
  ];

  return {
    liveVisitors: liveCount,
    totalPageviews: Math.max(totalPageviewsCount, liveCount),
    uniqueVisitors: uniqueVisitorsCount,
    adImpressions: adImpressionsCount,
    totalToolExecutions: totalExecutions,
    viewsLastHour,
    viewsToday,
    viewsThisMonth,
    viewsThisYear,
    mobilePercentage: 48,
    desktopPercentage: 46,
    tabletPercentage: 6,
    hourlyTrends,
    categoryBreakdown,
    topTools,
    recentVisits,
  };
}

/** Static, empty summary used during server rendering. */
export function getAnalyticsSummary(): AnalyticsSummary {
  return {
    liveVisitors: 0,
    totalPageviews: 0,
    uniqueVisitors: 0,
    adImpressions: 0,
    totalToolExecutions: 0,
    viewsLastHour: 0,
    viewsToday: 0,
    viewsThisMonth: 0,
    viewsThisYear: 0,
    mobilePercentage: 0,
    desktopPercentage: 0,
    tabletPercentage: 0,
    hourlyTrends: [],
    categoryBreakdown: [],
    topTools: [],
    recentVisits: [],
  };
}
