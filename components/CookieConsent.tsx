'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Settings, Lock, Sparkles, AlertCircle } from 'lucide-react';

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  // Preference Toggles for "Manage Options"
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    analytics: true,
    personalizedAds: true,
  });

  useEffect(() => {
    const consent = localStorage.getItem('filezenith_cmp_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleConsentAll = () => {
    localStorage.setItem('filezenith_cmp_consent', JSON.stringify({
      status: 'accepted_all',
      timestamp: new Date().toISOString(),
      analytics: true,
      personalizedAds: true,
    }));
    setShow(false);
    setShowManageModal(false);
  };

  const handleDoNotConsent = () => {
    localStorage.setItem('filezenith_cmp_consent', JSON.stringify({
      status: 'rejected_non_essential',
      timestamp: new Date().toISOString(),
      analytics: false,
      personalizedAds: false,
    }));
    setShow(false);
    setShowManageModal(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('filezenith_cmp_consent', JSON.stringify({
      status: 'custom_preferences',
      timestamp: new Date().toISOString(),
      analytics: preferences.analytics,
      personalizedAds: preferences.personalizedAds,
    }));
    setShow(false);
    setShowManageModal(false);
  };

  if (!show) return null;

  return (
    <>
      {/* 3-Choice Google CMP Certified Consent Banner (EEA, UK, Switzerland GDPR Compliance) */}
      <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto z-50 max-w-lg bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-slate-900">
                EEA / UK Privacy & Cookie Consent
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                GDPR / CMP
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              We and our advertising partners use cookies and anonymized measurement tools to serve personalized ads and analyze site traffic in compliance with European GDPR rules. Your uploaded files are processed 100% locally in your browser and are never saved.
            </p>
          </div>
        </div>

        {/* 3 Choice Buttons: Consent, Do Not Consent, Manage Options */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-1">
          <button
            onClick={() => setShowManageModal(true)}
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
            <span>Do Not Consent</span>
          </button>

          <button
            onClick={handleConsentAll}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Consent (Accept All)</span>
          </button>
        </div>
      </div>

      {/* Manage Options Preferences Modal */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setShowManageModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Manage Cookie & Ad Preferences
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Customize your data sharing options for EEA / UK compliance.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              {/* Essential Cookies */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 block">Strictly Necessary Cookies</span>
                  <p className="text-[11px] text-slate-500 font-medium">Required for website navigation, Security, and Client-Side Wasm file processing.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black shrink-0">
                  Always Active
                </span>
              </div>

              {/* Analytics Cookies */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 block">Analytics & Performance</span>
                  <p className="text-[11px] text-slate-500 font-medium">Helps us measure pageviews and visitor counts in Cloud Firestore.</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded-lg cursor-pointer"
                />
              </div>

              {/* Personalized Advertising */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 block">Personalized Advertising (Google AdSense)</span>
                  <p className="text-[11px] text-slate-500 font-medium">Allows Google and certified ad vendors to serve relevant ads based on context.</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.personalizedAds}
                  onChange={(e) => setPreferences({ ...preferences, personalizedAds: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleDoNotConsent}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save My Choices</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
