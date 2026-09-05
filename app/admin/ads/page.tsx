'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAdsConfig, saveAdsConfig, AdsManagerConfig } from '@/lib/admin-store';
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
  Copy,
  Layers,
  Heart,
  Settings,
  Radio,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminAdsPage() {
  const router = useRouter();
  const [config, setConfig] = useState<AdsManagerConfig | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'provider' | 'adsterra' | 'custom' | 'badges' | 'adsense' | 'slots' | 'adstxt'>('provider');

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
    toast.success('All Ad settings saved successfully and live on site!');
  };

  const handleCopyScript = () => {
    if (!config) return;
    const scriptTag = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.publisherId}" crossorigin="anonymous"></script>`;
    navigator.clipboard.writeText(scriptTag);
    toast.success('AdSense Script copied to clipboard!');
  };

  if (!isAuthenticated || !config) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Bar Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">Master Ads Management Console</h1>
              <p className="text-xs text-slate-500 font-medium">Control Adsterra, AdSense, Custom Codes, Badges & Slot Toggles</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('provider')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'provider' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>1. Network Provider</span>
          </button>

          <button
            onClick={() => setActiveTab('adsterra')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'adsterra' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>2. Adsterra Keys</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'badges' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. Ad Labels & Banner Copy</span>
          </button>

          <button
            onClick={() => setActiveTab('slots')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'slots' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4. Slot Toggles</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'custom' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>5. Custom Code Embeds</span>
          </button>

          <button
            onClick={() => setActiveTab('adsense')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'adsense' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>6. Google AdSense</span>
          </button>

          <button
            onClick={() => setActiveTab('adstxt')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'adstxt' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>7. ads.txt</span>
          </button>
        </div>

        {/* Tab 1: Ad Network Provider Selection */}
        {(activeTab === 'provider' || activeTab === 'adsterra') && (
          <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Active Ad Network Provider</h2>
                <p className="text-xs text-slate-500 font-medium">Select which ad network serves ads across all site banner slots.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  config.adProvider === 'adsterra' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Adsterra Ads
                  </span>
                  <input
                    type="radio"
                    name="adProvider"
                    checked={config.adProvider === 'adsterra'}
                    onChange={() => setConfig({ ...config, adProvider: 'adsterra' })}
                    className="w-4 h-4 text-indigo-600"
                  />
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  High CPM CPM network with 728x90, 300x250, and Native Container banners.
                </p>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-full w-max">
                  Recommended Active
                </span>
              </label>

              <label
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  config.adProvider === 'adsense' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Google AdSense
                  </span>
                  <input
                    type="radio"
                    name="adProvider"
                    checked={config.adProvider === 'adsense'}
                    onChange={() => setConfig({ ...config, adProvider: 'adsense' })}
                    className="w-4 h-4 text-indigo-600"
                  />
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Official Google AdSense auto-ads & responsive display units.
                </p>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full w-max">
                  AdSense Account
                </span>
              </label>

              <label
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  config.adProvider === 'custom' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Code className="w-4 h-4 text-indigo-600" />
                    Custom HTML / Script
                  </span>
                  <input
                    type="radio"
                    name="adProvider"
                    checked={config.adProvider === 'custom'}
                    onChange={() => setConfig({ ...config, adProvider: 'custom' })}
                    className="w-4 h-4 text-indigo-600"
                  />
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Paste custom script tags, affiliate banners, or HTML code snippets.
                </p>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 bg-slate-200 px-2.5 py-1 rounded-full w-max">
                  Custom Code
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Tab 2: Adsterra Configuration */}
        {(activeTab === 'provider' || activeTab === 'adsterra') && (
          <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Adsterra Script Keys & Container Configuration</h2>
                <p className="text-xs text-slate-500 font-medium">Update keys for your Adsterra Leaderboard, Sidebar, and Native Container banners.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Top Header Leaderboard Adsterra Key (728x90)
                </label>
                <input
                  type="text"
                  value={config.adsterraHeaderKey}
                  onChange={(e) => setConfig({ ...config, adsterraHeaderKey: e.target.value })}
                  placeholder="1f0ffa4c1356415c0882b66a415fa778"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 font-mono font-bold text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Sticky Sidebar Adsterra Key (300x250)
                </label>
                <input
                  type="text"
                  value={config.adsterraSidebarKey}
                  onChange={(e) => setConfig({ ...config, adsterraSidebarKey: e.target.value })}
                  placeholder="ae79652e11f3a4d27e0103e1bbfa3b96"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 font-mono font-bold text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Native Container Script URL
                  </label>
                  <input
                    type="text"
                    value={config.adsterraContainerScript}
                    onChange={(e) => setConfig({ ...config, adsterraContainerScript: e.target.value })}
                    placeholder="https://pl31153051.profitableratecpmnetwork.com/1c9f44a13215d061cf2fa93f0e7157ff/invoke.js"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Native Container Element ID
                  </label>
                  <input
                    type="text"
                    value={config.adsterraContainerId}
                    onChange={(e) => setConfig({ ...config, adsterraContainerId: e.target.value })}
                    placeholder="container-1c9f44a13215d061cf2fa93f0e7157ff"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Policy-Compliant Banner Copy & Ad Labels */}
        {(activeTab === 'badges' || activeTab === 'provider') && (
          <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Policy-Compliant Ad Labels & Banner Copy</h2>
                <p className="text-xs text-slate-500 font-medium">Google AdSense strictly requires neutral labels (&quot;Advertisement&quot; or &quot;Sponsored&quot;) and prohibits click-encouragement phrases.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Ad Slot Identifier Label (AdSense Allowed: &quot;Advertisement&quot; or &quot;Sponsored&quot;)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Advertisement', 'Sponsored', ''] as const).map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setConfig({ ...config, adLabelText: lbl })}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                        (config.adLabelText ?? 'Advertisement') === lbl
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-600/20'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {lbl || '(None / Blank)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Top Header Neutral Banner Copy
                </label>
                <input
                  type="text"
                  value={config.supportDevTextHeader}
                  onChange={(e) => setConfig({ ...config, supportDevTextHeader: e.target.value })}
                  placeholder="Fast, private, in-browser file tools."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 font-bold text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Sidebar Neutral Banner Copy
                </label>
                <input
                  type="text"
                  value={config.supportDevTextSidebar}
                  onChange={(e) => setConfig({ ...config, supportDevTextSidebar: e.target.value })}
                  placeholder="Fast, private, in-browser file tools."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 font-bold text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Post-Download / In-Feed Neutral Copy
                </label>
                <input
                  type="text"
                  value={config.supportDevTextPostDownload}
                  onChange={(e) => setConfig({ ...config, supportDevTextPostDownload: e.target.value })}
                  placeholder="Fast, private, in-browser file tools."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 font-bold text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Slot Enable/Disable Toggles */}
        {(activeTab === 'slots' || activeTab === 'provider') && (
          <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Ad Placement Units & Toggles</h2>
                <p className="text-xs text-slate-500 font-medium">Turn specific ad positions on or off globally across the application.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Top Header Banner Ad Slot (728x90)</p>
                  <p className="text-[11px] text-slate-500 font-medium">Visible at top of tool pages & homepage.</p>
                </div>
                <button onClick={() => setConfig({ ...config, headerBannerEnabled: !config.headerBannerEnabled })}>
                  {config.headerBannerEnabled ? <ToggleRight className="w-8 h-8 text-indigo-600" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Sticky Sidebar Ad Slot (300x530 Skyscraper)</p>
                  <p className="text-[11px] text-slate-500 font-medium">Desktop sidebar banner unit.</p>
                </div>
                <button onClick={() => setConfig({ ...config, sidebarEnabled: !config.sidebarEnabled })}>
                  {config.sidebarEnabled ? <ToggleRight className="w-8 h-8 text-indigo-600" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Tool Page In-Feed Ad Slot</p>
                  <p className="text-[11px] text-slate-500 font-medium">Native ad unit inside workspace layout.</p>
                </div>
                <button onClick={() => setConfig({ ...config, toolInFeedEnabled: !config.toolInFeedEnabled })}>
                  {config.toolInFeedEnabled ? <ToggleRight className="w-8 h-8 text-indigo-600" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Monetag Banner Script</p>
                  <p className="text-[11px] text-slate-500 font-medium">Auto-inject Monetag script tag in head.</p>
                </div>
                <button onClick={() => setConfig({ ...config, monetagEnabled: !config.monetagEnabled })}>
                  {config.monetagEnabled ? <ToggleRight className="w-8 h-8 text-indigo-600" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Custom Code Embeds */}
        {(activeTab === 'custom' || activeTab === 'provider') && (
          <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Custom HTML / Ad Code Snippets</h2>
                <p className="text-xs text-slate-500 font-medium">Paste custom script tags or affiliate iframe embeds for each slot.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Custom Top Header Ad Code
                </label>
                <textarea
                  rows={3}
                  value={config.customHeaderCode || ''}
                  onChange={(e) => setConfig({ ...config, customHeaderCode: e.target.value })}
                  placeholder="<script src='...'></script>"
                  className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-900 text-amber-300 font-mono text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Custom Sidebar Ad Code
                </label>
                <textarea
                  rows={3}
                  value={config.customSidebarCode || ''}
                  onChange={(e) => setConfig({ ...config, customSidebarCode: e.target.value })}
                  placeholder="<script src='...'></script>"
                  className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-900 text-amber-300 font-mono text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Custom Post-Download Ad Code
                </label>
                <textarea
                  rows={3}
                  value={config.customPostDownloadCode || ''}
                  onChange={(e) => setConfig({ ...config, customPostDownloadCode: e.target.value })}
                  placeholder="<script src='...'></script>"
                  className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-900 text-amber-300 font-mono text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Google AdSense Console */}
        {(activeTab === 'adsense' || activeTab === 'provider') && (
          <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Google AdSense Publisher ID</h2>
                <p className="text-xs text-slate-500 font-medium">Link your official Google AdSense Publisher account ID.</p>
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
                  onChange={(e) => {
                    const val = e.target.value;
                    const pubNum = val.replace(/[^0-9]/g, '');
                    const updatedAdsTxt = `google.com, pub-${pubNum || '1234567890123456'}, DIRECT, f08c47fec0942fa0`;
                    setConfig({ ...config, publisherId: val, adsTxtContent: updatedAdsTxt });
                  }}
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
                <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                  <div className="flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-amber-600" />
                    Generated AdSense Script Embed
                  </div>
                  <button
                    onClick={handleCopyScript}
                    className="px-2.5 py-1 rounded bg-amber-200/80 hover:bg-amber-200 text-amber-900 font-extrabold text-[11px] flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Snippet</span>
                  </button>
                </div>
                <code className="block p-3 bg-slate-900 text-amber-300 rounded-xl text-[11px] font-mono overflow-x-auto">
                  {`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.publisherId}" crossorigin="anonymous"></script>`}
                </code>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: ads.txt File Management */}
        {(activeTab === 'adstxt' || activeTab === 'provider') && (
          <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">ads.txt Content Management</h2>
                  <p className="text-xs text-slate-500 font-medium">Edit live records served dynamically at domain root (/ads.txt).</p>
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
                rows={4}
                value={config.adsTxtContent}
                onChange={(e) => setConfig({ ...config, adsTxtContent: e.target.value })}
                className="w-full p-4 rounded-2xl border border-slate-300 bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-none focus:border-indigo-600 leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 font-medium">Standard format: <code className="text-slate-200">google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0</code></p>
            </div>
          </div>
        )}

        {/* Save Settings Bar */}
        <div className="p-4 bg-slate-900 text-white rounded-3xl flex items-center justify-between shadow-xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Ready to save all Ad management updates</span>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Ads Settings</span>
          </button>
        </div>
      </main>
    </div>
  );
}
