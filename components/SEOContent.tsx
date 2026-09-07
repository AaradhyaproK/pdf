'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SEO_REGISTRY, generateToolSchemas } from '@/lib/seo-config';
import { ChevronDown, CheckCircle2, Cpu, ArrowRight, Sparkles, FileText, Image as ImageIcon, Wrench, BookOpen, Clock } from 'lucide-react';

export interface SEOContentProps {
  slug: string;
}

interface ArticleRecommendation {
  title: string;
  desc: string;
  url: string;
  badge: string;
  readTime?: string;
  type: 'blog' | 'guide' | 'preset';
}

function getRelatedGuidesAndArticles(slug: string, category: string): ArticleRecommendation[] {
  if (slug === '/pdf/compress' || slug === '/pdf/compress-to-200kb') {
    return [
      {
        title: 'How to Compress PDF to 200KB Online (Without Blurry Text)',
        desc: 'Complete walkthrough to hit under 200KB for UPSC, SSC, and visa portals.',
        url: '/blog/how-to-compress-pdf-to-200kb-online',
        badge: 'Blog Guide',
        readTime: '5 min read',
        type: 'blog'
      },
      {
        title: 'Compress PDF Without Losing Quality: 4 Pro Tricks',
        desc: 'Preserve crisp text while slashing file sizes up to 80%.',
        url: '/blog/compress-pdf-without-losing-quality',
        badge: 'Pro Tips',
        readTime: '4 min read',
        type: 'blog'
      },
      {
        title: 'SSC CGL/CHSL PDF 200KB Preset',
        desc: 'Pre-configured compression target for Staff Selection Commission.',
        url: '/presets/ssc-pdf-200kb',
        badge: 'Official Preset',
        readTime: 'Direct Tool',
        type: 'preset'
      },
      {
        title: 'How to Convert Scanned PDF to Editable Word',
        desc: 'Turn locked scans into editable DOCX without formatting loss.',
        url: '/blog/how-to-convert-scanned-pdf-to-editable-word',
        badge: 'Tutorial',
        readTime: '6 min read',
        type: 'blog'
      }
    ];
  }

  if (slug === '/pdf/pdf-to-word' || slug === '/pdf/word-to-pdf' || slug === '/pdf/ocr') {
    return [
      {
        title: 'How to Convert Scanned PDF to Editable Word',
        desc: 'Step-by-step guide to convert scanned PDFs into DOCX with zero formatting loss.',
        url: '/blog/how-to-convert-scanned-pdf-to-editable-word',
        badge: 'Featured',
        readTime: '6 min read',
        type: 'blog'
      },
      {
        title: 'How to Remove Password from PDF Permanently',
        desc: 'Unlock payslips, bank statements, and tax returns for easy editing.',
        url: '/blog/how-to-remove-password-from-pdf',
        badge: 'Security',
        readTime: '5 min read',
        type: 'blog'
      },
      {
        title: 'How to Compress PDF to 200KB Online',
        desc: 'Shrink your converted documents for email attachments and portal uploads.',
        url: '/blog/how-to-compress-pdf-to-200kb-online',
        badge: 'PDF Guide',
        readTime: '5 min read',
        type: 'blog'
      },
      {
        title: 'Word to PDF Converter',
        desc: 'Convert edited Word files back into secure, polished PDF documents.',
        url: '/pdf/word-to-pdf',
        badge: 'Tool',
        readTime: 'Free',
        type: 'preset'
      }
    ];
  }

  if (slug === '/pdf/remove-password' || slug === '/pdf/protect') {
    return [
      {
        title: 'How to Remove Password from Bank Statements & Payslips',
        desc: 'Permanently decrypt protected PDF files safely in your browser.',
        url: '/blog/how-to-remove-password-from-pdf',
        badge: 'Security Guide',
        readTime: '5 min read',
        type: 'blog'
      },
      {
        title: 'How to Convert Scanned PDF to Editable Word',
        desc: 'Turn unlocked documents into fully editable Word documents.',
        url: '/blog/how-to-convert-scanned-pdf-to-editable-word',
        badge: 'Guide',
        readTime: '6 min read',
        type: 'blog'
      },
      {
        title: 'How to Compress PDF to 200KB Online',
        desc: 'Shrink bank statements and documents for mortgage and loan portal uploads.',
        url: '/blog/how-to-compress-pdf-to-200kb-online',
        badge: 'Guide',
        readTime: '5 min read',
        type: 'blog'
      },
      {
        title: 'Merge PDF Files Free',
        desc: 'Combine 6 months of bank statements into one clean master PDF.',
        url: '/pdf/merge',
        badge: 'Tool',
        readTime: 'Free',
        type: 'preset'
      }
    ];
  }

  if (category === 'pdf') {
    return [
      {
        title: 'How to Compress PDF to 200KB Online Free',
        desc: 'Shrink documents for online application forms without blurry text.',
        url: '/blog/how-to-compress-pdf-to-200kb-online',
        badge: 'Top Guide',
        readTime: '5 min read',
        type: 'blog'
      },
      {
        title: 'How to Convert Scanned PDF to Editable Word',
        desc: 'Extract and edit scanned text in Microsoft Word with OCR.',
        url: '/blog/how-to-convert-scanned-pdf-to-editable-word',
        badge: 'Guide',
        readTime: '6 min read',
        type: 'blog'
      },
      {
        title: 'How to Merge Multiple PDF Files Free',
        desc: 'Combine multiple PDF pages and certificates into one organized file.',
        url: '/blog/how-to-merge-pdf-files-free',
        badge: 'Tutorial',
        readTime: '4 min read',
        type: 'blog'
      },
      {
        title: 'How to Remove Password from PDF Permanently',
        desc: 'Safely unlock encrypted bank statements and salary slips in browser.',
        url: '/blog/how-to-remove-password-from-pdf',
        badge: 'Security',
        readTime: '5 min read',
        type: 'blog'
      }
    ];
  }

  if (slug === '/image/passport-photo-maker' || slug.includes('passport') || slug.includes('exam')) {
    return [
      {
        title: 'The Ultimate Passport Size Photo Maker Guide',
        desc: 'Official dimensions (2x2", 3.5x4.5cm), white background rules, and form specs.',
        url: '/blog/passport-size-photo-maker-guide',
        badge: 'Official Specs',
        readTime: '6 min read',
        type: 'blog'
      },
      {
        title: 'How to Remove Background from Image Free in HD',
        desc: 'Get transparent or pure white backgrounds without watermarks.',
        url: '/blog/how-to-remove-background-from-image-free',
        badge: 'HD Cutout',
        readTime: '5 min read',
        type: 'blog'
      },
      {
        title: 'SSC Photo Size & Specification Guide',
        desc: 'Staff Selection Commission official photo dimensions and file limits.',
        url: '/guides/ssc-photo-size-requirements',
        badge: 'Exam Guide',
        readTime: '4 min read',
        type: 'guide'
      },
      {
        title: 'UPSC Online Application Photo Specs',
        desc: 'Union Public Service Commission photo and signature requirements.',
        url: '/guides/upsc-photo-size-requirements',
        badge: 'Exam Guide',
        readTime: '4 min read',
        type: 'guide'
      }
    ];
  }

  if (slug === '/image/remove-background') {
    return [
      {
        title: 'How to Remove Background from Image Free in HD',
        desc: 'Neural AI edge detection in browser with zero watermarks or credit limits.',
        url: '/blog/how-to-remove-background-from-image-free',
        badge: 'Featured',
        readTime: '5 min read',
        type: 'blog'
      },
      {
        title: 'The Ultimate Passport Size Photo Maker Guide',
        desc: 'Create compliant white background headshots for visa and job portals.',
        url: '/blog/passport-size-photo-maker-guide',
        badge: 'Guide',
        readTime: '6 min read',
        type: 'blog'
      },
      {
        title: 'How to Resize Signature Online for Govt Portals',
        desc: 'Clean up and format digital signatures for exam applications.',
        url: '/blog/how-to-resize-signature-online',
        badge: 'Guide',
        readTime: '4 min read',
        type: 'blog'
      },
      {
        title: 'JPEG vs PNG for Online Applications: Which to Pick',
        desc: 'Understand compression and format compliance for government forms.',
        url: '/guides/jpeg-vs-png-for-online-forms',
        badge: 'Knowledge',
        readTime: '3 min read',
        type: 'guide'
      }
    ];
  }

  if (slug === '/image/compress' || slug.includes('compress-to') || slug === '/image/resize-signature') {
    return [
      {
        title: 'How to Compress Image to Under 20KB for Portals',
        desc: 'Step-by-step canvas compression for signatures and small headshots.',
        url: '/blog/how-to-compress-image-to-20kb',
        badge: 'Guide',
        readTime: '4 min read',
        type: 'blog'
      },
      {
        title: 'How to Compress Image to 50KB Without Blur',
        desc: 'Balance pixel clarity and file weight for state PSC and police exams.',
        url: '/blog/how-to-compress-image-to-50kb',
        badge: 'Guide',
        readTime: '4 min read',
        type: 'blog'
      },
      {
        title: 'The Ultimate Passport Size Photo Maker Guide',
        desc: 'Biometric dimensions, background color, and printing grids.',
        url: '/blog/passport-size-photo-maker-guide',
        badge: 'Featured',
        readTime: '6 min read',
        type: 'blog'
      },
      {
        title: 'Photo Dimensions vs File Size Explained',
        desc: 'Understand DPI, resolution, and JPEG quality quantization.',
        url: '/guides/photo-size-and-file-size-explained',
        badge: 'Explainer',
        readTime: '3 min read',
        type: 'guide'
      }
    ];
  }

  if (category === 'image') {
    return [
      {
        title: 'The Ultimate Passport Size Photo Maker Guide',
        desc: 'Official photo standards for US Visa, Schengen, India, and exams.',
        url: '/blog/passport-size-photo-maker-guide',
        badge: 'Top Guide',
        readTime: '6 min read',
        type: 'blog'
      },
      {
        title: 'How to Remove Background from Image Free in HD',
        desc: 'In-browser AI background removal with transparent PNG output.',
        url: '/blog/how-to-remove-background-from-image-free',
        badge: 'AI Cutout',
        readTime: '5 min read',
        type: 'blog'
      },
      {
        title: 'How to Compress Image to 20KB Online',
        desc: 'Reduce signatures and thumbnails below strict application limits.',
        url: '/blog/how-to-compress-image-to-20kb',
        badge: 'Guide',
        readTime: '4 min read',
        type: 'blog'
      },
      {
        title: 'How to Resize Signature Online',
        desc: 'Crop, enhance contrast, and scale signature files for exams.',
        url: '/blog/how-to-resize-signature-online',
        badge: 'Guide',
        readTime: '4 min read',
        type: 'blog'
      }
    ];
  }

  return [
    {
      title: 'How to Calculate Home & Car Loan EMI Accurately',
      desc: 'Understand principal reduction, amortization schedules, and prepayments.',
      url: '/blog/emi-calculator-guide',
      badge: 'Financial Guide',
      readTime: '4 min read',
      type: 'blog'
    },
    {
      title: 'Calculate Exact Age for Competitive Exam Eligibility',
      desc: 'Determine cut-off date eligibility for UPSC, SSC, and state tests.',
      url: '/blog/age-calculator-india',
      badge: 'Exam Guide',
      readTime: '4 min read',
      type: 'blog'
    },
    {
      title: 'Free Vector QR Code Generator',
      desc: 'Generate high-resolution SVG and PNG QR codes with zero expiration.',
      url: '/utility/qr-generator',
      badge: 'Popular Tool',
      readTime: 'Free',
      type: 'preset'
    },
    {
      title: 'Word Counter & Keyword Density Analyzer',
      desc: 'Check word counts, character lengths, and reading time in real-time.',
      url: '/utility/word-counter',
      badge: 'SEO Tool',
      readTime: 'Free',
      type: 'preset'
    }
  ];
}

