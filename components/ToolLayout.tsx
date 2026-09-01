'use client';

import { ReactNode, useEffect } from 'react';
import { AdSlot } from './AdSlot';
import { RelatedToolsSection } from './RelatedToolsSection';
import { SEOContent } from './SEOContent';
import { trackVisitorHeartbeat } from '@/lib/admin-store';
import { ShieldCheck, Zap, Lock, CheckCircle2, Sparkles } from 'lucide-react';

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
    <main className="min-h-screen w-full bg-slate-50/70 pt-3 sm:pt-8 pb-32 sm:pb-16 px-2 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-8">
        {/* Header Leaderboard Ad Slot (CLS = 0) */}
        <AdSlot slotType="header-leaderboard" />

        {/* Main Grid: Workspace & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-8 items-start">
          {/* Main Content Workspace */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-8">
            {/* Tool Header Title & Subtitle Container */}
            <div className="p-3.5 sm:p-0 rounded-2xl sm:rounded-none bg-white sm:bg-transparent border sm:border-none border-slate-200/90 sm:shadow-none shadow-2xs space-y-1.5 sm:space-y-2">
              <h1 className="text-lg sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug sm:leading-tight">
                {title}
              </h1>

              <p className="text-xs sm:text-base lg:text-lg text-slate-600 leading-relaxed font-medium">
                {subtitle}
              </p>
            </div>

            {/* Function-Centric Interactive Workspace Area */}
            <div className="bg-white p-3 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-md">
              {children}
            </div>

            {/* Post-Download In-Feed Ad Slot */}
            <AdSlot slotType="post-download" />

            {/* Explore Related FileZenith Tools */}
            <RelatedToolsSection currentSlug={slug} />

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
