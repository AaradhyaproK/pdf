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

/* ==========================================================================
   1. AGE CALCULATOR ENGINE
   ========================================================================== */

export interface DetailedAgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  nextBirthday: {
    months: number;
    days: number;
    daysTotal: number;
    dayOfWeek: string;
  };
  dayOfWeekBorn: string;
  zodiacSign: string;
  zodiacSymbol: string;
  chineseZodiac: string;
  milestones: {
    heartbeats: string;
    breaths: string;
    sleepYears: string;
    nextBigAge: number;
    daysToNextBigAge: number;
  };
}

export function calculateDetailedAge(birthDateStr: string, targetDateStr?: string): DetailedAgeResult | null {
  if (!birthDateStr) return null;
  const birth = new Date(birthDateStr);
  const target = targetDateStr ? new Date(targetDateStr) : new Date();

  if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
    return null;
  }

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = target.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  const totalSeconds = totalMinutes * 60;

  // Day of week born
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeekBorn = daysOfWeek[birth.getDay()];

  // Next Birthday Calculation
  const nextBdayYear = target.getMonth() > birth.getMonth() || (target.getMonth() === birth.getMonth() && target.getDate() >= birth.getDate())
    ? target.getFullYear() + 1
    : target.getFullYear();

  const nextBdayDate = new Date(nextBdayYear, birth.getMonth(), birth.getDate());
  const nextBdayDiffMs = nextBdayDate.getTime() - target.getTime();
  const nextBdayDaysTotal = Math.ceil(nextBdayDiffMs / (1000 * 60 * 60 * 24));

  let nextBdayMonths = nextBdayDate.getMonth() - target.getMonth();
  let nextBdayDays = nextBdayDate.getDate() - target.getDate();
  if (nextBdayDays < 0) {
    nextBdayMonths -= 1;
    const prevMonthDays = new Date(nextBdayDate.getFullYear(), nextBdayDate.getMonth(), 0).getDate();
    nextBdayDays += prevMonthDays;
  }
  if (nextBdayMonths < 0) {
    nextBdayMonths += 12;
  }

  const nextBdayDayOfWeek = daysOfWeek[nextBdayDate.getDay()];

  // Zodiac Sign
  const { sign: zodiacSign, symbol: zodiacSymbol } = getZodiacSign(birth.getMonth() + 1, birth.getDate());
  const chineseZodiac = getChineseZodiac(birth.getFullYear());

  // Milestones
  const heartbeats = (totalMinutes * 72).toLocaleString();
  const breaths = (totalMinutes * 16).toLocaleString();
  const sleepYears = (years / 3).toFixed(1);

  const milestoneAges = [18, 21, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100];
  const nextBigAge = milestoneAges.find((a) => a > years) || years + 5;
  const nextBigDate = new Date(birth.getFullYear() + nextBigAge, birth.getMonth(), birth.getDate());
  const daysToNextBigAge = Math.ceil((nextBigDate.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  return {
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    nextBirthday: {
      months: nextBdayMonths,
      days: nextBdayDays,
      daysTotal: nextBdayDaysTotal,
      dayOfWeek: nextBdayDayOfWeek,
    },
    dayOfWeekBorn,
    zodiacSign,
    zodiacSymbol,
    chineseZodiac,
    milestones: {
      heartbeats,
      breaths,
      sleepYears,
      nextBigAge,
      daysToNextBigAge,
    },
  };
}

function getZodiacSign(month: number, day: number): { sign: string; symbol: string } {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: 'Aries', symbol: '♈' };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: 'Taurus', symbol: '♉' };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: 'Gemini', symbol: '♊' };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: 'Cancer', symbol: '♋' };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: 'Leo', symbol: '♌' };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: 'Virgo', symbol: '♍' };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: 'Libra', symbol: '♎' };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { sign: 'Scorpio', symbol: '♏' };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: 'Sagittarius', symbol: '♐' };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { sign: 'Capricorn', symbol: '♑' };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: 'Aquarius', symbol: '♒' };
  return { sign: 'Pisces', symbol: '♓' };
}

function getChineseZodiac(year: number): string {
  const animals = ['Rat 🐀', 'Ox 🐂', 'Tiger 🐅', 'Rabbit 🐇', 'Dragon 🐉', 'Snake 🐍', 'Horse 🐎', 'Goat 🐐', 'Monkey 🐒', 'Rooster 🐓', 'Dog 🐕', 'Pig 🐖'];
  return animals[(year - 4) % 12];
}

/* ==========================================================================
   2. PERCENTAGE CALCULATOR ENGINE
   ========================================================================== */

export interface PercentageResult {
  value: number;
  formatted: string;
  explanation: string;
  details?: Record<string, number | string>;
}

