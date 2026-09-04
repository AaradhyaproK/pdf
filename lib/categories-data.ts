export interface CategoryToolItem {
  name: string;
  slug: string;
  description: string;
  isPopular?: boolean;
  badge?: string;
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
}

export const CATEGORY_REGISTRY: Record<string, CategoryConfig> = {
  'image-tools': {
    slug: 'image-tools',
    title: 'Free Online Image Tools: Compress, Convert, Resize & Edit Images',
    metaTitle: 'Free Online Image Tools: Compress, Convert, Resize & Edit | FileZenith',
    metaDescription: '100% Free browser-based image tools. Compress image KB, resize photos, convert HEIC/PNG/JPG/SVG, remove backgrounds, and format passport photos.',
    h1: 'Free Online Image Tools & Compressors',
    intro: 'Process, compress, convert, and resize images directly in your browser. No files uploaded to external servers, no watermark, and no account required.',
    subgroups: [
      {
        title: 'Image Compression Tools',
        description: 'Reduce image file size in KB while preserving sharp visual quality.',
        tools: [
          { name: 'Compress Image', slug: '/image/compress', description: 'Universal JPEG/PNG image compressor.', isPopular: true, badge: 'Popular' },
          { name: 'Compress Image to 20KB', slug: '/tools/compress-image-to-20kb', description: 'Compress signature & photo under 20KB.', isPopular: true, badge: 'Target 20KB' },
          { name: 'Compress Image to 50KB', slug: '/image/compress-to-50kb', description: 'Target 50KB passport photo compressor.', isPopular: true, badge: 'Target 50KB' },
          { name: 'Compress Image to 100KB', slug: '/image/compress-to-100kb', description: 'Compress document scans to 100KB.' }
        ]
      },
      {
        title: 'Image Conversion Tools',
        description: 'Convert between popular raster and vector image formats.',
        tools: [
          { name: 'PNG to JPG Converter', slug: '/image/png-to-jpg', description: 'Convert PNG images to JPG with white background.', isPopular: true },
          { name: 'JPG to PNG Converter', slug: '/image/jpg-to-png', description: 'Convert JPG photos to PNG format.' },
          { name: 'HEIC to JPG Converter', slug: '/image/convert-heic', description: 'Convert iPhone HEIC photos to JPG.', isPopular: true, badge: 'iOS Photo' },
          { name: 'SVG Converter', slug: '/image/svg-converter', description: 'Convert SVG vector files to PNG or JPG.' }
        ]
      },
      {
        title: 'Image Resizing & Framing Tools',
        description: 'Resize dimensions, crop frames, and prepare official photos.',
        tools: [
          { name: 'Resize Image Dimensions', slug: '/image/resize', description: 'Resize pixel width and height.' },
          { name: 'Image Cropper', slug: '/image/crop', description: 'Crop images to exact aspect ratios.' },
          { name: 'Passport Photo Maker', slug: '/image/passport-maker', description: 'Create 3.5x4.5cm passport photos.', isPopular: true, badge: 'Official Format' },
          { name: 'Pics to PDF Converter', slug: '/image/pics-to-pdf', description: 'Convert multiple photos into a single PDF.' },
          { name: 'PNG to PDF Converter', slug: '/image/png-to-pdf', description: 'Convert PNG graphics into PDF document.' }
        ]
      }
    ],
    popularTools: [
      { name: 'Compress Image to 50KB', slug: '/image/compress-to-50kb', description: 'Target 50KB for SSC, IBPS, and Railway application forms.' },
      { name: 'HEIC to JPG Converter', slug: '/image/convert-heic', description: 'Convert Apple HEIC photos instantly.' },
      { name: 'Passport Photo Maker', slug: '/image/passport-maker', description: 'Format passport size photos for job forms.' }
    ],
    faqs: [
      { question: 'Are my uploaded images saved on any server?', answer: 'No! All FileZenith image processing occurs locally inside your browser using HTML5 Canvas. Your images are never stored or uploaded.' },
      { question: 'What image formats are supported?', answer: 'We support JPG, JPEG, PNG, WEBP, HEIC, and SVG formats.' }
    ],
    relatedCategories: [
      { name: 'PDF Tools', slug: '/pdf-tools', desc: 'Merge, split, and compress PDF documents.' },
      { name: 'AI Tools', slug: '/ai-tools', desc: 'Browser AI background remover.' }
    ]
  },

  'pdf-tools': {
    slug: 'pdf-tools',
    title: 'Free Online PDF Tools: Merge, Split, Compress & Edit PDF Files',
    metaTitle: 'Free Online PDF Tools: Merge, Split, Compress & Edit | FileZenith',
    metaDescription: '100% Free online PDF tools. Merge PDF files, split pages, compress PDF under 200KB, extract OCR text, watermark, protect, and edit PDFs.',
    h1: 'Free Online PDF Utilities & Editors',
    intro: 'Manage, merge, split, compress, and edit PDF documents directly in your browser with zero server uploads and zero file size limits.',
    subgroups: [
      {
        title: 'Core PDF Document Tools',
        description: 'Essential utilities for organizing, merging, and splitting PDF documents.',
        tools: [
          { name: 'Merge PDF Files', slug: '/pdf/merge', description: 'Combine multiple PDF files into one document.', isPopular: true, badge: 'Most Used' },
          { name: 'Split PDF Pages', slug: '/pdf/split', description: 'Extract specific pages or split PDF into separate files.', isPopular: true },
          { name: 'Organize PDF Pages', slug: '/pdf/organize', description: 'Reorder, rotate, or delete PDF pages.' },
          { name: 'PDF Page Numbers', slug: '/pdf/page-numbers', description: 'Add customizable page numbers to PDF.' }
        ]
      },
      {
        title: 'PDF Compression & Optimization',
        description: 'Reduce PDF file size for email attachments and portal uploads.',
        tools: [
          { name: 'Compress PDF', slug: '/pdf/compress', description: 'Compress PDF file size without quality loss.', isPopular: true, badge: 'Popular' },
          { name: 'Compress PDF to 200KB', slug: '/pdf/compress-to-200kb', description: 'Target 200KB PDF compressor for application forms.', isPopular: true, badge: 'Target 200KB' }
        ]
      },
      {
        title: 'PDF Editing & Security',
        description: 'Edit PDF text, protect with passwords, watermark, and OCR text extraction.',
        tools: [
          { name: 'Edit PDF Document', slug: '/pdf/edit', description: 'Add text, drawings, and annotations to PDF.' },
          { name: 'PDF OCR Text Extractor', slug: '/pdf/ocr', description: 'Extract selectable text from scanned PDF pages.', isPopular: true, badge: 'AI OCR' },
          { name: 'Password Protect PDF', slug: '/pdf/protect', description: 'Encrypt PDF files with password protection.' },
          { name: 'Remove PDF Password', slug: '/pdf/remove-password', description: 'Unlock and remove password from PDF files.', isPopular: true, badge: 'Unlock' },
          { name: 'Watermark PDF', slug: '/pdf/watermark', description: 'Add text or logo watermarks to PDF.' },
          { name: 'PDF to Image Converter', slug: '/pdf/to-image', description: 'Convert PDF pages into high-res JPG/PNG images.' }
        ]
      }
    ],
    popularTools: [
      { name: 'Merge PDF Files', slug: '/pdf/merge', description: 'Combine multiple PDF documents effortlessly.' },
      { name: 'Compress PDF to 200KB', slug: '/pdf/compress-to-200kb', description: 'Target 200KB PDF compressor for email and forms.' },
      { name: 'PDF OCR Extractor', slug: '/pdf/ocr', description: 'Extract text from scanned PDFs directly in browser.' }
    ],
    faqs: [
      { question: 'Is there a file size limit for merging or compressing PDFs?', answer: 'No! Because processing happens in your browser memory, you can process large PDFs without file size caps.' },
      { question: 'Is my confidential PDF private?', answer: 'Yes! Your PDF files never leave your device or touch external servers.' }
    ],
    relatedCategories: [
      { name: 'Image Tools', slug: '/image-tools', desc: 'Compress and convert images.' },
      { name: 'Productivity Tools', slug: '/productivity-tools', desc: 'Password and document utilities.' }
    ]
  },

  'calculators': {
    slug: 'calculators',
    title: 'Free Online Calculators: Age, Percentage & CGPA to Percentage',
    metaTitle: 'Free Online Calculators: Age, Percentage & CGPA | FileZenith',
    metaDescription: 'Calculate exact age, percentage discounts, marks percentage, and convert CGPA to percentage instantly with free online calculators.',
    h1: 'Free Online Financial & Educational Calculators',
    intro: 'Instant, precise, mobile-friendly calculators for students, job applicants, business owners, and daily tasks.',
    subgroups: [
      {
        title: 'Popular Financial & Student Calculators',
        description: 'Calculators for loans, income tax, mutual funds, salary, GST, age, and marks.',
        tools: [
          { name: 'EPF Balance Growth Calculator', slug: '/utility/epf-calculator', description: 'EPFO 8.25% retirement interest and maturity calculator.', isPopular: true, badge: 'EPFO 8.25%' },
          { name: 'Age Calculator', slug: '/utility/age-calculator', description: 'Calculate exact age in years, months, days, hours, and minutes.', isPopular: true, badge: '#1 Trending' },
          { name: 'Percentage Calculator', slug: '/utility/percentage-calculator', description: 'Calculate percentage difference, increase/decrease, and discount.', isPopular: true, badge: 'Daily Tool' },
          { name: 'CGPA to Percentage Calculator', slug: '/utility/cgpa-to-percentage', description: 'Convert CBSE, University CGPA/SGPA to percentage.', isPopular: true, badge: 'Student Tool' },
          { name: 'EMI Loan Calculator', slug: '/utility/emi-calculator', description: 'Calculate home, car, and personal loan monthly EMI with schedule.', isPopular: true, badge: 'High RPM' },
          { name: 'Income Tax Calculator (Old vs New)', slug: '/utility/income-tax-calculator', description: 'Compare Old vs New Tax Regime savings for FY 2024-25 / FY 2025-26.', isPopular: true, badge: 'Tax Season' },
          { name: 'SIP Mutual Fund Calculator', slug: '/utility/sip-calculator', description: 'Calculate future wealth compounding returns for monthly SIP investments.', isPopular: true, badge: 'Wealth' },
          { name: 'CTC to In-Hand Salary Calculator', slug: '/utility/salary-calculator', description: 'Calculate monthly take-home salary after PF, PT, and TDS.', isPopular: true, badge: 'Salary' },
          { name: 'GST Calculator', slug: '/utility/gst-calculator', description: 'Add or remove GST tax for 5%, 12%, 18%, 28% slabs.', isPopular: true, badge: 'Tax Tool' },
          { name: 'BMI Calculator', slug: '/utility/bmi-calculator', description: 'Calculate Body Mass Index and ideal weight target.', isPopular: true, badge: 'Health' }
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
      { question: 'How is CGPA to Percentage calculated?', answer: 'Most Indian boards (CBSE/AICTE) use the standard formula: Percentage = CGPA × 9.5.' },
      { question: 'Can I calculate age for government exam eligibility?', answer: 'Yes! Enter your date of birth and cut-off date to get exact age in years, months, and days.' }
    ],
    relatedCategories: [
      { name: 'Text Tools', slug: '/text-tools', desc: 'Word counters and text generators.' },
      { name: 'Developer Tools', slug: '/developer-tools', desc: 'JSON formatters and Base64 encoders.' }
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
          { name: 'Word & Character Counter', slug: '/utility/word-counter', description: 'Count words, characters, sentences, paragraphs, and reading time.', isPopular: true, badge: 'Upgraded' },
          { name: 'Typing Speed Test', slug: '/utility/typing-speed-test', description: 'Test typing speed in WPM with accuracy score.', isPopular: true, badge: 'Viral Test' },
          { name: 'Fancy Text Generator', slug: '/utility/fancy-text-generator', description: 'Generate cool Unicode fonts for Instagram bio and WhatsApp.', isPopular: true, badge: 'Cool Fonts' },
          { name: 'Number to Words Converter', slug: '/utility/number-to-words', description: 'Convert numbers into words and currency cheques (USD/INR).', isPopular: true, badge: 'Cheque Tool' },
          { name: 'Markdown Editor', slug: '/utility/markdown-editor', description: 'Live Markdown preview editor with export.' }
        ]
      }
    ],
    popularTools: [
      { name: 'Word & Character Counter', slug: '/utility/word-counter', description: 'Instant word, character, and sentence counter.' },
      { name: 'Typing Speed Test', slug: '/utility/typing-speed-test', description: 'Challenge your typing speed in WPM.' },
      { name: 'Number to Words Converter', slug: '/utility/number-to-words', description: 'Write bank cheques and invoices accurately.' }
    ],
    faqs: [
      { question: 'Does Word Counter count characters without spaces?', answer: 'Yes! It provides breakdown for total characters both with and without spaces.' }
    ],
    relatedCategories: [
      { name: 'Calculators', slug: '/calculators', desc: 'Financial and student calculators.' },
      { name: 'Developer Tools', slug: '/developer-tools', desc: 'JSON formatters and Base64.' }
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
          { name: 'Base64 Encoder / Decoder', slug: '/utility/base64', description: 'Encode or decode text and binary data into Base64 format.', isPopular: true },
          { name: 'JSON Formatter & Validator', slug: '/utility/json-formatter', description: 'Format, beautify, minify, and validate JSON data.', isPopular: true, badge: 'Popular' },
          { name: 'QR Code Generator', slug: '/utility/qr-generator', description: 'Create customizable QR codes for URLs, WiFi, and text.', isPopular: true, badge: 'Custom QR' }
        ]
      }
    ],
    popularTools: [
      { name: 'JSON Formatter & Validator', slug: '/utility/json-formatter', description: 'Beautify messy JSON strings with syntax highlighting.' },
      { name: 'Base64 Encoder / Decoder', slug: '/utility/base64', description: 'Encode and decode Base64 strings safely.' },
      { name: 'QR Code Generator', slug: '/utility/qr-generator', description: 'Generate high-res downloadable QR codes.' }
    ],
    faqs: [
      { question: 'Is my JSON data sent to any backend server?', answer: 'No! All JSON formatting and Base64 operations happen strictly in your browser memory.' }
    ],
    relatedCategories: [
      { name: 'Productivity Tools', slug: '/productivity-tools', desc: 'Password generator and utility tools.' },
      { name: 'Text Tools', slug: '/text-tools', desc: 'Markdown editor and text tools.' }
    ]
  },

  'productivity-tools': {
    slug: 'productivity-tools',
    title: 'Free Online Productivity Tools: Password Generator, QR Code & Word Tools',
    metaTitle: 'Free Online Productivity Tools | FileZenith',
    metaDescription: 'Boost daily workflow with free productivity tools: Random password generator, QR code maker, word counter, and document utilities.',
    h1: 'Free Online Productivity & Security Utilities',
    intro: 'Tools designed to streamline daily tasks, protect password security, and format documents quickly.',
    subgroups: [
      {
        title: 'Security & Utility Tools',
        description: 'Boost your personal and professional workflow.',
        tools: [
          { name: 'Password Generator', slug: '/utility/password-generator', description: 'Generate strong, cryptographically secure passwords.', isPopular: true, badge: 'Secure' },
          { name: 'QR Code Generator', slug: '/utility/qr-generator', description: 'Generate custom QR codes for links and contact info.', isPopular: true },
          { name: 'Word & Character Counter', slug: '/utility/word-counter', description: 'Track word count and reading time for essays.' }
        ]
      }
    ],
    popularTools: [
      { name: 'Password Generator', slug: '/utility/password-generator', description: 'Create strong passwords to protect your accounts.' },
      { name: 'QR Code Generator', slug: '/utility/qr-generator', description: 'Generate QR codes for instant mobile sharing.' }
    ],
    faqs: [
      { question: 'Are generated passwords stored or logged?', answer: 'No! Passwords are generated locally using browser crypto random bytes.' }
    ],
    relatedCategories: [
      { name: 'Developer Tools', slug: '/developer-tools', desc: 'Developer encoding utilities.' },
      { name: 'Text Tools', slug: '/text-tools', desc: 'Text formatting tools.' }
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
          { name: 'AI Background Remover', slug: '/image/remove-background', description: 'Remove photo backgrounds automatically in your browser.', isPopular: true, badge: '100% Local AI' },
          { name: 'PDF OCR Text Extractor', slug: '/pdf/ocr', description: 'Extract text from scanned PDF documents using OCR.', isPopular: true, badge: 'Browser OCR' }
        ]
      }
    ],
    popularTools: [
      { name: 'AI Background Remover', slug: '/image/remove-background', description: 'Instant transparent background cutout.' },
      { name: 'PDF OCR Text Extractor', slug: '/pdf/ocr', description: 'Extract readable text from images and PDF scans.' }
    ],
    faqs: [
      { question: 'How does browser AI work without server uploads?', answer: 'We use WebAssembly and client-side neural network models running directly inside WebGL/Canvas in your browser.' }
    ],
    relatedCategories: [
      { name: 'Image Tools', slug: '/image-tools', desc: 'Image compression and conversion.' },
      { name: 'PDF Tools', slug: '/pdf-tools', desc: 'Merge and split PDF files.' }
    ]
  }
};
