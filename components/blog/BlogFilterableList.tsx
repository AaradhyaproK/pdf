'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';
import { Calendar, Clock, ArrowRight, BookOpen, FileText, Calculator, Layers, Sparkles } from 'lucide-react';
import { AdSlot } from '@/components/AdSlot';

interface BlogFilterableListProps {
  initialPosts: BlogPost[];
}

type CategoryType = 'all' | 'guides' | 'pdf' | 'calculators';

export function BlogFilterableList({ initialPosts }: BlogFilterableListProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');

  // Categorize counts
  const counts = useMemo(() => {
    let guides = 0;
    let pdf = 0;
    let calculators = 0;

    initialPosts.forEach((post) => {
      const lowerTags = post.tags.map((t) => t.toLowerCase());
      if (lowerTags.includes('guides') || lowerTags.includes('guide')) guides++;
      if (lowerTags.includes('pdf')) pdf++;
      if (lowerTags.includes('calculator') || lowerTags.includes('finance') || lowerTags.includes('emi') || lowerTags.includes('age')) calculators++;
    });

    return {
      all: initialPosts.length,
      guides,
      pdf,
      calculators,
    };
  }, [initialPosts]);

  // Filtered posts based on active category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return initialPosts;

    return initialPosts.filter((post) => {
      const lowerTags = post.tags.map((t) => t.toLowerCase());
      if (selectedCategory === 'guides') {
        return lowerTags.includes('guides') || lowerTags.includes('guide');
      }
      if (selectedCategory === 'pdf') {
        return lowerTags.includes('pdf');
      }
      if (selectedCategory === 'calculators') {
        return lowerTags.includes('calculator') || lowerTags.includes('finance') || lowerTags.includes('emi') || lowerTags.includes('age');
      }
      return true;
    });
  }, [initialPosts, selectedCategory]);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <div className="space-y-8">
      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Articles</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory('guides')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
            selectedCategory === 'guides'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guides & Exam Specs</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            selectedCategory === 'guides' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {counts.guides}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory('pdf')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
            selectedCategory === 'pdf'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>PDF Tutorials</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            selectedCategory === 'pdf' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {counts.pdf}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory('calculators')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
            selectedCategory === 'calculators'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Calculators & Finance</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            selectedCategory === 'calculators' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {counts.calculators}
          </span>
        </button>
      </div>

      {/* Featured Article Card */}
      {featuredPost && (
        <section className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
            {/* Cover Image */}
            <div className="lg:col-span-6 relative min-h-[240px] sm:min-h-[320px] bg-slate-100">
              <img
                src={featuredPost.image || '/blog/exam-guide.jpg'}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>

            {/* Text Body */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                  <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-black uppercase text-[10px] tracking-wider">
                    {featuredPost.tags.includes('Guides') ? 'Featured Guide' : 'Featured Article'}
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

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
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
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2"
                >
                  <span>Read Guide</span>
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

      {/* Grid of Remaining Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {remainingPosts.map((post) => (
          <article
            key={post.slug}
            className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-indigo-500 transition-all group"
          >
            {/* Card Cover Image */}
            <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
              <img
                src={post.image || '/blog/exam-guide.jpg'}
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

                <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
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
                  <span>Read Guide</span>
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
  );
}
