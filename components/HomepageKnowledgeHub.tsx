import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  GraduationCap,
  FileText,
  Image as ImageIcon,
  Calculator,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface GuideItem {
  slug: string;
  title: string;
  desc?: string;
  readTime: string;
}

const FEATURED_GUIDES = [
  {
    slug: 'ssc-gd-constable-photo-signature-resizer-guide-2026',
    title: 'SSC GD Constable & CGL Photo & Signature Rules (2026-27)',
    desc: 'Live webcam capture rules, exact 20KB–50KB photo formatting with DOP date stamps, and signature specifications.',
    category: 'Govt Exams',
    readTime: '7 min read',
    image: '/blog/ssc-gd-constable-photo-guide.jpg',
    badge: 'Exam Portal Standards',
    updatedDate: 'Updated Oct 2026',
  },
  {
    slug: 'how-to-compress-pdf-to-200kb-online',
    title: 'How to Compress PDF to 200KB Without Blurry Text',
    desc: 'Complete walkthrough to shrink PDFs below 200KB for government job portals, scholarship forms, and admissions.',
    category: 'PDF Mastery',
    readTime: '6 min read',
    image: '/blog/pdf-to-200kb.jpg',
    badge: 'Document Optimization',
    updatedDate: 'Updated Sep 2026',
  },
  {
    slug: 'how-to-convert-heic-to-jpg-free',
    title: 'Convert iPhone HEIC Photos to JPG Online Free',
    desc: 'Batch convert Apple HEIC camera photos to standard JPG format in seconds without uploading to cloud servers.',
    category: 'Image Conversion',
    readTime: '5 min read',
    image: '/blog/heic-to-jpg.webp',
    badge: 'Privacy Converter',
    updatedDate: 'Updated Sep 2026',
  },
  {
    slug: 'old-vs-new-tax-regime-calculator-guide',
    title: 'Old vs New Tax Regime: Complete Slabs & Calculator (FY 2026-27)',
    desc: 'Compare ₹75,000 standard deduction, Section 87A rebate, tax slabs, and break-even deduction targets for AY 2027-28.',
    category: 'Tax & Finance',
    readTime: '8 min read',
    image: '/blog/income-tax-calculator.webp',
    badge: 'Financial Planning',
    updatedDate: 'Updated Sep 2026',
  },
];

