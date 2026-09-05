import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getFirestorePosts, BlogPost } from '@/lib/blog';
import { AdSlot } from '@/components/AdSlot';
import { BlogFilterableList } from '@/components/blog/BlogFilterableList';
import { BookOpen, ShieldCheck, ArrowRight, Sparkles, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Guides, Tutorials & Practical File Tips | FileZenith Blog',
  description: 'Explore step-by-step guides on exam photo resizing, signature cleanup, 20KB/50KB image compression, PDF optimization, and privacy-first browser tools.',
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

  return (
    <main className="min-h-screen bg-slate-50/70 pt-4 sm:pt-6 pb-28 sm:pb-24 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Leaderboard Ad Slot */}
        <AdSlot slotType="header-leaderboard" />

        {/* Hero Section */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-12 text-center space-y-4 shadow-2xs">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold mx-auto">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>FileZenith Unified Knowledge & Guide Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Guides, Tutorials & Practical File Tips
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Explore comprehensive step-by-step guides on exam photo resizing, signature cleanup, 20KB & 50KB compression, PDF workflows, and privacy-first web tools.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-extrabold">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700">100% Free Tutorials</span>
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Zero Cloud Server Uploads
            </span>
          </div>
        </section>

        {/* Main 2-Column Grid: Articles + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Filterable Articles Column (8 cols) */}
          <div className="lg:col-span-8">
            <BlogFilterableList initialPosts={posts} />
          </div>

          {/* Sticky Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20 self-start">
            {/* Quick Navigation: Exam & ID Tools */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm border-b border-slate-100 pb-3">
                <Sparkles className="w-4.5 h-4.5 text-amber-500" />
                <span>Govt Exam & ID Tools</span>
              </div>
              <ul className="space-y-2 text-xs font-bold text-slate-700">
                <li>
                  <Link href="/tools/ssc-photo-resizer" className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/80 transition-colors group">
                    <span>SSC Photo Resizer (20-50KB)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/tools/signature-resizer-10-to-20kb" className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/80 transition-colors group">
                    <span>Signature Resizer (10-20KB)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/tools/upsc-photo-resizer" className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/80 transition-colors group">
                    <span>UPSC OTR Photo Resizer</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/tools/aadhaar-card-print" className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/80 transition-colors group">
                    <span>Aadhaar Card Print Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/tools/compress-image-to-20kb" className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/80 transition-colors group">
                    <span>Compress Image to 20KB</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/tools/compress-image-to-50kb" className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/80 transition-colors group">
                    <span>Compress Image to 50KB</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Popular PDF Tools Navigation */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-sm border-b border-slate-100 pb-3">
                <Wrench className="w-4.5 h-4.5 text-indigo-600" />
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
