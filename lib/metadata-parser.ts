import exifr from 'exifr';
import { PDFDocument } from 'pdf-lib';

export interface GPSInfo {
  hasGps: boolean;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  latDisplay?: string;
  lonDisplay?: string;
  mapsUrl?: string;
}

export interface AIDetectionResult {
  verdict: 'ai_generated' | 'authentic_camera' | 'screenshot' | 'digital_graphic';
  confidence: 'High' | 'Medium' | 'Low';
  badgeTitle: string;
  badgeColor: 'rose' | 'emerald' | 'amber' | 'blue';
  generatorName?: string;
  reason: string;
  extractedPrompt?: string;
  technicalDetails?: string[];
}

export interface CameraOptics {
  make?: string;
  model?: string;
  lensModel?: string;
  focalLength?: string;
  fNumber?: string;
  exposureTime?: string;
  iso?: string;
  flash?: string;
  whiteBalance?: string;
  meteringMode?: string;
}

export interface FileSpecs {
  fileName: string;
  fileSizeFormatted: string;
  fileSizeBytes: number;
  mimeType: string;
  width?: number;
  height?: number;
  megapixels?: string;
  aspectRatio?: string;
  colorSpace?: string;
}

export interface OriginInfo {
  software?: string;
  artist?: string;
  copyright?: string;
  createDate?: string;
  modifyDate?: string;
  documentTitle?: string;
}

export interface ParsedMetadataResult {
  fileType: 'image' | 'pdf';
  specs: FileSpecs;
  gps: GPSInfo;
  aiDetection: AIDetectionResult;
  camera: CameraOptics;
  origin: OriginInfo;
  rawAttributesCount: number;
  allRawFields: Array<{ label: string; value: string; category: string }>;
}

// Convert decimal degrees to Degrees, Minutes, Seconds (DMS) string
function toDms(deg: number, isLat: boolean): string {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
  const direction = deg >= 0 ? (isLat ? 'N' : 'E') : isLat ? 'S' : 'W';
  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}

// Extract PNG text chunks (tEXt, iTXt) for AI prompts (ComfyUI, WebUI, NovelAI, Midjourney)
async function extractPngTextChunks(file: File): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  if (!file.name.toLowerCase().endsWith('.png') && file.type !== 'image/png') {
    return result;
  }

  try {
    const buffer = await file.arrayBuffer();
    const dataView = new DataView(buffer);
    let offset = 8; // skip PNG signature

    while (offset < buffer.byteLength - 8) {
      const length = dataView.getUint32(offset);
      offset += 4;
      const type = String.fromCharCode(
        dataView.getUint8(offset),
        dataView.getUint8(offset + 1),
        dataView.getUint8(offset + 2),
        dataView.getUint8(offset + 3)
      );
      offset += 4;

      if (type === 'tEXt' || type === 'iTXt') {
        const chunkBytes = new Uint8Array(buffer, offset, length);
        let nullIdx = 0;
        while (nullIdx < chunkBytes.length && chunkBytes[nullIdx] !== 0) {
          nullIdx++;
        }
        const key = new TextDecoder('latin1').decode(chunkBytes.subarray(0, nullIdx));
        let val = '';
        if (type === 'tEXt' && nullIdx < chunkBytes.length) {
          val = new TextDecoder('latin1').decode(chunkBytes.subarray(nullIdx + 1));
        } else if (type === 'iTXt') {
          // iTXt has compression flag, compression method, language tag, translated keyword, text
          const textSlice = chunkBytes.subarray(nullIdx + 5);
          val = new TextDecoder('utf-8').decode(textSlice);
        }
        if (key && val) {
          result[key] = val;
        }
      }

      offset += length + 4; // skip data + CRC
      if (type === 'IEND') break;
    }
  } catch (e) {
    console.warn('PNG chunk parsing skipped:', e);
  }

  return result;
}

