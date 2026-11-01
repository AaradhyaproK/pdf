import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getFirestorePosts, BlogPost } from '@/lib/blog';
import { AdSlot } from '@/components/AdSlot';
import { BlogFilterableList } from '@/components/blog/BlogFilterableList';
import { BookOpen, ShieldCheck, ArrowRight, Sparkles, Wrench, CheckCircle2, Lock, Zap } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.filezenith.com';
const blogOgImage = `${siteUrl}/api/og?title=${encodeURIComponent('Guides, Tutorials & Practical File Tips')}&category=${encodeURIComponent('Knowledge Hub')}&desc=${encodeURIComponent('Step-by-step exam photo resizing, 20KB/50KB compression & PDF optimization guides')}&badge=${encodeURIComponent('37+ Free Tutorials')}`;

export const metadata: Metadata = {
  title: 'Guides, Tutorials & Practical File Tips: Compress, Convert & Resize | FileZenith',
  description: 'Step-by-step practical guides on compressing images to 20KB & 50KB, reducing PDF under 100KB & 200KB, passport photo specifications 2026, RRB NTPC/SSC photo guidelines, and in-browser privacy tips.',
  keywords: [
    'filezenith blog',
    'file processing tutorials and guides',
    'how to compress image to 20kb online free',
    'how to compress image to 50kb for job forms',
    'how to compress pdf to 200kb online',
    'how to compress pdf to 100kb without losing quality',
    'passport size photo dimensions 2026 guidelines',
    'rrb ntpc photo and signature specifications',
    'ssc cgl chsl photo resizer guide with date stamp',
    'how to convert heic to jpg on windows pc free',
    'how to remove password from sbi bank statement pdf',
    'how to convert scanned pdf to editable word docx',
    'how to print aadhaar card on pvc a4 cut piece guide',
    'how to calculate electricity bill from meter reading',
    'home loan emi calculation formula and guide',
    'old vs new tax regime fy 2026-27 comparison guide',
    'client side private document processing benefits'
  ],
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: 'Guides, Tutorials & Practical File Tips: Compress, Convert & Resize | FileZenith',
    description: 'Step-by-step practical guides on compressing images to 20KB & 50KB, reducing PDF under 100KB & 200KB, passport photo specifications 2026, and in-browser privacy tips.',
    url: `${siteUrl}/blog`,
    siteName: 'FileZenith',
    type: 'website',
    images: [
      {
        url: blogOgImage,
        width: 1200,
        height: 630,
        alt: 'FileZenith Unified Knowledge & Guides Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guides, Tutorials & Practical File Tips: Compress, Convert & Resize | FileZenith',
    description: 'Step-by-step practical guides on compressing images to 20KB & 50KB, reducing PDF under 100KB & 200KB, and passport photo specifications.',
    images: [blogOgImage],
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

  // 1. Blog Collection Schema
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'FileZenith Guides, Tutorials & Practical File Tips',
    description: 'Practical step-by-step guides on compressing images to 20KB & 50KB, reducing PDF under 100KB & 200KB, passport photo specifications, and in-browser privacy tips.',
    url: `${siteUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'FileZenith',
      url: siteUrl,
      logo: `${siteUrl}/filezenith-logo.png`,
    },
    blogPost: posts.slice(0, 15).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        '@type': 'Organization',
        name: 'FileZenith Editorial Team',
        url: siteUrl,
      },
    })),
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
        name: 'Guides & Blog',
        item: `${siteUrl}/blog`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50/70 pb-28 sm:pb-24">
      {/* Inject Structured Data Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Authority Hero Banner Section (Full width matching Landing Page) */}
      <section className="block relative overflow-hidden pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-slate-50">
        {/* 3D Floating Ecosystem Background Artwork */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <img
            src="/bg-blog.webp"
            alt="FileZenith Knowledge & Guides Hub"
            className="w-full h-full object-cover object-center scale-[1.02] transform-gpu"
          />
          {/* Precision Center-Vignette: Keeps center text razor-sharp while showcasing colorful 3D books and document icons on flanks */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.75)_0%,_rgba(255,255,255,0.40)_50%,_rgba(255,255,255,0.15)_100%)]" />
          {/* Seamless bottom fade transition into the page canvas */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-50 via-slate-50/50 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 relative z-10">
          {/* Trust Badges Bar on Top of Main Title */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              FileZenith Knowledge Hub
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% Free • Practical Guides
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              Zero Cloud Server Uploads
            </span>
          </div>

          {/* High-Contrast Bold Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Guides, Tutorials &amp; Practical File Tips
          </h1>

          {/* Crisp Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Explore comprehensive step-by-step guides on exam photo resizing, signature cleanup, 20KB &amp; 50KB compression, PDF workflows, and privacy-first web tools.
          </p>

          {/* Centered Trust Highlights Badges Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 37+ Verified Tutorials
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-indigo-600" /> 100% Client-Side Privacy
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-emerald-600" /> Free Forever
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header Leaderboard Ad Slot */}
        <AdSlot slotType="header-leaderboard" />

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
                  <Link href="/image/compress-to-20kb" className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/80 transition-colors group">
                    <span>Compress Image to 20KB</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/image/compress-to-50kb" className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between border border-slate-200/80 transition-colors group">
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
