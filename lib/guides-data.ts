export interface GuideSection {
  title: string;
  content: string;
  subsections?: Array<{ title: string; content: string }>;
}

export interface GuideExample {
  scenario: string;
  solution: string;
}

export interface GuideLinkItem {
  name: string;
  slug: string;
  desc: string;
}

export interface GuideConfig {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  author: string;
  publishedDate: string;
  readTimeMinutes: number;
  introduction: string;
  sections: GuideSection[];
  examples?: GuideExample[];
  commonMistakes: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedTools: GuideLinkItem[];
  relatedGuides: GuideLinkItem[];
  disclaimer?: string;
}

export const GUIDE_REGISTRY: Record<string, GuideConfig> = {
  'how-to-compress-image-to-20kb': {
    slug: 'how-to-compress-image-to-20kb',
    title: 'How to Compress Image to 20KB Without Losing Quality | FileZenith',
    metaTitle: 'How to Compress Image to 20KB Online Free | FileZenith Guides',
    metaDescription: 'Learn step-by-step how to compress passport photo or signature images to under 20KB for government job and recruitment form uploads.',
    h1: 'How to Compress Image to Under 20KB for Online Application Forms',
    author: 'FileZenith Tech Team',
    publishedDate: 'September 2026',
    readTimeMinutes: 4,
    introduction: 'Many online application portals, including banking, SSC, and recruitment websites, impose strict file size limits of 20KB for signature and passport photo uploads. Submitting an image that is even 1KB over the limit results in immediate rejection. This guide walks you through compressing your image to under 20KB cleanly in your browser without cloud uploads.',
    sections: [
      {
        title: 'Step 1: Understand Image Dimensions vs. File Weight',
        content: 'File size (KB) depends on both pixel resolution (width × height) and JPEG compression quality. If an image is 4000×3000 pixels, even aggressive compression cannot reduce it under 20KB. First resize pixel dimensions to around 400×200 pixels for signatures or 300×400 pixels for photos.'
      },
      {
        title: 'Step 2: Use Client-Side Canvas Compression',
        content: 'Instead of uploading sensitive personal photos to external servers, use browser-native HTML5 Canvas binary search compression. Our tool tests compression qualities between 0.05 and 0.98 in milliseconds to find the exact sweet spot under 20KB.'
      },
      {
        title: 'Step 3: Export as JPEG Format',
        content: 'PNG and WebP formats often have higher file overhead for small thumbnails. Converting to JPEG with solid background fill guarantees optimal byte efficiency under 20KB.'
      }
    ],
    examples: [
      { scenario: 'Signature photo taken on mobile phone (2.4 MB, 3000×1500 px)', solution: 'Crop signature tightly, downscale to 400×200 px, apply B&W cleanup, compress to 18 KB JPEG.' }
    ],
    commonMistakes: [
      'Trying to compress a 4K resolution image directly without downscaling pixel dimensions.',
      'Saving as transparent PNG, which inflates file size well above 20KB.',
      'Cropping too loosely and leaving massive white borders around signatures.'
    ],
    faq: [
      { question: 'Will compressing an image to 20KB make it blurry?', answer: 'Not if you scale pixel dimensions down first. At 400×200 pixels, a 18KB JPEG remains sharp and legible on portal preview screens.' },
      { question: 'What is the best format for 20KB limit?', answer: 'JPEG (.jpg) is universally accepted and yields the smallest byte size at 20KB limits.' }
    ],
    relatedTools: [
      { name: 'Compress Image to 20KB Tool', slug: '/tools/compress-image-to-20kb', desc: 'Instant 20KB target compressor.' },
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'Format signature 10KB-20KB.' }
    ],
    relatedGuides: [
      { name: 'How to Resize Signature Online', slug: '/blog/how-to-resize-signature-online', desc: 'Complete guide for signature cleanup.' },
      { name: 'JPEG vs PNG for Forms', slug: '/blog/jpeg-vs-png-for-online-forms', desc: 'Compare formats for application portals.' }
    ]
  },

  'how-to-compress-image-to-50kb': {
    slug: 'how-to-compress-image-to-50kb',
    title: 'How to Compress Image to 50KB for SSC, IBPS & Government Forms',
    metaTitle: 'How to Compress Image to 50KB Free | FileZenith Guides',
    metaDescription: 'Step-by-step tutorial on reducing passport photo size to under 50KB (20KB–50KB range) for SSC, IBPS, SBI, and Railway exam forms.',
    h1: 'How to Compress Passport Photo to Under 50KB for Exam Forms',
    author: 'FileZenith Tech Team',
    publishedDate: 'September 2026',
    readTimeMinutes: 5,
    introduction: 'A 50KB maximum file ceiling is the most common constraint across major Indian recruitment portals including SSC (CGL/CHSL), IBPS PO/Clerk, SBI, Railway RRB, and BPSC. This guide explains how to crop, resize, and compress passport photos to land safely in the 20KB–50KB range.',
    sections: [
      {
        title: 'Understanding the 20KB to 50KB Portal Window',
        content: 'Most portals specify both a maximum limit (50KB) and a minimum threshold (20KB). Images under 20KB are flagged as low resolution, while images over 50KB are blocked at upload. Targeting ~45KB guarantees compliance.'
      },
      {
        title: 'Recommended Passport Photo Dimensions',
        content: 'Standard passport photos should be cropped to 3.5 cm × 4.5 cm (approx. 413 × 531 pixels at 300 DPI) or 200 × 230 pixels for banking portals.'
      }
    ],
    commonMistakes: [
      'Uploading photos with dark shadows or non-white background.',
      'File size falling below 20KB due to excessive quality lowering.',
      'Uploading full-body or side-profile photographs.'
    ],
    faq: [
      { question: 'Why does the portal say "File size out of range"?', answer: 'This means your photo is either above 50KB or below 20KB. Aim for 40KB to 45KB.' }
    ],
    relatedTools: [
      { name: 'SSC Photo Resizer', slug: '/tools/ssc-photo-resizer', desc: 'Format SSC photo 20-50KB.' },
      { name: 'IBPS & SBI Photo Resizer', slug: '/tools/ibps-sbi-photo-resizer', desc: 'Bank exam photo 200x230 px.' }
    ],
    relatedGuides: [
      { name: 'SSC Photo Requirements Guide', slug: '/blog/ssc-photo-size-requirements', desc: 'Official SSC photo rules.' },
      { name: 'Photo Size & File Size Explained', slug: '/blog/photo-size-and-file-size-explained', desc: 'Understand KB vs Pixels.' }
    ]
  },

  'how-to-compress-image-to-100kb': {
    slug: 'how-to-compress-image-to-100kb',
    title: 'How to Compress Image to 100KB for Certificates & Documents',
    metaTitle: 'How to Compress Image to 100KB Free | FileZenith Guides',
    metaDescription: 'Learn how to compress scanned certificates, marks sheets, and identity photos to under 100KB without blurring text readability.',
    h1: 'How to Compress Document Scans & Photos to Under 100KB',
    author: 'FileZenith Tech Team',
    publishedDate: 'September 2026',
    readTimeMinutes: 4,
    introduction: 'Document submission portals for college admissions, Aadhaar updates, and UPSC registration frequently cap file uploads at 100KB. Compressing text documents requires special care so printed numbers and grades remain clear.',
    sections: [
      {
        title: 'Preserving Text Legibility in Scanned Certificates',
        content: 'When compressing document scans to 100KB, set canvas resolution to at least 1000 pixels wide so small printed text does not become pixelated.'
      }
    ],
    commonMistakes: [
      'Blurring small text by downscaling width below 800 pixels.',
      'Saving color scans as high-density PNG files.'
    ],
    faq: [
      { question: 'Can marks sheets compressed to 100KB be read clearly?', answer: 'Yes, if resolution is kept around 1000px width and JPEG quality is kept around 0.70–0.85.' }
    ],
    relatedTools: [
      { name: 'Compress Image to 100KB Tool', slug: '/tools/compress-image-to-100kb', desc: 'Target 100KB compressor.' },
      { name: 'UPSC Photo Resizer', slug: '/tools/upsc-photo-resizer', desc: 'UPSC OTR photo tool.' }
    ],
    relatedGuides: [
      { name: 'Reduce Image Size Without Quality Loss', slug: '/blog/how-to-reduce-image-size-without-losing-quality', desc: 'Optimization techniques.' }
    ]
  },

  'how-to-resize-photo-for-online-application': {
    slug: 'how-to-resize-photo-for-online-application',
    title: 'How to Resize Photo for Online Application Forms | FileZenith',
    metaTitle: 'How to Resize Photo for Online Application | FileZenith Guides',
    metaDescription: 'Complete guide to resizing, cropping, and formatting passport photos for government job and college entrance application portals.',
    h1: 'How to Resize & Format Photo for Online Job & Exam Applications',
    author: 'FileZenith Tech Team',
    publishedDate: 'September 2026',
    readTimeMinutes: 6,
    introduction: 'Applying for government recruitment, university admissions, or passport renewal online requires submitting passport photographs adhering to strict aspect ratios, dimensions, and file size limits. Following proper photo preparation prevents application rejection.',
    sections: [
      {
        title: 'Step 1: Check Official Notification Guidelines',
        content: 'Always read the official recruitment notification for specific photo rules: file size (e.g. 20–50KB), dimensions (e.g. 3.5×4.5 cm), background color (white/light), and whether candidate name & DOP stamp is required.'
      },
      {
        title: 'Step 2: Crop Front-Facing Passport Frame',
        content: 'Crop photo so head and shoulders fill 70–80% of the frame with both ears visible and eyes facing straight ahead.'
      }
    ],
    commonMistakes: [
      'Using selfies with visible arms or tilted head.',
      'Wearing dark glasses or caps in passport photos.',
      'Uploading old blurred photographs taken years ago.'
    ],
    faq: [
      { question: 'Can I take passport photo on mobile phone?', answer: 'Yes! Stand in front of a well-lit white wall, have someone take a straight portrait photo, and use FileZenith to crop and resize.' }
    ],
    relatedTools: [
      { name: 'SSC Photo Resizer', slug: '/tools/ssc-photo-resizer', desc: 'SSC photo format.' },
      { name: 'Photo Name & Date Generator', slug: '/tools/photo-name-date-generator', desc: 'Add name & DOP stamp.' }
    ],
    relatedGuides: [
      { name: 'How to Compress Image to 50KB', slug: '/blog/how-to-compress-image-to-50kb', desc: '50KB compression tutorial.' }
    ]
  },

  'how-to-resize-signature-online': {
    slug: 'how-to-resize-signature-online',
    title: 'How to Resize Signature Online (10KB to 20KB & Clean B&W)',
    metaTitle: 'How to Resize Signature Online Free | FileZenith Guides',
    metaDescription: 'Learn how to scan, clean background paper shadows, and resize signature image to 10KB–20KB for online form submission.',
    h1: 'How to Crop, Clean & Resize Signature for Online Applications',
    author: 'FileZenith Tech Team',
    publishedDate: 'September 2026',
    readTimeMinutes: 5,
    introduction: 'Signatures photographed with smartphone cameras often come out with gray backgrounds, shadows, and huge file sizes (2MB+). Portals require clean black ink on white background weighted between 10KB and 20KB.',
    sections: [
      {
        title: 'Signing Best Practices',
        content: 'Sign on unruled plain white paper using a black or dark blue fountain/gel pen. Ensure generous spacing around the signature.'
      },
      {
        title: 'Cleaning Background Noise with Magic B&W',
        content: 'Use pixel luminance thresholding ($L = 0.299R + 0.587G + 0.114B$) to force paper shadows to pure white while making pen stroke crisp black.'
      }
    ],
    commonMistakes: [
      'Signing on blue/ruled notebook lines.',
      'Signing with red or light ink pens.',
      'Leaving dark shadows across the page when taking mobile photo.'
    ],
    faq: [
      { question: 'Can I upload signature signed with blue pen?', answer: 'Most portals accept black or dark blue ink. Avoid light blue or red ink.' }
    ],
    relatedTools: [
      { name: 'Clean B&W Signature', slug: '/tools/clean-black-white-signature', desc: 'Clean paper shadow.' },
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'Resize to 10-20KB.' }
    ],
    relatedGuides: [
      { name: 'How to Compress Image to 20KB', slug: '/blog/how-to-compress-image-to-20kb', desc: 'Compress signature 20KB.' }
    ]
  },

  'jpeg-vs-png-for-online-forms': {
    slug: 'jpeg-vs-png-for-online-forms',
    title: 'JPEG vs PNG for Online Application Forms: Which Should You Use?',
    metaTitle: 'JPEG vs PNG for Online Forms Explained | FileZenith Guides',
    metaDescription: 'Understand the difference between JPEG and PNG formats for government job forms, file compression efficiency, and portal compatibility.',
    h1: 'JPEG vs PNG for Online Forms: Complete Comparison Guide',
    author: 'FileZenith Tech Team',
    publishedDate: 'September 2026',
    readTimeMinutes: 4,
    introduction: 'When uploading photos and signatures to online forms, choosing the wrong file format (JPEG vs PNG) can lead to portal errors like "Format not supported" or "File size exceeds limit".',
    sections: [
      {
        title: 'When to Use JPEG (.jpg / .jpeg)',
        content: 'JPEG is lossy compressed format optimized for photographic images with smooth color gradients. It is the mandatory format for 99% of government job forms (SSC, UPSC, Banking, NEET) because of its tiny file size.'
      },
      {
        title: 'When to Use PNG (.png)',
        content: 'PNG is a lossless format ideal for graphics with transparent backgrounds or sharp text contrast. However, PNG files are significantly larger in byte size, making them prone to exceeding 20KB or 50KB portal ceilings.'
      }
    ],
    commonMistakes: [
      'Renaming a .png file extension to .jpg without actual format conversion.',
      'Uploading PNG images with transparent backgrounds to JPEG-only portals.'
    ],
    faq: [
      { question: 'Why does portal reject my PNG image?', answer: 'Many legacy portals only accept .jpg or .jpeg extensions. Convert your PNG to JPEG using FileZenith studio.' }
    ],
    relatedTools: [
      { name: 'Compress Image to 20KB', slug: '/tools/compress-image-to-20kb', desc: 'Convert & compress JPEG.' }
    ],
    relatedGuides: [
      { name: 'Photo Size & File Size Explained', slug: '/blog/photo-size-and-file-size-explained', desc: 'Understand file specs.' }
    ]
  },

  'photo-size-and-file-size-explained': {
    slug: 'photo-size-and-file-size-explained',
    title: 'Photo Dimensions (Pixels/CM) vs File Size (KB/MB) Explained',
    metaTitle: 'Photo Dimensions vs File Size Explained | FileZenith Guides',
    metaDescription: 'Demystifying pixels, cm, mm, DPI, KB, and MB for online form photo uploads. Learn how resolution impacts file weight.',
    h1: 'Understanding Photo Dimensions (Pixels/CM) vs File Size (KB/MB)',
    author: 'FileZenith Tech Team',
    publishedDate: 'September 2026',
    readTimeMinutes: 5,
    introduction: 'Confused by requirement specs like "3.5cm x 4.5cm, 300 DPI, between 20KB and 50KB"? This guide breaks down the technical difference between physical dimensions, pixel resolution, DPI, and file byte size.',
    sections: [
      {
        title: 'Dimensions (Pixels / CM / Inches)',
        content: 'Dimensions specify the visual width and height of the image frame. For example, 3.5 cm × 4.5 cm at 300 DPI equals 413 × 531 pixels.'
      },
      {
        title: 'File Size (KB / MB)',
        content: 'File size represents digital storage weight. 1 MB = 1024 KB. Application forms set upper limits (e.g. 50KB) so their database servers can store millions of student photos smoothly.'
      }
    ],
    commonMistakes: [
      'Confusing 350x350 pixels with 350 KB file size.',
      'Changing pixel resolution without compressing JPEG quality.'
    ],
    faq: [
      { question: 'Does resizing dimensions reduce file size?', answer: 'Yes! Reducing pixel width and height significantly decreases total file size in KB.' }
    ],
    relatedTools: [
      { name: 'SSC Photo Resizer', slug: '/tools/ssc-photo-resizer', desc: '3.5x4.5 cm resizer.' }
    ],
    relatedGuides: [
      { name: 'How to Resize Photo for Online Application', slug: '/blog/how-to-resize-photo-for-online-application', desc: 'Step-by-step resizing.' }
    ]
  },

  'how-to-reduce-image-size-without-losing-quality': {
    slug: 'how-to-reduce-image-size-without-losing-quality',
    title: 'How to Reduce Image File Size Without Losing Quality',
    metaTitle: 'Reduce Image Size Without Losing Quality | FileZenith Guides',
    metaDescription: 'Master modern image optimization techniques: canvas downscaling, JPEG quality tuning, and noise reduction for clear, small images.',
    h1: 'How to Reduce Image Size (KB) Without Visible Quality Loss',
    author: 'FileZenith Tech Team',
    publishedDate: 'September 2026',
    readTimeMinutes: 5,
    introduction: 'Compressing images does not have to mean ending up with pixelated, blurry photos. By understanding human visual perception and lossy compression parameters, you can shrink image file size by 80% with zero noticeable loss in visual quality.',
    sections: [
      {
        title: 'The Math of Perceptual Compression',
        content: 'Human eyes cannot detect minor high-frequency color variations in JPEG images. Quality factors between 0.70 and 0.85 reduce file size drastically while appearing identical to uncompressed originals.'
      }
    ],
    commonMistakes: [
      'Lowering quality down to 0.10, causing blocky JPEG artifacts.',
      'Re-saving JPEGs multiple times in sequence.'
    ],
    faq: [
      { question: 'What is the optimal JPEG quality for web forms?', answer: 'Quality between 0.75 and 0.85 offers the best balance of tiny file size and sharp visual clarity.' }
    ],
    relatedTools: [
      { name: 'Compress Image to 50KB', slug: '/tools/compress-image-to-50kb', desc: '50KB target tool.' },
      { name: 'Compress Image to 100KB', slug: '/tools/compress-image-to-100kb', desc: '100KB target tool.' }
    ],
    relatedGuides: [
      { name: 'How to Compress Image to 20KB', slug: '/blog/how-to-compress-image-to-20kb', desc: '20KB guide.' }
    ]
  },

  'ssc-photo-size-requirements': {
    slug: 'ssc-photo-size-requirements',
    title: 'SSC Photo & Signature Size Requirements (Official Rules & Format)',
    metaTitle: 'SSC Photo Size & Requirements Guide | FileZenith Guides',
    metaDescription: 'Complete official requirements for SSC CGL, CHSL, MTS photo and signature uploads: 20-50KB weight, 3.5x4.5cm dimension, name & date rules.',
    h1: 'Official SSC Photo & Signature Upload Requirements',
    author: 'FileZenith Tech Team',
    publishedDate: 'September 2026',
    readTimeMinutes: 5,
    introduction: 'Staff Selection Commission (SSC) conducts national examinations including CGL, CHSL, MTS, Stenographer, and CPO. Incorrect photograph or signature upload is the #1 reason for SSC application form rejection. Here are the official specs.',
    disclaimer: 'Requirements may change. Always verify the latest requirements on the official application portal (ssc.gov.in) before submitting your application.',
    sections: [
      {
        title: 'SSC Photograph Specifications',
        content: 'File Size: 20 KB to 50 KB. Dimensions: 3.5 cm width × 4.5 cm height (approx 413 × 531 pixels). Background: Plain light background. Both ears must be clearly visible without cap, mask, or spectacles.'
      },
      {
        title: 'SSC Signature Specifications',
        content: 'File Size: 10 KB to 20 KB. Dimensions: 4.0 cm width × 2.0 cm height (approx 400 × 200 pixels). Signed with black or dark blue ink on white paper.'
      }
    ],
    commonMistakes: [
      'Uploading photos wearing dark glasses or caps.',
      'File size exceeding 50KB limit.',
      'Signatures written in capital block letters.'
    ],
    faq: [
      { question: 'Is Name and Date of Photo mandatory for SSC?', answer: 'Always check the specific notification. Adding Candidate Name and DOP at bottom is recommended to prevent verification warnings.' }
    ],
    relatedTools: [
      { name: 'SSC Photo Resizer Tool', slug: '/tools/ssc-photo-resizer', desc: 'Format SSC photo 20-50KB.' },
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'Format SSC signature.' }
    ],
    relatedGuides: [
      { name: 'How to Compress Image to 50KB', slug: '/blog/how-to-compress-image-to-50kb', desc: '50KB compression guide.' }
    ]
  },

  'upsc-photo-size-requirements': {
    slug: 'upsc-photo-size-requirements',
    title: 'UPSC Civil Services & OTR Photo & Signature Requirements',
    metaTitle: 'UPSC OTR Photo & Signature Specs | FileZenith Guides',
    metaDescription: 'Official rules for UPSC OTR photo and signature upload: 20-300KB file size, 350x350 px min 1:1 ratio, name and date stamp requirements.',
    h1: 'Official UPSC Photo & Signature Specifications (OTR Portal)',
    author: 'FileZenith Tech Team',
    publishedDate: 'September 2026',
    readTimeMinutes: 5,
    introduction: 'Union Public Service Commission (UPSC) requires candidates registering on OTR (One Time Registration) portal for IAS, IFS, IPS, CDS, and NDA exams to upload photo and signature matching strict square guidelines.',
    disclaimer: 'Requirements may change. Always verify the latest requirements on the official application portal (upsc.gov.in / upsconline.nic.in) before submission.',
    sections: [
      {
        title: 'UPSC Photograph Guidelines',
        content: 'File Weight: 20 KB to 300 KB. Aspect Ratio: 1:1 Square (Minimum 350 × 350 pixels, Maximum 1000 × 1000 pixels). Must state Candidate Name and Date of Photo (taken within 10 days).'
      },
      {
        title: 'UPSC Signature Guidelines',
        content: 'File Weight: 20 KB to 300 KB. Resolution: 350 × 350 pixels minimum square aspect ratio.'
      }
    ],
    commonMistakes: [
      'Uploading rectangular photos instead of 1:1 square ratio.',
      'File size under 20KB or over 300KB.'
    ],
    faq: [
      { question: 'How recent should the UPSC photo date be?', answer: 'The photograph must be taken within 10 days of the start of the application process.' }
    ],
    relatedTools: [
      { name: 'UPSC Photo Resizer Tool', slug: '/tools/upsc-photo-resizer', desc: 'Format UPSC photo 350x350.' }
    ],
    relatedGuides: [
      { name: 'How to Resize Photo for Online Application', slug: '/blog/how-to-resize-photo-for-online-application', desc: 'Resizing guide.' }
    ]
  },

  'neet-photo-size-requirements': {
    slug: 'neet-photo-size-requirements',
    title: 'NTA NEET UG Photo & Postcard Photo Requirements Guide',
    metaTitle: 'NEET UG Passport & Postcard Photo Specs | FileZenith Guides',
    metaDescription: 'Official NTA NEET UG photo rules: Passport photo (10-200KB) & Postcard photo 4x6 inch (50-300KB) with candidate name and date stamp.',
    h1: 'Official NTA NEET UG Photo & Signature Upload Rules',
    author: 'FileZenith Tech Team',
    publishedDate: 'September 2026',
    readTimeMinutes: 5,
    introduction: 'National Testing Agency (NTA) mandates two distinct photographs for NEET UG candidates: a Passport size photograph and a 4"x6" Postcard photograph, both printed with Candidate Name and DOP.',
    disclaimer: 'Requirements may change. Always verify the latest requirements on the official NEET application portal (neet.nta.nic.in) before submitting.',
    sections: [
      {
        title: 'Passport Photograph Specs',
        content: 'Size: 10 KB to 200 KB. Background: White. 80% face coverage with ears visible. Candidate Name and Date of Taking Photograph printed at bottom.'
      },
      {
        title: 'Postcard Photograph Specs (4" × 6")',
        content: 'Size: 50 KB to 300 KB. Dimensions: 4 inches × 6 inches. Same photo as passport size with Name and DOP.'
      }
    ],
    commonMistakes: [
      'Omitting Name and Date of Photo on NEET post-card photograph.'
    ],
    faq: [
      { question: 'Do I need same photo for Passport and Postcard in NEET?', answer: 'Yes, NTA specifies that the passport and postcard photos must be identical images.' }
    ],
    relatedTools: [
      { name: 'NEET Photo Resizer Tool', slug: '/tools/neet-photo-resizer', desc: 'Format NEET photos.' }
    ],
    relatedGuides: [
      { name: 'How to Compress Image to 100KB', slug: '/blog/how-to-compress-image-to-100kb', desc: '100KB guide.' }
    ]
  },

  'rrb-photo-size-requirements': {
    slug: 'rrb-photo-size-requirements',
    title: 'RRB Railway Exam Photo & Signature Requirements Guide',
    metaTitle: 'RRB Railway Photo & Signature Specs | FileZenith Guides',
    metaDescription: 'Official Railway Recruitment Board rules for RRB NTPC, Group D, ALP photo (30-50KB) and signature (10-20KB) uploads.',
    h1: 'Official RRB Railway Exam Photo & Signature Specifications',
    author: 'FileZenith Tech Team',
    publishedDate: 'September 2026',
    readTimeMinutes: 4,
    introduction: 'Railway Recruitment Board (RRB) exams require strict adherence to file weight limits. Photos under 30KB are automatically rejected by the portal.',
    disclaimer: 'Requirements may change. Always verify the latest requirements on official RRB regional websites before submitting.',
    sections: [
      {
        title: 'RRB Photo Specs',
        content: 'File Size: 30 KB to 50 KB. Dimensions: 320 × 240 pixels (35mm × 45mm). Clear color photo on light background.'
      },
      {
        title: 'RRB Signature Specs',
        content: 'File Size: 10 KB to 20 KB. Dimensions: 140 × 60 pixels.'
      }
    ],
    commonMistakes: [
      'File size falling below 30KB.'
    ],
    faq: [
      { question: 'Why does RRB reject photo below 30KB?', answer: 'Railway portal validation code explicitly checks file size >= 30KB to ensure high print quality on admit cards.' }
    ],
    relatedTools: [
      { name: 'RRB Railway Photo Resizer', slug: '/tools/rrb-railway-photo-resizer', desc: 'Format RRB photo.' }
    ],
    relatedGuides: [
      { name: 'How to Compress Image to 50KB', slug: '/blog/how-to-compress-image-to-50kb', desc: '50KB guide.' }
    ]
  }
};