export function calculatePercentage(
  mode: 'of' | 'change' | 'is_what' | 'discount' | 'marks',
  v1: number,
  v2: number,
  v3?: number
): PercentageResult {
  if (isNaN(v1) || isNaN(v2)) {
    return { value: 0, formatted: '0', explanation: 'Please enter valid numerical values.' };
  }

  if (mode === 'of') {
    // What is v1% of v2?
    const res = (v1 / 100) * v2;
    return {
      value: res,
      formatted: res.toLocaleString(undefined, { maximumFractionDigits: 4 }),
      explanation: `${v1}% of ${v2} = ${res}`,
    };
  }

  if (mode === 'change') {
    // Percentage Increase / Decrease from v1 to v2
    if (v1 === 0) {
      return { value: 0, formatted: 'N/A', explanation: 'Initial value cannot be zero for percentage change calculation.' };
    }
    const diff = v2 - v1;
    const pctChange = (diff / Math.abs(v1)) * 100;
    const type = diff >= 0 ? 'Increase' : 'Decrease';
    return {
      value: pctChange,
      formatted: `${Math.abs(pctChange).toFixed(2)}% ${type}`,
      explanation: `From ${v1} to ${v2} is a ${Math.abs(pctChange).toFixed(2)}% ${type.toLowerCase()}.`,
      details: {
        difference: diff,
        absPct: Math.abs(pctChange).toFixed(2),
        type,
      },
    };
  }

  if (mode === 'is_what') {
    // v1 is what percentage of v2?
    if (v2 === 0) {
      return { value: 0, formatted: 'N/A', explanation: 'Total (denominator) cannot be zero.' };
    }
    const pct = (v1 / v2) * 100;
    return {
      value: pct,
      formatted: `${pct.toFixed(2)}%`,
      explanation: `${v1} is ${pct.toFixed(2)}% of ${v2}`,
    };
  }

  if (mode === 'discount') {
    // Original price v1, Discount v2%, Tax v3%
    const discountAmt = (v2 / 100) * v1;
    const priceAfterDiscount = v1 - discountAmt;
    const taxRate = v3 || 0;
    const taxAmt = (taxRate / 100) * priceAfterDiscount;
    const finalPrice = priceAfterDiscount + taxAmt;

    return {
      value: finalPrice,
      formatted: finalPrice.toFixed(2),
      explanation: `Original: ₹${v1} | Discount (${v2}%): -₹${discountAmt.toFixed(2)} | Tax (${taxRate}%): +₹${taxAmt.toFixed(2)} | Final: ₹${finalPrice.toFixed(2)}`,
      details: {
        original: v1,
        discountAmount: discountAmt.toFixed(2),
        priceAfterDiscount: priceAfterDiscount.toFixed(2),
        taxAmount: taxAmt.toFixed(2),
        finalPrice: finalPrice.toFixed(2),
        totalSavings: discountAmt.toFixed(2),
      },
    };
  }

  if (mode === 'marks') {
    // Obtained Marks v1 out of Total Marks v2
    if (v2 === 0) {
      return { value: 0, formatted: 'N/A', explanation: 'Total marks cannot be zero.' };
    }
    const pct = (v1 / v2) * 100;
    let grade = 'F';
    let division = 'Fail';

    if (pct >= 90) { grade = 'A+'; division = 'First Class with Distinction'; }
    else if (pct >= 80) { grade = 'A'; division = 'First Class'; }
    else if (pct >= 70) { grade = 'B+'; division = 'First Class'; }
    else if (pct >= 60) { grade = 'B'; division = 'First Class'; }
    else if (pct >= 50) { grade = 'C'; division = 'Second Class'; }
    else if (pct >= 40) { grade = 'D'; division = 'Pass Class'; }

    return {
      value: pct,
      formatted: `${pct.toFixed(2)}%`,
      explanation: `Scored ${v1} / ${v2} (${pct.toFixed(2)}%) - Grade: ${grade} (${division})`,
      details: {
        percentage: pct.toFixed(2),
        grade,
        division,
      },
    };
  }

  return { value: 0, formatted: '0', explanation: '' };
}

/* ==========================================================================
   3. CGPA TO PERCENTAGE ENGINE
   ========================================================================== */

export interface CGPACalculationResult {
  cgpa: number;
  percentage: number;
  formulaUsed: string;
  grade: string;
  division: string;
}

export function convertCGPAToPercentage(
  cgpa: number,
  university: 'cbse' | 'mumbai' | 'vtu' | 'du' | 'gtu' | 'aktu' | 'sppu' | 'custom',
  customMultiplier = 9.5
): CGPACalculationResult {
  const safeCGPA = Math.min(10, Math.max(0, cgpa || 0));
  let percentage = 0;
  let formulaUsed = '';

  switch (university) {
    case 'cbse':
      percentage = safeCGPA * 9.5;
      formulaUsed = 'Percentage = CGPA × 9.5 (Official CBSE Rule)';
      break;
    case 'mumbai':
      percentage = safeCGPA * 10 - 7.5;
      if (safeCGPA < 7.0) percentage = safeCGPA * 9.5;
      formulaUsed = 'Percentage = CGPA × 10 - 7.5 (Mumbai University CBCS)';
      break;
    case 'vtu':
      percentage = (safeCGPA - 0.75) * 10;
      formulaUsed = 'Percentage = (CGPA - 0.75) × 10 (VTU Belagavi)';
      break;
    case 'du':
      percentage = safeCGPA * 9.5;
      formulaUsed = 'Percentage = CGPA × 9.5 (Delhi University)';
      break;
    case 'gtu':
      percentage = (safeCGPA - 0.5) * 10;
      formulaUsed = 'Percentage = (CGPA - 0.5) × 10 (Gujarat Technological Univ)';
      break;
    case 'sppu':
      percentage = safeCGPA * 9.5;
      formulaUsed = 'Percentage = CGPA × 9.5 (Pune University SPPU)';
      break;
    case 'aktu':
      percentage = (safeCGPA - 0.75) * 10;
      formulaUsed = 'Percentage = (CGPA - 0.75) × 10 (AKTU Lucknow)';
      break;
    case 'custom':
      percentage = safeCGPA * customMultiplier;
      formulaUsed = `Percentage = CGPA × ${customMultiplier}`;
      break;
    default:
      percentage = safeCGPA * 9.5;
      formulaUsed = 'Percentage = CGPA × 9.5';
  }

  percentage = Math.max(0, Math.min(100, percentage));

  let grade = 'O (Outstanding)';
  let division = 'First Class with Distinction';
  if (safeCGPA >= 9.0) { grade = 'O (Outstanding)'; division = 'First Class with Distinction'; }
  else if (safeCGPA >= 8.0) { grade = 'A+ (Excellent)'; division = 'First Class with Distinction'; }
  else if (safeCGPA >= 7.0) { grade = 'A (Very Good)'; division = 'First Class'; }
  else if (safeCGPA >= 6.0) { grade = 'B+ (Good)'; division = 'First Class'; }
  else if (safeCGPA >= 5.0) { grade = 'B (Above Average)'; division = 'Second Class'; }
  else if (safeCGPA >= 4.0) { grade = 'C (Pass)'; division = 'Pass Class'; }
  else { grade = 'F (Fail)'; division = 'Fail'; }

  return {
    cgpa: safeCGPA,
    percentage: parseFloat(percentage.toFixed(2)),
    formulaUsed,
    grade,
    division,
  };
}

