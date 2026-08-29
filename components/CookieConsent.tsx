'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, Check } from 'lucide-react';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('omnitool_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('omnitool_cookie_consent', 'accepted');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 max-w-md bg-white border border-slate-200 rounded-3xl p-5 shadow-xl space-y-3 animate-in slide-in-from-bottom duration-200">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-900">
            Privacy & Cookie Preference
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            We use anonymized telemetry and cookies strictly for essential monetization ad delivery (GDPR/CCPA compliant). Your documents and files are never stored or tracked.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={acceptAll}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Check className="w-4 h-4" />
          <span>Accept & Continue</span>
        </button>
      </div>
    </div>
  );
}
