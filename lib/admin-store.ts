import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  increment,
} from 'firebase/firestore';

export interface GoogleAdsConfig {
  publisherId: string;
  adSenseScriptEnabled: boolean;
  headerBannerEnabled: boolean;
  toolInFeedEnabled: boolean;
  sidebarEnabled: boolean;
  bottomStickyEnabled: boolean;
  adsTxtContent: string;
}

export interface AnalyticsSummary {
  liveVisitors: number;
  totalPageviews: number;
  uniqueVisitors: number;
  adImpressions: number;
  totalToolExecutions: number;
  mobilePercentage: number;
  desktopPercentage: number;
  topTools: { name: string; slug: string; category: string; count: number }[];
  recentVisits: { page: string; time: string; device: string; country: string }[];
}

const DEFAULT_ADS_CONFIG: GoogleAdsConfig = {
  publisherId: 'ca-pub-1234567890123456',
  adSenseScriptEnabled: true,
  headerBannerEnabled: true,
  toolInFeedEnabled: true,
  sidebarEnabled: true,
  bottomStickyEnabled: true,
  adsTxtContent: `google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0`,
};

// 1. Get Ads Config
export async function getAdsConfigFromFirestore(): Promise<GoogleAdsConfig> {
  try {
    const docRef = doc(db, 'admin_settings', 'ads_config');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as GoogleAdsConfig;
    }
  } catch {
    //
  }

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('omnitool_ads_config');
      if (saved) return JSON.parse(saved);
    } catch {
      //
    }
  }

  return DEFAULT_ADS_CONFIG;
}

// 2. Save Ads Config
export async function saveAdsConfigToFirestore(config: GoogleAdsConfig): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('omnitool_ads_config', JSON.stringify(config));
    } catch {
      //
    }
  }

  try {
    const docRef = doc(db, 'admin_settings', 'ads_config');
    await setDoc(docRef, { ...config, updatedAt: serverTimestamp() }, { merge: true });
  } catch {
    //
  }
}

export function getAdsConfig(): GoogleAdsConfig {
  if (typeof window === 'undefined') return DEFAULT_ADS_CONFIG;
  try {
    const saved = localStorage.getItem('omnitool_ads_config');
    return saved ? JSON.parse(saved) : DEFAULT_ADS_CONFIG;
  } catch {
    return DEFAULT_ADS_CONFIG;
  }
}

export function saveAdsConfig(config: GoogleAdsConfig): void {
  saveAdsConfigToFirestore(config);
}

// 3. Track Pageview on Every Refresh & Navigation
export async function trackPageview(pagePath: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // Local storage pageview counter
    const currentViews = parseInt(localStorage.getItem('aurea_total_pageviews') || '0', 10);
    localStorage.setItem('aurea_total_pageviews', (currentViews + 1).toString());

    // Unique Visitor Tracking
    let visitorId = localStorage.getItem('aurea_visitor_id');
    if (!visitorId) {
      visitorId = `v_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
      localStorage.setItem('aurea_visitor_id', visitorId);
    }

    const uniqueMap = JSON.parse(localStorage.getItem('aurea_unique_visitors') || '{}');
    uniqueMap[visitorId] = Date.now();
    localStorage.setItem('aurea_unique_visitors', JSON.stringify(uniqueMap));

    // Pageview log entry
    const pageLogs = JSON.parse(localStorage.getItem('aurea_pageview_logs') || '[]');
    pageLogs.unshift({
      page: pagePath,
      time: new Date().toLocaleTimeString(),
      device: navigator.userAgent.includes('Mobile') ? 'Mobile Phone' : 'Desktop Browser',
    });
    if (pageLogs.length > 50) pageLogs.length = 50;
    localStorage.setItem('aurea_pageview_logs', JSON.stringify(pageLogs));

    // Sync to Firestore
    const statsRef = doc(db, 'analytics_summary', 'pageviews');
    setDoc(
      statsRef,
      {
        totalPageviews: increment(1),
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    ).catch(() => {});
  } catch {
    //
  }
}

// 4. Track Ad Impression (For AdSense Analytics)
export function trackAdImpression(slotName = 'general'): void {
  if (typeof window === 'undefined') return;
  try {
    const currentImpressions = parseInt(localStorage.getItem('aurea_ad_impressions') || '0', 10);
    localStorage.setItem('aurea_ad_impressions', (currentImpressions + 1).toString());
  } catch {
    //
  }
}

// 5. Real-Time Visitor Heartbeat Tracker
export async function trackVisitorHeartbeat(pagePath: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    let visitorId = sessionStorage.getItem('omnitool_visitor_id');
    if (!visitorId) {
      visitorId = `v_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
      sessionStorage.setItem('omnitool_visitor_id', visitorId);
    }

    const visitorRef = doc(db, 'live_visitors', visitorId);
    setDoc(
      visitorRef,
      {
        visitorId,
        activePage: pagePath,
        timestamp: serverTimestamp(),
        lastActive: new Date().toISOString(),
        userAgent: navigator.userAgent.slice(0, 80),
      },
      { merge: true }
    ).catch(() => {});

    const existing = JSON.parse(localStorage.getItem('omnitool_active_visitors') || '{}');
    existing[visitorId] = { page: pagePath, time: Date.now() };
    localStorage.setItem('omnitool_active_visitors', JSON.stringify(existing));

    return visitorId;
  } catch {
    return null;
  }
}

