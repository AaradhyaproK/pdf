'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument, rgb } from 'pdf-lib';
import { toast } from 'sonner';
import {
  Heart,
  Gift,
  Sparkles,
  Download,
  Printer,
  Camera,
  Palette,
  Sliders,
  Smile,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Trash2,
  Layout,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Type,
  Mail,
  Award,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Quote,
  Stamp,
  Shuffle,
  Feather,
  Check,
  Eye,
  BookOpen,
  RotateCw,
  X,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { FileReadyModal } from '@/components/FileReadyModal';

type Occasion = 'love' | 'birthday' | 'thankyou' | 'wedding' | 'friendship' | 'custom';
type CardFormat = 'bifold' | 'flat_5x7' | 'story';
type PhotoShape = 'arch' | 'heart' | 'oval' | 'rect' | 'polaroid';
type CardTheme =
  | 'blush'
  | 'midnight'
  | 'sage'
  | 'champagne'
  | 'lavender'
  | 'terracotta'
  | 'kraft'
  | 'minimal';
type FontStyle = 'script' | 'serif' | 'sans' | 'retro' | 'playful';
type CardFrameStyle = 'royal_gold' | 'deckled_edge' | 'botanical' | 'airmail' | 'modern_minimal';
type WashiTape = 'none' | 'gold_foil' | 'rose_blush' | 'sage_botanical' | 'kraft_paper';
type StampStyle = 'none' | 'wax_heart' | 'wax_flower' | 'airmail_post' | 'star_crest' | 'love_envelope';
type PreviewViewMode = 'cover' | 'inside' | 'back' | 'sheet';

interface ThemeConfig {
  name: string;
  bgHex: string;
  cardHex: string;
  primaryHex: string;
  accentHex: string;
  borderHex: string;
  isDark: boolean;
}

const THEMES: Record<CardTheme, ThemeConfig> = {
  blush: {
    name: 'Blush Velvet & Rose Gold',
    bgHex: '#FFF5F6',
    cardHex: '#FFFBFB',
    primaryHex: '#9F1239',
    accentHex: '#E11D48',
    borderHex: '#FECDD3',
    isDark: false,
  },
  champagne: {
    name: 'Champagne & Warm Ivory',
    bgHex: '#FAF7F2',
    cardHex: '#FFFDF9',
    primaryHex: '#44403C',
    accentHex: '#B45309',
    borderHex: '#E7E5E4',
    isDark: false,
  },
  sage: {
    name: 'Botanical Sage & Forest',
    bgHex: '#F0FDF4',
    cardHex: '#F7FEFA',
    primaryHex: '#064E3B',
    accentHex: '#059669',
    borderHex: '#A7F3D0',
    isDark: false,
  },
  terracotta: {
    name: 'Terracotta & Warm Clay',
    bgHex: '#FAF5EF',
    cardHex: '#FFFDFB',
    primaryHex: '#7C2D12',
    accentHex: '#C2410C',
    borderHex: '#FED7AA',
    isDark: false,
  },
  midnight: {
    name: 'Midnight Navy & Gold',
    bgHex: '#0B0F19',
    cardHex: '#131B2E',
    primaryHex: '#F8FAFC',
    accentHex: '#F59E0B',
    borderHex: '#25334D',
    isDark: true,
  },
  lavender: {
    name: 'Pastel Lilac & Violet',
    bgHex: '#FAF5FF',
    cardHex: '#FDFBFF',
    primaryHex: '#4C1D95',
    accentHex: '#7C3AED',
    borderHex: '#DDD6FE',
    isDark: false,
  },
  kraft: {
    name: 'Rustic Kraft & Sepia',
    bgHex: '#F5EBE1',
    cardHex: '#EFE3D5',
    primaryHex: '#3E2723',
    accentHex: '#8D6E63',
    borderHex: '#D7CCC8',
    isDark: false,
  },
  minimal: {
    name: 'Modern Pure White & Noir',
    bgHex: '#F8FAFC',
    cardHex: '#FFFFFF',
    primaryHex: '#0F172A',
    accentHex: '#475569',
    borderHex: '#E2E8F0',
    isDark: false,
  },
};

interface QuoteCategory {
  title: string;
  quotes: string[];
}

const VIRAL_QUOTES: QuoteCategory[] = [
  {
    title: 'Poetic & Deep Meaning',
    quotes: [
      '“Kind words can be short and easy to speak, but their echoes are truly endless.”',
      '“In all the world, there is no heart for me like yours.”',
      '“To the world you may be one person, but to me you are the whole world.”',
      '“I loved you yesterday, I love you still, I always have, I always will.”',
      '“The best thing to hold onto in life is each other.”',
    ],
  },
  {
    title: 'Romantic & Anniversary',
    quotes: [
      '“I have found the one whom my soul loves.”',
      '“You are my today and all of my tomorrows.”',
      '“Together is my favorite place to be in this whole world.”',
      '“Since the day we met, my heart knew it had found home.”',
      '“Loving you is the easiest, most beautiful thing I have ever done.”',
    ],
  },
  {
    title: 'Short, Aesthetic 1-Liners',
    quotes: [
      '“Forever grateful for you.”',
      '“You make everyday feel like golden hour.”',
      '“My favorite notification, my favorite person.”',
      '“Home is wherever you are.”',
      '“A little reminder that you are deeply loved.”',
    ],
  },
  {
    title: 'Birthday & Milestone',
    quotes: [
      '“Another trip around the sun and more wonderful than ever!”',
      '“Count your age by friends, not years. Count your life by smiles, not tears.”',
      '“May this year bring you all the magic and joy you give to others.”',
      '“Here is to celebrating another radiant year of you!”',
    ],
  },
  {
    title: 'Friendship & Thinking of You',
    quotes: [
      '“Good friends are like stars: you may not always see them, but they are always there.”',
      '“Life is so much sweeter and louder with you in it.”',
      '“You are my person. You will always be my person.”',
      '“Sending you the biggest warm hug across the miles.”',
    ],
  },
];

const OCCASIONS: Array<{
  id: Occasion;
  label: string;
  icon: typeof Heart;
  tagline: string;
  defaultTheme: CardTheme;
  defaultRecipient: string;
  defaultHeadline: string;
  defaultNote: string;
  defaultSignature: string;
}> = [
  {
    id: 'love',
    label: 'Love & Anniversary',
    icon: Heart,
    tagline: 'Valentine, couple milestones & romantic vows',
    defaultTheme: 'blush',
    defaultRecipient: 'To My One & Only',
    defaultHeadline: 'Happy Anniversary, My Love',
    defaultNote:
      'Every single moment with you is my favorite memory. Thank you for filling my world with boundless laughter, gentle warmth, and unconditional love.',
    defaultSignature: 'Forever & Always Yours ❤️',
  },
  {
    id: 'birthday',
    label: 'Birthday Celebration',
    icon: Gift,
    tagline: 'Milestone birthdays, family & friends',
    defaultTheme: 'champagne',
    defaultRecipient: 'To the Most Wonderful Soul',
    defaultHeadline: 'Wishing You The Happiest Birthday!',
    defaultNote:
      'May your special day be brimming with boundless joy, sweet surprises, and everything that makes your heart smile. Here is to celebrating another radiant year of you!',
    defaultSignature: 'With All My Love & Cheers 🎂',
  },
  {
    id: 'thankyou',
    label: 'Thank You & Gratitude',
    icon: Award,
    tagline: 'Appreciation, kindness & mentors',
    defaultTheme: 'sage',
    defaultRecipient: 'With Sincere Appreciation',
    defaultHeadline: 'Thank You From The Heart',
    defaultNote: '“Kind words can be short and easy to speak, but their echoes are truly endless.”',
    defaultSignature: 'With Deepest Gratitude',
  },
  {
    id: 'wedding',
    label: 'Wedding & Engagement',
    icon: Sparkles,
    tagline: 'Newlyweds, bridal showers & vows',
    defaultTheme: 'terracotta',
    defaultRecipient: 'To The Beautiful Couple',
    defaultHeadline: 'Congratulations on Your Wedding Day!',
    defaultNote:
      'Wishing you a lifetime filled with deep romance, shared laughter, and an ever-growing love. May your wonderful journey together be blessed with endless happiness!',
    defaultSignature: 'With Warmest Congratulations',
  },
  {
    id: 'friendship',
    label: 'Thinking of You',
    icon: Mail,
    tagline: 'Best friends, warm hugs across miles',
    defaultTheme: 'lavender',
    defaultRecipient: 'To My Favorite Bestie',
    defaultHeadline: 'Just A Reminder That You Are Loved',
    defaultNote:
      'Sending you a big warm hug across the miles today. No matter how busy or wild life gets, you will always be one of the brightest treasures in my life.',
    defaultSignature: 'Your Best Friend Forever',
  },
  {
    id: 'custom',
    label: 'Blank Custom Card',
    icon: Sliders,
    tagline: 'Design from scratch with total freedom',
    defaultTheme: 'minimal',
    defaultRecipient: 'Dear Maya',
    defaultHeadline: 'Thinking of You Today',
    defaultNote: '“Kind words can be short and easy to speak, but their echoes are truly endless.”',
    defaultSignature: 'With Love',
  },
];

function cleanForWinAnsi(text: string): string {
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, '-')
    .replace(/[•]/g, '-')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '')
    .trim();
}

