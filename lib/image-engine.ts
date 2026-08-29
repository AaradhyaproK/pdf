import imageCompression from 'browser-image-compression';
import { PDFDocument } from 'pdf-lib';

export interface PassportPreset {
  name: string;
  widthMm: number;
  heightMm: number;
  pxWidth: number;
  pxHeight: number;
  label: string;
}

export const PASSPORT_PRESETS: Record<string, PassportPreset> = {
  us: { name: 'US Passport', widthMm: 51, heightMm: 51, pxWidth: 600, pxHeight: 600, label: '2 x 2 inches (51 x 51 mm)' },
  schengen: { name: 'Schengen Visa', widthMm: 35, heightMm: 45, pxWidth: 413, pxHeight: 531, label: '35 x 45 mm' },
  uk: { name: 'UK Passport', widthMm: 35, heightMm: 45, pxWidth: 413, pxHeight: 531, label: '35 x 45 mm' },
  india: { name: 'India Passport', widthMm: 51, heightMm: 51, pxWidth: 600, pxHeight: 600, label: '2 x 2 inches (51 x 51 mm)' }
};

/**
 * Iteratively compresses an image file to hit a target file size in Kilobytes (e.g. <20KB, <50KB, <100KB).
 */
export async function compressImageToTargetKB(file: File, targetKB: number): Promise<File> {
  const options = {
    maxSizeMB: targetKB / 1024,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.9,
  };

  try {
    let compressedFile = await imageCompression(file, options);
    if (compressedFile.size > targetKB * 1024) {
      compressedFile = await iterativeCanvasCompression(file, targetKB);
    }
    return compressedFile;
  } catch {
    return await iterativeCanvasCompression(file, targetKB);
  }
}

/**
 * Compresses an image based on quality percentage and max dimension limits.
 */
export async function compressImageByQuality(
  file: File,
  qualityPercentage: number,
  maxWidthOrHeight: number = 1920
): Promise<File> {
  const options = {
    maxSizeMB: 50,
    maxWidthOrHeight,
    useWebWorker: true,
    initialQuality: qualityPercentage / 100,
  };
  return await imageCompression(file, options);
}

/**
 * Resizes image to exact width and height or scales proportionally locking aspect ratio.
 */
export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  lockAspect: boolean = true
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');

  let finalWidth = targetWidth;
  let finalHeight = targetHeight;

  if (lockAspect) {
    const ratio = img.width / img.height;
    if (targetWidth / targetHeight > ratio) {
      finalWidth = Math.round(targetHeight * ratio);
    } else {
      finalHeight = Math.round(targetWidth / ratio);
    }
  }

  canvas.width = finalWidth;
  canvas.height = finalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create image blob'));
      },
      file.type === 'image/png' ? 'image/png' : 'image/jpeg',
      0.92
    );
  });
}

/**
 * Crops image to passport photo presets and optionally creates a printable 4x6 grid sheet.
 */
