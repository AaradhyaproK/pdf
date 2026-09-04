'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function AppSplashScreen() {
  const [isFading, setIsFading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Skip splash screen on desktop screens (>= 768px)
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setIsHidden(true);
      return;
    }

    // Fade out splash screen after mobile app hydrates
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 400);

    const hideTimer = setTimeout(() => {
      setIsHidden(true);
    }, 850);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (isHidden) return null;

  return (
    <div
      id="app-splash-screen"
      className={`md:hidden fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-between p-8 select-none transition-all duration-500 ease-out ${
        isFading ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 48px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 36px)',
      }}
    >
      {/* Top Tag */}
      <div className="w-full flex justify-center">
        <span className="px-3.5 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-extrabold text-[10px] uppercase tracking-widest shadow-2xs">
          100% Client-Side Engine
        </span>
      </div>

      {/* Center Branding Content */}
      <div className="flex flex-col items-center text-center space-y-5 my-auto">
        {/* Animated Glowing Logo Wrapper */}
        <div className="relative group">
          <div className="absolute -inset-3 bg-gradient-to-r from-rose-500 via-indigo-500 to-rose-500 rounded-3xl blur-xl opacity-40 animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-3 shadow-2xl border border-slate-100 flex items-center justify-center">
            <Image
              src="/filezenith-logo.png"
              alt="FileZenith Logo"
              width={96}
              height={96}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Application Name */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            File<span className="bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">Zenith</span>
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500 max-w-xs">
            Private PDF, Image & Utility Studio
          </p>
        </div>

        {/* Animated Loading Bar */}
        <div className="w-36 h-1 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-600 to-indigo-600 w-full animate-shimmer rounded-full" />
        </div>
      </div>

      {/* Footer Lock Status */}
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Zero File Uploads • 100% Secure</span>
      </div>
    </div>
  );
}
