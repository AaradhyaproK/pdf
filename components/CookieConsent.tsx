'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { ShieldCheck, Check, X, Settings, Lock, AlertCircle } from 'lucide-react';
import {
  CONSENT_DEFAULT,
  OPEN_CONSENT_EVENT,
  applyConsent,
  getConsentServerSnapshot,
  getConsentSnapshot,
  grantConsent,
  hasGlobalPrivacyControl,
  subscribeToConsent,
  type ConsentState,
} from '@/lib/consent';

/** No-op subscription used for values that never change after hydration. */
const noopSubscribe = () => () => {};
const clientTrue = () => true;
const clientFalse = () => false;

/**
 * Privacy preferences manager.
 *
 * IMPORTANT — this is a *preferences* manager, not a certified CMP.
 * Google requires a Google-certified CMP (Google Funding Choices / UMP) for
 * EEA, UK and Switzerland traffic; that is delivered automatically by the
 * `adsbygoogle.js` tag when "European regulations" is configured in the
 * AdSense console. This component mirrors whatever decision is made into
 * Consent Mode v2 and gives users a permanent way to revisit it.
 */
export function CookieConsent() {
  // The stored decision lives in localStorage, i.e. an external store. Reading
  // it via useSyncExternalStore keeps the render output consistent between
  // server and client and avoids copying it into state inside an effect.
  const stored = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );

  // True only after the client has hydrated, so the first-visit prompt never
  // flashes for returning visitors.
  const isHydrated = useSyncExternalStore(noopSubscribe, clientTrue, clientFalse);
  const gpcActive = useSyncExternalStore(noopSubscribe, hasGlobalPrivacyControl, clientFalse);

  /** Draft preferences while the user is editing them. */
  const [draft, setDraft] = useState<ConsentState | null>(null);
  const [showManageModal, setShowManageModal] = useState(false);

  // Keep Google Consent Mode in sync with the stored decision.
  useEffect(() => {
    if (stored) applyConsent(stored);
  }, [stored]);

  // Global Privacy Control is a legally binding opt-out signal: record the
  // denial automatically so nothing optional is ever stored for that user.
  useEffect(() => {
    if (isHydrated && !stored && gpcActive) {
      grantConsent(CONSENT_DEFAULT);
    }
  }, [isHydrated, stored, gpcActive]);

  // Allow the footer "Cookie Settings" link to reopen this manager.
  useEffect(() => {
    const handler = () => {
      setDraft(getConsentSnapshot() ?? CONSENT_DEFAULT);
      setShowManageModal(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, handler);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, handler);
  }, []);

  const openManage = () => {
    setDraft(getConsentSnapshot() ?? CONSENT_DEFAULT);
    setShowManageModal(true);
  };

  const showBanner = isHydrated && !stored && !gpcActive;

  const handleConsentAll = () => {
    grantConsent({
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
    setShowManageModal(false);
    setDraft(null);
  };

  const handleDoNotConsent = () => {
    grantConsent(CONSENT_DEFAULT);
    setShowManageModal(false);
    setDraft(null);
  };

  const handleSavePreferences = () => {
    if (!draft) return;
    grantConsent(draft);
    setShowManageModal(false);
    setDraft(null);
  };

  if (!showBanner && !showManageModal) return null;

  return (
    <>
      {/* First-visit preferences prompt */}
      {showBanner && (
        <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto z-[60] max-w-lg bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-slate-900">Privacy &amp; Cookie Preferences</h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                  GDPR
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                We use Google AdSense to show ads, and Google Analytics to measure traffic. These
                technologies use cookies and similar technologies. Your uploaded files are processed
                100% locally in your browser and are never saved or uploaded.
              </p>
              {gpcActive && (
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 font-semibold flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    Global Privacy Control is enabled in your browser, so optional advertising and
                    analytics cookies are blocked by default.
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-1">
            <button
              onClick={openManage}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Manage Options</span>
            </button>

            <button
              onClick={handleDoNotConsent}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reject All</span>
            </button>

            <button
              onClick={handleConsentAll}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Accept All</span>
            </button>
          </div>
        </div>
      )}

      {/* Detailed preferences modal */}
      {showManageModal && draft && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setShowManageModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close preferences"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Manage Cookie &amp; Ad Preferences
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Change your advertising and analytics choices at any time.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4">
                <div>
                  <span className="font-extrabold text-slate-900 block">Strictly Necessary Cookies</span>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Required for site navigation and for client-side file processing in your browser.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black shrink-0">
                  Always Active
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4">
                <div>
                  <span className="font-extrabold text-slate-900 block">Analytics &amp; Performance</span>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Allows Google Analytics to measure aggregated pageviews and traffic trends.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={draft.analytics_storage === 'granted'}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      analytics_storage: e.target.checked ? 'granted' : 'denied',
                    })
                  }
                  className="w-5 h-5 text-indigo-600 rounded-lg cursor-pointer shrink-0"
                  aria-label="Allow analytics cookies"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4">
                <div>
                  <span className="font-extrabold text-slate-900 block">Personalized Advertising</span>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Allows Google and certified ad vendors to serve ads based on your context and
                    prior visits.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={draft.ad_storage === 'granted'}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      ad_storage: e.target.checked ? 'granted' : 'denied',
                      ad_user_data: e.target.checked ? 'granted' : 'denied',
                      ad_personalization: e.target.checked ? 'granted' : 'denied',
                    })
                  }
                  className="w-5 h-5 text-indigo-600 rounded-lg cursor-pointer shrink-0"
                  aria-label="Allow personalized advertising cookies"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleDoNotConsent}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save My Choices</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 font-medium leading-relaxed border-t border-slate-100 pt-3 flex items-start gap-2">
              <Lock className="w-3 h-3 shrink-0 mt-0.5" />
              <span>
                You can revisit this page at any time via the &ldquo;Cookie Settings&rdquo; link in
                our footer. See our{' '}
                <a href="/privacy" className="underline font-bold text-indigo-600">
                  Privacy Policy
                </a>{' '}
                for full details on how data is used.
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
