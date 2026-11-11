/**
 * FileZenith — AdSense revenue projection model.
 *
 * Answers: "What can I expect to earn year by year over 5.5 years?"
 *
 * Run with:  node scripts/revenue-model.mjs
 *
 * METHOD
 * ------
 * 1. Traffic: logistic S-curve (accelerates, then flattens as the domain
 *    matures) rather than naive compounding, which badly overstates growth.
 *      pv(t) = K / (1 + exp(-a * (t - t0)))
 *    Three trajectories: pessimistic / realistic / optimistic.
 *
 * 2. Revenue: pageviews -> clicks -> Rs, then NET of Google's 32% cut.
 *      clicks = pv * CTR(niche)
 *      gross  = clicks * CPC(niche)
 *      net    = gross * 0.68
 *
 * 3. Scenarios compared:
 *      BASELINE - the 145 pages live today
 *      EXPANDED - plus the 578 researched keyword pages (~350 total)
 *      TIER-1   - current site with 15% US/UK traffic (PDF/image tools
 *                 have global appeal; this is the biggest single lever)
 *
 * SOURCES
 * -------
 *  - AdSense publisher revenue share 68%
 *      https://support.google.com/adsense/answer/180195
 *  - India CTR / CPC by niche (Oct 2026)
 *      https://www.fincalcbharat.com/calculators/adsense-revenue-calculator
 *        Finance/Insurance : 1.2% CTR, Rs 45 CPC
 *        Education/Jobs    : 1.1% CTR, Rs 20 CPC
 *        Technology        : 0.8% CTR, Rs 25 CPC
 *      Utility/PDF tool and Lifestyle/Creative rates are set lower than the
 *      published niches because these queries have weaker commercial intent.
 *
 * EVERY ASSUMPTION IS IN ONE PLACE BELOW — edit and re-run.
 */

const REVENUE_SHARE = 0.68; // Google keeps 32%
const MONTHS = 66; // 5.5 years
const USD_RATE = 83; // INR -> USD

// ---------------------------------------------------------------------------
// NICHE ECONOMICS  (India, 2026 benchmarks)
// ---------------------------------------------------------------------------
const NICHES = {
  finance: { ctr: 0.012, cpc: 45 },
  education: { ctr: 0.011, cpc: 20 },
  technology: { ctr: 0.008, cpc: 25 },
  utility: { ctr: 0.008, cpc: 12 },
  lifestyle: { ctr: 0.006, cpc: 10 },
  tier1: { ctr: 0.009, cpc: 75 }, // US/UK traffic
};

// ---------------------------------------------------------------------------
// LIVE INVENTORY  (145 indexable pages, 22 ad slots)
// ---------------------------------------------------------------------------
const INVENTORY = [
  { tier: 'A. Financial calculators', niche: 'finance', pages: 12, share: 0.06,
    note: 'EMI, SIP, step-up SIP, bike EMI, tax, salary, EPF, GST, CGPA, age' },
  { tier: 'B. Exam / govt photo resizers', niche: 'education', pages: 23, share: 0.34,
    note: 'SSC, UPSC, NEET, IBPS, RRB, PAN, Aadhaar, passport, visa' },
  { tier: 'C. PDF utilities', niche: 'utility', pages: 42, share: 0.38,
    note: 'Compress, merge, split, edit, OCR, protect, watermark' },
  { tier: 'D. Image utilities', niche: 'utility', pages: 30, share: 0.16,
    note: 'Resize, compress, crop, convert, background removal' },
  { tier: 'E. Creative / printable / blog', niche: 'lifestyle', pages: 38, share: 0.06,
    note: 'Habit tracker, greeting cards, polaroid, blog guides, hubs' },
];

// ---------------------------------------------------------------------------
// TRAJECTORIES  (K = carrying capacity, a = growth rate, t0 = inflection)
// ---------------------------------------------------------------------------
const TRAJECTORIES = {
  pessimistic: { label: 'Pessimistic (slow approval, weak ranks)', K: 120000, a: 0.055, t0: 30 },
  realistic: { label: 'Realistic (approved, steady content output)', K: 900000, a: 0.075, t0: 26 },
  optimistic: { label: 'Optimistic (one tool goes viral + strong SEO)', K: 3200000, a: 0.095, t0: 22 },
};

// ---------------------------------------------------------------------------
const pvAt = (traj, month) =>
  traj.K / (1 + Math.exp(-traj.a * (month - traj.t0)));

function revenueForTier(pv, niche) {
  const n = NICHES[niche];
  const gross = pv * n.ctr * n.cpc;
  return { gross, net: gross * REVENUE_SHARE };
}

function project(traj, inventory, tier1Share = 0) {
  const yearly = [];
  let total = 0;

  for (let m = 1; m <= MONTHS; m++) {
    const pv = pvAt(traj, m);
    const year = Math.ceil(m / 12);

    const tier1Pv = pv * tier1Share;
    const domesticPv = pv * (1 - tier1Share);

    let gross = 0;
    for (const item of inventory) {
      gross += revenueForTier(domesticPv * item.share, item.niche).gross;
    }
    if (tier1Share > 0) {
      for (const item of inventory) {
        gross += revenueForTier(tier1Pv * item.share, 'tier1').gross;
      }
    }

    const net = gross * REVENUE_SHARE;
    total += net;

    const row = yearly.find((r) => r.year === year);
    if (row) {
      row.revenue += net;
      row.pvEnd = pv;
    } else {
      yearly.push({ year, revenue: net, pvEnd: pv });
    }
  }

  return { traj, yearly, total };
}

