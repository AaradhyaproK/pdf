import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GUIDE_REGISTRY } from '@/lib/guides-data';
import { AdSlot } from '@/components/AdSlot';
import {
  ChevronRight,
  BookOpen,
  Clock,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Wrench,
  FileText,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(GUIDE_REGISTRY).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDE_REGISTRY[slug];

  if (!guide) return {};

  const siteUrl = 'https://www.filezenith.com';
  const url = `${siteUrl}/guides/${slug}`;

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: url,
      siteName: 'FileZenith Guides',
      type: 'article',
      publishedTime: guide.publishedDate,
      authors: [guide.author],
      images: [`${siteUrl}/1.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.metaTitle,
      description: guide.metaDescription,
      images: [`${siteUrl}/1.png`],
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = GUIDE_REGISTRY[slug];

  if (!guide) {
    notFound();
  }

  const siteUrl = 'https://www.filezenith.com';
  const url = `${siteUrl}/guides/${slug}`;

  // 1. Article JSON-LD Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: guide.h1,
    description: guide.metaDescription,
    url: url,
    author: {
      '@type': 'Organization',
      name: guide.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FileZenith',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/1.png`,
      },
    },
    datePublished: guide.publishedDate,
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
        name: 'Guides',
        item: `${siteUrl}/guides`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: guide.h1,
        item: url,
      },
    ],
  };

  // 3. FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map((item) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Breadcrumbs Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Link href="/" className="hover:text-indigo-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Guides</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-extrabold truncate">{guide.h1}</span>
            </nav>

            {/* Article Header */}
            <div className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-100">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Guide
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {guide.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {guide.publishedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {guide.readTimeMinutes} min read
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {guide.h1}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed pt-2">
                {guide.introduction}
              </p>
            </div>

            {/* Top Header Leaderboard Ad Slot */}
            <AdSlot slotType="header-leaderboard" />

            {/* Official Portal Verification Disclaimer */}
            {guide.disclaimer && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1 text-xs font-bold shadow-2xs">
                <div className="flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="uppercase text-[10px] font-black tracking-wider">Official Portal Disclaimer</span>
                </div>
                <p className="text-amber-800/90 font-medium leading-relaxed">
                  {guide.disclaimer}
                </p>
              </div>
            )}

            {/* Article Body Sections */}
            <div className="space-y-6">
              {guide.sections.map((sec, idx) => (
                <section
                  key={idx}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3"
                >
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 font-black text-xs flex items-center justify-center shrink-0 border border-indigo-100">
                      {idx + 1}
                    </span>
                    <span>{sec.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {sec.content}
                  </p>

                  {sec.subsections && sec.subsections.length > 0 && (
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      {sec.subsections.map((sub, sIdx) => (
                        <div key={sIdx} className="space-y-1 pl-4 border-l-2 border-indigo-500">
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">{sub.title}</h3>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">{sub.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Examples Section */}
            {guide.examples && guide.examples.length > 0 && (
              <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Real-World Examples & Solutions
                </h2>
                <div className="space-y-3">
                  {guide.examples.map((ex, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1.5 text-xs">
                      <div className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                        <span>Scenario: {ex.scenario}</span>
                      </div>
                      <p className="text-slate-700 font-medium pl-5 leading-relaxed">
                        <strong>Solution:</strong> {ex.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Common Mistakes Box */}
            {guide.commonMistakes && guide.commonMistakes.length > 0 && (
              <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 text-rose-900">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Common Mistakes to Avoid</span>
                </h2>
                <ul className="space-y-2 text-xs sm:text-sm font-medium text-slate-700">
                  {guide.commonMistakes.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Mid-Article Content Ad Slot */}
            <AdSlot slotType="post-download" />

            {/* Collapsible FAQ Section */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Frequently Asked Questions (FAQ)
                </h2>
              </div>

              <div className="space-y-3">
                {guide.faq.map((item, idx) => (
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
            </section>
          </div>

          {/* Sticky Advertising Sidebar Column */}
          <aside className="lg:col-span-4 hidden lg:block sticky top-20">
            <AdSlot slotType="sticky-sidebar" />
          </aside>
        </div>

        {/* Bottom Section: Recommended Free Tools & Related Guides */}
        <div className="space-y-8 mt-12 pt-8 border-t border-slate-200">
          {/* Recommended Free Tools System */}
          {guide.relatedTools && guide.relatedTools.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Recommended Free Web Tools
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {guide.relatedTools.map((tool, idx) => (
                  <Link
                    key={idx}
                    href={tool.slug}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all group space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                        <span>{tool.name}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium leading-snug">
                        {tool.desc}
                      </p>
                    </div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">
                      Open Free Tool →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related Guides Cluster */}
          {guide.relatedGuides && guide.relatedGuides.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Related Knowledge Guides
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {guide.relatedGuides.map((g, idx) => (
                  <Link
                    key={idx}
                    href={g.slug}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all group space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                        <span>{g.name}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium leading-snug">
                        {g.desc}
                      </p>
                    </div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">
                      Read Article →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </main>
  );
}