export function detectAI(
  combinedText: string,
  tags: Record<string, any>,
  fileName: string
): AIDetectionResult {
  const lower = combinedText.toLowerCase();
  const fileLower = fileName.toLowerCase();

  // 1. Stable Diffusion / Automatic1111 / WebUI / Forge / Fooocus
  if (
    lower.includes('steps:') &&
    (lower.includes('sampler:') || lower.includes('cfg scale:') || lower.includes('model hash:') || lower.includes('seed:'))
  ) {
    return {
      verdict: 'ai_generated',
      confidence: 'High',
      badgeTitle: 'AI Generated Image Detected',
      badgeColor: 'rose',
      generatorName: 'Stable Diffusion / WebUI / Forge',
      reason: 'Detected full generation metadata footprint including diffusion steps, sampler schedule, and CFG scale.',
      extractedPrompt: combinedText.length > 500 ? combinedText.slice(0, 500) + '...' : combinedText,
    };
  }

  // 2. ComfyUI Graph
  if (lower.includes('"class_type"') && (lower.includes('ksampler') || lower.includes('cliptextencode'))) {
    return {
      verdict: 'ai_generated',
      confidence: 'High',
      badgeTitle: 'AI Generated Image Detected',
      badgeColor: 'rose',
      generatorName: 'ComfyUI Node Workflow',
      reason: 'Embedded ComfyUI node graph with KSampler diffusion parameters detected inside image text chunks.',
      extractedPrompt: 'ComfyUI node execution graph found in PNG chunk.',
    };
  }

  // 3. Midjourney
  if (
    lower.includes('midjourney') ||
    lower.includes('job id:') ||
    (/\s--v\s+[0-9]/.test(lower) && /\s--ar\s+[0-9]/.test(lower))
  ) {
    return {
      verdict: 'ai_generated',
      confidence: 'High',
      badgeTitle: 'AI Generated Image Detected',
      badgeColor: 'rose',
      generatorName: 'Midjourney',
      reason: 'Midjourney prompt syntax (--v, --ar, or Job ID signature) identified in image metadata.',
      extractedPrompt: combinedText.slice(0, 400),
    };
  }

  // 4. OpenAI DALL-E / ChatGPT
  if (lower.includes('dall-e') || lower.includes('dalle') || lower.includes('openai')) {
    return {
      verdict: 'ai_generated',
      confidence: 'High',
      badgeTitle: 'AI Generated Image Detected',
      badgeColor: 'rose',
      generatorName: 'OpenAI DALL-E',
      reason: 'OpenAI DALL-E generative marker detected in metadata headers.',
    };
  }

  // 5. Adobe Firefly / C2PA Algorithmic Media
  if (lower.includes('trainedalgorithmicmedia') || lower.includes('firefly') || lower.includes('c2pa')) {
    return {
      verdict: 'ai_generated',
      confidence: 'High',
      badgeTitle: 'AI Generated Image Detected',
      badgeColor: 'rose',
      generatorName: 'Adobe Firefly / C2PA AI Synthesis',
      reason: 'C2PA cryptographic provenance indicates image was generated via algorithmic generative media.',
    };
  }

  // 6. NovelAI, Leonardo, Flux, Ideogram
  if (lower.includes('novelai') || lower.includes('leonardo.ai') || lower.includes('ideogram') || lower.includes('flux.1')) {
    return {
      verdict: 'ai_generated',
      confidence: 'High',
      badgeTitle: 'AI Generated Image Detected',
      badgeColor: 'rose',
      generatorName: 'AI Synthesis Engine (NovelAI / Leonardo / Flux / Ideogram)',
      reason: 'Recognized AI generator name embedded in image creation tags.',
    };
  }

  // 7. Check for Physical Camera Optics
  const cameraMakes = [
    'apple',
    'canon',
    'nikon',
    'sony',
    'samsung',
    'google',
    'fujifilm',
    'panasonic',
    'olympus',
    'leica',
    'xiaomi',
    'oneplus',
    'motorola',
    'huawei',
    'vivo',
    'oppo',
    'realme',
    'hasselblad',
    'gopro',
    'dji',
  ];

  const make = (tags.Make || '').toLowerCase();
  const model = (tags.Model || '').toLowerCase();
  const hasCameraMake = cameraMakes.some((m) => make.includes(m) || model.includes(m));
  const hasOpticalTags = tags.FNumber || tags.ExposureTime || tags.ISOSpeedRatings || tags.ISO || tags.FocalLength;

  if (hasCameraMake && hasOpticalTags) {
    return {
      verdict: 'authentic_camera',
      confidence: 'High',
      badgeTitle: 'Authentic Camera Capture Verified',
      badgeColor: 'emerald',
      reason: `Physical camera hardware verified (${tags.Make || ''} ${tags.Model || ''}) with genuine optical lens sensor data.`,
      technicalDetails: [
        tags.Make ? `Make: ${tags.Make}` : '',
        tags.Model ? `Model: ${tags.Model}` : '',
        tags.FNumber ? `Aperture: f/${tags.FNumber}` : '',
        tags.ISO ? `ISO: ${tags.ISO}` : '',
      ].filter(Boolean),
    };
  }

  // 8. Screenshot detection
  if (
    fileLower.startsWith('screenshot') ||
    fileLower.startsWith('screen shot') ||
    fileLower.startsWith('screencapture') ||
    fileLower.includes('capture')
  ) {
    return {
      verdict: 'screenshot',
      confidence: 'High',
      badgeTitle: 'Digital Screenshot / Screen Capture',
      badgeColor: 'amber',
      reason: 'File name pattern and lack of optical camera metadata indicate a digital screen capture.',
    };
  }

  // 9. Standard Digital Graphic / Edited Image
  return {
    verdict: 'digital_graphic',
    confidence: 'Medium',
    badgeTitle: 'Digital Graphic / Web Media',
    badgeColor: 'blue',
    reason: 'Zero camera hardware sensor data or synthetic AI prompt signatures found in image headers.',
  };
}