export default function GreetingCardMakerPage() {
  const [occasion, setOccasion] = useState<Occasion>('love');
  const [format, setFormat] = useState<CardFormat>('bifold');
  const [theme, setTheme] = useState<CardTheme>('blush');
  const [frameStyle, setFrameStyle] = useState<CardFrameStyle>('royal_gold');
  const [photoShape, setPhotoShape] = useState<PhotoShape>('arch');
  const [fontStyle, setFontStyle] = useState<FontStyle>('script');
  const [washiTape, setWashiTape] = useState<WashiTape>('gold_foil');
  const [stampStyle, setStampStyle] = useState<StampStyle>('wax_heart');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [filter, setFilter] = useState<'natural' | 'warm' | 'romance' | 'noir' | 'golden'>('warm');

  // Text state
  const [recipient, setRecipient] = useState<string>('To My One & Only');
  const [headline, setHeadline] = useState<string>('Happy Anniversary, My Love');
  const [insideNote, setInsideNote] = useState<string>(
    '“Kind words can be short and easy to speak, but their echoes are truly endless.”'
  );
  const [signature, setSignature] = useState<string>('Forever & Always Yours ❤️');

  // Fine-Grained Note Customization Controls
  const [noteFontSize, setNoteFontSize] = useState<number>(24);
  const [noteLineHeight, setNoteLineHeight] = useState<number>(1.4);
  const [noteAlign, setNoteAlign] = useState<'center' | 'left' | 'right'>('center');
  const [noteSingleLineFit, setNoteSingleLineFit] = useState<boolean>(false);
  const [showQuotationGlyphs, setShowQuotationGlyphs] = useState<boolean>(true);

  // Active Quote Tab
  const [selectedQuoteCategory, setSelectedQuoteCategory] = useState<number>(0);

  // Preview Mode: 'cover' (Folded Card Front) | 'inside' (Inside Spread) | 'back' (Back Keepsake) | 'sheet' (A4 Bi-Fold Print Sheet)
  const [previewView, setPreviewView] = useState<PreviewViewMode>('cover');

  // Preview Zoom & Fullscreen Modal State
  const [previewZoom, setPreviewZoom] = useState<number>(1.0);
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState<boolean>(false);
  const [fullPreviewZoom, setFullPreviewZoom] = useState<number>(1.0);

  // Processing & Export
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState('');
  const [downloadType, setDownloadType] = useState<'png' | 'pdf'>('png');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Turn Page / Cycle View Mode
  const handleTurnPage = () => {
    if (format !== 'bifold') {
      setPreviewView((prev) => (prev === 'cover' ? 'back' : 'cover'));
      return;
    }

    if (previewView === 'cover') {
      setPreviewView('inside');
      toast('Turned to Inside Letter Spread 📖', { duration: 1500 });
    } else if (previewView === 'inside') {
      setPreviewView('back');
      toast('Turned to Back Keepsake Cover 💌', { duration: 1500 });
    } else if (previewView === 'back') {
      setPreviewView('sheet');
      toast('Switched to A4 Printable Sheet 🖨️', { duration: 1500 });
    } else {
      setPreviewView('cover');
      toast('Turned to Front Cover ✨', { duration: 1500 });
    }
  };

  // Switch Occasion Presets
  const handleSelectOccasion = (occId: Occasion) => {
    setOccasion(occId);
    const target = OCCASIONS.find((o) => o.id === occId);
    if (target) {
      setTheme(target.defaultTheme);
      setRecipient(target.defaultRecipient);
      setHeadline(target.defaultHeadline);
      setInsideNote(target.defaultNote);
      setSignature(target.defaultSignature);
    }
  };

  // Shuffle / Surprise Me Generator
  const handleSurpriseMe = () => {
    const themeKeys: CardTheme[] = ['blush', 'champagne', 'sage', 'terracotta', 'midnight', 'lavender'];
    const frames: CardFrameStyle[] = ['royal_gold', 'deckled_edge', 'botanical', 'airmail'];
    const shapes: PhotoShape[] = ['arch', 'heart', 'oval', 'rect'];
    const fonts: FontStyle[] = ['script', 'serif', 'sans', 'retro'];
    const tapes: WashiTape[] = ['gold_foil', 'rose_blush', 'sage_botanical', 'none'];
    const stamps: StampStyle[] = ['wax_heart', 'wax_flower', 'airmail_post', 'star_crest'];

    const randomTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    const randomFrame = frames[Math.floor(Math.random() * frames.length)];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    const randomTape = tapes[Math.floor(Math.random() * tapes.length)];
    const randomStamp = stamps[Math.floor(Math.random() * stamps.length)];

    setTheme(randomTheme);
    setFrameStyle(randomFrame);
    setPhotoShape(randomShape);
    setFontStyle(randomFont);
    setWashiTape(randomTape);
    setStampStyle(randomStamp);

    toast.success('Generated new aesthetic combination!');
  };

  // Upload Photo
  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    toast.success('Photo loaded into browser memory!');
  };

  const handleRemovePhoto = () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(null);
    toast('Photo removed', { icon: '🗑️' });
  };

  // Helper to load image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Render Canvas
  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const activeTheme = THEMES[theme];

    // High resolution rendering buffer:
    // Bi-Fold Sheet mode or Inside Spread: 2400 × 1680 (Two panels side by side)
    // Cover view / Back view: 1200 × 1680 (5:7 ratio)
    // Story view: 1080 × 1920 (9:16 mobile)
    const isDualPanel = previewView === 'sheet' || previewView === 'inside';

    let cWidth = 1200;
    let cHeight = 1680;

    if (isDualPanel) {
      cWidth = 2400;
      cHeight = 1680;
    } else if (format === 'story') {
      cWidth = 1080;
      cHeight = 1920;
    }

    canvas.width = cWidth;
    canvas.height = cHeight;

    // 1. Draw Outer Background
    ctx.fillStyle = activeTheme.bgHex;
    ctx.fillRect(0, 0, cWidth, cHeight);

    // Apply Filter Helper
    const drawFilteredImage = (img: HTMLImageElement, dx: number, dy: number, dw: number, dh: number) => {
      ctx.save();
      if (filter === 'warm') {
        ctx.filter = 'sepia(0.2) contrast(1.05) brightness(1.02)';
      } else if (filter === 'romance') {
        ctx.filter = 'contrast(1.02) saturate(1.18) brightness(1.04)';
      } else if (filter === 'noir') {
        ctx.filter = 'grayscale(1) contrast(1.2)';
      } else if (filter === 'golden') {
        ctx.filter = 'sepia(0.35) saturate(1.25) brightness(1.05)';
      } else {
        ctx.filter = 'none';
      }

      // Center crop with zoom
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const boxAspect = dw / dh;
      let sx = 0,
        sy = 0,
        sw = img.naturalWidth,
        sh = img.naturalHeight;

      if (imgAspect > boxAspect) {
        sw = img.naturalHeight * boxAspect;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / boxAspect;
        sy = (img.naturalHeight - sh) / 2;
      }

      const z = Math.max(1, zoom);
      const cropW = sw / z;
      const cropH = sh / z;
      const cropX = sx + (sw - cropW) / 2;
      const cropY = sy + (sh - cropH) / 2;

      ctx.drawImage(img, cropX, cropY, cropW, cropH, dx, dy, dw, dh);
      ctx.restore();
    };

    // Draw Ornate Frames & Border Enhancements
    const drawCardFrames = (ox: number, oy: number, w: number, h: number) => {
      if (frameStyle === 'royal_gold') {
        // Metallic Gold Foil Look
        ctx.save();
        ctx.strokeStyle = activeTheme.accentHex;
        ctx.lineWidth = 5;
        ctx.strokeRect(ox + 24, oy + 24, w - 48, h - 48);

        // Inner hairline gold line
        ctx.strokeStyle = activeTheme.isDark ? '#F59E0B' : '#D97706';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ox + 34, oy + 34, w - 68, h - 68);

        // Corner Victorian filigree ornaments
        ctx.fillStyle = activeTheme.isDark ? '#F59E0B' : '#D97706';
        ctx.font = '28px serif';
        ctx.textAlign = 'center';
        ctx.fillText('❖', ox + 50, oy + 58);
        ctx.fillText('❖', ox + w - 50, oy + 58);
        ctx.fillText('❖', ox + 50, oy + h - 46);
        ctx.fillText('❖', ox + w - 50, oy + h - 46);
        ctx.restore();
      } else if (frameStyle === 'deckled_edge') {
        // Deckled Vintage Paper Edge with subtle dotted perimeter
        ctx.save();
        ctx.strokeStyle = activeTheme.borderHex;
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.strokeRect(ox + 20, oy + 20, w - 40, h - 40);
        ctx.setLineDash([]);
        ctx.strokeStyle = activeTheme.accentHex;
        ctx.lineWidth = 1;
        ctx.strokeRect(ox + 28, oy + 28, w - 56, h - 56);
        ctx.restore();
      } else if (frameStyle === 'botanical') {
        // Botanical Leaves on corners
        ctx.save();
        ctx.strokeStyle = activeTheme.borderHex;
        ctx.lineWidth = 3;
        ctx.strokeRect(ox + 22, oy + 22, w - 44, h - 44);
        ctx.fillStyle = activeTheme.accentHex;
        ctx.font = '24px serif';
        ctx.fillText('🌿', ox + 42, oy + 52);
        ctx.fillText('🌿', ox + w - 42, oy + 52);
        ctx.fillText('🌿', ox + 42, oy + h - 40);
        ctx.fillText('🌿', ox + w - 42, oy + h - 40);
        ctx.restore();
      } else if (frameStyle === 'airmail') {
        // Air Mail Postcard Chevron border
        ctx.save();
        ctx.strokeStyle = '#E11D48';
        ctx.lineWidth = 4;
        ctx.strokeRect(ox + 18, oy + 18, w - 36, h - 36);
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 2;
        ctx.setLineDash([16, 12]);
        ctx.strokeRect(ox + 26, oy + 26, w - 52, h - 52);
        ctx.restore();
      } else {
        // Modern Minimal
        ctx.save();
        ctx.strokeStyle = activeTheme.borderHex;
        ctx.lineWidth = 2;
        ctx.strokeRect(ox + 20, oy + 20, w - 40, h - 40);
        ctx.restore();
      }
    };

    // Helper to draw the Front Cover
    const drawFrontCover = async (ox: number, oy: number, w: number, h: number) => {
      // 1. Panel Background
      ctx.fillStyle = activeTheme.cardHex;
      ctx.fillRect(ox, oy, w, h);

      // 2. Draw Frame Style
      drawCardFrames(ox, oy, w, h);

      // 3. Recipient Header (Centered, Spaced)
      ctx.textAlign = 'center';
      ctx.fillStyle = activeTheme.accentHex;
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText(recipient.toUpperCase(), ox + w / 2, oy + 82);
      ctx.letterSpacing = '0px';

      // 4. Headline
      ctx.fillStyle = activeTheme.primaryHex;
      if (fontStyle === 'script') {
        ctx.font = 'italic bold 46px Georgia, serif';
      } else if (fontStyle === 'serif') {
        ctx.font = 'bold 42px "Times New Roman", serif';
      } else if (fontStyle === 'retro') {
        ctx.font = 'bold 36px monospace';
      } else if (fontStyle === 'playful') {
        ctx.font = 'bold 42px "Comic Sans MS", cursive, sans-serif';
      } else {
        ctx.font = 'bold 38px system-ui, sans-serif';
      }

      // Auto-wrap Headline
      const headlineWords = headline.split(' ');
      let headLine = '';
      let headY = oy + 140;
      for (let n = 0; n < headlineWords.length; n++) {
        const testLine = headLine + headlineWords[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > w - 160 && n > 0) {
          ctx.fillText(headLine.trim(), ox + w / 2, headY);
          headLine = headlineWords[n] + ' ';
          headY += 50;
        } else {
          headLine = testLine;
        }
      }
      ctx.fillText(headLine.trim(), ox + w / 2, headY);

      // 5. Photo Geometry
      const frameY = headY + 28;
      const frameW = w * 0.68;
      const frameH = h * 0.42;
      const frameX = ox + (w - frameW) / 2;

      ctx.save();
      ctx.beginPath();
      if (photoShape === 'arch') {
        const r = frameW / 2;
        ctx.arc(frameX + r, frameY + r, r, Math.PI, 0, false);
        ctx.lineTo(frameX + frameW, frameY + frameH);
        ctx.lineTo(frameX, frameY + frameH);
        ctx.closePath();
      } else if (photoShape === 'oval') {
        ctx.ellipse(frameX + frameW / 2, frameY + frameH / 2, frameW / 2, frameH / 2, 0, 0, Math.PI * 2);
      } else if (photoShape === 'heart') {
        const hx = frameX + frameW / 2;
        const hy = frameY + frameH * 0.35;
        const hr = frameW * 0.28;
        ctx.moveTo(hx, hy + hr * 1.5);
        ctx.bezierCurveTo(hx - hr * 2, hy, hx - hr * 1.5, hy - hr * 1.2, hx, hy - hr * 0.4);
        ctx.bezierCurveTo(hx + hr * 1.5, hy - hr * 1.2, hx + hr * 2, hy, hx, hy + hr * 1.5);
      } else {
        ctx.roundRect(frameX, frameY, frameW, frameH, 20);
      }
      ctx.clip();

      if (photoUrl) {
        try {
          const img = await loadImage(photoUrl);
          drawFilteredImage(img, frameX, frameY, frameW, frameH);
        } catch (e) {
          console.error(e);
        }
      } else {
        // Placeholder
        ctx.fillStyle = activeTheme.isDark ? '#1E293B' : '#F8FAFC';
        ctx.fillRect(frameX, frameY, frameW, frameH);
        ctx.fillStyle = activeTheme.accentHex;
        ctx.font = 'bold 30px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('📷 Upload Couple / Memory Photo', frameX + frameW / 2, frameY + frameH / 2 - 10);
        ctx.fillStyle = activeTheme.isDark ? '#94A3B8' : '#64748B';
        ctx.font = '19px sans-serif';
        ctx.fillText('Click "Upload Photo" on the left', frameX + frameW / 2, frameY + frameH / 2 + 25);
      }
      ctx.restore();

      // Outer Stroke around photo
      ctx.strokeStyle = activeTheme.accentHex;
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (photoShape === 'arch') {
        const r = frameW / 2;
        ctx.arc(frameX + r, frameY + r, r, Math.PI, 0, false);
        ctx.lineTo(frameX + frameW, frameY + frameH);
        ctx.lineTo(frameX, frameY + frameH);
        ctx.closePath();
      } else if (photoShape === 'oval') {
        ctx.ellipse(frameX + frameW / 2, frameY + frameH / 2, frameW / 2, frameH / 2, 0, 0, Math.PI * 2);
      } else {
        ctx.roundRect(frameX, frameY, frameW, frameH, 20);
      }
      ctx.stroke();

      // Optional Washi Tape across top center of photo
      if (washiTape !== 'none') {
        ctx.save();
        const tapeW = frameW * 0.42;
        const tapeH = 26;
        const tapeX = frameX + (frameW - tapeW) / 2;
        const tapeY = frameY - 12;

        ctx.translate(tapeX + tapeW / 2, tapeY + tapeH / 2);
        ctx.rotate(-0.03); // Slight realistic tilt

        if (washiTape === 'gold_foil') {
          ctx.fillStyle = '#D97706';
        } else if (washiTape === 'rose_blush') {
          ctx.fillStyle = '#FB7185';
        } else if (washiTape === 'sage_botanical') {
          ctx.fillStyle = '#34D399';
        } else {
          ctx.fillStyle = '#D7CCC8';
        }
        ctx.globalAlpha = 0.85;
        ctx.fillRect(-tapeW / 2, -tapeH / 2, tapeW, tapeH);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.strokeRect(-tapeW / 2, -tapeH / 2, tapeW, tapeH);
        ctx.restore();
      }

      // 6. HEARTFELT MESSAGE / LOVE NOTE (Controlled Layout Engine)
      const noteStartY = frameY + frameH + 42;
      const maxNoteWidth = w - 180;

      // Clean or preserve quotes
      let formattedNote = insideNote.trim();
      if (showQuotationGlyphs && !formattedNote.startsWith('“') && !formattedNote.startsWith('"')) {
        formattedNote = `“${formattedNote}”`;
      }

      // Set Font & Style based on user controls
      let activeFontSize = noteFontSize;
      const activeLineSpacing = activeFontSize * noteLineHeight;

      ctx.save();
      ctx.fillStyle = activeTheme.primaryHex;

      const fontFace =
        fontStyle === 'script'
          ? 'italic Georgia, serif'
          : fontStyle === 'serif'
          ? '"Times New Roman", serif'
          : fontStyle === 'retro'
          ? 'monospace'
          : 'system-ui, sans-serif';

      ctx.font = `${activeFontSize}px ${fontFace}`;

      // Single Line Fit Calculation
      if (noteSingleLineFit) {
        let measured = ctx.measureText(formattedNote).width;
        while (measured > maxNoteWidth && activeFontSize > 14) {
          activeFontSize -= 1;
          ctx.font = `${activeFontSize}px ${fontFace}`;
          measured = ctx.measureText(formattedNote).width;
        }
      }

      // Determine text alignment position
      let noteX = ox + w / 2;
      if (noteAlign === 'left') {
        noteX = ox + 90;
        ctx.textAlign = 'left';
      } else if (noteAlign === 'right') {
        noteX = ox + w - 90;
        ctx.textAlign = 'right';
      } else {
        ctx.textAlign = 'center';
      }

      // Render lines (respecting manual line breaks \n AND soft wrapping)
      const paragraphs = formattedNote.split('\n');
      let curNoteY = noteStartY;

      for (const para of paragraphs) {
        if (noteSingleLineFit) {
          ctx.fillText(para, noteX, curNoteY);
          curNoteY += activeLineSpacing;
        } else {
          const words = para.split(' ');
          let currentLine = '';

          for (let n = 0; n < words.length; n++) {
            const test = currentLine + words[n] + ' ';
            const m = ctx.measureText(test);
            if (m.width > maxNoteWidth && n > 0) {
              ctx.fillText(currentLine.trim(), noteX, curNoteY);
              currentLine = words[n] + ' ';
              curNoteY += activeLineSpacing;
            } else {
              currentLine = test;
            }
          }
          if (currentLine.trim().length > 0) {
            ctx.fillText(currentLine.trim(), noteX, curNoteY);
            curNoteY += activeLineSpacing;
          }
        }
      }
      ctx.restore();

      // 7. Signature (Centered, with heart accent)
      const sigY = curNoteY + 22;
      ctx.textAlign = 'center';
      ctx.fillStyle = activeTheme.accentHex;
      ctx.font = fontStyle === 'script' ? 'bold italic 32px cursive, Georgia' : 'bold 26px serif';
      ctx.fillText(signature, ox + w / 2, sigY);

      // 8. Bottom Seal / Postal Stamp
      if (stampStyle !== 'none') {
        const stampY = oy + h - 56;
        ctx.textAlign = 'center';

        if (stampStyle === 'airmail_post') {
          // Circular Postal Cancellation Stamp
          ctx.save();
          ctx.strokeStyle = activeTheme.isDark ? '#F59E0B' : '#C2410C';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ox + w / 2, stampY, 26, 0, Math.PI * 2);
          ctx.stroke();
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = activeTheme.isDark ? '#F59E0B' : '#C2410C';
          ctx.fillText('PAR AVION', ox + w / 2, stampY - 6);
          ctx.fillText('SPECIAL LOVE', ox + w / 2, stampY + 7);
          ctx.restore();
        } else {
          // Wax Seals & Icons
          ctx.font = '36px sans-serif';
          let icon = '❤️';
          if (stampStyle === 'wax_flower') icon = '🌸';
          else if (stampStyle === 'star_crest') icon = '✨';
          else if (stampStyle === 'love_envelope') icon = '💌';
          ctx.fillText(icon, ox + w / 2, stampY);
        }
      }
    };

    // Helper to draw Back Cover (for A4 Bi-fold sheet & Back view)
    const drawBackCover = (ox: number, oy: number, w: number, h: number) => {
      ctx.fillStyle = activeTheme.cardHex;
      ctx.fillRect(ox, oy, w, h);

      // Subtle border matching front
      drawCardFrames(ox, oy, w, h);

      // Center romantic keepsake note
      ctx.textAlign = 'center';
      ctx.fillStyle = activeTheme.accentHex;
      ctx.font = 'italic 24px Georgia, serif';
      ctx.fillText('“A keepsake to cherish forever.”', ox + w / 2, oy + h / 2 - 40);

      // Decorative emblem
      ctx.font = '42px sans-serif';
      ctx.fillText('💌', ox + w / 2, oy + h / 2 + 15);

      // Back cover credit
      ctx.fillStyle = activeTheme.isDark ? '#64748B' : '#94A3B8';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText(`Handcrafted with Love for ${recipient}`, ox + w / 2, oy + h - 100);
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('Made with FileZenith Free Card Studio', ox + w / 2, oy + h - 75);
    };

    // Helper to draw Inside Letter Spread (Open Card 2-Page View)
    const drawInsideSpread = async (w: number, h: number) => {
      const panelW = w / 2;
      const panelH = h;

      // 1. LEFT INSIDE PAGE (Photo & Keepsake Inscription)
      ctx.fillStyle = activeTheme.cardHex;
      ctx.fillRect(0, 0, panelW, panelH);
      drawCardFrames(0, 0, panelW, panelH);

      // Left Page Header
      ctx.textAlign = 'center';
      ctx.fillStyle = activeTheme.accentHex;
      ctx.font = 'bold 20px system-ui, sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText('MEMORIES & KEEPSAKES', panelW / 2, 85);
      ctx.letterSpacing = '0px';

      // Photo on Left Page
      const lPhotoW = panelW * 0.72;
      const lPhotoH = panelH * 0.52;
      const lPhotoX = (panelW - lPhotoW) / 2;
      const lPhotoY = 130;

      ctx.save();
      ctx.roundRect(lPhotoX, lPhotoY, lPhotoW, lPhotoH, 16);
      ctx.clip();
      if (photoUrl) {
        try {
          const img = await loadImage(photoUrl);
          drawFilteredImage(img, lPhotoX, lPhotoY, lPhotoW, lPhotoH);
        } catch (e) {
          console.error(e);
        }
      } else {
        ctx.fillStyle = activeTheme.isDark ? '#1E293B' : '#F1F5F9';
        ctx.fillRect(lPhotoX, lPhotoY, lPhotoW, lPhotoH);
        ctx.fillStyle = activeTheme.accentHex;
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('📷 Couple / Memory Photo', panelW / 2, lPhotoY + lPhotoH / 2);
      }
      ctx.restore();

      // Gold border around left photo
      ctx.strokeStyle = activeTheme.accentHex;
      ctx.lineWidth = 3;
      ctx.strokeRect(lPhotoX, lPhotoY, lPhotoW, lPhotoH);

      // Left Page Romantic Inscription
      ctx.fillStyle = activeTheme.primaryHex;
      ctx.font = 'italic 24px Georgia, serif';
      ctx.fillText('“Forever grateful for every single moment with you.”', panelW / 2, lPhotoY + lPhotoH + 60);

      // 2. RIGHT INSIDE PAGE (Handwritten Love Letter Spread)
      ctx.fillStyle = activeTheme.cardHex;
      ctx.fillRect(panelW, 0, panelW, panelH);
      drawCardFrames(panelW, 0, panelW, panelH);

      // Center Fold Shadow Effect
      const foldShadow = ctx.createLinearGradient(panelW - 30, 0, panelW + 30, 0);
      foldShadow.addColorStop(0, 'rgba(0,0,0,0)');
      foldShadow.addColorStop(0.5, 'rgba(0,0,0,0.08)');
      foldShadow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = foldShadow;
      ctx.fillRect(panelW - 30, 0, 60, panelH);

      // Salutation (Right Page)
      ctx.textAlign = 'left';
      ctx.fillStyle = activeTheme.accentHex;
      ctx.font = fontStyle === 'script' ? 'bold italic 36px cursive, Georgia' : 'bold 28px serif';
      ctx.fillText(`My Dearest ${recipient},`, panelW + 90, 110);

      // Inside Note Paragraphs
      ctx.fillStyle = activeTheme.primaryHex;
      ctx.font = `${Math.max(22, noteFontSize)}px Georgia, serif`;

      const rightNoteWords = insideNote.split(' ');
      let rLine = '';
      let rY = 175;
      const rMaxW = panelW - 180;
      const rLineH = Math.max(22, noteFontSize) * 1.5;

      for (let n = 0; n < rightNoteWords.length; n++) {
        const test = rLine + rightNoteWords[n] + ' ';
        const m = ctx.measureText(test);
        if (m.width > rMaxW && n > 0) {
          ctx.fillText(rLine.trim(), panelW + 90, rY);
          rLine = rightNoteWords[n] + ' ';
          rY += rLineH;
        } else {
          rLine = test;
        }
      }
      if (rLine.trim().length > 0) {
        ctx.fillText(rLine.trim(), panelW + 90, rY);
        rY += rLineH;
      }

      // Closing Signature
      ctx.textAlign = 'right';
      ctx.fillStyle = activeTheme.accentHex;
      ctx.font = fontStyle === 'script' ? 'bold italic 34px cursive, Georgia' : 'bold 28px serif';
      ctx.fillText(signature, panelW + panelW - 90, rY + 45);

      // Wax Seal at bottom right
      ctx.textAlign = 'right';
      ctx.font = '40px sans-serif';
      ctx.fillText('❤️', panelW + panelW - 90, panelH - 80);
    };

    if (previewView === 'inside') {
      // Inside 2-Page Letter Spread
      await drawInsideSpread(cWidth, cHeight);
    } else if (previewView === 'sheet') {
      // 2-Panel Printable Bi-Fold A4 Sheet
      const panelW = cWidth / 2;
      const panelH = cHeight;

      // Left Panel = Back of card
      drawBackCover(0, 0, panelW, panelH);

      // Right Panel = Front cover
      await drawFrontCover(panelW, 0, panelW, panelH);

      // Center Dotted Fold Line
      ctx.save();
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(panelW, 10);
      ctx.lineTo(panelW, panelH - 10);
      ctx.stroke();

      // Fold Label
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✂ FOLD CENTER CREASE ✂', panelW, 40);
      ctx.restore();
    } else if (previewView === 'back') {
      // Back Cover View
      drawBackCover(0, 0, cWidth, cHeight);
    } else {
      // Front Cover
      await drawFrontCover(0, 0, cWidth, cHeight);
    }

    setPreviewDataUrl(canvas.toDataURL('image/png', 0.95));
  }, [
    format,
    previewView,
    theme,
    frameStyle,
    photoShape,
    fontStyle,
    washiTape,
    stampStyle,
    photoUrl,
    zoom,
    filter,
    recipient,
    headline,
    insideNote,
    signature,
    noteFontSize,
    noteLineHeight,
    noteAlign,
    noteSingleLineFit,
    showQuotationGlyphs,
  ]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Export as High-Res PNG
  const handleDownloadPng = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsProcessing(true);

    try {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const fileName = `Greeting_Card_${occasion}_${Date.now()}.png`;

      setDownloadUrl(dataUrl);
      setDownloadFileName(fileName);
      setDownloadType('png');
      setIsModalOpen(true);
      toast.success('High-resolution card exported!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to export PNG.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Export as Print-Ready A4 PDF with Cut Guides
  const handleDownloadPdf = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      const isLandscape = previewView === 'sheet' || previewView === 'inside' || format === 'bifold';
      const pageWidth = isLandscape ? 841.89 : 595.28;
      const pageHeight = isLandscape ? 595.28 : 841.89;

      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      const pngDataUrl = canvas.toDataURL('image/png', 1.0);
      const base64Data = pngDataUrl.split(',')[1];
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const pngImage = await pdfDoc.embedPng(bytes);

      const margin = 28;
      const contentW = pageWidth - margin * 2;
      const contentH = pageHeight - margin * 2;

      const cardAspect = canvas.width / canvas.height;
      let targetW = contentW;
      let targetH = targetW / cardAspect;

      if (targetH > contentH) {
        targetH = contentH;
        targetW = targetH * cardAspect;
      }

      const posX = margin + (contentW - targetW) / 2;
      const posY = margin + (contentH - targetH) / 2;

      // Outer Cutting Box & Guide Lines
      page.drawRectangle({
        x: posX - 3,
        y: posY - 3,
        width: targetW + 6,
        height: targetH + 6,
        borderColor: rgb(0.75, 0.8, 0.85),
        borderWidth: 0.75,
      });

      page.drawText(cleanForWinAnsi('FILEZENITH PRINTABLE GREETING CARD - CUT ALONG DOTTED LINES'), {
        x: posX,
        y: pageHeight - margin + 6,
        size: 7.5,
        color: rgb(0.5, 0.55, 0.6),
      });

      page.drawText(
        cleanForWinAnsi('[Cut Guide] Trim along outer rectangle. Fold center line in half for physical card.'),
        {
          x: posX,
          y: posY - 16,
          size: 7.5,
          color: rgb(0.45, 0.5, 0.55),
        }
      );

      page.drawImage(pngImage, {
        x: posX,
        y: posY,
        width: targetW,
        height: targetH,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const fileName = `Printable_Greeting_Card_${occasion}_A4_${Date.now()}.pdf`;
      setDownloadUrl(url);
      setDownloadFileName(fileName);
      setDownloadType('pdf');
      setIsModalOpen(true);
      toast.success('Print-ready A4 PDF generated with folding lines!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Free Printable Greeting & Love Card Maker (Bi-Fold A4 PDF & Digital PNG)"
      subtitle="Design romantic love cards, anniversary vows, birthday greetings & heartfelt thank-you notes with personal photos. 100% private in-browser canvas with zero cloud uploads."
      slug="/image/greeting-card-maker"
      noCardWrapper={true}
      hideSidebar={true}
    >
      <div className="space-y-6">
        {/* Top Feature Notice Banner with Quick Surprise Button */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-amber-500/10 border border-rose-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs bg-white">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-xs">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                <span>Printable Bi-Fold A4 &amp; Digital E-Card Studio</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                  Zero Watermark
                </span>
              </div>
              <p className="text-xs text-slate-600">
                100% private in-browser rendering. Your intimate couple photos and letters never leave your device.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={handleSurpriseMe}
              className="px-3.5 py-3 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Generate a randomized aesthetic design"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Surprise Me
            </button>
            <button
              onClick={() => setIsFullPreviewOpen(true)}
              className="px-3.5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Inspect card in full screen"
            >
              <Eye className="w-3.5 h-3.5 text-rose-600" />
              Full Preview
            </button>
            <button
              onClick={handleDownloadPng}
              disabled={isProcessing}
              className="px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              PNG
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isProcessing}
              className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              A4 PDF
            </button>
          </div>
        </div>

        {/* Studio Workspace: Side-by-Side (Controls on Left, Live Preview on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Design Studio Controls */}
          <div className="lg:col-span-7 space-y-6 min-w-0">
            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-rose-600" />
                  Greeting Card Studio &amp; Customization
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% In-Browser Privacy
                </span>
              </div>

              {/* 1. Occasion Presets */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Select Card Occasion
                  </span>
                  <span className="text-[10px] text-rose-600 font-extrabold">Instant Smart Autofill</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {OCCASIONS.map((occ) => {
                    const Icon = occ.icon;
                    const isSelected = occasion === occ.id;
                    return (
                      <button
                        key={occ.id}
                        type="button"
                        onClick={() => handleSelectOccasion(occ.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                          isSelected
                            ? 'border-rose-600 bg-rose-50/50 text-rose-900 shadow-2xs ring-2 ring-rose-500/20'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
                          <span className="text-xs font-bold truncate">{occ.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 truncate">{occ.tagline}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Aesthetic Frame & Paper Finish */}
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-slate-400" /> Luxury Card Frame &amp; Finish
                  </label>
                  <span className="text-[10px] text-amber-600 font-bold">Trending Aesthetics</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'royal_gold', label: 'Royal Gold Foil', desc: 'Embossed Gold & Filigree' },
                    { id: 'deckled_edge', label: 'Deckled Edge', desc: 'Torn Artisan Paper' },
                    { id: 'botanical', label: 'Botanical Leaves', desc: 'Olive Branches & Foliage' },
                    { id: 'airmail', label: 'Air Mail Postcard', desc: 'Vintage Chevron Stripe' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFrameStyle(f.id as CardFrameStyle)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        frameStyle === f.id
                          ? 'border-rose-600 bg-rose-50/40 text-rose-900 ring-2 ring-rose-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-[11px] font-bold block">{f.label}</span>
                      <span className="text-[9px] text-slate-500 block truncate">{f.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Colorway Palette */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {(Object.keys(THEMES) as CardTheme[]).map((tKey) => {
                    const t = THEMES[tKey];
                    const isSelected = theme === tKey;
                    return (
                      <button
                        key={tKey}
                        type="button"
                        onClick={() => setTheme(tKey)}
                        className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-rose-600 ring-2 ring-rose-500/20 bg-rose-50/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: t.accentHex }}
                        />
                        <span className="text-[11px] font-bold text-slate-800 truncate">{t.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Photo Upload & Framing */}
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-slate-400" /> Photo Framing &amp; Shape Silhouette
                  </label>
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Photo
                    </button>
                  )}
                </div>

                {/* Upload Button */}
                <label className="border-2 border-dashed border-slate-200 hover:border-rose-400 rounded-2xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-colors bg-slate-50/50 hover:bg-rose-50/20">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/heic"
                    onChange={handleUploadPhoto}
                    className="hidden"
                  />
                  <div className="p-2.5 rounded-full bg-rose-50 text-rose-600">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {photoUrl ? 'Click to replace couple / memory photo' : 'Upload couple / memory photo'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Supports JPG, PNG, WebP &amp; iPhone HEIC • 100% private in-browser
                    </span>
                  </div>
                </label>

                {/* Photo Shapes */}
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'arch', label: 'Arch Dome' },
                    { id: 'heart', label: 'Heart Mask' },
                    { id: 'oval', label: 'Cameo Oval' },
                    { id: 'rect', label: 'Soft Rect' },
                    { id: 'polaroid', label: 'Polaroid' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setPhotoShape(s.id as PhotoShape)}
                      className={`py-2 px-1 text-[11px] font-bold rounded-xl border text-center transition-all cursor-pointer ${
                        photoShape === s.id
                          ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-2xs ring-2 ring-rose-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Zoom, Filter & Washi Tape */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                      <span className="flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5 text-slate-400" /> Photo Zoom
                      </span>
                      <span className="text-rose-600">{zoom.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="2.5"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 block">Analog Filter</label>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as typeof filter)}
                      className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                    >
                      <option value="warm">90s Warm Film</option>
                      <option value="romance">Romance Blush</option>
                      <option value="golden">Golden Hour</option>
                      <option value="noir">Classic B&amp;W Noir</option>
                      <option value="natural">Original Raw</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 block">Washi Tape Accent</label>
                    <select
                      value={washiTape}
                      onChange={(e) => setWashiTape(e.target.value as WashiTape)}
                      className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                    >
                      <option value="gold_foil">Gold Foil Tape</option>
                      <option value="rose_blush">Blush Pink Tape</option>
                      <option value="sage_botanical">Sage Green Tape</option>
                      <option value="kraft_paper">Rustic Kraft Tape</option>
                      <option value="none">No Tape</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. HEARTFELT MESSAGE & LOVE NOTE (ADVANCED CONTROLS) */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Feather className="w-4 h-4 text-rose-600" />
                    Heartfelt Message / Love Note Controls
                  </span>
                  <span className="text-[10px] text-rose-600 font-extrabold">Line &amp; Font Precision</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700">Recipient Name</label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="e.g. To My One & Only"
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700">Card Headline</label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="Happy Anniversary!"
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700">Typography Style</label>
                    <select
                      value={fontStyle}
                      onChange={(e) => setFontStyle(e.target.value as FontStyle)}
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                    >
                      <option value="script">Romantic Cursive Script</option>
                      <option value="serif">Vogue Editorial Serif</option>
                      <option value="sans">Modern Clean Sans</option>
                      <option value="retro">Vintage Typewriter</option>
                      <option value="playful">Playful Hand-Lettered</option>
                    </select>
                  </div>
                </div>

                {/* Note Textarea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700">
                      Inside Letter / Heartfelt Note Text
                    </label>
                    <span className="text-[10px] text-slate-500">Supports manual Enter (line breaks)</span>
                  </div>
                  <textarea
                    rows={3}
                    value={insideNote}
                    onChange={(e) => setInsideNote(e.target.value)}
                    placeholder="Write your personal letter or anniversary message here..."
                    className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                  />
                </div>

                {/* Fine-Tuning Formatting Controls Bar */}
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span>Message Formatting &amp; Line Control</span>
                    <button
                      type="button"
                      onClick={() => setNoteSingleLineFit(!noteSingleLineFit)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        noteSingleLineFit
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Maximize2 className="w-3 h-3" />
                      {noteSingleLineFit ? 'Single-Line Auto-Fit: ON' : 'Single-Line Auto-Fit: OFF'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Font Size Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                        <span>Font Size</span>
                        <span className="text-rose-600 font-bold">{noteFontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="16"
                        max="38"
                        step="1"
                        value={noteFontSize}
                        onChange={(e) => {
                          setNoteFontSize(parseInt(e.target.value));
                          setNoteSingleLineFit(false);
                        }}
                        className="w-full accent-rose-600 cursor-pointer"
                      />
                    </div>

                    {/* Line Height Spacing */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                        <span>Line Spacing</span>
                        <span className="text-rose-600 font-bold">{noteLineHeight.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="1.1"
                        max="2.2"
                        step="0.1"
                        value={noteLineHeight}
                        onChange={(e) => setNoteLineHeight(parseFloat(e.target.value))}
                        className="w-full accent-rose-600 cursor-pointer"
                      />
                    </div>

                    {/* Text Alignment & Quote Glyphs */}
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-white p-0.5">
                        <button
                          type="button"
                          onClick={() => setNoteAlign('left')}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            noteAlign === 'left' ? 'bg-rose-50 text-rose-600 font-bold' : 'text-slate-500'
                          }`}
                          title="Align Left"
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoteAlign('center')}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            noteAlign === 'center' ? 'bg-rose-50 text-rose-600 font-bold' : 'text-slate-500'
                          }`}
                          title="Align Center"
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoteAlign('right')}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            noteAlign === 'right' ? 'bg-rose-50 text-rose-600 font-bold' : 'text-slate-500'
                          }`}
                          title="Align Right"
                        >
                          <AlignRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowQuotationGlyphs(!showQuotationGlyphs)}
                        className={`px-2 py-1.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          showQuotationGlyphs
                            ? 'border-rose-600 bg-rose-50 text-rose-700'
                            : 'border-slate-200 bg-white text-slate-500'
                        }`}
                        title="Toggle quotes “ ... ”"
                      >
                        <Quote className="w-3 h-3" />
                        Quotes: {showQuotationGlyphs ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sender Signature & Bottom Stamp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700">Sender Signature</label>
                    <input
                      type="text"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder="Forever & Always Yours ❤️"
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700">Bottom Seal / Stamp</label>
                    <select
                      value={stampStyle}
                      onChange={(e) => setStampStyle(e.target.value as StampStyle)}
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                    >
                      <option value="wax_heart">Wax Seal (Heart ❤️)</option>
                      <option value="wax_flower">Botanical Blossom (🌸)</option>
                      <option value="airmail_post">Postal Cancellation Stamp (PAR AVION)</option>
                      <option value="star_crest">Star Dust Sparkle (✨)</option>
                      <option value="love_envelope">Sealed Love Letter (💌)</option>
                      <option value="none">No Stamp</option>
                    </select>
                  </div>
                </div>

                {/* Curated Viral Quotes Library Tabs */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Quote className="w-3 h-3 text-rose-600" />
                      Viral Heartfelt Quotes Library (Click to Use):
                    </span>
                    <span className="text-[10px] text-rose-600 font-extrabold">Instant 1-Click Insert</span>
                  </div>

                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {VIRAL_QUOTES.map((cat, idx) => (
                      <button
                        key={cat.title}
                        type="button"
                        onClick={() => setSelectedQuoteCategory(idx)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          selectedQuoteCategory === idx
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat.title}
                      </button>
                    ))}
                  </div>

                  {/* Quotes List in Selected Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {VIRAL_QUOTES[selectedQuoteCategory].quotes.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => {
                          setInsideNote(q);
                          toast.success('Heartfelt quote inserted!');
                        }}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50/80 hover:text-rose-900 border border-slate-200/80 hover:border-rose-300 text-slate-700 text-[11px] font-medium transition-all text-left flex items-start gap-1.5 cursor-pointer leading-snug group"
                      >
                        <Quote className="w-3 h-3 text-rose-400 shrink-0 mt-0.5 group-hover:text-rose-600" />
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Studio Canvas Preview (Sticky alongside controls) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20 min-w-0">
            <div className="p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              {/* Studio Preview Header with Page-Turn & Full-Screen Options */}
              <div className="flex flex-col gap-2.5 border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider truncate">
                      Live Studio Preview
                    </span>
                  </div>

                  {/* Turn Page & Full Preview Quick Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleTurnPage}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-black border border-rose-200 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                      title="Turn page or flip card"
                    >
                      <RotateCw className="w-3 h-3 text-rose-600" />
                      Turn Page
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsFullPreviewOpen(true)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                      title="Show card in full proper preview"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* View Switcher Tabs */}
                <div className="flex items-center justify-between gap-1 overflow-x-auto pb-0.5">
                  <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setPreviewView('cover')}
                      className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                        previewView === 'cover' ? 'bg-white text-rose-700 shadow-2xs font-extrabold' : 'text-slate-600'
                      }`}
                    >
                      Cover
                    </button>
                    {format === 'bifold' && (
                      <button
                        type="button"
                        onClick={() => setPreviewView('inside')}
                        className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                          previewView === 'inside'
                            ? 'bg-white text-rose-700 shadow-2xs font-extrabold'
                            : 'text-slate-600'
                        }`}
                      >
                        Inside Spread 📖
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setPreviewView('back')}
                      className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                        previewView === 'back' ? 'bg-white text-rose-700 shadow-2xs font-extrabold' : 'text-slate-600'
                      }`}
                    >
                      Back 💌
                    </button>
                    {format === 'bifold' && (
                      <button
                        type="button"
                        onClick={() => setPreviewView('sheet')}
                        className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                          previewView === 'sheet'
                            ? 'bg-white text-rose-700 shadow-2xs font-extrabold'
                            : 'text-slate-600'
                        }`}
                      >
                        A4 Sheet 🖨️
                      </button>
                    )}
                  </div>

                  {/* Zoom Controls Bar */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewZoom((z) => Math.max(0.7, parseFloat((z - 0.15).toFixed(2))))}
                      className="p-1 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-slate-900 cursor-pointer text-[10px]"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] font-bold text-slate-600 w-10 text-center">
                      {Math.round(previewZoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewZoom((z) => Math.min(1.75, parseFloat((z + 0.15).toFixed(2))))}
                      className="p-1 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-slate-900 cursor-pointer text-[10px]"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actual Offscreen Canvas */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Realistic Rendered Card Display with Zoom Container */}
              <div className="w-full bg-slate-100/90 p-4 sm:p-6 rounded-2xl flex items-center justify-center overflow-x-auto overflow-y-hidden min-h-[440px] relative group">
                {previewDataUrl ? (
                  <div
                    style={{
                      transform: `scale(${previewZoom})`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.15s ease-out',
                    }}
                    className={`w-full ${
                      previewView === 'sheet' || previewView === 'inside' ? 'max-w-md' : 'max-w-xs'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewDataUrl}
                      alt="Greeting Card Preview"
                      className="w-full h-auto rounded-xl shadow-2xl border border-slate-200/90 mx-auto transition-all cursor-zoom-in"
                      onClick={() => setIsFullPreviewOpen(true)}
                    />
                  </div>
                ) : (
                  <div className="text-center space-y-2 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-rose-500" />
                    <p className="text-xs">Rendering greeting card...</p>
                  </div>
                )}

                {/* Floating Click to Enlarge Badge */}
                <button
                  type="button"
                  onClick={() => setIsFullPreviewOpen(true)}
                  className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/80 text-white text-[10px] font-bold backdrop-blur-sm transition-opacity opacity-75 hover:opacity-100 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" /> Click to Expand
                </button>
              </div>

              {/* Dual Export Buttons: Directly below preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleDownloadPng}
                  disabled={isProcessing}
                  className="py-3.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </button>
                <button
                  onClick={handleDownloadPdf}
                  disabled={isProcessing}
                  className="py-3.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Printer className="w-4 h-4" />
                  Print A4 PDF
                </button>
              </div>

              {/* Physical Gifting Suggestion */}
              <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200/60 flex items-start gap-2.5">
                <Printer className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <strong className="text-slate-900 font-bold">Physical Gifting &amp; Folding Tip:</strong> Click{' '}
                  <strong>&quot;Turn Page&quot;</strong> to inspect the inside letter spread. Export as{' '}
                  <strong>Print-Ready A4 PDF</strong> on <strong>220–300 GSM cardstock</strong> for a genuine boutique physical card!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FULL PROPER CARD PREVIEW MODAL */}
        {isFullPreviewOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col p-3 sm:p-6 animate-in fade-in duration-200">
            {/* Top Bar */}
            <div className="w-full max-w-6xl mx-auto flex items-center justify-between pb-3 border-b border-slate-800 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-rose-600 text-white">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>Full Proper Card Inspection</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold uppercase tracking-wider">
                      {previewView === 'cover'
                        ? 'Front Cover'
                        : previewView === 'inside'
                        ? 'Inside Letter Spread'
                        : previewView === 'back'
                        ? 'Back Cover'
                        : 'Printable A4 Sheet'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    High-resolution rendering with 300 DPI vector clarity.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Turn Page Button in Modal */}
                <button
                  type="button"
                  onClick={handleTurnPage}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Turn Page
                </button>

                {/* Modal Zoom Controls */}
                <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFullPreviewZoom((z) => Math.max(0.6, parseFloat((z - 0.2).toFixed(2))))}
                    className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-300 w-12 text-center">
                    {Math.round(fullPreviewZoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setFullPreviewZoom((z) => Math.min(2.2, parseFloat((z + 0.2).toFixed(2))))}
                    className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFullPreviewZoom(1.0)}
                    className="text-[10px] text-slate-400 hover:text-rose-400 ml-1 px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                {/* Quick Export in Modal */}
                <button
                  onClick={handleDownloadPng}
                  disabled={isProcessing}
                  className="hidden md:flex px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  PNG
                </button>

                <button
                  onClick={handleDownloadPdf}
                  disabled={isProcessing}
                  className="hidden md:flex px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-colors items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  A4 PDF
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsFullPreviewOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Close Full Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Canvas Viewport */}
            <div className="flex-1 w-full max-w-6xl mx-auto overflow-auto p-4 sm:p-8 flex items-center justify-center">
              {previewDataUrl && (
                <div
                  style={{
                    transform: `scale(${fullPreviewZoom})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.15s ease-out',
                  }}
                  className={`w-full ${
                    previewView === 'sheet' || previewView === 'inside' ? 'max-w-4xl' : 'max-w-lg'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewDataUrl}
                    alt="Full Proper Greeting Card Preview"
                    className="w-full h-auto rounded-2xl shadow-2xl border border-slate-700/80 mx-auto"
                  />
                </div>
              )}
            </div>

            {/* Bottom Modal Bar */}
            <div className="w-full max-w-6xl mx-auto pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>View Mode:</span>
                <button
                  onClick={() => setPreviewView('cover')}
                  className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                    previewView === 'cover' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Front Cover
                </button>
                {format === 'bifold' && (
                  <button
                    onClick={() => setPreviewView('inside')}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                      previewView === 'inside' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Inside Letter 📖
                  </button>
                )}
                <button
                  onClick={() => setPreviewView('back')}
                  className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                    previewView === 'back' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Back Cover
                </button>
                {format === 'bifold' && (
                  <button
                    onClick={() => setPreviewView('sheet')}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${
                      previewView === 'sheet' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Printable Sheet
                  </button>
                )}
              </div>

              <span className="text-[11px] text-slate-500">
                Press ESC or click &times; to exit full preview
              </span>
            </div>
          </div>
        )}

        {/* Celebratory Completion Modal */}
        <FileReadyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          downloadUrl={downloadUrl}
          fileName={downloadFileName}
          fileSizeKb={downloadType === 'pdf' ? 180 : 420}
          previewUrl={previewDataUrl}
          fileType={downloadType === 'pdf' ? 'pdf' : 'image'}
          title="Your Greeting Card is Ready"
          subtitle={
            downloadType === 'pdf'
              ? 'Print-ready A4 PDF with center fold crease and scissor cutting guides.'
              : 'High-resolution 300 DPI PNG exported without watermarks, ready to share or print.'
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
