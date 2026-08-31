import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
  doc,
  setDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      visitorId,
      sessionToken,
      isFirstEverVisit,
      isNewDailyUnique,
      isNewSession,
      pagePath,
      deviceType,
      isBot,
    } = body;

    // 1. Bot check
    if (isBot) {
      return NextResponse.json({ success: true, message: 'Bot ignored' });
    }

    if (!visitorId || typeof visitorId !== 'string') {
      return NextResponse.json({ error: 'Invalid visitor ID' }, { status: 400 });
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const monthStr = dateStr.substring(0, 7); // YYYY-MM

    // 2. Atomic Increments for Aggregate Collections
    const incPageviews = increment(1);
    const incUnique = isFirstEverVisit ? increment(1) : increment(0);
    const incDailyUnique = isNewDailyUnique ? increment(1) : increment(0);
    const incVisits = isNewSession ? increment(1) : increment(0);

    // a. All-Time Aggregate Summary
    const summaryRef = doc(db, 'analytics_summary', 'visitors');
    const summaryPromise = setDoc(
      summaryRef,
      {
        totalPageviews: incPageviews,
        totalUniqueVisitors: incUnique,
        totalVisits: incVisits,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );

    // b. Today's Daily Stats
    const dailyRef = doc(db, 'daily_stats', dateStr);
    const dailyPromise = setDoc(
      dailyRef,
      {
        date: dateStr,
        todayPageviews: incPageviews,
        todayUniqueVisitors: incDailyUnique,
        todayVisits: incVisits,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );

    // c. Monthly Stats
    const monthlyRef = doc(db, 'monthly_stats', monthStr);
    const monthlyPromise = setDoc(
      monthlyRef,
      {
        month: monthStr,
        monthPageviews: incPageviews,
        monthUniqueVisitors: incDailyUnique,
        monthVisits: incVisits,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );

    // d. Live Active Visitor Heartbeat (for admin live stream)
    const liveRef = doc(db, 'live_visitors', visitorId);
    const livePromise = setDoc(
      liveRef,
      {
        visitorId,
        sessionToken,
        activePage: pagePath || '/',
        device: deviceType || 'desktop',
        lastActive: now.toISOString(),
        timestamp: serverTimestamp(),
      },
      { merge: true }
    );

    await Promise.all([summaryPromise, dailyPromise, monthlyPromise, livePromise]);

    return NextResponse.json({
      success: true,
      counted: {
        unique: isFirstEverVisit,
        dailyUnique: isNewDailyUnique,
        session: isNewSession,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Analytics tracking failed' }, { status: 500 });
  }
}
