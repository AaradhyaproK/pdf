/**
 * Central Google AdSense configuration.
 *
 * Single source of truth for every AdSense value used across the app.
 * Anything that must be identical in the `<head>` tags, in client components
 * and on the server is derived from this module.
 *
 * ---------------------------------------------------------------------------
 * SETUP (required for ad units to render)
 * ---------------------------------------------------------------------------
 * 1. AdSense console -> Ad units -> create the unit(s) you want.
 * 2. Copy the numeric slot id and expose it as an env var:
 *
 *      NEXT_PUBLIC_ADSENSE_SLOT_HEADER=1234567890        (display / leaderboard)
 *      NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=1234567891       (300x600 skyscraper)
 *      NEXT_PUBLIC_ADSENSE_SLOT_POST_DOWNLOAD=1234567892 (in-feed / responsive)
 *
 * 3. If no slot id is configured the corresponding <ins> element is NOT
 *    rendered at all. This is intentional: an <ins> without a valid
 *    `data-ad-slot` is an "unfilled" ad unit, and repeatedly shipping empty ad
 *    units degrades both fill rate and the AdSense reviewer's impression of
 *    the site. AdSense Auto Ads (enabled in the AdSense console) still works
 *    because it only needs the `adsbygoogle.js` tag in the document head.
 */

export const ADSENSE_PUBLISHER_ID =
  process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-1291898061670715';

export type AdSlotType = 'header-leaderboard' | 'sticky-sidebar' | 'post-download';

/**
 * Slot ids are read through *literal* `process.env.NEXT_PUBLIC_*` accesses so
 * that Next.js can statically inline them into the client bundle.
 */
export const ADSENSE_SLOT_IDS: Record<AdSlotType, string> = {
  'header-leaderboard': process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER || '',
  'sticky-sidebar': process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '',
  'post-download': process.env.NEXT_PUBLIC_ADSENSE_SLOT_POST_DOWNLOAD || '',
};

/**
 * Neutral, policy-compliant label rendered above every ad unit.
 * Google requires ads to be clearly distinguishable from site content and
 * forbids click-encouragement wording ("Click here", "Sponsored link" etc.).
 */
export const ADSENSE_AD_LABEL = 'Advertisement';

/**
 * Reserved space (px) per slot type.
 *
 * Reserving the space up-front keeps Cumulative Layout Shift at 0 when the ad
 * finishes loading, which is what Google's "ads should not shift content"
 * guidance asks for.
 *
 * The reserved height matches the unit that Google AdSense auto-selects for
 * the slot's max width, so the ad fills the reserved box exactly:
 *   - 728px wide -> 728x90 leaderboard
 *   - 300px wide -> 300x600 vertical (half page)
 *   - 336px wide -> 336x280 large rectangle
 */
export const ADSENSE_SLOT_RESERVED_HEIGHT: Record<AdSlotType, number> = {
  'header-leaderboard': 90,
  'sticky-sidebar': 600,
  'post-download': 280,
};

/**
 * Max width (px) per slot type.
 * Constraining the width to a standard AdSense unit width is what makes the
 * auto-selected format deterministic, which in turn keeps the reserved
 * height accurate.
 */
export const ADSENSE_SLOT_MAX_WIDTH: Record<AdSlotType, number> = {
  'header-leaderboard': 728,
  'sticky-sidebar': 300,
  'post-download': 336,
};

/** Human-readable slot names, used in documentation and tooling. */
export const ADSENSE_SLOT_LABELS: Record<AdSlotType, string> = {
  'header-leaderboard': 'Header Leaderboard (728x90 responsive)',
  'sticky-sidebar': 'Sticky Sidebar (300x600 responsive)',
  'post-download': 'In-Feed / Post-Download (responsive)',
};

/** True when the given slot has a real, usable ad unit id. */
export function hasAdUnit(slotType: AdSlotType): boolean {
  return Boolean(ADSENSE_SLOT_IDS[slotType]);
}

/**
 * The canonical ads.txt record for this publisher.
 *
 * The publisher id in AdSense is `ca-pub-XXXXXXXXXXXXXXXX`; the ads.txt record
 * uses the same number with the `pub-` prefix and no `ca-` prefix.
 */
export const ADSENSE_ADS_TXT_RECORDS = [
  `google.com, ${ADSENSE_PUBLISHER_ID.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0`,
].join('\n');
