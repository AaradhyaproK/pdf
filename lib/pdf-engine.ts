import forge from 'node-forge';
import {
  PDFDocument,
  rgb,
  degrees,
  StandardFonts,
  PDFHexString,
  PDFRawStream,
  PDFStream,
  PDFName,
} from 'pdf-lib';

// --- Standard PDF Security Handler (Revision 3 / 128-bit Encryption) Helpers ---
// Official ISO 32000-1 PDF Specification Padding Bytes (32 bytes)
const PDF_PADDING = new Uint8Array([
  0x28, 0xbf, 0x4e, 0x5e, 0x4e, 0x75, 0x8a, 0x41,
  0x64, 0x00, 0x4e, 0x56, 0xff, 0xfa, 0x01, 0x08,
  0x2e, 0x2e, 0x00, 0xb6, 0xd0, 0x68, 0x3e, 0x80,
  0x2f, 0x0c, 0xa9, 0xfe, 0x64, 0x53, 0x69, 0x7a,
]);

function md5Bytes(data: Uint8Array): Uint8Array {
  const md = forge.md.md5.create();
  md.update(forge.util.binary.raw.encode(data));
  const hex = md.digest().toHex();
  const out = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    out[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function rc4(key: Uint8Array, data: Uint8Array): Uint8Array {
  const S = new Uint8Array(256);
  for (let i = 0; i < 256; i++) S[i] = i;
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key[i % key.length]) & 0xff;
    const tmp = S[i];
    S[i] = S[j];
    S[j] = tmp;
  }
  const out = new Uint8Array(data.length);
  let i = 0;
  j = 0;
  for (let k = 0; k < data.length; k++) {
    i = (i + 1) & 0xff;
    j = (j + S[i]) & 0xff;
    const tmp = S[i];
    S[i] = S[j];
    S[j] = tmp;
    out[k] = data[k] ^ S[(S[i] + S[j]) & 0xff];
  }
  return out;
}

function padPassword(pass: string): Uint8Array {
  const enc = new TextEncoder().encode(pass);
  const out = new Uint8Array(32);
  if (enc.length >= 32) {
    out.set(enc.subarray(0, 32));
  } else {
    out.set(enc);
    out.set(PDF_PADDING.subarray(0, 32 - enc.length), enc.length);
  }
  return out;
}

function computeOwnerKey(ownerPass: string, userPass: string): Uint8Array {
  const paddedOwner = padPassword(ownerPass || userPass);
  let hash = md5Bytes(paddedOwner);

  for (let i = 0; i < 50; i++) {
    hash = md5Bytes(hash);
  }

  const paddedUser = padPassword(userPass);
  let result = paddedUser;
  const derivedKey = new Uint8Array(16);
  for (let j = 0; j <= 19; j++) {
    for (let k = 0; k < 16; ++k) {
      derivedKey[k] = hash[k] ^ j;
    }
    result = rc4(derivedKey, result);
  }

  return result;
}

function computeEncryptionKey(
  userPass: string,
  oKey: Uint8Array,
  pVal: number,
  idBytes: Uint8Array
): Uint8Array {
  const paddedUser = padPassword(userPass);
  const hashData = new Uint8Array(32 + 32 + 4 + idBytes.length);
  hashData.set(paddedUser, 0);
  hashData.set(oKey, 32);
  hashData[64] = pVal & 0xff;
  hashData[65] = (pVal >> 8) & 0xff;
  hashData[66] = (pVal >> 16) & 0xff;
  hashData[67] = (pVal >>> 24) & 0xff;
  hashData.set(idBytes, 68);

  let hash = md5Bytes(hashData);

  for (let i = 0; i < 50; i++) {
    hash = md5Bytes(hash);
  }

  return hash;
}

function computeUserKey(encKey: Uint8Array, idBytes: Uint8Array): Uint8Array {
  const hashData = new Uint8Array(32 + idBytes.length);
  hashData.set(PDF_PADDING, 0);
  hashData.set(idBytes, 32);

  let checkData = rc4(encKey, md5Bytes(hashData));
  const n = encKey.length;
  const derivedKey = new Uint8Array(n);
  for (let j = 1; j <= 19; ++j) {
    for (let k = 0; k < n; ++k) {
      derivedKey[k] = encKey[k] ^ j;
    }
    checkData = rc4(derivedKey, checkData);
  }

  const uVal = new Uint8Array(32);
  uVal.set(checkData, 0);
  uVal.set(PDF_PADDING.subarray(0, 16), 16);
  return uVal;
}