function buildExpandedInventory() {
  const inv = INVENTORY.map((i) => ({ ...i }));
  const added = [
    { tier: 'F. New exam-specific pages (Part 4)', niche: 'education', pages: 115, share: 0.15 },
    { tier: 'G. New financial calculators (Part 1)', niche: 'finance', pages: 40, share: 0.06 },
    { tier: 'H. New dev + image + template tools', niche: 'technology', pages: 165, share: 0.10 },
  ];
  const giveUp = 0.18;
  const sum = inv.reduce((s, i) => s + i.share, 0);
  for (const i of inv) i.share -= (i.share / sum) * giveUp;
  inv.push(...added);
  return inv;
}

const rs = (n) =>
  n >= 10000000 ? 'Rs ' + (n / 10000000).toFixed(2) + ' Cr'
  : n >= 100000 ? 'Rs ' + (n / 100000).toFixed(2) + ' L'
  : n >= 1000 ? 'Rs ' + (n / 1000).toFixed(1) + 'K'
  : 'Rs ' + Math.round(n);
const usd = (n) => '$' + (n / USD_RATE).toFixed(0);

function table(title, r) {
  console.log();
  console.log('='.repeat(76));
  console.log(title);
  console.log('='.repeat(76));
  console.log(`  ${r.traj.label}`);
  console.log();
  console.log('  Yr | Pageviews/mo | AdSense NET (Rs) |    ~USD  | MoM (Rs)');
  console.log('  ---+--------------+------------------+----------+---------');
  for (const row of r.yearly) {
    const months = row.year <= 5 ? 12 : 6;
    console.log(
      `  ${String(row.year).padStart(2)} |${String(Math.round(row.pvEnd).toLocaleString('en-IN')).padStart(13)} |${rs(
        row.revenue,
      ).padStart(16)} |${usd(row.revenue).padStart(9)} |${rs(row.revenue / months).padStart(8)}`,
    );
  }
  console.log('  ---+--------------+------------------+----------+---------');
  console.log(`  5.5-YEAR TOTAL: ${rs(r.total)}  (${usd(r.total)})`);
  return r;
}

// ---------------------------------------------------------------------------
console.log('#'.repeat(76));
console.log('#        FILEZENITH — 5.5-YEAR ADSENSE REVENUE PROJECTION');
console.log('#   145 live pages | 22 ad slots | India benchmarks | 68% rev share');
console.log('#'.repeat(76));

console.log();
console.log('LIVE INVENTORY BY TIER');
console.log('-'.repeat(76));
for (const i of INVENTORY) {
  const n = NICHES[i.niche];
  console.log(`  ${i.tier}`);
  console.log(`     ${i.pages} pages | CTR ${(n.ctr * 100).toFixed(1)}% | CPC Rs${n.cpc} | ${(i.share * 100).toFixed(0)}% of PV`);
  console.log(`     ${i.note}`);
}

const results = {};
for (const [key, traj] of Object.entries(TRAJECTORIES)) {
  results[key] = {
    base: table(`BASELINE — CURRENT SITE (145 pages) — ${key.toUpperCase()}`, project(traj, INVENTORY)),
    exp: table(
      `EXPANDED — +578 researched pages (~350 total) — ${key.toUpperCase()}`,
      project(traj, buildExpandedInventory()),
    ),
  };
}

console.log();
console.log('#'.repeat(76));
console.log('#   UPSIDE: 15% TIER-1 (US/UK) TRAFFIC — realistic for PDF/image tools');
console.log('#'.repeat(76));
const t1 = {};
for (const [key, traj] of Object.entries(TRAJECTORIES)) {
  t1[key] = table(
    `TIER-1 MIX — CURRENT SITE + 15% US/UK — ${key.toUpperCase()}`,
    project(traj, INVENTORY, 0.15),
  );
}

console.log();
console.log('#'.repeat(76));
console.log('#                            THE GAP');
console.log('#'.repeat(76));
console.log();
console.log('  Scenario   | Baseline 5.5y | Expanded 5.5y |    Gap    | Gap/mo in Yr 5');
console.log('  ------------+--------------+--------------+-----------+--------------');
for (const key of Object.keys(TRAJECTORIES)) {
  const b = results[key].base;
  const e = results[key].exp;
  const gapY5 = e.yearly[4].revenue - b.yearly[4].revenue;
  console.log(
    `  ${key.padEnd(11)} |${rs(b.total).padStart(12)} |${rs(e.total).padStart(12)} |${rs(e.total - b.total).padStart(9)} |${rs(
      gapY5 / 12,
    ).padStart(12)}`,
  );
}
console.log();
console.log('  Tier-1 upside (15% US/UK on CURRENT site):');
for (const key of Object.keys(TRAJECTORIES)) {
  console.log(
    `  ${key.padEnd(11)} |${rs(results[key].base.total).padStart(12)} -> ${rs(t1[key].total).padStart(12)}  (${usd(
      t1[key].total - results[key].base.total,
    )} extra over 5.5y)`,
  );
}

console.log();
console.log('-'.repeat(76));
console.log('  Assumptions: approval in months 1-3; steady content output; no');
console.log('  brand-search volume; no link-building budget; no email list.');
console.log('  All figures NET of the 32% Google cut. USD at Rs 83.');
console.log('-'.repeat(76));
