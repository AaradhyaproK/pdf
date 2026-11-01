import { PDFDocument } from 'pdf-lib';

/**
 * Unlocks and decrypts a password-protected or permissions-restricted PDF.
 *
 * 1. Fast Path: Uses pdf-lib with `ignoreEncryption: true` to instantly strip
 *    owner/permissions passwords while preserving 100% original vector & font fidelity.
 * 2. Authenticated Path: If the PDF requires a user open-password, uses pdfjs-dist
 *    with the provided password to authenticate and decrypt the document streams.
 *    Renders each page at high-DPI (2.5x) and repackages into a clean, unencrypted PDF.
 *
 * 100% Client-Side, 0% Server Upload, and 0% SharedArrayBuffer requirement.
 * Completely eliminates Emscripten pthread `DataCloneError: SharedArrayBuffer transfer`
 * and runs natively in all browsers without requiring crossOriginIsolated headers.
 */
export async function unprotectPDF(file: File, password?: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();

  // Step 1: Fast Path — Try direct pdf-lib load
  // Handles permission-locked & owner-encrypted PDFs without any rasterization
  if (!password) {
    try {
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      return await pdfDoc.save();
    } catch {
      // Document requires a user password, fall through to Step 2
    }
  }

  // Step 2: Authenticated Path via pdfjs-dist
  const pdfjsLib = await import('pdfjs-dist');
  if (typeof window !== 'undefined' && pdfjsLib?.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  let pdfDocJs: any;
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      password: password || '',
    });
    pdfDocJs = await loadingTask.promise;
  } catch (loadErr: any) {
    if (loadErr?.name === 'PasswordException') {
      throw new Error(
        password
          ? 'Incorrect password. Please verify the password and try again.'
          : 'This PDF is protected with an open password. Please enter the password above to unlock.'
      );
    }
    throw new Error(loadErr?.message || 'Failed to unlock PDF. Please check if the password is correct.');
  }

  // Re-package into a clean, unencrypted PDF document
  const outPdfDoc = await PDFDocument.create();
  const numPages = pdfDocJs.numPages;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDocJs.getPage(i);
    const viewport = page.getViewport({ scale: 2.5 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) continue;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport,
    } as any).promise;

    const imgDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const imgBytes = await fetch(imgDataUrl).then((r) => r.arrayBuffer());
    const embeddedImg = await outPdfDoc.embedJpg(imgBytes);

    // Preserve original physical pt dimensions
    const originalPtWidth = viewport.width / 2.5;
    const originalPtHeight = viewport.height / 2.5;

    const newPage = outPdfDoc.addPage([originalPtWidth, originalPtHeight]);
    newPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: originalPtWidth,
      height: originalPtHeight,
    });
  }

  return await outPdfDoc.save();
}
