'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';
import { toast } from 'sonner';
import {
  Calendar,
  Download,
  Plus,
  Trash2,
  Sparkles,
  Printer,
  Sliders,
  RefreshCw,
  Palette,
  LayoutGrid,
  FileText,
  Layers,
} from 'lucide-react';
import { FileReadyModal } from '@/components/FileReadyModal';

type PaperSize = 'A4' | 'Letter';
type TrackerTheme = 'minimal' | 'sage' | 'slate' | 'rose';
type GridStyle = 'boxes' | 'circles';

interface HabitItem {
  id: string;
  name: string;
}

const DEFAULT_HABITS: HabitItem[] = [
  { id: '1', name: 'Drink 2.5L Water' },
  { id: '2', name: 'Exercise / 30m Walk' },
  { id: '3', name: 'Read 20 Pages' },
  { id: '4', name: 'Deep Work (2 Hours)' },
  { id: '5', name: 'Meditate or Journal' },
  { id: '6', name: 'Healthy Diet / No Sugar' },
  { id: '7', name: 'Sleep by 11:00 PM' },
];

const QUICK_HABIT_IDEAS = [
  '10,000 Steps',
  'Code / Study 1 Hr',
  'Stretching',
  'No Social Media Mornings',
  'Daily Gratitude',
  'Review Budget / Savings',
  'Take Vitamins',
  'Practice Instrument',
];

const THEME_CONFIG: Record<
  TrackerTheme,
  {
    name: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    rgbPrimary: [number, number, number];
    rgbAccent: [number, number, number];
    rgbGrid: [number, number, number];
    hexHeader: string;
  }
> = {
  minimal: {
    name: 'Minimalist Monochrome',
    bgClass: 'bg-slate-900 text-white',
    borderClass: 'border-slate-800',
    textClass: 'text-slate-900',
    rgbPrimary: [0.06, 0.09, 0.16],
    rgbAccent: [0.28, 0.33, 0.41],
    rgbGrid: [0.8, 0.84, 0.88],
    hexHeader: '#0f172a',
  },
  sage: {
    name: 'Sage Botanical',
    bgClass: 'bg-emerald-800 text-white',
    borderClass: 'border-emerald-700',
    textClass: 'text-emerald-900',
    rgbPrimary: [0.08, 0.33, 0.18],
    rgbAccent: [0.15, 0.55, 0.3],
    rgbGrid: [0.75, 0.88, 0.78],
    hexHeader: '#14532d',
  },
  slate: {
    name: 'Nordic Slate',
    bgClass: 'bg-indigo-900 text-white',
    borderClass: 'border-indigo-800',
    textClass: 'text-indigo-950',
    rgbPrimary: [0.12, 0.11, 0.29],
    rgbAccent: [0.31, 0.27, 0.9],
    rgbGrid: [0.78, 0.82, 0.95],
    hexHeader: '#1e1b4b',
  },
  rose: {
    name: 'Sunset Rose',
    bgClass: 'bg-rose-900 text-white',
    borderClass: 'border-rose-800',
    textClass: 'text-rose-950',
    rgbPrimary: [0.53, 0.07, 0.22],
    rgbAccent: [0.88, 0.11, 0.28],
    rgbGrid: [0.98, 0.8, 0.85],
    hexHeader: '#881337',
  },
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_DROPDOWN_OPTIONS = [
  'Undated (30-Day Master)',
  ...MONTH_NAMES,
];

function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function cleanForWinAnsi(text: string): string {
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, '-')
    .replace(/[•]/g, '-')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '')
    .trim();
}

