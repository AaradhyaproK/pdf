export interface ToolSEO {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  category: 'pdf' | 'image' | 'utility' | 'social';
  howToSteps: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
  comparisonTable?: { feature: string; omnitool: string; standardCloud: string }[];
  programmaticTargets?: string[];
}

export const SEO_REGISTRY: Record<string, ToolSEO> = {
  // --- PDF Studio ---
  '/pdf/edit': {
    slug: '/pdf/edit',
    title: 'Interactive PDF Editor Online',
    metaTitle: 'Edit PDF Online Free - Add Text, Whiteout, Draw & Sign | Aurea',
    description: 'Edit PDF documents online directly in your browser. Add text, whiteout/erase content, draw annotations, add images, and rotate pages 100% privately.',
    keywords: ['edit pdf online', 'pdf editor free', 'add text to pdf', 'whiteout pdf', 'draw on pdf', 'client side pdf editor'],
    category: 'pdf',
    howToSteps: [
      { title: 'Upload PDF Document', text: 'Drag and drop or select any PDF file to load into the visual editor.' },
      { title: 'Use Editing Tools', text: 'Add custom text, whiteout unwanted sections, draw annotations, or add images.' },
      { title: 'Apply Changes & Download', text: 'Click Download PDF to export your edited document instantly.' }
    ],
    faqs: [
      { question: 'Is this PDF Editor completely free?', answer: 'Yes! Aurea PDF Editor is 100% free with no page limits, zero subscriptions, and no registration required.' },
      { question: 'Are my PDF documents uploaded to a remote server?', answer: 'No! All text overlays, drawings, and whiteouts are rendered client-side in your browser memory.' },
      { question: 'Can I whiteout or erase text on my PDF?', answer: 'Yes! Use the Whiteout tool to cover up sensitive or unwanted text cleanly.' },
      { question: 'Can I add images, logos, or signatures to pages?', answer: 'Yes! Upload image stamps or draw signatures directly onto PDF pages.' },
      { question: 'Is my data secure?', answer: '100% secure. Everything processes locally inside your browser.' }
    ]
  },
  '/pdf/compress': {
    slug: '/pdf/compress',
    title: 'Compress PDF Online (Zero Server Upload)',
    metaTitle: 'Compress PDF Online Free - Reduce PDF File Size Client-Side | Aurea',
    description: 'Reduce PDF file size online without losing quality. 100% private client-side WebAssembly PDF compression. No file uploads to external servers.',
    keywords: ['compress pdf', 'reduce pdf size', 'pdf compressor online', 'client side pdf compress', 'shrink pdf file'],
    category: 'pdf',
    howToSteps: [
      { title: 'Upload PDF File', text: 'Select or drag & drop your PDF file into the secure compression box.' },
      { title: 'Choose Compression Preset', text: 'Select Extreme Compression, Recommended Balance, or Low Compression.' },
      { title: 'Download Compressed PDF', text: 'Click Compress PDF to process locally and save your optimized PDF instantly.' }
    ],
    faqs: [
      { question: 'Is my PDF uploaded to any server?', answer: 'No. All PDF compression happens directly in your web browser using WebAssembly and Web Workers. Your files never leave your device.' },
      { question: 'How much can I reduce my PDF size?', answer: 'Depending on embedded images and structural metadata, compression can reduce file size by up to 80% with recommended settings.' },
      { question: 'Will image quality be affected?', answer: 'Recommended compression maintains visually crisp text and images while drastically stripping redundant font bytes and uncompressed streams.' },
      { question: 'Is there a file size limit?', answer: 'Since compression uses your device memory directly, you can compress large files up to several hundred megabytes without server timeout limits.' },
      { question: 'Is Aurea PDF Compress completely free?', answer: 'Yes! Aurea is 100% free with unlimited compressions and zero subscription or registration requirements.' }
    ],
    comparisonTable: [
      { feature: 'File Privacy', omnitool: '100% Client-Side (Zero Server)', standardCloud: 'Uploaded to Remote Servers' },
      { feature: 'Processing Speed', omnitool: 'Instant (Browser GPU/CPU)', standardCloud: 'Subject to Network Upload Speeds' },
      { feature: 'File Size Limits', omnitool: 'Unlimited (Browser Memory)', standardCloud: '50MB - 100MB Hard Limit' },
      { feature: 'Security Guarantee', omnitool: 'GDPR / HIPAA Compliant by Design', standardCloud: 'Third-party Server Risk' }
    ]
  },

  '/pdf/compress-to-200kb': {
    slug: '/pdf/compress-to-200kb',
    title: 'Compress PDF to 200KB Online (Client-Side)',
    metaTitle: 'Compress PDF to 200KB Online Free | Aurea',
    description: 'Compress PDF to under 200KB for government forms, job applications, and portal uploads. Fast, client-side, 100% private.',
    keywords: ['compress pdf to 200kb', 'reduce pdf size to 200kb', 'pdf size reducer under 200kb'],
    category: 'pdf',
    howToSteps: [
      { title: 'Select PDF', text: 'Choose the PDF document requiring reduction to 200KB or less.' },
      { title: 'Set Target Threshold', text: 'The engine will auto-tune resolution and stream compression for 200KB target.' },
      { title: 'Download File', text: 'Save your compliant, small PDF file.' }
    ],
    faqs: [
      { question: 'Can I compress scanned documents to 200KB?', answer: 'Yes! Image-heavy scanned PDFs will be re-sampled to hit target size thresholds cleanly.' },
      { question: 'Why do portals require 200KB PDF files?', answer: 'Many official job portals, university applications, and government forms enforce a strict 200KB upload limit.' },
      { question: 'Are files stored on your servers?', answer: 'Never. Everything is computed locally inside your web browser.' },
      { question: 'Does this work on mobile devices?', answer: 'Yes, Aurea works seamlessly on iOS, Android, macOS, Windows, and Linux browsers.' },
      { question: 'Is registration required?', answer: 'No registration or credit card is needed.' }
    ]
  },

  '/pdf/merge': {
    slug: '/pdf/merge',
    title: 'Merge PDF Files Online (100% Private)',
    metaTitle: 'Merge PDF Files Online - Combine Multiple PDFs into One | Aurea',
    description: 'Combine multiple PDF documents into a single organized file directly in your browser. Reorder pages with visual drag-and-drop.',
    keywords: ['merge pdf', 'combine pdf files', 'join pdf online', 'pdf merger client side'],
    category: 'pdf',
    howToSteps: [
      { title: 'Upload Multiple PDFs', text: 'Drag and drop two or more PDF files into the merger dropzone.' },
      { title: 'Arrange File Order', text: 'Reorder your files using drag handles or up/down sorting options.' },
      { title: 'Combine & Download', text: 'Click Merge PDFs to generate and save your single consolidated document.' }
    ],
    faqs: [
      { question: 'How many PDF files can I merge at once?', answer: 'You can merge as many PDF files as your computer memory allows, with no arbitrary file count limits.' },
      { question: 'Can I reorder pages before merging?', answer: 'Yes! Visual page reordering lets you drag, drop, and rearrange files and pages easily.' },
      { question: 'Are merged PDFs encrypted during transit?', answer: 'No data is transmitted over the network; files are processed locally inside your browser memory.' },
      { question: 'Does merging alter my original files?', answer: 'No, your original PDF files remain untouched on your hard drive.' },
      { question: 'Can I merge password-protected PDFs?', answer: 'If you know the password, you can unlock the PDF locally before merging.' }
    ]
  },

  '/pdf/split': {
    slug: '/pdf/split',
    title: 'Split PDF Documents Online',
    metaTitle: 'Split PDF Pages Online Free - Separate PDF Ranges | Aurea',
    description: 'Extract specific pages or page ranges from your PDF into standalone documents. 100% client-side security.',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf pages', 'pdf splitter online'],
    category: 'pdf',
    howToSteps: [
      { title: 'Upload PDF Document', text: 'Select the PDF file you wish to split or extract pages from.' },
      { title: 'Define Page Range', text: 'Enter specific page numbers (e.g. 1, 3, 5-10) or choose to split every page.' },
      { title: 'Extract & Download', text: 'Click Split PDF to save your selected pages instantly.' }
    ],
    faqs: [
      { question: 'How do I specify ranges to split?', answer: 'Use commas and hyphens like "1-3, 5, 8-12" to extract specific custom ranges.' },
      { question: 'Can I extract single pages into separate PDFs?', answer: 'Yes, you can extract individual pages into standalone single-page PDF files.' },
      { question: 'Is my sensitive financial or legal PDF safe?', answer: 'Extremely safe! Because processing is 100% client-side, your document data never hits remote servers.' },
      { question: 'Do extracted pages keep bookmarks and links?', answer: 'Yes, original page layout, fonts, vector text, and hyperlinks are preserved.' },
      { question: 'Is there a daily limit?', answer: 'No daily limits or restrictions.' }
    ]
  },

  '/pdf/organize': {
    slug: '/pdf/organize',
    title: 'Visual PDF Organizer (Rotate, Delete & Reorder)',
    metaTitle: 'Organize PDF Pages - Rotate, Delete & Rearrange Pages | Aurea',
    description: 'Visual grid tool to rotate individual PDF pages, delete unwanted pages, and reorder document structure in real-time.',
    keywords: ['organize pdf', 'rotate pdf pages', 'delete pdf pages', 'reorder pdf'],
    category: 'pdf',
    howToSteps: [
      { title: 'Upload PDF', text: 'Load your PDF file into the visual layout grid.' },
      { title: 'Manipulate Pages', text: 'Hover over thumbnails to rotate 90°, delete, or drag to reorder.' },
      { title: 'Save Organized PDF', text: 'Click Save PDF to build your new document structure.' }
    ],
    faqs: [
      { question: 'Can I rotate sideways pages?', answer: 'Yes! Rotate any page individually 90°, 180°, or 270° clockwise.' },
      { question: 'How do I delete unwanted blank pages?', answer: 'Hover over the page card in the visual grid and click the Delete bin icon.' },
      { question: 'Can I reorder pages by dragging?', answer: 'Yes, click and drag page cards to set your exact desired sequence.' },
      { question: 'Does this run client-side?', answer: 'Yes, all visual thumbnail rendering and canvas operations occur locally.' },
      { question: 'What file format is exported?', answer: 'A standard clean PDF file containing only your chosen pages in selected orientations.' }
    ]
  },

  '/pdf/ocr': {
    slug: '/pdf/ocr',
    title: 'Client-Side PDF OCR (Text Extraction)',
    metaTitle: 'PDF OCR Online Free - Extract Text from Scanned PDFs | Aurea',
    description: 'Perform optical character recognition (OCR) on scanned PDF files using Web Worker Tesseract AI. Extract editable text directly.',
    keywords: ['pdf ocr', 'extract text from pdf', 'scanned pdf to text', 'ocr pdf online'],
    category: 'pdf',
    howToSteps: [
      { title: 'Upload Scanned PDF', text: 'Select a scanned image-based PDF or document photo.' },
      { title: 'Select OCR Language', text: 'Choose recognition language (English, Spanish, French, German, etc.).' },
      { title: 'Run OCR & Copy Text', text: 'Process locally with Tesseract Wasm and copy or download your extracted plain text.' }
    ],
    faqs: [
      { question: 'How does browser OCR work without a server?', answer: 'We run Tesseract.js compiled into WebAssembly inside background Web Workers directly in your browser memory.' },
      { question: 'Is my confidential scanned document private?', answer: '100% private. Document pixels are analyzed by Wasm code inside your browser engine without network transit.' },
      { question: 'What languages are supported?', answer: 'English, Spanish, French, German, Portuguese, Italian, and common Latin scripts.' },
      { question: 'Can I copy extracted text directly to clipboard?', answer: 'Yes! Click "Copy to Clipboard" or download as a .txt file.' },
      { question: 'What resolution works best for OCR?', answer: 'Documents scanned at 200-300 DPI yield near 99% character accuracy.' }
    ]
  },

  '/pdf/watermark': {
    slug: '/pdf/watermark',
    title: 'Watermark PDF Online (Text & Image Overlay)',
    metaTitle: 'Watermark PDF Online Free - Add Text & Logo Overlay | Aurea',
    description: 'Add custom text or image watermarks to your PDF documents. Customize opacity, position, font size, color, and rotation angle.',
    keywords: ['watermark pdf', 'add text to pdf', 'logo watermark pdf', 'protect pdf watermark'],
    category: 'pdf',
    howToSteps: [
      { title: 'Upload PDF File', text: 'Select the PDF file you wish to protect with a watermark.' },
      { title: 'Configure Watermark Options', text: 'Enter custom text or upload a PNG logo, set opacity, position, and rotation.' },
      { title: 'Apply & Download', text: 'Stamp pages locally and download your watermarked PDF.' }
    ],
    faqs: [
      { question: 'Can I add confidential or draft stamps?', answer: 'Yes! Type custom text like "CONFIDENTIAL", "DRAFT", or your company name.' },
      { question: 'Can I use transparent PNG logos?', answer: 'Yes, PNG logos with alpha transparency overlay cleanly onto PDF pages.' },
      { question: 'Can I adjust watermark transparency?', answer: 'Yes, set opacity slider from 10% (subtle background) to 100% (solid overlay).' },
      { question: 'Does watermarking apply to all pages?', answer: 'By default watermarks are stamped on every page in your document.' },
      { question: 'Are files sent to remote servers?', answer: 'Never! Everything is drawn locally via client-side pdf-lib canvas hooks.' }
    ]
  },

  '/pdf/protect': {
    slug: '/pdf/protect',
    title: 'Password Protect PDF Online',
    metaTitle: 'Protect PDF with Password Online Free | Aurea',
    description: 'Encrypt your PDF documents with passwords and custom user/owner permission restrictions locally using client-side encryption.',
    keywords: ['protect pdf', 'encrypt pdf', 'password protect pdf online', 'secure pdf file'],
    category: 'pdf',
    howToSteps: [
      { title: 'Upload PDF Document', text: 'Select the PDF file you want to password protect.' },
      { title: 'Set Secure Passwords', text: 'Enter an open password and confirm restriction permissions.' },
      { title: 'Encrypt & Download', text: 'Apply standard 128-bit AES/RC4 client encryption and save.' }
    ],
    faqs: [
      { question: 'Is my encryption password stored anywhere?', answer: 'No! The password is used solely in browser memory to compute key digests for encryption.' },
      { question: 'Will my password-protected file open in Adobe Reader?', answer: 'Yes, encrypted PDFs follow standard ISO 32000 PDF security specs.' },
      { question: 'Can anyone intercept my password over Wi-Fi?', answer: 'No, because no data is sent over the internet or to server APIs.' },
      { question: 'Can I set owner permissions like disabling printing?', answer: 'Yes, set permission flags for printing, copying text, or editing.' },
      { question: 'Is this free?', answer: '100% free with no file limits.' }
    ]
  },

  '/pdf/to-image': {
    slug: '/pdf/to-image',
    title: 'Convert PDF to High-Res JPG/PNG Images',
    metaTitle: 'PDF to Image Converter Free - Save PDF Pages as JPG/PNG | Aurea',
    description: 'Convert PDF document pages into high-resolution JPG or PNG images. Batch export all pages or download individual images.',
    keywords: ['pdf to image', 'pdf to jpg', 'pdf to png', 'convert pdf to photo'],
    category: 'pdf',
    howToSteps: [
      { title: 'Upload PDF', text: 'Select the PDF file you want to render as images.' },
      { title: 'Choose Image Format & DPI', text: 'Select PNG (high quality) or JPG (smaller file size) and DPI scale.' },
      { title: 'Download Images', text: 'Download single page images or a ZIP archive containing all pages.' }
    ],
    faqs: [
      { question: 'What image formats can I export to?', answer: 'Choose between high-clarity PNG images or lightweight JPG formats.' },
      { question: 'How is page quality preserved?', answer: 'We render pages using PDF.js vector canvas at 2x-3x high DPI scale.' },
      { question: 'Can I download all pages as a ZIP file?', answer: 'Yes! Batch export packs all page images into a single zip download.' },
      { question: 'Are document pages uploaded to a server?', answer: 'No! Rendering is done via HTML5 Canvas in your client browser.' },
      { question: 'Does it work for multi-page documents?', answer: 'Yes, render multi-page documents effortlessly.' }
    ]
  },

  // --- Image Studio ---
  '/image/compress': {
    slug: '/image/compress',
    title: 'Smart Image Compressor (Target KB & % Reduction)',
    metaTitle: 'Compress Image Online Free - Reduce JPG/PNG Size in KB | Aurea',
    description: 'Compress JPG, PNG, and WebP images by setting custom target file sizes (e.g. <20KB, <50KB, <100KB) or percentage sliders.',
    keywords: ['compress image', 'reduce image size kb', 'image compressor to 50kb', 'shrink photo size'],
    category: 'image',
    howToSteps: [
      { title: 'Upload Images', text: 'Drag and drop your photos into the compressor dropzone.' },
      { title: 'Set Quality or Target KB', text: 'Use quality percentage slider or select precise target file size limits.' },
      { title: 'Download Compressed Photo', text: 'Save your compressed images individually or batch download ZIP.' }
    ],
    faqs: [
      { question: 'How does Target KB compression work?', answer: 'Our engine runs binary search quality optimization on HTML5 canvas to hit your exact target size limit.' },
      { question: 'What formats are supported?', answer: 'JPG, JPEG, PNG, WebP, and GIF.' },
      { question: 'Can I compress images to under 50KB or 20KB?', answer: 'Yes, perfect for passport portals, visa applications, and student forms.' },
      { question: 'Are images sent to remote servers?', answer: 'No, all compression executes inside client memory.' },
      { question: 'Is batch compression supported?', answer: 'Yes! Upload multiple images at once and compress in bulk.' }
    ]
  },

  '/image/compress-to-50kb': {
    slug: '/image/compress-to-50kb',
    title: 'Compress Image to 50KB Online Free',
    metaTitle: 'Compress Image to 50KB Online Free - Reduce Photo Size | Aurea',
    description: 'Compress JPG, PNG, and photos under 50KB for online application portals. Client-side, fast, zero server upload.',
    keywords: ['compress image to 50kb', 'reduce photo size to 50kb', 'jpg compressor 50kb'],
    category: 'image',
    howToSteps: [
      { title: 'Select Photo', text: 'Choose the photo needing compression to under 50KB.' },
      { title: 'Auto-Target 50KB', text: 'The engine automatically optimizes dimensions and compression level.' },
      { title: 'Download Image', text: 'Save your 50KB compliant image.' }
    ],
    faqs: [
      { question: 'Will my image look blurry at 50KB?', answer: 'Our intelligent canvas scaling maintains sharpness while meeting 50KB limits.' },
      { question: 'Why use Aurea for 50KB compression?', answer: 'Because it is 100% private, instant, and works offline inside your browser.' },
      { question: 'Can I compress PNG images to 50KB?', answer: 'Yes, PNG files will be optimized or dynamically converted to JPG to hit 50KB.' },
      { question: 'Are files saved on your servers?', answer: 'Never. Processing happens locally in your web browser.' },
      { question: 'Is this free?', answer: 'Yes, 100% free with no limits.' }
    ]
  },

  '/image/compress-to-100kb': {
    slug: '/image/compress-to-100kb',
    title: 'Compress Image to 100KB Online Free',
    metaTitle: 'Compress Image to 100KB Online Free | Aurea',
    description: 'Quickly resize and compress images under 100KB for job applications, identity cards, and website optimization.',
    keywords: ['compress image to 100kb', 'photo size reducer 100kb', 'image compress under 100kb'],
    category: 'image',
    howToSteps: [
      { title: 'Upload Image', text: 'Select your JPEG or PNG file.' },
      { title: 'Optimize to 100KB', text: 'Engine automatically calculates optimal quality and dimensions.' },
      { title: 'Download', text: 'Save your optimized photo.' }
    ],
    faqs: [
      { question: 'How long does compression take?', answer: 'Less than half a second! Browser Canvas processing is blazingly fast.' },
      { question: 'Is my photo private?', answer: 'Yes! 100% local browser calculation.' },
      { question: 'Can I upload multiple photos?', answer: 'Yes, batch compression is fully supported.' },
      { question: 'What is the target limit?', answer: 'Ensures file size stays below 100 Kilobytes.' },
      { question: 'Do I need an account?', answer: 'No account or sign up required.' }
    ]
  },

  '/image/resize': {
    slug: '/image/resize',
    title: 'Batch Image Resizer (Pixels, % & Aspect Lock)',
    metaTitle: 'Resize Image Online Free - Change Dimensions & Aspect Ratio | Aurea',
    description: 'Resize JPG, PNG, and WebP images by exact pixel dimensions (width/height) or percentage scaling. Lock aspect ratio.',
    keywords: ['resize image', 'image resizer online', 'change image dimensions', 'crop photo pixels'],
    category: 'image',
    howToSteps: [
      { title: 'Upload Photo', text: 'Drop your image into the resize workspace.' },
      { title: 'Enter Dimensions', text: 'Specify target width and height in pixels or percentage, locking aspect ratio if desired.' },
      { title: 'Resize & Export', text: 'Download resized photo in crisp resolution.' }
    ],
    faqs: [
      { question: 'Can I maintain aspect ratio while resizing?', answer: 'Yes! Toggle the aspect ratio lock chain icon to automatically scale proportional height.' },
      { question: 'Can I resize images by percentage?', answer: 'Yes, scale down by 50%, 25%, or upscale as needed.' },
      { question: 'Does resizing reduce file size?', answer: 'Yes, scaling down pixel count significantly shrinks image byte size.' },
      { question: 'Are images processed on external servers?', answer: 'No, all pixel resampling is executed on HTML5 Canvas in browser.' },
      { question: 'What image types can I resize?', answer: 'JPG, PNG, WebP, GIF, and SVG.' }
    ]
  },

  '/image/passport-maker': {
    slug: '/image/passport-maker',
    title: 'Passport & Visa Photo Maker (US, Schengen, UK, India)',
    metaTitle: 'Passport Photo Maker Online Free - US, Schengen, UK, India Presets | Aurea',
    description: 'Crop photos to official passport and visa dimension standards (US 2x2 in, Schengen 35x45 mm, UK, India). Print grid layout.',
    keywords: ['passport photo maker', 'visa photo cropper', 'us passport photo 2x2', 'schengen visa photo maker'],
    category: 'image',
    howToSteps: [
      { title: 'Upload Portrait Photo', text: 'Select a clear front-facing portrait photo.' },
      { title: 'Select Passport Preset', text: 'Choose US 2x2 inch, Schengen 35x45 mm, UK, or India specifications.' },
      { title: 'Align & Crop', text: 'Position head/face inside guided outline and download single photo or 4x6 print sheet.' }
    ],
    faqs: [
      { question: 'What preset dimensions are available?', answer: 'US Passport (2x2 in / 600x600 px), Schengen Visa (35x45 mm), UK Passport (35x45 mm), India Passport (2x2 in / 51x51 mm).' },
      { question: 'Can I generate a 4x6 print sheet with multiple passport photos?', answer: 'Yes! Export a standard 4x6 inch printable layout containing 6 individual passport photos.' },
      { question: 'How do I ensure biometric compliance?', answer: 'Use visual head guide overlays to align eyes, chin, and top of head properly.' },
      { question: 'Is my personal photo stored anywhere?', answer: 'No! Everything is rendered locally inside your browser canvas.' },
      { question: 'Is this passport photo generator free?', answer: '100% free with unlimited photo exports.' }
    ]
  },

  '/image/remove-background': {
    slug: '/image/remove-background',
    title: 'AI Background Remover (100% Client-Side Wasm)',
    metaTitle: 'Remove Background from Image Online Free - 100% Client-Side AI | Aurea',
    description: 'Automatically isolate subjects and remove background from photos using local WebAssembly AI. High precision cutout PNG.',
    keywords: ['remove background', 'bg remover online', 'transparent background maker', 'client side ai bg remover'],
    category: 'image',
    howToSteps: [
      { title: 'Upload Photo', text: 'Upload any product shot, portrait, or object photo.' },
      { title: 'AI Subject Detection', text: 'Local browser Wasm model isolates subject without sending image to any cloud API.' },
      { title: 'Download HD Cutout PNG', text: 'Save transparent PNG or add custom background color.' }
    ],
    faqs: [
      { question: 'Is my private photo uploaded to an AI server?', answer: 'No! Unlike third-party cloud tools, our neural network models run directly in your browser via WebAssembly.' },
      { question: 'What image format is produced?', answer: 'Exports a clean transparent PNG or customized backdrop JPEG.' },
      { question: 'Does background removal work on mobile?', answer: 'Yes, modern mobile web browsers with WebGL/Wasm support run background removal cleanly.' },
      { question: 'Is there any monthly subscription?', answer: 'Zero subscriptions! Unlimited 100% free background removals.' },
      { question: 'What objects work best?', answer: 'Portraits, products, animals, logos, and distinct objects against contrasting backgrounds.' }
    ]
  },

  '/image/convert-heic': {
    slug: '/image/convert-heic',
    title: 'Apple HEIC to JPG/PNG Converter (Batch)',
    metaTitle: 'HEIC to JPG Converter Online Free - Batch Convert iPhone Photos | Aurea',
    description: 'Convert Apple iPhone HEIC/HEIF photos to universal JPG or PNG formats in batch. 100% client-side decoding.',
    keywords: ['heic to jpg', 'convert heic to png', 'iphone photo converter', 'heic converter online'],
    category: 'image',
    howToSteps: [
      { title: 'Select Apple HEIC Photos', text: 'Drag & drop .heic or .heif photos from your iPhone or Mac.' },
      { title: 'Choose Target Format', text: 'Select output format: JPG (standard) or PNG (lossless).' },
      { title: 'Convert & Download', text: 'Batch decode locally and download all converted photos.' }
    ],
    faqs: [
      { question: 'Why can non-Apple devices not open HEIC files?', answer: 'HEIC is Apple proprietary compressed image container; converting to JPG makes photos universally viewable everywhere.' },
      { question: 'Can I batch convert multiple HEIC files at once?', answer: 'Yes! Convert dozens of HEIC photos simultaneously.' },
      { question: 'Are my personal iPhone photos sent to a server?', answer: 'No! Decoding is powered client-side using JavaScript Wasm decoder.' },
      { question: 'Does conversion preserve EXIF photo metadata?', answer: 'Image dimensions and color profiles are preserved standardly.' },
      { question: 'Is HEIC conversion free?', answer: '100% free with zero file limits.' }
    ]
  },

  '/image/to-pdf': {
    slug: '/image/to-pdf',
    title: 'Image to PDF Converter (JPG, PNG to PDF)',
    metaTitle: 'Image to PDF Converter Online Free - Combine Photos to PDF | Aurea',
    description: 'Convert JPG, PNG, WebP, and BMP images into a single structured PDF document. Customize page orientation, margins, and page sizes.',
    keywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'photos to pdf converter'],
    category: 'image',
    howToSteps: [
      { title: 'Upload Images', text: 'Select or drop multiple image files into the converter.' },
      { title: 'Configure Page Layout', text: 'Set page size (A4, Letter), orientation (Portrait/Landscape), and margins.' },
      { title: 'Create PDF', text: 'Click Generate PDF to combine photos into a document download.' }
    ],
    faqs: [
      { question: 'Can I reorder images before building PDF?', answer: 'Yes! Drag and drop photo cards to rearrange your desired page sequence.' },
      { question: 'What page sizes are supported?', answer: 'Standard A4, US Letter, fit-to-image size, portrait, and landscape.' },
      { question: 'Are my images kept private?', answer: '100% private. Processing happens completely inside your web browser.' },
      { question: 'Can I adjust margin spacing around photos?', answer: 'Yes, select No Margin, Small Margin, or Big Margin options.' },
      { question: 'Is there a limit on how many images I can combine?', answer: 'No limit! Combine as many photos as needed.' }
    ]
  },

  '/image/png-to-jpg': {
    slug: '/image/png-to-jpg',
    title: 'PNG to JPG Converter Online (Bulk & High Quality)',
    metaTitle: 'Convert PNG to JPG Online Free - Fast Bulk Image Converter | Aurea',
    description: 'Convert PNG images to JPG format online in seconds. Supports bulk conversion, custom image quality compression, and background color selection. 100% client-side.',
    keywords: ['png to jpg', 'convert png to jpg', 'png to jpg converter free', 'bulk png to jpg', 'change png to jpeg'],
    category: 'image',
    howToSteps: [
      { title: 'Upload PNG Images', text: 'Select or drag and drop PNG files into the converter zone.' },
      { title: 'Adjust Quality & Background Color', text: 'Choose JPG quality percentage and set solid background color for transparent pixels.' },
      { title: 'Download JPG Files', text: 'Click Convert to save high-quality JPG images directly to your device.' }
    ],
    faqs: [
      { question: 'Why convert PNG to JPG?', answer: 'JPG files are much smaller in file size than PNGs, making them ideal for web pages, email attachments, and online forms.' },
      { question: 'What happens to transparent PNG backgrounds?', answer: 'Since JPG does not support transparency, you can pick any solid background color (default is pure white).' },
      { question: 'Can I batch convert multiple PNG files at once?', answer: 'Yes! Upload dozens of PNG images and convert them all simultaneously.' },
      { question: 'Are my photos uploaded to a remote server?', answer: 'No! All conversions process 100% locally in your web browser memory.' }
    ]
  },

  '/image/png-to-pdf': {
    slug: '/image/png-to-pdf',
    title: 'PNG to PDF Converter Online (Combine PNGs to PDF)',
    metaTitle: 'PNG to PDF Converter Online Free - Convert PNG Images to PDF | Aurea',
    description: 'Convert PNG images to PDF document online. Combine multiple PNG pictures into one organized PDF file with custom page orientation and margins.',
    keywords: ['png to pdf', 'convert png to pdf', 'png to pdf converter free', 'combine pngs to pdf', 'save png as pdf'],
    category: 'image',
    howToSteps: [
      { title: 'Upload PNG Files', text: 'Drag and drop one or more PNG image files into the upload box.' },
      { title: 'Arrange & Format Layout', text: 'Reorder pages, set page orientation (Portrait/Landscape), and adjust margins.' },
      { title: 'Generate & Download PDF', text: 'Click Convert to PDF to instantly create and download your consolidated PDF file.' }
    ],
    faqs: [
      { question: 'Can I convert multiple PNGs into a single PDF?', answer: 'Yes! You can combine multiple PNG images into one single PDF document.' },
      { question: 'Does PNG to PDF conversion preserve high resolution?', answer: 'Yes, original PNG image resolution and clarity are fully preserved in the PDF output.' },
      { question: 'Is there a limit on how many PNG files I can convert?', answer: 'No limits! Convert as many PNG images as you need for free.' }
    ]
  },

  '/image/pics-to-pdf': {
    slug: '/image/pics-to-pdf',
    title: 'Pics to PDF Converter (Convert Photos & Pictures to PDF)',
    metaTitle: 'Pics to PDF Converter Online Free - Turn Pictures & Scans to PDF | Aurea',
    description: 'Turn pictures, receipts, camera photos, and scans into a clean PDF document. Drag and drop reordering, custom page sizes (A4, Letter), and zero server uploads.',
    keywords: ['pics to pdf', 'picture to pdf', 'convert photos to pdf', 'turn pictures into pdf', 'photo to pdf converter free'],
    category: 'image',
    howToSteps: [
      { title: 'Select Pictures & Scans', text: 'Upload photos from your phone, camera, or computer.' },
      { title: 'Reorder & Configure Layout', text: 'Drag pictures into your preferred order and select page size (A4, Letter, Auto-fit).' },
      { title: 'Download PDF Document', text: 'Click Convert Pics to PDF to generate and download your clean document.' }
    ],
    faqs: [
      { question: 'Can I convert pictures taken from my phone camera?', answer: 'Yes! Select photos from your iPhone, Android camera roll, or gallery.' },
      { question: 'Can I reorder pictures before generating the PDF?', answer: 'Yes! Drag and drop picture cards to arrange the exact page sequence you want.' },
      { question: 'Is my photo data secure?', answer: '100% secure. Everything is processed locally inside your web browser.' }
    ]
  },

  '/image/jpg-to-png': {
    slug: '/image/jpg-to-png',
    title: 'JPG to PNG Converter Online (Lossless Image Conversion)',
    metaTitle: 'Convert JPG to PNG Online Free - Lossless Quality Image Converter | Aurea',
    description: 'Convert JPG/JPEG images to high-resolution PNG format online. 100% free, bulk image conversion, zero compression artifacts, client-side processing.',
    keywords: ['jpg to png', 'convert jpg to png', 'jpeg to png converter', 'jpg to png high quality'],
    category: 'image',
    howToSteps: [
      { title: 'Upload JPG Images', text: 'Drop or select JPG/JPEG photos into the converter area.' },
      { title: 'Convert Lossless', text: 'The engine converts JPG pixel data to lossless PNG format.' },
      { title: 'Download PNG Files', text: 'Save your PNG images instantly to your device.' }
    ],
    faqs: [
      { question: 'Why convert JPG to PNG?', answer: 'PNG uses lossless compression, making it ideal for editing, overlays, graphics, and transparent image layering.' },
      { question: 'Is conversion free?', answer: 'Yes, 100% free with no file limits or registration.' }
    ]
  },

  // --- Social Media Downloader Studio ---
  '/social/youtube-downloader': {
    slug: '/social/youtube-downloader',
    title: 'YouTube Video & Shorts Downloader (1080p, MP4 & MP3)',
    metaTitle: 'YouTube Video Downloader Free - Download YouTube Videos & Shorts HD | Aurea',
    description: 'Download YouTube videos, Shorts, and audio MP3 in 1080p Full HD, 720p HD, and 320kbps MP3. Fast, free, zero software installation.',
    keywords: ['youtube video downloader', 'download youtube shorts', 'youtube to mp4 hd', 'youtube to mp3 converter free'],
    category: 'social',
    howToSteps: [
      { title: 'Paste YouTube URL', text: 'Copy YouTube video or Shorts link and paste it into the downloader box.' },
      { title: 'Choose Resolution / Format', text: 'Select 1080p Full HD MP4, 720p HD, 320kbps MP3 audio, or thumbnail image.' },
      { title: 'Instant Download', text: 'Click Download to save the media file directly to your device.' }
    ],
    faqs: [
      { question: 'Can I download YouTube Shorts videos?', answer: 'Yes! Fully supports downloading YouTube Shorts in 1080p Full HD video quality.' },
      { question: 'Can I convert YouTube videos to MP3 audio?', answer: 'Yes! One-click audio extraction converts YouTube videos to 320kbps MP3 files.' },
      { question: 'Does this work on mobile devices?', answer: 'Yes! Works seamlessly on iPhone, Android, iPad, Mac, Windows, and Linux.' },
      { question: 'Is there any software installation required?', answer: 'No! Everything works directly in your web browser.' },
      { question: 'Are downloads unlimited?', answer: 'Yes! Unlimited free downloads with no registration required.' }
    ]
  },

  '/social/youtube-shorts-downloader': {
    slug: '/social/youtube-shorts-downloader',
    title: 'YouTube Shorts Downloader Online Free (1080p MP4)',
    metaTitle: 'YouTube Shorts Downloader Online Free - Save YouTube Shorts HD | Aurea',
    description: 'Download YouTube Shorts videos in 1080p Full HD MP4 quality. Fast, free, private client-side processing.',
    keywords: ['youtube shorts downloader', 'download youtube shorts video', 'save yt shorts online'],
    category: 'social',
    howToSteps: [
      { title: 'Copy Shorts URL', text: 'Copy YouTube Shorts link from your app or browser.' },
      { title: 'Paste Link', text: 'Paste URL into the input field above.' },
      { title: 'Download Video', text: 'Save high-definition MP4 Shorts video.' }
    ],
    faqs: [
      { question: 'Are YouTube Shorts downloaded in HD?', answer: 'Yes! Shorts videos are saved in 1080p HD vertical MP4 format.' },
      { question: 'Does it download audio with video?', answer: 'Yes! Both high quality audio and video streams are combined.' },
      { question: 'Is registration required?', answer: 'No account or credit card needed.' },
      { question: 'Does it work on iOS and Android?', answer: 'Yes, supported across mobile browsers.' },
      { question: 'Is this downloader free?', answer: '100% free with zero limits.' }
    ]
  },

  '/social/instagram-downloader': {
    slug: '/social/instagram-downloader',
    title: 'Instagram Reels, Photos & Video Downloader',
    metaTitle: 'Instagram Downloader Free - Download Reels, Posts & Photos HD | Aurea',
    description: 'Download Instagram Reels, video posts, photos, and IGTV media in high definition. 100% free, fast, zero account login.',
    keywords: ['instagram video downloader', 'download instagram reels', 'instagram photo downloader', 'save insta post hd'],
    category: 'social',
    howToSteps: [
      { title: 'Copy Instagram Post Link', text: 'Copy post or Reel link from Instagram app or web.' },
      { title: 'Paste URL', text: 'Paste link into the Instagram downloader search box.' },
      { title: 'Download Media', text: 'Choose HD Video MP4 or Full Quality Photo JPG download.' }
    ],
    faqs: [
      { question: 'Can I download Instagram Reels videos?', answer: 'Yes! Easily download Instagram Reels in full HD quality.' },
      { question: 'Do I need to log in to my Instagram account?', answer: 'No! Zero login or password required.' },
      { question: 'Can I save carousel photo posts?', answer: 'Yes! Supports saving photos and multi-slide posts.' },
      { question: 'Where are downloaded files saved?', answer: 'Files save directly to your browser default Downloads folder.' },
      { question: 'Is it free?', answer: '100% free with no limits.' }
    ]
  },

  '/social/instagram-reels-downloader': {
    slug: '/social/instagram-reels-downloader',
    title: 'Instagram Reels Downloader Online Free (HD MP4)',
    metaTitle: 'Instagram Reels Downloader Online Free - Save Insta Reels Video | Aurea',
    description: 'Download Instagram Reels videos in 1080p HD MP4 format. Instant, private, 100% free.',
    keywords: ['instagram reels downloader', 'download insta reels video', 'save instagram reels hd'],
    category: 'social',
    howToSteps: [
      { title: 'Copy Reel Link', text: 'Copy Instagram Reel link.' },
      { title: 'Paste URL', text: 'Paste into the download input.' },
      { title: 'Save Reel', text: 'Download HD MP4 video file.' }
    ],
    faqs: [
      { question: 'Is audio included in Reels download?', answer: 'Yes! Video and original audio track are included.' },
      { question: 'Can I download private Reels?', answer: 'Only publicly shared Reels can be fetched.' },
      { question: 'Is there a limit on downloads?', answer: 'No daily limits.' },
      { question: 'Is this free?', answer: 'Yes, 100% free.' },
      { question: 'Does it work on phone browsers?', answer: 'Yes, fully responsive on mobile.' }
    ]
  },

  '/social/twitter-downloader': {
    slug: '/social/twitter-downloader',
    title: 'X / Twitter Video & Media Downloader',
    metaTitle: 'Twitter Video Downloader Free - Download X Videos & GIFs HD | Aurea',
    description: 'Download X (Twitter) videos, GIFs, and post media in 1080p HD MP4 format. Fast, free, client-side downloader.',
    keywords: ['twitter video downloader', 'download x video', 'save twitter gif', 'x post media downloader'],
    category: 'social',
    howToSteps: [
      { title: 'Copy X / Twitter Post Link', text: 'Copy tweet or post link containing video or GIF.' },
      { title: 'Paste Link', text: 'Insert post URL into the Twitter downloader.' },
      { title: 'Download Video', text: 'Select 1080p, 720p, or 480p MP4 resolution to download.' }
    ],
    faqs: [
      { question: 'Can I download Twitter video GIFs?', answer: 'Yes! Converts Twitter loop GIFs into standard MP4 video downloads.' },
      { question: 'What resolutions are available?', answer: '1080p Full HD, 720p HD, and 480p SD resolutions.' },
      { question: 'Do I need a Twitter / X account?', answer: 'No account or API token required.' },
      { question: 'Is my data tracked?', answer: 'No! 100% private client-side URL parsing.' },
      { question: 'Is it free?', answer: '100% free with unlimited video downloads.' }
    ]
  },

  '/social/linkedin-downloader': {
    slug: '/social/linkedin-downloader',
    title: 'LinkedIn Video & Document Post Downloader',
    metaTitle: 'LinkedIn Video Downloader Free - Download LinkedIn Posts & Slides | Aurea',
    description: 'Download LinkedIn professional videos, document PDF slides, and media posts in high resolution.',
    keywords: ['linkedin video downloader', 'download linkedin video', 'save linkedin post video', 'linkedin pdf slides downloader'],
    category: 'social',
    howToSteps: [
      { title: 'Copy LinkedIn Post URL', text: 'Copy post link from your LinkedIn feed or browser.' },
      { title: 'Paste URL', text: 'Paste URL into the LinkedIn downloader field.' },
      { title: 'Download Video or PDF', text: 'Save HD video MP4 or PDF slide images.' }
    ],
    faqs: [
      { question: 'Can I download professional video lectures from LinkedIn?', answer: 'Yes! Download public LinkedIn post videos in 1080p HD format.' },
      { question: 'Can I save carousel PDF slides?', answer: 'Yes! Export LinkedIn carousel document slides.' },
      { question: 'Is LinkedIn login required?', answer: 'No login or account permissions needed.' },
      { question: 'Where are videos saved?', answer: 'Directly to your device Downloads folder.' },
      { question: 'Is this downloader free?', answer: '100% free for all professional users.' }
    ]
  },

  // --- Daily Quick Utilities ---
  '/utility/qr-generator': {
    slug: '/utility/qr-generator',
    title: 'Dynamic QR Code Generator (Custom Logo & Colors)',
    metaTitle: 'Free QR Code Generator with Logo - Create Vector SVG & PNG QR Codes | Aurea',
    description: 'Generate customizable QR codes for URLs, text, Wi-Fi, and contact cards. Embed center logo image, pick custom colors, export SVG/PNG.',
    keywords: ['qr code generator', 'create qr code with logo', 'custom qr code generator', 'vector svg qr code'],
    category: 'utility',
    howToSteps: [
      { title: 'Enter Content', text: 'Input website URL, plain text, Wi-Fi details, or contact information.' },
      { title: 'Customize Design', text: 'Choose background/foreground colors, error correction, and upload logo PNG.' },
      { title: 'Download Vector or PNG', text: 'Download high-resolution PNG or crisp vector SVG QR code.' }
    ],
    faqs: [
      { question: 'Do these QR codes expire?', answer: 'No! Static QR codes generated here contain raw data directly and never expire or depend on third-party redirection.' },
      { question: 'Can I insert my company logo into the center?', answer: 'Yes! Upload your PNG logo, and our engine automatically applies high error correction to keep QR readable.' },
      { question: 'What formats can I export?', answer: 'Export high-res PNG bitmap or scalable vector SVG for print graphics.' },
      { question: 'Can I create Wi-Fi access QR codes?', answer: 'Yes! Format Wi-Fi credentials so mobile devices scan and join automatically.' },
      { question: 'Is QR code generation tracked or logged?', answer: 'No! Everything is rendered locally on HTML5 Canvas without tracking.' }
    ]
  },

  '/utility/word-counter': {
    slug: '/utility/word-counter',
    title: 'Real-Time Word Counter & Keyword Density Analyzer',
    metaTitle: 'Word Counter Online Free - Count Words, Characters & Reading Time | Aurea',
    description: 'Count words, characters, sentences, paragraphs, reading time, and analyze keyword frequency density in real time.',
    keywords: ['word counter', 'character count online', 'keyword density analyzer', 'reading time calculator'],
    category: 'utility',
    howToSteps: [
      { title: 'Paste or Type Text', text: 'Paste your article, essay, or text into the live editor.' },
      { title: 'View Metrics', text: 'Instantly view word count, character count (with/without spaces), reading speed, and sentence breakdown.' },
      { title: 'Analyze Keyword Density', text: 'Review top 1-word and 2-word keyword density tables for SEO content optimization.' }
    ],
    faqs: [
      { question: 'How is reading time calculated?', answer: 'Based on standard average adult reading speed of 200-250 words per minute.' },
      { question: 'Does character count include spaces?', answer: 'We display both Total Characters (with spaces) and Clean Characters (excluding spaces).' },
      { question: 'How does keyword density analysis help SEO?', answer: 'Helps identify overused keywords and ensures proper keyword distribution for blog posts and metadata.' },
      { question: 'Is my pasted text saved on a server?', answer: 'No! Text live-updates strictly in React component state in browser memory.' },
      { question: 'Is there a character limit?', answer: 'No character limits.' }
    ]
  },

  '/utility/json-formatter': {
    slug: '/utility/json-formatter',
    title: 'JSON Formatter, Validator & CSV/YAML Converter',
    metaTitle: 'JSON Formatter & Validator Online - Format, Minify, Convert to CSV/YAML | Aurea',
    description: 'Format, prettify, minify, validate syntax, and convert JSON arrays to CSV or YAML structures locally in browser.',
    keywords: ['json formatter', 'json validator', 'json to csv', 'json to yaml', 'minify json'],
    category: 'utility',
    howToSteps: [
      { title: 'Input JSON Code', text: 'Paste raw JSON string into the editor or upload a .json file.' },
      { title: 'Select Action', text: 'Choose Format (2/4 spaces), Minify, Validate Syntax, or Convert to CSV/YAML.' },
      { title: 'Copy or Download Output', text: 'Copy formatted JSON or download converted CSV/YAML data file.' }
    ],
    faqs: [
      { question: 'How does JSON validation work?', answer: 'Highlights exact syntax error line numbers and unexpected token positions.' },
      { question: 'Can I convert JSON arrays to CSV spreadsheets?', answer: 'Yes! Flat and nested object arrays parse cleanly into downloadable CSV files.' },
      { question: 'Can I convert JSON to YAML format?', answer: 'Yes, converts JSON structures directly to clean indented YAML.' },
      { question: 'Is API or customer payload data secure?', answer: '100% secure. Data formatting runs strictly inside local JavaScript execution engine.' },
      { question: 'Can I minify JSON for production builds?', answer: 'Yes! One-click strip whitespace and line breaks.' }
    ]
  }
};

