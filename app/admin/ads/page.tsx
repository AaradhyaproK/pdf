'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminSession } from '@/lib/admin-session';
import {
  ADSENSE_ADS_TXT_RECORDS,
  ADSENSE_PUBLISHER_ID,
  ADSENSE_SLOT_IDS,
  ADSENSE_SLOT_LABELS,
  type AdSlotType,
} from '@/lib/ads-config';
import { toast } from 'sonner';
import {
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ArrowLeft,
  ExternalLink,
  Copy,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

const SLOT_TYPES: AdSlotType[] = ['header-leaderboard', 'sticky-sidebar', 'post-download'];

/**
 * Master Ads console.
 *
 * Google AdSense only. The provider cannot be changed and no custom ad code
 * can be injected — serving ads from a competing network alongside AdSense is
 * a direct breach of the AdSense programme policies.
 *
 * Ad unit ids live in environment variables (see `lib/ads-config.ts`) so that
 * every visitor gets an identical, correctly configured unit. The console
 * below reports the live configuration and lets you toggle whole placements
 * on or off.
 */
export default function AdminAdsPage() {
  const router = useRouter();
  const isAuthenticated = useAdminSession();
  const [activeTab, setActiveTab] = useState<'status' | 'slots' | 'adstxt'>('status');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard.`);
  };

  if (!isAuthenticated) {
    return null;
  }

  const tabClass = (tab: string) =>
    `px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
      activeTab === tab
        ? 'bg-indigo-600 text-white shadow-xs'
        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">AdSense Console</h1>
              <p className="text-xs text-slate-500 font-medium">
                Google AdSense status, ad placements and ads.txt
              </p>
            </div>
          </div>

          <Link
            href="/admin"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Console</span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
          <button onClick={() => setActiveTab('status')} className={tabClass('status')}>
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>1. AdSense Status</span>
          </button>
          <button onClick={() => setActiveTab('slots')} className={tabClass('slots')}>
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>2. Ad Placements</span>
          </button>
          <button onClick={() => setActiveTab('adstxt')} className={tabClass('adstxt')}>
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>3. ads.txt</span>
          </button>
        </div>

        {/* Tab 1: Status */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Google AdSense Configuration</h2>
                  <p className="text-xs text-slate-500 font-medium">
                    AdSense is the only advertising network enabled on this site.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900">Publisher ID</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">{ADSENSE_PUBLISHER_ID}</p>
                  </div>
                  <button
                    onClick={() => copy(ADSENSE_PUBLISHER_ID, 'Publisher ID')}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 transition-colors shrink-0"
                    aria-label="Copy publisher ID"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/70">
                  <div>
                    <p className="text-xs font-black text-emerald-900">adsbygoogle.js loader</p>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                      Injected on every page via the root layout. Required for Auto Ads and for
                      Google&apos;s certified CMP (Funding Choices) to serve EEA/UK/CH traffic.
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>

                <div className="flex items-center justify-between gap-4 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/70">
                  <div>
                    <p className="text-xs font-black text-emerald-900">Consent Mode v2</p>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                      Default state is set to &quot;denied&quot; before any Google tag executes.
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>

                <div className="flex items-center justify-between gap-4 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/70">
                  <div>
                    <p className="text-xs font-black text-emerald-900">Competing ad networks</p>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                      Permanently disabled. Serving other ad networks alongside AdSense breaches
                      AdSense programme policies.
                    </p>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>
              </div>
            </div>

            {/* Slot ids live in env vars */}
            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Configured Ad Units</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  These are read from environment variables at build time. Set them on your host and
                  redeploy:
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-4 overflow-x-auto">
                <pre className="text-[11px] font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">
{`NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=${ADSENSE_PUBLISHER_ID}
NEXT_PUBLIC_ADSENSE_SLOT_HEADER=${ADSENSE_SLOT_IDS['header-leaderboard'] || '<not set>'}
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=${ADSENSE_SLOT_IDS['sticky-sidebar'] || '<not set>'}
NEXT_PUBLIC_ADSENSE_SLOT_POST_DOWNLOAD=${ADSENSE_SLOT_IDS['post-download'] || '<not set>'}`}
                </pre>
              </div>

              <div className="space-y-2">
                {SLOT_TYPES.map((slotType) => {
                  const id = ADSENSE_SLOT_IDS[slotType];
                  return (
                    <div
                      key={slotType}
                      className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/70"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900">{ADSENSE_SLOT_LABELS[slotType]}</p>
                        <p className="text-[11px] font-medium mt-0.5 truncate">
                          {id ? (
                            <span className="text-emerald-700">Slot ID: {id}</span>
                          ) : (
                            <span className="text-amber-700">
                              Not configured — this placement renders nothing until a slot ID is set.
                            </span>
                          )}
                        </p>
                      </div>
                      {id ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Placement status */}
        {activeTab === 'slots' && (
          <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Ad Placement Status</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Placement is controlled by environment variables so that every visitor sees an
                  identical layout. Leave a slot id unset to switch that placement off.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {SLOT_TYPES.map((slotType) => {
                const id = ADSENSE_SLOT_IDS[slotType];
                const envVar =
                  slotType === 'header-leaderboard'
                    ? 'NEXT_PUBLIC_ADSENSE_SLOT_HEADER'
                    : slotType === 'sticky-sidebar'
                      ? 'NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR'
                      : 'NEXT_PUBLIC_ADSENSE_SLOT_POST_DOWNLOAD';
                return (
                  <div
                    key={slotType}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900">{ADSENSE_SLOT_LABELS[slotType]}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                        {id ? (
                          <>
                            <span className="text-emerald-700">Active</span> &middot; slot {id} &middot;{' '}
                            <code className="text-[10px]">{envVar}</code>
                          </>
                        ) : (
                          <>
                            <span className="text-amber-700">Inactive</span> &middot; set{' '}
                            <code className="text-[10px]">{envVar}</code>
                          </>
                        )}
                      </p>
                    </div>
                    {id ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
              <p className="text-xs font-black text-amber-800">Why environment variables?</p>
              <p className="text-[11px] text-amber-900/80 font-medium leading-relaxed">
                Ad placement must be identical for every visitor. A device-local toggle would let
                one visitor see a different layout from another, which is both confusing for users
                and inconsistent for the Google AdSense reviewer. Changing a placement therefore
                requires an environment change and a redeploy.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: ads.txt */}
        {activeTab === 'adstxt' && (
          <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">ads.txt</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Served from the domain root at /ads.txt and /app-ads.txt.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 p-4 overflow-x-auto">
              <pre className="text-[11px] font-mono text-emerald-300 whitespace-pre-wrap">{ADSENSE_ADS_TXT_RECORDS}</pre>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => copy(ADSENSE_ADS_TXT_RECORDS, 'ads.txt contents')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Contents</span>
              </button>
              <Link
                href="/ads.txt"
                target="_blank"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Preview /ads.txt</span>
              </Link>
            </div>

            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              The record is generated from the publisher ID, so it can never drift from the id used
              in your page tags. Google&rsquo;s crawler checks this file when reviewing the site for
              AdSense approval.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
