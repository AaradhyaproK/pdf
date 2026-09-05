import Link from 'next/link';
import { GUIDE_REGISTRY } from '@/lib/guides-data';
import { FileText, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export function HomepageGuidesCluster() {
  const guides = Object.values(GUIDE_REGISTRY).slice(0, 6);

  if (guides.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Step-by-Step Tutorials & Exam Specs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Image Optimization Guides & Exam Photo Rules
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl">
              Learn exact specs for SSC, UPSC, NEET, Railway, and banking portals, plus how to compress photos without losing visual quality.
            </p>
          </div>

          <Link
            href="/blog"
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 shrink-0 group active:scale-95"
          >
            <span>Explore All Guides & Specs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/blog/${g.slug}`}
              className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-emerald-500 hover:bg-white hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full w-fit block">
                  {g.readTimeMinutes} min read
                </span>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug line-clamp-2">
                  {g.h1}
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                  {g.metaDescription}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-600 group-hover:text-emerald-700 flex items-center gap-1">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
