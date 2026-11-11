import type { ToolDeepDive } from './tool-deep-dives';

/**
 * Deep-dive editorial content for the two new financial calculators.
 *
 * Kept in a separate file so `lib/tool-deep-dives.ts` stays readable. These
 * entries give the pages genuinely unique long-form content, which is what
 * separates a real tool page from a thin doorway page.
 */
export const FINANCIAL_TOOL_DEEP_DIVES: Record<string, ToolDeepDive> = {
  '/utility/bike-emi-calculator': {
    slug: '/utility/bike-emi-calculator',
    badge: 'Two-Wheeler Finance Engine',
    heading: 'In-Depth Guide: Two-Wheeler Bike Loan EMI, On-Road Pricing & Interest',
    subheading:
      'A complete manual on how Indian bike finance actually works — from on-road price and down payment to reducing-balance interest, dealer margins, and the real cost of a longer tenure.',
    sections: [
      {
        title: '1. Why a Bike Loan Is Sanctioned on the On-Road Price',
        paragraphs: [
          'When you walk into a two-wheeler showroom, the price on the board is the ex-showroom price. The amount you actually pay is higher, because it also carries registration and permit charges (RTO), insurance (often a bundled 3-year policy), fast-track or number-plate fees, and in some cases accessories like a top box, crash guard, or seat cover. This combined figure is the on-road price, and it is the number a dealer quotes and a lender finances.',
          'A conventional EMI calculator starts from a single "loan amount" field, which forces you to manually subtract the down payment yourself and leaves you guessing whether RTO and insurance are inside or outside the financed figure. Bike Loan EMI Calculator starts from the on-road price and applies the down payment for you, so the instalment it returns is the one a dealer will actually present on the sanction letter.',
        ],
        bullets: [
          'Ex-showroom price — the base price of the model variant',
          'RTO / registration and permit charges — often ₹5,000 to ₹15,000',
          'Insurance — frequently bundled for 3 years by the dealer',
          'Accessories — crash guard, top box, seat cover, number plate',
        ],
      },
      {
        title: '2. The Down Payment: Your First Cash Outflow',
        paragraphs: [
          'The down payment is the single largest cash component of buying a two-wheeler, and it is the reason a bike loan instalment is usually much lower than the price of the bike itself. Most dealers in India ask for 15% to 25% of the on-road price upfront, though several lenders offer zero-down-payment schemes for customers with a strong credit profile or a higher interest rate.',
          'What many buyers miss is that the down payment is not really "down" in the sense of reducing the cost of the loan. It reduces the principal, and because interest is charged on the reducing balance, a larger down payment lowers not only the EMI but the total interest for the entire tenure. On a ₹1,50,000 bike financed over 48 months at 11.5%, moving the down payment from 20% to 30% cuts the monthly instalment from ₹3,131 to ₹2,739 and saves ₹3,816 in total interest.',
          'A zero-down-payment loan is not free. It simply finances the entire on-road price, so the same amount of interest is charged on a larger principal for the same number of months, and the total outflow ends up considerably higher.',
        ],
        table: {
          headers: ['Down Payment', 'Amount Financed', 'Monthly EMI (48 mo, 11.5%)', 'Total Interest'],
          rows: [
            ['10% (₹15,000)', '₹1,35,000', '₹3,522', '₹34,056'],
            ['20% (₹30,000)', '₹1,20,000', '₹3,131', '₹30,288'],
            ['30% (₹45,000)', '₹1,05,000', '₹2,739', '₹26,472'],
            ['0% (₹0)', '₹1,50,000', '₹3,913', '₹37,824'],
          ],
        },
      },
      {
        title: '3. Interest Rates and How Lenders Price Two-Wheeler Loans',
        paragraphs: [
          'Two-wheeler loans carry materially higher interest rates than secured home loans because the collateral is a depreciating asset with a shorter economic life, and because the ticket sizes are small enough that underwriting costs per borrower are proportionally higher. Typical sanctioned rates in India sit between 9% and 14% per annum, with the exact figure depending on the lender, the segment, the borrower credit score, and whether the vehicle is a combustion model or a newer electric one.',
          'Electric two-wheelers have become a meaningful exception. Because the battery pack is the most expensive component and the most failure-prone, several lenders either price EVs higher or exclude the battery from the financed value. Checking the actual financed amount on your sanction letter — rather than assuming it matches the invoice total — is worth doing before you sign.',
        ],
        bullets: [
          '9% to 11% — competitive, usually with strong credit or a newer EV model',
          '11% to 13% — the most common retail band for new two-wheelers',
          '13% to 14%+ — used vehicles, weaker credit profiles, or older models',
          'Always confirm the rate is a reducing rate and not a flat rate',
        ],
      },
      {
        title: '4. Tenure: The Trade-Off That Costs the Most',
        paragraphs: [
          'Extending the tenure from 36 to 60 months reduces the monthly instalment by roughly a third, which is what makes a higher-priced bike feel affordable. The cost of that flexibility is interest charged on a larger balance for longer. On a ₹1,20,000 loan at 11.5%, interest is about 19% of everything you pay over 36 months, but it rises to roughly 32% over 60 months.',
          'This is the single largest lever most borrowers get wrong. If your monthly budget genuinely cannot absorb a shorter tenure, taking the longer one is a legitimate choice — but you should enter it knowingly, with the total interest figure in front of you, rather than being surprised by the final figure at the end of the loan.',
        ],
        table: {
          headers: ['Tenure', 'Monthly EMI', 'Total Paid', 'Total Interest', 'Interest as % of Loan'],
          rows: [
            ['24 months', '₹5,621', '₹1,34,904', '₹14,904', '12%'],
            ['36 months', '₹3,957', '₹1,42,452', '₹22,452', '19%'],
            ['48 months', '₹3,131', '₹1,50,288', '₹30,288', '25%'],
            ['60 months', '₹2,639', '₹1,58,340', '₹38,340', '32%'],
          ],
        },
      },
      {
        title: '5. Reading the Repayment Schedule',
        paragraphs: [
          'The year-by-year schedule produced by the calculator separates principal repaid from interest paid in each year, which is the clearest way to understand where your money goes. In year one on a 48-month loan, interest typically exceeds principal paid, because the balance is at its highest. By year four the relationship inverts and the majority of each instalment finally reduces the principal.',
          'Two practical consequences follow. First, if you prepay or make a part-payment in the early years, the benefit is disproportionately large, since every rupee saved reduces a balance that is still being charged at the full rate. Second, a loan that has run for years without a prepayment is still carrying a large outstanding balance, so it is worth reviewing the remaining tenure periodically.',
        ],
        bullets: [
          'Early-year prepayments save the most interest per rupee spent',
          'A part-payment usually shortens tenure rather than reducing the EMI',
          'Always check whether prepayment carries a processing fee',
          'Keep the sanction letter — it states the financed amount, rate, and tenure',
        ],
      },
      {
        title: '6. Documents and Final Checks Before You Sign',
        paragraphs: [
          'Two-wheeler finance typically requires fewer documents than a home loan, but a few items are worth arranging in advance so that the sanction is not delayed. These are your PAN card, a recent salary proof or ITR if you are salaried, your bank statement for the last three to six months, your Aadhaar, and a driving licence if the lender asks for one. A zero-down-payment product may also pull your credit score report.',
          'Before signing, verify four numbers on the sanction letter match your calculator output exactly: the financed amount, the annual interest rate, the monthly instalment, and the total number of instalments. Any difference between the on-road price and the financed amount should be explicitly explained — it is usually the accessories or insurance being excluded, which is worth knowing since it changes your total outflow.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How is a bike loan EMI different from a regular EMI?',
        answer:
          'A bike loan is calculated on the on-road price after deducting your down payment, so RTO, insurance, and accessories are financed alongside the ex-showroom price. A generic EMI calculator only takes a single loan amount. Bike Loan EMI Calculator models both inputs separately, so the instalment it returns matches a dealer quote.',
      },
      {
        question: 'What is the minimum down payment for a bike loan in India?',
        answer:
          'Most dealers ask for 15% to 25% of the on-road price upfront. Some lenders offer zero-down-payment schemes, typically at a higher interest rate. Because interest is charged on the reducing balance, a larger down payment reduces both the instalment and the total interest across the full tenure.',
      },
      {
        question: 'Is 11% a good interest rate on a two-wheeler loan?',
        answer:
          '11% to 12% sits in the competitive middle of the Indian two-wheeler market. Rates below 10% usually require strong credit or a newer electric model, while above 13% typically reflects used vehicles or a weaker credit profile. Always confirm the quoted rate is a reducing rate rather than a flat rate.',
      },
      {
        question: 'Should I choose the longest available tenure?',
        answer:
          'Not without seeing the total interest. Extending from 36 to 60 months cuts the instalment by about a third but raises total interest from roughly 19% to over 32% of the loan. Take the longer tenure only if your monthly budget genuinely requires it, and review the total interest figure rather than the instalment alone.',
      },
      {
        question: 'Does this calculator include RTO and insurance charges?',
        answer:
          'Yes. Because the loan amount is based on the on-road price you enter, registration, insurance, and accessories are financed along with the ex-showroom price, exactly as dealer financing works in India.',
      },
    ],
  },

  '/utility/step-up-sip-calculator': {
    slug: '/utility/step-up-sip-calculator',
    badge: 'Escalating SIP Compounding Engine',
    heading: 'In-Depth Guide: Step-Up SIP Mechanics, Inflation & Compounding Leverage',
    subheading:
      'A complete manual on how a Step-Up SIP works — annual step-up mechanics, the compounding advantage of escalating contributions, inflation drag on flat SIPs, and how to size the right step-up for your income.',
    sections: [
      {
        title: '1. What Exactly Is a Step-Up SIP',
        paragraphs: [
          'A Step-Up SIP is a systematic investment plan in which the monthly instalment is increased by a fixed percentage every year, almost always on a single nominated date such as 1 April. The contribution is unchanged within each year and then jumps at the step-up date, compounding that increased amount for the remainder of the plan.',
          'The distinguishing feature versus a flat SIP is not the mechanics but the intent. A flat SIP holds the nominal outflow constant, so the real value of each contribution erodes year after year. A Step-Up SIP keeps the real contribution broadly stable, tracking the rise in income and the cost of living. Over a 15 or 20-year horizon this difference is not marginal — it compounds into a materially different final corpus.',
        ],
        bullets: [
          'Step-up applies once per year, on a date you nominate with the fund house',
          'Each year you contribute 12 instalments at that year’s higher amount',
          'The increase compounds because later contributions are invested for longer',
          'Most investors use 10% per year, which roughly tracks annual salary revisions',
        ],
      },
      {
        title: '2. Why Flat SIPs Lose Ground to Inflation',
        paragraphs: [
          'Consider a flat SIP of ₹5,000 a month over 20 years. In year one that ₹5,000 buys a certain quantity of goods. By year fifteen, with consumer inflation running at roughly 6% per year, that same ₹5,000 buys materially less — its purchasing power has fallen by around 56%. The investor is nominally investing the same amount while quietly contributing a shrinking real sum.',
          'A Step-Up SIP corrects for this. A 10% annual step-up against 6% inflation means the real contribution still rises every year. The investor is not merely protecting against inflation; they are increasing their real exposure to the market, which is precisely what a long-horizon investor wants to do as income grows.',
        ],
        table: {
          headers: ['Year', 'Flat SIP', 'Step-Up SIP (10%)', 'Real Value of Flat SIP (6% inflation)'],
          rows: [
            ['1', '₹5,000', '₹5,000', '₹5,000'],
            ['5', '₹5,000', '₹7,321', '₹3,960'],
            ['10', '₹5,000', '₹11,790', '₹2,959'],
            ['15', '₹5,000', '₹18,987', '₹2,212'],
            ['20', '₹5,000', '₹30,580', '₹1,653'],
          ],
        },
      },
      {
        title: '3. The Compounding Leverage of Later Contributions',
        paragraphs: [
          'The reason the gap widens so dramatically over time is a compounding asymmetry: instalments contributed in later years are invested for fewer years, but they are larger, and they sit in an account that has already grown. A step-up instalment made in year 15 participates in fifteen further years of compounding — a much larger multiplier than the year-one instalment, which by then has contributed almost nothing to the final balance.',
          'This is why the step-up percentage, more than the starting amount, drives the outcome in a long plan. At 20 years and a 12% expected return, moving from a flat ₹5,000 SIP to a 10% step-up starting at the same ₹5,000 nearly doubles the corpus — from ₹49,95,740 to ₹98,45,899 — not because the starting amount changed, but because the escalating contributions compounded for longer. It also nearly triples the total money invested, which is the trade-off you are actually making.',
        ],
        table: {
          headers: ['Plan (20 yrs, 12% return)', 'Total Invested', 'Estimated Value'],
          rows: [
            ['Flat ₹5,000 SIP', '₹12,00,000', '₹49,95,740'],
            ['Step-up ₹5,000, 10%/yr', '₹34,36,500', '₹98,45,899'],
            ['Step-up ₹10,000, 10%/yr', '₹68,73,000', '₹1,96,91,798'],
          ],
        },
      },
      {
        title: '4. Choosing the Right Step-Up Percentage',
        paragraphs: [
          'The correct step-up is the one your income can genuinely sustain, because the fund house will simply debit the higher amount without asking. If your salary grows at 8% a year and you set a 15% step-up, you will be committed to an instalment above your means, and the most common outcome is a missed instalment — which is far more damaging than a smaller step-up would ever have been.',
          'A 10% annual step-up is the most widely used and is broadly aligned with typical mid-career salary revisions. A 5% step-up suits someone early in their career or with an irregular income. For a salaried professional on a predictable trajectory, matching the step-up to your most recent appraisal increment is the most defensible starting point.',
        ],
        bullets: [
          '5% — conservative, suits early career or variable income',
          '10% — the standard choice, broadly tracks salary revisions',
          '15% — only if your income is growing faster than that reliably',
          'Never set a step-up above what your cash flow can absorb every single year',
        ],
      },
      {
        title: '5. Comparing Step-Up Against a Flat SIP Honestly',
        paragraphs: [
          'It is tempting to present a step-up as simply "better", but that is misleading. For the same starting amount and tenure, a step-up always produces a larger corpus precisely because you invest more total money. The honest framing is that a step-up lets you direct a larger sum towards the goal, and the calculator makes the size of that additional outflow explicit so the decision is made with open eyes.',
          'A flat SIP has a real virtue: its monthly outflow never changes, which makes it far easier to sustain through a job loss, a business downturn, or a large unexpected expense. Many investors run a flat SIP through the uncertain early years and add a step-up once their income becomes predictable. This calculator shows the year-by-year cash flow so you can see exactly when the escalations land.',
        ],
        bullets: [
          'A step-up always yields more — because you invest more in total',
          'A flat SIP has a constant, predictable monthly outflow',
          'The year-by-year table shows exactly when your outflow jumps',
          'Consider starting flat and stepping up once income is predictable',
        ],
      },
      {
        title: '6. Practical Execution and Common Mistakes',
        paragraphs: [
          'The step-up must be registered with the fund house or the AMC, otherwise the instalment will not rise. Most major platforms allow this through a dashboard setting or a one-time written instruction, and it is worth setting it up at the start rather than attempting it later, because some houses need a minimum period before the first step-up takes effect.',
          'The most common mistake is choosing a step-up the investor cannot sustain in a bad year. A missed instalment can attract a penalty and, in some cases, trigger a folio-level review, so the escalations should be set at a level that survives a difficult year rather than one calibrated to your best month. The second common mistake is checking performance too early — a 15-year plan needs to be judged at year 15, not year 3.',
        ],
        bullets: [
          'Register the step-up with the fund house in advance',
          'Confirm the effective date of the first step-up',
          'Never miss an instalment to "catch up" — the penalty can be severe',
          'Review the plan annually against your actual income, and adjust the step-up',
          'Judge a 15-year plan on 15-year outcomes',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is a step-up SIP and how does it work?',
        answer:
          'A Step-Up SIP is a mutual fund investment plan where your monthly instalment increases by a fixed percentage every year, usually on a nominated date such as 1 April. You contribute 12 instalments at each year’s amount, and the increased contributions compound for the remaining years of the plan.',
      },
      {
        question: 'How is a Step-Up SIP different from a regular SIP?',
        answer:
          'A regular SIP invests a constant amount every month, so inflation steadily erodes its real purchasing power. A Step-Up SIP raises the contribution annually, keeping your real contribution roughly constant or rising, and because later instalments compound for longer it produces a materially larger final corpus over a long tenure.',
      },
      {
        question: 'What step-up percentage should I choose?',
        answer:
          '10% per year is the most commonly used and broadly tracks typical salary revisions. A 5% step-up suits early-career or irregular income, while 15% or more should only be chosen if your income is growing that fast reliably. The key rule is that the escalations must be affordable in a difficult year, not just a good one.',
      },
      {
        question: 'Is a Step-Up SIP always better than a regular SIP?',
        answer:
          'For the same starting amount and tenure, a step-up always produces a larger corpus because you invest more money overall. The trade-off is a higher and rising monthly outflow, so the honest comparison is between the two cash-flow commitments rather than the two final numbers.',
      },
      {
        question: 'How do I enable the annual step-up with my fund house?',
        answer:
          'Register the step-up instruction with the AMC or through your platform’s dashboard before you need it, and confirm the effective date of the first increase. Some houses require a minimum holding period before the first step-up applies, so it is worth arranging in advance rather than at the end of the first year.',
      },
      {
        question: 'Are the returns shown guaranteed?',
        answer:
          'No. The projection compounds monthly at the rate you enter. Mutual fund returns vary year to year and are not guaranteed, so the figures are a planning estimate. For equity funds, a 10% to 12% assumption is commonly used, but real outcomes differ.',
      },
    ],
  },
};