/* ==========================================================================
   4. FANCY TEXT GENERATOR UNICODE ENGINE
   ========================================================================== */

export interface FancyStyle {
  id: string;
  name: string;
  category: 'popular' | 'bold' | 'gothic' | 'cursive' | 'symbols' | 'funky';
  transform: (text: string) => string;
}

function mapChars(text: string, charMap: Record<string, string>): string {
  return text
    .split('')
    .map((c) => charMap[c] || c)
    .join('');
}

const GOTHIC_MAP: Record<string, string> = {
  a: '𝔞', b: '𝔟', c: '𝔠', d: '𝔡', e: '𝔢', f: '𝔣', g: '𝔤', h: '𝔥', i: '𝔦', j: '𝔧', k: '𝔨', l: '𝔩', m: '𝔪',
  n: '𝔫', o: '𝔬', p: '𝔭', q: '𝔮', r: '𝔯', s: '𝔰', t: '𝔱', u: '𝔲', v: '𝔳', w: '𝔴', x: '𝔵', y: '𝔶', z: '𝔷',
  A: '𝔄', B: '𝔅', C: 'ℭ', D: '𝔇', E: '𝔈', F: '𝔉', G: '𝔖', H: 'ℌ', I: 'ℑ', J: '𝔍', K: '𝔏', L: '𝔍', M: '𝔐',
  N: '𝔑', O: '𝔒', P: '𝔓', Q: '𝔔', R: 'ℜ', S: '𝔖', T: '𝔗', U: '𝔘', V: '𝔙', W: '𝔚', X: '𝔛', Y: '𝔜', Z: 'ℨ',
};

const BOLD_MAP: Record<string, string> = {
  a: 'bold_a', b: '𝖇', c: '𝖈', d: '𝖉', e: '𝖊', f: '𝖋', g: '𝖌', h: '𝖍', i: '𝖎', j: '𝖏', k: '𝖐', l: '𝖑', m: '𝖒',
};

export function generateAllFancyTexts(text: string): { name: string; category: string; result: string }[] {
  if (!text) text = 'FileZenith Fancy Text';

  const toOffset = (baseUpper: number, baseLower: number, baseNum: number) => {
    return text.split('').map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(baseUpper + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(baseLower + (code - 97));
      if (code >= 48 && code <= 57 && baseNum) return String.fromCodePoint(baseNum + (code - 48));
      return char;
    }).join('');
  };

  return [
    {
      name: 'Mathematical Bold',
      category: 'bold',
      result: toOffset(0x1d400, 0x1d41a, 0x1d7ce),
    },
    {
      name: 'Mathematical Italic',
      category: 'bold',
      result: toOffset(0x1d434, 0x1d44e, 0),
    },
    {
      name: 'Bold Script / Cursive',
      category: 'cursive',
      result: toOffset(0x1d4d0, 0x1d4ea, 0),
    },
    {
      name: 'Fraktur / Gothic',
      category: 'gothic',
      result: mapChars(text, GOTHIC_MAP),
    },
    {
      name: 'Bold Fraktur',
      category: 'gothic',
      result: toOffset(0x1d56c, 0x1d586, 0),
    },
    {
      name: 'Double-Struck / Blackboard',
      category: 'popular',
      result: toOffset(0x1d538, 0x1d552, 0x1d7d8),
    },
    {
      name: 'Sans-Serif Bold',
      category: 'bold',
      result: toOffset(0x1d5a0, 0x1d5ba, 0x1d7ec),
    },
    {
      name: 'Monospace Code',
      category: 'popular',
      result: toOffset(0x1d670, 0x1d68a, 0x1d7f6),
    },
    {
      name: 'Circled Letters ⓈⓉⓎⓁⒺ',
      category: 'symbols',
      result: text.split('').map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x24b6 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x24d0 + (code - 97));
        return c;
      }).join(''),
    },
    {
      name: 'Squared Letters ',
      category: 'symbols',
      result: text.split('').map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1f130 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1f130 + (code - 97));
        return c;
      }).join(''),
    },
    {
      name: 'Fullwidth Vaporwave Ｆｕｌｌｗｉｄｔｈ',
      category: 'funky',
      result: text.split('').map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 33 && code <= 126) return String.fromCodePoint(0xff01 + (code - 33));
        if (c === ' ') return '  ';
        return c;
      }).join(''),
    },
    {
      name: 'Upside Down / Flip ʇxǝʇ dılℲ',
      category: 'funky',
      result: text.split('').reverse().map((c) => {
        const flipMap: Record<string, string> = {
          a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ı', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ',
          n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
          A: '∀', B: '𐐒', C: 'Ɔ', D: '◖', E: 'Ǝ', F: 'Ⅎ', G: '⅁', H: 'H', I: 'I', J: 'ſ', K: '⋊', L: '⅂', M: 'W',
          N: 'N', O: 'O', P: 'Ԁ', Q: 'circle', R: 'ᵯ', S: 'S', T: '⊥', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
          '1': '⇂', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0',
          '.': '˙', ',': "'", "'": ',', '?': '¿', '!': '¡',
        };
        return flipMap[c] || c;
      }).join(''),
    },
    {
      name: 'Strikethrough S̶t̶r̶i̶k̶e̶',
      category: 'popular',
      result: text.split('').map((c) => c + '\u0336').join(''),
    },
    {
      name: 'Underline S̲u̲n̲d̲e̲r̲l̲i̲n̲e̲',
      category: 'popular',
      result: text.split('').map((c) => c + '\u0332').join(''),
    },
    {
      name: 'Star Crown Frame ꧁★ ' + text + ' ★꧂',
      category: 'symbols',
      result: `꧁★ ${text} ★꧂`,
    },
    {
      name: 'Heart Frame ♡ ' + text + ' ♡',
      category: 'symbols',
      result: `♡ ${text} ♡`,
    },
    {
      name: 'Fire Gaming Tag ꧁༺ ' + text + ' ༻꧂',
      category: 'symbols',
      result: `꧁༺ ${text} ༻꧂`,
    },
    {
      name: 'Royal Wings ༺ ' + text + ' ༻',
      category: 'symbols',
      result: `༺ ${text} ༻`,
    },
    {
      name: 'Diamond Wings ❖ ' + text + ' ❖',
      category: 'symbols',
      result: `❖ ${text} ❖`,
    },
  ];
}

