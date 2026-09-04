import type { PDFDocumentProxy } from 'pdfjs-dist';

export interface PdfToWordOptions {
  mode?: 'formatted' | 'clean-text';
  fontFamily?: 'Calibri' | 'Times New Roman' | 'Arial' | 'Aptos';
  includePageBreaks?: boolean;
}

export interface WordToPdfOptions {
  pageSize?: 'A4' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
  margin?: 'normal' | 'narrow' | 'wide';
  fontFamily?: 'Helvetica' | 'Times' | 'Courier';
  includePageNumbers?: boolean;
  pageNumberPosition?: 'bottom-center' | 'bottom-right';
}

interface TextItemObj {
  str: string;
  dir?: string;
  width?: number;
  height?: number;
  transform: number[]; // [scaleX, skewY, skewX, scaleY, transX, transY]
  fontName?: string;
  hasEOL?: boolean;
}

interface StructuredLine {
  y: number;
  minX: number;
  height: number;
  items: {
    text: string;
    x: number;
    fontSize: number;
    fontName: string;
    isBold: boolean;
    isItalic: boolean;
  }[];
}

interface StructuredPage {
  pageNumber: number;
  lines: StructuredLine[];
  bodyFontSize: number;
}

/**
 * Parses and converts a PDF file into an editable Microsoft Word (.docx) document
 * 100% client-side in the browser using pdfjs-dist and docx.
 */