function computeObjectKey(encKey: Uint8Array, objectId: number, genNum: number): Uint8Array {
  const buf = new Uint8Array(encKey.length + 5);
  buf.set(encKey, 0);
  buf[encKey.length] = objectId & 0xff;
  buf[encKey.length + 1] = (objectId >> 8) & 0xff;
  buf[encKey.length + 2] = (objectId >> 16) & 0xff;
  buf[encKey.length + 3] = genNum & 0xff;
  buf[encKey.length + 4] = (genNum >> 8) & 0xff;

  const keyHash = md5Bytes(buf);
  return keyHash.subarray(0, Math.min(16, encKey.length + 5));
}

export interface PDFPageMeta {
  pageIndex: number;
  dataUrl: string;
  rotation: number;
}

export interface WatermarkOptions {
  text?: string;
  image?: File;
  opacity: number;
  rotation: number;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  fontSize?: number;
  colorHex?: string;
}

/**
 * Merges multiple PDF files into a single Uint8Array PDF document.
 */
export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Splits a PDF document based on page numbers/ranges (e.g., "1, 3, 5-8").
 */
export async function splitPDF(file: File, rangeStr: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = srcPdf.getPageCount();

  const selectedIndices = parsePageRanges(rangeStr, totalPages);
  if (selectedIndices.length === 0) {
    throw new Error('No valid pages specified for extraction.');
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(srcPdf, selectedIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

/**
 * Compresses a PDF file client-side by re-sampling page canvas streams into high-compression JPEG structures.
 */
export async function compressPDF(
  file: File,
  preset: 'extreme' | 'recommended' | 'low' | 'target',
  targetKB?: number
): Promise<Uint8Array> {
  const pdfjsLib = await import('pdfjs-dist');
  if (typeof window !== 'undefined' && pdfjsLib?.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfjsDoc = await loadingTask.promise;
  const totalPages = pdfjsDoc.numPages;

  const origSizeKB = file.size / 1024;

  const renderPass = async (s: number, q: number) => {
    const newPdf = await PDFDocument.create();
    for (let i = 1; i <= totalPages; i++) {
      const page = await pdfjsDoc.getPage(i);
      const origViewport = page.getViewport({ scale: 1.0 });
      const scaledViewport = page.getViewport({ scale: s });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      if (context) {
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'medium';

        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
        } as any).promise;

        const jpegDataUrl = canvas.toDataURL('image/jpeg', q);
        const embeddedJpg = await newPdf.embedJpg(jpegDataUrl);

        const newPage = newPdf.addPage([origViewport.width, origViewport.height]);
        newPage.drawImage(embeddedJpg, {
          x: 0,
          y: 0,
          width: origViewport.width,
          height: origViewport.height,
        });
      }
    }

    newPdf.setTitle('Compressed PDF');
    newPdf.setProducer('FileZenith Client-Side Compressed Engine');
    newPdf.setCreator('FileZenith');

    return await newPdf.save({
      useObjectStreams: true,
    });
  };

  let scale = 1.2;
  let quality = 0.55;

  if (preset === 'extreme') {
    scale = 0.9;
    quality = 0.35;
  } else if (preset === 'recommended') {
    scale = 1.15;
    quality = 0.55;
  } else if (preset === 'low') {
    scale = 1.4;
    quality = 0.75;
  } else if (preset === 'target' && targetKB && targetKB > 0) {
    const targetBytes = targetKB * 1024;
    const ratio = targetKB / origSizeKB;

    if (ratio >= 0.95) {
      scale = 1.3;
      quality = 0.8;
    } else {
      scale = Math.max(0.55, Math.min(1.25, Math.sqrt(ratio) * 1.15));
      quality = Math.max(0.2, Math.min(0.8, ratio * 0.75 + 0.15));
    }

    let pdfBytes = await renderPass(scale, quality);
    let bestResult = pdfBytes;
    let bestSize = pdfBytes.length;

    // Perform up to 2 adaptive tuning passes to bring the output size close to targetBytes (80%-98% range)
    for (let attempt = 0; attempt < 2; attempt++) {
      const currentSize = pdfBytes.length;

      // If output is within [78% .. 102%] of target, it's virtually optimal!
      if (currentSize <= targetBytes * 1.02 && currentSize >= targetBytes * 0.78) {
        break;
      }

      if (currentSize > targetBytes * 1.02) {
        // Output is too large -> scale down parameters
        const factor = Math.sqrt(targetBytes / currentSize);
        scale = Math.max(0.4, scale * factor);
        quality = Math.max(0.15, quality * factor);
      } else if (currentSize < targetBytes * 0.78) {
        // Output is too small -> scale up parameters to improve quality and hit near target size
        const factor = Math.min(1.45, Math.sqrt(targetBytes / currentSize));
        const newScale = Math.min(1.4, scale * factor);
        const newQuality = Math.min(0.88, quality * factor);

        if (Math.abs(newScale - scale) < 0.03 && Math.abs(newQuality - quality) < 0.03) {
          break;
        }
        scale = newScale;
        quality = newQuality;
      }

      const nextBytes = await renderPass(scale, quality);

      if (nextBytes.length <= targetBytes * 1.03) {
        pdfBytes = nextBytes;
        bestResult = nextBytes;
        bestSize = nextBytes.length;
      } else if (bestSize > targetBytes) {
        if (nextBytes.length < bestSize) {
          pdfBytes = nextBytes;
          bestResult = nextBytes;
          bestSize = nextBytes.length;
        }
      } else {
        break;
      }
    }

    return bestResult;
  }

  return await renderPass(scale, quality);
}

/**
 * Watermarks a PDF document with custom text or image overlay.
 */
export async function watermarkPDF(file: File, options: WatermarkOptions): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  let embeddedImage = null;
  if (options.image) {
    const imgBuffer = await options.image.arrayBuffer();
    if (options.image.type.includes('png')) {
      embeddedImage = await pdfDoc.embedPng(imgBuffer);
    } else {
      embeddedImage = await pdfDoc.embedJpg(imgBuffer);
    }
  }

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const color = hexToRgb(options.colorHex || '#ff0000');
  const opacity = options.opacity / 100;
  const rotationDeg = degrees(options.rotation || 0);
  const fontSize = options.fontSize || 36;

  for (const page of pages) {
    const { width, height } = page.getSize();

    if (embeddedImage) {
      const scalePercentage = (options.fontSize ? options.fontSize / 100 : 0.35);
      const targetW = width * scalePercentage;
      const targetH = height * scalePercentage;
      const imgScaled = embeddedImage.scaleToFit(targetW, targetH);
      const { x, y } = getCoordinates(options.position, width, height, imgScaled.width, imgScaled.height);
      page.drawImage(embeddedImage, {
        x,
        y,
        width: imgScaled.width,
        height: imgScaled.height,
        opacity,
        rotate: rotationDeg,
      });
    } else if (options.text) {
      const textWidth = font.widthOfTextAtSize(options.text, fontSize);
      const textHeight = fontSize;
      const { x, y } = getCoordinates(options.position, width, height, textWidth, textHeight);

      page.drawText(options.text, {
        x,
        y,
        size: fontSize,
        font,
        color,
        opacity,
        rotate: rotationDeg,
      });
    }
  }

  return await pdfDoc.save();
}

/**
 * Encrypts and locks a PDF document with standard 128-bit password protection.
 */
export async function protectPDF(
  file: File,
  userPassword?: string,
  ownerPassword?: string
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  const pass = userPassword || '';
  const oPass = ownerPassword || pass;
  const P = -44;

  const idBytes = new Uint8Array(16);
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(idBytes);
  } else {
    for (let i = 0; i < 16; i++) idBytes[i] = Math.floor(Math.random() * 256);
  }

  const oKey = computeOwnerKey(oPass, pass);
  const encKey = computeEncryptionKey(pass, oKey, P, idBytes);
  const uKey = computeUserKey(encKey, idBytes);

  const toHex = (buf: Uint8Array) =>
    Array.from(buf)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

  // Register Encrypt Dictionary in PDF context
  const encryptDict = pdfDoc.context.obj({
    Filter: 'Standard',
    V: 2,
    R: 3,
    Length: 128,
    P: P,
    O: PDFHexString.of(toHex(oKey)),
    U: PDFHexString.of(toHex(uKey)),
  });

  const encryptRef = pdfDoc.context.register(encryptDict);

  // Encrypt all indirect stream objects in PDF document context
  const indirectObjects = pdfDoc.context.enumerateIndirectObjects();
  for (const [ref, obj] of indirectObjects) {
    if (ref.objectNumber === encryptRef.objectNumber) continue;

    if (obj instanceof PDFStream) {
      const objKey = computeObjectKey(encKey, ref.objectNumber, ref.generationNumber);
      const originalContents = obj.getContents();
      const encryptedContents = rc4(objKey, originalContents);

      const encryptedStream = PDFRawStream.of(obj.dict, encryptedContents);
      pdfDoc.context.assign(ref, encryptedStream);
    }
  }

  // Set Encrypt & ID entries in PDF Trailer Info (PDF Spec Requirement)
  (pdfDoc.context as any).trailerInfo.Encrypt = encryptRef;
  (pdfDoc.context as any).trailerInfo.ID = pdfDoc.context.obj([
    PDFHexString.of(toHex(idBytes)),
    PDFHexString.of(toHex(idBytes)),
  ]);

  return await pdfDoc.save({ useObjectStreams: false });
}

