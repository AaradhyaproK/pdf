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
    title: 'Signature Resizer 10 to 20KB Free & Secure | FileZenith',
    metaTitle: 'Signature Resizer 10 to 20KB Online Free | FileZenith',
    metaDescription: 'Resize signature image to 10KB - 20KB online free. Magic B&W background cleaner, 400x200 px dimensions, 100% private in-browser processing.',
    h1: 'Signature Resizer 10 to 20KB (Online Form Specialist)',
    shortDescription: 'Resize and clean your scanned or phone-snapped signature to 10KB–20KB for government recruitment forms.',
    longDescription: 'Most Indian government job portals (SSC, IBPS, State PSCs) reject uploaded signatures if the file size exceeds 20KB, falls below 10KB, or has dark paper shadows. Our client-side studio crops, cleans background noise, and binary-searches JPEG quality to hit 10–20KB safely.',
    targetSize: '10 KB to 20 KB',
    minimumSize: '10 KB',
    maximumSize: '20 KB',
    width: '400 px',
    height: '200 px',
    allowedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    instructions: [
      'Sign with a black or dark blue ink pen on plain white paper.',
      'Take a clear photograph or scan of your signature.',
      'Upload the file above and toggle Magic B&W to clean background shadows.',
      'Click Download to save your verified 10–20KB JPEG file.'
    ],
    requirements: [
      'File size must strictly remain between 10 KB and 20 KB.',
      'Dimensions: 2:1 rectangle aspect ratio (400×200 pixels or 140×60 pixels).',
      'Signatures in capital letters or with red ink are rejected.'
    ],
    tips: [
      'Use good lighting when photographing signatures on mobile.',
      'Toggle Magic B&W to eliminate paper shadows and yellow tint.',
      'Do not upload cropped images of signatures on ruled notebook paper.'
    ],
    officialGuidelines: 'Official recruitment portal standards require signatures to be signed on white paper with black/blue pen, cropped neatly without border shadows, and weighted strictly between 10KB and 20KB in JPEG format.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'Why does online job portal reject my signature?', answer: 'Portals reject signatures if file size exceeds 20KB, falls below 10KB, or has low contrast with gray paper backgrounds. Our tool uses binary search compression and B&W enhancement to fix this.' },
      { question: 'What is Magic B&W Signature Cleanup?', answer: 'Our Magic B&W mode thresholding converts shadows and paper grain into pure white while forcing pen ink to crisp high-contrast black.' },
      { question: 'Is my signature uploaded to any server?', answer: 'Never! All canvas processing runs 100% locally inside your web browser for complete privacy.' }
    ],
    relatedTools: [
      { name: 'Clean B&W Signature', slug: '/tools/clean-black-white-signature', desc: 'Remove gray paper background noise.' },
      { name: 'SSC Photo Resizer', slug: '/tools/ssc-photo-resizer', desc: 'SSC photo with name & date stamp.' },
      { name: 'Compress Image to 20KB', slug: '/tools/compress-image-to-20kb', desc: 'Generic 20KB file size compressor.' }
    ],
    keywords: ['signature resizer 10 to 20kb', 'resize signature online 20kb', 'signature photo resizer for online forms', 'crop signature to 10kb 20kb']
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
    title: 'SSC Photo Resizer (20 to 50KB with Name & Date) Free | FileZenith',
    metaTitle: 'SSC Photo Resizer (20 to 50KB with Name & Date) | FileZenith',
    metaDescription: 'Resize SSC CGL, CHSL, MTS photo to 20KB - 50KB with candidate name and date stamp. 3.5cm x 4.5cm (413x531 px) format 100% free & secure.',
    h1: 'SSC Photo Resizer (20 to 50KB with Name & Date Stamp)',
    shortDescription: 'Format passport photo for SSC CGL, CHSL, MTS, Stenographer, and CPO applications.',
    longDescription: 'Staff Selection Commission (SSC) applications mandate passport photos sized between 20KB and 50KB with exact dimensions of 3.5 cm × 4.5 cm (413 × 531 pixels). Optionally print candidate name and date of photo (DOP) at the bottom bar.',
    targetSize: '20 KB to 50 KB',
    minimumSize: '20 KB',
    maximumSize: '50 KB',
    width: '413 px (3.5 cm)',
    height: '531 px (4.5 cm)',
    allowedFormats: ['JPG', 'JPEG', 'PNG'],
    instructions: [
      'Upload a front-facing passport photograph with both ears visible.',
      'Check the Candidate Name & Date Stamp option if required by your notification.',
      'Type candidate full name and date of photo taking.',
      'Download your formatted JPEG photo ready for SSC portal submission.'
    ],
    requirements: [
      'Passport photo must be taken against a plain light background.',
      'Spectacles, caps, goggles, or side-profile photos are strictly prohibited.',
      'File weight must be strictly between 20KB and 50KB.'
    ],
    tips: [
      'Ensure the date printed is within 3 months of application submission.',
      'Keep head straight without tilting.',
      'Use a light white or off-white background.'
    ],
    officialGuidelines: 'SSC official guidelines mandate 3.5 cm × 4.5 cm dimensions (413 × 531 pixels), clear light background, neutral expression, both ears visible, and file size strictly between 20KB and 50KB.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'Will SSC reject photo without Name and Date?', answer: 'While recent SSC live-capture rules accept clean photos, adding Candidate Name and Date of Photo (DOP) avoids any portal verification warnings for traditional uploads.' },
      { question: 'What are the exact pixel dimensions for SSC photo?', answer: 'SSC specified dimensions are 3.5 cm × 4.5 cm, which translates to 413 × 531 pixels at 300 DPI.' },
      { question: 'How to compress SSC photo under 50KB?', answer: 'Upload your photo above, enter your name & DOP if desired, and click Download. Our engine guarantees file size under 50KB.' }
    ],
    relatedTools: [
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'Format signature for SSC portal.' },
      { name: 'Photo Name & Date Generator', slug: '/tools/photo-name-date-generator', desc: 'Add candidate name bar to photo.' },
      { name: 'Compress Image to 50KB', slug: '/tools/compress-image-to-50kb', desc: 'Compress image under 50KB limit.' }
    ],
    keywords: ['ssc photo resizer 20 to 50kb', 'ssc photo with name and date', 'ssc cgl photo size converter', 'ssc chsl photo dimension resizer']
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
    title: 'UPSC Photo & Signature Resizer (20 to 300KB) Free | FileZenith',
    metaTitle: 'UPSC Photo & Signature Resizer (OTR Guidelines) | FileZenith',
    metaDescription: 'Resize UPSC IAS, CDS, NDA photo and signature to 20KB - 300KB. 350x350 px square format with name and date stamp 100% free.',
    h1: 'UPSC Photo & Signature Resizer (OTR Guidelines)',
    shortDescription: 'Resize passport photo and signature to 350×350 pixels (20KB–300KB) for UPSC Civil Services & OTR forms.',
    longDescription: 'Union Public Service Commission (UPSC) One Time Registration (OTR) demands square photographs (350×350 pixels min) with candidate name and date of photo printed at bottom, file size between 20KB and 300KB.',
    targetSize: '20 KB to 300 KB',
    minimumSize: '20 KB',
    maximumSize: '300 KB',
    width: '350 px min',
    height: '350 px min',
    allowedFormats: ['JPG', 'JPEG'],
    instructions: [
      'Upload high-resolution square passport photo.',
      'Enter candidate full name and date of photo taking.',
      'Ensure printed date is not older than 10 days from application start.',
      'Download 350x350 px JPEG file verified for UPSC OTR.'
    ],
    requirements: [
      'File size must strictly be between 20 KB and 300 KB.',
      'Aspect ratio must be 1:1 square (min 350×350 pixels, max 1000×1000 pixels).',
      'Photo must state Candidate Name and Date of photo.'
    ],
    tips: [
      'UPSC photo date should be recent (taken within 10 days).',
      'The candidate face should occupy 3/4th of the photograph frame.',
      'Ensure background is plain light colored.'
    ],
    officialGuidelines: 'UPSC Civil Services OTR requires photo and signature images between 20KB and 300KB, minimum resolution 350×350 pixels (square 1:1 ratio), candidate name and date of photo printed at the bottom.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'What is the file size range for UPSC OTR photo?', answer: 'UPSC portal strictly accepts images between 20 KB (minimum) and 300 KB (maximum).' },
      { question: 'What is the date requirement on UPSC photograph?', answer: 'The photo must not be more than 10 days old, and the date on which photo was taken along with candidate name should be printed.' },
      { question: 'Is signature size same as photo for UPSC?', answer: 'Yes, UPSC requires both photograph and signature to be between 20KB and 300KB in square pixel dimensions.' }
    ],
    relatedTools: [
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'Resize signature file.' },
      { name: 'Photo & Signature Joiner', slug: '/tools/photo-signature-joiner', desc: 'Combine photo & signature.' },
      { name: 'Compress Image to 100KB', slug: '/tools/compress-image-to-100kb', desc: 'Target 100KB compressor.' }
    ],
    keywords: ['upsc photo resizer 20 to 300kb', 'upsc otr photo resizer', 'upsc ias photo date stamp', 'upsc signature resizer']
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
    keywords: ['ibps photo resizer 20 to 50kb', 'sbi po photo resizer 200x230', 'bank exam photo size converter']
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
    keywords: ['rrb photo resizer 30 to 50kb', 'railway ntpc photo size resizer', 'rrb group d photo dimension']
  },

  'neet-photo-resizer': {
    slug: 'neet-photo-resizer',
    portalName: 'NTA NEET UG Portal',
    defaultTargetKB: 150,
    minKB: 50,
    maxKB: 200,
    fixedWidth: 400,
    fixedHeight: 600,
    allowNameDate: true,
    title: 'NEET Photo Resizer (Passport & Postcard 10-200KB) | FileZenith',
    metaTitle: 'NTA NEET UG Photo Resizer (Passport & Postcard) | FileZenith',
    metaDescription: 'Resize NEET UG Passport (10-200KB) and Postcard photo (4x6 inch) with Candidate Name and Date of Taking Photograph stamp free online.',
    h1: 'NTA NEET UG Photo Resizer (Passport & Postcard Format)',
    shortDescription: 'Format NEET Passport (10KB–200KB) & Postcard 4"×6" photo with candidate name & DOP stamp.',
    longDescription: 'National Testing Agency (NTA) NEET UG application requires Passport photograph (10KB to 200KB) and Postcard 4"×6" photo (50KB to 300KB) with white background, candidate name, and date of photograph taking printed at bottom.',
    targetSize: '10 KB to 200 KB',
    minimumSize: '10 KB',
    maximumSize: '200 KB',
    width: '400 px',
    height: '600 px',
    allowedFormats: ['JPG', 'JPEG'],
    instructions: [
      'Upload front passport photograph.',
      'Fill candidate name and photo date.',
      'Download generated NEET JPEG photo.'
    ],
    requirements: [
      'Passport photo size: 10KB to 200KB.',
      'Postcard photo size: 50KB to 300KB.',
      'White background with Name and DOP mandatory.'
    ],
    tips: [
      'Ensure 80% face coverage with ears clearly visible.'
    ],
    officialGuidelines: 'NTA NEET UG requires Passport photo (10KB - 200KB) and Postcard 4"×6" photo (50KB - 300KB) with white background, candidate name, and date of taking photograph printed at bottom.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'Is Name and Date mandatory on NEET photograph?', answer: 'Yes! NTA NEET guidelines specify that the photograph must clearly state the candidate name along with the date on which photo was taken.' },
      { question: 'What is the postcard photo size for NEET?', answer: 'Postcard photograph must be 4 inches × 6 inches with file size between 50KB and 300KB.' }
    ],
    relatedTools: [
      { name: 'Photo Name & Date Generator', slug: '/tools/photo-name-date-generator', desc: 'Add candidate name stamp.' },
      { name: 'Signature Resizer (10-20KB)', slug: '/tools/signature-resizer-10-to-20kb', desc: 'NEET signature resizer.' }
    ],
    keywords: ['neet photo resizer 10 to 200kb', 'nta neet postcard photo resizer', 'neet photo with name and date stamp']
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
    keywords: ['bpsc photo resizer 20 to 50kb', 'bihar bpsc teacher photo size', 'bpsc signature resizer']
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
    keywords: ['mpsc photo resizer 20 to 50kb', 'maharashtra mpsc rajyaseva photo dimension']
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
    keywords: ['pan card photo resizer 213x213', 'nsdl pan card photo dimension converter', 'utiitsl pan photo size']
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
    keywords: ['gate signature resizer 560x160', 'goaps gate signature size 5 to 80kb', 'iit gate signature dimension']
  },

  'photo-name-date-generator': {
    slug: 'photo-name-date-generator',
    portalName: 'Govt Recruitment Photo Stamp',
    defaultTargetKB: 45,
    allowNameDate: true,
    title: 'Photo Name & Date Stamp Generator Free | FileZenith',
    metaTitle: 'Photo Name & Date Stamp Generator | FileZenith',
    metaDescription: 'Add Candidate Name and Date of Photo (DOP) stamp to passport photo online free. Mandatory for SSC, UPSC, NEET, and State PSC forms.',
    h1: 'Photo Name & Date Stamp Generator',
    shortDescription: 'Overlay candidate full name and date of photo taking bar on any passport photograph.',
    longDescription: 'Generates candidate name and date stamp over a solid white bar at the bottom 18% of passport photograph as required by SSC, UPSC, NTA NEET, and State PSC applications.',
    targetSize: '20 KB to 50 KB',
    allowedFormats: ['JPG', 'JPEG', 'PNG'],
    instructions: [
      'Upload passport photo.',
      'Type candidate full name.',
      'Select date of photo taking.',
      'Download stamped JPEG image.'
    ],
    requirements: ['Name in capital letters, clear date format.'],
    tips: ['Date of photo should be within 3 months of application.'],
    officialGuidelines: 'Generates candidate name and date stamp over a solid white bar at the bottom 18% of passport photograph as required by SSC, UPSC, NTA NEET, and State PSC applications.',
    lastVerifiedDate: 'Verified September 2026',
    faq: [
      { question: 'How to add Name and Date to photo without Photoshop?', answer: 'Simply upload your photo above, type candidate name and date, and download the stamped JPEG image in 1 second.' }
    ],
    relatedTools: [
      { name: 'SSC Photo Resizer', slug: '/tools/ssc-photo-resizer', desc: 'SSC photo with stamp.' },
      { name: 'NEET Photo Resizer', slug: '/tools/neet-photo-resizer', desc: 'NEET photo format.' }
    ],
    keywords: ['add name and date on photo online', 'dop name photo stamp generator', 'ssc photo name date maker']
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
    keywords: ['photo signature joiner online', 'combine photo and signature into one image', 'photo signature merger']
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
    keywords: ['clean signature photo background online', 'make signature background white', 'remove paper shadow from signature']
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
    keywords: ['compress image to 20kb', 'reduce image size under 20kb', 'photo compressor 20kb']
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
    keywords: ['compress image to 50kb', 'reduce photo size under 50kb', 'passport photo 50kb compressor']
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
    keywords: ['compress image to 100kb', 'reduce document photo under 100kb', 'certificate image compressor']
  }
};