export function SEOContent({ slug }: SEOContentProps) {
  const tool = SEO_REGISTRY[slug];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!tool) return null;

  const schemas = generateToolSchemas(slug);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Determine dynamic file terminology for contextual SEO
  const fileTerm =
    slug.includes('excel') || slug.includes('numbers')
      ? 'spreadsheet'
      : slug.includes('word') || slug.includes('pages') || slug.includes('markdown')
      ? 'document'
      : tool.category === 'image'
      ? 'image'
      : tool.category === 'pdf'
      ? 'PDF'
      : 'file';

  const isIWorkOfficeTool = [
    '/utility/excel-to-numbers',
    '/utility/numbers-to-excel',
    '/utility/word-to-pages',
    '/utility/pages-to-word',
  ].includes(slug);

  const iWorkOfficeCluster = [
    { name: 'Excel to Numbers Converter', slug: '/utility/excel-to-numbers', desc: 'Convert XLSX/CSV workbooks into Apple Numbers packages.' },
    { name: 'Numbers to Excel Converter', slug: '/utility/numbers-to-excel', desc: 'Convert Apple Numbers spreadsheets to Microsoft Excel XLSX.' },
    { name: 'Word to Pages Converter', slug: '/utility/word-to-pages', desc: 'Convert Word DOCX documents to Apple Pages packages.' },
    { name: 'Pages to Word Converter', slug: '/utility/pages-to-word', desc: 'Convert Apple Pages files to editable Microsoft Word DOCX.' },
  ];

  // Internal Link Recommendations per category
  const relatedTools = isIWorkOfficeTool
    ? iWorkOfficeCluster
        .filter((item) => item.slug !== slug)
        .concat(
          slug.includes('numbers') || slug.includes('excel')
            ? [{ name: 'CSV to JSON / Formatter', slug: '/utility/json-formatter', desc: 'Convert spreadsheets and tabular records instantly.' }]
            : [{ name: 'Word to PDF Converter', slug: '/pdf/word-to-pdf', desc: 'Save Word documents as high-quality PDF files.' }]
        )
    : tool.category === 'pdf'
    ? [
        { name: 'Compress PDF Online (Under 200KB)', slug: '/pdf/compress-to-200kb', desc: 'Reduce PDF file size for portal submissions.' },
        { name: 'Merge PDF Files Free', slug: '/pdf/merge', desc: 'Combine multiple PDF documents into one.' },
        { name: 'Convert PDF to Image (JPG/PNG)', slug: '/pdf/to-image', desc: 'Save PDF pages as high-resolution images.' },
        { name: 'Interactive PDF Editor', slug: '/pdf/edit', desc: 'Add text, whiteout content, and draw annotations.' },
      ]
    : tool.category === 'image'
    ? [
        { name: 'Convert PNG to JPG Online', slug: '/image/png-to-jpg', desc: 'Bulk convert PNG images to JPG with custom quality.' },
        { name: 'Turn Pics to PDF Document', slug: '/image/pics-to-pdf', desc: 'Combine photos, scans, and receipts into PDF.' },
        { name: 'PNG to PDF Converter', slug: '/image/png-to-pdf', desc: 'Save PNG pictures directly as structured PDF.' },
        { name: 'AI Image Background Remover', slug: '/image/remove-background', desc: 'Isolate subjects and export transparent PNG cutouts.' },
      ]
    : [
        { name: 'Free Vector QR Code Generator', slug: '/utility/qr-generator', desc: 'Create SVG/PNG QR codes with custom logos.' },
        { name: 'Word Counter & Density Analyzer', slug: '/utility/word-counter', desc: 'Count words, characters, reading speed, and SEO keywords.' },
        { name: 'JSON Formatter & CSV Converter', slug: '/utility/json-formatter', desc: 'Validate, format, and convert JSON arrays to CSV/YAML.' },
      ];

  const recommendedArticles = getRelatedGuidesAndArticles(slug, tool.category);

  return (
    <div className="w-full space-y-6 sm:space-y-10 mt-6 sm:mt-12 pt-6 sm:pt-10 border-t border-slate-200/80 text-slate-700">
      {/* Inject Structured Data JSON-LD Schemas */}
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          id={`json-ld-${slug.replace(/\//g, '-')}-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Tool Overview & Privacy Benefits Card */}
      <section className="space-y-3 bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-base sm:text-2xl font-black text-slate-900">
            About {tool.title}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          {tool.description} FileZenith provides a 100% free, browser-native solution engineered specifically for office professionals, students, researchers, and freelancers who demand maximum processing speed and absolute data privacy.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Unlike traditional online file converters that require you to upload confidential files to remote cloud servers, your {fileTerm} is processed directly in your browser, helping keep your data private. This means your files never leave your computer or phone, eliminating all cybersecurity risks with no daily file conversion caps.
        </p>
      </section>

      {/* How-To Step-by-Step Guide (Mobile App Timeline Cards) */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-2">
          <h2 className="text-lg sm:text-2xl font-black text-slate-900">
            How to Use {tool.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Follow these 3 simple steps to complete your task directly in your browser with zero server file uploads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          {tool.howToSteps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xs hover:shadow-md transition-all space-y-2.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-black text-xs shadow-xs">
                  Step {idx + 1}
                </div>
                <span className="text-[10px] font-bold text-slate-400">100% Free</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      {tool.comparisonTable && (
        <section className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-2">
            <h2 className="text-lg sm:text-2xl font-black text-slate-900">
              Why Choose FileZenith Browser Engine?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              See how FileZenith browser processing compares against standard cloud {fileTerm === 'PDF' ? 'PDF' : fileTerm === 'spreadsheet' ? 'spreadsheet' : fileTerm === 'image' ? 'image' : 'file'} converters.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3 sm:p-4 font-black text-slate-900">Feature</th>
                  <th className="p-3 sm:p-4 font-black text-indigo-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    FileZenith Engine
                  </th>
                  <th className="p-3 sm:p-4 font-bold text-slate-500">
                    Standard Cloud Converters
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tool.comparisonTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="p-3 sm:p-4 font-extrabold text-slate-900">
                      {row.feature}
                    </td>
                    <td className="p-3 sm:p-4 font-extrabold text-emerald-700 bg-emerald-50/30">
                      {row.omnitool}
                    </td>
                    <td className="p-3 sm:p-4 text-slate-500 font-medium">
                      {row.standardCloud}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Technical Explanation - Dark App Security Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-3 shadow-xl">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 shadow-xs">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-sm sm:text-xl font-black text-white">100% Secure Serverless Architecture</h3>
          </div>
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
            100% Private
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          Unlike traditional web tools that upload your sensitive files to remote servers over the internet, your {fileTerm} is processed directly in your browser, helping keep your data private. This guarantees absolute data privacy, instant local execution, and offline capability.
        </p>
      </section>

      {/* Frequently Asked Questions (People Also Ask Targeted) */}
      <section className="space-y-4 sm:space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2">
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Everything you need to know about {tool.title} privacy, speed, and limits.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
          {tool.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-indigo-300 bg-indigo-50/20 shadow-2xs'
                    : 'border-slate-200/80 bg-white hover:bg-slate-50/60'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-3.5 sm:p-5 flex items-center justify-between text-left gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`text-xs sm:text-sm font-black shrink-0 ${isOpen ? 'text-indigo-600' : 'text-slate-400'}`}>
                      Q{idx + 1}.
                    </span>
                    <h3 className="text-xs sm:text-base font-extrabold text-slate-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`p-1.5 rounded-full shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <div
                  className={`px-3.5 pb-3.5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-2 border-t border-indigo-100/60 ${
                    isOpen ? 'block' : 'hidden'
                  }`}
                  aria-hidden={!isOpen}
                >
                  <div className="pl-3.5 sm:pl-5 border-l-2 border-indigo-400/80">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recommended Step-by-Step Guides & Articles */}
      {recommendedArticles.length > 0 && (
        <section className="space-y-4 sm:space-y-6 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                <BookOpen className="w-4 h-4 text-rose-600" />
              </div>
              <h2 className="text-base sm:text-2xl font-black text-slate-900">
                Recommended Step-by-Step Guides & Articles
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs font-black text-rose-600 hover:text-rose-800 flex items-center gap-1"
            >
              <span>All Guides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {recommendedArticles.map((art, idx) => (
              <Link
                key={idx}
                href={art.url}
                className="p-3.5 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-rose-300 hover:shadow-md transition-all group flex flex-col justify-between space-y-3 active:scale-[0.99]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 group-hover:bg-rose-50 group-hover:text-rose-700 transition-colors">
                      {art.badge}
                    </span>
                    {art.readTime && (
                      <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {art.readTime}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2 leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                    {art.desc}
                  </p>
                </div>
                <div className="pt-2 flex items-center text-[10px] font-black text-rose-600 group-hover:underline">
                  <span>Read Full Guide &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Tools Internal Links Section */}
      <section className="space-y-4 sm:space-y-6 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-2xl font-black text-slate-900">
            Explore Related FileZenith Tools
          </h2>
          <Link href="/" className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {relatedTools.map((rel, idx) => (
            <Link
              key={idx}
              href={rel.slug}
              className="p-3.5 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col justify-between space-y-3 active:scale-[0.99]"
            >
              <div className="space-y-1.5">
                <span className="text-xs font-black text-indigo-700 group-hover:underline block leading-snug">
                  {rel.name}
                </span>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  {rel.desc}
                </p>
              </div>
              <div className="pt-2 flex items-center text-[10px] font-black text-slate-400 group-hover:text-indigo-600">
                <span>Use Tool Now &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