/**
 * Unprotects/Removes password from a PDF document.
 */

/**
 * Organizes, rotates, or deletes specific pages of a PDF document.
 */
export async function organizePDFPages(
  file: File,
  pageOps: { originalIndex: number; rotation: number; delete?: boolean }[]
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();

  for (const op of pageOps) {
    if (op.delete) continue;

    const [copiedPage] = await newPdf.copyPages(srcPdf, [op.originalIndex]);
    const currentRot = copiedPage.getRotation().angle;
    copiedPage.setRotation(degrees((currentRot + op.rotation) % 360));
    newPdf.addPage(copiedPage);
  }

  return await newPdf.save();
}

/**
 * Renders pages of a PDF to high-resolution image data URLs using pdfjs-dist / canvas.
 */
export async function renderPDFPagesToImages(
  file: File,
  scale: number = 1.5
): Promise<{ pageNumber: number; dataUrl: string; width: number; height: number }[]> {
  const pdfjsLib = await import('pdfjs-dist');
  if (typeof window !== 'undefined' && pdfjsLib?.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  const pageImages: { pageNumber: number; dataUrl: string; width: number; height: number }[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (context) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: context,
        viewport,
      } as any).promise;
      pageImages.push({
        pageNumber: i,
        dataUrl: canvas.toDataURL('image/jpeg', 0.92),
        width: viewport.width,
        height: viewport.height,
      });
    }
  }

  return pageImages;
}

