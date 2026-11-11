/**
 * Local, first-party usage counters.
 *
 * Everything here is stored exclusively in the visitor's own browser
 * (localStorage / sessionStorage). No data is sent to a server, no identifier
 * is linked to an account, and nothing is shared with advertising networks.
 *
 * The values are used for:
 *  - remembering interface state,
 *  - a coarse, on-device count of tool usage.
 *
 * They are never rendered on a public page. See the Privacy Policy for the
 * full disclosure.
 */

/** Records a pageview in local storage. */
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

/** Records that an ad slot was rendered. */
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
