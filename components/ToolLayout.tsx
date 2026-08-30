'use client';

import { ReactNode, useEffect } from 'react';
import { AdSlot } from './AdSlot';
import { SEOContent } from './SEOContent';
import { trackVisitorHeartbeat } from '@/lib/admin-store';
import { ShieldCheck, Zap, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export interface ToolLayoutProps {
  slug: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  children: ReactNode;
}

export function ToolLayout({
  slug,
  title,
  subtitle,
  badgeText = '100% Client-Side Engine',
  children,
}: ToolLayoutProps) {
  // Live Visitor Real-Time Heartbeat Registration
  useEffect(() => {
    trackVisitorHeartbeat(slug);
    const interval = setInterval(() => {
      trackVisitorHeartbeat(slug);
    }, 12000);

    return () => clearInterval(interval);
  }, [slug]);

  return (
    <main className="min-h-screen w-full bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Leaderboard Ad Slot (CLS = 0) */}
        <AdSlot slotType="header-leaderboard" />

        {/* Main Grid: Workspace & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Workspace */}
          <div className="lg:col-span-8 space-y-8">
            {/* Tool Header Title Block with High-CTR Trust Badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  100% Free • No Subscription
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-black border border-indigo-200 shadow-2xs">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  No Login Required
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-black border border-sky-200 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  100% Secure Data
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  {badgeText}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                {title}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
                {subtitle}
              </p>
            </div>

            {/* Interactive Workspace Area */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md">
              {children}
            </div>

            {/* Post-Download In-Feed Ad Slot */}
            <AdSlot slotType="post-download" />

            {/* Programmatic SEO Content & FAQs */}
            <SEOContent slug={slug} />
          </div>

          {/* Sticky Sidebar (Ad Placement Unit) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <AdSlot slotType="sticky-sidebar" />
          </div>
        </div>
      </div>
    </main>
  );
}
