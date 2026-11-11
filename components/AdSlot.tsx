'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ADSENSE_AD_LABEL,
  ADSENSE_PUBLISHER_ID,
  ADSENSE_SLOT_IDS,
  ADSENSE_SLOT_MAX_WIDTH,
  ADSENSE_SLOT_RESERVED_HEIGHT,
  type AdSlotType,
} from '@/lib/ads-config';

export interface AdSlotProps {
  slotType: AdSlotType;
  /**
   * Optional explicit ad unit id. When omitted the id configured for
   * `slotType` in `lib/ads-config.ts` is used.
   */
  clientAdId?: string;
  className?: string;
  /** Set to false to suppress the visible "Advertisement" label. */
  showLabel?: boolean;
}

type AdStatus = 'loading' | 'filled' | 'unfilled';

const STATUS_ATTRIBUTE = 'data-ad-status';

/**
 * Renders a single Google AdSense display unit.
 *
 * Key behaviours:
 *  - The space is RESERVED up-front (min-height) so the ad never shifts
 *    surrounding content when it finishes loading (CLS stays at 0).
 *  - A neutral "Advertisement" label is rendered above the unit so the ad is
 *    clearly distinguishable from site content, as Google requires.
 *  - If the unit reports `unfilled` the reserved space collapses, so users
 *    never see an empty grey box.
 *  - Nothing is rendered at all when no ad unit id is configured, which avoids
 *    shipping empty ad units.
 *
 * Placement is fully deterministic (driven by build-time environment
 * variables) so every visitor sees an identical layout. A placement can be
 * switched off simply by leaving its slot id unset.
 */
export function AdSlot({ slotType, clientAdId, className = '', showLabel = true }: AdSlotProps) {
  const adUnitId = (clientAdId ?? ADSENSE_SLOT_IDS[slotType] ?? '').trim();
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<AdStatus>('loading');

  const hasAdUnit = Boolean(adUnitId);
  const reservedHeight = ADSENSE_SLOT_RESERVED_HEIGHT[slotType];
  const maxWidth = ADSENSE_SLOT_MAX_WIDTH[slotType];

  useEffect(() => {
    if (!hasAdUnit) return;

    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    const readStatus = () => {
      if (cancelled) return;
      const ins = container.querySelector<HTMLElement>('ins.adsbygoogle');
      const raw = ins?.getAttribute(STATUS_ATTRIBUTE);
      if (raw === 'filled') {
        setStatus('filled');
      } else if (raw === 'unfilled') {
        setStatus('unfilled');
      }
    };

    // Ask Google to fill the unit. The adsbygoogle.js script itself may not
    // have executed yet — pushing onto the queue is the documented way to
    // handle that, the script drains the queue once it loads.
    try {
      const w = window as Window & { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      /* queueing failed — the unit simply stays unrendered */
    }

    readStatus();

    const observer = new MutationObserver(readStatus);
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [STATUS_ATTRIBUTE, 'style'],
    });

    // Safety net: some browsers only apply `data-ad-status` late.
    const timer = window.setTimeout(readStatus, 2000);
    const retry = window.setInterval(readStatus, 1500);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(timer);
      window.clearInterval(retry);
    };
  }, [hasAdUnit, adUnitId]);

  // No ad unit configured for this slot -> render nothing at all.
  if (!hasAdUnit) return null;

  const collapsed = status === 'unfilled';

  return (
    <div
      ref={containerRef}
      className={`w-full mx-auto flex flex-col items-center ${className}`}
      style={{ maxWidth: `${maxWidth}px` }}
    >
      {showLabel && (
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 select-none">
          {ADSENSE_AD_LABEL}
        </span>
      )}
      <div
        className="w-full overflow-hidden transition-[min-height] duration-200"
        style={{ minHeight: collapsed ? 0 : `${reservedHeight}px` }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: collapsed ? 0 : `${reservedHeight}px` }}
          data-ad-client={ADSENSE_PUBLISHER_ID}
          data-ad-slot={adUnitId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
