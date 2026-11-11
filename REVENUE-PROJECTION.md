# FileZenith — 5.5-Year Revenue Projection

Generated from your **actual** site inventory (145 indexable pages, 22 ad slots)
using published India AdSense benchmarks.

**Run it yourself:** `npm run revenue:model`
Every assumption lives at the top of `scripts/revenue-model.mjs` — edit and re-run.

---

## The short answer

| Scenario | Baseline 5.5y | Expanded (+578 pages) | Gap |
|---|---|---|---|
| **Pessimistic** | Rs 4.71 L (~$5,679) | Rs 6.34 L (~$7,639) | Rs 1.63 L |
| **Realistic** | **Rs 39.11 L (~$47,115)** | **Rs 52.60 L (~$63,374)** | **Rs 13.49 L** |
| **Optimistic** | Rs 1.53 Cr (~$184,922) | Rs 2.06 Cr (~$248,736) | Rs 52.97 L |

Plus: **15% US/UK traffic** adds another **$22,264** (realistic) on the *current* site alone.

---

## Year-by-year (Realistic scenario, current site)

| Year | Pageviews/mo | AdSense net (Rs) | ~USD | MoM (Rs) |
|---|---|---|---|---|
| 1 | 2,33,303 | 2,28,000 | $2,752 | 19,000 |
| 2 | 4,16,313 | 4,36,000 | $5,253 | 36,300 |
| 3 | 6,11,261 | 6,95,000 | $8,379 | 58,000 |
| 4 | 7,55,002 | 9,22,000 | $11,109 | 76,800 |
| 5 | 8,34,816 | 10,65,000 | $12,837 | 88,800 |
| 6 (6 mo) | 8,57,317 | 5,63,000 | $6,785 | 93,900 |

---

## Where the money comes from

Your traffic is **not** where your money is. The tiers earn very differently:

| Tier | Pages | CTR | CPC | Share of PV |
|---|---|---|---|---|
| **A. Financial calculators** | 12 | 1.2% | **Rs 45** | 6% |
| **B. Exam / govt photo resizers** | 23 | 1.1% | Rs 20 | 34% |
| **C. PDF utilities** | 42 | 0.8% | Rs 12 | 38% |
| **D. Image utilities** | 30 | 0.8% | Rs 12 | 16% |
| **E. Creative / printable / blog** | 38 | 0.6% | Rs 10 | 6% |

**12 financial pages earn the same as 42 PDF pages** — because finance CPC (Rs 45) is ~4× utility CPC (Rs 12).

This is the single most important insight in this document: **every financial calculator you add is worth ~4 PDF tools.**

---

## Methodology

**Traffic** — logistic S-curve, not naive compounding:
```
pv(t) = K / (1 + e^(-a(t - t0)))
```
Naive compounding badly overstates growth (it never plateaus). Three scenarios differ in carrying capacity and inflection point.

**Revenue** — `pv × CTR → clicks × CPC → gross → × 0.68 net`
Google's revenue share is 68% (publishers keep 68%, Google takes 32%).

**Sources**
- Revenue share: [Google AdSense Help](https://support.google.com/adsense/answer/180195)
- India CTR/CPC by niche: [FinCalc Bharat, Oct 2026](https://www.fincalcbharat.com/calculators/adsense-revenue-calculator)

---

## What this does NOT include

- ❌ No brand-search volume (your brand won't be searched on day 1)
- ❌ No link-building budget or guest-posting
- ❌ No email list / push notifications
- ❌ No YouTube / social distribution
- ❌ No AdSense "Auto ads" extra placements beyond your 22 slots
- ❌ Assumes approval lands months 1–3 (if review takes 6+ months, shift everything right)

**Add any of these and the numbers move up materially.**

---

## The three levers, ranked

### 1. 🚀 Get Tier-1 traffic (biggest single lever)
PDF and image tools have **global** appeal — a US student compressing a PDF doesn't care that your site is Indian. At 15% US/UK traffic, CPC goes from Rs 12 → Rs 75 on the same pages.
- **+Rs 18.47 L** (realistic, 5.5y) — bigger than the entire content-expansion programme
- How: English-first content, `hreflang`/locale pages, target "compress pdf" not "compress pdf online india"

### 2. 💰 Build financial calculators (best ROI per page)
CPC Rs 45 vs Rs 12. Your 12 financial pages currently get only **6% of your traffic** — they should get more.
- Your keyword sheet has **40** new financial calculator ideas (Part 1)
- Each one ≈ 4× the value of a PDF tool

### 3. 📄 Expand the exam/preset cluster (Part 4)
115 exam-specific pages, KD typically 0–8, high intent. This is the **Rs 13.49 L gap** in the realistic scenario.
- Lowest risk: each is a thin wrapper over your existing preset engine
- Must include real unique content (the rule in the keyword sheet)

---

## Honest caveats

1. **This is a model, not a forecast.** It uses published *average* benchmarks. Your actual RPM depends on ad density, ad type, seasonality, and your exact audience.
2. **The realistic scenario assumes approval works.** Right now you're not approved — that's month 0–3 of zero revenue.
3. **Page RPM, not site RPM, matters.** A $5 page earning $0.20 RPM needs 100× the traffic of a $2 page at $20 RPM.
4. **RPMs rise as you scale** — bigger publishers get better placements, so these numbers are if anything conservative at the top end.
5. **Don't chase traffic; chase intent.** 6% of traffic on Rs 45 CPC pages beats 60% on Rs 10 pages.

---

## Re-running with your own assumptions

```bash
npm run revenue:model
```

Edit in `scripts/revenue-model.mjs`:
- `NICHES` — CTR/CPC per tier
- `TRAJECTORIES` — K (capacity), a (growth), t0 (inflection)
- `INVENTORY` — page counts and traffic share per tier
- `REVENUE_SHARE` — 0.68 default
