import type { Metadata } from 'next';

export interface CategoryToolItem {
  name: string;
  slug: string;
  description: string;
  isPopular?: boolean;
  badge?: string;
  iconName?: string;
}

export interface CategorySubgroup {
  title: string;
  description: string;
  tools: CategoryToolItem[];
}

export interface CategoryLinkItem {
  name: string;
  slug: string;
  desc: string;
}

export interface CategoryConfig {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  subgroups: CategorySubgroup[];
  popularTools: CategoryToolItem[];
  faqs: Array<{ question: string; answer: string }>;
  relatedCategories: CategoryLinkItem[];
  keywords?: string[];
}

export const CATEGORY_REGISTRY: Record<string, CategoryConfig> = {
  'pdf-tools': {
    slug: 'pdf-tools',
    title: 'Free Online PDF Tools: Merge, Split, Compress & Edit PDF Files',
    metaTitle: 'Free Online PDF Tools: Merge, Split, Compress & Edit | FileZenith',
    metaDescription: '100% Free browser-based PDF tools. Merge PDF files, split pages, compress PDF under 100KB & 200KB, convert PDF to Word, extract OCR text, watermark, and edit PDFs with zero server uploads.',
    h1: 'Free Online PDF Tools & Document Utilities',
    intro: 'Organize, compress, convert, and edit your PDF files directly inside your browser. Powered by WebAssembly and local client-side processing — your confidential documents are never uploaded to any cloud server, with zero file size caps and zero subscriptions.',
    subgroups: [
      {
        title: 'PDF Compression & Optimization',
        description: 'Reduce PDF file size for email attachments, university submissions, and sarkari portal uploads.',
        tools: [
          { name: 'Compress PDF', slug: '/pdf/compress', description: 'Universal PDF compressor to shrink file size up to 80% without losing text sharpness or quality.', isPopular: true, badge: 'Popular', iconName: 'Minimize2' },
          { name: 'Compress PDF to 100KB', slug: '/pdf/compress-to-100kb', description: 'Target 100KB PDF compressor for sarkari exam, UPSC, SSC, and state recruitment portals.', isPopular: true, badge: 'Target 100KB', iconName: 'Minimize2' },
          { name: 'Compress PDF to 200KB', slug: '/pdf/compress-to-200kb', description: 'Target 200KB compressor for college admissions, job applications & visa portals.', isPopular: true, badge: 'Target 200KB', iconName: 'Minimize2' },
          { name: 'Compress PDF to 1MB', slug: '/pdf/compress-to-1mb', description: 'Compress multi-page PDFs under 1MB for email attachments & corporate portal uploads.', isPopular: true, badge: 'Target 1MB', iconName: 'Minimize2' }
        ]
      },
      {
        title: 'PDF Page Organization & Merging',
        description: 'Organize, rearrange, merge, and split PDF documents with drag-and-drop simplicity.',
        tools: [
          { name: 'Merge PDF Files', slug: '/pdf/merge', description: 'Combine multiple PDF documents into a single organized master PDF file in seconds.', isPopular: true, badge: 'Most Used', iconName: 'Combine' },
          { name: 'Combine Marksheets', slug: '/pdf/combine-marksheets', description: 'Merge 10th, 12th & Degree marksheets into 1 uniform A4 PDF strictly under 500KB.', isPopular: true, badge: 'College Ready', iconName: 'GraduationCap' },
          { name: 'Split PDF Pages', slug: '/pdf/split', description: 'Extract specific pages or separate PDF into distinct documents with custom page ranges.', isPopular: true, badge: 'Popular', iconName: 'Split' },
          { name: 'Organize PDF Pages', slug: '/pdf/organize', description: 'Reorder pages with drag-and-drop, rotate orientations, and delete unwanted pages.', iconName: 'Grid' },
          { name: 'PDF Page Numberer', slug: '/pdf/page-numbers', description: 'Add custom "Page X of Y" numbering, headers, and footers with custom placement.', badge: 'New', iconName: 'Hash' }
        ]
      },
      {
        title: 'PDF & Office Document Conversion',
        description: 'Convert between PDF and Microsoft Word DOCX, high-res images, and camera scans.',
        tools: [
          { name: 'PDF to Word Converter', slug: '/pdf/pdf-to-word', description: 'Convert PDF documents into fully editable Microsoft Word (.docx) files 100% privately.', isPopular: true, badge: 'Popular', iconName: 'FileText' },
          { name: 'Word to PDF Converter', slug: '/pdf/word-to-pdf', description: 'Convert Word DOCX documents into crisp, publication-ready PDF files instantly.', isPopular: true, badge: 'New', iconName: 'FileCode' },
          { name: 'PDF to JPG / PNG Converter', slug: '/pdf/to-image', description: 'Extract and convert every PDF page into high-resolution JPG or PNG image files.', iconName: 'FileImage' },
          { name: 'Pics to PDF Converter', slug: '/image/pics-to-pdf', description: 'Combine photos, camera scans, JPG, PNG & WebP images into a single clean PDF document.', isPopular: true, badge: 'Popular', iconName: 'Camera' }
        ]
      },
      {
        title: 'PDF Editing, Security & OCR Text Extraction',
        description: 'Annotate PDFs, extract selectable text from scans, encrypt files, or unlock bank statements.',
        tools: [
          { name: 'Edit PDF Online', slug: '/pdf/edit', description: 'Add custom text, whiteout sensitive details, draw annotations, and add digital signatures.', isPopular: true, badge: 'Interactive', iconName: 'Edit3' },
          { name: 'Mask Aadhaar Card', slug: '/pdf/mask-aadhaar', description: 'Hide the first 8 digits of your Aadhaar card into XXXX-XXXX-1234 offline for KYC.', isPopular: true, badge: 'UIDAI Ready', iconName: 'ShieldCheck' },
          { name: 'Redact PDF Permanently', slug: '/pdf/redact', description: 'True zero-leak blackout tool that flattens vector layers to permanently destroy text underneath.', isPopular: true, badge: 'Zero-Leak', iconName: 'Eraser' },
          { name: 'PDF OCR Text Extractor', slug: '/pdf/ocr', description: 'Extract selectable text from scanned PDF pages and images using browser Tesseract OCR.', isPopular: true, badge: 'AI Wasm', iconName: 'FileCheck' },
          { name: 'Password Protect PDF', slug: '/pdf/protect', description: 'Encrypt your PDF documents with military-grade passwords before emailing or sharing.', badge: 'Secure', iconName: 'Lock' },
          { name: 'Remove PDF Password', slug: '/pdf/remove-password', description: 'Unlock and remove owner passwords from bank statements, payslips, and e-Aadhaar PDFs.', isPopular: true, badge: 'Unlock', iconName: 'Unlock' },
          { name: 'Watermark PDF', slug: '/pdf/watermark', description: 'Overlay custom confidential stamps, logos, or text watermarks across PDF pages.', iconName: 'Stamp' }
        ]
      }
    ],
    popularTools: [
      { name: 'PDF to Word Converter', slug: '/pdf/pdf-to-word', description: 'Convert PDF to editable Word DOCX 100% privately without cloud uploads.' },
      { name: 'Merge PDF Files', slug: '/pdf/merge', description: 'Combine multiple PDF documents into one master file effortlessly.' },
      { name: 'Compress PDF to 200KB', slug: '/pdf/compress-to-200kb', description: 'Target 200KB PDF compressor for email, university, and job forms.' },
      { name: 'Edit PDF Online', slug: '/pdf/edit', description: 'Annotate, sign, whiteout, and add text to PDF documents in your browser.' },
      { name: 'Word to PDF Converter', slug: '/pdf/word-to-pdf', description: 'Convert Word documents to high-quality PDF files with perfect styling.' },
      { name: 'Pics to PDF (JPG to PDF)', slug: '/image/pics-to-pdf', description: 'Convert camera photos, scans, and images into a single organized PDF.' }
    ],
    faqs: [
      {
        question: 'Are my uploaded PDF documents saved or visible on your servers?',
        answer: 'No! FileZenith is built on a 100% client-side engine. When you merge, split, compress, or edit PDFs, your files are processed entirely in your web browser memory using WebAssembly and PDF-Lib. Zero bytes are ever uploaded to any cloud server or stored in any database.'
      },
      {
        question: 'Is there any file size limit for merging or compressing PDFs?',
        answer: 'Unlike traditional online PDF converters that impose strict 15MB or 50MB file size caps, FileZenith has zero artificial file size limits. You can process large documents with hundreds of pages as long as your device has enough RAM memory.'
      },
      {
        question: 'How can I compress a PDF under 100KB or 200KB for government job portals?',
        answer: 'Use our dedicated "Compress PDF to 100KB" or "Compress PDF to 200KB" tools. Simply select your document, and our adaptive compression algorithm automatically calibrates image DPI, font subsets, and vector streams to meet the exact KB limit required by SSC, UPSC, and state portals.'
      },
      {
        question: 'Can I convert scanned or image-based PDFs into editable Word (.docx) documents?',
        answer: 'Yes! Our PDF to Word Converter incorporates client-side OCR technology. If your PDF contains scanned pages or images of text, our OCR engine recognizes characters and formats them into editable Microsoft Word paragraphs and tables.'
      },
      {
        question: 'How do I remove passwords from encrypted bank statements or payslips?',
        answer: 'Use our "Remove PDF Password" tool. Enter your document password once in your browser; the tool decrypts the PDF locally and exports an unlocked, permanent version that you can open anytime without typing passwords.'
      },
      {
        question: 'Can I use FileZenith PDF tools on mobile phones (Android & iPhone)?',
        answer: 'Yes! FileZenith is completely responsive and optimized for mobile browsers including Google Chrome, Safari, and Firefox. You can merge PDFs, compress documents, and convert files directly on your smartphone without downloading heavy apps.'
      },
      {
        question: 'Is FileZenith completely free, or will I be asked to pay a subscription?',
        answer: 'FileZenith is 100% free with no hidden subscriptions, trial periods, or file count quotas. All tools are unlocked for everyone, funded cleanly through unobtrusive web advertisements.'
      },
      {
        question: 'How does FileZenith compare to Adobe Acrobat Pro or iLovePDF?',
        answer: 'Traditional platforms upload your confidential files to their cloud servers, retain data for hours, and limit you to 2 free tasks per day before demanding $12-$20/month subscriptions. FileZenith processes everything locally on your device with absolute privacy, unlimited usage, and zero wait queues.'
      }
    ],
    relatedCategories: [
      { name: 'Image Tools', slug: '/image-tools', desc: 'Compress photos, convert HEIC, and resize passport images.' },
      { name: 'Utility & Calculators', slug: '/utility', desc: 'Financial calculators, converters, and daily productivity tools.' },
      { name: 'Social Media Tools', slug: '/social', desc: 'WhatsApp direct chat, thumbnail downloads, and bio fonts.' },
      { name: 'Govt Job Exam Tools', slug: '/govt-job-tools', desc: 'SSC, UPSC, Aadhaar print, and signature resizers.' }
    ],
    keywords: [
      'merge pdf online free',
      'compress pdf to 200kb',
      'compress pdf to 100kb',
      'compress pdf under 1mb',
      'pdf to word converter free',
      'word to pdf converter online',
      'split pdf pages free',
      'edit pdf online free without watermark',
      'remove password from pdf',
      'unlock bank statement pdf',
      'organize pdf pages',
      'add page numbers to pdf',
      'extract text from pdf ocr',
      'watermark pdf online',
      'pics to pdf converter',
      'jpg to pdf online free',
      'pdf to jpg converter',
      'sarkari result pdf compressor'
    ]
  },

  'image-tools': {
    slug: 'image-tools',
    title: 'Free Online Image Tools: Compress, Convert, Resize & Edit Images',
    metaTitle: 'Free Online Image Tools: Compress, Convert, Resize & Edit | FileZenith',
    metaDescription: '100% Free browser-based image tools. Compress image KB, resize photos, convert HEIC/PNG/JPG/SVG, remove backgrounds, format passport photos, and print Aadhaar cards with zero server uploads.',
    h1: 'Free Online Image Tools & Compressors',
    intro: 'Process, compress, convert, and resize images directly in your browser. No files uploaded to external servers, no watermark, and no account required.',
    subgroups: [
      {
        title: 'Image Compression Tools',
        description: 'Reduce image file size in KB while preserving sharp visual quality.',
        tools: [
          { name: 'Compress Image', slug: '/image/compress', description: 'Universal JPEG/PNG image compressor with interactive quality slider.', isPopular: true, badge: 'Popular', iconName: 'Minimize2' },
          { name: 'Compress Image to 20KB', slug: '/image/compress-to-20kb', description: 'Compress signature & photo under 20KB for online forms.', isPopular: true, badge: 'Target 20KB', iconName: 'Minimize2' },
          { name: 'Compress Image to 50KB', slug: '/image/compress-to-50kb', description: 'Target 50KB passport photo compressor for recruitment portals.', isPopular: true, badge: 'Target 50KB', iconName: 'Minimize2' },
          { name: 'Compress Image to 100KB', slug: '/image/compress-to-100kb', description: 'Compress document scans and certificates under 100KB.', iconName: 'Minimize2' }
        ]
      },
      {
        title: 'Image Conversion Tools',
        description: 'Convert between popular raster and vector image formats.',
        tools: [
          { name: 'WebP to JPG Converter', slug: '/image/webp-to-jpg', description: 'Convert WebP images to JPG format with white background fill.', isPopular: true, badge: 'Popular', iconName: 'FileImage' },
          { name: 'JPG to WebP Converter', slug: '/image/jpg-to-webp', description: 'Convert JPG/PNG images to modern WebP (up to 80% smaller).', isPopular: true, badge: 'Fast Web', iconName: 'Zap' },
          { name: 'PNG to JPG Converter', slug: '/image/png-to-jpg', description: 'Convert PNG images to JPG with white background.', isPopular: true, iconName: 'FileImage' },
          { name: 'JPG to PNG Converter', slug: '/image/jpg-to-png', description: 'Convert JPG photos to lossless PNG format.', iconName: 'FileImage' },
          { name: 'Apple HEIC to JPG Converter', slug: '/image/convert-heic', description: 'Convert iPhone and iPad HEIC camera photos to standard JPG.', isPopular: true, badge: 'iOS Photo', iconName: 'Smartphone' },
          { name: 'SVG Vector Converter', slug: '/image/svg-converter', description: 'Convert SVG vector files to high-res PNG or JPG.', iconName: 'FileCode' }
        ]
      },
      {
        title: 'Image Resizing & Biometric Framing',
        description: 'Resize dimensions, crop frames, and prepare official photos.',
        tools: [
          { name: 'Passport Photo Maker', slug: '/image/passport-maker', description: 'Create 3.5x4.5cm and 2x2" passport photos with official dimensions.', isPopular: true, badge: 'Official Format', iconName: 'UserCheck' },
          { name: 'Online Visa Photo Maker', slug: '/image/visa-photo-maker', description: 'Create official photos for US DS-160 (2x2"), Schengen, UK & Canada with biometric oval guide & 4x6 sheet.', isPopular: true, badge: 'US DS-160', iconName: 'UserCheck' },
          { name: 'Image Cropper & Aspect Ratio', slug: '/image/crop', description: 'Crop images to 1:1, 16:9, 4:3, or custom aspect ratios.', iconName: 'Crop' },
          { name: 'Resize Image Dimensions', slug: '/image/resize', description: 'Resize pixel width and height or scale by percentage.', iconName: 'Sliders' },
          { name: 'Pics to PDF Converter', slug: '/image/pics-to-pdf', description: 'Convert multiple photos into a single PDF document.', isPopular: true, badge: 'Popular', iconName: 'Camera' },
          { name: 'AI Background Remover', slug: '/image/remove-background', description: 'Remove photo backgrounds automatically in your browser.', isPopular: true, badge: '100% Local AI', iconName: 'Scissors' },
          { name: 'Color Palette Extractor', slug: '/image/color-palette-extractor', description: 'Extract dominant hex color codes from any image.', iconName: 'Palette' }
        ]
      },
      {
        title: 'Govt Job Exam Resizers & ID Tools',
        description: 'Specialized 100% in-browser photo, signature, and ID card tools for Indian recruitment portals.',
        tools: [
          { name: 'Aadhaar Card Print Tool (A4 & PVC)', slug: '/tools/aadhaar-card-print', description: 'Crop and print e-Aadhaar on A4 sheet & PVC card (85.6x54 mm).', isPopular: true, badge: 'A4 & PVC', iconName: 'Printer' },
          { name: 'SSC Photo Resizer (20-50KB)', slug: '/tools/ssc-photo-resizer', description: 'Format SSC CGL, CHSL, MTS photo with Name & Date stamp.', isPopular: true, badge: 'SSC 20-50KB', iconName: 'UserCheck' },
          { name: 'Signature Resizer 10 to 20KB', slug: '/tools/signature-resizer-10-to-20kb', description: 'Resize signature to 10-20KB with Magic B&W cleanup.', isPopular: true, badge: '10-20KB', iconName: 'Stamp' },
          { name: 'Railway RRB Photo Resizer', slug: '/tools/railway-rrb-photo-resizer', description: 'RRB NTPC, ALP, Group D 20-50KB photo resizer.', isPopular: true, badge: 'RRB 20-50KB', iconName: 'UserCheck' },
          { name: 'IBPS Photo Resizer', slug: '/tools/ibps-photo-resizer', description: 'IBPS PO, Clerk, RRB 200x230 px photo resizer.', isPopular: true, badge: 'IBPS 20-50KB', iconName: 'UserCheck' },
          { name: 'SBI PO Photo Resizer', slug: '/tools/sbi-po-photo-resizer', description: 'SBI PO & Clerk photo & signature resizer.', badge: 'SBI PO', iconName: 'UserCheck' },
          { name: 'JEE Main Photo Resizer', slug: '/tools/jee-photo-resizer', description: 'JEE Main & Advanced 10-200KB photo resizer with DOP.', isPopular: true, badge: 'JEE 10-200KB', iconName: 'UserCheck' },
          { name: 'CUET Photo Resizer', slug: '/tools/cuet-photo-resizer', description: 'CUET UG/PG 10-200KB photo & signature resizer.', badge: 'CUET NTA', iconName: 'UserCheck' },
          { name: 'UPSC Photo Resizer', slug: '/tools/upsc-photo-resizer', description: '350x350 px OTR square photo format with Name & Date.', badge: 'UPSC OTR', iconName: 'UserCheck' },
          { name: 'NEET Photo Resizer', slug: '/tools/neet-photo-resizer', description: 'NEET passport & postcard 4"x6" photo with DOP stamp.', badge: 'NEET UG', iconName: 'UserCheck' },
          { name: 'Photo Name & Date Generator', slug: '/tools/photo-name-date-generator', description: 'Overlay candidate full name and date on passport photos.', badge: 'Name & Date', iconName: 'Calendar' }
        ]
      }
    ],
    popularTools: [
      { name: 'Compress Image to 50KB', slug: '/image/compress-to-50kb', description: 'Target 50KB for SSC, IBPS, and Railway application forms.' },
      { name: 'Apple HEIC to JPG Converter', slug: '/image/convert-heic', description: 'Convert Apple iPhone HEIC photos to JPG format instantly.' },
      { name: 'Passport Photo Maker', slug: '/image/passport-maker', description: 'Format passport size photos for job forms with official specs.' },
      { name: 'Aadhaar Card Print Tool', slug: '/tools/aadhaar-card-print', description: 'Crop & print e-Aadhaar on A4 sheet or PVC card.' },
      { name: 'Signature Resizer 10 to 20KB', slug: '/tools/signature-resizer-10-to-20kb', description: 'Clean signature with Magic B&W cleanup for portals.' },
      { name: 'AI Background Remover', slug: '/image/remove-background', description: 'Remove backgrounds 100% in-browser with zero uploads.' }
    ],
    faqs: [
      {
        question: 'Are my uploaded images saved on any server?',
        answer: 'No! All FileZenith image processing occurs locally inside your browser using HTML5 Canvas and WebAssembly. Your images are never stored or uploaded to any remote server.'
      },
      {
        question: 'How do I compress an image to exactly 20KB or 50KB for job application forms?',
        answer: 'Use our dedicated "Compress Image to 20KB" or "Compress Image to 50KB" tools. Upload your photo or signature, and our algorithm iteratively calculates the exact compression ratio so your file meets strict portal ceilings.'
      },
      {
        question: 'How do I convert iPhone HEIC photos to JPG format on Windows or Android?',
        answer: 'Use our "HEIC to JPG Converter". It decodes Apple High-Efficiency Image Container (HEIC) files directly in your web browser and outputs standard JPEG files that open on any PC or phone.'
      },
      {
        question: 'What is the standard passport size photo dimension for official applications?',
        answer: 'The standard Indian passport photo dimension is 3.5 cm width by 4.5 cm height (approx 413 x 531 pixels at 300 DPI). For US Visas, it is 2x2 inches (600x600 pixels). Our Passport Photo Maker provides pre-set templates for both.'
      },
      {
        question: 'How can I crop and print an e-Aadhaar card on A4 paper or PVC card?',
        answer: 'Our Aadhaar Card Print Tool automatically crops the official UIDAI cut-piece and arranges it either as a 5-copy A4 sheet for cyber cafes or a standard 85.6 x 53.98 mm ISO/IEC 7810 ID-1 card format for PVC card printing.'
      },
      {
        question: 'Does FileZenith reduce image clarity when compressing photos?',
        answer: 'No. FileZenith uses intelligent bicubic re-sampling and progressive quantization. It eliminates invisible metadata and redundant color frequency while preserving sharp edges on text, facial features, and signatures.'
      },
      {
        question: 'How do I add my name and date of photo (DOP) on an SSC or exam photo?',
        answer: 'Use our "Photo Name & Date Generator" or "SSC Photo Resizer". Simply enter your candidate name and the date when the photo was taken, and the tool renders an official white text banner at the bottom of your passport photo.'
      },
      {
        question: 'Can I remove image backgrounds without installing software or paying?',
        answer: 'Yes! Our AI Background Remover runs an ONNX neural segmentation model locally in your browser. It detects the subject and removes the background cleanly, outputting a transparent PNG with zero server upload.'
      }
    ],
    relatedCategories: [
      { name: 'PDF Tools', slug: '/pdf-tools', desc: 'Merge, split, and compress PDF documents.' },
      { name: 'Govt Job Exam Tools', slug: '/govt-job-tools', desc: 'SSC, UPSC, Aadhaar print, and signature resizers.' },
      { name: 'Utility & Calculators', slug: '/utility', desc: 'Calculators, converters, and daily productivity tools.' },
      { name: 'Social Media Tools', slug: '/social', desc: 'WhatsApp direct chat, thumbnail downloads, and bio fonts.' }
    ],
    keywords: [
      'compress image to 50kb',
      'compress image to 20kb',
      'heic to jpg converter free',
      'passport photo maker online',
      'ssc photo resizer 20kb to 50kb',
      'signature resizer 10 to 20 kb',
      'aadhaar card print tool',
      'webp to jpg converter',
      'jpg to webp converter',
      'png to jpg converter',
      'remove background from image free',
      'pics to pdf converter',
      'photo name and date generator'
    ]
  },

  'utility': {
    slug: 'utility',
    title: 'Free Online Utility Tools: Calculators, Converters & Daily Productivity',
    metaTitle: 'Free Online Utility Tools: Calculators, Converters & Productivity | FileZenith',
    metaDescription: '35+ Free online utilities: Electricity bill calculator, EPF calculator, age calculator, EMI, GST, typing speed test, password generator, QR codes, and Apple iWork converters.',
    h1: 'Free Online Utilities, Calculators & Productivity Tools',
    intro: 'A complete suite of free browser utilities for students, developers, job seekers, and daily productivity. Calculate loans and taxes, convert Apple Pages and Numbers, format text, and generate secure passwords — 100% private in your browser.',
    subgroups: [
      {
        title: 'Financial & Government Calculators',
        description: 'Instant, precise financial and educational calculators for loans, taxes, EPF, age, and marks.',
        tools: [
          { name: 'Electricity Bill Calculator', slug: '/utility/electricity-bill-calculator', description: 'Calculate monthly electricity bill with state tariff slabs & subsidies.', isPopular: true, badge: 'State Slabs', iconName: 'DollarSign' },
          { name: 'EPF Balance Growth Calculator', slug: '/utility/epf-calculator', description: 'EPFO 8.25% retirement interest and maturity corpus calculator.', isPopular: true, badge: 'EPFO 8.25%', iconName: 'Coins' },
          { name: 'Age Calculator & Birthday', slug: '/utility/age-calculator', description: 'Calculate exact age in years, months, days, hours, and minutes with cut-off dates.', isPopular: true, badge: '#1 Trending', iconName: 'Calendar' },
          { name: 'Percentage Calculator', slug: '/utility/percentage-calculator', description: 'Calculate percentage difference, marks percentage, and discounts.', isPopular: true, badge: 'Daily Tool', iconName: 'Percent' },
          { name: 'CGPA to Percentage Calculator', slug: '/utility/cgpa-to-percentage', description: 'Convert CBSE, University CGPA/SGPA to percentage using standard 9.5 formula.', isPopular: true, badge: 'Student Tool', iconName: 'GraduationCap' },
          { name: 'EMI Loan Calculator', slug: '/utility/emi-calculator', description: 'Calculate home, car, and personal loan monthly EMI with amortization schedule.', isPopular: true, badge: 'High RPM', iconName: 'DollarSign' },
          { name: 'Income Tax Calculator (Old vs New)', slug: '/utility/income-tax-calculator', description: 'Compare Old vs New Tax Regime savings for FY 2026-27.', isPopular: true, badge: 'Tax Season', iconName: 'DollarSign' },
          { name: 'SIP Mutual Fund Calculator', slug: '/utility/sip-calculator', description: 'Calculate future wealth compounding returns for monthly SIP investments.', isPopular: true, badge: 'Wealth', iconName: 'DollarSign' },
          { name: 'CTC to In-Hand Salary Calculator', slug: '/utility/salary-calculator', description: 'Calculate monthly take-home salary after PF, PT, and TDS deductions.', isPopular: true, badge: 'Salary', iconName: 'DollarSign' },
          { name: 'Free Invoice & Rent Receipt Maker', slug: '/utility/invoice-generator', description: 'Create professional client invoices and HRA rent receipts with instant vector PDF download.', isPopular: true, badge: 'Zero Sign-Up', iconName: 'Receipt' },
          { name: 'GST Tax Calculator', slug: '/utility/gst-calculator', description: 'Add or remove GST tax for 5%, 12%, 18%, 28% slabs with CGST/SGST split.', isPopular: true, badge: 'Tax Tool', iconName: 'Percent' },
          { name: 'BMI & Health Calculator', slug: '/utility/bmi-calculator', description: 'Calculate Body Mass Index, health category, and ideal weight target.', isPopular: true, badge: 'Health', iconName: 'Zap' }
        ]
      },
      {
        title: 'Apple iWork & Office Document Converters',
        description: 'Convert between Apple Pages, Numbers, Microsoft Word, and Excel formats.',
        tools: [
          { name: 'Pages to Word (DOCX)', slug: '/utility/pages-to-word', description: 'Convert Apple Pages (.pages) to editable Word (.docx) for Windows PC.', isPopular: true, badge: 'Apple Tool', iconName: 'FileText' },
          { name: 'Word to Pages Converter', slug: '/utility/word-to-pages', description: 'Convert Microsoft Word (.docx) documents to Apple Pages format.', isPopular: true, badge: 'New', iconName: 'FileCode' },
          { name: 'Numbers to Excel (XLSX)', slug: '/utility/numbers-to-excel', description: 'Convert Apple Numbers (.numbers) spreadsheets to Microsoft Excel (.xlsx).', isPopular: true, badge: 'Apple Tool', iconName: 'Table' },
          { name: 'Excel to Numbers Converter', slug: '/utility/excel-to-numbers', description: 'Convert Excel workbooks to Apple Numbers format cleanly.', isPopular: true, badge: 'New', iconName: 'Table' },
          { name: 'Keynote to PowerPoint & PDF', slug: '/utility/keynote-to-powerpoint', description: 'Convert Apple Keynote (.key) presentations into universal PDF and slide decks.', isPopular: true, badge: 'Keynote .key', iconName: 'Presentation' },
          { name: 'Markdown Editor & PDF', slug: '/utility/markdown-editor', description: 'Live Markdown preview editor with instant PDF and HTML export.', iconName: 'FileText' }
        ]
      },
      {
        title: 'Writing, Speech & Text Utilities',
        description: 'Count words, test typing speed, generate stylish fonts, and convert numbers to words.',
        tools: [
          { name: 'Word & Character Counter', slug: '/utility/word-counter', description: 'Count words, characters, sentences, paragraphs, and reading time in real-time.', isPopular: true, badge: 'Upgraded', iconName: 'Type' },
          { name: 'Typing Speed Test (WPM Cert)', slug: '/utility/typing-speed-test', description: 'Test typing speed in WPM with accuracy score and downloadable PNG certificate.', isPopular: true, badge: 'Viral Test', iconName: 'Zap' },
          { name: 'Fancy Text Generator', slug: '/utility/fancy-text-generator', description: 'Generate 30+ stylish Unicode fonts for Instagram bio and WhatsApp.', isPopular: true, badge: 'Cool Fonts', iconName: 'Sparkles' },
          { name: 'Number to Words Converter', slug: '/utility/number-to-words', description: 'Convert numbers into words and currency cheques (USD / INR Lakhs & Crores).', isPopular: true, badge: 'Cheque Tool', iconName: 'DollarSign' },
          { name: 'Text Case Converter', slug: '/utility/case-converter', description: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, and snake_case.', badge: 'Writing', iconName: 'Type' },
          { name: 'Text Repeater (10,000x)', slug: '/utility/text-repeater', description: 'Repeat messages, emojis, and text strings up to 10,000 times for messaging.', badge: 'Viral', iconName: 'Sparkles' },
          { name: 'Free Text to Speech (TTS)', slug: '/utility/text-to-speech', description: 'Browser-based voice synthesizer with zero character caps.', badge: 'No Limit', iconName: 'Volume2' }
        ]
      },
      {
        title: 'Developer & Security Utilities',
        description: 'Fast, secure utilities for web developers and programmers.',
        tools: [
          { name: 'Password Generator', slug: '/utility/password-generator', description: 'Generate strong, cryptographically secure passwords 100% offline.', isPopular: true, badge: 'Secure', iconName: 'Lock' },
          { name: 'PDF & EXIF Metadata Remover', slug: '/utility/metadata-remover', description: 'Scrub hidden camera EXIF, GPS location, author name, and editing software from PDFs and images.', isPopular: true, badge: 'Privacy Scrub', iconName: 'EyeOff' },
          { name: 'QR Code Generator', slug: '/utility/qr-generator', description: 'Create custom QR codes for URLs, WiFi credentials, vCards, and text.', isPopular: true, badge: 'Custom QR', iconName: 'QrCode' },
          { name: 'JSON Formatter & Validator', slug: '/utility/json-formatter', description: 'Format, beautify, minify, and validate JSON data with syntax highlighting.', isPopular: true, badge: 'Popular', iconName: 'Code2' },
          { name: 'Base64 Encoder / Decoder', slug: '/utility/base64', description: 'Encode or decode text, files, and images into Base64 format securely.', isPopular: true, iconName: 'Code2' },
          { name: 'Hash Generator (MD5 / SHA)', slug: '/utility/hash-generator', description: 'Generate MD5, SHA-1, SHA-256 and verify file checksum integrity.', isPopular: true, badge: 'Checksum', iconName: 'Hash' },
          { name: 'URL Encoder / Decoder', slug: '/utility/url-encoder-decoder', description: 'Encode or decode URLs and inspect query parameters cleanly.', isPopular: true, badge: 'RFC 3986', iconName: 'FileCode' },
          { name: 'Glassmorphism CSS Generator', slug: '/utility/glassmorphism-generator', description: 'Generate frosted glass CSS backdrop-filter snippets interactively.', badge: 'UI Tool', iconName: 'Hexagon' }
        ]
      },
      {
        title: 'Interactive Decision & Focus Tools',
        description: 'Fun, engaging tools for daily productivity, study focus, and decisions.',
        tools: [
          { name: 'Pomodoro Timer & Study Clock', slug: '/utility/pomodoro-timer', description: 'Aesthetic 25-minute productivity timer with break alarms.', badge: 'Focus', iconName: 'Brain' },
          { name: 'Spin the Wheel & Name Picker', slug: '/utility/spin-the-wheel', description: 'Random winner decision picker with custom slices and confetti.', badge: 'Viral Tool', iconName: 'Dices' },
          { name: 'Coin Flip Online (3D Toss)', slug: '/utility/coin-flip', description: 'Realistic 3D heads or tails decision coin toss simulator.', badge: '3D Toss', iconName: 'Coins' },
          { name: 'Virtual Dice Roller (1-12 Dice)', slug: '/utility/dice-roller', description: 'Roll virtual 3D dice for board games and RPG tabletop gaming.', badge: '1-12 Dice', iconName: 'Dices' },
          { name: 'Random Number Picker & RNG', slug: '/utility/random-number-picker', description: 'Pick random numbers without duplicates and generate random PINs.', badge: 'RNG', iconName: 'Hash' },
          { name: 'Love Match Calculator', slug: '/utility/love-calculator', description: 'Fun love compatibility score calculator with shareable results.', badge: 'Fun', iconName: 'Sparkles' }
        ]
      }
    ],
    popularTools: [
      { name: 'Electricity Bill Calculator', slug: '/utility/electricity-bill-calculator', description: 'Calculate monthly electricity bill with state tariff slabs & subsidies.' },
      { name: 'Age Calculator & Birthday', slug: '/utility/age-calculator', description: 'Find your exact age down to days and minutes for exam forms.' },
      { name: 'EMI Loan Calculator', slug: '/utility/emi-calculator', description: 'Calculate monthly EMI loan repayments for home and car loans.' },
      { name: 'Income Tax Calculator', slug: '/utility/income-tax-calculator', description: 'Compare Old vs New Tax Regime savings for FY 2026-27.' },
      { name: 'Pages to Word (DOCX)', slug: '/utility/pages-to-word', description: 'Convert Apple Pages files to Microsoft Word on Windows PC.' },
      { name: 'Typing Speed Test', slug: '/utility/typing-speed-test', description: 'Test your WPM typing speed and download a verified certificate.' }
    ],
    faqs: [
      {
        question: 'Are FileZenith financial calculators updated with the latest 2026-27 rules?',
        answer: 'Yes! Our Income Tax Calculator incorporates both the revised Old and New Tax Regimes for FY 2026-27 (AY 2027-28), including updated standard deduction caps and slab thresholds. Our EPF Calculator uses the official 8.25% EPFO interest rate.'
      },
      {
        question: 'How does the Electricity Bill Calculator handle state tariff slabs and subsidies?',
        answer: 'Our Electricity Bill Calculator includes pre-configured tariff slabs for major state electricity boards (including MSEDCL, BSES Delhi, UPPCL, BESCOM, TANGEDCO). It automatically factors in free unit subsidies (such as Delhi 200 units or Karnataka Gruha Jyothi) and fixed meter charges.'
      },
      {
        question: 'How can I open Apple Pages (.pages) or Numbers (.numbers) on a Windows PC?',
        answer: 'Windows PC cannot natively open Apple iWork files. Use our "Pages to Word" or "Numbers to Excel" converters. Upload your .pages or .numbers file, and our tool extracts the internal document XML and converts it into standard Microsoft Word (.docx) or Excel (.xlsx) formats.'
      },
      {
        question: 'Are generated passwords safe and kept private?',
        answer: 'Yes. Our Password Generator utilizes your browser native window.crypto.getRandomValues() cryptographic API. Passwords are generated strictly in your computer local memory and are never transmitted across the network or stored in any log.'
      },
      {
        question: 'How does the Typing Speed Test calculate WPM and accuracy?',
        answer: 'WPM (Words Per Minute) is calculated using the international standard formula: (Total Characters typed / 5) divided by time in minutes. Errors reduce your Net WPM score. Once finished, you can download a personalized PNG certificate showing your typing speed and accuracy.'
      },
      {
        question: 'Does the QR Code Generator create permanent, non-expiring QR codes?',
        answer: 'Yes! FileZenith generates static QR codes where your data (URL, WiFi, text) is directly encoded into the matrix. Static QR codes never expire, have zero scan limits, and do not redirect through third-party servers.'
      },
      {
        question: 'How do I convert CGPA to percentage using the official formula?',
        answer: 'For CBSE Class 10/12 and most Indian engineering universities, the standard formula is Percentage = CGPA × 9.5. Our CGPA to Percentage Calculator computes this instantly and also supports university-specific multipliers (such as Mumbai University or VTU).'
      },
      {
        question: 'Can I use these utility tools offline without an active internet connection?',
        answer: 'Yes! Once the page is loaded in your browser, virtually all utility tools (calculators, text converters, password generators, and decision tools) execute purely via client-side JavaScript and work completely offline.'
      }
    ],
    relatedCategories: [
      { name: 'PDF Tools', slug: '/pdf-tools', desc: 'Merge, split, and compress PDF documents.' },
      { name: 'Image Tools', slug: '/image-tools', desc: 'Compress, convert, and resize images.' },
      { name: 'Social Media Tools', slug: '/social', desc: 'WhatsApp direct chat, thumbnail downloads, and bio fonts.' },
      { name: 'Govt Job Exam Tools', slug: '/govt-job-tools', desc: 'SSC, UPSC, Aadhaar print, and signature resizers.' }
    ],
    keywords: [
      'electricity bill calculator india',
      'epf balance growth calculator',
      'age calculator for govt exams',
      'cgpa to percentage cbse calculator',
      'emi calculator for home loan',
      'old vs new tax regime calculator 2026',
      'pages to word converter free',
      'numbers to excel converter',
      'typing speed test wpm certificate',
      'word and character counter online',
      'password generator offline secure',
      'custom qr code generator free',
      'json formatter beautifier online'
    ]
  },

  'social': {
    slug: 'social',
    title: 'Free Online Social Media Tools: WhatsApp Direct, YouTube Downloader & Bio Fonts',
    metaTitle: 'Free Social Media Tools: WhatsApp Direct, YouTube Thumbnails & Bio | FileZenith',
    metaDescription: '100% Free online social media tools: Launch WhatsApp chats without saving numbers, download 1080p YouTube thumbnails, extract video tags, and generate stylish bio fonts.',
    h1: 'Free Online Social Media Utilities & Creator Tools',
    intro: 'Streamline your social media workflow with instant, client-side tools. Start WhatsApp chats with unsaved numbers, download crystal-clear 1080p YouTube video thumbnails, extract ranking tags, and format eye-catching bio fonts — no app installs or logins required.',
    subgroups: [
      {
        title: 'WhatsApp & Messaging Helpers',
        description: 'Chat directly without cluttering your address book contacts.',
        tools: [
          { name: 'WhatsApp Direct Chat Launcher', slug: '/social/whatsapp-direct-chat', description: 'Open WhatsApp chats directly with any phone number without saving it to your contacts.', isPopular: true, badge: 'wa.me', iconName: 'MessageSquare' }
        ]
      },
      {
        title: 'YouTube Media & SEO Extraction',
        description: 'Download HD video covers and extract keywords to boost video rankings.',
        tools: [
          { name: 'YouTube 1080p Thumbnail DL', slug: '/social/youtube-thumbnail-downloader', description: 'Download maximum resolution (1080p Full HD) thumbnail images from any YouTube video URL.', isPopular: true, badge: '1080p HD', iconName: 'Camera' },
          { name: 'YouTube SEO Tag Extractor', slug: '/social/youtube-tag-extractor', description: 'Extract ranking keywords, video tags, and metadata to boost your video SEO and visibility.', isPopular: true, badge: 'SEO Tags', iconName: 'Hash' }
        ]
      },
      {
        title: 'Creator Fonts, Bios & Profile Links',
        description: 'Format bios, generate viral text, and encode clean links for social profiles.',
        tools: [
          { name: 'Instagram Caption Copier', slug: '/social/instagram-caption-copier', description: 'Copy clean Instagram captions, quotes, and hashtags with proper line breaks.', isPopular: true, badge: 'Captions', iconName: 'Type' },
          { name: 'Fancy Text & Bio Font Generator', slug: '/utility/fancy-text-generator', description: 'Generate 30+ stylish Unicode fonts and gaming nicknames for Instagram, TikTok, and WhatsApp bios.', isPopular: true, badge: 'Cool Fonts', iconName: 'Sparkles' },
          { name: 'Custom QR Code Generator', slug: '/utility/qr-generator', description: 'Generate custom QR codes linking to your social profiles, Linktree, and YouTube channel.', isPopular: true, badge: 'Custom QR', iconName: 'QrCode' },
          { name: 'URL Encoder / Decoder', slug: '/utility/url-encoder-decoder', description: 'Encode social campaign UTM parameters and clean redirected URLs cleanly.', badge: 'RFC 3986', iconName: 'FileCode' },
          { name: 'Text Repeater (10,000x)', slug: '/utility/text-repeater', description: 'Repeat viral messages, emojis, and fun text chains up to 10,000 times for WhatsApp and Telegram.', badge: 'Viral', iconName: 'Sparkles' }
        ]
      }
    ],
    popularTools: [
      { name: 'WhatsApp Direct Chat Launcher', slug: '/social/whatsapp-direct-chat', description: 'Chat on WhatsApp without saving strangers or business numbers.' },
      { name: 'YouTube 1080p Thumbnail DL', slug: '/social/youtube-thumbnail-downloader', description: 'Download Full HD 1080p cover images from any YouTube video URL.' },
      { name: 'YouTube SEO Tag Extractor', slug: '/social/youtube-tag-extractor', description: 'Find competitor video tags and viral keywords with one click.' },
      { name: 'Fancy Text Generator', slug: '/utility/fancy-text-generator', description: 'Generate stylish aesthetic Unicode fonts for Instagram & TikTok bios.' }
    ],
    faqs: [
      {
        question: 'How does WhatsApp Direct Chat work without saving the phone number?',
        answer: 'WhatsApp provides an official deep link API ("https://wa.me/<number>"). Our tool formats the international country code and phone number, allowing your phone or WhatsApp Web to launch an instant conversation without creating a new address book entry.'
      },
      {
        question: 'Does FileZenith store or access my WhatsApp messages or contacts?',
        answer: 'Never. FileZenith simply generates the official WhatsApp deep link locally in your browser. We never have access to your contacts, chat history, or personal messages.'
      },
      {
        question: 'Is it legal to download YouTube video thumbnail covers?',
        answer: 'YouTube thumbnails are publicly accessible media assets. Downloading thumbnails for personal reference, fair use analysis, design inspiration, or backup of your own content is generally permitted. However, re-uploading other creators artwork as your own may infringe on copyright.'
      },
      {
        question: 'What resolution thumbnail will I get from the YouTube Thumbnail Downloader?',
        answer: 'Our tool fetches the highest available quality from YouTube CDN, starting with maximum resolution 1080p ("maxresdefault.jpg" at 1920x1080). If the creator uploaded a lower-res image, it seamlessly falls back to 720p or standard high definition.'
      },
      {
        question: 'How can I use the extracted YouTube tags to rank my own videos?',
        answer: 'Enter the URL of high-ranking competitor videos in your niche. Our Tag Extractor reveals the hidden keywords and search terms the creator tagged. You can analyze their keyword strategy, identify missing topic clusters, and incorporate relevant keywords into your own video titles and descriptions.'
      },
      {
        question: 'Do fancy Unicode fonts work on all phones (iPhone and Android)?',
        answer: 'Yes! Fancy text relies on universal Unicode alphanumeric mathematical symbols that are natively supported on modern iOS, Android, macOS, and Windows operating systems. They display properly in Instagram bios, TikTok profiles, Discord usernames, and WhatsApp messages.'
      },
      {
        question: 'Why do line breaks disappear on Instagram captions, and how does your tool fix it?',
        answer: 'Instagram default text parser frequently collapses blank returns and empty line breaks. Our Instagram Caption tool inserts invisible whitespace characters (such as non-breaking space and zero-width joiners) between paragraphs so your formatting stays perfectly structured.'
      },
      {
        question: 'Are there daily limits on using these social media tools?',
        answer: 'No! All social media utilities on FileZenith are completely free with zero limits on searches, downloads, or chat launches.'
      }
    ],
    relatedCategories: [
      { name: 'Utility Tools', slug: '/utility', desc: 'Calculators, text formatters, and password generators.' },
      { name: 'Image Tools', slug: '/image-tools', desc: 'Compress, crop, and convert images.' },
      { name: 'PDF Tools', slug: '/pdf-tools', desc: 'Merge, split, and compress PDF documents.' }
    ],
    keywords: [
      'whatsapp direct chat without saving number',
      'youtube thumbnail downloader 1080p full hd',
      'youtube tag extractor seo tool',
      'instagram caption copier with line breaks',
      'fancy text generator for instagram bio',
      'stylish font generator for whatsapp',
      'text repeater 10000 times online free',
      'qr code generator for social media profile'
    ]
  },

  'productivity-tools': {
    slug: 'productivity-tools',
    title: 'Free Online Productivity Tools: Password Generator, QR Code & Office Converters',
    metaTitle: 'Free Online Productivity Tools | FileZenith',
    metaDescription: 'Boost daily workflow with free productivity tools: Random password generator, QR code maker, Apple iWork converters, and document utilities.',
    h1: 'Free Online Productivity & Security Utilities',
    intro: 'Tools designed to streamline daily tasks, protect password security, and format documents quickly with 100% in-browser privacy.',
    subgroups: [
      {
        title: 'Apple iWork & Office Document Conversion',
        description: 'Convert between Apple Pages, Numbers, Microsoft Word, and Excel formats.',
        tools: [
          { name: 'Pages to Word Converter', slug: '/utility/pages-to-word', description: 'Convert Apple Pages (.pages) to Word (.docx) for Windows PC.', isPopular: true, badge: 'Apple Tool', iconName: 'FileText' },
          { name: 'Word to Pages Converter', slug: '/utility/word-to-pages', description: 'Convert Microsoft Word (.docx) to Apple Pages format.', isPopular: true, badge: 'New', iconName: 'FileCode' },
          { name: 'Numbers to Excel Converter', slug: '/utility/numbers-to-excel', description: 'Convert Apple Numbers (.numbers) to Excel (.xlsx) spreadsheets.', isPopular: true, badge: 'Apple Tool', iconName: 'Table' },
          { name: 'Excel to Numbers Converter', slug: '/utility/excel-to-numbers', description: 'Convert Excel spreadsheets to Apple Numbers format.', isPopular: true, badge: 'New', iconName: 'Table' }
        ]
      },
      {
        title: 'Security & Utility Tools',
        description: 'Boost your personal and professional workflow.',
        tools: [
          { name: 'Password Generator', slug: '/utility/password-generator', description: 'Generate strong, cryptographically secure passwords 100% offline.', isPopular: true, badge: 'Secure', iconName: 'Lock' },
          { name: 'QR Code Generator', slug: '/utility/qr-generator', description: 'Generate custom QR codes for links, WiFi, and contact cards.', isPopular: true, badge: 'Custom QR', iconName: 'QrCode' },
          { name: 'Word & Character Counter', slug: '/utility/word-counter', description: 'Track word count, character count, and reading time in real-time.', isPopular: true, badge: 'Upgraded', iconName: 'Type' },
          { name: 'JSON Formatter & Validator', slug: '/utility/json-formatter', description: 'Format, beautify, and validate JSON data safely.', isPopular: true, badge: 'Popular', iconName: 'Code2' }
        ]
      }
    ],
    popularTools: [
      { name: 'Pages to Word Converter', slug: '/utility/pages-to-word', description: 'Open Apple Pages files in Word on Windows PC.' },
      { name: 'Numbers to Excel Converter', slug: '/utility/numbers-to-excel', description: 'Convert Apple Numbers spreadsheets to Excel.' },
      { name: 'Password Generator', slug: '/utility/password-generator', description: 'Create strong passwords to protect your accounts.' },
      { name: 'QR Code Generator', slug: '/utility/qr-generator', description: 'Generate QR codes for instant mobile sharing.' }
    ],
    faqs: [
      {
        question: 'Are generated passwords stored, transmitted, or logged anywhere?',
        answer: 'Never! Passwords are generated strictly inside your browser local memory using the cryptographically secure window.crypto.getRandomValues() API. Zero bytes are ever transmitted over the network or stored in any database.'
      },
      {
        question: 'How do I convert Apple Pages (.pages) documents to Word (.docx) on a Windows PC?',
        answer: 'Simply drop your .pages file into our Pages to Word tool. It unpacks the Apple iWork package, parses the document tree, and reconstructs standard Microsoft Word DOCX styling locally in your web browser.'
      },
      {
        question: 'How can I open Apple Numbers (.numbers) spreadsheets in Microsoft Excel?',
        answer: 'Our Numbers to Excel tool parses the internal protobuf tables of Apple Numbers workbooks and converts sheets, rows, and cell values directly into Microsoft Excel (.xlsx) format without needing a Mac or iCloud account.'
      },
      {
        question: 'Can I convert Microsoft Word (.docx) documents into native Apple Pages (.pages) format?',
        answer: 'Yes! Our Word to Pages tool parses your DOCX document hierarchy and bundles it into an Apple Pages package that opens natively on iPad, iPhone, and Mac with zero formatting drift.'
      },
      {
        question: 'Do generated QR codes expire, or is there a limit on scans?',
        answer: 'All QR codes created on FileZenith are static and permanent. The payload (URL, text, Wi-Fi password, or vCard) is directly etched into the matrix pattern, meaning they never expire and have unlimited scans forever.'
      },
      {
        question: 'How does the Word and Character Counter measure reading and speaking speed?',
        answer: 'Our counter uses cognitive benchmarks: 200 words per minute for average silent reading speed and 130 words per minute for professional spoken delivery, providing precise estimates for speeches, essays, and articles.'
      },
      {
        question: 'Is my JSON data validated securely without exposing proprietary payloads?',
        answer: 'Yes! JSON formatting, tree inspection, and syntax validation execute 100% client-side in browser memory. No tokens, private APIs, or JSON payloads ever touch any remote server.'
      },
      {
        question: 'Can I use these productivity utilities on mobile phones (Android & iPhone)?',
        answer: 'Yes! All productivity tools are fully responsive, touch-friendly, and optimized for mobile Safari, Chrome, and Firefox without requiring app installs or account sign-ups.'
      }
    ],
    relatedCategories: [
      { name: 'Daily Utilities', slug: '/utility', desc: 'Calculators, text formatters, and utilities.' },
      { name: 'PDF Tools', slug: '/pdf-tools', desc: 'Merge, split, and compress PDFs.' },
      { name: 'Developer Tools', slug: '/developer-tools', desc: 'Developer encoding utilities.' }
    ]
  },

  'calculators': {
    slug: 'calculators',
    title: 'Free Online Calculators: Age, Percentage, EMI & CGPA to Percentage',
    metaTitle: 'Free Online Calculators: Age, Percentage & CGPA | FileZenith',
    metaDescription: 'Calculate exact age, percentage discounts, marks percentage, and convert CGPA to percentage instantly with free online calculators.',
    h1: 'Free Online Financial & Educational Calculators',
    intro: 'Instant, precise, mobile-friendly calculators for students, job applicants, business owners, and daily financial planning.',
    subgroups: [
      {
        title: 'Popular Financial & Student Calculators',
        description: 'Calculators for loans, income tax, mutual funds, salary, GST, age, and marks.',
        tools: [
          { name: 'Electricity Bill Calculator', slug: '/utility/electricity-bill-calculator', description: 'Calculate monthly electricity bill with state tariff slabs & subsidies.', isPopular: true, badge: 'State Slabs', iconName: 'DollarSign' },
          { name: 'EPF Balance Growth Calculator', slug: '/utility/epf-calculator', description: 'EPFO 8.25% retirement interest and maturity calculator.', isPopular: true, badge: 'EPFO 8.25%', iconName: 'Coins' },
          { name: 'Age Calculator', slug: '/utility/age-calculator', description: 'Calculate exact age in years, months, days, hours, and minutes.', isPopular: true, badge: '#1 Trending', iconName: 'Calendar' },
          { name: 'Percentage Calculator', slug: '/utility/percentage-calculator', description: 'Calculate percentage difference, increase/decrease, and discount.', isPopular: true, badge: 'Daily Tool', iconName: 'Percent' },
          { name: 'CGPA to Percentage Calculator', slug: '/utility/cgpa-to-percentage', description: 'Convert CBSE, University CGPA/SGPA to percentage.', isPopular: true, badge: 'Student Tool', iconName: 'GraduationCap' },
          { name: 'EMI Loan Calculator', slug: '/utility/emi-calculator', description: 'Calculate home, car, and personal loan monthly EMI with schedule.', isPopular: true, badge: 'High RPM', iconName: 'DollarSign' },
          { name: 'Income Tax Calculator (Old vs New)', slug: '/utility/income-tax-calculator', description: 'Compare Old vs New Tax Regime savings for FY 2026-27.', isPopular: true, badge: 'Tax Season', iconName: 'DollarSign' },
          { name: 'SIP Mutual Fund Calculator', slug: '/utility/sip-calculator', description: 'Calculate future wealth compounding returns for monthly SIP investments.', isPopular: true, badge: 'Wealth', iconName: 'DollarSign' },
          { name: 'CTC to In-Hand Salary Calculator', slug: '/utility/salary-calculator', description: 'Calculate monthly take-home salary after PF, PT, and TDS.', isPopular: true, badge: 'Salary', iconName: 'DollarSign' },
          { name: 'GST Calculator', slug: '/utility/gst-calculator', description: 'Add or remove GST tax for 5%, 12%, 18%, 28% slabs.', isPopular: true, badge: 'Tax Tool', iconName: 'Percent' },
          { name: 'BMI Calculator', slug: '/utility/bmi-calculator', description: 'Calculate Body Mass Index and ideal weight target.', isPopular: true, badge: 'Health', iconName: 'Zap' }
        ]
      }
    ],
    popularTools: [
      { name: 'EMI Loan Calculator', slug: '/utility/emi-calculator', description: 'Calculate monthly EMI loan repayments.' },
      { name: 'Income Tax Calculator', slug: '/utility/income-tax-calculator', description: 'Compare Old vs New Tax Regime.' },
      { name: 'Age Calculator', slug: '/utility/age-calculator', description: 'Find your exact age down to days and minutes.' },
      { name: 'Percentage Calculator', slug: '/utility/percentage-calculator', description: 'Quick marks percentage and discount math.' }
    ],
    faqs: [
      {
        question: 'How is CGPA to Percentage calculated for CBSE and Indian universities?',
        answer: 'For CBSE Class 10 and 12, the official conversion formula is Percentage = CGPA × 9.5. For universities following a 10-point scale (such as AICTE, VTU, Mumbai University), our tool supports both the 9.5 multiplier and custom college grade conversion formulas.'
      },
      {
        question: 'Can I calculate my exact age down to days and minutes for competitive exam eligibility?',
        answer: 'Yes! Enter your Date of Birth and the official exam notification cut-off date. The Age Calculator outputs your exact age in years, months, days, hours, and minutes to ensure 100% eligibility compliance for UPSC, SSC, IBPS, and State PSC forms.'
      },
      {
        question: 'How does the Electricity Bill Calculator factor in state tariff slabs and free subsidies?',
        answer: 'Our calculator includes built-in tariff schedules for Indian state discoms (MSEDCL, BSES, UPPCL, BESCOM, TANGEDCO). It factors in progressive energy tiers, fuel adjustment charges (FAC), fixed meter fees, and government subsidies like Delhi 200 free units or Karnataka Gruha Jyothi.'
      },
      {
        question: 'What is the difference between Old and New Income Tax Regimes for FY 2026-27?',
        answer: 'The New Tax Regime provides lower progressive tax slab rates and an increased standard deduction (up to ₹75,000), but eliminates exemptions like HRA and 80C. The Old Regime permits deductions for Home Loan interest (24b), 80C, 80D, and HRA. Our calculator compares both side-by-side to find your maximum tax savings.'
      },
      {
        question: 'How is monthly loan EMI calculated using standard amortization formulas?',
        answer: 'Loan EMI is calculated using the standard formula: EMI = [P × R × (1+R)^N] / [(1+R)^N - 1], where P is Principal, R is monthly interest rate, and N is tenure in months. Our tool also plots full annual and monthly principal vs interest amortization schedules.'
      },
      {
        question: 'What is the current EPFO interest rate and how does EPF growth compound?',
        answer: 'Our EPF Calculator applies the official 8.25% annual interest declared by the Employees Provident Fund Organisation (EPFO). It factors in your basic salary, annual salary increment percentage, and mandatory 12% employee + 3.67% employer EPF contribution until retirement age.'
      },
      {
        question: 'How does the SIP Calculator compute long-term mutual fund wealth compounding?',
        answer: 'Our Systematic Investment Plan (SIP) calculator uses compound interest formula M = P × [((1 + i)^n - 1) / i] × (1 + i) to project expected wealth creation based on monthly investment amount, tenure, and expected annual return rate.'
      },
      {
        question: 'How is In-Hand Take-Home Salary derived from total annual CTC?',
        answer: 'CTC includes employer contributions, medical benefits, and variable pay. The In-Hand Salary Calculator deducts employee EPF (12%), Professional Tax (PT), and estimated monthly TDS from gross salary to give your exact bank credit amount.'
      }
    ],
    relatedCategories: [
      { name: 'Daily Utilities', slug: '/utility', desc: 'Calculators, text formatters, and utilities.' },
      { name: 'Text Tools', slug: '/text-tools', desc: 'Word counters and text generators.' },
      { name: 'Developer Tools', slug: '/developer-tools', desc: 'JSON formatters and Base64 encoders.' }
    ]
  },

  'developer-tools': {
    slug: 'developer-tools',
    title: 'Free Developer Tools: Base64 Encoder, JSON Formatter & QR Generator',
    metaTitle: 'Free Developer Tools: Base64, JSON Formatter, QR Code | FileZenith',
    metaDescription: 'Free browser-based developer utilities: Base64 encoder/decoder, JSON formatter and validator, and customizable QR code generator.',
    h1: 'Free Online Developer Utilities',
    intro: 'Essential client-side developer tools for encoding, decoding, formatting JSON data, and generating QR codes securely.',
    subgroups: [
      {
        title: 'Encoding & Formatting Utilities',
        description: 'Fast, secure utilities for web developers and programmers.',
        tools: [
          { name: 'URL Encoder / Decoder', slug: '/utility/url-encoder-decoder', description: 'Encode or decode URLs and inspect query parameters.', isPopular: true, badge: 'RFC 3986', iconName: 'FileCode' },
          { name: 'Hash Generator (MD5 / SHA)', slug: '/utility/hash-generator', description: 'Generate MD5, SHA-256 and verify file checksums.', isPopular: true, badge: 'Checksum', iconName: 'Hash' },
          { name: 'Base64 Encoder / Decoder', slug: '/utility/base64', description: 'Encode or decode text and binary data into Base64 format.', isPopular: true, iconName: 'Code2' },
          { name: 'JSON Formatter & Validator', slug: '/utility/json-formatter', description: 'Format, beautify, minify, and validate JSON data.', isPopular: true, badge: 'Popular', iconName: 'Code2' },
          { name: 'QR Code Generator', slug: '/utility/qr-generator', description: 'Create customizable QR codes for URLs, WiFi, and text.', isPopular: true, badge: 'Custom QR', iconName: 'QrCode' }
        ]
      }
    ],
    popularTools: [
      { name: 'JSON Formatter & Validator', slug: '/utility/json-formatter', description: 'Beautify messy JSON strings with syntax highlighting.' },
      { name: 'Base64 Encoder / Decoder', slug: '/utility/base64', description: 'Encode and decode Base64 strings safely.' },
      { name: 'QR Code Generator', slug: '/utility/qr-generator', description: 'Generate high-res downloadable QR codes.' }
    ],
    faqs: [
      {
        question: 'Is my JSON data, API payload, or token sent to any backend server?',
        answer: 'No! All JSON formatting, tree parsing, minification, and validation execute strictly in your local web browser memory. No private API keys, proprietary payloads, or JWT tokens are ever transmitted across the internet.'
      },
      {
        question: 'Does the Base64 encoder support both ASCII strings and UTF-8 / binary files?',
        answer: 'Yes! Our Base64 tool handles standard ASCII, multi-byte international UTF-8 characters, and binary files without corrupted character encoding or padding issues.'
      },
      {
        question: 'How does the Hash Generator compute MD5 and SHA-256 checksums locally?',
        answer: 'Our tool leverages browser-native Web Cryptography API (crypto.subtle.digest) and WebAssembly to compute cryptographic MD5, SHA-1, SHA-256, and SHA-512 hashes at hardware speed directly in your device memory.'
      },
      {
        question: 'What is the difference between URL encoding (RFC 3986) and form-urlencoded format?',
        answer: 'Standard URL encode percent-escapes reserved characters according to RFC 3986 (e.g., spaces become %20), whereas application/x-www-form-urlencoded replaces spaces with "+" signs. Our tool supports both modes with full query parameter parsing.'
      },
      {
        question: 'Can the QR Code Generator encode Wi-Fi credentials, vCards, and URLs into vector SVG?',
        answer: 'Yes! You can generate QR codes for website URLs, Wi-Fi WPA2 network logins, contact vCards, SMS, and plain text, with instant downloads available in both PNG and lossless SVG vector formats.'
      },
      {
        question: 'Does the JSON Formatter support minification for production payloads?',
        answer: 'Yes! You can beautify JSON with 2-space or 4-space indentation for debugging, or minify JSON into a single compact line with whitespace stripped to reduce payload size before API transmission.'
      },
      {
        question: 'Can I verify software download integrity using the SHA-256 checksum tool?',
        answer: 'Yes! Drag and drop any downloaded installer (.exe, .dmg, .zip) into the Hash Generator. It computes the SHA-256 hash locally in seconds so you can compare it with the developer published checksum to confirm file integrity.'
      },
      {
        question: 'Are all developer utilities available offline without an active internet connection?',
        answer: 'Yes! Once the page is loaded in your browser, all formatting, encoding, hashing, and QR generation logic run completely client-side in JavaScript without requiring an active network connection.'
      }
    ],
    relatedCategories: [
      { name: 'Productivity Tools', slug: '/productivity-tools', desc: 'Password generator and utility tools.' },
      { name: 'Daily Utilities', slug: '/utility', desc: 'Financial calculators and converters.' }
    ]
  },

  'text-tools': {
    slug: 'text-tools',
    title: 'Free Online Text Tools: Word Counter, Typing Speed Test & Text Formatting',
    metaTitle: 'Free Online Text Tools: Word Counter, Typing Test | FileZenith',
    metaDescription: 'Free online text utilities: Word & character counter, typing speed test, fancy text generator, number to words converter, and markdown editor.',
    h1: 'Free Online Text & Writing Utilities',
    intro: 'Format text, count words and reading time, test your typing speed, generate stylish font styles, and convert cheque amounts to words.',
    subgroups: [
      {
        title: 'Writing & Counting Utilities',
        description: 'Tools for writers, students, and content creators.',
        tools: [
          { name: 'Word & Character Counter', slug: '/utility/word-counter', description: 'Count words, characters, sentences, paragraphs, and reading time.', isPopular: true, badge: 'Upgraded', iconName: 'Type' },
          { name: 'Typing Speed Test', slug: '/utility/typing-speed-test', description: 'Test typing speed in WPM with accuracy score.', isPopular: true, badge: 'Viral Test', iconName: 'Zap' },
          { name: 'Fancy Text Generator', slug: '/utility/fancy-text-generator', description: 'Generate cool Unicode fonts for Instagram bio and WhatsApp.', isPopular: true, badge: 'Cool Fonts', iconName: 'Sparkles' },
          { name: 'Number to Words Converter', slug: '/utility/number-to-words', description: 'Convert numbers into words and currency cheques (USD/INR).', isPopular: true, badge: 'Cheque Tool', iconName: 'DollarSign' },
          { name: 'Markdown Editor', slug: '/utility/markdown-editor', description: 'Live Markdown preview editor with export.', iconName: 'FileText' }
        ]
      }
    ],
    popularTools: [
      { name: 'Word & Character Counter', slug: '/utility/word-counter', description: 'Instant word, character, and sentence counter.' },
      { name: 'Typing Speed Test', slug: '/utility/typing-speed-test', description: 'Challenge your typing speed in WPM.' },
      { name: 'Number to Words Converter', slug: '/utility/number-to-words', description: 'Write bank cheques and invoices accurately.' }
    ],
    faqs: [
      {
        question: 'Does the Word Counter count characters without spaces and total sentences?',
        answer: 'Yes! Our Word Counter provides a detailed metrics dashboard including total words, characters with spaces, characters without spaces, syllables, sentences, paragraphs, reading time, and speaking time in real-time.'
      },
      {
        question: 'How does the Typing Speed Test calculate Net Words Per Minute (WPM) and accuracy?',
        answer: 'WPM is calculated using the international standard: (Total Characters typed / 5) divided by time in minutes. Uncorrected errors reduce your Gross WPM to Net WPM. Upon completion, you receive an accuracy percentage and can download a verified certificate.'
      },
      {
        question: 'How does the Number to Words Converter format Indian Rupees (Lakhs/Crores) and USD (Millions)?',
        answer: 'Our tool supports both the Indian Numbering System (Lakhs, Crores, Arab) formatted specifically for bank cheques, invoices, and demand drafts, and the Western International System (Millions, Billions, Trillions) formatted for legal agreements.'
      },
      {
        question: 'Can I use the Fancy Text Generator for Instagram bios, TikTok handles, and WhatsApp?',
        answer: 'Yes! The generator converts standard text into over 40 aesthetic Unicode font styles (Cursive, Gothic, Bold Sans, Bubble, Small Caps). Because these are standard Unicode characters, they display properly on all iOS and Android devices.'
      },
      {
        question: 'Does the Markdown Editor support live side-by-side preview and HTML export?',
        answer: 'Yes! It features a dual-pane editor with live rendering for headings, GitHub Flavored Markdown (GFM) tables, task lists, code blocks with syntax highlighting, and one-click export to HTML or raw markdown.'
      },
      {
        question: 'How is reading time estimated by the Word Counter?',
        answer: 'Reading time is calculated using an established cognitive rate of 200 words per minute for typical adult readers, giving authors and students accurate length guidance for essays, articles, and speeches.'
      },
      {
        question: 'Does the Text Repeater tool support custom delimiters and new lines?',
        answer: 'Yes! You can repeat any phrase up to 10,000 times, choose spaces, commas, periods, or new lines as delimiters, and copy the result with one click for messaging, testing, or creative typing.'
      },
      {
        question: 'Is my pasted confidential writing stored or analyzed by AI?',
        answer: 'Never! All text analysis, counting, and conversions occur entirely in your local browser memory. No text is ever uploaded to any server, analyzed by external models, or cached in any database.'
      }
    ],
    relatedCategories: [
      { name: 'Daily Utilities', slug: '/utility', desc: 'Calculators and daily utilities.' },
      { name: 'Calculators', slug: '/calculators', desc: 'Financial and student calculators.' }
    ]
  },

  'govt-job-tools': {
    slug: 'govt-job-tools',
    title: 'Free Govt Job Exam Resizers & ID Tools: SSC, UPSC, Aadhaar Card Print',
    metaTitle: 'Govt Job Photo & Signature Resizers, e-Aadhaar Print | FileZenith',
    metaDescription: '100% Free online Govt Exam photo & signature resizers. Format SSC 20-50KB, UPSC OTR 350x350, Signature 10-20KB, NEET postcard, and print e-Aadhaar on A4 & PVC cards.',
    h1: 'Govt Job Exam Resizers & Official ID Print Tools',
    intro: 'Format passport photos, signatures, and ID cards for Indian recruitment portals and official identity prints directly in your web browser with 100% client-side privacy.',
    subgroups: [
      {
        title: 'Govt Exam Photo & Signature Resizers',
        description: 'Exact dimensions, byte limits (KB), and formats for SSC, UPSC, IBPS, and State PSC recruitment portals.',
        tools: [
          { name: 'SSC CGL Photo & Signature Resizer', slug: '/tools/ssc-cgl-photo-signature-resizer', description: 'Official 20-50KB photo with Name & DOP stamp and 10-20KB signature.', isPopular: true, badge: 'CGL 2026', iconName: 'UserCheck' },
          { name: 'UPSC OTR Photo Resizer (350x350)', slug: '/tools/upsc-otr-photo-resizer', description: 'Square 350x350 px photo (20-300KB) with candidate name and date.', isPopular: true, badge: 'OTR Square', iconName: 'UserCheck' },
          { name: 'CTET Photo & Signature Resizer', slug: '/tools/ctet-photo-signature-resizer', description: 'CBSE CTET 10-100KB photo and 3-30KB signature resizer.', badge: 'CTET 2026', iconName: 'UserCheck' },
          { name: 'SSC Photo Resizer (20-50KB)', slug: '/tools/ssc-photo-resizer', description: 'Format SSC CGL, CHSL, MTS 3.5x4.5cm photo with Name & Date stamp.', isPopular: true, badge: 'SSC 20-50KB', iconName: 'UserCheck' },
          { name: 'Signature Resizer 10 to 20KB', slug: '/tools/signature-resizer-10-to-20kb', description: 'Resize signature to 10-20KB with Magic B&W cleanup.', isPopular: true, badge: '10-20KB', iconName: 'Stamp' },
          { name: 'UPSC Photo Resizer', slug: '/tools/upsc-photo-resizer', description: '350x350 px OTR square photo format with Name & Date.', isPopular: true, badge: 'UPSC OTR', iconName: 'UserCheck' },
          { name: 'NEET Photo Resizer', slug: '/tools/neet-photo-resizer', description: 'NEET passport & postcard 4"x6" photo with DOP stamp.', badge: 'NEET UG', iconName: 'UserCheck' },
          { name: 'Photo Name & Date Generator', slug: '/tools/photo-name-date-generator', description: 'Overlay candidate full name and date on passport photos.', badge: 'Name & Date', iconName: 'Calendar' },
          { name: 'Compress Image to 50KB', slug: '/image/compress-to-50kb', description: 'General passport photo compressor under 50KB.', badge: 'Target 50KB', iconName: 'Minimize2' },
          { name: 'Compress Image to 20KB', slug: '/image/compress-to-20kb', description: 'Compress signature & photo under 20KB.', badge: 'Target 20KB', iconName: 'Minimize2' },
          { name: 'Passport Photo Maker', slug: '/image/passport-maker', description: 'Crop to standard 3.5x4.5cm official passport photo.', badge: '3.5x4.5cm', iconName: 'UserCheck' }
        ]
      },
      {
        title: 'Official ID Printing & Document Tools',
        description: 'Tools for cyber cafes, CSC centers, and citizens to prepare ID cards and forms.',
        tools: [
          { name: 'Aadhaar Card Print Tool (A4 & PVC)', slug: '/tools/aadhaar-card-print', description: 'Crop and print e-Aadhaar on A4 sheet & PVC card (85.6x54 mm).', isPopular: true, badge: 'A4 & PVC', iconName: 'Printer' },
          { name: 'Compress PDF to 200KB', slug: '/pdf/compress-to-200kb', description: 'Reduce document size under 200KB for portal uploads.', isPopular: true, badge: 'Form Preset', iconName: 'Minimize2' },
          { name: 'Pics to PDF Converter', slug: '/image/pics-to-pdf', description: 'Combine marksheets and certificates into single PDF.', badge: 'Documents', iconName: 'Camera' },
          { name: 'Password Protect PDF', slug: '/pdf/protect', description: 'Encrypt documents before sharing.', badge: 'Secure', iconName: 'Lock' },
          { name: 'Remove PDF Password', slug: '/pdf/remove-password', description: 'Unlock encrypted PDF documents offline.', iconName: 'Unlock' }
        ]
      }
    ],
    popularTools: [
      { name: 'Aadhaar Card Print Tool', slug: '/tools/aadhaar-card-print', description: 'Print e-Aadhaar on A4 sheet or PVC card.' },
      { name: 'SSC Photo Resizer (20-50KB)', slug: '/tools/ssc-photo-resizer', description: '3.5x4.5cm photo with candidate name & date.' },
      { name: 'Signature Resizer 10 to 20KB', slug: '/tools/signature-resizer-10-to-20kb', description: 'Clean signature with Magic B&W cleanup.' },
      { name: 'UPSC Photo Resizer', slug: '/tools/upsc-photo-resizer', description: 'Square 350x350 px photo for UPSC OTR.' }
    ],
    faqs: [
      {
        question: 'Why do government recruitment portals (SSC, UPSC, IBPS) have strict photo and signature KB limits?',
        answer: 'Central and state portals handle millions of applicants. Strict limits (20-50KB for passport photos, 10-20KB for signatures) prevent server bandwidth bottlenecks and ensure biometric photos display instantly on candidate admit cards and attendance sheets.'
      },
      {
        question: 'Will my SSC CGL/CHSL application be rejected without candidate name and date on the photo?',
        answer: 'Certain SSC and State PSC notifications mandate that the photograph must clearly feature the candidate full name and Date of Photo (DOP) printed at the bottom. Our SSC Photo Resizer stamps this official white banner automatically with your exact details.'
      },
      {
        question: 'What is the exact photo dimension and file size for UPSC OTR registration?',
        answer: 'UPSC One Time Registration (OTR) specifies a square photograph of 350 × 350 pixels (or 3:4 aspect ratio) with file size strictly between 20KB and 300KB. Our UPSC Photo Resizer formats your image to these exact specifications in one click.'
      },
      {
        question: 'How do I resize signatures between 10KB and 20KB without making them blurry or illegible?',
        answer: 'Our Signature Resizer features a Magic B&W cleanup algorithm that removes grey paper shadows and camera noise, sharpens ink strokes, and compresses the image to stay strictly within the 10KB to 20KB boundary while keeping strokes crisp.'
      },
      {
        question: 'What is the standard Aadhaar card size for A4 sheet and PVC plastic card printing?',
        answer: 'The standard Aadhaar card size follows the ISO/IEC 7810 ID-1 format: 85.60 mm width × 53.98 mm height (3.370 × 2.125 inches). Our tool formats UIDAI e-Aadhaar cut-pieces for both PVC card printers and 5-copy sheets on standard A4 paper.'
      },
      {
        question: 'Are any of my identity documents, biometric photos, or Aadhaar scans stored on your server?',
        answer: 'Zero bytes are ever uploaded! All image cropping, dimension formatting, and PDF rendering run 100% locally inside your web browser using HTML5 Canvas and WebAssembly. Your identity credentials remain completely private on your device.'
      },
      {
        question: 'How do I crop and compress a NEET UG postcard size (4"x6") photo?',
        answer: 'NEET UG requires both a passport size (3.5x4.5cm) and a postcard size (4x6 inches, 10x15cm) photo with name and date stamp. Our NEET Photo Resizer exports both formats with the mandatory 50KB-300KB file size and white background.'
      },
      {
        question: 'How can I compress my marksheet or certificate PDF under 200KB for portal uploads?',
        answer: 'Use our Compress PDF to 200KB tool. It optimizes image streams, strips unnecessary metadata, and recompresses pages to ensure your academic certificate or caste certificate stays under 200KB while text remains sharp and legible.'
      }
    ],
    relatedCategories: [
      { name: 'Image Tools', slug: '/image-tools', desc: 'Compress, crop, and convert images.' },
      { name: 'PDF Tools', slug: '/pdf-tools', desc: 'Merge, split, and compress PDFs.' },
      { name: 'Daily Utilities', slug: '/utility', desc: 'Age, tax, and salary calculators.' }
    ]
  },

  'ai-tools': {
    slug: 'ai-tools',
    title: 'Free Browser AI Tools: AI Background Remover & Document Extractor',
    metaTitle: 'Free Browser AI Tools: Remove Background & OCR | FileZenith',
    metaDescription: '100% Free browser AI tools. Remove image backgrounds locally in your browser and extract OCR text from scanned PDFs without server processing.',
    h1: 'Free Browser-Based AI Tools',
    intro: 'Leverage client-side AI models directly in your browser. Remove backgrounds from photos and extract text from scanned PDFs with 100% privacy.',
    subgroups: [
      {
        title: 'Client-Side AI Image & Document Tools',
        description: 'Browser AI models running without cloud costs or privacy risks.',
        tools: [
          { name: 'AI Background Remover', slug: '/image/remove-background', description: 'Remove photo backgrounds automatically in your browser.', isPopular: true, badge: '100% Local AI', iconName: 'Scissors' },
          { name: 'PDF OCR Text Extractor', slug: '/pdf/ocr', description: 'Extract text from scanned PDF documents using OCR.', isPopular: true, badge: 'Browser OCR', iconName: 'FileCheck' }
        ]
      }
    ],
    popularTools: [
      { name: 'AI Background Remover', slug: '/image/remove-background', description: 'Instant transparent background cutout.' },
      { name: 'PDF OCR Text Extractor', slug: '/pdf/ocr', description: 'Extract readable text from images and PDF scans.' }
    ],
    faqs: [
      {
        question: 'How does browser AI work without server uploads or cloud GPU costs?',
        answer: 'FileZenith utilizes WebAssembly (Wasm) and client-side ONNX neural network runtimes that execute machine learning models directly inside your browser using your computer or phone CPU and WebGL/WebGPU acceleration.'
      },
      {
        question: 'Is AI background removal completely free with unlimited image downloads?',
        answer: 'Yes! Unlike commercial cloud background removers that offer 1 free low-res trial and charge $0.20 per HD cutout, FileZenith AI Background Remover is 100% free with unlimited full-resolution downloads and zero credits required.'
      },
      {
        question: 'What image formats and resolutions are supported by the AI Background Remover?',
        answer: 'You can upload JPG, PNG, and WebP images of any resolution. The AI neural engine segments human portraits, products, animals, and objects, outputting a crystal-clear transparent PNG.'
      },
      {
        question: 'How does the PDF OCR Text Extractor recognize scanned text in your browser?',
        answer: 'Our OCR engine runs a compiled WebAssembly build of Tesseract.js directly inside your browser. It scans PDF pages and images, identifies characters across multiple languages, and outputs selectable, editable text.'
      },
      {
        question: 'Are my private photos or confidential documents used to train AI models?',
        answer: 'Never! Because processing takes place entirely on your device with zero data transmitted to any cloud server, your files cannot be scraped, stored, or used for model training.'
      },
      {
        question: 'Does the background remover output high-resolution transparent PNG cutouts?',
        answer: 'Yes! Your output file is exported as an uncompressed, full-resolution transparent PNG matching the exact pixel dimensions of your original photo without artificial downscaling.'
      },
      {
        question: 'Can I use client-side AI tools on low-spec laptops and mobile devices?',
        answer: 'Yes! The models are quantized to under 40MB and stream incrementally into browser memory, running smoothly on modern smartphones, Chromebooks, Windows PCs, and Macs.'
      },
      {
        question: 'How does FileZenith local AI compare to paid cloud tools like Remove.bg or Adobe Express?',
        answer: 'Traditional tools upload your images to third-party servers, impose strict daily limits, and place watermarks unless you purchase monthly plans. FileZenith provides instant local processing, total privacy, zero watermarks, and unlimited free use.'
      }
    ],
    relatedCategories: [
      { name: 'Image Tools', slug: '/image-tools', desc: 'Image compression and conversion.' },
      { name: 'PDF Tools', slug: '/pdf-tools', desc: 'Merge and split PDF files.' }
    ]
  }
};

export function getCategoryMetadata(slug: string): Metadata {
  const category = CATEGORY_REGISTRY[slug];
  if (!category) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.filezenith.com';
  const url = `${siteUrl}/${slug}`;
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(category.h1 || category.title)}&category=${encodeURIComponent('Tool Directory')}&desc=${encodeURIComponent(category.metaDescription)}&badge=${encodeURIComponent('All-In-One Studio')}`;

  return {
    title: {
      absolute: category.metaTitle,
    },
    description: category.metaDescription,
    keywords: category.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: category.metaTitle,
      description: category.metaDescription,
      url: url,
      siteName: 'FileZenith',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: category.metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: category.metaTitle,
      description: category.metaDescription,
      images: [ogImageUrl],
    },
  };
}