export async function convertPdfToDocx(
  file: File,
  options: PdfToWordOptions = {},
  onProgress?: (percent: number, message: string) => void
): Promise<{ blob: Blob; wordCount: number; pageCount: number; previewHtml: string }> {
  const {
    mode = 'formatted',
    fontFamily = 'Calibri',
    includePageBreaks = true,
  } = options;

  onProgress?.(5, 'Loading PDF parser engine...');
  const pdfjsLib = await import('pdfjs-dist');
  if (typeof window !== 'undefined' && pdfjsLib?.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  const docxModule = await import('docx');
  const {
    Document,
    Paragraph,
    TextRun,
    HeadingLevel,
    Packer,
    PageBreak,
    AlignmentType,
  } = docxModule;

  onProgress?.(15, 'Reading PDF document data...');
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc: PDFDocumentProxy = await loadingTask.promise;
  const pageCount = pdfDoc.numPages;

  let totalWords = 0;
  const structuredPages: StructuredPage[] = [];
  const previewParagraphs: string[] = [];

  // Parse text layout per page
  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const percent = 15 + Math.round((pageNum / pageCount) * 55);
    onProgress?.(percent, `Extracting layout & typography (Page ${pageNum} of ${pageCount})...`);

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items as unknown as TextItemObj[];

    // Extract positioned tokens
    const rawTokens: {
      text: string;
      x: number;
      y: number;
      fontSize: number;
      fontName: string;
      isBold: boolean;
      isItalic: boolean;
    }[] = [];

    const fontSizeCounts: Record<number, number> = {};

    for (const item of items) {
      if (!item.str || item.str.trim() === '') continue;
      const text = item.str;
      const wordsInItem = text.trim().split(/\s+/).filter(Boolean).length;
      totalWords += wordsInItem;

      // Matrix: [a, b, c, d, tx, ty]
      const tx = item.transform[4];
      const ty = item.transform[5];
      const fontSize = Math.round(Math.hypot(item.transform[0], item.transform[1])) || 11;
      const fontName = item.fontName || '';
      const lowerFont = fontName.toLowerCase();
      const isBold = lowerFont.includes('bold') || lowerFont.includes('black') || lowerFont.includes('heavy') || lowerFont.includes('b');
      const isItalic = lowerFont.includes('italic') || lowerFont.includes('oblique') || lowerFont.includes('it');

      fontSizeCounts[fontSize] = (fontSizeCounts[fontSize] || 0) + 1;

      rawTokens.push({
        text,
        x: tx,
        y: ty,
        fontSize,
        fontName,
        isBold,
        isItalic,
      });
    }

    // Determine baseline body font size for this page
    let bodyFontSize = 11;
    let maxFreq = 0;
    for (const [sizeStr, count] of Object.entries(fontSizeCounts)) {
      if (count > maxFreq) {
        maxFreq = count;
        bodyFontSize = Number(sizeStr);
      }
    }

    // Group tokens into lines based on Y coordinate tolerance
    const lineThreshold = 4; // points
    const lines: StructuredLine[] = [];

    // Sort tokens primarily by Y descending (PDF coordinates start at bottom)
    // and secondarily by X ascending
    rawTokens.sort((a, b) => {
      if (Math.abs(a.y - b.y) <= lineThreshold) {
        return a.x - b.x;
      }
      return b.y - a.y;
    });

    for (const token of rawTokens) {
      // Find existing line with matching Y coordinate
      let matchedLine = lines.find((l) => Math.abs(l.y - token.y) <= lineThreshold);
      if (!matchedLine) {
        matchedLine = {
          y: token.y,
          minX: token.x,
          height: token.fontSize,
          items: [],
        };
        lines.push(matchedLine);
      } else {
        matchedLine.minX = Math.min(matchedLine.minX, token.x);
        matchedLine.height = Math.max(matchedLine.height, token.fontSize);
      }
      matchedLine.items.push(token);
    }

    // Re-sort lines from top to bottom (Y descending)
    lines.sort((a, b) => b.y - a.y);

    // Within each line, sort items by X ascending
    for (const line of lines) {
      line.items.sort((a, b) => a.x - b.x);
    }

    structuredPages.push({
      pageNumber: pageNum,
      lines,
      bodyFontSize: bodyFontSize || 11,
    });
  }

  onProgress?.(75, 'Constructing Word document model & headings...');

  // Build Word document sections and paragraphs
  const docxSectionsChildren: any[] = [];

  for (let pIdx = 0; pIdx < structuredPages.length; pIdx++) {
    const pageData = structuredPages[pIdx];
    const lines = pageData.lines;

    // Add page break if requested
    if (pIdx > 0 && includePageBreaks) {
      docxSectionsChildren.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );
    }

    if (lines.length === 0) {
      docxSectionsChildren.push(
        new Paragraph({
          children: [new TextRun({ text: '', font: fontFamily })],
        })
      );
      continue;
    }

    // Group lines into paragraphs
    // A new paragraph begins if:
    // 1. Vertical gap between lines > 1.6 * line height
    // 2. Significant change in font size (e.g. heading)
    // 3. Mode is 'clean-text' and sentence boundary
    let currentParaItems: {
      text: string;
      fontSize: number;
      isBold: boolean;
      isItalic: boolean;
    }[] = [];

    let lastLineY = lines[0].y;
    let lastLineHeight = lines[0].height;

    const flushParagraph = () => {
      if (currentParaItems.length === 0) return;

      // Check if this paragraph is a Heading
      const firstItem = currentParaItems[0];
      const paraText = currentParaItems.map((i) => i.text).join(' ').trim();
      if (!paraText) {
        currentParaItems = [];
        return;
      }

      // Collect preview text for UI
      if (previewParagraphs.length < 30) {
        previewParagraphs.push(paraText);
      }

      let headingLevel: any = undefined;
      const isLargeFont = firstItem.fontSize >= pageData.bodyFontSize + 4;
      const isShortLine = paraText.length < 100;

      if (mode === 'formatted' && isShortLine) {
        if (firstItem.fontSize >= pageData.bodyFontSize + 7) {
          headingLevel = HeadingLevel.HEADING_1;
        } else if (firstItem.fontSize >= pageData.bodyFontSize + 4) {
          headingLevel = HeadingLevel.HEADING_2;
        } else if (firstItem.fontSize >= pageData.bodyFontSize + 2 && firstItem.isBold) {
          headingLevel = HeadingLevel.HEADING_3;
        }
      }

      const textRuns: any[] = [];
      for (let i = 0; i < currentParaItems.length; i++) {
        const item = currentParaItems[i];
        const nextItem = currentParaItems[i + 1];
        // Add trailing space if needed
        const needsSpace =
          nextItem &&
          !item.text.endsWith(' ') &&
          !nextItem.text.startsWith(' ') &&
          !['.', ',', ';', ':', '!', '?', ')', ']', '}'].includes(nextItem.text[0]);

        textRuns.push(
          new TextRun({
            text: item.text + (needsSpace ? ' ' : ''),
            bold: mode === 'formatted' ? item.isBold : false,
            italics: mode === 'formatted' ? item.isItalic : false,
            size: (mode === 'formatted' ? item.fontSize : 11) * 2, // docx uses half-points
            font: fontFamily,
          })
        );
      }

      docxSectionsChildren.push(
        new Paragraph({
          heading: headingLevel,
          spacing: {
            before: headingLevel ? 200 : 80,
            after: headingLevel ? 120 : 80,
            line: 276, // 1.15 line spacing
          },
          children: textRuns,
        })
      );

      currentParaItems = [];
    };

    for (let l = 0; l < lines.length; l++) {
      const line = lines[l];
      const gap = lastLineY - line.y;
      const expectedLineGap = Math.max(lastLineHeight, line.height) * 1.6;

      if (l > 0 && gap > expectedLineGap) {
        // Significant gap, flush previous paragraph
        flushParagraph();
      }

      // Merge items within this line
      for (const token of line.items) {
        currentParaItems.push({
          text: token.text,
          fontSize: token.fontSize,
          isBold: token.isBold,
          isItalic: token.isItalic,
        });
      }

      lastLineY = line.y;
      lastLineHeight = line.height;
    }

    flushParagraph();
  }

  onProgress?.(90, 'Packaging Microsoft Word (.docx) archive...');

  const doc = new Document({
    creator: 'FileZenith PDF to Word Converter',
    description: 'Converted 100% privately in-browser with FileZenith',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch in dxa
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: docxSectionsChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  onProgress?.(100, 'Conversion completed successfully!');

  // Build a clean HTML preview snippet
  const previewHtml = previewParagraphs
    .map((p) => `<p style="margin-bottom: 0.75rem; line-height: 1.6; color: inherit;">${escapeHtml(p)}</p>`)
    .join('');

  return {
    blob,
    wordCount: totalWords,
    pageCount,
    previewHtml: previewHtml || '<p>Document parsed successfully.</p>',
  };
}

/**
 * Extracts preview HTML, raw text, and document statistics from a Word (.docx) file
 * using client-side mammoth.
 */
export async function extractDocxPreview(file: File): Promise<{
  html: string;
  rawText: string;
  wordCount: number;
  characterCount: number;
  paragraphCount: number;
}> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();

  const [htmlResult, textResult] = await Promise.all([
    mammoth.convertToHtml({ arrayBuffer }),
    mammoth.extractRawText({ arrayBuffer }),
  ]);

  const rawText = textResult.value.trim();
  const words = rawText ? rawText.split(/\s+/).filter(Boolean) : [];
  const paragraphs = rawText.split(/\n\s*\n/).filter(Boolean);

  return {
    html: htmlResult.value || '<p>No readable content found in Word document.</p>',
    rawText,
    wordCount: words.length,
    characterCount: rawText.length,
    paragraphCount: Math.max(1, paragraphs.length),
  };
}

