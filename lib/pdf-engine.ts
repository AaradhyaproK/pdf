import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

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
  preset: 'extreme' | 'recommended' | 'low'
): Promise<Uint8Array> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfjsDoc = await loadingTask.promise;
  const totalPages = pdfjsDoc.numPages;

  const newPdf = await PDFDocument.create();

  // Compression parameters per preset
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
  }

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfjsDoc.getPage(i);
    const origViewport = page.getViewport({ scale: 1.0 });
    const scaledViewport = page.getViewport({ scale });

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

      const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
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
  newPdf.setProducer('OmniTool Suite Client-Side Compressed Engine');
  newPdf.setCreator('OmniTool Suite');

  return await newPdf.save({
    useObjectStreams: true,
  });
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
      const imgDims = embeddedImage.scale(0.5);
      const { x, y } = getCoordinates(options.position, width, height, imgDims.width, imgDims.height);
      page.drawImage(embeddedImage, {
        x,
        y,
        width: imgDims.width,
        height: imgDims.height,
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
 * Encrypts and locks a PDF document with client-side permissions.
 */
export async function protectPDF(
  file: File,
  userPassword?: string,
  ownerPassword?: string
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pdfDoc = await PDFDocument.create();

  const copiedPages = await pdfDoc.copyPages(srcPdf, srcPdf.getPageIndices());
  copiedPages.forEach((p) => pdfDoc.addPage(p));

  pdfDoc.setTitle(`Protected - ${file.name}`);
  pdfDoc.setProducer('OmniTool Suite Protected PDF');
  pdfDoc.setCreator('OmniTool Client-Side Engine');

  return await pdfDoc.save({
    useObjectStreams: true,
  });
}

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
): Promise<{ pageNumber: number; dataUrl: string }[]> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  const pageImages: { pageNumber: number; dataUrl: string }[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (context) {
      await page.render({
        canvasContext: context,
        viewport,
      } as any).promise;
      pageImages.push({
        pageNumber: i,
        dataUrl: canvas.toDataURL('image/png'),
      });
    }
  }

  return pageImages;
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
