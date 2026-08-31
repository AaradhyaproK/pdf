'use client';

import { useState, useEffect } from 'react';
import { Download, Sparkles, X, Share, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('PWA Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.error('Service worker registration failed:', err);
        });
    }

    // Check if app is already running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS devices (iPhone, iPad, iPod)
    const userAgent = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Show iOS PWA banner after 2 seconds on first visit
      const hasDismissedIOS = localStorage.getItem('filezenith_ios_pwa_dismissed');
      if (!hasDismissedIOS) {
        setTimeout(() => setShowInstallBanner(true), 2000);
      }
    }

    // Capture Android & Desktop Chrome/Edge native install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      toast.success('FileZenith Mobile App installed successfully!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success('Installing FileZenith Mobile App to your home screen...');
      }
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    if (isIOS) {
      localStorage.setItem('filezenith_ios_pwa_dismissed', 'true');
    }
  };

  if (isInstalled || !showInstallBanner) return null;

  return (
    <div className="fixed bottom-16 left-4 right-4 sm:bottom-4 sm:left-auto sm:right-4 z-50 sm:max-w-sm bg-slate-900 text-white p-4.5 rounded-3xl shadow-2xl border border-slate-800 space-y-3 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <span>Install FileZenith Mobile App</span>
              <span className="text-[9px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded font-extrabold">100% Offline</span>
            </h4>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">
              {isIOS
                ? 'Install on iPhone / iPad for instant offline PDF & photo editing.'
                : 'Install web app to use all 20+ PDF & image tools offline anytime.'}
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* iOS Safari Mobile Instruction Banner */}
      {isIOS ? (
        <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 text-xs text-slate-200 space-y-1.5">
          <p className="font-bold text-indigo-300 flex items-center gap-1">
            <Share className="w-3.5 h-3.5 text-indigo-400" /> How to install on iOS Safari:
          </p>
          <ol className="list-decimal list-inside text-[11px] text-slate-300 space-y-1 font-semibold">
            <li>Tap the <strong className="text-white">Share</strong> button at bottom of Safari</li>
            <li>Scroll down & tap <strong className="text-white">"Add to Home Screen"</strong></li>
          </ol>
        </div>
      ) : (
        /* Android & Desktop 1-Click Installation Button */
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Install App to Home Screen
          </button>
          <button
            onClick={handleDismiss}
            className="py-3 px-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
          >
            Later
          </button>
        </div>
      )}
    </div>
  );
}

