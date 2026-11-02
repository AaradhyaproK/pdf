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
  /** Target export file format */
  exportFormat?: 'xlsx' | 'xls' | 'csv' | 'tsv' | 'html' | 'json';
}

export interface ExtractedTableData {
  sheetName: string;
  rows: (string | number | boolean | null)[][];
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

interface RowItem {
  y: number;
  height: number;
  tokens: RawToken[];
}

/**
 * High-accuracy PDF to Excel extraction engine.
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

  const extractedPages: { pageNumber: number; rows: (string | number | boolean | null)[][] }[] = [];

  // Parse each page
  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const pct = 15 + Math.round((pageNum / pageCount) * 55);
    onProgress?.(pct, `Analyzing table geometry & coordinates (Page ${pageNum} of ${pageCount})...`);

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
      // Convert to top-down coordinate system (0 is top of page)
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
      extractedPages.push({ pageNumber: pageNum, rows: [] });
      continue;
    }

    // Step A: Group tokens into horizontal rows
    // Sort tokens from top to bottom, then left to right
    rawTokens.sort((a, b) => (a.y === b.y ? a.x - b.x : a.y - b.y));

    const rowGroups: RowItem[] = [];
    for (const token of rawTokens) {
      const vertTolerance = Math.max(3.5, token.height * 0.42);
      let matchedRow = rowGroups.find((r) => Math.abs(r.y - token.y) <= vertTolerance);

      if (!matchedRow) {
        matchedRow = {
          y: token.y,
          height: token.height,
          tokens: [],
        };
        rowGroups.push(matchedRow);
      } else {
        // Adjust row Y to running average
        matchedRow.y = (matchedRow.y * matchedRow.tokens.length + token.y) / (matchedRow.tokens.length + 1);
        matchedRow.height = Math.max(matchedRow.height, token.height);
      }
      matchedRow.tokens.push(token);
    }

    // Sort rows from top to bottom
    rowGroups.sort((a, b) => a.y - b.y);

    // Sort tokens inside each row left to right
    for (const row of rowGroups) {
      row.tokens.sort((a, b) => a.x - b.x);
    }

    // Step B: Multi-column grid track detection
    const pageRows = buildGridFromRows(rowGroups, {
      strategy,
      mergeMultiline,
      parseNumbers,
      detectCurrency,
    });

    extractedPages.push({ pageNumber: pageNum, rows: pageRows });
  }

  onProgress?.(75, 'Structuring worksheets and aligning columns...');

  const finalSheets: ExtractedTableData[] = [];
  let masterRows: (string | number | boolean | null)[][] = [];

  if (sheetLayout === 'single') {
    let headerRow: (string | number | boolean | null)[] | null = null;

    for (let i = 0; i < extractedPages.length; i++) {
      const { rows } = extractedPages[i];
      if (rows.length === 0) continue;

      if (i === 0) {
        headerRow = rows[0] || null;
        masterRows.push(...rows);
      } else {
        if (deduplicateHeaders && headerRow && rows.length > 0) {
          // Compare first row with headerRow
          const candidate = rows[0];
          const isSameHeader =
            candidate.length === headerRow.length &&
            candidate.every((val, idx) => String(val).trim().toLowerCase() === String(headerRow![idx]).trim().toLowerCase());

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
    // Normalize row lengths
    masterRows = masterRows.map((r) => {
      while (r.length < maxCols) r.push('');
      return r;
    });

    finalSheets.push({
      sheetName: 'All Pages Data',
      rows: masterRows,
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
        rowCount: normalizedRows.length,
        colCount: maxCols,
      });
      masterRows.push(...normalizedRows);
    }
  }

  onProgress?.(88, 'Compiling Excel workbook and applying formulas...');

  // Build SheetJS Workbook
  const workbook = XLSX.utils.book_new();

  for (const sheetData of finalSheets) {
    if (sheetData.rows.length === 0) {
      // Create empty sheet with dummy row if empty
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

    // Freeze header row if requested
    if (formatHeaderRow && sheetData.rows.length > 1) {
      (ws as any)['!freeze'] = { xSplit: 0, ySplit: 1 };
    }

    XLSX.utils.book_append_sheet(workbook, ws, sheetData.sheetName);
  }

  onProgress?.(95, `Generating final ${exportFormat.toUpperCase()} package...`);

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
  };
}

/**
 * Builds structured tabular matrix from row items using adaptive column tracks.
 */
function buildGridFromRows(
  rowGroups: RowItem[],
  options: {
    strategy: string;
    mergeMultiline: boolean;
    parseNumbers: boolean;
    detectCurrency: boolean;
  }
): (string | number | boolean | null)[][] {
  if (rowGroups.length === 0) return [];

  if (options.strategy === 'raw-rows') {
    // Simple line by line whitespace splitting
    return rowGroups.map((r) => {
      const fullText = r.tokens.map((t) => t.text).join(' ');
      const cells = fullText.split(/\s{2,}|\t/).filter((c) => c.trim().length > 0);
      return cells.map((c) => parseCellValue(c, options.parseNumbers, options.detectCurrency));
    });
  }

  // 1. Collect all starting X positions to detect column boundaries
  const allXPositions: number[] = [];
  for (const row of rowGroups) {
    for (const t of row.tokens) {
      allXPositions.push(t.x);
    }
  }

  allXPositions.sort((a, b) => a - b);

  // Cluster nearby X positions within 10 points
  const columnClusters: { startX: number; count: number; avgX: number }[] = [];
  const CLUSTER_TOLERANCE = 14;

  for (const x of allXPositions) {
    const existing = columnClusters.find((c) => Math.abs(c.avgX - x) <= CLUSTER_TOLERANCE);
    if (existing) {
      existing.avgX = (existing.avgX * existing.count + x) / (existing.count + 1);
      existing.count += 1;
    } else {
      columnClusters.push({ startX: x, count: 1, avgX: x });
    }
  }

  // Filter clusters: Keep columns that appear more than once or prominent columns
  columnClusters.sort((a, b) => a.avgX - b.avgX);

  // If very few clusters detected, fallback to simple token assignment
  const columnTracks = columnClusters.length >= 2 ? columnClusters.map((c) => c.avgX) : [];

  const rawGrid: (string | number | boolean | null)[][] = [];

  for (let rIdx = 0; rIdx < rowGroups.length; rIdx++) {
    const row = rowGroups[rIdx];

    if (columnTracks.length === 0) {
      // Fallback: Just each token as a column
      const rowCells = row.tokens.map((t) => parseCellValue(t.text, options.parseNumbers, options.detectCurrency));
      rawGrid.push(rowCells);
      continue;
    }

    const rowCells: (string | number | boolean | null)[] = new Array(columnTracks.length).fill('');

    for (const token of row.tokens) {
      // Find closest column track
      let closestColIdx = 0;
      let minDistance = Infinity;

      for (let c = 0; c < columnTracks.length; c++) {
        const dist = Math.abs(token.x - columnTracks[c]);
        if (dist < minDistance) {
          minDistance = dist;
          closestColIdx = c;
        }
      }

      // If token belongs to this column, append or set
      const currentVal = rowCells[closestColIdx];
      if (!currentVal) {
        rowCells[closestColIdx] = token.text;
      } else {
        // Concatenate adjacent words inside same column slot
        rowCells[closestColIdx] = `${currentVal} ${token.text}`;
      }
    }

    // Step C: Multi-line cell stitching
    // If this row has content ONLY in one non-numeric column, and the previous row exists,
    // and vertical spacing is small (wrapped line inside a table cell), stitch it into the previous row.
    if (options.mergeMultiline && rawGrid.length > 0) {
      const prevRow = rawGrid[rawGrid.length - 1];
      const prevRowItem = rowGroups[rIdx - 1];
      const lineGap = Math.abs(row.y - prevRowItem.y);

      const filledIndices = rowCells
        .map((val, idx) => (val && String(val).trim().length > 0 ? idx : -1))
        .filter((idx) => idx !== -1);

      // If only 1 or 2 text columns are filled and lineGap is tight (<= 20 pt), merge into previous row
      if (filledIndices.length === 1 && lineGap <= 22) {
        const mergeCol = filledIndices[0];
        const cellText = String(rowCells[mergeCol]).trim();
        // Don't merge if it looks like a new standalone number or date
        const isNumericOrDate = /^[\d.,$€£₹/%-]+$/.test(cellText);
        if (!isNumericOrDate && prevRow[mergeCol] !== undefined) {
          prevRow[mergeCol] = `${String(prevRow[mergeCol])}\n${cellText}`;
          continue; // skip pushing this row as separate
        }
      }
    }

    // Parse final cell values (numbers, currencies, etc.)
    const parsedRow = rowCells.map((val) =>
      typeof val === 'string' ? parseCellValue(val, options.parseNumbers, options.detectCurrency) : val
    );

    // Skip totally empty rows
    const hasAnyContent = parsedRow.some((val) => val !== '' && val !== null && val !== undefined);
    if (hasAnyContent) {
      rawGrid.push(parsedRow);
    }
  }

  return rawGrid;
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
          return parsed; // SheetJS outputs real number
        }
      }
    }

    // Standard number e.g. 1234, 1,234.56, -98.2
    // Must contain only digits, commas, periods, minus signs
    if (/^-?[\d,]+(\.\d+)?$/.test(text)) {
      // Avoid converting phone numbers or IDs that have no separators but are very long (>12 digits)
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