export async function cropToPassportPreset(
  file: File,
  presetKey: keyof typeof PASSPORT_PRESETS
): Promise<{ singleBlob: Blob; sheetBlob: Blob }> {
  const preset = PASSPORT_PRESETS[presetKey] || PASSPORT_PRESETS.us;
  const img = await loadImageFromFile(file);

  const singleCanvas = document.createElement('canvas');
  singleCanvas.width = preset.pxWidth;
  singleCanvas.height = preset.pxHeight;
  const ctx = singleCanvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');

  const sourceAspect = img.width / img.height;
  const targetAspect = preset.pxWidth / preset.pxHeight;

  let sX = 0, sY = 0, sW = img.width, sH = img.height;
  if (sourceAspect > targetAspect) {
    sW = img.height * targetAspect;
    sX = (img.width - sW) / 2;
  } else {
    sH = img.width / targetAspect;
    sY = (img.height - sH) / 2;
  }

  ctx.drawImage(img, sX, sY, sW, sH, 0, 0, preset.pxWidth, preset.pxHeight);

  const singleBlob: Blob = await new Promise((res) => singleCanvas.toBlob((b) => res(b!), 'image/jpeg', 0.95));

  const sheetCanvas = document.createElement('canvas');
  sheetCanvas.width = 1200;
  sheetCanvas.height = 1800;
  const sheetCtx = sheetCanvas.getContext('2d');
  if (!sheetCtx) throw new Error('Sheet canvas unavailable');

  sheetCtx.fillStyle = '#ffffff';
  sheetCtx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

  const cols = 3;
  const rows = 2;
  const cardW = preset.pxWidth * 0.8;
  const cardH = preset.pxHeight * 0.8;
  const startX = (sheetCanvas.width - (cols * cardW + (cols - 1) * 40)) / 2;
  const startY = (sheetCanvas.height - (rows * cardH + (rows - 1) * 40)) / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const posX = startX + c * (cardW + 40);
      const posY = startY + r * (cardH + 40);
      sheetCtx.drawImage(singleCanvas, posX, posY, cardW, cardH);
      sheetCtx.strokeStyle = '#dddddd';
      sheetCtx.lineWidth = 1;
      sheetCtx.strokeRect(posX, posY, cardW, cardH);
    }
  }

  const sheetBlob: Blob = await new Promise((res) => sheetCanvas.toBlob((b) => res(b!), 'image/jpeg', 0.95));

  return { singleBlob, sheetBlob };
}

/**
 * Removes background 100% client-side with ultra-fast canvas downscaling, smooth alpha feathering, & Wasm AI fallback.
 */
export async function removeImageBackground(
  file: File,
  options?: { tolerance?: number; bgFormat?: 'transparent' | 'white' | 'color'; customBgColor?: string },
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const tolerance = options?.tolerance || 35;
  if (onProgress) onProgress(20);

  // Downsample input image for blazingly fast execution (<0.5s)
  const img = await loadImageFromFile(file);
  const maxDim = 1000;
  let w = img.width;
  let h = img.height;
  if (w > maxDim || h > maxDim) {
    if (w > h) {
      h = Math.round((h * maxDim) / w);
      w = maxDim;
    } else {
      w = Math.round((w * maxDim) / h);
      h = maxDim;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas context unavailable');

  ctx.drawImage(img, 0, 0, w, h);
  if (onProgress) onProgress(40);

  // Attempt fast Wasm AI model with 2.5s timeout limit
  try {
    const wasmPromise = (async () => {
      const { removeBackground } = await import('@imgly/background-removal');
      const tempPng = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), 'image/png'));
      return await removeBackground(tempPng as any);
    })();

    const timeoutPromise = new Promise<null>((res) => setTimeout(() => res(null), 2500));
    const wasmResult = await Promise.race([wasmPromise, timeoutPromise]);

    if (wasmResult instanceof Blob) {
      if (onProgress) onProgress(100);
      return wasmResult;
    }
  } catch {
    // Fallback to instant multi-corner edge canvas algorithm
  }

  if (onProgress) onProgress(70);

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Sample corner regions & middle border to detect background palette
  const corners = [
    getPixelColor(data, 0, 0, w),
    getPixelColor(data, w - 1, 0, w),
    getPixelColor(data, 0, h - 1, w),
    getPixelColor(data, w - 1, h - 1, w),
    getPixelColor(data, Math.floor(w / 2), 0, w),
    getPixelColor(data, Math.floor(w / 2), h - 1, w),
  ];

  const feather = tolerance * 0.4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];

    // Find min color distance to background samples
    let minDiffSq = Infinity;
    for (const c of corners) {
      const diffSq = (r - c.r) ** 2 + (g - c.g) ** 2 + (b - c.b) ** 2;
      if (diffSq < minDiffSq) minDiffSq = diffSq;
    }

    const dist = Math.sqrt(minDiffSq);

    if (dist < tolerance) {
      data[i + 3] = 0; // Transparent
    } else if (dist < tolerance + feather) {
      const alphaRatio = (dist - tolerance) / feather;
      data[i + 3] = Math.round(data[i + 3] * alphaRatio); // Smooth edge feathering
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Apply custom background fill if white or solid color requested
  if (options?.bgFormat === 'white' || options?.bgFormat === 'color') {
    const fillCanvas = document.createElement('canvas');
    fillCanvas.width = w;
    fillCanvas.height = h;
    const fillCtx = fillCanvas.getContext('2d');
    if (fillCtx) {
      fillCtx.fillStyle = options.customBgColor || (options.bgFormat === 'white' ? '#ffffff' : '#f8fafc');
      fillCtx.fillRect(0, 0, w, h);
      fillCtx.drawImage(canvas, 0, 0);
      if (onProgress) onProgress(100);
      return new Promise((res) => fillCanvas.toBlob((b) => res(b!), 'image/jpeg', 0.92));
    }
  }

  if (onProgress) onProgress(100);
  return new Promise((res) => canvas.toBlob((b) => res(b!), 'image/png'));
}

