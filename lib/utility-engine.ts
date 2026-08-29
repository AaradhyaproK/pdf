import QRCode from 'qrcode';

export interface TextAnalysisResult {
  words: number;
  charactersWithSpaces: number;
  charactersWithoutSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  topKeywords: { word: string; count: number; densityPercentage: number }[];
}

/**
 * Generates dynamic QR Code data URL with custom foreground/background colors and optional logo overlay.
 */
export async function generateQRCodeDataUrl(
  text: string,
  options?: {
    fgColor?: string;
    bgColor?: string;
    logoUrl?: string;
    width?: number;
  }
): Promise<string> {
  const width = options?.width || 400;
  const fgColor = options?.fgColor || '#000000';
  const bgColor = options?.bgColor || '#ffffff';

  const baseDataUrl = await QRCode.toDataURL(text, {
    width,
    margin: 2,
    color: {
      dark: fgColor,
      light: bgColor,
    },
    errorCorrectionLevel: options?.logoUrl ? 'H' : 'M',
  });

  if (!options?.logoUrl) {
    return baseDataUrl;
  }

  // Draw logo image in center of QR canvas
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = width;
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve(baseDataUrl);

    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 0, 0, width, width);

      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.onload = () => {
        const logoSize = width * 0.22;
        const logoX = (width - logoSize) / 2;
        const logoY = (width - logoSize) / 2;

        // Draw white background backing for logo
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.arc(width / 2, width / 2, logoSize / 2 + 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
        resolve(canvas.toDataURL('image/png'));
      };
      logoImg.onerror = () => resolve(baseDataUrl);
      logoImg.src = options.logoUrl!;
    };
    qrImg.src = baseDataUrl;
  });
}

/**
 * Generates clean vector SVG string for QR Code.
 */
export async function generateQRCodeSVG(
  text: string,
  options?: { fgColor?: string; bgColor?: string }
): Promise<string> {
  return await QRCode.toString(text, {
    type: 'svg',
    margin: 2,
    color: {
      dark: options?.fgColor || '#000000',
      light: options?.bgColor || '#ffffff',
    },
  });
}

/**
 * Computes word count, character metrics, reading speed, and keyword density.
 */
export function analyzeTextMetrics(text: string): TextAnalysisResult {
  if (!text || text.trim().length === 0) {
    return {
      words: 0,
      charactersWithSpaces: 0,
      charactersWithoutSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
      topKeywords: [],
    };
  }

  const cleanText = text.trim();
  const wordsArray = cleanText.match(/\b[a-zA-Z0-9'-]+\b/g) || [];
  const words = wordsArray.length;
  const charactersWithSpaces = cleanText.length;
  const charactersWithoutSpaces = cleanText.replace(/\s+/g, '').length;
  const sentences = (cleanText.match(/[^.!?]+[.!?]+/g) || []).length || 1;
  const paragraphs = cleanText.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  const readingTimeMinutes = Math.ceil(words / 200);
  const speakingTimeMinutes = Math.ceil(words / 130);

  // Keyword density
  const freqMap: Record<string, number> = {};
  const stopWords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'is', 'was', 'are', 'an', 'or', 'we', 'my']);

  for (const word of wordsArray) {
    const lower = word.toLowerCase();
    if (lower.length > 2 && !stopWords.has(lower)) {
      freqMap[lower] = (freqMap[lower] || 0) + 1;
    }
  }

  const topKeywords = Object.entries(freqMap)
    .map(([word, count]) => ({
      word,
      count,
      densityPercentage: Math.round((count / (words || 1)) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    words,
    charactersWithSpaces,
    charactersWithoutSpaces,
    sentences,
    paragraphs,
    readingTimeMinutes,
    speakingTimeMinutes,
    topKeywords,
  };
}

/**
 * Processes JSON string: format, minify, validate, or convert to CSV/YAML.
 */
export function processJSON(
  input: string,
  action: 'format2' | 'format4' | 'minify' | 'to-csv' | 'to-yaml'
): { result: string; isValid: boolean; error?: string } {
  try {
    const parsed = JSON.parse(input);

    if (action === 'format2') {
      return { result: JSON.stringify(parsed, null, 2), isValid: true };
    }
    if (action === 'format4') {
      return { result: JSON.stringify(parsed, null, 4), isValid: true };
    }
    if (action === 'minify') {
      return { result: JSON.stringify(parsed), isValid: true };
    }
    if (action === 'to-csv') {
      return { result: jsonToCSV(parsed), isValid: true };
    }
    if (action === 'to-yaml') {
      return { result: jsonToYAML(parsed), isValid: true };
    }

    return { result: JSON.stringify(parsed, null, 2), isValid: true };
  } catch (err: any) {
    return {
      result: '',
      isValid: false,
      error: err?.message || 'Invalid JSON syntax',
    };
  }
}

function jsonToCSV(obj: any): string {
  const array = Array.isArray(obj) ? obj : [obj];
  if (array.length === 0) return '';

  const headers = Array.from(
    new Set(array.flatMap((item) => (typeof item === 'object' && item !== null ? Object.keys(item) : ['value'])))
  );

  const csvRows = [headers.join(',')];

  for (const row of array) {
    if (typeof row !== 'object' || row === null) {
      csvRows.push(`"${String(row).replace(/"/g, '""')}"`);
    } else {
      const values = headers.map((header) => {
        const val = row[header];
        const strVal = val === undefined || val === null ? '' : typeof val === 'object' ? JSON.stringify(val) : String(val);
        return `"${strVal.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }
  }

  return csvRows.join('\n');
}

function jsonToYAML(obj: any, indentLevel = 0): string {
  const indent = ' '.repeat(indentLevel);
  let yamlStr = '';

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === 'object' && item !== null) {
        yamlStr += `${indent}-\n${jsonToYAML(item, indentLevel + 2)}`;
      } else {
        yamlStr += `${indent}- ${String(item)}\n`;
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === 'object' && val !== null) {
        yamlStr += `${indent}${key}:\n${jsonToYAML(val, indentLevel + 2)}`;
      } else {
        yamlStr += `${indent}${key}: ${String(val)}\n`;
      }
    }
  } else {
    yamlStr += `${indent}${String(obj)}\n`;
  }

  return yamlStr;
}
