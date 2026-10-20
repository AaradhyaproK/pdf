'use client';

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AdSlot } from './AdSlot';
import { RelatedToolsSection } from './RelatedToolsSection';
import { SEOContent } from './SEOContent';
import { trackVisitorHeartbeat } from '@/lib/admin-store';
import { ShieldCheck, Zap, Lock, CheckCircle2, Sparkles, BookOpen, ArrowRight, FileText, Camera, Minimize2 } from 'lucide-react';

export interface ToolLayoutProps {
  slug: string;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  noCardWrapper?: boolean;
  hideTitle?: boolean;
  children: ReactNode;
}

export function ToolLayout({
  slug,
  title,
  subtitle,
  badgeText = '100% Client-Side Engine',
  noCardWrapper = false,
  hideTitle = false,
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
    <main className="min-h-screen w-full bg-slate-50/70 pt-3 sm:pt-6 pb-32 sm:pb-16 px-2 sm:px-6 lg:px-8 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto space-y-3 sm:space-y-6"
      >
        {/* Header Leaderboard Ad Slot (CLS = 0) */}
        <AdSlot slotType="header-leaderboard" />

        {/* Main Grid: Workspace & Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-start">
          {/* Main Content Workspace */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-6 min-w-0">
            {/* Tool Header Title & Subtitle Container */}
            {title && !hideTitle && (
              <div className="p-3.5 sm:p-0 rounded-2xl sm:rounded-none bg-white sm:bg-transparent border sm:border-none border-slate-200/90 sm:shadow-none shadow-2xs space-y-1.5 sm:space-y-2">
                <h1 className="text-lg sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug sm:leading-tight">
                  {title}
                </h1>

                {subtitle && (
                  <p className="text-xs sm:text-base lg:text-lg text-slate-600 leading-relaxed font-medium">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Function-Centric Interactive Workspace Area */}
            {noCardWrapper ? (
              children
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.995 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white p-3 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-md"
              >
                {children}
              </motion.div>
            )}

            {/* Post-Download In-Feed Ad Slot (Strictly >= 25px clear margin to prevent accidental clicks) */}
            <div className="pt-4 sm:pt-6">
              <AdSlot slotType="post-download" />
            </div>

            {/* Explore Related FileZenith Tools */}
            <RelatedToolsSection currentSlug={slug} />

            {/* Programmatic SEO Content & FAQs */}
            <SEOContent slug={slug} />
          </div>

          {/* Sticky Sidebar (Ad Placement Unit + E-E-A-T Trust & Quick Navigation) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            {/* 1. Client-Side Privacy Guarantee Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    100% Client-Side Privacy
                  </h3>
                  <p className="text-[10px] text-emerald-700 font-bold">Zero Server File Uploads</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                All file modifications, conversions, and compression run strictly in your web browser RAM via WebAssembly. Your sensitive documents never leave your computer or phone.
              </p>
              <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-700">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">Browser RAM Only</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">Zero Cloud Logs</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">No Account Needed</span>
              </div>
            </div>

            {/* 2. Helpful Step-by-Step Guides Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Helpful Guides
                  </h3>
                </div>
                <Link
                  href="/blog"
                  className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5"
                >
                  View All →
                </Link>
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/blog/how-to-compress-image-to-20kb"
                    className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/70 transition-colors group"
                  >
                    <span className="font-semibold text-slate-800 group-hover:text-indigo-600">How to Compress Image to 20KB</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/how-to-compress-pdf-to-200kb-online"
                    className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/70 transition-colors group"
                  >
                    <span className="font-semibold text-slate-800 group-hover:text-indigo-600">How to Compress PDF to 200KB</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/rrb-ntpc-photo-signature-guidelines-2026"
                    className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/70 transition-colors group"
                  >
                    <span className="font-semibold text-slate-800 group-hover:text-indigo-600">RRB NTPC Photo &amp; Sign Specs</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* 3. Sticky Sidebar Ad Unit */}
            <AdSlot slotType="sticky-sidebar" />
          </div>
        </div>
      </motion.div>
    </main>
  );
}