/* ==========================================================================
   5. PASSWORD GENERATOR ENGINE
   ========================================================================== */

export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean; // e.g. i, l, 1, L, o, 0, O
  mode: 'password' | 'passphrase';
  wordCount?: number;
}

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  entropyBits: number;
  timeToCrack: string;
  colorClass: string;
}

const PASSPHRASE_WORDS = [
  'apple', 'anchor', 'arrow', 'banner', 'beacon', 'breeze', 'bridge', 'castle', 'cherry', 'clover',
  'cobalt', 'comet', 'crystal', 'dragon', 'eagle', 'ember', 'falcon', 'feather', 'forest', 'frost',
  'galaxy', 'glacier', 'harbor', 'horizon', 'island', 'jasper', 'jungle', 'knight', 'lagoon', 'lantern',
  'legacy', 'legend', 'lotus', 'marble', 'meadow', 'meteor', 'monarch', 'mountain', 'nebula', 'ocean',
  'orbit', 'orchid', 'panther', 'pebble', 'phoenix', 'planet', 'prism', 'pyramid', 'quartz', 'radius',
  'raven', 'river', 'rocket', 'shadow', 'shield', 'silver', 'solar', 'spark', 'spectra', 'sphere',
  'spiral', 'spirit', 'spring', 'star', 'stellar', 'stone', 'summit', 'sunburst', 'tempest', 'thunder',
  'timber', 'titan', 'topaz', 'torrent', 'tower', 'tsunami', 'valley', 'velvet', 'vessel', 'vortex',
  'whisper', 'willow', 'wind', 'winter', 'wisdom', 'wizard', 'wolf', 'zenith', 'zephyr', 'zodiac',
];

export function generatePassword(options: PasswordGeneratorOptions): string {
  if (options.mode === 'passphrase') {
    const count = options.wordCount || 4;
    const selected: string[] = [];
    const cryptoObj = typeof window !== 'undefined' ? window.crypto : null;

    for (let i = 0; i < count; i++) {
      let randIdx = Math.floor(Math.random() * PASSPHRASE_WORDS.length);
      if (cryptoObj) {
        const randArr = new Uint32Array(1);
        cryptoObj.getRandomValues(randArr);
        randIdx = randArr[0] % PASSPHRASE_WORDS.length;
      }
      selected.push(PASSPHRASE_WORDS[randIdx]);
    }
    return selected.join('-');
  }

  let uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  let numberChars = '0123456789';
  let symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (options.excludeSimilar) {
    uppercaseChars = uppercaseChars.replace(/[IO]/g, '');
    lowercaseChars = lowercaseChars.replace(/[l]/g, '');
    numberChars = numberChars.replace(/[01]/g, '');
  }

  let charPool = '';
  const requiredChars: string[] = [];
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : null;

  const getRandomChar = (str: string) => {
    if (cryptoObj) {
      const arr = new Uint32Array(1);
      cryptoObj.getRandomValues(arr);
      return str[arr[0] % str.length];
    }
    return str[Math.floor(Math.random() * str.length)];
  };

  if (options.includeLowercase && lowercaseChars) {
    charPool += lowercaseChars;
    requiredChars.push(getRandomChar(lowercaseChars));
  }
  if (options.includeUppercase && uppercaseChars) {
    charPool += uppercaseChars;
    requiredChars.push(getRandomChar(uppercaseChars));
  }
  if (options.includeNumbers && numberChars) {
    charPool += numberChars;
    requiredChars.push(getRandomChar(numberChars));
  }
  if (options.includeSymbols && symbolChars) {
    charPool += symbolChars;
    requiredChars.push(getRandomChar(symbolChars));
  }

  if (!charPool) {
    charPool = lowercaseChars;
    requiredChars.push(getRandomChar(lowercaseChars));
  }

  const resultChars: string[] = [...requiredChars];
  const remainingLength = Math.max(0, options.length - requiredChars.length);

  for (let i = 0; i < remainingLength; i++) {
    resultChars.push(getRandomChar(charPool));
  }

  // Shuffle array using Fisher-Yates
  for (let i = resultChars.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    if (cryptoObj) {
      const randArr = new Uint32Array(1);
      cryptoObj.getRandomValues(randArr);
      j = randArr[0] % (i + 1);
    }
    [resultChars[i], resultChars[j]] = [resultChars[j], resultChars[i]];
  }

  return resultChars.join('');
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: 'Very Weak', entropyBits: 0, timeToCrack: 'Instant', colorClass: 'bg-rose-500' };
  }

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  if (poolSize === 0) poolSize = 26;

  const entropyBits = Math.floor(password.length * Math.log2(poolSize));

  // Time to crack estimation assuming 10 billion guesses/sec
  const combinations = Math.pow(poolSize, password.length);
  const secondsToCrack = combinations / 10000000000;

  let timeToCrack = 'Instant';
  if (secondsToCrack > 31536000 * 1000000) timeToCrack = 'Trillions of years';
  else if (secondsToCrack > 31536000 * 1000) timeToCrack = 'Millions of years';
  else if (secondsToCrack > 31536000) timeToCrack = `${Math.round(secondsToCrack / 31536000)} years`;
  else if (secondsToCrack > 86400) timeToCrack = `${Math.round(secondsToCrack / 86400)} days`;
  else if (secondsToCrack > 3600) timeToCrack = `${Math.round(secondsToCrack / 3600)} hours`;
  else if (secondsToCrack > 60) timeToCrack = `${Math.round(secondsToCrack / 60)} mins`;
  else timeToCrack = 'A few seconds';

  let score = 0;
  let label: PasswordStrength['label'] = 'Very Weak';
  let colorClass = 'bg-rose-500';

  if (entropyBits >= 80) {
    score = 4;
    label = 'Very Strong';
    colorClass = 'bg-emerald-500';
  } else if (entropyBits >= 60) {
    score = 3;
    label = 'Strong';
    colorClass = 'bg-teal-500';
  } else if (entropyBits >= 40) {
    score = 2;
    label = 'Fair';
    colorClass = 'bg-amber-500';
  } else if (entropyBits >= 25) {
    score = 1;
    label = 'Weak';
    colorClass = 'bg-orange-500';
  }

  return { score, label, entropyBits, timeToCrack, colorClass };
}

