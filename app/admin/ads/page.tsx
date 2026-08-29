'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAdsConfig, saveAdsConfig, GoogleAdsConfig } from '@/lib/admin-store';
import { toast } from 'sonner';
import {
  DollarSign,
  ShieldCheck,
  Save,
  CheckCircle2,
  Code,
  FileText,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminAdsPage() {
  const router = useRouter();
  const [config, setConfig] = useState<GoogleAdsConfig | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('omnitool_admin_session');
      if (!session) {
        router.push('/admin/login');
        return;
      }
      setIsAuthenticated(true);
    }
    setConfig(getAdsConfig());
  }, [router]);

  const handleSave = () => {
    if (!config) return;
    saveAdsConfig(config);
    toast.success('Google Ads & ads.txt settings saved!');
  };

  if (!isAuthenticated || !config) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">Google Ads & Monetization Setup</h1>
              <p className="text-xs text-slate-500 font-medium">Configure Publisher ID, Ad Placements & ads.txt File</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Section 1: Publisher ID & AdSense Script */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Google AdSense Publisher ID</h2>
              <p className="text-xs text-slate-500 font-medium">Link your official Google AdSense account ID to enable ad impression serving.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                AdSense Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
              </label>
              <input
                type="text"
                value={config.publisherId}
                onChange={(e) => setConfig({ ...config, publisherId: e.target.value })}
                placeholder="ca-pub-1234567890123456"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 font-mono font-bold text-sm focus:outline-none focus:border-indigo-600 min-h-[48px]"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Auto-Inject Google AdSense Script</p>
                <p className="text-[11px] text-slate-500 font-medium">Loads pagead2.googlesyndication.com script globally in app layout.</p>
              </div>

              <button
                onClick={() => setConfig({ ...config, adSenseScriptEnabled: !config.adSenseScriptEnabled })}
                className="text-indigo-600"
              >
                {config.adSenseScriptEnabled ? <ToggleRight className="w-8 h-8 text-indigo-600" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
              </button>
            </div>

            <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                <Code className="w-4 h-4 text-amber-600" />
                Generated AdSense Embed Snippet
              </div>
              <code className="block p-3 bg-slate-900 text-amber-300 rounded-xl text-[11px] font-mono overflow-x-auto">
                {`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.publisherId}" crossorigin="anonymous"></script>`}
              </code>
            </div>
          </div>
        </div>

        {/* Section 2: Ad Slot Placements */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Ad Placement Units</h2>
              <p className="text-xs text-slate-500 font-medium">Control live ad slots on tools, header, and sticky banners.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Top Header Banner Ad (728x90)</p>
                <p className="text-[11px] text-slate-500 font-medium">Visible above tool forms.</p>
              </div>
              <button onClick={() => setConfig({ ...config, headerBannerEnabled: !config.headerBannerEnabled })}>
                {config.headerBannerEnabled ? <ToggleRight className="w-8 h-8 text-indigo-600" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Tool Page In-Feed Ad (Responsive)</p>
                <p className="text-[11px] text-slate-500 font-medium">Native ad unit inside tool layouts.</p>
              </div>
              <button onClick={() => setConfig({ ...config, toolInFeedEnabled: !config.toolInFeedEnabled })}>
                {config.toolInFeedEnabled ? <ToggleRight className="w-8 h-8 text-indigo-600" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Sidebar Skyscraper Ad (300x600)</p>
                <p className="text-[11px] text-slate-500 font-medium">Desktop sidebar banner.</p>
              </div>
              <button onClick={() => setConfig({ ...config, sidebarEnabled: !config.sidebarEnabled })}>
                {config.sidebarEnabled ? <ToggleRight className="w-8 h-8 text-indigo-600" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Bottom Sticky Anchor Ad (320x50)</p>
                <p className="text-[11px] text-slate-500 font-medium">High conversion mobile sticky banner.</p>
              </div>
              <button onClick={() => setConfig({ ...config, bottomStickyEnabled: !config.bottomStickyEnabled })}>
                {config.bottomStickyEnabled ? <ToggleRight className="w-8 h-8 text-indigo-600" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: ads.txt File Management */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">ads.txt Content Management</h2>
                <p className="text-xs text-slate-500 font-medium">Edit live records served at domain root (/ads.txt).</p>
              </div>
            </div>

            <Link
              href="/ads.txt"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Preview /ads.txt</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              ads.txt File Body
            </label>
            <textarea
              rows={5}
              value={config.adsTxtContent}
              onChange={(e) => setConfig({ ...config, adsTxtContent: e.target.value })}
              className="w-full p-4 rounded-2xl border border-slate-300 bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-none focus:border-indigo-600 leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 font-medium">Standard format: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0</p>
          </div>
        </div>

        {/* Save Bar */}
        <div className="p-4 bg-slate-900 text-white rounded-3xl flex items-center justify-between shadow-xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Ready to apply Google AdSense updates</span>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Google Ads Settings</span>
          </button>
        </div>
      </main>
    </div>
  );
}
