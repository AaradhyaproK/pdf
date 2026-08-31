'use client';

import Link from 'next/link';
import { ALL_TOOLS, ToolItem } from './LandingToolGrid';
import { ArrowRight } from 'lucide-react';

interface RelatedToolsSectionProps {
  currentSlug: string;
}

export function RelatedToolsSection({ currentSlug }: RelatedToolsSectionProps) {
  // Find current tool to know its category
  const currentTool = ALL_TOOLS.find((t) => t.slug === currentSlug);
  const category = currentTool?.category || 'pdf';

  // Get related tools matching category, excluding current slug
  const categoryTools = ALL_TOOLS.filter((t) => t.slug !== currentSlug && t.category === category);
  const otherTools = ALL_TOOLS.filter((t) => t.slug !== currentSlug && t.category !== category);

  // Exactly 3 recommended tools
  const relatedTools: ToolItem[] = [...categoryTools, ...otherTools].slice(0, 3);

  return (
    <div className="w-full my-6 space-y-4">
      {/* Header Container */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div>
          <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
            Explore Related FileZenith Tools
          </h3>
        </div>

        {/* View All Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-black text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-rose-200/80 transition-all duration-200 active:scale-95 shrink-0 shadow-2xs"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3 Recommended Tools - Single Row Grid on Desktop, Smooth Horizontal Snap Scroll on Mobile */}
      <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scrollbar-none pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
        {relatedTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              href={tool.slug}
              className="w-[82%] sm:w-auto shrink-0 sm:shrink snap-start p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-rose-400/60 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-2 rounded-xl border transition-colors shrink-0 ${tool.iconBgClass}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  {tool.badge && (
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${tool.badgeStyle}`}>
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className={`text-xs sm:text-sm font-black text-slate-900 transition-colors truncate ${tool.hoverTitleClass}`}>
                    {tool.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-rose-600 transition-colors">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
