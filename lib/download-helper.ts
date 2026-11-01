/**
 * Universal browser-safe download helper for FileZenith.
 *
 * Solves 4 widespread browser download failure modes:
 * 1. Synchronous URL.revokeObjectURL(url) called immediately after a.click(),
 *    which cancels background download tasks in Blink & WebKit.
 * 2. Unattached DOM <a> elements being blocked or ignored in Firefox and Safari.
 * 3. Chromium top-frame 2MB limit on base64 Data URLs (ERR_INVALID_URL) and
 *    WebKit ignoring the download attribute on Data URLs.
 * 4. Uint8Array buffer slice offsets when passing pdfBytes.buffer as ArrayBuffer.
 */

export function dataUrlToBlob(dataUrl: string): Blob {
  try {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const isBase64 = parts[0].includes(';base64');

    if (isBase64) {
      const byteString = atob(parts[1]);
      const u8arr = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        u8arr[i] = byteString.charCodeAt(i);
      }
      return new Blob([u8arr], { type: mime });
    } else {
      const decoded = decodeURIComponent(parts[1]);
      return new Blob([decoded], { type: mime });
    }
  } catch (err) {
    console.warn('Failed to convert dataUrl to Blob, falling back to raw octet blob:', err);
    return new Blob([], { type: 'application/octet-stream' });
  }
}

export function triggerBrowserDownload(
  payload: string | Blob | Uint8Array,
  fileName: string,
  fallbackMimeType: string = 'application/octet-stream'
): void {
  if (typeof window === 'undefined') return;

  let blobUrl = '';
  let shouldRevoke = false;

  try {
    if (payload instanceof Blob) {
      blobUrl = URL.createObjectURL(payload);
      shouldRevoke = true;
    } else if (payload instanceof Uint8Array) {
      const blob = new Blob([new Uint8Array(payload)], { type: fallbackMimeType });
      blobUrl = URL.createObjectURL(blob);
      shouldRevoke = true;
    } else if (typeof payload === 'string' && payload.startsWith('data:')) {
      const blob = dataUrlToBlob(payload);
      blobUrl = URL.createObjectURL(blob);
      shouldRevoke = true;
    } else if (typeof payload === 'string') {
      blobUrl = payload;
      shouldRevoke = false;
    } else {
      return;
    }

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = blobUrl;
    link.download = fileName;
    link.setAttribute('download', fileName);
    link.rel = 'noopener noreferrer';

    document.body.appendChild(link);
    link.click();

    // 60-second retention window ensures high-latency mobile download managers
    // have established their data streams before memory is reclaimed.
    setTimeout(() => {
      try {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        if (shouldRevoke && blobUrl.startsWith('blob:')) {
          URL.revokeObjectURL(blobUrl);
        }
      } catch {
        // Safe ignore
      }
    }, 60000);
  } catch (error) {
    console.error('Download trigger failed:', error);
    if (typeof payload === 'string' && !payload.startsWith('data:')) {
      window.location.href = payload;
    }
  }
}