const KNOWLEDGE_CLUSTERS = [
  {
    id: 'govt',
    title: 'Govt Exam & Identity Portal Specs',
    description: 'Official photo, signature, and document size criteria for central and state recruitment portals.',
    icon: GraduationCap,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconBg: 'bg-indigo-50 text-indigo-600',
    guides: [
      { slug: 'ssc-gd-constable-photo-signature-resizer-guide-2026', title: 'SSC GD Constable & CGL Photo/Signature Rules 2026-27', readTime: '7 min' },
      { slug: 'ssc-photo-size-requirements', title: 'SSC Photo & Signature Size Requirements (Official Rules)', readTime: '5 min' },
      { slug: 'rrb-ntpc-photo-signature-guidelines-2026', title: 'RRB NTPC & Group D Photo, Signature & Travel Pass Size', readTime: '7 min' },
      { slug: 'rrb-photo-size-requirements', title: 'RRB Railway Exam Photo & Signature Rules (NTPC, ALP)', readTime: '4 min' },
      { slug: 'ibps-sbi-po-photo-signature-guidelines', title: 'IBPS & SBI PO / Clerk Photo, Signature & Declaration', readTime: '6 min' },
      { slug: 'upsc-photo-size-requirements', title: 'UPSC Civil Services & OTR Photo & Signature Requirements', readTime: '4 min' },
      { slug: 'jee-main-cuet-photo-signature-requirements', title: 'JEE Main & CUET Photo & Signature Guidelines (DOP Stamp)', readTime: '6 min' },
      { slug: 'neet-photo-size-requirements', title: 'NTA NEET UG Photo & Postcard (4x6) Photo Requirements', readTime: '4 min' },
      { slug: 'passport-size-photo-maker-guide', title: 'Passport Size Photo Maker Guide: US Visa, Schengen & India', readTime: '6 min' },
      { slug: 'aadhaar-card-print-size-guide', title: 'Aadhaar Card PVC & Paper Print Size Guide (DPI & CM)', readTime: '7 min' },
      { slug: 'how-to-mask-aadhaar-card-online-offline-protect-privacy', title: 'How to Mask Aadhaar Card Online (Hide First 8 Digits for KYC)', readTime: '6 min' },
      { slug: 'how-to-resize-photo-for-online-application', title: 'How to Resize Photo for Online Application Forms', readTime: '5 min' },
      { slug: 'how-to-resize-signature-online', title: 'How to Resize Signature Online (10KB to 20KB & B&W)', readTime: '5 min' },
    ],
  },
  {
    id: 'pdf',
    title: 'PDF Document Optimization & Editing',
    description: 'Master in-browser PDF compression, document merging, password removal, and OCR conversions.',
    icon: FileText,
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    iconBg: 'bg-rose-50 text-rose-600',
    guides: [
      { slug: 'how-to-combine-10th-and-12th-marksheets-into-one-pdf-under-500kb', title: 'Combine 10th & 12th Marksheets into Single PDF (<500KB)', readTime: '6 min' },
      { slug: 'how-to-compress-pdf-to-200kb-online', title: 'How to Compress PDF to 200KB Online (Without Blurry Text)', readTime: '6 min' },
      { slug: 'how-to-compress-pdf-to-50kb-online', title: 'How to Compress PDF to 50KB Online Free (Job Portals)', readTime: '6 min' },
      { slug: 'how-to-compress-pdf-to-100kb-without-losing-quality', title: 'Compress PDF to 100KB Without Quality or Text Blur', readTime: '5 min' },
      { slug: 'how-to-compress-pdf-to-1mb-without-losing-quality', title: 'Compress PDF to 1MB Free for Email & Job Portals', readTime: '5 min' },
      { slug: 'compress-pdf-without-losing-quality', title: 'Compress PDF Without Losing Quality: 4 Pro Tricks', readTime: '4 min' },
      { slug: 'how-to-convert-jpg-to-pdf-online', title: 'How to Convert Multiple JPG Images into One PDF', readTime: '6 min' },
      { slug: 'how-to-merge-pdf-files-free', title: 'How to Merge Multiple PDF Files into One Document Free', readTime: '3 min' },
      { slug: 'how-to-remove-password-from-pdf', title: 'How to Remove Password from Bank Statements & Payslips', readTime: '5 min' },
      { slug: 'how-to-convert-scanned-pdf-to-editable-word', title: 'Convert Scanned PDF to Editable Word (Preserve Layout)', readTime: '5 min' },
    ],
  },
  {
    id: 'image',
    title: 'Image Compression & Conversion',
    description: 'Learn binary-search compression, modern format conversions (WebP, HEIC), and background erasing.',
    icon: ImageIcon,
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    iconBg: 'bg-sky-50 text-sky-600',
    guides: [
      { slug: 'how-to-compress-image-to-20kb', title: 'How to Compress Image to 20KB for Signature & Photo Uploads', readTime: '5 min' },
      { slug: 'how-to-compress-image-to-50kb', title: 'How to Compress Image to 50KB Without Losing Face Clarity', readTime: '5 min' },
      { slug: 'how-to-compress-image-to-100kb', title: 'How to Compress Image to 100KB for Official Identity Forms', readTime: '4 min' },
      { slug: 'how-to-reduce-image-size-without-losing-quality', title: 'Reduce Image File Size Without Losing Visual Quality', readTime: '5 min' },
      { slug: 'how-to-convert-heic-to-jpg-free', title: 'Convert iPhone HEIC Photos to JPG Online Free (Batch)', readTime: '5 min' },
      { slug: 'how-to-convert-webp-to-jpg-online-free', title: 'Convert WebP to JPG Online Free (Lossless Quality)', readTime: '5 min' },
      { slug: 'how-to-remove-background-from-image-free', title: 'Remove Background from Image Free in HD (No Watermark)', readTime: '5 min' },
      { slug: 'jpeg-vs-png-for-online-forms', title: 'JPEG vs PNG for Online Application Forms: Which to Pick?', readTime: '4 min' },
      { slug: 'photo-size-and-file-size-explained', title: 'Photo Dimensions (Pixels/CM) vs File Size (KB/MB) Explained', readTime: '4 min' },
    ],
  },
  {
    id: 'finance',
    title: 'Financial & Everyday Calculators',
    description: 'In-depth calculation formulas and guides for tax planning, loan interest, salary breakups, and tariffs.',
    icon: Calculator,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-50 text-amber-600',
    guides: [
      { slug: 'old-vs-new-tax-regime-calculator-guide', title: 'Old vs New Tax Regime: Which Is Better for FY 2026-27?', readTime: '8 min' },
      { slug: 'ctc-to-in-hand-salary-calculator-guide', title: 'CTC to In-Hand Salary Calculator Guide (PF, Gratuity, Tax)', readTime: '7 min' },
      { slug: 'how-to-calculate-electricity-bill-from-meter-reading', title: 'How to Calculate Electricity Bill from Meter Reading (Units & Slabs)', readTime: '7 min' },
      { slug: 'how-to-calculate-sip-returns-wealth-guide', title: 'How to Calculate SIP Returns (Mutual Fund Wealth Guide)', readTime: '6 min' },
      { slug: 'emi-calculator-guide', title: 'Home & Car Loan EMI Calculation Formula & Prepayment Guide', readTime: '3 min' },
      { slug: 'age-calculator-india', title: 'Age Calculator: Exact Years, Months, Days & Next Birthday', readTime: '3 min' },
      { slug: 'cgpa-to-percentage-conversion-guide', title: 'CGPA to Percentage Conversion Guide (CBSE, AICTE & Mumbai Univ)', readTime: '6 min' },
    ],
  },
];

