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

// 3. Real-Time Visitor Heartbeat Tracker (Stores to Firestore & Local Storage)
export async function trackVisitorHeartbeat(pagePath: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    let visitorId = sessionStorage.getItem('omnitool_visitor_id');
    if (!visitorId) {
      visitorId = `v_${Math.random().toString(36).substr(2, 7)}_${Date.now()}`;
      sessionStorage.setItem('omnitool_visitor_id', visitorId);
    }

    // Write to Cloud Firestore live_visitors collection
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

    // Save to local storage active sessions map
    const existing = JSON.parse(localStorage.getItem('omnitool_active_visitors') || '{}');
    existing[visitorId] = { page: pagePath, time: Date.now() };
    localStorage.setItem('omnitool_active_visitors', JSON.stringify(existing));

    return visitorId;
  } catch {
    return null;
  }
}

// 4. Subscribe to Real-Time Live Visitors from Firestore
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

// 5. Track Tool Execution Event to Firestore & Local Storage
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

    // Local storage execution tracker
    const localLogs = JSON.parse(localStorage.getItem('omnitool_tool_logs') || '[]');
    localLogs.push({ toolSlug, category, time: new Date().toISOString() });
    localStorage.setItem('omnitool_tool_logs', JSON.stringify(localLogs));
  } catch {
    //
  }
}

// 6. Real Analytics Summary (Reads Firestore + Local Storage Execution Logs)
export async function getRealAnalyticsSummary(): Promise<AnalyticsSummary> {
  let liveCount = 1;
  let totalExecutions = 0;
  const recentVisits: { page: string; time: string; device: string; country: string }[] = [];
  const toolCounts: Record<string, { name: string; category: string; count: number }> = {};

  // Read Local Storage logs as instant baseline
  if (typeof window !== 'undefined') {
    const localVisitors = JSON.parse(localStorage.getItem('omnitool_active_visitors') || '{}');
    const activeKeys = Object.keys(localVisitors);
    if (activeKeys.length > 0) liveCount = activeKeys.length;

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

  // Fetch Firestore documents
  try {
    const liveSnap = await getDocs(collection(db, 'live_visitors'));
    if (liveSnap.docs.length > 0) {
      liveCount = liveSnap.docs.length;
      recentVisits.length = 0;
      liveSnap.docs.slice(0, 5).forEach((docSnap) => {
        const data = docSnap.data();
        recentVisits.push({
          page: data.activePage || '/',
          time: 'Active now',
          device: data.userAgent?.includes('Mobile') ? 'Mobile Device' : 'Desktop Browser',
          country: 'Live Visitor',
        });
      });
    }
  } catch {
    //
  }

  try {
    const logsSnap = await getDocs(collection(db, 'analytics_logs'));
    if (logsSnap.docs.length > 0) {
      totalExecutions = Math.max(totalExecutions, logsSnap.docs.length);
      logsSnap.docs.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.toolSlug) {
          const rawName = data.toolSlug.split('/').pop() || data.toolSlug;
          if (!toolCounts[data.toolSlug]) {
            toolCounts[data.toolSlug] = {
              name: rawName.replace(/-/g, ' ').toUpperCase(),
              category: data.category || 'Tool',
              count: 0,
            };
          }
          toolCounts[data.toolSlug].count++;
        }
      });
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
    totalPageviews: totalExecutions > 0 ? totalExecutions : liveCount,
    totalToolExecutions: totalExecutions,
    mobilePercentage: 0,
    desktopPercentage: 0,
    topTools,
    recentVisits,
  };
}

export function getAnalyticsSummary(): AnalyticsSummary {
  return {
    liveVisitors: 1,
    totalPageviews: 1,
    totalToolExecutions: 0,
    mobilePercentage: 0,
    desktopPercentage: 0,
    topTools: [],
    recentVisits: [],
  };
}
