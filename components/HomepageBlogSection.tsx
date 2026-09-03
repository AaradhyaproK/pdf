import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { BookOpen, ArrowRight, Calendar, Clock, Sparkles } from 'lucide-react';

export function HomepageBlogSection() {
  const posts = getAllPosts().slice(0, 3); // Get latest 3 blog posts for homepage showcase

  if (posts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-8">
        {/* Header Section Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>FileZenith Knowledge Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Latest PDF, Image & Privacy Guides
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl">
              Learn practical tips on compressing documents, merging files, calculating loan EMIs, and privacy-first browser tools.
            </p>
          </div>

          <Link
            href="/blog"
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 group active:scale-95"
          >
            <span>View All Guides & Blog Posts</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3-Column Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-slate-50/70 border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col justify-between hover:bg-white hover:border-indigo-500 hover:shadow-md transition-all group"
            >
              {/* Cover Image */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img
                  src={post.image || '/blog/pdf-compression.jpg'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-slate-500">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1 text-indigo-600 font-extrabold">
                      <Clock className="w-3 h-3" />
                      {post.readingTime}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-extrabold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {post.tags.length > 0 && (
                    <span className="text-[10px] font-extrabold uppercase bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {post.tags[0]}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
