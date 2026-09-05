import { Metadata } from 'next';
import Link from 'next/link';
import { CategoryConfig } from '@/lib/categories-data';
import { AdSlot } from '@/components/AdSlot';
import {
  ChevronRight,
  Sparkles,
  Layers,
  Star,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Grid,
} from 'lucide-react';

export function CategoryHubPage({ category }: { category: CategoryConfig }) {
  const siteUrl = 'https://www.filezenith.com';
  const url = `${siteUrl}/${category.slug}`;

  // 1. CollectionPage Schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.h1,
    description: category.metaDescription,
    url: url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: category.subgroups
        .flatMap((s) => s.tools)
        .map((t, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: t.name,
          url: `${siteUrl}${t.slug}`,
        })),
    },
  };

  // 2. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category.h1,
        item: url,
      },
    ],
  };

  // 3. FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: category.faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8 text-slate-900">
      {/* Inject JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumbs Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-extrabold truncate">{category.h1}</span>
        </nav>

        {/* Category Header */}
        <div className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-slate-500">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-100">
              <Grid className="w-3.5 h-3.5 text-indigo-600" /> Category Hub
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> 100% Free & Browser-Private
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {category.h1}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-3xl">
            {category.intro}
          </p>
        </div>

        {/* Top Header Leaderboard Ad Slot */}
        <AdSlot slotType="header-leaderboard" />

        {/* Subgrouped Tool Grid System */}
        <div className="space-y-8">
          {category.subgroups.map((sub, sIdx) => (
            <section key={sIdx} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 space-y-1">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>{sub.title}</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">{sub.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sub.tools.map((t, tIdx) => (
                  <Link
                    key={tIdx}
                    href={t.slug}
                    className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 hover:border-indigo-500 hover:bg-white shadow-xs hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                          {t.name}
                        </h3>
                        {t.badge && (
                          <span className="text-[9px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full shrink-0">
                            {t.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-snug line-clamp-2">
                        {t.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] font-black text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1">
                        <span>Use Tool</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Popular Tools Showcase */}
        {category.popularTools && category.popularTools.length > 0 && (
          <section className="bg-indigo-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-800 shadow-xl space-y-6">
            <div className="flex items-center gap-2 border-b border-indigo-800/80 pb-4">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h2 className="text-lg sm:text-xl font-black text-white">
                Most Popular {category.title.split(':')[0]}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {category.popularTools.map((pop, idx) => (
                <Link
                  key={idx}
                  href={pop.slug}
                  className="p-5 rounded-2xl bg-indigo-950/80 border border-indigo-800 hover:border-amber-400 hover:bg-indigo-950 shadow-md transition-all group space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
                      <span>{pop.name}</span>
                      <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-[11px] text-indigo-200/80 font-medium leading-snug">
                      {pop.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                    Launch Tool →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Mid-Page Ad Slot */}
        <AdSlot slotType="post-download" />

        {/* Collapsible FAQ Section */}
        {category.faqs && category.faqs.length > 0 && (
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Frequently Asked Questions (FAQ)
              </h2>
            </div>

            <div className="space-y-3">
              {category.faqs.map((item, idx) => (
                <details
                  key={idx}
                  className="group border border-slate-200 rounded-2xl p-4 cursor-pointer transition-all bg-slate-50/50 hover:bg-slate-50"
                >
                  <summary className="font-extrabold text-xs sm:text-sm text-slate-900 flex justify-between items-center select-none">
                    <span>{item.question}</span>
                    <span className="text-indigo-600 font-bold group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2 pt-2 border-t border-slate-200/60">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>

            {category.keywords && category.keywords.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2.5">
                  High Search Volume Portal Queries:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {category.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Related Categories Grid */}
        {category.relatedCategories && category.relatedCategories.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Explore Related Tool Hubs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {category.relatedCategories.map((rel, idx) => (
                <Link
                  key={idx}
                  href={rel.slug}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all group space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                      <span>{rel.name}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium leading-snug">
                      {rel.desc}
                    </p>
                  </div>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">
                    View Category Hub →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