/* ==========================================================================
   6. NUMBER TO WORDS CONVERTER ENGINE
   ========================================================================== */

export interface NumberToWordsOptions {
  system: 'indian' | 'international';
  currency: 'INR' | 'USD' | 'EUR' | 'GBP' | 'NONE';
  caseType: 'title' | 'upper' | 'lower';
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

export function convertNumberToWords(
  numInput: number | string,
  options: NumberToWordsOptions = { system: 'indian', currency: 'INR', caseType: 'title' }
): { words: string; currencySymbol: string; formattedNumber: string } {
  const num = typeof numInput === 'string' ? parseFloat(numInput.replace(/,/g, '')) : numInput;
  const currencySymbol = options.currency === 'INR' ? '₹' : options.currency === 'USD' ? '$' : options.currency === 'EUR' ? '€' : options.currency === 'GBP' ? '£' : '';

  if (isNaN(num) || num < 0) {
    return { words: 'Zero', currencySymbol, formattedNumber: '0' };
  }

  if (num === 0) {
    let zeroStr = 'Zero';
    if (options.currency === 'INR') zeroStr = 'Zero Rupees Only';
    else if (options.currency === 'USD') zeroStr = 'Zero Dollars Only';
    return { words: zeroStr, currencySymbol, formattedNumber: '0' };
  }

  const parts = num.toString().split('.');
  const integerPart = parseInt(parts[0], 10);
  const decimalPart = parts[1] ? parseInt(parts[1].substring(0, 2), 10) : 0;

  let words = '';
  let formattedNumber = '';

  if (options.system === 'indian') {
    words = convertIndianSystem(integerPart);
    formattedNumber = integerPart.toLocaleString('en-IN');
  } else {
    words = convertInternationalSystem(integerPart);
    formattedNumber = integerPart.toLocaleString('en-US');
  }

  if (decimalPart > 0) {
    const decimalWords = convertTwoDigits(decimalPart);
    if (options.currency === 'INR') {
      words += ` Rupees and ${decimalWords} Paise Only`;
    } else if (options.currency === 'USD') {
      words += ` Dollars and ${decimalWords} Cents Only`;
    } else if (options.currency === 'EUR') {
      words += ` Euros and ${decimalWords} Cents Only`;
    } else if (options.currency === 'GBP') {
      words += ` Pounds and ${decimalWords} Pence Only`;
    } else {
      words += ` Point ${decimalWords}`;
    }
  } else {
    if (options.currency === 'INR') words += ' Rupees Only';
    else if (options.currency === 'USD') words += ' Dollars Only';
    else if (options.currency === 'EUR') words += ' Euros Only';
    else if (options.currency === 'GBP') words += ' Pounds Only';
  }

  if (options.caseType === 'upper') {
    words = words.toUpperCase();
  } else if (options.caseType === 'lower') {
    words = words.toLowerCase();
  }

  return { words, currencySymbol, formattedNumber };
}

function convertTwoDigits(n: number): string {
  if (n < 20) return ONES[n];
  return TENS[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ONES[n % 10] : '');
}

function convertThreeDigits(n: number): string {
  let str = '';
  if (n >= 100) {
    str += ONES[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n > 0) {
    str += convertTwoDigits(n);
  }
  return str.trim();
}

function convertIndianSystem(n: number): string {
  if (n === 0) return 'Zero';

  let str = '';
  const crore = Math.floor(n / 10000000);
  n %= 10000000;

  const lakh = Math.floor(n / 100000);
  n %= 100000;

  const thousand = Math.floor(n / 1000);
  n %= 1000;

  const remaining = n;

  if (crore > 0) {
    str += convertIndianSystem(crore) + ' Crore ';
  }
  if (lakh > 0) {
    str += convertTwoDigits(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    str += convertTwoDigits(thousand) + ' Thousand ';
  }
  if (remaining > 0) {
    str += convertThreeDigits(remaining);
  }

  return str.trim();
}

function convertInternationalSystem(n: number): string {
  if (n === 0) return 'Zero';

  let str = '';
  const billion = Math.floor(n / 1000000000);
  n %= 1000000000;

  const million = Math.floor(n / 1000000);
  n %= 1000000;

  const thousand = Math.floor(n / 1000);
  n %= 1000;

  const remaining = n;

  if (billion > 0) {
    str += convertThreeDigits(billion) + ' Billion ';
  }
  if (million > 0) {
    str += convertThreeDigits(million) + ' Million ';
  }
  if (thousand > 0) {
    str += convertThreeDigits(thousand) + ' Thousand ';
  }
  if (remaining > 0) {
    str += convertThreeDigits(remaining);
  }

  return str.trim();
}

/* ==========================================================================
   7. TYPING SPEED TEST WORD POOL
   ========================================================================== */

export const TYPING_TEST_PARAGRAPHS = [
  "The quick brown fox jumps over the lazy dog. Swift decision making and high typing speeds empower developers, students, and professionals to work seamlessly across digital interfaces.",
  "Technology is best when it brings people together. Building fast, responsive, and private web applications ensures that users everywhere can calculate metrics and solve daily problems without cloud latency.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. Practice typing daily to boost your words per minute and accuracy score for professional typing benchmarks.",
  "India is a land of diversity, culture, and rapid digital growth. Millions of students and professionals leverage online utility tools every single day to format documents and calculate grades effortlessly.",
  "Innovation distinguishes between a leader and a follower. Simple, elegant design combined with client-side browser execution creates high performance web experiences for every user."
];

/* ==========================================================================
   8. FINANCIAL & TAX UTILITIES ENGINE
   ========================================================================== */

export interface EMIResult {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  principal: number;
  monthlyRate: number;
  tenureMonths: number;
  schedule: { year: number; principalPaid: number; interestPaid: number; balance: number }[];
}

export function calculateEMI(principal: number, annualInterestRate: number, tenureMonths: number): EMIResult {
  const p = Math.max(0, principal);
  const r = Math.max(0, annualInterestRate / 12 / 100);
  const n = Math.max(1, tenureMonths);

  let emi = 0;
  if (r === 0) {
    emi = p / n;
  } else {
    emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const monthlyEMI = Math.round(emi);
  const totalPayment = Math.round(monthlyEMI * n);
  const totalInterest = Math.max(0, totalPayment - p);

  // Amortization Yearly Breakdown
  const schedule: { year: number; principalPaid: number; interestPaid: number; balance: number }[] = [];
  let currentBalance = p;
  const numYears = Math.ceil(n / 12);

  for (let year = 1; year <= numYears; year++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    const monthsInYear = year === numYears && n % 12 !== 0 ? n % 12 : 12;

    for (let m = 0; m < monthsInYear; m++) {
      const interestForMonth = currentBalance * r;
      const principalForMonth = Math.min(currentBalance, monthlyEMI - interestForMonth);
      yearInterest += interestForMonth;
      yearPrincipal += principalForMonth;
      currentBalance = Math.max(0, currentBalance - principalForMonth);
    }

    schedule.push({
      year,
      principalPaid: Math.round(yearPrincipal),
      interestPaid: Math.round(yearInterest),
      balance: Math.round(currentBalance)
    });
  }

  return {
    monthlyEMI,
    totalInterest,
    totalPayment,
    principal: p,
    monthlyRate: r,
    tenureMonths: n,
    schedule
  };
}

export interface IncomeTaxResult {
  grossIncome: number;
  totalDeductionsOld: number;
  taxableIncomeOld: number;
  taxableIncomeNew: number;
  taxOldRegime: number;
  taxNewRegime: number;
  cessOld: number;
  cessNew: number;
  totalTaxOld: number;
  totalTaxNew: number;
  recommendedRegime: 'NEW' | 'OLD';
  taxSavings: number;
}

export function calculateIncomeTax(
  grossIncome: number,
  deductions80C: number = 0,
  deductions80D: number = 0,
  hraExemption: number = 0,
  otherDeductions: number = 0
): IncomeTaxResult {
  const income = Math.max(0, grossIncome);
  const stdDeductionOld = 50000;
  const stdDeductionNew = 75000; // FY 2024-25 / FY 2025-26 Budget update

  // OLD REGIME CALCULATION
  const totalDeductionsOld = stdDeductionOld + Math.min(150000, deductions80C) + Math.min(100000, deductions80D) + Math.max(0, hraExemption) + Math.max(0, otherDeductions);
  const taxableIncomeOld = Math.max(0, income - totalDeductionsOld);

  let taxOld = 0;
  if (taxableIncomeOld > 1000000) {
    taxOld = 112500 + (taxableIncomeOld - 1000000) * 0.30;
  } else if (taxableIncomeOld > 500000) {
    taxOld = 12500 + (taxableIncomeOld - 500000) * 0.20;
  } else if (taxableIncomeOld > 250000) {
    taxOld = (taxableIncomeOld - 250000) * 0.05;
  }

  // Rebate u/s 87A for Old Regime if taxable <= 5L
  if (taxableIncomeOld <= 500000) {
    taxOld = 0;
  }

  const cessOld = Math.round(taxOld * 0.04);
  const totalTaxOld = Math.round(taxOld + cessOld);

  // NEW REGIME CALCULATION (FY 2024-25 slabs)
  const taxableIncomeNew = Math.max(0, income - stdDeductionNew);
  let taxNew = 0;

  if (taxableIncomeNew > 1500000) {
    taxNew = 150000 + (taxableIncomeNew - 1500000) * 0.30;
  } else if (taxableIncomeNew > 1200000) {
    taxNew = 90000 + (taxableIncomeNew - 1200000) * 0.20;
  } else if (taxableIncomeNew > 900000) {
    taxNew = 45000 + (taxableIncomeNew - 900000) * 0.15;
  } else if (taxableIncomeNew > 600000) {
    taxNew = 15000 + (taxableIncomeNew - 600000) * 0.10;
  } else if (taxableIncomeNew > 300000) {
    taxNew = (taxableIncomeNew - 300000) * 0.05;
  }

  // Rebate u/s 87A for New Regime if taxable <= 7L
  if (taxableIncomeNew <= 700000) {
    taxNew = 0;
  }

  const cessNew = Math.round(taxNew * 0.04);
  const totalTaxNew = Math.round(taxNew + cessNew);

  const recommendedRegime = totalTaxNew <= totalTaxOld ? 'NEW' : 'OLD';
  const taxSavings = Math.abs(totalTaxOld - totalTaxNew);

  return {
    grossIncome: income,
    totalDeductionsOld,
    taxableIncomeOld,
    taxableIncomeNew,
    taxOldRegime: Math.round(taxOld),
    taxNewRegime: Math.round(taxNew),
    cessOld,
    cessNew,
    totalTaxOld,
    totalTaxNew,
    recommendedRegime,
    taxSavings
  };
}

export interface SIPResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  monthlyInvestment: number;
  annualRate: number;
  years: number;
}

export function calculateSIP(monthlyInvestment: number, expectedReturnRate: number, durationYears: number): SIPResult {
  const p = Math.max(0, monthlyInvestment);
  const i = Math.max(0, expectedReturnRate / 12 / 100);
  const n = Math.max(1, durationYears * 12);

  const investedAmount = Math.round(p * n);
  let totalValue = 0;

  if (i === 0) {
    totalValue = investedAmount;
  } else {
    totalValue = Math.round(p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  }

  const estimatedReturns = Math.max(0, totalValue - investedAmount);

  return {
    investedAmount,
    estimatedReturns,
    totalValue,
    monthlyInvestment: p,
    annualRate: expectedReturnRate,
    years: durationYears
  };
}

export interface SalaryResult {
  monthlyGross: number;
  monthlyTakeHome: number;
  monthlyPFEmployee: number;
  monthlyPFEmployer: number;
  monthlyProfessionalTax: number;
  monthlyEstTDS: number;
  annualTakeHome: number;
  annualCTC: number;
}

export function calculateTakeHomeSalary(
  annualCTC: number,
  bonusAnnual: number = 0,
  pfOpted: boolean = true,
  metroCity: boolean = true
): SalaryResult {
  const ctc = Math.max(0, annualCTC);
  const bonus = Math.max(0, bonusAnnual);
  const baseSal = Math.max(0, ctc - bonus);
  const monthlyGross = Math.round(baseSal / 12);

  // Employee PF (12% of Basic, assumed Basic = 50% of CTC)
  const monthlyBasic = Math.round(monthlyGross * 0.5);
  const pfMonthly = pfOpted ? Math.round(Math.min(monthlyBasic, 15000) * 0.12) : 0;
  const profTaxMonthly = 200; // Standard PT in India (~₹200/month)

  // Estimated Tax TDS (Using New Regime default)
  const taxInfo = calculateIncomeTax(ctc);
  const monthlyTDS = Math.round(taxInfo.totalTaxNew / 12);

  const monthlyTakeHome = Math.max(0, monthlyGross - pfMonthly - profTaxMonthly - monthlyTDS);

  return {
    monthlyGross,
    monthlyTakeHome,
    monthlyPFEmployee: pfMonthly,
    monthlyPFEmployer: pfMonthly,
    monthlyProfessionalTax: profTaxMonthly,
    monthlyEstTDS: monthlyTDS,
    annualTakeHome: monthlyTakeHome * 12,
    annualCTC: ctc
  };
}

export interface GSTResult {
  netAmount: number;
  gstAmount: number;
  totalAmount: number;
  cgst: number;
  sgst: number;
  rate: number;
  isInclusive: boolean;
}

export function calculateGST(amount: number, ratePercent: number, isInclusive: boolean = false): GSTResult {
  const amt = Math.max(0, amount);
  const rate = Math.max(0, ratePercent);

  let netAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (isInclusive) {
    totalAmount = amt;
    netAmount = (amt * 100) / (100 + rate);
    gstAmount = totalAmount - netAmount;
  } else {
    netAmount = amt;
    gstAmount = (amt * rate) / 100;
    totalAmount = netAmount + gstAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  return {
    netAmount: Math.round(netAmount * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    rate,
    isInclusive
  };
}

export interface BMIResult {
  bmi: number;
  category: 'Underweight' | 'Normal Weight' | 'Overweight' | 'Obese';
  color: string;
  idealWeightMinKg: number;
  idealWeightMaxKg: number;
  healthAdvice: string;
}

export function calculateBMIDetailed(weightKg: number, heightCm: number): BMIResult {
  const w = Math.max(1, weightKg);
  const hM = Math.max(0.1, heightCm / 100);
  const bmiRaw = w / (hM * hM);
  const bmi = Math.round(bmiRaw * 10) / 10;

  // Ideal weight range for height (BMI 18.5 - 24.9)
  const idealWeightMinKg = Math.round(18.5 * hM * hM * 10) / 10;
  const idealWeightMaxKg = Math.round(24.9 * hM * hM * 10) / 10;

  let category: BMIResult['category'] = 'Normal Weight';
  let color = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let healthAdvice = 'Your BMI is within the healthy range. Maintain a balanced diet and regular physical activity.';

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'text-amber-600 bg-amber-50 border-amber-200';
    healthAdvice = 'Your BMI is below normal range. Consider increasing daily caloric intake with nutrient-rich foods.';
  } else if (bmi >= 25 && bmi < 29.9) {
    category = 'Overweight';
    color = 'text-orange-600 bg-orange-50 border-orange-200';
    healthAdvice = 'Your BMI is above healthy range. Focus on portion control, regular exercise, and active lifestyle.';
  } else if (bmi >= 30) {
    category = 'Obese';
    color = 'text-rose-600 bg-rose-50 border-rose-200';
    healthAdvice = 'Your BMI indicates obesity. Consult a healthcare provider for personalized diet and fitness guidance.';
  }

  return {
    bmi,
    category,
    color,
    idealWeightMinKg,
    idealWeightMaxKg,
    healthAdvice
  };
}

export function convertTextCase(text: string, mode: 'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab' | 'sentence'): string {
  if (!text) return '';
  switch (mode) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.toLowerCase().replace(/(?:^|\s|-|_)\S/g, (m) => m.toUpperCase());
    case 'camel':
      return text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
          index === 0 ? letter.toLowerCase() : letter.toUpperCase()
        )
        .replace(/\s+/g, '');
    case 'snake':
      return text
        .trim()
        .toLowerCase()
        .replace(/[\s\-_]+/g, '_');
    case 'kebab':
      return text
        .trim()
        .toLowerCase()
        .replace(/[\s\-_]+/g, '-');
    case 'sentence':
      return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    default:
      return text;
  }
}

export function repeatText(text: string, count: number, separator: string = ' ', addNewline: boolean = false): string {
  if (!text) return '';
  const times = Math.min(10000, Math.max(1, count));
  const delimiter = addNewline ? '\n' : separator;
  return Array(times).fill(text).join(delimiter);
}

export interface DetailedLoveMatch {
  overallScore: number;
  emotionalChemistry: number;
  zodiacMatch: number;
  vibeCompatibility: number;
  soulmateTag: string;
  badgeColor: string;
  statusHeadline: string;
  bestDateIdea: string;
  relationshipSuperpower: string;
}

export function calculateLovePercentage(
  name1: string,
  name2: string,
  zodiac1?: string,
  zodiac2?: string,
  stage?: string,
  vibe1?: string,
  vibe2?: string
): DetailedLoveMatch {
  const n1 = name1.trim().toLowerCase();
  const n2 = name2.trim().toLowerCase();
  if (!n1 || !n2) {
    return {
      overallScore: 0,
      emotionalChemistry: 0,
      zodiacMatch: 0,
      vibeCompatibility: 0,
      soulmateTag: 'Enter Names',
      badgeColor: 'bg-slate-100 text-slate-700',
      statusHeadline: 'Enter both names to calculate match!',
      bestDateIdea: 'A cozy evening coffee date.',
      relationshipSuperpower: 'Mutual laughter & good vibes.'
    };
  }

  let combined = n1 + n2 + (zodiac1 || '') + (zodiac2 || '') + (stage || '') + (vibe1 || '') + (vibe2 || '');
  let sum = 0;
  for (let i = 0; i < combined.length; i++) {
    sum += combined.charCodeAt(i) * (i + 1);
  }

  // Deterministic calculation in 68% - 99% range for uplifting fun match experience
  const overallScore = 68 + (sum % 32);
  const emotionalChemistry = Math.min(99, Math.max(65, 60 + ((sum * 3) % 40)));
  const zodiacMatch = Math.min(99, Math.max(70, 70 + ((sum * 7) % 30)));
  const vibeCompatibility = vibe1 === vibe2 ? 98 : Math.min(99, Math.max(65, 65 + ((sum * 5) % 35)));

  let soulmateTag = 'Written in the Stars ✨';
  let badgeColor = 'from-rose-500 to-pink-600';
  let statusHeadline = 'A Match Made in Heaven! 💖';
  let bestDateIdea = 'Sunset stargazing, deep conversations & favorite music.';
  let relationshipSuperpower = 'Unbreakable emotional trust & magnetic attraction.';

  if (overallScore >= 95) {
    soulmateTag = 'Twin Flame Energy 🔥';
    statusHeadline = 'Unstoppable Power Couple! 👑';
    bestDateIdea = 'Spontaneous weekend getaway or cozy rooftop stargazing.';
    relationshipSuperpower = 'Telepathic understanding & electric chemistry.';
  } else if (overallScore >= 88) {
    soulmateTag = 'Soulmate Level 💕';
    statusHeadline = 'Deep Harmony & Enduring Love! 💖';
    bestDateIdea = 'Candlelight dinner followed by late night drive & ice cream.';
    relationshipSuperpower = 'Effortless laughter and constant support.';
  } else if (overallScore >= 78) {
    soulmateTag = 'Cute & Charming Pair 🌸';
    statusHeadline = 'Strong Connection & Mutual Support! 💞';
    bestDateIdea = 'Exploring a vibrant night market & trying new street food.';
    relationshipSuperpower = 'Playful banter & mutual respect.';
  } else {
    soulmateTag = 'Exciting Adventure Ahead 🚀';
    statusHeadline = 'Promising Connection! Full of Spark! ⚡';
    bestDateIdea = 'Fun arcade game night or coffee & book store tour.';
    relationshipSuperpower = 'Inspiring each other to try new things.';
  }

  return {
    overallScore,
    emotionalChemistry,
    zodiacMatch,
    vibeCompatibility,
    soulmateTag,
    badgeColor,
    statusHeadline,
    bestDateIdea,
    relationshipSuperpower
  };
}