function getPixelColor(data: Uint8ClampedArray, x: number, y: number, width: number) {
  const idx = (y * width + x) * 4;
  return { r: data[idx], g: data[idx + 1], b: data[idx + 2] };
}

/**
 * Converts Apple HEIC / HEIF files to JPG/PNG images client-side.
 */
export async function convertHEICToJPG(file: File): Promise<Blob> {
  try {
    const heic2any = (await import('heic2any')).default;
    const converted = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9,
    });
    return Array.isArray(converted) ? converted[0] : converted;
  } catch {
    const img = await loadImageFromFile(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0);
    return new Promise((res, rej) => {
      canvas.toBlob((b) => (b ? res(b) : rej(new Error('HEIC fallback failed'))), 'image/jpeg', 0.9);
    });
  }
}

/**
 * Converts a list of image files into a single formatted multi-page PDF document.
 */
export async function imagesToPDF(
  files: File[],
  orientation: 'portrait' | 'landscape' = 'portrait',
  pageSize: 'a4' | 'letter' = 'a4',
  margin: number = 20
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  let pageW = pageSize === 'a4' ? 595.28 : 612;
  let pageH = pageSize === 'a4' ? 841.89 : 792;

  if (orientation === 'landscape') {
    const temp = pageW;
    pageW = pageH;
    pageH = temp;
  }

  for (const file of files) {
    const imgBuffer = await file.arrayBuffer();
    let embeddedImg;

    if (file.type.includes('png')) {
      embeddedImg = await pdfDoc.embedPng(imgBuffer);
    } else {
      embeddedImg = await pdfDoc.embedJpg(imgBuffer);
    }

    const page = pdfDoc.addPage([pageW, pageH]);
    const maxW = pageW - margin * 2;
    const maxH = pageH - margin * 2;

    const imgAspect = embeddedImg.width / embeddedImg.height;
    let drawW = maxW;
    let drawH = maxW / imgAspect;

    if (drawH > maxH) {
      drawH = maxH;
      drawW = maxH * imgAspect;
    }

    const posX = margin + (maxW - drawW) / 2;
    const posY = margin + (maxH - drawH) / 2;

    page.drawImage(embeddedImg, {
      x: posX,
      y: posY,
      width: drawW,
      height: drawH,
    });
  }

  return await pdfDoc.save();
}

// Helpers
function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

async function iterativeCanvasCompression(file: File, targetKB: number): Promise<File> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  let width = img.width;
  let height = img.height;
  let quality = 0.85;

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(img, 0, 0, width, height);

  let blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/jpeg', quality));

  let attempts = 0;
  while (blob.size > targetKB * 1024 && attempts < 10) {
    attempts++;
    width = Math.round(width * 0.85);
    height = Math.round(height * 0.85);
    quality = Math.max(0.2, quality - 0.1);

    canvas.width = width;
    canvas.height = height;
    ctx?.drawImage(img, 0, 0, width, height);
    blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/jpeg', quality));
  }

  return new File([blob], file.name.replace(/\.[^/.]+$/, "") + "-compressed.jpg", { type: 'image/jpeg' });
}
