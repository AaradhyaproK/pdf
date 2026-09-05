import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { AdSlot } from '@/components/AdSlot';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Tag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Share2,
  FileText,
} from 'lucide-react';

export const revalidate = 86400; // 24 hours ISR

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.filezenith.com';
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = `${siteUrl}${post.image || '/blog/pdf-compression.jpg'}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags.join(', '),
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: postUrl,
      siteName: 'FileZenith',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ['https://www.filezenith.com/about'],
      section: post.tags[0] || 'Guides',
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.filezenith.com';
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = `${siteUrl}${post.image || '/blog/pdf-compression.jpg'}`;

  // Article / BlogPosting JSON-LD Schema
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Article', 'BlogPosting'],
    headline: post.title,
    description: post.description,
    image: [imageUrl],
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'en-US',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    isPartOf: {
      '@type': 'Blog',
      '@id': `${siteUrl}/blog`,
      name: 'FileZenith Guides & Knowledge Hub',
    },
    author: {
      '@type': 'Organization',
      name: 'FileZenith Tech Team',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FileZenith',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/filezenith-logo.png`,
      },
    },
    keywords: post.tags.join(', '),
    articleSection: post.tags[0] || 'Guides',
    wordCount: post.content.split(/\s+/).length,
  };

  // Breadcrumb List JSON-LD Schema
  const breadcrumbJsonLd = {
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
        name: 'Blog',
        item: `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  // FAQPage JSON-LD Schema for Google Search Rich Snippets
  const faqJsonLd = post.faqs && post.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  } : null;

  return (
    <main className="min-h-screen bg-slate-50/70 pt-4 sm:pt-6 pb-28 sm:pb-20 px-3 sm:px-6 lg:px-8">
      {/* Inject Structured Data Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Leaderboard Ad Slot */}
        <AdSlot slotType="header-leaderboard" />

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-600 overflow-x-auto py-1">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-extrabold truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Main 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Article Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6 min-w-0">
            {/* Header Title & Metadata Box */}
            <header className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    {post.readingTime}
                  </span>
                </div>

                <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Privacy Verified</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug sm:leading-tight">
                {post.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-semibold">
                {post.description}
              </p>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80"
                    >
                      <Tag className="w-3 h-3 text-indigo-500" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* HD Banner Cover Image */}
            {post.image && (
              <div className="relative w-full h-64 sm:h-96 rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-900">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Contextual Interactive Tool Callout CTA Card */}
            {post.tool && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-amber-300 text-xs font-extrabold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Instant Online Engine</span>
                  </div>
                  <h3 className="text-xl font-black text-white">Use Tool Directly in Browser</h3>
                  <p className="text-xs text-slate-300 font-medium">
                    Your files never leave your browser. 100% free, zero login required.
                  </p>
                </div>

                <Link
                  href={post.tool}
                  className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0 group active:scale-95"
                >
                  <span>Launch Tool Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}

            {/* Main MDX Content Renderer */}
            <div className="bg-white p-6 sm:p-12 rounded-3xl border border-slate-200/90 shadow-2xs">
              <div className="prose prose-lg prose-slate max-w-none text-slate-800 prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-700 prose-p:leading-relaxed prose-p:font-medium prose-li:text-slate-700 prose-strong:text-slate-900 prose-strong:font-black prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none prose-a:text-indigo-600 prose-a:font-extrabold hover:prose-a:text-indigo-700 prose-img:rounded-3xl prose-hr:border-slate-200">
                <MDXRemote source={post.content} />
              </div>
            </div>

            {/* In-Feed Banner Ad Slot */}
            <AdSlot slotType="post-download" />

            {/* Related Tools Showcase */}
            <RelatedToolsSection currentSlug={post.tool || '/pdf/compress'} />
          </div>

          {/* Sticky Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20 self-start">
            {/* Popular Tools Quick Navigation Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-sm border-b border-slate-100 pb-3">
                <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
                <span>Explore Popular File Tools</span>
              </div>
              <ul className="space-y-2.5 text-xs font-bold text-slate-700">
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

            {/* Sidebar Banner Ad Unit */}
            <div className="w-full">
              <AdSlot slotType="sticky-sidebar" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
