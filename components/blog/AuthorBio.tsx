import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, CheckCircle2, UserCheck } from 'lucide-react';
import type { BlogPost } from '@/lib/blog';

interface AuthorBioProps {
  post: BlogPost;
}

export function AuthorBio({ post }: AuthorBioProps) {
  const rawPublished = (post as unknown as { datePublished?: string; publishedAt?: string }).datePublished ||
    (post as unknown as { publishedAt?: string }).publishedAt ||
    post.date;
  const rawModified = (post as unknown as { dateModified?: string; updatedAt?: string }).dateModified ||
    (post as unknown as { updatedAt?: string }).updatedAt ||
    post.date;

  const pubDateObj = new Date(rawPublished);
  const formattedPublished = !isNaN(pubDateObj.getTime())
    ? pubDateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : rawPublished;

  const modDateObj = new Date(rawModified);
  const formattedUpdated = !isNaN(modDateObj.getTime())
    ? modDateObj.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : rawModified;

  const readingTime = post.readingTime || (post as unknown as { readTime?: string }).readTime || '5 min read';

  return (
    <div className="flex flex-col gap-3 pt-4 pb-6 border-b border-slate-100 text-xs text-slate-600">
      {/* 1. Author line with avatar, link to /about, and credential badge */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200/80 flex items-center justify-center p-1.5 shadow-2xs shrink-0">
          <Image
            src="/filezenith-logo.png"
            alt="Aaradhya Pathak - FileZenith"
            width={28}
            height={28}
            className="h-6 w-6 sm:h-7 sm:w-7 object-contain"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 font-medium">By</span>
          <Link
            href="/about"
            className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
          >
            Aaradhya Pathak
          </Link>
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-200 shadow-2xs">
            <UserCheck className="h-3 w-3 text-indigo-600" />
            Full-Stack Developer &amp; Digital Tools Creator
          </span>
        </div>
      </div>

      {/* 2. Metadata line: Published · Updated · Read Time */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs text-slate-500 pl-0 sm:pl-14">
        <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>Published: {formattedPublished}</span>
        </span>

        <span className="text-slate-300">·</span>

        <span className="inline-flex items-center gap-1 font-medium text-slate-600">
          <span>Updated: {formattedUpdated}</span>
        </span>

        <span className="text-slate-300">·</span>

        <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
          <Clock className="h-3.5 w-3.5 text-indigo-600" />
          <span>{readingTime}</span>
        </span>
      </div>
    </div>
  );
}