export default function HabitTrackerPlannerPage() {
  const [isFullYear, setIsFullYear] = useState(false);
  const [title, setTitle] = useState('2027 HABIT TRACKER');
  const [month, setMonth] = useState('January');
  const [year, setYear] = useState('2027');
  const [paperSize, setPaperSize] = useState<PaperSize>('A4');
  const [theme, setTheme] = useState<TrackerTheme>('minimal');
  const [gridStyle, setGridStyle] = useState<GridStyle>('boxes');
  const [quote, setQuote] = useState('“We are what we repeatedly do. Excellence, then, is not an act, but a habit.”');
  const [habits, setHabits] = useState<HabitItem[]>(DEFAULT_HABITS);
  const [newHabitInput, setNewHabitInput] = useState('');
  const [previewMonthIdx, setPreviewMonthIdx] = useState<number>(0); // 0 = Jan, 11 = Dec
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddHabit = (nameToAdd?: string) => {
    const text = (nameToAdd || newHabitInput).trim();
    if (!text) return;
    if (habits.length >= 14) {
      toast.error('Maximum 14 habits recommended for optimal single-page print readability.');
      return;
    }
    setHabits([...habits, { id: `h-${Date.now()}-${Math.random()}`, name: text }]);
    if (!nameToAdd) setNewHabitInput('');
    toast.success(`Added "${text}"`);
  };

  const handleRemoveHabit = (id: string) => {
    setHabits(habits.filter((h) => h.id !== id));
  };

  // Helper to draw 1 single page inside pdfDoc
  const drawPage = (
    page: PDFPage,
    pageWidth: number,
    pageHeight: number,
    monthLabel: string,
    yearLabel: string,
    daysInThisMonth: number,
    font: PDFFont,
    boldFont: PDFFont,
    italicFont: PDFFont,
    pageNumberStr?: string
  ) => {
    const margin = 36; // 0.5 in / 12.7 mm safe print margins
    const contentWidth = pageWidth - margin * 2;
    const activeTheme = THEME_CONFIG[theme];

    const primaryColor = rgb(...activeTheme.rgbPrimary);
    const accentColor = rgb(...activeTheme.rgbAccent);
    const gridColor = rgb(...activeTheme.rgbGrid);
    const whiteColor = rgb(1, 1, 1);
    const lightBgColor = rgb(0.97, 0.98, 0.99);
    const disabledCellColor = rgb(0.93, 0.94, 0.96);

    // --- 1. Top Header Banner ---
    let curY = pageHeight - margin - 20;

    // Decorative Top Accent Line
    page.drawLine({
      start: { x: margin, y: curY + 12 },
      end: { x: margin + contentWidth, y: curY + 12 },
      thickness: 3,
      color: accentColor,
    });

    // Main Document Title
    page.drawText(cleanForWinAnsi(title.toUpperCase()), {
      x: margin,
      y: curY - 14,
      size: 20,
      font: boldFont,
      color: primaryColor,
    });

    // Month & Year Tag (Right Aligned)
    const rawTag = monthLabel.startsWith('Undated') ? '30-DAY GOAL PLANNER' : `${monthLabel.toUpperCase()} ${yearLabel}`;
    const dateTag = cleanForWinAnsi(rawTag);
    const dateTagWidth = boldFont.widthOfTextAtSize(dateTag, 11);
    page.drawText(dateTag, {
      x: margin + contentWidth - dateTagWidth,
      y: curY - 12,
      size: 11,
      font: boldFont,
      color: accentColor,
    });

    // Subtitle / Prompt
    page.drawText('MONTHLY CONSISTENCY MATRIX - TRACK DAILY ACTIONS & BUILDING MOMENTUM', {
      x: margin,
      y: curY - 30,
      size: 7.5,
      font,
      color: rgb(0.4, 0.45, 0.5),
    });

    curY -= 48;

    // --- 2. Main Tracking Grid Math ---
    const numDays = 31;
    const habitColWidth = 145;
    const remainingWidth = contentWidth - habitColWidth;
    const dayColWidth = remainingWidth / numDays; // ~11.9 pt per day

    const numRows = Math.max(habits.length, 10);
    const rowHeight = Math.min(26, Math.max(20, (pageHeight * 0.48) / numRows));
    const headerRowHeight = 22;

    // Header Row Background
    page.drawRectangle({
      x: margin,
      y: curY - headerRowHeight,
      width: contentWidth,
      height: headerRowHeight,
      color: primaryColor,
    });

    // "HABIT / ROUTINE" Header Label
    page.drawText('HABIT / ROUTINE', {
      x: margin + 8,
      y: curY - headerRowHeight + 7,
      size: 8,
      font: boldFont,
      color: whiteColor,
    });

    // Day Numbers (1 to 31)
    for (let day = 1; day <= numDays; day++) {
      const dayX = margin + habitColWidth + (day - 1) * dayColWidth;
      const dayStr = String(day);
      const isPastMonthEnd = day > daysInThisMonth;

      const textW = boldFont.widthOfTextAtSize(dayStr, 7.5);
      const offsetX = (dayColWidth - textW) / 2;

      page.drawText(dayStr, {
        x: dayX + offsetX,
        y: curY - headerRowHeight + 7,
        size: 7.5,
        font: boldFont,
        color: isPastMonthEnd ? rgb(0.6, 0.65, 0.72) : whiteColor,
      });

      // Column separator in header
      if (day > 1) {
        page.drawLine({
          start: { x: dayX, y: curY },
          end: { x: dayX, y: curY - headerRowHeight },
          thickness: 0.5,
          color: rgb(0.3, 0.35, 0.45),
        });
      }
    }

    curY -= headerRowHeight;

    // Grid Rows (Habits)
    for (let r = 0; r < numRows; r++) {
      const rowY = curY - rowHeight;
      const habit = habits[r];
      const isEven = r % 2 === 0;

      // Alternate row subtle shading
      if (isEven) {
        page.drawRectangle({
          x: margin,
          y: rowY,
          width: contentWidth,
          height: rowHeight,
          color: lightBgColor,
        });
      }

      // Horizontal bottom row line
      page.drawLine({
        start: { x: margin, y: rowY },
        end: { x: margin + contentWidth, y: rowY },
        thickness: 0.5,
        color: gridColor,
      });

      // Habit Label Text
      if (habit) {
        let name = cleanForWinAnsi(habit.name);
        if (font.widthOfTextAtSize(name, 8.5) > habitColWidth - 16) {
          while (font.widthOfTextAtSize(name + '...', 8.5) > habitColWidth - 16 && name.length > 0) {
            name = name.slice(0, -1);
          }
          name += '...';
        }
        page.drawText(name, {
          x: margin + 8,
          y: rowY + (rowHeight - 8.5) / 2 + 1,
          size: 8.5,
          font: boldFont,
          color: primaryColor,
        });
      }

      // Habit Column Divider (vertical)
      page.drawLine({
        start: { x: margin + habitColWidth, y: rowY },
        end: { x: margin + habitColWidth, y: rowY + rowHeight },
        thickness: 1,
        color: primaryColor,
      });

      // Day Checkboxes or Circles
      for (let d = 1; d <= numDays; d++) {
        const dayX = margin + habitColWidth + (d - 1) * dayColWidth;
        const isPastMonthEnd = d > daysInThisMonth;

        // Vertical day column line
        page.drawLine({
          start: { x: dayX, y: rowY },
          end: { x: dayX, y: rowY + rowHeight },
          thickness: 0.5,
          color: gridColor,
        });

        // Center coordinates
        const centerX = dayX + dayColWidth / 2;
        const centerY = rowY + rowHeight / 2;

        if (isPastMonthEnd) {
          // Shaded N/A cell for days not in this month (e.g. Feb 29-31)
          page.drawRectangle({
            x: dayX + 0.5,
            y: rowY + 0.5,
            width: dayColWidth - 1,
            height: rowHeight - 1,
            color: disabledCellColor,
          });
          // Subtle dash
          page.drawLine({
            start: { x: centerX - 2.5, y: centerY },
            end: { x: centerX + 2.5, y: centerY },
            thickness: 0.6,
            color: rgb(0.7, 0.75, 0.8),
          });
        } else {
          // Active Checkbox / Circle graphic
          if (gridStyle === 'circles') {
            page.drawCircle({
              x: centerX,
              y: centerY,
              size: 3.8,
              borderColor: rgb(0.65, 0.7, 0.76),
              borderWidth: 0.6,
              color: whiteColor,
            });
          } else {
            const boxSize = 7.5;
            page.drawRectangle({
              x: centerX - boxSize / 2,
              y: centerY - boxSize / 2,
              width: boxSize,
              height: boxSize,
              borderColor: rgb(0.65, 0.7, 0.76),
              borderWidth: 0.6,
              color: whiteColor,
            });
          }
        }
      }

      // Outer right border
      page.drawLine({
        start: { x: margin + contentWidth, y: rowY },
        end: { x: margin + contentWidth, y: rowY + rowHeight },
        thickness: 0.5,
        color: gridColor,
      });

      curY -= rowHeight;
    }

    // Outer left border
    page.drawLine({
      start: { x: margin, y: curY },
      end: { x: margin, y: curY + numRows * rowHeight },
      thickness: 0.5,
      color: gridColor,
    });

    curY -= 20;

    // --- 3. Bottom Sections: Weekly Wins & Notes ---
    const bottomAreaHeight = curY - margin - 35;
    if (bottomAreaHeight > 80) {
      const boxGap = 14;
      const boxWidth = (contentWidth - boxGap * 2) / 3;

      // Box 1: Weekly Milestone Reviews
      page.drawRectangle({
        x: margin,
        y: curY - bottomAreaHeight,
        width: boxWidth,
        height: bottomAreaHeight,
        borderColor: gridColor,
        borderWidth: 0.8,
        color: whiteColor,
      });
      page.drawRectangle({
        x: margin,
        y: curY - 18,
        width: boxWidth,
        height: 18,
        color: rgb(0.94, 0.96, 0.98),
      });
      page.drawText('WEEKLY AUDITS', {
        x: margin + 8,
        y: curY - 13,
        size: 7.5,
        font: boldFont,
        color: primaryColor,
      });
      const weeks = ['Week 1: ____ / 100%', 'Week 2: ____ / 100%', 'Week 3: ____ / 100%', 'Week 4: ____ / 100%'];
      weeks.forEach((wk, idx) => {
        page.drawText(wk, {
          x: margin + 8,
          y: curY - 32 - idx * 16,
          size: 7.5,
          font,
          color: rgb(0.3, 0.35, 0.4),
        });
      });

      // Box 2: Monthly Focus & Reward
      page.drawRectangle({
        x: margin + boxWidth + boxGap,
        y: curY - bottomAreaHeight,
        width: boxWidth,
        height: bottomAreaHeight,
        borderColor: gridColor,
        borderWidth: 0.8,
        color: whiteColor,
      });
      page.drawRectangle({
        x: margin + boxWidth + boxGap,
        y: curY - 18,
        width: boxWidth,
        height: 18,
        color: rgb(0.94, 0.96, 0.98),
      });
      page.drawText('KEY REWARD & TARGET', {
        x: margin + boxWidth + boxGap + 8,
        y: curY - 13,
        size: 7.5,
        font: boldFont,
        color: primaryColor,
      });
      page.drawText('If I hit 80%+ consistency, I will reward', {
        x: margin + boxWidth + boxGap + 8,
        y: curY - 34,
        size: 7,
        font,
        color: rgb(0.4, 0.45, 0.5),
      });
      page.drawText('myself with:', {
        x: margin + boxWidth + boxGap + 8,
        y: curY - 45,
        size: 7,
        font,
        color: rgb(0.4, 0.45, 0.5),
      });
      for (let l = 0; l < 3; l++) {
        page.drawLine({
          start: { x: margin + boxWidth + boxGap + 8, y: curY - 60 - l * 14 },
          end: { x: margin + boxWidth * 2 + boxGap - 8, y: curY - 60 - l * 14 },
          thickness: 0.5,
          color: rgb(0.82, 0.85, 0.88),
        });
      }

      // Box 3: Notes & Habit Stacking Anchor
      page.drawRectangle({
        x: margin + (boxWidth + boxGap) * 2,
        y: curY - bottomAreaHeight,
        width: boxWidth,
        height: bottomAreaHeight,
        borderColor: gridColor,
        borderWidth: 0.8,
        color: whiteColor,
      });
      page.drawRectangle({
        x: margin + (boxWidth + boxGap) * 2,
        y: curY - 18,
        width: boxWidth,
        height: 18,
        color: rgb(0.94, 0.96, 0.98),
      });
      page.drawText('TWO-DAY RULE & NOTES', {
        x: margin + (boxWidth + boxGap) * 2 + 8,
        y: curY - 13,
        size: 7.5,
        font: boldFont,
        color: primaryColor,
      });
      for (let l = 0; l < 4; l++) {
        page.drawLine({
          start: { x: margin + (boxWidth + boxGap) * 2 + 8, y: curY - 34 - l * 14 },
          end: { x: margin + contentWidth - 8, y: curY - 34 - l * 14 },
          thickness: 0.5,
          color: rgb(0.82, 0.85, 0.88),
        });
      }
    }

    // --- 4. Footer & Inspirational Quote ---
    if (quote) {
      const quoteText = cleanForWinAnsi(quote);
      const quoteWidth = italicFont.widthOfTextAtSize(quoteText, 7.5);
      const quoteX = Math.max(margin, margin + (contentWidth - quoteWidth) / 2);
      page.drawText(quoteText, {
        x: quoteX,
        y: margin + 12,
        size: 7.5,
        font: italicFont,
        color: rgb(0.45, 0.5, 0.56),
      });
    }

    // Safe printing badge & optional page number
    const branding = pageNumberStr
      ? `FileZenith - ${pageNumberStr} - 100% Free Printable Planner`
      : 'FileZenith - 100% Free Printable Planner';
    page.drawText(branding, {
      x: margin,
      y: margin - 2,
      size: 6.5,
      font,
      color: rgb(0.65, 0.7, 0.75),
    });
  };

  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();

      // ISO A4: 595.28 x 841.89 pt | US Letter: 612 x 792 pt
      const pageWidth = paperSize === 'A4' ? 595.28 : 612;
      const pageHeight = paperSize === 'A4' ? 841.89 : 792;

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

      const parsedYear = parseInt(year) || 2027;

      if (isFullYear) {
        // Generate complete 12 months (Pages 1 to 12)
        for (let m = 0; m < 12; m++) {
          const monthName = MONTH_NAMES[m];
          const daysInMonth = getDaysInMonth(parsedYear, m);
          const page = pdfDoc.addPage([pageWidth, pageHeight]);
          drawPage(
            page,
            pageWidth,
            pageHeight,
            monthName,
            String(parsedYear),
            daysInMonth,
            font,
            boldFont,
            italicFont,
            `Page ${m + 1} of 12 (${monthName})`
          );
        }
      } else {
        // Generate single month
        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        const mIdx = MONTH_NAMES.indexOf(month);
        const daysInMonth = mIdx >= 0 ? getDaysInMonth(parsedYear, mIdx) : 31;
        drawPage(
          page,
          pageWidth,
          pageHeight,
          month,
          String(parsedYear),
          daysInMonth,
          font,
          boldFont,
          italicFont
        );
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const filename = isFullYear
        ? `${parsedYear}_Full_Year_12_Months_Habit_Tracker_${paperSize}.pdf`
        : `${title.replace(/\s+/g, '_')}_${month}_${parsedYear}_Printable_${paperSize}.pdf`;

      setDownloadUrl(url);
      setDownloadFileName(filename);
      setIsModalOpen(true);
      toast.success(
        isFullYear
          ? `Complete 12-Month ${parsedYear} Planner (12 Pages) generated!`
          : 'Print-ready vector PDF generated successfully!'
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF. Please check habit titles.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Determine current active preview month
  const activePreviewMonth = isFullYear ? MONTH_NAMES[previewMonthIdx] : month;
  const parsedYearNum = parseInt(year) || 2027;
  const activePreviewDays = isFullYear
    ? getDaysInMonth(parsedYearNum, previewMonthIdx)
    : (MONTH_NAMES.indexOf(month) >= 0 ? getDaysInMonth(parsedYearNum, MONTH_NAMES.indexOf(month)) : 31);

  return (
    <ToolLayout
      title="Free Printable Habit Tracker & Goal Planner PDF Generator"
      subtitle="Design a custom, minimalist 30-day habit planner, full 12-month annual journal, or study routine. Download in 100% vector, print-ready A4 or Letter PDF with zero server upload."
      slug="/pdf/habit-tracker-planner"
      noCardWrapper={true}
    >
      <div className="space-y-6">
        {/* Top Feature Notice Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span>{isFullYear ? `Full Year ${year} (All 12 Months)` : 'Single Month / Custom Timeframe'}</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                  {isFullYear ? '12 Pages Bundle' : '300 DPI Vector'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                100% client-side vector compilation. Zero cloud storage, clean typography, perfectly calibrated for home &amp; office printers.
              </p>
            </div>
          </div>
          <button
            onClick={handleGeneratePdf}
            disabled={isGenerating}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Compiling {isFullYear ? '12-Page Annual PDF' : 'PDF'}...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                {isFullYear ? `Download Full Year ${year} (12 Pages)` : 'Download Print-Ready PDF'}
              </>
            )}
          </button>
        </div>

        {/* 1. Full-Width Configuration & Content Box */}
        <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Planner Details &amp; Habits Setup
            </span>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {isFullYear ? 'Annual 12-Month Edition' : 'Custom Month Edition'}
            </span>
          </div>

          {/* Scope Selector: Single Month vs Full Year Pack */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              Planner Scope &amp; Page Count
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsFullYear(false)}
                className={`py-3 px-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  !isFullYear
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40 text-indigo-950 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">Single Month Sheet</div>
                  <div className="text-[10px] text-slate-500">Generate 1 printable page for selected month</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                  1 Page
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullYear(true)}
                className={`py-3 px-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isFullYear
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40 text-indigo-950 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Full Year {year} (All 12 Months Pack)</span>
                    <span className="text-[10px] text-amber-600 font-extrabold">★ Popular</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Complete Jan–Dec calendar bundle in 1 master PDF</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                  12 Pages
                </span>
              </button>
            </div>
          </div>

          {/* Row 1: Title, Month, Year */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 md:col-span-1">
              <label className="text-[11px] font-bold text-slate-700">Planner Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                placeholder="e.g. 2027 HABIT TRACKER"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700">Timeframe / Month</label>
              {isFullYear ? (
                <div className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-indigo-200 bg-indigo-50/50 text-indigo-800 flex items-center justify-between">
                  <span>All 12 Months Included (Jan–Dec)</span>
                  <span className="text-[10px] font-semibold text-indigo-600">Bundle Active</span>
                </div>
              ) : (
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  {MONTH_DROPDOWN_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700">Target Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                placeholder="2027"
              />
            </div>
          </div>

          {/* Row 2: Paper Size & Checkbox Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                Paper Format
              </label>
              <div className="flex rounded-xl border border-slate-200 p-1 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setPaperSize('A4')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    paperSize === 'A4' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ISO A4 (210 × 297 mm)
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSize('Letter')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    paperSize === 'Letter' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  US Letter (8.5 × 11 in)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
                Checkbox Style
              </label>
              <div className="flex rounded-xl border border-slate-200 p-1 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setGridStyle('boxes')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    gridStyle === 'boxes' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Square Boxes
                </button>
                <button
                  type="button"
                  onClick={() => setGridStyle('circles')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    gridStyle === 'circles' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Circular Bubbles
                </button>
              </div>
            </div>
          </div>

          {/* Row 3: Aesthetic Color Themes */}
          <div className="space-y-2 pt-1">
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              Aesthetic Color Palette
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(THEME_CONFIG) as TrackerTheme[]).map((tKey) => {
                const cfg = THEME_CONFIG[tKey];
                const isSelected = theme === tKey;
                return (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => setTheme(tKey)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-2xs border border-white"
                      style={{ backgroundColor: cfg.hexHeader }}
                    />
                    <span className="text-xs font-bold text-slate-800 truncate">{cfg.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Habits List Customizer */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Habits to Track Across All Pages ({habits.length}/14)
              </label>
              <span className="text-[10px] text-slate-400">Press Enter or click Add</span>
            </div>

            {/* Input & Add Button */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newHabitInput}
                onChange={(e) => setNewHabitInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                placeholder="Type habit name (e.g. Read 20 mins, 10k Steps)..."
                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
              <button
                type="button"
                onClick={() => handleAddHabit()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add Habit
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Suggestions:</span>
              {QUICK_HABIT_IDEAS.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => handleAddHabit(idea)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[10px] font-semibold transition-colors cursor-pointer"
                >
                  + {idea}
                </button>
              ))}
            </div>

            {/* Current Active Habits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {habits.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 text-xs"
                >
                  <span className="font-mono text-[10px] text-slate-400 w-5">{idx + 1}.</span>
                  <span className="font-semibold text-slate-800 flex-1 truncate">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveHabit(item.id)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    title="Delete habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Row 5: Motivational Quote */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="text-[11px] font-bold text-slate-700">Footer Motivational Quote / Mantra</label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              placeholder="e.g. We are what we repeatedly do. Excellence, then, is not an act, but a habit."
            />
          </div>
        </div>

        {/* 2. Visual Live Preview Box — DIRECTLY BELOW the text and content box */}
        <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Live Printable PDF Preview ({paperSize} • {isFullYear ? 'Page ' + (previewMonthIdx + 1) + ' of 12' : 'Single Page'})
              </span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {isFullYear ? `Full Year ${year} Bundle (${activePreviewDays} Days in ${activePreviewMonth})` : 'Exact Printable Output'}
            </span>
          </div>

          {/* Month Preview Strip when Full Year is active */}
          {isFullYear && (
            <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Preview Any Month (Click month tab to inspect each of the 12 pages):
              </span>
              <div className="flex gap-1 overflow-x-auto pb-0.5">
                {MONTH_NAMES.map((mName, idx) => {
                  const isSelected = previewMonthIdx === idx;
                  return (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => setPreviewMonthIdx(idx)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {mName.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Realistic Rendered A4 Sheet Simulation */}
          <div className="w-full bg-slate-100/80 p-3 sm:p-8 rounded-2xl flex items-center justify-center overflow-x-auto">
            <div
              className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8 space-y-4 font-sans select-none"
              style={{ minHeight: '560px' }}
            >
              {/* Top Accent Line */}
              <div
                className="h-1.5 rounded-full w-full"
                style={{ backgroundColor: THEME_CONFIG[theme].hexHeader }}
              />

              {/* Title & Month Banner */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3
                    className="text-lg sm:text-2xl font-black tracking-tight"
                    style={{ color: THEME_CONFIG[theme].hexHeader }}
                  >
                    {title || 'HABIT TRACKER'}
                  </h3>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                    Monthly Consistency Matrix • Track Daily Actions &amp; Momentum
                  </p>
                </div>
                <div
                  className="text-xs font-black uppercase px-3 py-1.5 rounded-lg shadow-2xs"
                  style={{
                    backgroundColor: THEME_CONFIG[theme].hexHeader,
                    color: '#ffffff',
                  }}
                >
                  {activePreviewMonth.startsWith('Undated')
                    ? '30-Day Master'
                    : `${activePreviewMonth} ${year}`}
                </div>
              </div>

              {/* 31-Day Habit Grid Simulation */}
              <div className="border border-slate-300 rounded-lg overflow-hidden text-[9px] shadow-2xs">
                {/* Header Row */}
                <div
                  className="flex items-center text-white font-bold py-1.5 px-2"
                  style={{ backgroundColor: THEME_CONFIG[theme].hexHeader }}
                >
                  <div className="w-36 sm:w-44 truncate">HABIT / ROUTINE</div>
                  <div className="flex-1 flex justify-between px-1 text-[8px] text-slate-100 font-mono">
                    {Array.from({ length: 31 }, (_, i) => {
                      const dayNum = i + 1;
                      const isPast = dayNum > activePreviewDays;
                      return (
                        <span
                          key={i}
                          className={`w-2.5 text-center ${isPast ? 'opacity-40' : ''}`}
                        >
                          {dayNum}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Habit Rows */}
                {habits.map((h, idx) => (
                  <div
                    key={h.id}
                    className={`flex items-center py-1.5 px-2 border-t border-slate-200 ${
                      idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'
                    }`}
                  >
                    <div className="w-36 sm:w-44 truncate font-semibold text-slate-800 pr-1">{h.name}</div>
                    <div className="flex-1 flex justify-between px-1">
                      {Array.from({ length: 31 }, (_, i) => {
                        const dayNum = i + 1;
                        const isPast = dayNum > activePreviewDays;
                        if (isPast) {
                          return (
                            <span
                              key={i}
                              className="w-2.5 h-2.5 bg-slate-200/70 rounded-xs inline-flex items-center justify-center text-[7px] text-slate-400 font-mono"
                            >
                              -
                            </span>
                          );
                        }
                        return (
                          <span
                            key={i}
                            className={`w-2 h-2 border border-slate-300 ${
                              gridStyle === 'circles' ? 'rounded-full' : 'rounded-xs'
                            } bg-white inline-block shrink-0`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom 3 Boxes */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-[8px]">
                <div className="border border-slate-200 rounded-lg p-2.5 space-y-1 bg-slate-50/60">
                  <span className="font-bold text-slate-800 block border-b border-slate-200 pb-1">
                    Weekly Audits
                  </span>
                  <div className="text-slate-500 space-y-0.5 font-mono text-[7.5px]">
                    <div>Week 1: ____ / 100%</div>
                    <div>Week 2: ____ / 100%</div>
                    <div>Week 3: ____ / 100%</div>
                    <div>Week 4: ____ / 100%</div>
                  </div>
                </div>
                <div className="border border-slate-200 rounded-lg p-2.5 space-y-1 bg-slate-50/60">
                  <span className="font-bold text-slate-800 block border-b border-slate-200 pb-1">
                    Milestone Reward
                  </span>
                  <p className="text-slate-500 text-[7px] leading-tight">If I hit 80%+ consistency, my reward is:</p>
                  <div className="h-0.5 bg-slate-200 rounded w-full mt-2" />
                  <div className="h-0.5 bg-slate-200 rounded w-full mt-1.5" />
                </div>
                <div className="border border-slate-200 rounded-lg p-2.5 space-y-1 bg-slate-50/60">
                  <span className="font-bold text-slate-800 block border-b border-slate-200 pb-1">
                    Two-Day Rule
                  </span>
                  <p className="text-slate-500 text-[7px] leading-tight">Never miss twice. Missing once is an accident.</p>
                  <div className="h-0.5 bg-slate-200 rounded w-full mt-2" />
                  <div className="h-0.5 bg-slate-200 rounded w-full mt-1.5" />
                </div>
              </div>

              {/* Quote Footer */}
              {quote && (
                <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-[8.5px] italic text-slate-400 flex-1 truncate text-left">{quote}</p>
                  {isFullYear && (
                    <span className="text-[8px] font-mono text-slate-400 shrink-0 ml-2">
                      Page {previewMonthIdx + 1} of 12 ({activePreviewMonth})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Button: Directly below preview */}
          <div className="pt-2">
            <button
              onClick={handleGeneratePdf}
              disabled={isGenerating}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Compiling {isFullYear ? `Full 12-Month ${year} Annual Planner (12 Pages)...` : '300 DPI Vector PDF...'}
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  {isFullYear
                    ? `Download Full Year ${year} Planner (12 Pages PDF)`
                    : `Download Print-Ready PDF (${month} • ${paperSize})`}
                </>
              )}
            </button>
          </div>

          {/* Printer Setup Callout */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <Printer className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900 font-bold">Printer Setup Tip:</strong> In your browser or PDF viewer
              print dialog, set Scale to <strong>&quot;100% (Actual Size)&quot;</strong>. Safe non-clipping hardware margins
              (12.7mm) are mathematically embedded in every page of this vector PDF.
            </div>
          </div>
        </div>

        {/* Celebratory Completion Modal */}
        <FileReadyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          downloadUrl={downloadUrl}
          fileName={downloadFileName}
          fileSizeKb={isFullYear ? 110 : 35}
          fileType="pdf"
          title={isFullYear ? `Full Year ${year} Planner Ready!` : 'Printable Habit Tracker Ready'}
          subtitle={
            isFullYear
              ? `Compiled all 12 months (January to December ${year}) into a master 12-page vector PDF with calibrated day counts.`
              : `Compiled into crisp 300 DPI vector PDF format (${paperSize}) with safe printer margins.`
          }
          onReset={() => {
            setDownloadUrl(null);
            setIsModalOpen(false);
          }}
        />
      </div>
    </ToolLayout>
  );
}