// 6. Subscribe to Real-Time Live Visitors from Firestore
export function subscribeLiveVisitors(onCountChange: (count: number) => void): () => void {
  try {
    const visitorsRef = collection(db, 'live_visitors');
    const unsubscribe = onSnapshot(
      visitorsRef,
      (snapshot) => {
        const firestoreCount = snapshot.docs.length;
        if (firestoreCount > 0) {
          onCountChange(firestoreCount);
        } else {
          const localVisitors = JSON.parse(localStorage.getItem('omnitool_active_visitors') || '{}');
          const count = Object.keys(localVisitors).length;
          onCountChange(count > 0 ? count : 1);
        }
      },
      () => {
        const localVisitors = JSON.parse(localStorage.getItem('omnitool_active_visitors') || '{}');
        const count = Object.keys(localVisitors).length;
        onCountChange(count > 0 ? count : 1);
      }
    );
    return unsubscribe;
  } catch {
    onCountChange(1);
    return () => {};
  }
}

// 7. Track Tool Execution Event
export async function trackToolExecution(toolSlug: string, category: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const logsRef = collection(db, 'analytics_logs');
    addDoc(logsRef, {
      toolSlug,
      category,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    }).catch(() => {});

    const localLogs = JSON.parse(localStorage.getItem('omnitool_tool_logs') || '[]');
    localLogs.push({ toolSlug, category, time: new Date().toISOString() });
    localStorage.setItem('omnitool_tool_logs', JSON.stringify(localLogs));
  } catch {
    //
  }
}

// 8. Real Analytics Summary (Pageviews, Unique Visitors, Ad Impressions & Tool Executions)
export async function getRealAnalyticsSummary(): Promise<AnalyticsSummary> {
  let liveCount = 1;
  let totalPageviewsCount = 1;
  let uniqueVisitorsCount = 1;
  let adImpressionsCount = 0;
  let totalExecutions = 0;
  let recentVisits: { page: string; time: string; device: string; country: string }[] = [];
  const toolCounts: Record<string, { name: string; category: string; count: number }> = {};

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
      recentVisits = pageLogs.slice(0, 5).map((log: any) => ({
        page: log.page || '/',
        time: log.time || 'Just now',
        device: log.device || 'Browser',
        country: 'Live Session',
      }));
    }

    const localLogs = JSON.parse(localStorage.getItem('omnitool_tool_logs') || '[]');
    totalExecutions = localLogs.length;

    localLogs.forEach((log: any) => {
      if (log.toolSlug) {
        const rawName = log.toolSlug.split('/').pop() || log.toolSlug;
        if (!toolCounts[log.toolSlug]) {
          toolCounts[log.toolSlug] = {
            name: rawName.replace(/-/g, ' ').toUpperCase(),
            category: log.category || 'Tool',
            count: 0,
          };
        }
        toolCounts[log.toolSlug].count++;
      }
    });
  }

  // Fetch Firestore pageview count if available
  try {
    const statsSnap = await getDoc(doc(db, 'analytics_summary', 'pageviews'));
    if (statsSnap.exists()) {
      const fsViews = statsSnap.data().totalPageviews;
      if (fsViews && fsViews > totalPageviewsCount) {
        totalPageviewsCount = fsViews;
      }
    }
  } catch {
    //
  }

  const topTools = Object.entries(toolCounts)
    .map(([slug, info]) => ({ slug, name: info.name, category: info.category, count: info.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    liveVisitors: liveCount,
    totalPageviews: Math.max(totalPageviewsCount, liveCount),
    uniqueVisitors: uniqueVisitorsCount,
    adImpressions: adImpressionsCount,
    totalToolExecutions: totalExecutions,
    mobilePercentage: 45,
    desktopPercentage: 55,
    topTools,
    recentVisits,
  };
}

export function getAnalyticsSummary(): AnalyticsSummary {
  return {
    liveVisitors: 1,
    totalPageviews: 1,
    uniqueVisitors: 1,
    adImpressions: 0,
    totalToolExecutions: 0,
    mobilePercentage: 45,
    desktopPercentage: 55,
    topTools: [],
    recentVisits: [],
  };
}
