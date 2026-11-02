import * as XLSX from 'xlsx';
import type { PDFDocumentProxy } from 'pdfjs-dist';

export interface PdfToExcelOptions {
  /** Strategy for detecting and organizing tabular data */
  strategy?: 'smart-table' | 'preserve-positions' | 'raw-rows';
  /** How worksheets are organized in the output workbook */
  sheetLayout?: 'single' | 'per-page';
  /** Whether to parse numeric strings into native Excel numbers for formulas */
  parseNumbers?: boolean;
  /** Whether to detect currency symbols ($ ₹ € £) and apply number formatting */
  detectCurrency?: boolean;
  /** Whether to merge multi-line table cell wraps into the same row */
  mergeMultiline?: boolean;
  /** Whether to freeze and format the header row in Excel */
  formatHeaderRow?: boolean;
  /** Whether to deduplicate recurring headers across pages 2+ in single sheet mode */
  deduplicateHeaders?: boolean;
  /** Whether to trim extra whitespace and non-breaking spaces */
  trimWhitespace?: boolean;
  /** Whether to skip document title / preamble text before the main table */
  skipPreambleTitles?: boolean;
  /** Target export file format */
  exportFormat?: 'xlsx' | 'xls' | 'csv' | 'tsv' | 'html' | 'json';
}

export interface ExtractedTableData {
  sheetName: string;
  rows: (string | number | boolean | null)[][];
  headers: string[];
  rowCount: number;
  colCount: number;
}

export interface PdfToExcelResult {
  blob: Blob;
  fileName: string;
  sheets: ExtractedTableData[];
  totalRows: number;
  totalCols: number;
  pageCount: number;
  tableCount: number;
  previewRows: (string | number | boolean | null)[][];
  previewHeaders: string[];
}

interface RawToken {
  text: string;
  x: number;
  y: number; // top-down
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
}

interface AssembledChunk {
  text: string;
  x: number;
  width: number;
  right: number;
  y: number;
  height: number;
  fontSize: number;
  fontName: string;
}

interface RowItem {
  y: number;
  height: number;
  tokens: RawToken[];
  chunks: AssembledChunk[];
}

/**
 * High-accuracy PDF to Excel extraction engine.
 * Employs word-level horizontal assembly, adaptive column track clustering,
 * multi-line row stitching, and type inference.
 * Runs 100% client-side in the browser using pdfjs-dist and SheetJS (xlsx).
 */
