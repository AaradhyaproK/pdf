'use client';

import { ReactNode, useEffect } from 'react';
import { AdSlot } from './AdSlot';
import { SEOContent } from './SEOContent';
import { trackVisitorHeartbeat } from '@/lib/admin-store';
import { ShieldCheck, Zap } from 'lucide-react';

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
            {/* Tool Header Title Block */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/80">
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  {badgeText}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Zero Upload Privacy
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            </div>

            {/* Tool Interactive Card Container */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
              {children}
            </div>

            {/* Post-Download Conversion / Partner Offer Ad Slot */}
            <AdSlot slotType="post-download" />
          </div>

          {/* Sticky Sidebar Ad Container */}
          <div className="lg:col-span-4 hidden lg:block">
            <AdSlot slotType="sticky-sidebar" />
          </div>
        </div>

        {/* SEO Schemas, How-To, Comparison Table & FAQ Section */}
        <SEOContent slug={slug} />
      </div>
    </main>
  );
}