export function HomepageKnowledgeHub() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* 1. Header with Editorial Authority Signals */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Editorial Knowledge Base &amp; Technical Manuals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              In-Depth Guides, Official Exam Specs &amp; Technical Tutorials
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
              Every tool on FileZenith is backed by comprehensive, step-by-step guides researched against official portal notifications, document standards, and mathematical formulas.
            </p>
          </div>

          <Link
            href="/blog"
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 group active:scale-95"
          >
            <span>Explore All 37 Guides</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 2. Top 4 Featured Cornerstone Guides */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">
              Featured In-Depth Walkthroughs
            </h3>
            <span className="text-xs font-bold text-slate-400">
              37 Comprehensive Articles Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_GUIDES.map((post) => (
              <article
                key={post.slug}
                className="bg-slate-50/70 border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col justify-between hover:bg-white hover:border-indigo-500 hover:shadow-md transition-all group"
              >
                <div className="relative h-40 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-extrabold bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md border border-white/20">
                      {post.badge}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span className="text-indigo-600 font-extrabold">{post.category}</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {post.readTime}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h4>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                      {post.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-slate-400">{post.updatedDate}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-extrabold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 3. Comprehensive 4-Category Directory (All 37 Guides Crawlable by Search Engines) */}
        <div className="pt-6 border-t border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Browse Complete Guides Library by Domain
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Direct access to all 37 specialized articles, regulatory specifications, and technical reference manuals.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold w-fit">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% Free • Primary Sources Cited
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {KNOWLEDGE_CLUSTERS.map((cluster) => {
              const Icon = cluster.icon;
              return (
                <div
                  key={cluster.id}
                  className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl ${cluster.iconBg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${cluster.badgeColor}`}>
                        {cluster.guides.length} Guides
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-snug">
                        {cluster.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                        {cluster.description}
                      </p>
                    </div>

                    <ul className="space-y-2 pt-2 border-t border-slate-200/60">
                      {cluster.guides.map((guide) => (
                        <li key={guide.slug}>
                          <Link
                            href={`/blog/${guide.slug}`}
                            className="text-xs font-semibold text-slate-700 hover:text-indigo-600 flex items-start gap-1.5 group leading-snug transition-colors"
                          >
                            <span className="text-slate-400 group-hover:text-indigo-600 shrink-0 select-none">›</span>
                            <span className="line-clamp-2">{guide.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    <Link
                      href="/blog"
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center justify-between group"
                    >
                      <span>Explore this cluster</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