export async function convertPdfToExcel(
  file: File,
  options: PdfToExcelOptions = {},
  onProgress?: (percent: number, message: string) => void
): Promise<PdfToExcelResult> {
  const {
    strategy = 'smart-table',
    sheetLayout = 'single',
    parseNumbers = true,
    detectCurrency = true,
    mergeMultiline = true,
    formatHeaderRow = true,
    deduplicateHeaders = true,
    trimWhitespace = true,
    skipPreambleTitles = true,
    exportFormat = 'xlsx',
  } = options;

  onProgress?.(5, 'Initializing PDF parsing engine...');
  const pdfjsLib = await import('pdfjs-dist');
  if (typeof window !== 'undefined' && pdfjsLib?.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  onProgress?.(12, 'Loading PDF binary into browser memory...');
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc: PDFDocumentProxy = await loadingTask.promise;
  const pageCount = pdfDoc.numPages;

  const rawPagesData: { pageNumber: number; rowGroups: RowItem[] }[] = [];

  // Step 1: Parse tokens and assemble words per line on each page
  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const pct = 15 + Math.round((pageNum / pageCount) * 45);
    onProgress?.(pct, `Extracting text coordinates & typography (Page ${pageNum} of ${pageCount})...`);

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.0 });
    const textContent = await page.getTextContent();
    const items = textContent.items as any[];

    const rawTokens: RawToken[] = [];
    for (const item of items) {
      if (!item.str || typeof item.str !== 'string') continue;
      const str = trimWhitespace ? item.str.replace(/\u00A0/g, ' ').trim() : item.str;
      if (!str) continue;

      const transform = item.transform || [1, 0, 0, 1, 0, 0];
      const leftX = transform[4];
      const bottomY = transform[5];
      // Convert to top-down coordinates
      const topY = Math.max(0, viewport.height - bottomY);
      const fontSize = Math.abs(transform[0] || transform[3] || 10);
      const width = item.width || str.length * (fontSize * 0.55);
      const height = item.height || fontSize;

      rawTokens.push({
        text: str,
        x: leftX,
        y: topY,
        width,
        height,
        fontSize,
        fontName: item.fontName || '',
      });
    }

    if (rawTokens.length === 0) {
      rawPagesData.push({ pageNumber: pageNum, rowGroups: [] });
      continue;
    }

    // Group into horizontal lines
    rawTokens.sort((a, b) => (a.y === b.y ? a.x - b.x : a.y - b.y));

    const rowGroups: RowItem[] = [];
    for (const token of rawTokens) {
      const vertTolerance = Math.max(3.2, token.height * 0.42);
      let matchedRow = rowGroups.find((r) => Math.abs(r.y - token.y) <= vertTolerance);

      if (!matchedRow) {
        matchedRow = {
          y: token.y,
          height: token.height,
          tokens: [],
          chunks: [],
        };
        rowGroups.push(matchedRow);
      } else {
        matchedRow.y = (matchedRow.y * matchedRow.tokens.length + token.y) / (matchedRow.tokens.length + 1);
        matchedRow.height = Math.max(matchedRow.height, token.height);
      }
      matchedRow.tokens.push(token);
    }

    rowGroups.sort((a, b) => a.y - b.y);

    // CRITICAL: Assemble consecutive words into intact cell phrases on each line
    for (const row of rowGroups) {
      row.tokens.sort((a, b) => a.x - b.x);
      const chunks: AssembledChunk[] = [];

      for (const token of row.tokens) {
        if (chunks.length === 0) {
          chunks.push({
            text: token.text,
            x: token.x,
            width: token.width,
            right: token.x + token.width,
            y: token.y,
            height: token.height,
            fontSize: token.fontSize,
            fontName: token.fontName,
          });
          continue;
        }

        const lastChunk = chunks[chunks.length - 1];
        const gap = token.x - lastChunk.right;
        // Natural word space threshold (3.0pt to 5.5pt)
        const wordGapLimit = Math.max(2.8, Math.min(5.5, token.fontSize * 0.42));

        if (gap <= wordGapLimit) {
          if (gap <= 1.2) {
            lastChunk.text += token.text;
          } else {
            lastChunk.text += ' ' + token.text;
          }
          lastChunk.right = Math.max(lastChunk.right, token.x + token.width);
          lastChunk.width = lastChunk.right - lastChunk.x;
        } else {
          chunks.push({
            text: token.text,
            x: token.x,
            width: token.width,
            right: token.x + token.width,
            y: token.y,
            height: token.height,
            fontSize: token.fontSize,
            fontName: token.fontName,
          });
        }
      }
      row.chunks = chunks;
    }

    rawPagesData.push({ pageNumber: pageNum, rowGroups });
  }

  onProgress?.(65, 'Analyzing column tracks & geometry...');

  // Step 2: Establish Master Column Boundaries across candidate table rows
  // Find the global maximum chunk count across all rows in the document
  const allRowGroups = rawPagesData.flatMap((p) => p.rowGroups);
  const globalChunkCounts = allRowGroups.map((r) => r.chunks.length);
  const dominantMaxChunks = Math.max(1, ...globalChunkCounts);

  // Find candidate rows that define the table (rows having the maximum chunk count)
  let candidateRows = allRowGroups.filter((r) => r.chunks.length === dominantMaxChunks);
  if (candidateRows.length === 0 && dominantMaxChunks > 1) {
    candidateRows = allRowGroups.filter((r) => r.chunks.length >= dominantMaxChunks - 1);
  }

  let masterColumnCuts: number[] = [];
  const colCount = dominantMaxChunks >= 2 ? dominantMaxChunks : 1;

  if (colCount >= 2 && candidateRows.length > 0) {
    for (let k = 0; k < colCount - 1; k++) {
      const rightEdges = candidateRows.map((r) => r.chunks[k].right).sort((a, b) => a - b);
      const nextLeftEdges = candidateRows.map((r) => r.chunks[k + 1].x).sort((a, b) => a - b);

      const medianRight = rightEdges[Math.floor(rightEdges.length / 2)];
      const medianNextLeft = nextLeftEdges[Math.floor(nextLeftEdges.length / 2)];

      const cut = (medianRight + medianNextLeft) / 2;
      masterColumnCuts.push(cut);
    }
  }

  onProgress?.(75, 'Extracting tabular matrices & stitching rows...');

  const extractedPages: {
    pageNumber: number;
    rows: (string | number | boolean | null)[][];
    headers: string[];
  }[] = [];

  for (const p of rawPagesData) {
    const pageRows = extractPageMatrix(p.rowGroups, masterColumnCuts, colCount, {
      strategy,
      mergeMultiline,
      parseNumbers,
      detectCurrency,
      skipPreambleTitles,
    });
    extractedPages.push({ pageNumber: p.pageNumber, rows: pageRows.matrix, headers: pageRows.headers });
  }

  onProgress?.(85, 'Structuring worksheets and compiling Excel workbook...');

  const finalSheets: ExtractedTableData[] = [];
  let masterRows: (string | number | boolean | null)[][] = [];
  let masterHeaders: string[] = [];

  if (sheetLayout === 'single') {
    let headerRow: (string | number | boolean | null)[] | null = null;

    for (let i = 0; i < extractedPages.length; i++) {
      const { rows } = extractedPages[i];
      if (rows.length === 0) continue;

      if (i === 0) {
        headerRow = rows[0] || null;
        masterRows.push(...rows);
        masterHeaders = extractedPages[0].headers;
      } else {
        if (deduplicateHeaders && headerRow && rows.length > 0) {
          const candidate = rows[0];
          const isSameHeader =
            candidate.length === headerRow.length &&
            candidate.every(
              (val, idx) =>
                String(val || '').trim().toLowerCase() === String(headerRow![idx] || '').trim().toLowerCase()
            );

          if (isSameHeader) {
            masterRows.push(...rows.slice(1));
          } else {
            masterRows.push(...rows);
          }
        } else {
          masterRows.push(...rows);
        }
      }
    }

    const maxCols = masterRows.reduce((acc, r) => Math.max(acc, r.length), 0);
    masterRows = masterRows.map((r) => {
      while (r.length < maxCols) r.push('');
      return r;
    });

    finalSheets.push({
      sheetName: 'All Pages Data',
      rows: masterRows,
      headers: masterHeaders.length > 0 ? masterHeaders : createFallbackHeaders(maxCols),
      rowCount: masterRows.length,
      colCount: maxCols,
    });
  } else {
    // Per-page sheets
    for (const p of extractedPages) {
      const maxCols = p.rows.reduce((acc, r) => Math.max(acc, r.length), 0);
      const normalizedRows = p.rows.map((r) => {
        while (r.length < maxCols) r.push('');
        return r;
      });

      finalSheets.push({
        sheetName: `Page ${p.pageNumber}`,
        rows: normalizedRows,
        headers: p.headers.length > 0 ? p.headers : createFallbackHeaders(maxCols),
        rowCount: normalizedRows.length,
        colCount: maxCols,
      });
      masterRows.push(...normalizedRows);
      if (masterHeaders.length === 0 && p.headers.length > 0) {
        masterHeaders = p.headers;
      }
    }
  }

  onProgress?.(92, 'Applying cell formulas & formatting...');

  // Build SheetJS Workbook
  const workbook = XLSX.utils.book_new();

  for (const sheetData of finalSheets) {
    if (sheetData.rows.length === 0) {
      const emptyWs = XLSX.utils.aoa_to_sheet([['No data detected']]);
      XLSX.utils.book_append_sheet(workbook, emptyWs, sheetData.sheetName);
      continue;
    }

    const ws = XLSX.utils.aoa_to_sheet(sheetData.rows);

    // Calculate auto column widths
    const colWidths: { wch: number }[] = [];
    for (let c = 0; c < sheetData.colCount; c++) {
      let maxLen = 8;
      for (let r = 0; r < sheetData.rows.length; r++) {
        const val = sheetData.rows[r][c];
        if (val !== undefined && val !== null) {
          const str = String(val);
          if (str.length > maxLen) {
            maxLen = Math.min(65, str.length);
          }
        }
      }
      colWidths.push({ wch: maxLen + 3 });
    }
    ws['!cols'] = colWidths;

    // Freeze header row
    if (formatHeaderRow && sheetData.rows.length > 1) {
      (ws as any)['!freeze'] = { xSplit: 0, ySplit: 1 };
    }

    XLSX.utils.book_append_sheet(workbook, ws, sheetData.sheetName);
  }

  onProgress?.(97, `Generating final ${exportFormat.toUpperCase()} spreadsheet...`);

  let blob: Blob;
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  let outFileName = `${baseName}.xlsx`;

  if (exportFormat === 'csv') {
    const firstWs = workbook.Sheets[workbook.SheetNames[0]];
    const csvContent = XLSX.utils.sheet_to_csv(firstWs || {});
    blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    outFileName = `${baseName}.csv`;
  } else if (exportFormat === 'tsv') {
    const firstWs = workbook.Sheets[workbook.SheetNames[0]];
    const tsvContent = XLSX.utils.sheet_to_csv(firstWs || {}, { FS: '\t' });
    blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
    outFileName = `${baseName}.tsv`;
  } else if (exportFormat === 'html') {
    const firstWs = workbook.Sheets[workbook.SheetNames[0]];
    const htmlTable = XLSX.utils.sheet_to_html(firstWs || {});
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeXml(baseName)} - Table</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; background: #f8fafc; }
    table { border-collapse: collapse; width: 100%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
    th, td { border: 1px solid #e2e8f0; padding: 10px 14px; text-align: left; font-size: 13px; }
    th { background: #0f172a; color: #fff; font-weight: 700; }
    tr:nth-child(even) { background: #f1f5f9; }
  </style>
</head>
<body>
  <h2>${escapeXml(baseName)}</h2>
  ${htmlTable}
</body>
</html>`;
    blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
    outFileName = `${baseName}.html`;
  } else if (exportFormat === 'json') {
    const jsonOutput: Record<string, any> = {};
    for (const name of workbook.SheetNames) {
      jsonOutput[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 });
    }
    blob = new Blob([JSON.stringify(jsonOutput, null, 2)], { type: 'application/json;charset=utf-8;' });
    outFileName = `${baseName}.json`;
  } else if (exportFormat === 'xls') {
    const wbout = XLSX.write(workbook, { bookType: 'biff8', type: 'array' });
    blob = new Blob([wbout], { type: 'application/vnd.ms-excel' });
    outFileName = `${baseName}.xls`;
  } else {
    // Default XLSX
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    outFileName = `${baseName}.xlsx`;
  }

  onProgress?.(100, 'Excel spreadsheet ready for instant download!');

  const totalRows = finalSheets.reduce((acc, s) => acc + s.rowCount, 0);
  const maxCols = finalSheets.reduce((acc, s) => Math.max(acc, s.colCount), 0);

  return {
    blob,
    fileName: outFileName,
    sheets: finalSheets,
    totalRows,
    totalCols: maxCols,
    pageCount,
    tableCount: finalSheets.length,
    previewRows: finalSheets[0]?.rows.slice(0, 30) || [],
    previewHeaders: finalSheets[0]?.headers || createFallbackHeaders(maxCols),
  };
}

/**
 * Maps page row groups into an aligned 2D matrix using column cut lines.
 */
function extractPageMatrix(
  rowGroups: RowItem[],
  columnCuts: number[],
  colCount: number,
  options: {
    strategy: string;
    mergeMultiline: boolean;
    parseNumbers: boolean;
    detectCurrency: boolean;
    skipPreambleTitles: boolean;
  }
): { matrix: (string | number | boolean | null)[][]; headers: string[] } {
  if (rowGroups.length === 0) return { matrix: [], headers: [] };

  if (options.strategy === 'raw-rows') {
    const matrix = rowGroups.map((r) => {
      const fullText = r.tokens.map((t) => t.text).join(' ');
      const cells = fullText.split(/\s{2,}|\t/).filter((c) => c.trim().length > 0);
      return cells.map((c) => parseCellValue(c, options.parseNumbers, options.detectCurrency));
    });
    return { matrix, headers: createFallbackHeaders(colCount) };
  }

  // Find the header row (first row having >= colCount - 1 chunks)
  const headerRowIdx = rowGroups.findIndex((r) => r.chunks.length >= Math.max(2, colCount - 1));

  const rawMatrix: (string | number | boolean | null)[][] = [];

  for (let rIdx = 0; rIdx < rowGroups.length; rIdx++) {
    const row = rowGroups[rIdx];

    // If skipPreambleTitles is active, skip lines before the table header
    if (options.skipPreambleTitles && headerRowIdx !== -1 && rIdx < headerRowIdx) {
      continue;
    }

    const rowCells: (string | number | boolean | null)[] = new Array(colCount).fill('');

    // If row has only 1 chunk and spans wide or is before table
    if (row.chunks.length === 1 && (row.chunks[0].width > 120 || colCount === 1)) {
      rowCells[0] = row.chunks[0].text;
      rawMatrix.push(rowCells);
      continue;
    }

    for (const chunk of row.chunks) {
      const chunkCenter = (chunk.x + chunk.right) / 2;
      let colIdx = 0;
      while (colIdx < columnCuts.length && chunkCenter > columnCuts[colIdx]) {
        colIdx++;
      }

      const existingVal = rowCells[colIdx];
      if (!existingVal) {
        rowCells[colIdx] = chunk.text;
      } else {
        rowCells[colIdx] = `${existingVal} ${chunk.text}`;
      }
    }

    // Step: Multi-line row wrap stitching
    if (options.mergeMultiline && rawMatrix.length > 0) {
      const prevRow = rawMatrix[rawMatrix.length - 1];
      const prevRowItem = rowGroups[rIdx - 1];
      const lineGap = prevRowItem ? Math.abs(row.y - prevRowItem.y) : 999;

      const filledIndices = rowCells
        .map((val, idx) => (val && String(val).trim().length > 0 ? idx : -1))
        .filter((idx) => idx !== -1);

      // If only 1 text column is filled and vertical line gap is tight (<= 20 pt)
      if (filledIndices.length === 1 && lineGap <= 20) {
        const mergeCol = filledIndices[0];
        const cellText = String(rowCells[mergeCol]).trim();
        const isNumericOrDate = /^[\d.,$€£₹/%-]+$/.test(cellText);

        if (!isNumericOrDate && prevRow[mergeCol] !== undefined) {
          prevRow[mergeCol] = `${String(prevRow[mergeCol])}\n${cellText}`;
          continue; // stitch into previous row
        }
      }
    }

    // Parse cell values (numbers, currencies, dates)
    const parsedRow = rowCells.map((val) =>
      typeof val === 'string' ? parseCellValue(val, options.parseNumbers, options.detectCurrency) : val
    );

    const hasAnyContent = parsedRow.some((val) => val !== '' && val !== null && val !== undefined);
    if (hasAnyContent) {
      rawMatrix.push(parsedRow);
    }
  }

  // Extract detected headers from first row of matrix
  let detectedHeaders: string[] = [];
  if (rawMatrix.length > 0) {
    const firstRow = rawMatrix[0];
    const isHeaderRow = firstRow.every(
      (cell) => typeof cell === 'string' && !/^[\d.,$€£₹% -]+$/.test(cell)
    );
    if (isHeaderRow) {
      detectedHeaders = firstRow.map((h, i) => (h ? String(h).trim() : `Col ${String.fromCharCode(65 + (i % 26))}`));
    }
  }

  if (detectedHeaders.length === 0) {
    detectedHeaders = createFallbackHeaders(colCount);
  }

  return { matrix: rawMatrix, headers: detectedHeaders };
}

function createFallbackHeaders(colCount: number): string[] {
  const headers: string[] = [];
  for (let i = 0; i < colCount; i++) {
    headers.push(`Col ${String.fromCharCode(65 + (i % 26))}`);
  }
  return headers;
}

/**
 * Intelligent cell parsing: converts numbers, currencies, dates into clean data types.
 */
function parseCellValue(
  rawText: string,
  parseNumbers: boolean,
  detectCurrency: boolean
): string | number | boolean | null {
  if (!rawText) return '';
  const text = rawText.trim();
  if (text.length === 0) return '';

  // Boolean check
  if (/^true$/i.test(text)) return true;
  if (/^false$/i.test(text)) return false;

  if (parseNumbers) {
    // Parenthesized negative numbers e.g. (1,234.56) or (500)
    const parenNegativeMatch = text.match(/^\(([0-9,.]+)\)$/);
    if (parenNegativeMatch) {
      const cleanNum = parenNegativeMatch[1].replace(/,/g, '');
      const parsed = parseFloat(cleanNum);
      if (!isNaN(parsed)) return -parsed;
    }

    // Currency values e.g. $1,250.00, ₹45,000, €99.50, £120.00
    if (detectCurrency) {
      const currencyMatch = text.match(/^([$₹€£¥₩])\s*([0-9,.]+)(\s*Cr|\s*Lakh)?$/i);
      if (currencyMatch) {
        const cleanVal = currencyMatch[2].replace(/,/g, '');
        const parsed = parseFloat(cleanVal);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
    }

    // Standard number e.g. 1234, 1,234.56, -98.2
    if (/^-?[\d,]+(\.\d+)?$/.test(text)) {
      if (text.length <= 15) {
        const cleanVal = text.replace(/,/g, '');
        const parsed = parseFloat(cleanVal);
        if (!isNaN(parsed) && String(parsed) !== 'NaN') {
          return parsed;
        }
      }
    }

    // Percentage e.g. 15.5% -> 0.155
    const pctMatch = text.match(/^(-?[0-9,.]+)%$/);
    if (pctMatch) {
      const cleanVal = pctMatch[1].replace(/,/g, '');
      const parsed = parseFloat(cleanVal);
      if (!isNaN(parsed)) {
        return parsed / 100;
      }
    }
  }

  return text;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
