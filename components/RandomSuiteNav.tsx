'use client';

import Link from 'next/link';
import { Dices, Coins, Hash, Disc, Sparkles } from 'lucide-react';

interface RandomSuiteNavProps {
  currentSlug: string;
}

const SUITE_TOOLS = [
  {
    name: 'Spin the Wheel',
    slug: '/utility/spin-the-wheel',
    icon: Disc,
    badge: 'Wheel',
    color: 'from-purple-500 to-indigo-600',
    activeBorder: 'border-indigo-500 text-indigo-700 bg-indigo-50/80 shadow-xs',
  },
  {
    name: 'Coin Flip',
    slug: '/utility/coin-flip',
    icon: Coins,
    badge: '3D Toss',
    color: 'from-amber-500 to-yellow-600',
    activeBorder: 'border-amber-500 text-amber-800 bg-amber-50/80 shadow-xs',
  },
  {
    name: 'Roll the Dice',
    slug: '/utility/dice-roller',
    icon: Dices,
    badge: '1-12 Dice',
    color: 'from-rose-500 to-red-600',
    activeBorder: 'border-rose-500 text-rose-700 bg-rose-50/80 shadow-xs',
  },
  {
    name: 'Random Number',
    slug: '/utility/random-number-picker',
    icon: Hash,
    badge: 'Picker',
    color: 'from-emerald-500 to-teal-600',
    activeBorder: 'border-emerald-500 text-emerald-700 bg-emerald-50/80 shadow-xs',
  },
];

export function RandomSuiteNav({ currentSlug }: RandomSuiteNavProps) {
  return (
    <div className="w-full mb-4 sm:mb-6">
      <div className="flex items-center justify-between gap-2 px-1 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Random Chance & Decision Suite</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">
          100% Free • Client-Side • Truly Random
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory">
        {SUITE_TOOLS.map((tool) => {
          const isActive = currentSlug === tool.slug || (tool.slug === '/utility/dice-roller' && currentSlug === '/utility/roll-the-dice');
          const Icon = tool.icon;

          return (
            <Link
              key={tool.slug}
              href={tool.slug}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all duration-200 shrink-0 snap-start text-xs font-bold ${
                isActive
                  ? `${tool.activeBorder} font-black ring-2 ring-indigo-500/20`
                  : 'bg-white/90 hover:bg-slate-50 border-slate-200/90 text-slate-600 hover:text-slate-900 shadow-2xs'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl ${
                  isActive ? 'bg-white shadow-2xs text-indigo-600' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="whitespace-nowrap">{tool.name}</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-md uppercase font-extrabold tracking-wider ${
                  isActive
                    ? 'bg-white/80 text-slate-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tool.badge}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