export async function parseFileMetadata(file: File): Promise<ParsedMetadataResult> {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const sizeKb = Math.round(file.size / 1024);
  const sizeFormatted = sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(2)} MB` : `${sizeKb} KB`;

  if (isPdf) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

    const title = pdfDoc.getTitle() || undefined;
    const author = pdfDoc.getAuthor() || undefined;
    const subject = pdfDoc.getSubject() || undefined;
    const creator = pdfDoc.getCreator() || undefined;
    const producer = pdfDoc.getProducer() || undefined;
    const createDate = pdfDoc.getCreationDate() ? pdfDoc.getCreationDate()!.toLocaleString() : undefined;
    const modifyDate = pdfDoc.getModificationDate() ? pdfDoc.getModificationDate()!.toLocaleString() : undefined;

    const allFields: Array<{ label: string; value: string; category: string }> = [];
    if (title) allFields.push({ label: 'Document Title', value: title, category: 'Origin' });
    if (author) allFields.push({ label: 'Author / Name', value: author, category: 'Origin' });
    if (subject) allFields.push({ label: 'Subject', value: subject, category: 'Origin' });
    if (creator) allFields.push({ label: 'Creator Tool', value: creator, category: 'Software' });
    if (producer) allFields.push({ label: 'PDF Producer', value: producer, category: 'Software' });
    if (createDate) allFields.push({ label: 'Creation Timestamp', value: createDate, category: 'Date' });
    if (modifyDate) allFields.push({ label: 'Last Modified', value: modifyDate, category: 'Date' });

    return {
      fileType: 'pdf',
      specs: {
        fileName: file.name,
        fileSizeFormatted: sizeFormatted,
        fileSizeBytes: file.size,
        mimeType: 'application/pdf',
      },
      gps: { hasGps: false },
      aiDetection: {
        verdict: 'digital_graphic',
        confidence: 'High',
        badgeTitle: 'Digital PDF Document',
        badgeColor: 'blue',
        reason: 'Portable Document Format file with standard document dictionary properties.',
      },
      camera: {},
      origin: {
        documentTitle: title,
        artist: author,
        software: creator || producer,
        createDate,
        modifyDate,
      },
      rawAttributesCount: allFields.length,
      allRawFields: allFields,
    };
  }

  // --- IMAGE METADATA EXTRACTION VIA EXIFR & PNG CHUNKS ---
  let tags: Record<string, any> = {};
  let gpsData: { latitude?: number; longitude?: number; altitude?: number } | undefined = undefined;

  try {
    tags =
      (await exifr.parse(file, {
        tiff: true,
        xmp: true,
        icc: true,
        iptc: true,
        jfif: true,
        multiSegment: true,
      })) || {};
    gpsData = await exifr.gps(file);
  } catch (err) {
    console.warn('exifr parse error:', err);
  }

  // Also extract PNG chunks if PNG
  const pngChunks = await extractPngTextChunks(file);
  const combinedText = `${Object.values(pngChunks).join(' ')} ${tags.ImageDescription || ''} ${
    tags.UserComment || ''
  } ${tags.Software || ''} ${tags.CreatorTool || ''} ${tags.Description || ''} ${tags.parameters || ''}`;

  // Image Dimensions
  let width = tags.ImageWidth || tags.ExifImageWidth;
  let height = tags.ImageHeight || tags.ExifImageHeight;

  if (!width || !height) {
    // Fallback load to measure natural dimensions
    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
        img.src = url;
      });
      width = img.naturalWidth || undefined;
      height = img.naturalHeight || undefined;
      URL.revokeObjectURL(url);
    } catch {}
  }

  const megapixels =
    width && height ? `${((width * height) / 1000000).toFixed(1)} MP` : undefined;

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  let aspectRatio: string | undefined = undefined;
  if (width && height) {
    const divisor = gcd(width, height);
    aspectRatio = `${width / divisor}:${height / divisor}`;
  }

  // GPS Calculation
  const hasGps = !!(gpsData && gpsData.latitude !== undefined && gpsData.longitude !== undefined);
  const gpsInfo: GPSInfo = {
    hasGps,
    latitude: gpsData?.latitude,
    longitude: gpsData?.longitude,
    altitude: gpsData?.altitude,
    latDisplay: gpsData?.latitude !== undefined ? toDms(gpsData.latitude, true) : undefined,
    lonDisplay: gpsData?.longitude !== undefined ? toDms(gpsData.longitude, false) : undefined,
    mapsUrl: hasGps
      ? `https://www.google.com/maps?q=${gpsData!.latitude},${gpsData!.longitude}`
      : undefined,
  };

  // AI Detection
  const aiDetection = detectAI(combinedText, tags, file.name);

  // Camera & Optics
  const camera: CameraOptics = {
    make: tags.Make,
    model: tags.Model,
    lensModel: tags.LensModel || tags.Lens,
    focalLength: tags.FocalLength ? `${tags.FocalLength} mm` : undefined,
    fNumber: tags.FNumber ? `f/${tags.FNumber}` : undefined,
    exposureTime: tags.ExposureTime
      ? tags.ExposureTime < 1
        ? `1/${Math.round(1 / tags.ExposureTime)}s`
        : `${tags.ExposureTime}s`
      : undefined,
    iso: tags.ISO ? `ISO ${tags.ISO}` : tags.ISOSpeedRatings ? `ISO ${tags.ISOSpeedRatings}` : undefined,
    flash: tags.Flash !== undefined ? String(tags.Flash) : undefined,
    whiteBalance: tags.WhiteBalance !== undefined ? (tags.WhiteBalance === 0 ? 'Auto' : 'Manual') : undefined,
    meteringMode: tags.MeteringMode !== undefined ? String(tags.MeteringMode) : undefined,
  };

  // Origin & Software
  const origin: OriginInfo = {
    software: tags.Software || tags.CreatorTool || pngChunks.Software,
    artist: tags.Artist || tags.XPAuthor,
    copyright: tags.Copyright,
    createDate: tags.DateTimeOriginal
      ? new Date(tags.DateTimeOriginal).toLocaleString()
      : tags.CreateDate
      ? new Date(tags.CreateDate).toLocaleString()
      : undefined,
    modifyDate: tags.ModifyDate
      ? new Date(tags.ModifyDate).toLocaleString()
      : new Date(file.lastModified).toLocaleString(),
  };

  // Build full raw fields list for comprehensive inspector table
  const allRawFields: Array<{ label: string; value: string; category: string }> = [];

  if (hasGps) {
    allRawFields.push({ label: 'GPS Latitude', value: `${gpsInfo.latDisplay} (${gpsInfo.latitude})`, category: 'GPS Location' });
    allRawFields.push({ label: 'GPS Longitude', value: `${gpsInfo.lonDisplay} (${gpsInfo.longitude})`, category: 'GPS Location' });
    if (gpsInfo.altitude) allRawFields.push({ label: 'GPS Altitude', value: `${gpsInfo.altitude.toFixed(1)} meters`, category: 'GPS Location' });
  }

  if (camera.make) allRawFields.push({ label: 'Camera Manufacturer', value: camera.make, category: 'Hardware' });
  if (camera.model) allRawFields.push({ label: 'Camera Model', value: camera.model, category: 'Hardware' });
  if (camera.lensModel) allRawFields.push({ label: 'Lens Specification', value: camera.lensModel, category: 'Hardware' });
  if (camera.fNumber) allRawFields.push({ label: 'Aperture (F-Stop)', value: camera.fNumber, category: 'Optics' });
  if (camera.exposureTime) allRawFields.push({ label: 'Shutter Speed', value: camera.exposureTime, category: 'Optics' });
  if (camera.iso) allRawFields.push({ label: 'ISO Sensitivity', value: camera.iso, category: 'Optics' });
  if (camera.focalLength) allRawFields.push({ label: 'Focal Length', value: camera.focalLength, category: 'Optics' });
  if (origin.software) allRawFields.push({ label: 'Editing Software / OS', value: origin.software, category: 'Software' });
  if (origin.createDate) allRawFields.push({ label: 'Original Capture Date', value: origin.createDate, category: 'Timestamps' });
  if (origin.modifyDate) allRawFields.push({ label: 'File Last Modified', value: origin.modifyDate, category: 'Timestamps' });
  if (tags.ColorSpace) allRawFields.push({ label: 'Color Space Profile', value: tags.ColorSpace === 1 ? 'sRGB' : String(tags.ColorSpace), category: 'Image Format' });
  if (tags.Orientation) allRawFields.push({ label: 'Orientation Tag', value: `Orientation ${tags.Orientation}`, category: 'Image Format' });

  // Add any discovered PNG text chunks
  for (const [k, v] of Object.entries(pngChunks)) {
    allRawFields.push({
      label: `PNG Chunk [${k}]`,
      value: v.length > 300 ? v.slice(0, 300) + '...' : v,
      category: 'Text Chunks',
    });
  }

  return {
    fileType: 'image',
    specs: {
      fileName: file.name,
      fileSizeFormatted: sizeFormatted,
      fileSizeBytes: file.size,
      mimeType: file.type || 'image/jpeg',
      width,
      height,
      megapixels,
      aspectRatio,
      colorSpace: tags.ColorSpace === 1 ? 'sRGB' : undefined,
    },
    gps: gpsInfo,
    aiDetection,
    camera,
    origin,
    rawAttributesCount: allRawFields.length,
    allRawFields,
  };
}
