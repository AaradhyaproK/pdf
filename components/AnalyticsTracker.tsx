'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageview, trackVisitorHeartbeat } from '@/lib/admin-store';

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      trackPageview(pathname);
      trackVisitorHeartbeat(pathname);
    }
  }, [pathname]);

  return null;
}
