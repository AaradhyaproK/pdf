'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageview, trackVisitorHeartbeat } from '@/lib/admin-store';
import { trackVisitorEventAsync } from '@/lib/visitor-tracker';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (pathname && lastTrackedPath.current !== pathname) {
      lastTrackedPath.current = pathname;

      // 1. Sync to local analytics store
      trackPageview(pathname);
      trackVisitorHeartbeat(pathname);

      // 2. Dispatch non-blocking Firebase visitor analytics payload
      trackVisitorEventAsync(pathname);
    }
  }, [pathname]);

  return null;
}

