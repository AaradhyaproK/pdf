import JSZip from 'jszip';
import { convertPdfToDocx, convertDocxToPdf } from '@/lib/pdf-word-engine';
import * as XLSX from 'xlsx';
import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';

/**
 * Converts an Apple Pages (.pages) file to Microsoft Word (.docx) 100% client-side.
 * Discovers embedded QuickLook vector PDF or extracts XML/text tokens,
 * then packages into a standard Word (.docx) document.
 */
export async function convertPagesToDocx(
  file: File,
  onProgress?: (percent: number, message: string) => void
): Promise<{ blob: Blob; wordCount: number; pageCount: number }> {
  onProgress?.(10, 'Unpacking Apple Pages archive...');
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);

  // 1. Check if original source document was embedded (e.g. from FileZenith Word to Pages)
  const sourceDocx = loadedZip.file('source/document.docx');
  if (sourceDocx) {
    onProgress?.(50, 'Restoring source Microsoft Word (.docx) document...');
    const docxBuf = await sourceDocx.async('uint8array');
    const blob = new Blob([docxBuf as any], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    onProgress?.(100, 'Pages to Word conversion complete!');
    return {
      blob,
      wordCount: 150,
      pageCount: 1,
    };
  }

  // 2. Check for embedded high-fidelity QuickLook Preview PDF (case-insensitive)
  const pdfKey = Object.keys(loadedZip.files).find((k) => /preview\.pdf$/i.test(k));
  if (pdfKey) {
    const pdfFileEntry = loadedZip.file(pdfKey);
    if (pdfFileEntry) {
      onProgress?.(30, 'Found Apple QuickLook preview stream. Extracting formatting...');
      const pdfBuffer = await pdfFileEntry.async('arraybuffer');
      const proxyFile = new File([pdfBuffer], file.name.replace(/\.pages$/i, '.pdf'), {
        type: 'application/pdf',
      });

      onProgress?.(50, 'Converting document to Microsoft Word (.docx)...');
      const result = await convertPdfToDocx(proxyFile, { mode: 'formatted' }, (p, msg) => {
        onProgress?.(50 + Math.round(p * 0.45), msg);
      });

      onProgress?.(100, 'Pages to Word conversion complete!');
      return {
        blob: result.blob,
        wordCount: result.wordCount,
        pageCount: result.pageCount,
      };
    }
  }

  // 3. Fallback: Check for index.xml or raw text storage
  onProgress?.(40, 'Parsing Pages document storage...');
  let extractedText = '';

  const indexXml = loadedZip.file('index.xml');
  if (indexXml) {
    const xmlContent = await indexXml.async('string');
    extractedText = xmlContent
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  if (!extractedText) {
    throw new Error(
      'Unable to extract text from this Pages document. The file may be password-protected or lacks an embedded preview. In the Pages app, you can also click File → Export To → Word.'
    );
  }

  onProgress?.(70, 'Compiling Microsoft Word document (.docx)...');
  const { Document, Paragraph, TextRun, Packer } = await import('docx');

  const paragraphs = extractedText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const doc = new Document({
    creator: 'FileZenith Pages to Word Converter',
    description: 'Converted 100% locally with FileZenith',
    sections: [
      {
        properties: {},
        children: paragraphs.map(
          (para) =>
            new Paragraph({
              spacing: { after: 120, line: 276 },
              children: [new TextRun({ text: para, font: 'Calibri', size: 22 })],
            })
        ),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const words = extractedText.split(/\s+/).filter(Boolean).length;

  onProgress?.(100, 'Pages to Word conversion complete!');
  return {
    blob,
    wordCount: words,
    pageCount: Math.max(1, Math.ceil(words / 350)),
  };
}

/**
 * Converts a Microsoft Word (.docx) file into an Apple Pages (.pages) document package.
 * Generates an Apple Pages container containing QuickLook/Preview.pdf and document metadata.
 */
export async function convertWordToPages(
  file: File,
  onProgress?: (percent: number, message: string) => void
): Promise<{ blob: Blob; pageCount: number; fileSizeKB: number }> {
  onProgress?.(15, 'Reading Microsoft Word document...');
  const arrayBuffer = await file.arrayBuffer();

  onProgress?.(35, 'Rendering high-resolution vector preview for Apple Pages...');
  const pdfResult = await convertDocxToPdf(file, { pageSize: 'A4', margin: 'normal' }, (pct, msg) => {
    onProgress?.(35 + Math.round(pct * 0.35), msg);
  });

  onProgress?.(75, 'Packaging Apple Pages (.pages) bundle...');
  const zip = new JSZip();

  // 1. Add QuickLook Preview PDF so Pages and macOS/iOS Finder render immediately
  zip.file('QuickLook/Preview.pdf', pdfResult.pdfBytes);

  // 2. Add document metadata & manifest
  const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<document-metadata xmlns="http://developer.apple.com/namespaces/sfa">
  <title>${escapeXml(file.name.replace(/\.[^/.]+$/, ''))}</title>
  <creator>FileZenith Word to Pages Converter</creator>
  <version>1.0</version>
</document-metadata>`;
  zip.file('metadata.xml', manifestXml);

  // 3. Store original docx structure for lossless round-tripping
  zip.file('source/document.docx', arrayBuffer);

  onProgress?.(90, 'Compressing Apple Pages package...');
  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/x-iwork-pages-sffpages',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  onProgress?.(100, 'Word to Pages conversion complete!');
  return {
    blob,
    pageCount: pdfResult.pageCount,
    fileSizeKB: Math.round(blob.size / 1024),
  };
}

/**
 * Converts an Apple Numbers (.numbers) spreadsheet file to Microsoft Excel (.xlsx) 100% client-side.
 * Uses SheetJS native Apple Numbers engine, internal Index unpacker, and QuickLook fallback
 * to accurately extract all tabular data, rows, and columns without dumping internal protobuf metadata.
 */
export async function convertNumbersToExcel(
  file: File,
  onProgress?: (percent: number, message: string) => void
): Promise<{ blob: Blob; rowCount: number; sheetCount: number }> {
  onProgress?.(10, 'Reading Apple Numbers spreadsheet...');
  const arrayBuffer = await file.arrayBuffer();

  let wb: XLSX.WorkBook | null = null;

  // Step 1: Direct parse with SheetJS native Numbers engine (handles modern & legacy Numbers with Index/Document.iwa)
  try {
    onProgress?.(25, 'Parsing Numbers spreadsheet data...');
    wb = XLSX.read(arrayBuffer, { type: 'array' });
  } catch (err) {
    console.info('Direct XLSX.read did not match, inspecting archive structure...', err);
  }

  // Step 2: If direct read failed or produced no sheets, inspect zip container
  if (!wb || !wb.SheetNames || wb.SheetNames.length === 0) {
    onProgress?.(35, 'Analyzing Numbers archive packages...');
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(arrayBuffer);

    // 2a. Check if original source spreadsheet was embedded (e.g. from FileZenith Excel to Numbers)
    const sourceXlsx = loadedZip.file('source/spreadsheet.xlsx');
    if (sourceXlsx) {
      const xlsxBuf = await sourceXlsx.async('arraybuffer');
      try {
        wb = XLSX.read(xlsxBuf, { type: 'array' });
      } catch (e) {
        console.warn('Could not read embedded source/spreadsheet.xlsx:', e);
      }
    }

    // 2b. Check if Index.zip exists inside the archive (modern single-file Numbers format)
    if (!wb || !wb.SheetNames || wb.SheetNames.length === 0) {
      const indexZipEntry = Object.keys(loadedZip.files).find((k) =>
        /(^|\/)Index\.zip$/i.test(k)
      );
      if (indexZipEntry) {
        onProgress?.(45, 'Unpacking internal Index data stream...');
        const indexZipData = await loadedZip.file(indexZipEntry)?.async('arraybuffer');
        if (indexZipData) {
          // Re-package files into standard structure with Index/ prefix expected by SheetJS
          const innerZip = new JSZip();
          const loadedInner = await innerZip.loadAsync(indexZipData);
          const repacked = new JSZip();
          for (const [relPath, f] of Object.entries(loadedInner.files)) {
            if (!f.dir) {
              const normPath = relPath.startsWith('Index/') ? relPath : `Index/${relPath}`;
              repacked.file(normPath, await f.async('uint8array'));
            }
          }
          const repackedBuf = await repacked.generateAsync({ type: 'arraybuffer' });
          try {
            wb = XLSX.read(repackedBuf, { type: 'array' });
          } catch (e) {
            console.warn('XLSX.read on repacked Index.zip failed:', e);
          }
        }
      }
    }

    // 2c. Check for any CSV data dumps inside Data/
    if (!wb || !wb.SheetNames || wb.SheetNames.length === 0) {
      const csvFiles = Object.keys(loadedZip.files).filter((k) => /\.csv$/i.test(k));
      if (csvFiles.length > 0) {
        onProgress?.(55, 'Extracting data tables from CSV streams...');
        wb = XLSX.utils.book_new();
        for (const csvKey of csvFiles) {
          const csvText = await loadedZip.file(csvKey)?.async('string');
          if (csvText) {
            const sheetName =
              csvKey.replace(/^.*[\\/]/, '').replace(/\.csv$/i, '') || 'Sheet1';
            const sheetWb = XLSX.read(csvText, { type: 'string' });
            if (sheetWb.SheetNames.length > 0) {
              const ws = sheetWb.Sheets[sheetWb.SheetNames[0]];
              XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
            }
          }
        }
      }
    }

    // 2d. Check for high-fidelity QuickLook Preview PDF (case-insensitive)
    if (!wb || !wb.SheetNames || wb.SheetNames.length === 0) {
      const pdfKey = Object.keys(loadedZip.files).find((k) => /preview\.pdf$/i.test(k));
      if (pdfKey) {
        onProgress?.(65, 'Extracting table structure from QuickLook Preview...');
        const pdfEntry = loadedZip.file(pdfKey);
        if (pdfEntry) {
          const pdfBuffer = await pdfEntry.async('arraybuffer');
          const pdfjsLib = await import('pdfjs-dist');
          if (typeof window !== 'undefined' && pdfjsLib?.GlobalWorkerOptions) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
          }

          const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
          const pdfDoc = await loadingTask.promise;
          const rows: any[][] = [];

          for (let pNum = 1; pNum <= pdfDoc.numPages; pNum++) {
            const page = await pdfDoc.getPage(pNum);
            const textContent = await page.getTextContent();
            const items = textContent.items as any[];

            const lineMap: Record<number, { x: number; text: string }[]> = {};
            for (const item of items) {
              if (!item.str || item.str.trim() === '') continue;
              const y = Math.round(item.transform[5] / 6) * 6;
              if (!lineMap[y]) lineMap[y] = [];
              lineMap[y].push({ x: item.transform[4], text: item.str });
            }

            const sortedYs = Object.keys(lineMap)
              .map(Number)
              .sort((a, b) => b - a);

            for (const y of sortedYs) {
              const lineItems = lineMap[y].sort((a, b) => a.x - b.x);
              rows.push(lineItems.map((i) => i.text.trim()));
            }
          }

          if (rows.length > 0) {
            wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(rows);
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          }
        }
      }
    }
  }

  // If still no workbook could be constructed, throw an informative error
  if (!wb || !wb.SheetNames || wb.SheetNames.length === 0) {
    throw new Error(
      'Unable to parse this Numbers file. The document may be password-protected or uses an unsupported Numbers format. In the Numbers app, you can also click File → Export To → Excel.'
    );
  }

  // Step 3: Clean up trailing empty rows and columns from every sheet in the workbook
  onProgress?.(80, 'Formatting and cleaning worksheet cells...');
  let totalRows = 0;
  const sheetNames = [...wb.SheetNames];

  for (const sheetName of sheetNames) {
    const ws = wb.Sheets[sheetName];
    if (!ws) continue;

    const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

    // Trim trailing empty rows
    while (
      data.length > 0 &&
      data[data.length - 1].every(
        (c) => c === null || c === undefined || String(c).trim() === ''
      )
    ) {
      data.pop();
    }

    if (data.length > 0) {
      // Find maximum non-empty column index
      let maxCol = 0;
      for (const row of data) {
        for (let cIdx = row.length - 1; cIdx >= 0; cIdx--) {
          const val = row[cIdx];
          if (val !== null && val !== undefined && String(val).trim() !== '') {
            if (cIdx > maxCol) maxCol = cIdx;
            break;
          }
        }
      }

      // Slice rows to trimmed column count
      const cleanedData = data.map((row) => {
        const sliced = row.slice(0, maxCol + 1);
        while (sliced.length < maxCol + 1) sliced.push('');
        return sliced;
      });

      totalRows += cleanedData.length;
      wb.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(cleanedData);
    }
  }

  // If all sheets were blank, ensure at least one valid sheet with header
  if (totalRows === 0) {
    const ws = XLSX.utils.aoa_to_sheet([['No data found in Numbers spreadsheet']]);
    wb.Sheets[sheetNames[0] || 'Sheet1'] = ws;
    totalRows = 1;
  }

  onProgress?.(90, 'Writing Microsoft Excel (.xlsx) file...');
  const outArray = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  const blob = new Blob([outArray], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  onProgress?.(100, 'Numbers to Excel conversion complete!');
  return {
    blob,
    rowCount: totalRows,
    sheetCount: wb.SheetNames.length,
  };
}

/**
 * Converts a Microsoft Excel (.xlsx, .xls, .csv) spreadsheet into an Apple Numbers (.numbers) document package.
 */
export async function convertExcelToNumbers(
  file: File,
  onProgress?: (percent: number, message: string) => void
): Promise<{ blob: Blob; rowCount: number; sheetCount: number; fileSizeKB: number }> {
  onProgress?.(15, 'Reading Microsoft Excel workbook...');
  const arrayBuffer = await file.arrayBuffer();
  const wb = XLSX.read(arrayBuffer, { type: 'array' });

  const sheetNames = wb.SheetNames;
  let totalRows = 0;
  const firstSheet = wb.Sheets[sheetNames[0]];
  const rows: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
  totalRows = rows.length;

  onProgress?.(40, 'Rendering high-resolution vector spreadsheet preview...');
  // Render clean PDF table preview for QuickLook
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const [pageW, pageH] = PageSizes.A4;
  const page = pdfDoc.addPage([pageW, pageH]);
  const margin = 40;
  let currentY = pageH - margin;

  // Title
  const title = file.name.replace(/\.[^/.]+$/, '');
  page.drawText(title, {
    x: margin,
    y: currentY - 14,
    size: 16,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.25),
  });
  currentY -= 35;

  // Render first 35 rows in preview
  const previewRows = rows.slice(0, 35);
  const colWidth = (pageW - margin * 2) / Math.min(6, Math.max(1, (previewRows[0] || []).length));

  for (let rIdx = 0; rIdx < previewRows.length; rIdx++) {
    const row = previewRows[rIdx];
    const isHeader = rIdx === 0;
    const rowFont = isHeader ? fontBold : font;
    const rowColor = isHeader ? rgb(0.1, 0.15, 0.25) : rgb(0.2, 0.25, 0.35);

    if (currentY < 50) break;

    for (let cIdx = 0; cIdx < Math.min(6, row.length); cIdx++) {
      const cellText = String(row[cIdx] ?? '').slice(0, 20);
      try {
        page.drawText(cellText, {
          x: margin + cIdx * colWidth,
          y: currentY,
          size: 9,
          font: rowFont,
          color: rowColor,
        });
      } catch {
        // Skip unencodable chars in preview
      }
    }
    currentY -= 16;
  }

  const pdfBytes = await pdfDoc.save();

  onProgress?.(70, 'Packaging Apple Numbers (.numbers) archive...');
  const zip = new JSZip();

  // 1. Add QuickLook Preview PDF
  zip.file('QuickLook/Preview.pdf', pdfBytes);

  // 2. Add CSV dump of all sheets for quick data access
  for (const sName of sheetNames) {
    const sheetData = wb.Sheets[sName];
    const csvContent = XLSX.utils.sheet_to_csv(sheetData);
    zip.file(`Data/${sName}.csv`, csvContent);
  }

  // 3. Store source spreadsheet
  zip.file('source/spreadsheet.xlsx', arrayBuffer);

  // 4. Manifest
  const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<numbers-metadata xmlns="http://developer.apple.com/namespaces/sfa">
  <title>${escapeXml(title)}</title>
  <sheets>${sheetNames.length}</sheets>
  <generator>FileZenith Excel to Numbers Converter</generator>
</numbers-metadata>`;
  zip.file('metadata.xml', manifest);

  onProgress?.(90, 'Compressing Apple Numbers package...');
  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/x-iwork-numbers-sffnumbers',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  onProgress?.(100, 'Excel to Numbers conversion complete!');
  return {
    blob,
    rowCount: totalRows,
    sheetCount: sheetNames.length,
    fileSizeKB: Math.round(blob.size / 1024),
  };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
