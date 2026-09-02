'use client';

import { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  Share,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Cpu,
  Sparkles,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function DownloadAppPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'production') {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => console.log('PWA Service Worker registered:', reg.scope))
          .catch((err) => console.error('Service Worker registration failed:', err));
      } else {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      }
    }

    // Check if app is already running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Capture native install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
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
        toast.success('Installing FileZenith App to your device...');
      }
      setDeferredPrompt(null);
    } else {
      toast.info('App installation prompt is available in your browser menu or Home Screen options.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/80 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-black">
            <Smartphone className="w-4 h-4 text-indigo-600 animate-bounce" />
            <span>Official Progressive Web App (PWA)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Install FileZenith Mobile App <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-rose-600 bg-clip-text text-transparent">
              Works 100% Offline Anytime
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            Install FileZenith directly to your iPhone, iPad, Android, or Desktop home screen. Edit PDFs, compress files, crop photos, and remove backgrounds with zero cellular data or server uploads.
          </p>
        </div>
      </section>

      {/* Main Installation Cards Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        {/* Device Detection & Installation Action Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4 text-left">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                <img src="/1.png" alt="FileZenith App Icon" className="w-11 h-11 object-contain" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>FileZenith App</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold uppercase">
                    v2.4 PWA
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Universal App for iPhone, iPad, Android, Mac & Windows
                </p>
              </div>
            </div>

            {/* Dynamic Status Badge */}
            <div className="shrink-0">
              {isInstalled ? (
                <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>App Already Installed</span>
                </div>
              ) : (
                <div className="px-4 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-black flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                  <span>Ready for Download</span>
                </div>
              )}
            </div>
          </div>

          {/* Android & Desktop 1-Click Install Button & Step Guide */}
          {!isIOS && (
            <div className="space-y-4 text-center sm:text-left">
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-slate-800">
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center justify-center sm:justify-start gap-2">
                    <Download className="w-5 h-5 text-indigo-400" />
                    Direct Android & Desktop Installation
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    Installs FileZenith App directly to your Android home screen or computer application drawer.
                  </p>
                </div>

                <button
                  onClick={handleInstallClick}
                  disabled={isInstalled}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>{isInstalled ? 'App Already Installed' : 'Install App Now'}</span>
                </button>
              </div>

              {/* Android Manual Step Fallback (Visible if browser menu action is needed) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100/90 text-left space-y-2.5">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>How to Install manually on Android (Chrome / Edge / Samsung Internet):</span>
                </h4>
                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold text-slate-700">
                  <li className="p-2.5 bg-white rounded-xl border border-indigo-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">1</span>
                    <span>Tap Chrome <strong>3 dots (⋮)</strong> menu top-right.</span>
                  </li>
                  <li className="p-2.5 bg-white rounded-xl border border-indigo-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">2</span>
                    <span>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                  </li>
                  <li className="p-2.5 bg-white rounded-xl border border-indigo-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">3</span>
                    <span>Tap <strong>Install</strong> to add to app drawer.</span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* iOS Safari Installation Steps Guide */}
          {isIOS && (
            <div className="space-y-4 text-left bg-indigo-50/60 p-5 sm:p-6 rounded-2xl border border-indigo-100">
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <Share className="w-5 h-5 text-indigo-600" />
                How to Install on iPhone & iPad (Safari):
              </h3>
              <ol className="space-y-2.5 text-xs text-slate-700 font-semibold list-none">
                <li className="flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0">1</span>
                  <span>Tap the <strong className="text-slate-900">Share</strong> icon at the bottom of Safari browser toolbar.</span>
                </li>
                <li className="flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0">2</span>
                  <span>Scroll down the popup list and tap <strong className="text-slate-900 font-black">&quot;Add to Home Screen&quot;</strong>.</span>
                </li>
                <li className="flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0">3</span>
                  <span>Tap <strong className="text-slate-900">Add</strong> in the top right corner. The FileZenith icon will appear on your home screen!</span>
                </li>
              </ol>
            </div>
          )}

          {/* Real Scannable QR Code Section for Scanning on Phone */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-5 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm shrink-0 flex items-center justify-center">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://www.filezenith.com/download-app&color=0f172a"
                alt="Scan to Install FileZenith Mobile App"
                className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-xl"
              />
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block">
                100% Scannable QR Code
              </span>
              <h4 className="text-sm font-black text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                <span>Scan with Phone Camera to Install App</span>
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Point your iPhone Camera or Android Google Lens at this QR code to open the instant mobile app installer directly on your device.
              </p>
              <div className="pt-1">
                <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 inline-block">
                  https://www.filezenith.com/download-app
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">100% Offline Execution</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Your PDF is processed directly in your browser, helping keep your document processing private. Edit PDFs and process images anywhere without cellular data or Wi-Fi.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">Zero Server File Uploads</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Your sensitive documents stay on your device. All computations process inside your web browser's isolated client-side memory.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 w-fit">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">All 20+ Tools Included</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Full access to PDF compression, online editing, passport photo maker, AI background remover, batch image resizer, and QR generator.
            </p>
          </div>
        </div>

        {/* Back to Tools Button */}
        <div className="text-center pt-4">
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all"
          >
            <span>Launch Flagship All-in-One Studio</span>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
          </Link>
        </div>
      </main>
    </div>
  );
}