export function generateToolMetadata(slug: string) {
  const tool = SEO_REGISTRY[slug];
  if (!tool) {
    return {
      title: 'Aurea - 100% Client-Side PDF, Image, Social & Utility Tools',
      description: 'All-in-one 100% private web tools for PDF compression, image resizing, background removal, social media video downloader, QR code generation, and utilities.'
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aurea.co.in';
  const canonicalUrl = `${siteUrl}${slug}`;

  return {
    title: tool.metaTitle,
    description: tool.description,
    keywords: tool.keywords.join(', '),
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: tool.metaTitle,
      description: tool.description,
      url: canonicalUrl,
      siteName: 'Aurea',
      type: 'website',
      images: [
        {
          url: `${siteUrl}/1.png`,
          width: 512,
          height: 512,
          alt: tool.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.metaTitle,
      description: tool.description,
      images: [`${siteUrl}/1.png`]
    }
  };
}

export function generateToolSchemas(slug: string) {
  const tool = SEO_REGISTRY[slug];
  if (!tool) return [];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aurea.co.in';
  const pageUrl = `${siteUrl}${slug}`;

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': tool.title,
    'url': pageUrl,
    'description': tool.description,
    'applicationCategory': tool.category === 'pdf' ? 'BusinessApplication' : tool.category === 'image' ? 'DesignApplication' : tool.category === 'social' ? 'MultimediaApplication' : 'UtilitiesApplication',
    'operatingSystem': 'Any (Web Browser)',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'browserRequirements': 'Requires HTML5 Canvas, WebAssembly, and JavaScript enabled'
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': `How to use ${tool.title}`,
    'description': tool.description,
    'step': tool.howToSteps.map((step, idx) => ({
      '@type': 'HowToStep',
      'position': idx + 1,
      'name': step.title,
      'itemListElement': [
        {
          '@type': 'HowToDirection',
          'text': step.text
        }
      ]
    }))
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': tool.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return [webAppSchema, howToSchema, faqSchema];
}
