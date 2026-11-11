/**
 * Consent management for Google AdSense + Google Analytics.
 *
 * Design goals (in order of importance):
 *  1. Consent Mode v2 defaults are set to "denied" BEFORE any Google tag
 *     executes, so nothing is stored until a user opts in.
 *  2. Google's own certified CMP (Google Funding Choices / UMP) is what
 *     actually serves the banner in EEA / UK / CH. It is delivered
 *     automatically by `adsbygoogle.js`, so this module never fights it —
 *     it only mirrors the resulting state into Consent Mode.
 *  3. A lightweight in-app preferences manager lets users revisit and change
 *     their choice from the footer, as required by GDPR Art. 7(3).
 *
 * Do NOT describe this module as a "Google CMP Certified" banner: it is not
 * certified by Google. Certified consent for EEA traffic comes from the
 * "European regulations" (Privacy & messaging) panel in the AdSense console.
 */

export const CONSENT_STORAGE_KEY = 'filezenith_consent_v2';

export type ConsentState = {
  /** AdSense / Google advertising cookies. */
  ad_storage: 'granted' | 'denied';
  /** Ad personalisation signals (Consent Mode v2). */
  ad_user_data: 'granted' | 'denied';
  /** Ad personalisation / remarketing signals (Consent Mode v2). */
  ad_personalization: 'granted' | 'denied';
  /** Google Analytics storage. */
  analytics_storage: 'granted' | 'denied';
};

export const CONSENT_DEFAULT: ConsentState = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
};

/**
 * The inline snippet injected in the document head before any Google tag.
 * Kept as a string so it can be emitted verbatim from the root layout.
 */
export const CONSENT_DEFAULT_SNIPPET = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
`.trim();

/** True when the browser sends the Global Privacy Control signal. */
export function hasGlobalPrivacyControl(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  return nav.globalPrivacyControl === true || nav.msDoNotTrack === '1';
}

/** Parses a stored consent payload into a fully-typed ConsentState. */
function parseConsent(raw: string): ConsentState | null {
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      ad_storage: parsed.ad_storage === 'granted' ? 'granted' : 'denied',
      ad_user_data: parsed.ad_user_data === 'granted' ? 'granted' : 'denied',
      ad_personalization: parsed.ad_personalization === 'granted' ? 'granted' : 'denied',
      analytics_storage: parsed.analytics_storage === 'granted' ? 'granted' : 'denied',
    };
  } catch {
    return null;
  }
}

export function readStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    return parseConsent(raw);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// External store (useSyncExternalStore compatible)
// ---------------------------------------------------------------------------
//
// The consent decision lives in localStorage, which is an external store.
// Exposing it through this subscribe/getSnapshot pair lets React read it
// without a setState-in-effect, and keeps every component in sync.
//
// IMPORTANT: useSyncExternalStore requires getSnapshot to return a
// *referentially stable* value while the underlying data has not changed.
// readStoredConsent() allocates a fresh object on every call, so the parsed
// result is cached here and only recomputed when the raw string changes.

const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedConsent: ConsentState | null = null;
let cacheInitialised = false;

function emitConsentChange(): void {
  listeners.forEach((listener) => listener());
}

/** Subscribes to consent changes. Returns an unsubscribe function. */
export function subscribeToConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Current consent state, for useSyncExternalStore. Referentially stable. */
export function getConsentSnapshot(): ConsentState | null {
  if (typeof window === 'undefined') return null;

  let raw: string | null = null;
  try {
    raw = localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }

  if (!cacheInitialised || raw !== cachedRaw) {
    cachedRaw = raw;
    cachedConsent = raw ? parseConsent(raw) : null;
    cacheInitialised = true;
  }

  return cachedConsent;
}

/** Server snapshot — consent is always unknown on the server. */
export function getConsentServerSnapshot(): ConsentState | null {
  return null;
}

export function storeConsent(state: ConsentState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ ...state, timestamp: new Date().toISOString() }),
    );
  } catch {
    /* storage unavailable (private mode) — consent still applies in-session */
  }
  // Invalidate the snapshot cache so subscribers see the new value.
  cacheInitialised = false;
  cachedRaw = null;
  cachedConsent = null;
  emitConsentChange();
}

/**
 * Pushes a consent state into Google Consent Mode and Google Funding
 * Choices (the `__tcfapi` bridge Google uses to honour a CMP decision).
 *
 * This function is the single place that talks to Google's consent APIs.
 * It deliberately does NOT dispatch a DOM event: any listener that called
 * back into this function would recurse infinitely.
 */
export function applyConsent(state: ConsentState): void {
  if (typeof window === 'undefined') return;

  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    __tcfapi?: (...args: unknown[]) => void;
  };

  w.gtag?.('consent', 'update', state);
  w.gtag?.('set', 'ads_data_redaction', state.ad_storage === 'denied');

  // Google Funding Choices / UMP reads the decision from this callback.
  w.__tcfapi?.('updateConsent', 2, {
    ad_storage: state.ad_storage,
    ad_user_data: state.ad_user_data,
    ad_personalization: state.ad_personalization,
    analytics_storage: state.analytics_storage,
    purpose1: state.ad_storage,
  });
}

/** Grants everything the user asked for and persists the decision. */
export function grantConsent(state: ConsentState): void {
  storeConsent(state);
  applyConsent(state);
}

/** Revokes every optional signal. */
export function denyConsent(): void {
  storeConsent(CONSENT_DEFAULT);
  applyConsent(CONSENT_DEFAULT);
}

/**
 * Restores a previously stored decision on page load.
 * Called from the root layout's effect so it runs on every navigation.
 */
export function restoreConsent(): ConsentState | null {
  const stored = readStoredConsent();
  if (!stored) return null;
  applyConsent(stored);
  return stored;
}

/** Event fired by the "Cookie Settings" footer link to reopen the manager. */
export const OPEN_CONSENT_EVENT = 'filezenith:open-consent';

export function openConsentSettings(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT));
}