/**
 * Renders a single PDF page at high resolution.
 */
export async function renderPDFPageToImage(
  file: File,
  pageNumber: number,
  scale: number = 2.0
): Promise<{ dataUrl: string; width: number; height: number }> {
  const pdfjsLib = await import('pdfjs-dist');
  if (typeof window !== 'undefined' && pdfjsLib?.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  if (!context) throw new Error('Failed to create canvas context');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext: context,
    viewport,
  } as any).promise;

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width: viewport.width,
    height: viewport.height,
  };
}

/**
 * Performs client-side OCR on scanned PDF pages using Tesseract.js Web Worker.
 */
export async function extractTextOCR(
  file: File,
  lang: string = 'eng',
  onProgress?: (progress: number, status: string) => void
): Promise<string> {
  const images = await renderPDFPagesToImages(file, 2.0);
  const { createWorker } = await import('tesseract.js');

  const worker = await createWorker(lang);
  let fullText = '';

  for (let idx = 0; idx < images.length; idx++) {
    if (onProgress) {
      onProgress(Math.round(((idx + 1) / images.length) * 100), `Recognizing page ${idx + 1} of ${images.length}...`);
    }
    const ret = await worker.recognize(images[idx].dataUrl);
    fullText += `--- Page ${idx + 1} ---\n` + ret.data.text + '\n\n';
  }

  await worker.terminate();
  return fullText;
}

// Helpers
function parsePageRanges(rangeStr: string, maxPages: number): number[] {
  const pages: Set<number> = new Set();
  const parts = rangeStr.split(',').map((p) => p.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => parseInt(s, 10));
      if (!isNaN(startStr) && !isNaN(endStr)) {
        const start = Math.max(1, startStr);
        const end = Math.min(maxPages, endStr);
        for (let i = start; i <= end; i++) {
          pages.add(i - 1);
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
        pages.add(pageNum - 1);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

function hexToRgb(hex: string) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return rgb(r, g, b);
}

function getCoordinates(
  pos: WatermarkOptions['position'],
  pageW: number,
  pageH: number,
  objW: number,
  objH: number
) {
  switch (pos) {
    case 'top-left':
      return { x: 30, y: pageH - objH - 30 };
    case 'top-right':
      return { x: pageW - objW - 30, y: pageH - objH - 30 };
    case 'bottom-left':
      return { x: 30, y: 30 };
    case 'bottom-right':
      return { x: pageW - objW - 30, y: 30 };
    case 'center':
    default:
      return { x: (pageW - objW) / 2, y: (pageH - objH) / 2 };
  }
}
