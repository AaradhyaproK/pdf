import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getFirestorePosts, BlogPost } from '@/lib/blog';
import { AdSlot } from '@/components/AdSlot';
import { Clock, Calendar, Tag, ArrowRight, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free File Tools Guide & Tips | FileZenith Blog',
  description: 'Step-by-step guides, privacy tutorials, and practical tips on compressing PDFs, merging documents, calculating loan EMIs, and optimizing browser-based file workflows.',
  alternates: {
    canonical: 'https://www.filezenith.com/blog',
  },
};

export const revalidate = 3600; // Enable 1 hour ISR for live post updates

export default async function BlogIndexPage() {
  const staticPosts = getAllPosts();
  const firestorePosts = await getFirestorePosts();

  // Merge static posts & live Firestore posts, deduplicated by slug
  const map = new Map<string, BlogPost>();
  staticPosts.forEach((p) => map.set(p.slug, p));
  firestorePosts.forEach((p) => map.set(p.slug, p));
  const posts = Array.from(map.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-slate-50/70 pt-4 sm:pt-6 pb-28 sm:pb-24 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Leaderboard Ad Slot */}
        <AdSlot slotType="header-leaderboard" />

        {/* Hero Section */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-12 text-center space-y-4 shadow-2xs">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold mx-auto">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>FileZenith Knowledge & Privacy Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Guides, Tutorials & Practical File Tips
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Explore comprehensive step-by-step guides on PDF compression, merging documents, financial EMI formulas, and privacy-first browser tools.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-extrabold">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700">100% Free Tutorials</span>
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Zero Cloud Server Uploads
            </span>
          </div>
        </section>

        {/* Featured Hero Article Banner */}
        {featuredPost && (
          <section className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
              {/* Cover Image */}
              <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[340px] bg-slate-900">
                <img
                  src={featuredPost.image || '/blog/pdf-compression.jpg'}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>

              {/* Text Body */}
              <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-black uppercase text-[10px] tracking-wider">
                      Featured Guide
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      {featuredPost.readingTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed line-clamp-3">
                    {featuredPost.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2"
                  >
                    <span>Read Featured Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {featuredPost.tool && (
                    <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Interactive Tool
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main 2-Column Grid: Articles + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Articles Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {remainingPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-indigo-500 transition-all group"
                >
                  {/* Card Cover Image */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={post.image || '/blog/pdf-compression.jpg'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-slate-500">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1 text-indigo-600 font-extrabold">
                          <Clock className="w-3 h-3" />
                          {post.readingTime}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                        {post.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-extrabold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1.5"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      {post.tags.length > 0 && (
                        <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {post.tags[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* In-Feed Banner Ad Slot */}
            <AdSlot slotType="post-download" />
          </div>

          {/* Sticky Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20 self-start">
            {/* Popular Tools Quick Navigation Card - Placed FIRST */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-sm border-b border-slate-100 pb-3">
                <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
                <span>Popular FileZenith Tools</span>
              </div>
              <ul className="space-y-2 text-xs font-bold text-slate-700">
                <li>
                  <Link href="/pdf/compress" className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/80 transition-colors group">
                    <span>Compress PDF Online</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/pdf/merge" className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/80 transition-colors group">
                    <span>Merge PDF Files</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/image/pics-to-pdf" className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/80 transition-colors group">
                    <span>Pics to PDF Converter</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/image/png-to-jpg" className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/80 transition-colors group">
                    <span>PNG to JPG Converter</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sidebar Banner Ad Slot */}
            <div className="w-full">
              <AdSlot slotType="sticky-sidebar" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
