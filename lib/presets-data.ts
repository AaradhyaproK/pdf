export interface RelatedToolItem {
  name: string;
  slug: string;
  desc: string;
}

export interface PresetConfig {
  slug: string;
  portalName: string;
  defaultTargetKB: number;
  minKB?: number;
  maxKB?: number;
  fixedWidth?: number;
  fixedHeight?: number;
  aspectRatio?: number;
  isSignature?: boolean;
  allowNameDate?: boolean;
  isJoinerMode?: boolean;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  shortDescription: string;
  longDescription: string;
  targetSize: string;
  minimumSize?: string;
  maximumSize?: string;
  width?: string;
  height?: string;
  allowedFormats: string[];
  instructions: string[];
  requirements: string[];
  tips: string[];
  officialGuidelines: string;
  lastVerifiedDate: string;
  faq: Array<{ question: string; answer: string }>;
  relatedTools: RelatedToolItem[];
  keywords: string[];
}

export const PRESET_REGISTRY: Record<string, PresetConfig> = {
  'signature-resizer-10-to-20kb': {
    slug: 'signature-resizer-10-to-20kb',
    portalName: 'Govt Job & Bank Portals',
    defaultTargetKB: 18,
    minKB: 10,
    maxKB: 20,
    fixedWidth: 400,
    fixedHeight: 200,
    isSignature: true,
    title: 'Signature Resizer 10 to 20KB Online Free (Magic B&W Clean) | FileZenith',
    metaTitle: 'Signature Resizer 10 to 20KB Online Free | FileZenith',
    metaDescription: 'Resize signature to 10KB - 20KB online free for SSC CGL, IBPS PO/Clerk, SBI, Railway RRB, and State PSCs. Magic B&W cleanup removes shadows and yellow paper tint. 100% private in-browser.',
    h1: 'Signature Resizer 10 to 20KB (Online Form Specialist)',
    shortDescription: 'Resize, clean, and crop signature scans to 10KB–20KB for government job portals (SSC, IBPS, SBI, Railway RRB).',
    longDescription: 'Most Indian recruitment portals (SSC CGL, CHSL, IBPS PO/Clerk, SBI, RRB NTPC, State PSCs) reject uploaded signatures if the file size exceeds 20KB, falls below 10KB, or has dark paper shadows. Our client-side studio crops, cleans background noise with Magic B&W thresholding, and binary-searches JPEG quality to hit 10–20KB safely.',
    targetSize: '10 KB to 20 KB',
    minimumSize: '10 KB',
    maximumSize: '20 KB',
    width: '400 px (or 140x60 px)',
    height: '200 px',
    allowedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    instructions: [
      'Sign with a black or dark blue ink pen on clean white paper.',
      'Take a clear photograph or mobile scan of your signature without heavy shadows.',
      'Upload the file above and toggle Magic B&W to clean paper grain and force background to pure white.',
      'Adjust target size slider between 10KB and 20KB (recommended: 18 KB).',
      'Click Download to save your verified 10–20KB JPEG file ready for upload.'
    ],
    requirements: [
      'File size must strictly remain between 10 KB and 20 KB.',
      'Dimensions: 2:1 rectangle aspect ratio (400×200 pixels or 140×60 pixels).',
      'Signatures in capital letters, red ink, or on ruled paper are rejected by exam portals.',
      'Clear high contrast between pen ink and white background.'
    ],
    tips: [
      'Use good lighting when photographing signatures on mobile to avoid shadows.',
      'Toggle Magic B&W to eliminate paper shadows, yellow tint, and mobile camera noise.',
      'Do not upload cropped images of signatures from lined notebook paper.'
    ],
    officialGuidelines: 'Official recruitment portal standards (SSC, IBPS, UPSC, State PSCs) require signatures to be signed on white paper with black/blue pen, cropped neatly without border shadows, and weighted strictly between 10KB and 20KB in JPEG/JPG format.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'Why does online job portal reject my signature upload?', answer: 'Government portals like SSC, IBPS, and SBI reject signatures if the file size exceeds 20KB, falls below 10KB, or has low contrast with gray/yellow paper backgrounds. Our tool uses binary search compression and B&W enhancement to fix all three issues.' },
      { question: 'What is Magic B&W Signature Cleanup?', answer: 'Our Magic B&W mode thresholding converts shadows, mobile photo yellow tint, and paper grain into pure white while forcing pen ink to crisp high-contrast black.' },
      { question: 'What are the official pixel dimensions for signature in online applications?', answer: 'Most portals specify 140 × 60 pixels or a 2:1 aspect ratio (e.g. 400 × 200 pixels). Our tool locks the aspect ratio so your signature never stretches or distorts.' },
      { question: 'Can I use blue ink pen or is black ink mandatory?', answer: 'SSC and IBPS officially recommend black ink pen for maximum optical scanning contrast. However, dark blue pen is accepted if contrast is sharp. Red or green ink is strictly rejected.' },
      { question: 'Will reducing signature to 10-20KB make it blurry?', answer: 'No! Our tool applies intelligent client-side canvas binary-search compression, ensuring maximum pixel sharpness at the exact target file size.' },
      { question: 'Is my signature uploaded or saved on any server?', answer: 'Never! All canvas processing runs 100% locally inside your web browser. Your signature never leaves your computer or phone.' }
    ],
    relatedTools: [
      { name: 'Clean B&W Signature', slug: '/tools/clean-black-white-signature', desc: 'Remove gray paper background noise.' },
      { name: 'SSC Photo Resizer', slug: '/tools/ssc-photo-resizer', desc: 'SSC photo with name & date stamp.' },
      { name: 'Compress Image to 20KB', slug: '/tools/compress-image-to-20kb', desc: 'Generic 20KB file size compressor.' },
      { name: 'GATE Signature Resizer', slug: '/tools/gate-signature-resizer', desc: 'GATE 560x160 px signature format.' }
    ],
    keywords: [
      'signature resizer 10 to 20kb',
      'signature resize 10 to 20 kb online',
      'signature resize 10 to 20 kb online free',
      'signature size converter for online application',
      'reduce signature size in kb free',
      'signature photo resizer 140x60',
      'convert signature to black and white online',
      'make signature background white',
      'signature compressor 10kb 20kb for ibps sbi',
      'signature resizer for ssc cgl chsl',
      'online signature crop and resize',
      'sarkari result signature resizer',
      'how to reduce signature size to 10kb 20kb',
      'signature resize 10 to 20 kb in mobile phone',
      'signature size 10 to 20 kb online converter jpg',
      'signature 10 se 20 kb me kaise kare',
      'upsc signature resizer 10 to 20 kb',
      'rrb railway signature resize 10kb to 20kb',
      'signature background white remover for exam form',
      'magic black and white signature enhancer',
      'signature size reducer below 20kb free'
    ]
  },

  'ssc-photo-resizer': {
    slug: 'ssc-photo-resizer',
    portalName: 'Staff Selection Commission (SSC)',
    defaultTargetKB: 45,
    minKB: 20,
    maxKB: 50,
    fixedWidth: 413,
    fixedHeight: 531,
    allowNameDate: true,
    title: 'SSC Photo Resizer 20 to 50KB Online Free (3.5x4.5cm Name & Date) | FileZenith',
    metaTitle: 'SSC Photo Resizer (20 to 50KB with Name & Date) | FileZenith',
    metaDescription: 'Resize SSC CGL, CHSL, MTS, GD Constable & CPO photo to 20KB - 50KB with candidate name and date of photo (DOP) stamp. 3.5cm x 4.5cm (413x531 px) format 100% free & secure.',
    h1: 'SSC Photo Resizer (20 to 50KB with Name & Date Stamp)',
    shortDescription: 'Format passport photo (3.5 × 4.5 cm, 20KB–50KB) with candidate name and DOP stamp for SSC CGL, CHSL, MTS, GD, and CPO applications.',
    longDescription: 'Staff Selection Commission (SSC) application portals mandate passport photos sized strictly between 20KB and 50KB with exact dimensions of 3.5 cm × 4.5 cm (413 × 531 pixels at 300 DPI). Optionally print candidate full name and date of photo (DOP) in the bottom white bar as specified by official recruitment notices.',
    targetSize: '20 KB to 50 KB',
    minimumSize: '20 KB',
    maximumSize: '50 KB',
    width: '413 px (3.5 cm)',
    height: '531 px (4.5 cm)',
    allowedFormats: ['JPG', 'JPEG', 'PNG'],
    instructions: [
      'Upload a clear, front-facing passport photograph with both ears and shoulders visible.',
      'Check the Candidate Name & Date Stamp option if required by your SSC notification.',
      'Type candidate full name in CAPITAL LETTERS and select Date of Photo taking (DOP).',
      'Adjust the size slider between 20KB and 50KB (recommended: 45 KB).',
      'Download your formatted JPEG photo ready for instant SSC portal upload.'
    ],
    requirements: [
      'Passport photo must be taken against a plain light white or off-white background.',
      'Spectacles, tinted glasses, caps, hats, or side-profile photos are strictly prohibited and cause application rejection.',
      'File weight must strictly remain between 20 KB and 50 KB.',
      'Face must occupy at least 70% to 80% of the photograph area.'
    ],
    tips: [
      'Ensure the date printed on photo is within 3 months of the notification release date.',
      'Keep head straight without tilting, neutral expression, and both ears clearly visible.',
      'Use a light white or off-white background with uniform lighting.'
    ],
    officialGuidelines: 'SSC official guidelines mandate 3.5 cm × 4.5 cm dimensions (413 × 531 pixels at 300 DPI), clear light background, neutral expression, both ears visible, and file size strictly between 20KB and 50KB in JPEG/JPG format.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'Will SSC reject my application if the photo is without Name and Date?', answer: 'Certain SSC notifications (like CGL, CHSL, GD, and MTS) explicitly mandate Candidate Full Name and Date of Photo (DOP) printed at the bottom. Even with live webcam capture on new portals, adding Name and DOP guarantees compliance and eliminates verification disputes.' },
      { question: 'What are the exact pixel dimensions for SSC photo and signature?', answer: 'The official SSC photo dimensions are 3.5 cm width × 4.5 cm height (413 × 531 pixels at 300 DPI or 100 × 120 pixels). SSC signature must be 4.0 cm × 2.0 cm (140 × 60 pixels) weighted 10KB to 20KB.' },
      { question: 'How to compress SSC photo to 20 to 50 KB on mobile?', answer: 'Simply upload your mobile camera picture above. Our canvas binary-search engine automatically crops it to 3.5x4.5cm and optimizes file size to ~45KB in 1 click without any quality loss.' },
      { question: 'Can I wear spectacles or cap in SSC photograph?', answer: 'No! SSC strictly disallows spectacles, sunglasses, caps, masks, or mufflers. Wearing spectacles is one of the most common reasons for SSC application form rejection.' },
      { question: 'How old can the photograph be for SSC forms?', answer: 'The photograph must not be more than 3 months old from the date of publication of the examination notice.' }
    ],
    relatedTools: [
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'Format signature for SSC portal.' },
      { name: 'Photo Name & Date Generator', slug: '/tools/photo-name-date-generator', desc: 'Add candidate name bar to photo.' },
      { name: 'Compress Image to 50KB', slug: '/tools/compress-image-to-50kb', desc: 'Compress image under 50KB limit.' },
      { name: 'Aadhaar Card Print Tool', slug: '/tools/aadhaar-card-print', desc: 'Print Aadhaar ID card for exam center entry.' }
    ],
    keywords: [
      'ssc photo resizer 20 to 50kb',
      'ssc photo resizer 20 to 50 kb online free',
      'ssc photo and signature size converter',
      'ssc cgl photo resizer 2026',
      'ssc chsl photo resizer 20kb to 50kb',
      'ssc photo with name and date maker',
      'ssc photo size in cm 3.5 x 4.5',
      'how to reduce photo size for ssc form',
      'ssc gd photo compressor',
      'ssc mts photo resizer online free',
      'ssc stenographer photo dimension',
      'sarkari result ssc photo resizer',
      'ssc photo upload size in pixels 413x531',
      'compress photo to 20 to 50 kb for ssc',
      'ssc cpo si photo size 20 to 50 kb',
      'ssc photo name date format editor',
      'photo with name and date for ssc online form',
      'ssc photo 20 to 50 kb mobile me kaise banaye',
      'ssc live photo alternative upload',
      'ssc photo date of photo dop maker',
      'sarkari result photo resizer 20 to 50 kb',
      'ssc exam photo compressor online'
    ]
  },

  'upsc-photo-resizer': {
    slug: 'upsc-photo-resizer',
    portalName: 'UPSC OTR Portal',
    defaultTargetKB: 180,
    minKB: 20,
    maxKB: 300,
    fixedWidth: 350,
    fixedHeight: 350,
    allowNameDate: true,
    title: 'UPSC Photo & Signature Resizer (20 to 300KB, 350x350 OTR) | FileZenith',
    metaTitle: 'UPSC Photo & Signature Resizer (OTR Guidelines) | FileZenith',
    metaDescription: 'Resize UPSC Civil Services IAS, CDS, NDA & OTR photo and signature to 20KB - 300KB. 350x350 px (1:1 square) format with candidate name and date stamp free online.',
    h1: 'UPSC Photo & Signature Resizer (OTR Guidelines)',
    shortDescription: 'Resize passport photo and signature to 350×350 pixels (20KB–300KB) for UPSC Civil Services, NDA, CDS, and OTR registration.',
    longDescription: 'Union Public Service Commission (UPSC) One Time Registration (OTR) demands square photographs (minimum 350 × 350 pixels up to 1000 × 1000 pixels) with Candidate Full Name and Date of Photo printed at the bottom bar. The file weight must strictly be between 20KB and 300KB in JPG/JPEG format.',
    targetSize: '20 KB to 300 KB',
    minimumSize: '20 KB',
    maximumSize: '300 KB',
    width: '350 px min (1:1 Square)',
    height: '350 px min',
    allowedFormats: ['JPG', 'JPEG'],
    instructions: [
      'Upload high-resolution passport photo.',
      'Enter candidate full name and date on which photo was taken (DOP).',
      'Ensure the printed date is within 10 days of application filling as per latest UPSC notice.',
      'Confirm 1:1 square crop (350×350 pixels).',
      'Download 350x350 px JPEG file verified for UPSC OTR portal submission.'
    ],
    requirements: [
      'File size must strictly remain between 20 KB and 300 KB.',
      'Aspect ratio must strictly be 1:1 square (min 350×350 pixels, max 1000×1000 pixels).',
      'Candidate Name and Date of Taking Photo must be printed clearly at the bottom.',
      'Face must occupy at least 3/4th (75%) of the total frame with neutral expression.'
    ],
    tips: [
      'UPSC photo date should be recent (taken within 10 days of application start).',
      'Candidate appearance (beard, mustache, hairstyle) must match their exam day look.',
      'Ensure background is plain light colored with uniform lighting.'
    ],
    officialGuidelines: 'UPSC Civil Services OTR requires photo and signature images between 20KB and 300KB, minimum resolution 350×350 pixels (square 1:1 ratio), candidate name and date of photo printed at the bottom.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'What is the 10-day date rule for UPSC photograph?', answer: 'According to the latest UPSC examination instructions, the photograph must not be more than 10 days old from the commencement of the online application process. Candidate name and date must be printed on the bottom.' },
      { question: 'What are the exact pixel and file size limits for UPSC OTR?', answer: 'Both photograph and signature must be square 1:1 ratio (minimum 350 × 350 pixels, maximum 1000 × 1000 pixels) with file size strictly between 20 KB and 300 KB in JPG/JPEG format.' },
      { question: 'Why does UPSC portal show "Image dimensions not matching" error?', answer: 'The UPSC portal requires a strict 1:1 square aspect ratio. Uploading a rectangular 3.5×4.5cm photo causes this error. Our tool automatically centers and crops your photo into a perfect 350×350 square.' },
      { question: 'Can I upload photo with spectacles in UPSC OTR?', answer: 'UPSC advises against spectacles or tinted glasses to prevent flash reflection over the eyes. If you wear prescription spectacles regularly, ensure eyes are clearly visible without glare.' }
    ],
    relatedTools: [
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'Resize signature file.' },
      { name: 'Photo & Signature Joiner', slug: '/tools/photo-signature-joiner', desc: 'Combine photo & signature.' },
      { name: 'Compress Image to 100KB', slug: '/tools/compress-image-to-100kb', desc: 'Target 100KB compressor.' },
      { name: 'Aadhaar Card Print Tool', slug: '/tools/aadhaar-card-print', desc: 'Format Aadhaar card for UPSC verification.' }
    ],
    keywords: [
      'upsc photo resizer 20 to 300kb',
      'upsc otr photo resizer 350x350',
      'upsc otr photo and signature size converter',
      'upsc photo size 350x350 pixels',
      'upsc photo date and name stamp generator',
      'upsc signature resizer 20 to 300 kb',
      'upsc cse photo upload guidelines',
      'upsc otr photo rejected solution',
      'upsc photo 10 days old rule',
      'upsc online application photo format',
      'upsc photo compressor',
      'sarkari result upsc photo maker',
      'upsc civil services photo and signature resizer',
      'upsc ias photo size converter',
      'upsc nda cds photo resizer 350x350',
      'upsc photo square 1:1 ratio resizer',
      'upsc otr photo dimension not matching error fix'
    ]
  },

  'ibps-sbi-photo-resizer': {
    slug: 'ibps-sbi-photo-resizer',
    portalName: 'IBPS & State Bank of India',
    defaultTargetKB: 45,
    minKB: 20,
    maxKB: 50,
    fixedWidth: 200,
    fixedHeight: 230,
    title: 'IBPS & SBI Photo Resizer 20 to 50KB Online Free | FileZenith',
    metaTitle: 'IBPS & SBI Bank Exam Photo Resizer (20 to 50KB) | FileZenith',
    metaDescription: 'Resize passport photo for IBPS PO, Clerk, SBI PO application forms (20KB - 50KB, 200x230 pixels) 100% free and instantly in browser.',
    h1: 'IBPS & SBI Bank Exam Photo Resizer (20 to 50KB)',
    shortDescription: 'Format passport photo (200×230 px, 20KB–50KB) for IBPS PO, IBPS Clerk, SBI PO, and SBI Clerk online forms.',
    longDescription: 'Institute of Banking Personnel Selection (IBPS) and State Bank of India (SBI) online application portals mandate passport photo file weight between 20KB and 50KB, dimensions 200×230 pixels.',
    targetSize: '20 KB to 50 KB',
    minimumSize: '20 KB',
    maximumSize: '50 KB',
    width: '200 px',
    height: '230 px',
    allowedFormats: ['JPG', 'JPEG'],
    instructions: [
      'Select a clean passport photo file.',
      'Adjust file size target slider to 45KB.',
      'Click Download to generate 200x230 px JPEG image.'
    ],
    requirements: [
      'Dimensions: 200 × 230 pixels.',
      'File Size: 20KB to 50KB.',
      'Red eye, shadows, caps, or dark glasses cause rejection.'
    ],
    tips: [
      'Ensure background is light colored, preferably white.',
      'Look straight at the camera with neutral expression.'
    ],
    officialGuidelines: 'IBPS and SBI bank exam portals require passport photograph size between 20KB and 50KB with dimensions 200×230 pixels (4.5cm × 3.5cm) in JPEG/JPG format.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'What is the exact photo size for IBPS PO/Clerk?', answer: 'IBPS requires 20KB to 50KB file weight and 200 × 230 pixels dimension.' },
      { question: 'What is the IBPS signature size requirement?', answer: 'IBPS signature must be between 10KB and 20KB with 140 × 60 pixels dimension.' },
      { question: 'Why does IBPS portal show "File size not within limit" error?', answer: 'This occurs if the photo is over 50KB or under 20KB. Our engine automatically binary searches quality to land at ~45KB.' }
    ],
    relatedTools: [
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'Format IBPS signature.' },
      { name: 'Compress Image to 50KB', slug: '/tools/compress-image-to-50kb', desc: '50KB size ceiling.' }
    ],
    keywords: [
      'ibps photo resizer 20 to 50kb',
      'ibps po photo resizer 200x230',
      'ibps clerk photo and signature size converter',
      'sbi po photo resizer 20 to 50 kb',
      'sbi clerk photo signature size converter',
      'bank exam photo size converter 20 to 50 kb',
      'ibps signature resizer 10 to 20 kb',
      'ibps thumb impression resizer 20 to 50 kb',
      'ibps hand written declaration resizer 50 to 100 kb',
      'sarkari result bank photo resizer',
      'ibps online application photo size in pixels'
    ]
  },

  'rrb-railway-photo-resizer': {
    slug: 'rrb-railway-photo-resizer',
    portalName: 'Railway Recruitment Board (RRB)',
    defaultTargetKB: 45,
    minKB: 30,
    maxKB: 50,
    fixedWidth: 320,
    fixedHeight: 240,
    title: 'RRB Railway Photo Resizer (30 to 50KB) Free | FileZenith',
    metaTitle: 'RRB Railway Exam Photo Resizer (30 to 50KB) | FileZenith',
    metaDescription: 'Resize RRB NTPC, Group D, ALP photo to 30KB - 50KB (320x240 pixels). Free online tool compliant with Indian Railways recruitment standards.',
    h1: 'RRB Railway Exam Photo Resizer (30 to 50KB)',
    shortDescription: 'Resize photo (30KB–50KB, 320×240 px) for RRB NTPC, Group D, ALP, and Technician railway applications.',
    longDescription: 'Railway Recruitment Board (RRB) requires color photograph with light background, file weight between 30KB and 50KB, dimensions 320×240 pixels.',
    targetSize: '30 KB to 50 KB',
    minimumSize: '30 KB',
    maximumSize: '50 KB',
    width: '320 px',
    height: '240 px',
    allowedFormats: ['JPG', 'JPEG'],
    instructions: [
      'Upload clear color passport photo.',
      'Ensure size target is between 30KB and 50KB.',
      'Download formatted JPEG file.'
    ],
    requirements: [
      'File weight must be minimum 30KB and maximum 50KB.',
      'Dimensions 320 × 240 pixels.'
    ],
    tips: [
      'Do not upload photos under 30KB as RRB portal strictly rejects them.'
    ],
    officialGuidelines: 'Railway Recruitment Board (RRB NTPC, Group D, Technicians) mandates color passport photo with light background, file size 30KB to 50KB, dimensions 35mm × 45mm (320×240 pixels).',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'What is the minimum file size for RRB Railway photo?', answer: 'RRB requires a minimum of 30KB and maximum of 50KB. Files under 30KB will be rejected by the portal.' },
      { question: 'Can I use photo with cap or dark glasses?', answer: 'No, Railway board strictly rejects photographs with caps, goggles, or heavy shadows.' }
    ],
    relatedTools: [
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'Format RRB signature.' },
      { name: 'Compress Image to 50KB', slug: '/tools/compress-image-to-50kb', desc: 'Shrink photo under 50KB.' }
    ],
    keywords: [
      'rrb photo resizer 30 to 50kb',
      'railway ntpc photo size resizer',
      'rrb group d photo dimension',
      'rrb alp technician photo and signature resizer',
      'railway recruitment board photo compressor',
      'rrb photo 30kb to 50kb converter',
      'indian railways exam photo size converter',
      'rrb signature resizer 10 to 20 kb',
      'sarkari result railway photo resizer',
      'rrb online application photo size 320x240'
    ]
  },

  'neet-photo-resizer': {
    slug: 'neet-photo-resizer',
    portalName: 'NTA NEET UG Portal',
    defaultTargetKB: 150,
    minKB: 10,
    maxKB: 200,
    fixedWidth: 400,
    fixedHeight: 600,
    allowNameDate: true,
    title: 'NEET Photo Resizer 2026 (Passport 10-200KB & Postcard 4x6) | FileZenith',
    metaTitle: 'NTA NEET UG Photo Resizer (Passport & Postcard) | FileZenith',
    metaDescription: 'Resize NTA NEET UG Passport photo (10KB - 200KB) and Postcard photo (4x6 inch, 50KB - 300KB) with Candidate Name & Date of Photo (DOP) stamp. 100% free, white background compliant.',
    h1: 'NTA NEET UG Photo Resizer (Passport & Postcard Format)',
    shortDescription: 'Format NEET Passport (10KB–200KB) & Postcard 4"×6" photo with candidate name & DOP stamp.',
    longDescription: 'National Testing Agency (NTA) NEET UG online application requires two photographs: a Passport photograph (10KB to 200KB) and a Postcard 4"×6" photograph (50KB to 300KB). Both must have a pure white background with Candidate Full Name and Date of Taking Photograph (DOP) printed clearly at the bottom.',
    targetSize: '10 KB to 200 KB',
    minimumSize: '10 KB',
    maximumSize: '200 KB',
    width: '400 px (Passport & 4x6 Postcard)',
    height: '600 px',
    allowedFormats: ['JPG', 'JPEG'],
    instructions: [
      'Upload a front-facing photograph against a solid white background.',
      'Enter candidate full name in CAPITAL LETTERS and select Date of Photo taking (DOP).',
      'Choose Passport size (10–200KB) or Postcard 4"×6" size (50–300KB).',
      'Download your NTA-verified JPEG image ready for NEET registration.'
    ],
    requirements: [
      'Passport photo size: 10 KB to 200 KB.',
      'Postcard photo size: 4 inches × 6 inches, file size 50 KB to 300 KB.',
      'Solid pure white background is strictly mandatory (no blue, gray, or patterned backgrounds).',
      'Candidate Name and Date on which photo was taken (DOP) must be stamped at the bottom.',
      'Ears must be clearly visible with at least 80% face coverage.'
    ],
    tips: [
      'Ensure at least 80% face coverage with ears clearly visible.',
      'Do not wear caps or sunglasses (spectacles are allowed only if worn regularly without tint or reflection).',
      'Keep 6-8 identical physical copies of this photo for exam center verification.'
    ],
    officialGuidelines: 'NTA NEET UG mandates Passport photo (10KB - 200KB) and Postcard 4"×6" photo (50KB - 300KB) with pure white background, 80% face coverage showing ears, and candidate name with date of taking photograph printed at the bottom.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'What is the difference between NEET Passport and Postcard photo?', answer: 'NEET requires both: 1. Passport photo (standard 3.5×4.5cm, 10KB–200KB) used on the admit card and confirmation page. 2. Postcard photo (large 4×6 inch size, 50KB–300KB) to be pasted on the attendance sheet at the examination hall.' },
      { question: 'Is Candidate Name and Date mandatory on NEET photograph?', answer: 'Yes! NTA NEET information bulletin explicitly mandates that the photograph must clearly state the candidate name along with the date on which photo was taken.' },
      { question: 'What is the exact file size and dimensions for NEET 4x6 postcard photo?', answer: 'Postcard photograph must be 4 inches wide × 6 inches high (approx 1200 × 1800 pixels at 300 DPI) with file size strictly between 50KB and 300KB in JPG/JPEG format.' },
      { question: 'Can I upload photo with blue or red background for NEET?', answer: 'No! NTA strictly requires a pure white background. Photos with colored backgrounds or shadows risk immediate application rejection.' }
    ],
    relatedTools: [
      { name: 'Photo Name & Date Generator', slug: '/tools/photo-name-date-generator', desc: 'Add candidate name stamp.' },
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'NEET signature resizer.' },
      { name: 'Compress Image to 100KB', slug: '/tools/compress-image-to-100kb', desc: 'Postcard photo compressor.' },
      { name: 'Aadhaar Card Print Tool', slug: '/tools/aadhaar-card-print', desc: 'Print Aadhaar card for NEET center entry.' }
    ],
    keywords: [
      'neet photo resizer online',
      'neet postcard size photo 4x6 converter',
      'neet passport size photo 10 to 200 kb',
      'neet postcard photo size in cm',
      'neet photo with name and date generator dop',
      'nta neet photo background white',
      'neet 2026 application form photo size',
      'neet signature resizer 4 to 30 kb',
      'neet postcard photo maker',
      'neet photo size 4x6 inch compressor',
      'sarkari result neet photo resizer',
      'neet 4x6 postcard photo size in pixels 1200x1800',
      'nta neet passport photo size 3.5 x 4.5 cm',
      'neet candidate name and date photo editor',
      'neet postcard photo 50 to 300 kb converter'
    ]
  },

  'bpsc-photo-resizer': {
    slug: 'bpsc-photo-resizer',
    portalName: 'Bihar Public Service Commission (BPSC)',
    defaultTargetKB: 45,
    minKB: 20,
    maxKB: 50,
    fixedWidth: 250,
    fixedHeight: 250,
    title: 'BPSC Photo & Signature Resizer 20 to 50KB | FileZenith',
    metaTitle: 'BPSC Photo & Signature Resizer (20 to 50KB) | FileZenith',
    metaDescription: 'Resize photo and signature for BPSC Bihar Teacher & CCE exam applications (20KB - 50KB, 250x250 pixels) 100% free online.',
    h1: 'BPSC Photo & Signature Resizer (Bihar PSC Guidelines)',
    shortDescription: 'Resize photo and signature (20KB–50KB) for BPSC Bihar Teacher (TRE) & CCE prelims/mains forms.',
    longDescription: 'Bihar Public Service Commission (BPSC) online application system mandates photo and signature file weights between 20KB and 50KB.',
    targetSize: '20 KB to 50 KB',
    minimumSize: '20 KB',
    maximumSize: '50 KB',
    width: '250 px',
    height: '250 px',
    allowedFormats: ['JPG', 'JPEG'],
    instructions: [
      'Upload BPSC photo or signature file.',
      'Process to target ~45KB.',
      'Download JPEG file.'
    ],
    requirements: ['File size 20KB to 50KB.'],
    tips: ['Clear background with legible signature.'],
    officialGuidelines: 'BPSC requires photograph and signature images to be between 20KB and 50KB in JPEG format with a clear background.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'What are BPSC signature requirements in Hindi and English?', answer: 'BPSC requires both English and Hindi signatures in separate boxes between 10KB and 20KB.' }
    ],
    relatedTools: [
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'BPSC signature size tool.' },
      { name: 'Compress Image to 50KB', slug: '/tools/compress-image-to-50kb', desc: 'Compress image under 50KB.' }
    ],
    keywords: [
      'bpsc photo resizer 20 to 50kb',
      'bihar bpsc teacher photo size',
      'bpsc signature resizer',
      'bpsc tre 3 photo and signature size converter',
      'bpsc hindi and english signature resizer 10 to 20 kb',
      'bihar public service commission photo compressor',
      'bpsc cce prelims photo size 250x250',
      'sarkari result bpsc photo resizer',
      'bpsc form photo format in kb'
    ]
  },

  'mpsc-photo-resizer': {
    slug: 'mpsc-photo-resizer',
    portalName: 'Maharashtra Public Service Commission (MPSC)',
    defaultTargetKB: 45,
    minKB: 20,
    maxKB: 50,
    fixedWidth: 413,
    fixedHeight: 531,
    title: 'MPSC Photo Resizer 20 to 50KB Online Free | FileZenith',
    metaTitle: 'MPSC Exam Photo Resizer (20 to 50KB) | FileZenith',
    metaDescription: 'Resize photo for Maharashtra MPSC Rajyaseva exam portal (20KB - 50KB, 3.5cm x 4.5cm). Fast, free, 100% in-browser privacy.',
    h1: 'MPSC Exam Photo Resizer (20 to 50KB)',
    shortDescription: 'Format passport photo (3.5 × 4.5 cm, 20KB–50KB) for Maharashtra MPSC Rajyaseva application portal.',
    longDescription: 'MPSC online application portal specifies photo weight between 20KB and 50KB with dimensions 3.5 cm × 4.5 cm.',
    targetSize: '20 KB to 50 KB',
    minimumSize: '20 KB',
    maximumSize: '50 KB',
    width: '413 px',
    height: '531 px',
    allowedFormats: ['JPG', 'JPEG'],
    instructions: ['Upload passport photo.', 'Target ~45KB file size.', 'Download output.'],
    requirements: ['Size 20KB–50KB, 3.5cm x 4.5cm.'],
    tips: ['Use clean light background.'],
    officialGuidelines: 'MPSC online application portal specifies photo weight between 20KB and 50KB with dimensions 3.5 cm × 4.5 cm (413 × 531 pixels).',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'What is MPSC photo aspect ratio?', answer: 'Standard 3.5 cm width to 4.5 cm height (approx 1:1.28 ratio).' }
    ],
    relatedTools: [
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'MPSC signature resizer.' },
      { name: 'Compress Image to 50KB', slug: '/tools/compress-image-to-50kb', desc: 'Shrink photo size.' }
    ],
    keywords: [
      'mpsc photo resizer 20 to 50kb',
      'maharashtra mpsc rajyaseva photo dimension',
      'mpsc signature resizer 10 to 20 kb',
      'mpsc photo size 3.5cm x 4.5cm in pixels',
      'maharashtra public service commission photo compressor',
      'sarkari result mpsc photo maker'
    ]
  },

  'pan-card-photo-resizer': {
    slug: 'pan-card-photo-resizer',
    portalName: 'NSDL / UTIITSL PAN Portal',
    defaultTargetKB: 45,
    minKB: 10,
    maxKB: 50,
    fixedWidth: 213,
    fixedHeight: 213,
    title: 'PAN Card Photo Resizer (213x213 px, Under 50KB) | FileZenith',
    metaTitle: 'PAN Card Photo Resizer (NSDL & UTIITSL) | FileZenith',
    metaDescription: 'Resize photo for NSDL & UTIITSL PAN Card online application. Exact 213x213 pixels, 300 DPI, under 50KB file size 100% free.',
    h1: 'PAN Card Photo Resizer (NSDL & UTIITSL Specification)',
    shortDescription: 'Resize photo to exact 213×213 pixels (under 50KB) for NSDL e-Gov and UTIITSL PAN Card portals.',
    longDescription: 'PAN Card application portals (NSDL e-Gov & UTIITSL) strictly require photo dimensions to be 213 × 213 pixels (2.5 cm × 2.5 cm) at 300 DPI, file size under 50KB.',
    targetSize: '10 KB to 50 KB',
    minimumSize: '10 KB',
    maximumSize: '50 KB',
    width: '213 px',
    height: '213 px',
    allowedFormats: ['JPG', 'JPEG'],
    instructions: ['Upload photo file.', 'Confirm 213x213 px crop.', 'Download JPEG under 50KB.'],
    requirements: ['Exact 213 × 213 pixels, size under 50KB.'],
    tips: ['Ensure photo is clear square crop.'],
    officialGuidelines: 'PAN Card application portals (NSDL e-Gov & UTIITSL) strictly require photo dimensions to be 213 × 213 pixels (2.5 cm × 2.5 cm) at 300 DPI, file size under 50KB in JPEG format.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'What is PAN card photo size in pixels?', answer: 'Exact 213 pixels width × 213 pixels height square format.' },
      { question: 'What is PAN card signature size?', answer: 'Signature size is 444 × 205 pixels, file size under 50KB.' }
    ],
    relatedTools: [
      { name: 'Compress Image to 50KB', slug: '/tools/compress-image-to-50kb', desc: 'Compress photo to 50KB.' },
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'PAN signature resizer.' }
    ],
    keywords: [
      'pan card photo resizer 213x213',
      'nsdl pan card photo dimension converter',
      'utiitsl pan photo size 213x213',
      'pan card signature resizer 444x205',
      'pan card photo compressor under 50kb',
      'pan card photo size in cm 2.5 x 2.5',
      'how to resize photo for pan card online free',
      'nsdl uti pan card photo resizer 300 dpi',
      'pan card application photo size converter'
    ]
  },

  'gate-signature-resizer': {
    slug: 'gate-signature-resizer',
    portalName: 'IIT GATE GOAPS Portal',
    defaultTargetKB: 70,
    minKB: 5,
    maxKB: 80,
    fixedWidth: 560,
    fixedHeight: 160,
    isSignature: true,
    title: 'IIT GATE Signature Resizer (5 to 80KB, 560x160) | FileZenith',
    metaTitle: 'IIT GATE Signature Resizer (GOAPS Portal Ready) | FileZenith',
    metaDescription: 'Resize GATE GOAPS signature to 5KB - 80KB (aspect ratio 3.5:1, 560x160 px). Magic B&W cleanup for black/dark blue pen signatures.',
    h1: 'IIT GATE Signature Resizer (GOAPS Portal Ready)',
    shortDescription: 'Resize signature (5KB–80KB, 3.5:1 ratio, 560×160 px) for IIT GATE GOAPS application.',
    longDescription: 'IIT GATE GOAPS portal requires signature between 5KB and 80KB, aspect ratio 3.5:1 (maximum 560 × 160 pixels, minimum 280 × 80 pixels).',
    targetSize: '5 KB to 80 KB',
    minimumSize: '5 KB',
    maximumSize: '80 KB',
    width: '560 px',
    height: '160 px',
    allowedFormats: ['JPG', 'JPEG'],
    instructions: ['Upload scanned signature.', 'Toggle Magic B&W cleanup.', 'Download 560x160 JPEG.'],
    requirements: ['Aspect ratio 3.5:1 (560x160 px), size 5KB to 80KB.'],
    tips: ['Signed with dark blue or black pen.'],
    officialGuidelines: 'IIT GATE GOAPS portal requires signature between 5KB and 80KB, aspect ratio 3.5:1 (maximum 560 × 160 pixels, minimum 280 × 80 pixels), signed with dark blue or black pen.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'Why does GOAPS reject my signature aspect ratio?', answer: 'GATE requires strict 3.5:1 rectangle aspect ratio (e.g. 560×160 pixels). Our tool locks this ratio automatically.' }
    ],
    relatedTools: [
      { name: 'Clean B&W Signature', slug: '/tools/clean-black-white-signature', desc: 'Signature background cleaner.' },
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'Bank signature resizer.' }
    ],
    keywords: [
      'gate signature resizer 560x160',
      'goaps gate signature size 5 to 80kb',
      'iit gate signature dimension 3.5 to 1 ratio',
      'gate exam signature size converter',
      'iit gate photo and signature resizer',
      'goaps signature rejected solution'
    ]
  },

  'photo-name-date-generator': {
    slug: 'photo-name-date-generator',
    portalName: 'Govt Recruitment Photo Stamp',
    defaultTargetKB: 45,
    allowNameDate: true,
    title: 'Photo Name & Date Generator Online Free (DOP Stamp) | FileZenith',
    metaTitle: 'Photo Name & Date Stamp Generator | FileZenith',
    metaDescription: 'Add Candidate Name and Date of Photo (DOP) on passport photo online free. Auto-generates standard bottom white bar with bold uppercase text for SSC, UPSC, NEET, and State PSC forms.',
    h1: 'Photo Name & Date Stamp Generator (DOP Maker)',
    shortDescription: 'Overlay candidate full name and date of photo taking bar on any passport photograph for official forms.',
    longDescription: 'Add candidate full name and date of photo (DOP) stamp over a solid white bar at the bottom 18% of any passport photograph. Fully compliant with guidelines published by SSC, UPSC, NTA NEET, and State PSC recruitment boards.',
    targetSize: '20 KB to 50 KB',
    allowedFormats: ['JPG', 'JPEG', 'PNG'],
    instructions: [
      'Upload any front-facing passport photograph.',
      'Type candidate full name in CAPITAL LETTERS (e.g. AMIT KUMAR SHARMA).',
      'Select or type Date of Photo taking (DOP) within the last 3 months.',
      'Download clean, high-resolution stamped JPEG image ready for form submission.'
    ],
    requirements: [
      'Candidate Name must be in clear uppercase letters.',
      'Date of Photo (DOP) must follow DD/MM/YYYY or DD-MM-YYYY format.',
      'Text must be rendered in solid black font over a pure white rectangular bar.'
    ],
    tips: [
      'Ensure the printed date of photo is within 3 months of application submission.',
      'Do not print Date of Birth (DOB) instead of Date of Photo (DOP).',
      'Double check spelling of candidate name against Class 10th marksheet.'
    ],
    officialGuidelines: 'Generates candidate name and date stamp over a solid white bar at the bottom 18% of passport photograph as required by SSC, UPSC, NTA NEET, and State PSC applications.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'How to add Name and Date to photo without Photoshop?', answer: 'Simply upload your passport photo above, enter your name and date of photo taking, and click Download. Our tool renders the official bottom white bar with crisp typography in less than 1 second.' },
      { question: 'Should I write Date of Birth (DOB) or Date of Photo (DOP)?', answer: 'Always write Date of Photo (DOP) unless the notification specifically requests DOB. Writing DOB instead of DOP is a common candidate mistake that leads to scrutiny.' },
      { question: 'Does the candidate name need to be in capital letters?', answer: 'Yes, government recruitment boards mandate all names to be in uppercase capital letters for optical character clarity.' },
      { question: 'What is the standard font and placement for photo date stamps?', answer: 'The text is centered on a clean white background bar placed at the bottom 18% of the photo, ensuring no facial features or neck details are obscured.' }
    ],
    relatedTools: [
      { name: 'SSC Photo Resizer', slug: '/tools/ssc-photo-resizer', desc: 'SSC photo with stamp.' },
      { name: 'NEET Photo Resizer', slug: '/tools/neet-photo-resizer', desc: 'NEET photo format.' },
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'Clean signature scan.' }
    ],
    keywords: [
      'photo name and date generator online free',
      'add name and date on photo for ssc form',
      'passport size photo with name and date maker',
      'date of photo dop editor online',
      'put name and date on photo online',
      'photo date generator for govt exam',
      'candidate name on photo generator',
      'ssc photo name date format',
      'neet photo name and date generator',
      'sarkari photo name date maker',
      'photo par name aur date kaise dale online',
      'dop stamp maker for passport photo',
      'photo name date editor for sarkari result',
      'add candidate name on photo without photoshop'
    ]
  },

  'photo-signature-joiner': {
    slug: 'photo-signature-joiner',
    portalName: 'Photo & Signature Combiner',
    defaultTargetKB: 50,
    isJoinerMode: true,
    title: 'Photo & Signature Joiner Online Free | FileZenith',
    metaTitle: 'Photo & Signature Joiner (Single File Merger) | FileZenith',
    metaDescription: 'Combine passport photo and signature into a single image file online free. Vertical stack for government online registration portals.',
    h1: 'Photo & Signature Joiner (Single File Merger)',
    shortDescription: 'Merge candidate photo (top) and signature (bottom) into one single JPEG image file under 50KB.',
    longDescription: 'Combines passport photo (top) and signature (bottom) into a single unified image file for single-upload job application forms.',
    targetSize: '20 KB to 50 KB',
    allowedFormats: ['JPG', 'JPEG', 'PNG'],
    instructions: [
      'Upload photo in Dropzone 1.',
      'Upload signature in Dropzone 2.',
      'Download combined JPEG file.'
    ],
    requirements: ['Single file combining photo and signature.'],
    tips: ['Ensure both photo and signature are oriented right side up.'],
    officialGuidelines: 'Combines passport photo (top) and signature (bottom) into a single unified image file for single-upload job application forms.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'How does Photo and Signature Joiner work?', answer: 'Upload your photo in dropzone 1 and signature in dropzone 2. The canvas stacks them vertically into one combined JPEG file under 50KB.' }
    ],
    relatedTools: [
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'Signature size tool.' },
      { name: 'SSC Photo Resizer', slug: '/tools/ssc-photo-resizer', desc: 'SSC photo tool.' }
    ],
    keywords: [
      'photo signature joiner online',
      'combine photo and signature into one image',
      'photo signature merger',
      'join passport photo and signature single file',
      'photo signature joiner under 50kb',
      'combine photo and signature for online application form',
      'photo and signature together in one page',
      'sarkari photo signature joiner online free'
    ]
  },

  'clean-black-white-signature': {
    slug: 'clean-black-white-signature',
    portalName: 'Online Signature Cleanup',
    defaultTargetKB: 18,
    isSignature: true,
    title: 'Clean Black & White Signature Generator | FileZenith',
    metaTitle: 'Magic B&W Signature Background Cleaner | FileZenith',
    metaDescription: 'Remove gray background & shadows from paper signature photos. Convert mobile phone photos of pen signatures into crisp B&W vector-like PNG/JPG.',
    h1: 'Magic B&W Signature Background Cleaner',
    shortDescription: 'Convert phone photo signatures on paper into high-contrast black ink on pure white background.',
    longDescription: 'Applies real-time pixel luminance thresholding (L = 0.299R + 0.587G + 0.114B) to eliminate paper shadows, yellow tone, and background noise.',
    targetSize: '10 KB to 20 KB',
    allowedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    instructions: [
      'Upload phone photo of signature on paper.',
      'Toggle Magic B&W enhancement.',
      'Download clean high-contrast signature.'
    ],
    requirements: ['Black ink on pure white background.'],
    tips: ['Avoid shadows across signature when taking phone photo.'],
    officialGuidelines: 'Applies real-time pixel luminance thresholding (L = 0.299R + 0.587G + 0.114B) to eliminate paper shadows, yellow tone, and background noise.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'How to make phone photo signature clean white background?', answer: 'Upload phone photo of signature, enable Magic B&W cleanup toggle, and download crisp black ink on pure white background.' }
    ],
    relatedTools: [
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: '10-20KB signature resizer.' },
      { name: 'GATE Signature Resizer', slug: '/tools/gate-signature-resizer', desc: 'GATE 560x160 signature.' }
    ],
    keywords: [
      'clean signature photo background online',
      'make signature background white',
      'remove paper shadow from signature',
      'convert mobile signature photo to black and white',
      'transparent signature maker online free',
      'convert phone photo of signature to clear black ink',
      'signature scanner from mobile camera online',
      'clean b and w signature for online application'
    ]
  },

  'compress-image-to-20kb': {
    slug: 'compress-image-to-20kb',
    portalName: 'Online Forms (20KB Limit)',
    defaultTargetKB: 19,
    maxKB: 20,
    title: 'Compress Image to 20KB Online Free | FileZenith',
    metaTitle: 'Compress Image to Under 20KB Online | FileZenith',
    metaDescription: 'Compress image/photo size under 20KB online free without losing clarity. Perfect for government portal signatures and photo uploads.',
    h1: 'Compress Image to Under 20KB Online',
    shortDescription: 'Compress any JPG or PNG image strictly under 20KB for online portal upload limits.',
    longDescription: 'Reduces any JPG/PNG file weight strictly below 20KB limit using intelligent in-browser binary search quality optimization.',
    targetSize: 'Under 20 KB',
    maximumSize: '20 KB',
    allowedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    instructions: ['Upload image file.', 'Canvas compresses to ~18KB.', 'Download output.'],
    requirements: ['Strictly ≤ 20 KB file weight.'],
    tips: ['Keep dimensions reasonable for 20KB target.'],
    officialGuidelines: 'Reduces any JPG/PNG file weight strictly below 20KB limit using intelligent in-browser binary search quality optimization.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'Will compressing to 20KB ruin image quality?', answer: 'Our iterative compression preserves maximum resolution while meeting the strict 20KB ceiling.' }
    ],
    relatedTools: [
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'Signature 10-20KB.' },
      { name: 'Compress Image to 50KB', slug: '/tools/compress-image-to-50kb', desc: 'Compress under 50KB.' }
    ],
    keywords: [
      'compress image to 20kb',
      'reduce image size under 20kb',
      'photo compressor 20kb',
      'signature compressor under 20kb',
      'resize image to 20kb online free for sarkari form',
      'reduce signature size below 20kb in mobile'
    ]
  },

  'compress-image-to-50kb': {
    slug: 'compress-image-to-50kb',
    portalName: 'Application Portals (50KB Limit)',
    defaultTargetKB: 48,
    maxKB: 50,
    title: 'Compress Image to 50KB Online Free | FileZenith',
    metaTitle: 'Compress Image to Under 50KB Online | FileZenith',
    metaDescription: 'Compress photo to under 50KB online free. Optimized for SSC, IBPS, SBI, Railway, and State PSC online application forms.',
    h1: 'Compress Image to Under 50KB Online',
    shortDescription: 'Compress photos and document scans to target weight under 50KB.',
    longDescription: 'Reduces passport photos and document scans to target weight under 50KB with zero server file uploads.',
    targetSize: 'Under 50 KB',
    maximumSize: '50 KB',
    allowedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    instructions: ['Upload photo.', 'Engine compresses to ~45KB.', 'Download file.'],
    requirements: ['Strictly ≤ 50 KB file size.'],
    tips: ['Ideal for SSC, IBPS, and SBI form photo uploads.'],
    officialGuidelines: 'Reduces passport photos and document scans to target weight under 50KB with zero server file uploads.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'How to shrink photo size to 50KB for online form?', answer: 'Upload image, our canvas engine compresses it to ~48KB automatically, and click Download.' }
    ],
    relatedTools: [
      { name: 'SSC Photo Resizer', slug: '/tools/ssc-photo-resizer', desc: 'SSC photo tool.' },
      { name: 'Compress Image to 100KB', slug: '/tools/compress-image-to-100kb', desc: 'Compress under 100KB.' }
    ],
    keywords: [
      'compress image to 50kb',
      'reduce photo size under 50kb',
      'passport photo 50kb compressor',
      'compress photo to 50kb online free without losing quality',
      'image size reducer in kb under 50kb for online application',
      'sarkari result photo compressor 50kb'
    ]
  },

  'compress-image-to-100kb': {
    slug: 'compress-image-to-100kb',
    portalName: 'Identity Document Portals (100KB Limit)',
    defaultTargetKB: 95,
    maxKB: 100,
    title: 'Compress Image to 100KB Online Free | FileZenith',
    metaTitle: 'Compress Image to Under 100KB Online | FileZenith',
    metaDescription: 'Compress image file size under 100KB online free. Ideal for Aadhaar, Marks Card, Certificate, and PDF uploads.',
    h1: 'Compress Image to Under 100KB Online',
    shortDescription: 'Compress document scans, marks sheets, and certificates under 100KB limit.',
    longDescription: 'Reduces document scans and photos under 100KB ceiling while maintaining crisp text readability.',
    targetSize: 'Under 100 KB',
    maximumSize: '100 KB',
    allowedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    instructions: ['Upload document scan or photo.', 'Engine compresses to ~95KB.', 'Download output.'],
    requirements: ['Strictly ≤ 100 KB file weight.'],
    tips: ['Text on certificates remains sharp and readable.'],
    officialGuidelines: 'Reduces document scans and photos under 100KB ceiling while maintaining crisp text readability.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'Can I compress document certificates under 100KB?', answer: 'Yes! Text remains legible while file size drops below 100KB.' }
    ],
    relatedTools: [
      { name: 'Compress Image to 50KB', slug: '/tools/compress-image-to-50kb', desc: 'Compress under 50KB.' },
      { name: 'UPSC Photo Resizer', slug: '/tools/upsc-photo-resizer', desc: 'UPSC photo tool.' }
    ],
    keywords: [
      'compress image to 100kb',
      'reduce document photo under 100kb',
      'certificate image compressor under 100kb',
      'compress marksheet scan under 100kb',
      'reduce jpg file size to 100kb online free',
      'document scan compressor under 100kb'
    ]
  },

  'aadhaar-card-print': {
    slug: 'aadhaar-card-print',
    portalName: 'UIDAI e-Aadhaar & PVC ID Card',
    defaultTargetKB: 200,
    title: 'Aadhaar Card Print Tool Online (A4 Sheet & PVC Card 85.6x54mm) | FileZenith',
    metaTitle: 'Aadhaar Card Print Tool Online (A4 & PVC Ready) | FileZenith',
    metaDescription: 'Crop and print e-Aadhaar PDF or scanned card on A4 paper and PVC card (exact 85.6x54 mm). 100% private in-browser password decryption, zero server uploads, 1-click print-ready A4 PDF for cyber cafes.',
    h1: 'Aadhaar Card Print Tool (e-Aadhaar to A4 & PVC Card)',
    shortDescription: 'Format and print e-Aadhaar PDF or scanned photo on standard A4 paper with cutting guides and PVC card dimensions.',
    longDescription: 'Unlock e-Aadhaar PDF in your browser, auto-crop Front and Back cards, and format onto standard A4 paper or direct PVC card tray with exact ISO/IEC 7810 ID-1 dimensions (85.60 mm × 53.98 mm). 100% private client-side processing with zero server uploads.',
    targetSize: 'A4 / PVC Card',
    width: '85.60 mm',
    height: '54.00 mm',
    allowedFormats: ['PDF', 'JPG', 'JPEG', 'PNG'],
    instructions: [
      'Upload your downloaded official e-Aadhaar PDF or front and back photo scans.',
      'Enter your PDF password if protected (format: First 4 letters of name in CAPITAL + 4-digit Year of Birth, e.g. ANIL1995).',
      'Select your paper layout: Standard A4 Sheet (for lamination), 4×6 inch Photo Paper, or Direct PVC Card Tray.',
      'Choose number of copies (1 copy, 2 copies duplicate, or 5 copies batch sheet for cyber cafes).',
      'Click "Print Now" for instant physical millimeter scaling or "Download Print-Ready PDF".'
    ],
    requirements: [
      'Standard card dimensions: 85.60 mm × 53.98 mm (ISO/IEC 7810 ID-1 standard).',
      'Print scaling must be set to 100% (Actual Size) in print dialog to fit standard 65×95 mm lamination pouches.'
    ],
    tips: [
      'Use 200+ GSM glossy inkjet photo paper for wallet cards before laminating.',
      'Enable the Scissors Cut Boundary toggle for precise guillotine or rotary paper trimmer cutting.',
      'Cyber cafes can select 5 copies on A4 to minimize paper wastage.'
    ],
    officialGuidelines: 'Aadhaar card follows standard ISO/IEC 7810 ID-1 card dimensions (85.60 mm × 53.98 mm) with rounded corners and high-resolution QR codes.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'What is the official password format for e-Aadhaar PDF?', answer: 'The e-Aadhaar PDF password is an 8-character combination: the first 4 letters of your name in CAPITAL LETTERS followed by your 4-digit Year of Birth YYYY. For example, if your name is RAMESH KUMAR born in 1988, your password is RAME1988.' },
      { question: 'What is the exact physical size of an Aadhaar card for printing?', answer: 'The official Aadhaar card dimensions are 85.60 mm in width by 53.98 mm in height (3.37 inches × 2.125 inches), exactly matching the international CR80 credit card standard.' },
      { question: 'How do cyber cafes print 5 copies of Aadhaar cards on a single A4 sheet?', answer: 'Select "Standard A4 Sheet" as the paper layout and choose "5 Copies (Cyber Cafe Batch Sheet)" from the dropdown. The tool automatically lays out 5 identical front and back pairs with cutting lines across the A4 page.' },
      { question: 'Why is printing at 100% scale required instead of "Fit to Page"?', answer: 'Selecting "Fit to Page" shrinks the dimensions by 4-6% depending on printer margins. Printing at "100% (Actual Size)" guarantees exact physical 85.6×54mm dimensions so the card fits standard lamination pouches.' },
      { question: 'Is my Aadhaar number or demographic data saved or uploaded?', answer: 'Never! FileZenith uses 100% client-side JavaScript (pdfjs-dist) inside your browser. Your Aadhaar PDF, password, and biometric details never leave your computer or phone.' }
    ],
    relatedTools: [
      { name: 'SSC Photo Resizer', slug: '/tools/ssc-photo-resizer', desc: 'SSC photo tool.' },
      { name: 'Signature Resizer 10 to 20KB', slug: '/tools/signature-resizer-10-to-20kb', desc: 'Signature tool.' },
      { name: 'Compress PDF to 200KB', slug: '/pdf/compress-to-200kb', desc: 'Compress govt document scans.' }
    ],
    keywords: [
      'aadhaar card print tool',
      'eaadhaar to pvc card print',
      'aadhaar card crop and print a4',
      'aadhaar card print online',
      'aadhaar card exact size 85.6x54 mm',
      'print eaadhaar pdf without password',
      'aadhaar card print action file photoshop alternative',
      'print aadhaar card front and back on single page',
      'aadhaar card lamination size 65x95',
      'eaadhaar pdf password format',
      'aadhaar card a4 size print cyber cafe',
      'print pvc aadhaar card at home',
      'sarkari aadhaar card print tool',
      'crop aadhaar card front and back online',
      'print 5 copies of aadhaar card on a4 paper',
      'eaadhaar to a4 sheet instant print',
      'aadhaar card size in cm for print 8.56 x 5.398',
      'epson canon printer aadhaar print scale 100 percent'
    ]
  }
};