/**
 * Converts a Word document (.docx) into a high-precision, printable PDF document
 * 100% client-side in the browser using mammoth and pdf-lib.
 */
export async function convertDocxToPdf(
  file: File,
  options: WordToPdfOptions = {},
  onProgress?: (percent: number, message: string) => void
): Promise<{ pdfBytes: Uint8Array; pageCount: number; wordCount: number }> {
  const {
    pageSize = 'A4',
    orientation = 'portrait',
    margin = 'normal',
    fontFamily = 'Helvetica',
    includePageNumbers = true,
    pageNumberPosition = 'bottom-center',
  } = options;

  onProgress?.(10, 'Parsing Word document structure...');
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();

  const textResult = await mammoth.extractRawText({ arrayBuffer });
  const rawContent = textResult.value;
  const words = rawContent ? rawContent.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  onProgress?.(25, 'Initializing PDF layout engine...');
  const { PDFDocument, rgb, StandardFonts, PageSizes } = await import('pdf-lib');
  const pdfDoc = await PDFDocument.create();

  // Determine standard font
  let fontRef = StandardFonts.Helvetica;
  let fontBoldRef = StandardFonts.HelveticaBold;
  if (fontFamily === 'Times') {
    fontRef = StandardFonts.TimesRoman;
    fontBoldRef = StandardFonts.TimesRomanBold;
  } else if (fontFamily === 'Courier') {
    fontRef = StandardFonts.Courier;
    fontBoldRef = StandardFonts.CourierBold;
  }

  const font = await pdfDoc.embedFont(fontRef);
  const fontBold = await pdfDoc.embedFont(fontBoldRef);

  // Dimensions
  let dimensions: [number, number] = PageSizes.A4;
  if (pageSize === 'Letter') {
    dimensions = PageSizes.Letter;
  } else if (pageSize === 'Legal') {
    dimensions = PageSizes.Legal;
  }

  let pageWidth = orientation === 'portrait' ? dimensions[0] : dimensions[1];
  let pageHeight = orientation === 'portrait' ? dimensions[1] : dimensions[0];

  // Margins in points (72pt = 1 inch)
  let marginSize = 54; // normal: 0.75 in
  if (margin === 'narrow') marginSize = 36; // 0.5 in
  if (margin === 'wide') marginSize = 72; // 1.0 in

  const contentWidth = pageWidth - marginSize * 2;
  const fontSize = 11;
  const lineHeight = 16;
  const headingFontSize = 16;
  const headingLineHeight = 22;

  // Split raw text into structural blocks (paragraphs)
  const paragraphs = rawContent.split(/\n+/).map((p) => p.trim()).filter(Boolean);

  onProgress?.(40, 'Laying out text and multi-page flow...');

  // Helper function to wrap text safely
  const wrapText = (text: string, maxW: number, activeFont: any, fSize: number): string[] => {
    const tokens = text.split(/\s+/);
    const resultLines: string[] = [];
    let currentLine = '';

    for (const token of tokens) {
      const candidate = currentLine ? `${currentLine} ${token}` : token;
      const width = safeMeasureText(activeFont, candidate, fSize);
      if (width <= maxW) {
        currentLine = candidate;
      } else {
        if (currentLine) {
          resultLines.push(currentLine);
        }
        currentLine = token;
      }
    }
    if (currentLine) {
      resultLines.push(currentLine);
    }
    return resultLines;
  };

  // Lay out lines across pages
  interface PageLine {
    text: string;
    isHeading: boolean;
    fSize: number;
    lHeight: number;
  }

  const pagesData: PageLine[][] = [];
  let currentPageLines: PageLine[] = [];
  let currentY = pageHeight - marginSize;
  const minY = marginSize + (includePageNumbers ? 25 : 0);

  const startNewPage = () => {
    if (currentPageLines.length > 0) {
      pagesData.push(currentPageLines);
      currentPageLines = [];
    }
    currentY = pageHeight - marginSize;
  };

  for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
    const para = paragraphs[pIdx];
    // Simple heuristic: short single lines with title-like or capitalized structure can be headings
    const isHeading =
      para.length < 80 &&
      (para.endsWith(':') || para === para.toUpperCase() || pIdx === 0 || para.startsWith('#'));

    const cleanPara = sanitizeWinAnsi(para.replace(/^#+\s*/, '')).trim();
    if (!cleanPara) continue;

    const activeFont = isHeading ? fontBold : font;
    const activeSize = isHeading ? headingFontSize : fontSize;
    const activeLineHeight = isHeading ? headingLineHeight : lineHeight;

    const wrapped = wrapText(cleanPara, contentWidth, activeFont, activeSize);

    // If paragraph won't fit at all and we're not at top of page, start new page
    if (currentY - wrapped.length * activeLineHeight < minY && currentPageLines.length > 0) {
      startNewPage();
    }

    for (const line of wrapped) {
      if (currentY - activeLineHeight < minY) {
        startNewPage();
      }

      currentPageLines.push({
        text: line,
        isHeading,
        fSize: activeSize,
        lHeight: activeLineHeight,
      });

      currentY -= activeLineHeight;
    }

    // Paragraph spacing
    currentY -= 6;
  }

  if (currentPageLines.length > 0) {
    pagesData.push(currentPageLines);
  }

  if (pagesData.length === 0) {
    // Empty document fallback
    pagesData.push([]);
  }

  const totalPages = pagesData.length;
  onProgress?.(70, `Rendering ${totalPages} high-resolution PDF pages...`);

  // Render to PDF document
  for (let i = 0; i < totalPages; i++) {
    const pageNum = i + 1;
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    let drawY = pageHeight - marginSize;

    const lines = pagesData[i];
    for (const line of lines) {
      drawY -= line.lHeight;
      const textFont = line.isHeading ? fontBold : font;
      const textColor = line.isHeading ? rgb(0.08, 0.12, 0.2) : rgb(0.15, 0.2, 0.28);

      safeDrawText(page, line.text, {
        x: marginSize,
        y: drawY,
        size: line.fSize,
        font: textFont,
        color: textColor,
      });
    }

    // Footer page number
    if (includePageNumbers) {
      const pageNumberText = `Page ${pageNum} of ${totalPages}`;
      const footerFontSize = 9;
      const footerFont = font;
      const textWidth = safeMeasureText(footerFont, pageNumberText, footerFontSize);

      let footerX = marginSize;
      if (pageNumberPosition === 'bottom-center') {
        footerX = (pageWidth - textWidth) / 2;
      } else if (pageNumberPosition === 'bottom-right') {
        footerX = pageWidth - marginSize - textWidth;
      }

      safeDrawText(page, pageNumberText, {
        x: footerX,
        y: marginSize / 2,
        size: footerFontSize,
        font: footerFont,
        color: rgb(0.45, 0.52, 0.62),
      });
    }
  }

  onProgress?.(90, 'Serializing PDF binary stream...');
  const pdfBytes = await pdfDoc.save();

  onProgress?.(100, 'Word to PDF conversion complete!');
  return {
    pdfBytes,
    pageCount: totalPages,
    wordCount,
  };
}

/**
 * Safely converts Unicode characters to WinAnsi compatible characters
 * to prevent pdf-lib from crashing on arrows (e.g. →), em-dashes, bullets, etc.
 */
function sanitizeWinAnsi(text: string): string {
  if (!text) return '';
  const s = text
    // Arrows
    .replace(/[\u2192\u279C\u27A1\u2794\u2799\u279B\u279F\u21D2\u27FE\u27FF]/g, '->')
    .replace(/[\u2190\u2B05\u21D0\u27FD]/g, '<-')
    .replace(/[\u2194\u21D4]/g, '<->')
    .replace(/[\u2191\u21D1]/g, '^')
    .replace(/[\u2193\u21D3]/g, 'v')
    // Quotes & apostrophes
    .replace(/[\u2018\u2019\u201A\u201B\u0060\u00B4\u02BC\u02BD]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F\u00AB\u00BB]/g, '"')
    // Dashes & hyphens
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g, '-')
    // Bullets & list symbols
    .replace(/[\u2022\u25CF\u25CB\u25E6\u25AA\u25AB\u2043\u2219\u22C5\u25BA\u25B6]/g, '-')
    // Ellipsis
    .replace(/\u2026/g, '...')
    // Math & symbols
    .replace(/\u00D7/g, 'x')
    .replace(/\u00F7/g, '/')
    .replace(/\u00B1/g, '+/-')
    .replace(/\u2260/g, '!=')
    .replace(/\u2264/g, '<=')
    .replace(/\u2265/g, '>=')
    .replace(/\u221E/g, 'inf')
    .replace(/\u221A/g, 'sqrt')
    .replace(/[\u2713\u2714]/g, '[OK]')
    .replace(/[\u2717\u2718]/g, '[X]')
    .replace(/\u2122/g, '(TM)')
    .replace(/\u00A9/g, '(C)')
    .replace(/\u00AE/g, '(R)')
    .replace(/\u00B0/g, ' deg ')
    // Spaces & tabs
    .replace(/\t/g, '    ')
    .replace(/[\u00A0\u2000-\u200B\u2028\u2029\uFEFF]/g, ' ');

  const WIN_ANSI_VALID_CODES = new Set([
    0x20AC, 0x201A, 0x0192, 0x201E, 0x2026, 0x2020, 0x2021, 0x02C6,
    0x2030, 0x0160, 0x2039, 0x0152, 0x017D, 0x2018, 0x2019, 0x201C,
    0x201D, 0x2022, 0x2013, 0x2014, 0x02DC, 0x2122, 0x0161, 0x203A,
    0x0153, 0x017E, 0x0178,
  ]);

  let clean = '';
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if ((code >= 32 && code <= 126) || code === 10 || code === 13) {
      clean += s[i];
    } else if (code >= 0xA0 && code <= 0xFF) {
      clean += s[i];
    } else if (WIN_ANSI_VALID_CODES.has(code)) {
      clean += s[i];
    } else {
      clean += ' ';
    }
  }

  return clean;
}

/**
 * Measures text width with fallback to prevent WinAnsi encoding crashes
 */
function safeMeasureText(font: any, text: string, fontSize: number): number {
  try {
    return font.widthOfTextAtSize(text, fontSize);
  } catch {
    const ascii = text.replace(/[^\x20-\x7E]/g, ' ');
    try {
      return font.widthOfTextAtSize(ascii, fontSize);
    } catch {
      return text.length * fontSize * 0.55;
    }
  }
}

/**
 * Draws text safely on page with fallback to pure ASCII if an unencodable character persists
 */
function safeDrawText(page: any, text: string, options: any) {
  try {
    page.drawText(text, options);
  } catch {
    const asciiFallback = text.replace(/[^\x20-\x7E]/g, ' ');
    try {
      page.drawText(asciiFallback, options);
    } catch {
      // Ignored if completely unrenderable
    }
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
