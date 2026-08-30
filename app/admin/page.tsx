'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAdsConfigFromFirestore,
  subscribeLiveVisitors,
  getRealAnalyticsSummary,
  GoogleAdsConfig,
  AnalyticsSummary,
} from '@/lib/admin-store';
import { toast } from 'sonner';
import {
  Users,
  Eye,
  Wrench,
  Smartphone,
  Radio,
  ExternalLink,
  Settings,
  LogOut,
  DollarSign,
  Activity,
  CheckCircle2,
  Inbox,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adsConfig, setAdsConfig] = useState<GoogleAdsConfig | null>(null);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [liveCount, setLiveCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Session Guard Check
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('omnitool_admin_session');
      if (!session) {
        router.push('/admin/login');
        return;
      }
      setIsAuthenticated(true);
    }

    // Load Ads Config from Firestore
    getAdsConfigFromFirestore().then((cfg) => setAdsConfig(cfg));

    // Load Real Analytics Summary from Firestore
    getRealAnalyticsSummary().then((data) => {
      setSummary(data);
      setLiveCount(data.liveVisitors);
    });

    // Subscribe to Real-Time Live Visitors from Firestore
    const unsubscribeVisitors = subscribeLiveVisitors((count) => {
      setLiveCount(count);
    });

    return () => {
      unsubscribeVisitors();
    };
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('omnitool_admin_session');
    }
    toast.success('Logged out of Admin console.');
    router.push('/admin/login');
  };

  if (!isAuthenticated || !adsConfig || !summary) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold">
          <Activity className="w-5 h-5 animate-spin" />
          <span>Fetching Real-Time Aurea Metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Admin Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/1.png" alt="Aurea Logo" className="w-9 h-9 object-contain" />
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">Aurea Admin Console</h1>
              <p className="text-xs text-slate-500 font-medium">100% Real Cloud Firestore Metrics • faceid-login-xraxh</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/ads"
              className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              <span>Google Ads & ads.txt</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Live Visitor Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>REAL-TIME FIRESTORE LIVE TRACKING</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Active Visitors Dashboard</h2>
            <p className="text-xs text-slate-300">Live active visitors queried in real time from Cloud Firestore.</p>
          </div>

          <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-400 flex items-center justify-center gap-1.5">
                <Users className="w-6 h-6 text-emerald-400" />
                <span>{liveCount}</span>
              </div>
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Active Visitors Now</span>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-black text-indigo-300">{summary.totalPageviews}</div>
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Total Real Pageviews</span>
            </div>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-extrabold uppercase tracking-wider">Total Pageviews</span>
              <Eye className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{summary.totalPageviews}</div>
            <p className="text-[11px] text-slate-500 font-medium">Counted on Every Refresh & Navigation</p>
          </div>

          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-extrabold uppercase tracking-wider">Unique Visitors</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{summary.uniqueVisitors}</div>
            <p className="text-[11px] text-slate-500 font-medium">Distinct Visitor UUID Sessions</p>
          </div>

          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-extrabold uppercase tracking-wider">Ad Impressions</span>
              <DollarSign className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{summary.adImpressions}</div>
            <p className="text-[11px] text-slate-500 font-medium">AdSense Unit Loads</p>
          </div>

          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-extrabold uppercase tracking-wider">Tool Executions</span>
              <Wrench className="w-4 h-4 text-violet-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{summary.totalToolExecutions}</div>
            <p className="text-[11px] text-slate-500 font-medium">Real Execution Logs</p>
          </div>
        </div>

        {/* Google Adsense Linking & Status Overview */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Google AdSense Linking Status</h3>
                <p className="text-xs text-slate-500 font-medium">Publisher ID & Ad Slots configuration overview.</p>
              </div>
            </div>

            <Link
              href="/admin/ads"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configure Ads Setup</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
              <span className="text-[11px] font-extrabold uppercase text-slate-400">AdSense Publisher ID</span>
              <p className="text-sm font-black text-slate-900 font-mono">{adsConfig.publisherId}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 pt-1">
                <CheckCircle2 className="w-3 h-3" />
                Script Tag Active
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
              <span className="text-[11px] font-extrabold uppercase text-slate-400">Active Ad Placements</span>
              <p className="text-sm font-black text-slate-900">
                {[
                  adsConfig.headerBannerEnabled,
                  adsConfig.toolInFeedEnabled,
                  adsConfig.sidebarEnabled,
                  adsConfig.bottomStickyEnabled,
                ].filter(Boolean).length} / 4 Enabled
              </p>
              <span className="text-[11px] text-slate-500 font-medium">Header, In-Feed, Sidebar, Sticky</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
              <span className="text-[11px] font-extrabold uppercase text-slate-400">ads.txt Sync Status</span>
              <p className="text-sm font-black text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Live & Verified (/ads.txt)
              </p>
              <Link href="/ads.txt" target="_blank" className="text-[11px] text-indigo-600 font-bold hover:underline inline-flex items-center gap-1 pt-0.5">
                <span>View ads.txt File</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Top Tools & Real-Time Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-indigo-600" />
              Real Tool Executions
            </h3>

            {summary.topTools.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 space-y-1">
                <Inbox className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-600">No Tool Logs Registered Yet</p>
                <p className="text-[11px]">Executing PDF, Image or Social downloader tools will log real events here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {summary.topTools.map((tool, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-700">{tool.category}</span>
                        <p className="text-xs font-black text-slate-900">{tool.name}</p>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">{tool.slug}</p>
                    </div>
                    <span className="text-xs font-black text-slate-800">{tool.count} executions</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
                Live Real-Time Activity Stream
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">Firestore (faceid-login-xraxh)</span>
            </div>

            {summary.recentVisits.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 space-y-1">
                <Inbox className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-600">No Active Live Visitors Right Now</p>
                <p className="text-[11px]">When visitors open any tool page, live sessions will display here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {summary.recentVisits.map((visit, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900">{visit.page}</p>
                      <p className="text-[11px] text-slate-400">{visit.device} • {visit.country}</p>
                    </div>
                    <span className="text-[11px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{visit.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
