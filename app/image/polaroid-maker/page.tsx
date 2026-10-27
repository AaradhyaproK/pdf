'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument, rgb } from 'pdf-lib';
import { toast } from 'sonner';
import {
  Camera,
  Download,
  Upload,
  Heart,
  Sparkles,
  Sliders,
  RefreshCw,
  Palette,
  Layout,
  Printer,
  ShieldCheck,
  ZoomIn,
  Type,
  Trash2,
  Film,
  Music,
  Smile,
  Smartphone,
  Check,
} from 'lucide-react';
import { FileReadyModal } from '@/components/FileReadyModal';

type PolaroidMode = 'classic' | 'duo' | 'photobooth' | 'filmstrip' | 'spotify' | 'washi';
type FilmFilter = 'natural' | 'warm' | 'bw' | 'sepia' | 'blush' | 'lightleak' | 'grain';
type FrameTheme = 'white' | 'ivory' | 'blush' | 'noir' | 'lavender' | 'sage' | 'sunset';
type FontStyle = 'handwriting' | 'typewriter' | 'digital' | 'editorial' | 'clean';

interface UploadedPhoto {
  id: string;
  url: string;
  name: string;
}

const FRAME_THEMES: Record<
  FrameTheme,
  {
    name: string;
    bgHex: string;
    borderHex: string;
    textHex: string;
    accentHex: string;
    isDark?: boolean;
  }
> = {
  white: {
    name: 'Classic White Matte',
    bgHex: '#FFFFFF',
    borderHex: '#E2E8F0',
    textHex: '#1E293B',
    accentHex: '#E11D48',
  },
  ivory: {
    name: 'Vintage Aged Ivory',
    bgHex: '#FAF6EE',
    borderHex: '#E7DFD5',
    textHex: '#3D352E',
    accentHex: '#C2410C',
  },
  blush: {
    name: 'Romantic Pastel Pink',
    bgHex: '#FFF1F2',
    borderHex: '#FECDD3',
    textHex: '#881337',
    accentHex: '#BE123C',
  },
  noir: {
    name: 'Midnight Film Noir',
    bgHex: '#141416',
    borderHex: '#27272A',
    textHex: '#F4F4F5',
    accentHex: '#FB7185',
    isDark: true,
  },
  lavender: {
    name: 'Y2K Pastel Lavender',
    bgHex: '#F5F3FF',
    borderHex: '#DDD6FE',
    textHex: '#4C1D95',
    accentHex: '#7C3AED',
  },
  sage: {
    name: 'Muji Botanical Sage',
    bgHex: '#F0FDF4',
    borderHex: '#DCFCE7',
    textHex: '#14532D',
    accentHex: '#16A34A',
  },
  sunset: {
    name: 'Golden Sunset Peach',
    bgHex: '#FFF7ED',
    borderHex: '#FFEDD5',
    textHex: '#7C2D12',
    accentHex: '#EA580C',
  },
};

const SUGGESTED_CAPTIONS = [
  'Since Day One ❤️',
  'Every day with you is my favorite.',
  'Forever my Valentine 🌹',
  'Golden Hour Memories ✨',
  'Better together always.',
  'Our Secret Roadtrip 📍',
  'Home is wherever you are.',
  'Lover • Taylor Swift 🎵',
];

const STAMP_OPTIONS = [
  { id: 'none', label: 'None' },
  { id: 'heart', label: '❤️ Forever' },
  { id: 'sparkles', label: '✨ Magic' },
  { id: 'rose', label: '🌹 Valentine' },
  { id: 'location', label: '📍 Roadtrip' },
  { id: 'coffee', label: '☕ Sunday' },
  { id: 'ring', label: '💍 Said Yes' },
  { id: 'music', label: '🎵 Song' },
];

export default function PolaroidMakerPage() {
  const [mode, setMode] = useState<PolaroidMode>('classic');
  const [filter, setFilter] = useState<FilmFilter>('warm');
  const [frameTheme, setFrameTheme] = useState<FrameTheme>('white');
  const [fontStyle, setFontStyle] = useState<FontStyle>('handwriting');
  const [stamp, setStamp] = useState<string>('heart');
  const [caption, setCaption] = useState('Since October 14, 2024 ❤️');
  const [dateStamp, setDateStamp] = useState('2027.02.14');
  const [zoom, setZoom] = useState<number>(1);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  // Download Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState('');
  const [downloadType, setDownloadType] = useState<'png' | 'pdf'>('png');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // File upload handler
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: UploadedPhoto[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newPhotos.push({
        id: `photo-${Date.now()}-${Math.random()}`,
        url,
        name: file.name,
      });
    });

    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 4));
    toast.success(`Loaded ${newPhotos.length} photo(s) into private memory.`);
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  // Canvas redraw pipeline
  const renderPolaroidToCanvas = useCallback(async (): Promise<HTMLCanvasElement | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const activeTheme = FRAME_THEMES[frameTheme];

    // Determine dimensions based on mode
    let cWidth = 1200;
    let cHeight = 1480;

    if (mode === 'duo') {
      cWidth = 1800;
      cHeight = 1320;
    } else if (mode === 'photobooth') {
      cWidth = 800;
      cHeight = 2400;
    } else if (mode === 'filmstrip') {
      cWidth = 900;
      cHeight = 2400;
    } else if (mode === 'spotify') {
      cWidth = 1200;
      cHeight = 1580;
    } else if (mode === 'washi') {
      cWidth = 1200;
      cHeight = 1480;
    }

    canvas.width = cWidth;
    canvas.height = cHeight;

    // 1. Draw Frame Background
    ctx.fillStyle = mode === 'filmstrip' ? '#141416' : activeTheme.bgHex;
    ctx.fillRect(0, 0, cWidth, cHeight);

    // Subtle realistic border edge
    if (mode !== 'filmstrip') {
      ctx.strokeStyle = activeTheme.borderHex;
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, cWidth - 4, cHeight - 4);
    }

    // Helper: Load HTML image element
    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    };

    // Helper: Apply retro film filter & lighting FX
    const applyFilter = (
      img: HTMLImageElement,
      dx: number,
      dy: number,
      dw: number,
      dh: number
    ) => {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = dw;
      offCanvas.height = dh;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return;

      // Draw photo with zoom & cover scaling
      const imgAspect = img.width / img.height;
      const targetAspect = dw / dh;
      let sx = 0;
      let sy = 0;
      let sw = img.width;
      let sh = img.height;

      if (imgAspect > targetAspect) {
        sw = img.height * targetAspect;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / targetAspect;
        sy = (img.height - sh) / 2;
      }

      // Apply zoom factor
      const zoomFactor = Math.max(1, zoom);
      const cropW = sw / zoomFactor;
      const cropH = sh / zoomFactor;
      const cropX = sx + (sw - cropW) / 2;
      const cropY = sy + (sh - cropH) / 2;

      offCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, dw, dh);

      // Filter transformations
      if (filter === 'warm') {
        offCtx.fillStyle = 'rgba(255, 195, 110, 0.16)';
        offCtx.fillRect(0, 0, dw, dh);
      } else if (filter === 'bw') {
        const imgData = offCtx.getImageData(0, 0, dw, dh);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          const contrast = (v - 128) * 1.25 + 128;
          d[i] = contrast;
          d[i + 1] = contrast;
          d[i + 2] = contrast;
        }
        offCtx.putImageData(imgData, 0, 0);
      } else if (filter === 'sepia') {
        const imgData = offCtx.getImageData(0, 0, dw, dh);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          d[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          d[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          d[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        }
        offCtx.putImageData(imgData, 0, 0);
      } else if (filter === 'blush') {
        offCtx.fillStyle = 'rgba(255, 175, 190, 0.22)';
        offCtx.fillRect(0, 0, dw, dh);
      } else if (filter === 'lightleak') {
        // Trending Golden Light Leak
        const leakGrad = offCtx.createRadialGradient(dw, 0, 10, dw, 0, dw * 0.9);
        leakGrad.addColorStop(0, 'rgba(255, 140, 20, 0.55)');
        leakGrad.addColorStop(0.4, 'rgba(255, 210, 80, 0.3)');
        leakGrad.addColorStop(0.8, 'rgba(255, 100, 150, 0.12)');
        leakGrad.addColorStop(1, 'transparent');
        offCtx.fillStyle = leakGrad;
        offCtx.fillRect(0, 0, dw, dh);
      } else if (filter === 'grain') {
        // 35mm Analog Grain simulation
        const imgData = offCtx.getImageData(0, 0, dw, dh);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          const noise = (Math.random() - 0.5) * 28;
          d[i] = Math.min(255, Math.max(0, d[i] + noise));
          d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise));
          d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise));
        }
        offCtx.putImageData(imgData, 0, 0);
      }

      // Draw final filtered image onto main canvas
      ctx.drawImage(offCanvas, dx, dy, dw, dh);

      // Subtle inner photo border
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 2;
      ctx.strokeRect(dx, dy, dw, dh);
    };

    // Helper: Select font
    const getFontDefinition = (size: number): string => {
      if (fontStyle === 'handwriting') {
        return `italic 600 ${size}px "Brush Script MT", "Caveat", "Segoe Script", cursive, Georgia, serif`;
      } else if (fontStyle === 'typewriter') {
        return `500 ${size}px "Courier New", Courier, monospace`;
      } else if (fontStyle === 'digital') {
        return `bold ${size}px "Consolas", "Courier New", monospace`;
      } else if (fontStyle === 'editorial') {
        return `italic 600 ${size}px "Playfair Display", Georgia, serif`;
      } else {
        return `bold ${size}px system-ui, -apple-system, sans-serif`;
      }
    };

    // Helper: Draw Mood Stamp
    const drawStamp = (x: number, y: number) => {
      if (stamp === 'none') return;
      const found = STAMP_OPTIONS.find((s) => s.id === stamp);
      if (!found) return;

      ctx.save();
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(found.label.split(' ')[0] || '', x, y);
      ctx.restore();
    };

    // --- RENDER MODES ---

    if (mode === 'classic' || mode === 'washi') {
      const pad = 80;
      const photoSize = cWidth - pad * 2; // 1040 x 1040 square

      if (photos.length > 0) {
        try {
          const img = await loadImage(photos[0].url);
          applyFilter(img, pad, pad, photoSize, photoSize);
        } catch (e) {
          console.error(e);
        }
      } else {
        ctx.fillStyle = activeTheme.isDark ? '#27272A' : '#F1F5F9';
        ctx.fillRect(pad, pad, photoSize, photoSize);
        ctx.fillStyle = '#94A3B8';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Upload Your Photo to Begin', cWidth / 2, pad + photoSize / 2);
      }

      // Washi Tape Mode: Draw tape on corners
      if (mode === 'washi') {
        ctx.save();
        // Top Left Tape
        ctx.translate(pad + 60, pad);
        ctx.rotate(-0.15);
        ctx.fillStyle = 'rgba(251, 191, 36, 0.75)'; // Warm yellow washi tape
        ctx.fillRect(-80, -22, 160, 44);
        ctx.restore();

        // Top Right Tape
        ctx.save();
        ctx.translate(pad + photoSize - 60, pad);
        ctx.rotate(0.18);
        ctx.fillStyle = 'rgba(244, 114, 182, 0.75)'; // Blush washi tape
        ctx.fillRect(-80, -22, 160, 44);
        ctx.restore();
      }

      // Stamp
      drawStamp(cWidth - 140, cHeight - 160);

      // Lower Caption Zone
      ctx.fillStyle = activeTheme.textHex;
      ctx.textAlign = 'center';
      ctx.font = getFontDefinition(56);
      ctx.fillText(caption, cWidth / 2, cHeight - 170);

      // Vintage Date Stamp
      if (dateStamp) {
        ctx.font = fontStyle === 'digital' ? 'bold 34px monospace' : '600 32px "Courier New", Courier, monospace';
        ctx.fillStyle = fontStyle === 'digital' ? '#EA580C' : activeTheme.accentHex;
        ctx.fillText(dateStamp, cWidth / 2, cHeight - 95);
      }
    } else if (mode === 'duo') {
      const pad = 80;
      const photoW = (cWidth - pad * 3) / 2;
      const photoH = 840;

      for (let i = 0; i < 2; i++) {
        const px = pad + i * (photoW + pad);
        const py = pad;
        if (photos[i]) {
          try {
            const img = await loadImage(photos[i].url);
            applyFilter(img, px, py, photoW, photoH);
          } catch (e) {
            console.error(e);
          }
        } else {
          ctx.fillStyle = activeTheme.isDark ? '#27272A' : '#F1F5F9';
          ctx.fillRect(px, py, photoW, photoH);
          ctx.fillStyle = '#94A3B8';
          ctx.font = 'bold 32px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Photo ${i + 1}`, px + photoW / 2, py + photoH / 2);
        }
      }

      // Center Heart Connector
      ctx.fillStyle = activeTheme.accentHex;
      ctx.font = 'bold 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('❤️', cWidth / 2, pad + photoH / 2 + 15);

      // Caption & Date
      ctx.fillStyle = activeTheme.textHex;
      ctx.font = getFontDefinition(56);
      ctx.fillText(caption, cWidth / 2, cHeight - 165);

      if (dateStamp) {
        ctx.font = fontStyle === 'digital' ? 'bold 34px monospace' : '600 32px monospace';
        ctx.fillStyle = fontStyle === 'digital' ? '#EA580C' : activeTheme.accentHex;
        ctx.fillText(dateStamp, cWidth / 2, cHeight - 90);
      }
    } else if (mode === 'photobooth') {
      const pad = 50;
      const photoW = cWidth - pad * 2;
      const photoH = 470;
      const numSnaps = 4;

      for (let i = 0; i < numSnaps; i++) {
        const py = pad + i * (photoH + 28);
        const photo = photos[i % photos.length];
        if (photo) {
          try {
            const img = await loadImage(photo.url);
            applyFilter(img, pad, py, photoW, photoH);
          } catch (e) {
            console.error(e);
          }
        } else {
          ctx.fillStyle = activeTheme.isDark ? '#27272A' : '#F1F5F9';
          ctx.fillRect(pad, py, photoW, photoH);
          ctx.fillStyle = '#94A3B8';
          ctx.font = 'bold 28px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Snap ${i + 1}`, cWidth / 2, py + photoH / 2);
        }
      }

      // Bottom Photobooth Stamp
      ctx.fillStyle = activeTheme.textHex;
      ctx.textAlign = 'center';
      ctx.font = getFontDefinition(40);
      ctx.fillText(caption, cWidth / 2, cHeight - 120);

      if (dateStamp) {
        ctx.font = fontStyle === 'digital' ? 'bold 26px monospace' : 'bold 24px monospace';
        ctx.fillStyle = fontStyle === 'digital' ? '#EA580C' : activeTheme.accentHex;
        ctx.fillText(dateStamp, cWidth / 2, cHeight - 65);
      }
    } else if (mode === 'filmstrip') {
      // 35mm Analog Film Negative with sprocket holes
      const holeW = 28;
      const holeH = 42;
      const holeRadius = 6;
      const holeGap = 72;

      // Draw sprocket holes along left & right edges
      ctx.fillStyle = '#FFFFFF';
      for (let y = 30; y < cHeight - 40; y += holeGap) {
        // Left sprocket
        ctx.beginPath();
        ctx.roundRect(24, y, holeW, holeH, holeRadius);
        ctx.fill();

        // Right sprocket
        ctx.beginPath();
        ctx.roundRect(cWidth - 24 - holeW, y, holeW, holeH, holeRadius);
        ctx.fill();
      }

      // Film text stamps in retro orange
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('KODAK PORTRA 400', 90, 48);
      ctx.fillText('36 EXP • SAFETY FILM', 90, cHeight - 35);

      ctx.textAlign = 'right';
      ctx.fillText('▶ 01A', cWidth - 90, 48);
      ctx.fillText('▶ 02A', cWidth - 90, cHeight - 35);

      // 3 Stacked Photos
      const frameX = 85;
      const frameW = cWidth - frameX * 2;
      const frameH = 650;
      const numFrames = 3;

      for (let i = 0; i < numFrames; i++) {
        const fy = 80 + i * (frameH + 60);
        const photo = photos[i % photos.length];
        if (photo) {
          try {
            const img = await loadImage(photo.url);
            applyFilter(img, frameX, fy, frameW, frameH);
          } catch (e) {
            console.error(e);
          }
        } else {
          ctx.fillStyle = '#27272A';
          ctx.fillRect(frameX, fy, frameW, frameH);
          ctx.fillStyle = '#71717A';
          ctx.font = 'bold 30px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`FRAME ${i + 1}`, frameX + frameW / 2, fy + frameH / 2);
        }
      }
    } else if (mode === 'spotify') {
      // Trending Spotify Memory Player Card
      const pad = 70;
      const photoSize = cWidth - pad * 2;

      if (photos.length > 0) {
        try {
          const img = await loadImage(photos[0].url);
          applyFilter(img, pad, pad, photoSize, photoSize);
        } catch (e) {
          console.error(e);
        }
      } else {
        ctx.fillStyle = activeTheme.isDark ? '#27272A' : '#F1F5F9';
        ctx.fillRect(pad, pad, photoSize, photoSize);
        ctx.fillStyle = '#94A3B8';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Upload Song / Couple Photo', cWidth / 2, pad + photoSize / 2);
      }

      const songY = pad + photoSize + 60;

      // Song Title
      ctx.fillStyle = activeTheme.textHex;
      ctx.textAlign = 'left';
      ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
      ctx.fillText(caption || 'Lover', pad, songY);

      // Artist / Date
      ctx.fillStyle = '#64748B';
      ctx.font = '500 32px system-ui, -apple-system, sans-serif';
      ctx.fillText(dateStamp || 'Taylor Swift • 2027', pad, songY + 45);

      // Spotify Heart Icon (Right side)
      ctx.fillStyle = '#10B981';
      ctx.textAlign = 'right';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('💚', cWidth - pad, songY + 25);

      // Progress Bar
      const barY = songY + 95;
      const barW = cWidth - pad * 2;
      ctx.fillStyle = activeTheme.isDark ? '#3F3F46' : '#E2E8F0';
      ctx.beginPath();
      ctx.roundRect(pad, barY, barW, 10, 5);
      ctx.fill();

      // Active Played Bar (65%)
      ctx.fillStyle = activeTheme.isDark ? '#FFFFFF' : '#0F172A';
      ctx.beginPath();
      ctx.roundRect(pad, barY, barW * 0.65, 10, 5);
      ctx.fill();

      // Handle circle
      ctx.beginPath();
      ctx.arc(pad + barW * 0.65, barY + 5, 10, 0, Math.PI * 2);
      ctx.fill();

      // Time stamps
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('2:14', pad, barY + 38);
      ctx.textAlign = 'right';
      ctx.fillText('3:45', cWidth - pad, barY + 38);

      // Playback Controls Icons (Center)
      const ctrlY = barY + 90;
      ctx.textAlign = 'center';
      ctx.fillStyle = activeTheme.textHex;
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('⏮', cWidth / 2 - 120, ctrlY);
      ctx.font = 'bold 48px sans-serif';
      ctx.fillText('⏸', cWidth / 2, ctrlY + 4);
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('⏭', cWidth / 2 + 120, ctrlY);
    }

    setPreviewDataUrl(canvas.toDataURL('image/png'));
    return canvas;
  }, [mode, filter, frameTheme, fontStyle, stamp, caption, dateStamp, zoom, photos]);

  useEffect(() => {
    renderPolaroidToCanvas();
  }, [renderPolaroidToCanvas]);

  // Export 1: High-Res PNG
  const handleDownloadPng = async () => {
    setIsProcessing(true);
    try {
      const canvas = await renderPolaroidToCanvas();
      if (!canvas) throw new Error('Canvas not found');

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const fileName = `Polaroid_${mode}_${Date.now()}.png`;
        setDownloadUrl(url);
        setDownloadFileName(fileName);
        setDownloadType('png');
        setIsModalOpen(true);
        toast.success('High-res Polaroid PNG ready for download!');
      }, 'image/png');
    } catch (e) {
      console.error(e);
      toast.error('Failed to export PNG.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Export 2: Print-Ready A4 PDF with Cutting Guides
  const handleDownloadPdf = async () => {
    setIsProcessing(true);
    try {
      const canvas = await renderPolaroidToCanvas();
      if (!canvas) throw new Error('Canvas not found');

      const pngDataUrl = canvas.toDataURL('image/png');
      const pngBytes = await fetch(pngDataUrl).then((res) => res.arrayBuffer());

      // Create PDF Document (ISO A4: 595.28 x 841.89 pt)
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]);
      const pngImage = await pdfDoc.embedPng(pngBytes);

      const margin = 36;
      const contentW = 595.28 - margin * 2;
      const contentH = 841.89 - margin * 2;

      // Draw Cutting Notice
      page.drawText('FILEZENITH PRINTABLE POLAROID CARD - CUT ALONG THE DOTTED GUIDELINES', {
        x: margin,
        y: 841.89 - margin + 8,
        size: 7.5,
        color: rgb(0.5, 0.55, 0.6),
      });

      // Fit and center the polaroid card on the A4 page
      const cardAspect = canvas.width / canvas.height;
      let targetW = contentW * 0.72;
      let targetH = targetW / cardAspect;

      if (targetH > contentH * 0.85) {
        targetH = contentH * 0.85;
        targetW = targetH * cardAspect;
      }

      const posX = margin + (contentW - targetW) / 2;
      const posY = margin + (contentH - targetH) / 2;

      // Draw dashed cutting guide border around card
      page.drawRectangle({
        x: posX - 4,
        y: posY - 4,
        width: targetW + 8,
        height: targetH + 8,
        borderColor: rgb(0.75, 0.8, 0.85),
        borderWidth: 0.75,
      });

      page.drawText('[Cut Guide] Trim along outer box with scissors or paper cutter', {
        x: posX,
        y: posY - 18,
        size: 8,
        color: rgb(0.45, 0.5, 0.55),
      });

      // Embed Polaroid Image
      page.drawImage(pngImage, {
        x: posX,
        y: posY,
        width: targetW,
        height: targetH,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const fileName = `Printable_Polaroid_${mode}_A4_${Date.now()}.pdf`;
      setDownloadUrl(url);
      setDownloadFileName(fileName);
      setDownloadType('pdf');
      setIsModalOpen(true);
      toast.success('Print-ready A4 PDF generated with cutting guides!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Free Polaroid & Vintage Memory Card Maker (Printable PDF & PNG)"
      subtitle="Turn couple photos, anniversaries, and personal memories into aesthetic Polaroid frames, 35mm film strips, Spotify cards & photobooth ribbons. 100% private in-browser canvas with zero cloud uploads."
      slug="/image/polaroid-maker"
      noCardWrapper={true}
      hideSidebar={true}
    >
      <div className="space-y-6">
        {/* Top Feature Notice Banner */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-purple-500/10 border border-rose-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs bg-white">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-xs">
              <Heart className="w-5 h-5 fill-rose-600 text-white" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                <span>Trending Aesthetic &amp; Memory Studio</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                  Zero Server Upload
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Processed 100% locally in browser RAM. Your intimate couple photos never leave your device.
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={handleDownloadPng}
              disabled={isProcessing}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isProcessing}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              Print-Ready A4 PDF
            </button>
          </div>
        </div>

        {/* Studio Workspace: Side-by-Side (Controls on Left, Live Preview on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Design Studio & Customization Controls */}
          <div className="lg:col-span-7 space-y-6 min-w-0">
            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-rose-600" />
                  Design Studio &amp; Customization
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Private In-Browser
                </span>
              </div>

              {/* Upload Dropzone */}
              <div className="space-y-2">
                <label className="border-2 border-dashed border-slate-200 hover:border-rose-400 rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-colors bg-slate-50/50 hover:bg-rose-50/20">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/heic"
                    multiple
                    onChange={handleUpload}
                    className="hidden"
                  />
                  <div className="p-3 rounded-full bg-rose-50 text-rose-600">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-center space-y-0.5">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                      Click or Drag &amp; Drop couple &amp; memory photos here
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Supports JPG, PNG, WebP &amp; iPhone HEIC • Select up to 4 photos for multi-frame strips
                    </span>
                  </div>
                </label>

                {/* Uploaded Thumbnails */}
                {photos.length > 0 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto pt-2 pb-1">
                    {photos.map((p, idx) => (
                      <div key={p.id} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-300 shadow-2xs shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(p.id)}
                          className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section: Trending Designs & Silhouettes */}
              <div className="space-y-2.5 pt-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5 text-rose-600" />
                    Select Aesthetic Silhouette (6 Trending Designs)
                  </span>
                  <span className="text-[10px] text-amber-600 font-extrabold">★ Trending</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'classic', label: 'Classic 600', icon: Camera, sub: 'Polaroid 1:1' },
                    { id: 'duo', label: 'Couple Duo', icon: Heart, sub: '2 Photos Heart' },
                    { id: 'photobooth', label: 'Photobooth', icon: Layout, sub: '4-Snap Strip' },
                    { id: 'filmstrip', label: '35mm Film', icon: Film, sub: 'Kodak Portra' },
                    { id: 'spotify', label: 'Spotify Track', icon: Music, sub: 'Player Card' },
                    { id: 'washi', label: 'Washi Tape', icon: Sparkles, sub: 'Scrapbook' },
                  ].map((des) => {
                    const Icon = des.icon;
                    const isSelected = mode === des.id;
                    return (
                      <button
                        key={des.id}
                        type="button"
                        onClick={() => setMode(des.id as PolaroidMode)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-rose-600 bg-rose-50/50 text-rose-900 shadow-2xs ring-2 ring-rose-500/20'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold block truncate">{des.label}</span>
                        <span className="text-[9px] text-slate-400 font-medium block">{des.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row: Analog Filters & Frame Palettes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Analog Filters & Lighting FX */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-slate-400" /> Analog Film Filter &amp; Light Leak
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {(
                      [
                        { id: 'natural', label: 'Original' },
                        { id: 'warm', label: '90s Warm' },
                        { id: 'bw', label: 'Noir B&W' },
                        { id: 'sepia', label: 'Sepia' },
                        { id: 'blush', label: 'Romance' },
                        { id: 'lightleak', label: '☀️ Leak' },
                        { id: 'grain', label: '🎞️ Grain' },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFilter(f.id)}
                        className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all cursor-pointer truncate ${
                          filter === f.id
                            ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-2xs ring-2 ring-rose-500/20'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frame Color Themes */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-slate-400" /> Frame Palette
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(FRAME_THEMES) as FrameTheme[]).slice(0, 4).map((themeKey) => {
                      const t = FRAME_THEMES[themeKey];
                      const isSelected = frameTheme === themeKey;
                      return (
                        <button
                          key={themeKey}
                          type="button"
                          onClick={() => setFrameTheme(themeKey)}
                          className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-rose-600 ring-2 ring-rose-500/20 bg-rose-50/20'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                            style={{ backgroundColor: t.bgHex }}
                          />
                          <span className="text-[11px] font-bold text-slate-800 truncate">{t.name.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Row: Zoom & Mood Stamp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Photo Zoom & Pan */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5 text-slate-400" /> Framing &amp; Zoom
                    </span>
                    <span className="text-rose-600 font-bold">{zoom.toFixed(1)}x Scale</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer pt-1"
                  />
                </div>

                {/* Mood Stamp / Sticker */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-slate-400" /> Corner Mood Stamp
                  </label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {STAMP_OPTIONS.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setStamp(st.id)}
                        className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                          stamp === st.id
                            ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inscriptions, Typography & Date */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700">
                      {mode === 'spotify' ? 'Song Title' : 'Handwritten Caption'}
                    </label>
                    <input
                      type="text"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="e.g. Since October 14, 2024 ❤️"
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700">
                      {mode === 'spotify' ? 'Artist / Album' : 'Date Stamp'}
                    </label>
                    <input
                      type="text"
                      value={dateStamp}
                      onChange={(e) => setDateStamp(e.target.value)}
                      placeholder="2027.02.14"
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700">Typography Font</label>
                    <select
                      value={fontStyle}
                      onChange={(e) => setFontStyle(e.target.value as FontStyle)}
                      className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                    >
                      <option value="handwriting">Cursive Signature</option>
                      <option value="typewriter">Vintage Typewriter</option>
                      <option value="digital">90s Orange LED Date</option>
                      <option value="editorial">Editorial Serif</option>
                      <option value="clean">Modern Clean Sans</option>
                    </select>
                  </div>
                </div>

                {/* Caption Suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Suggestions:</span>
                  {SUGGESTED_CAPTIONS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setCaption(sug)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Studio Canvas Preview (Sticky alongside controls) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20 min-w-0">
            <div className="p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider truncate">
                    Live Preview ({FRAME_THEMES[frameTheme].name.split(' ')[0]} • {mode.toUpperCase()})
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                  Instant
                </span>
              </div>

              {/* Actual Offscreen Canvas */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Realistic Rendered Card Display */}
              <div className="w-full bg-slate-100/90 p-4 sm:p-6 rounded-2xl flex items-center justify-center overflow-x-auto min-h-[420px]">
                {previewDataUrl ? (
                  <div className="max-w-xs sm:max-w-sm w-full transition-transform hover:scale-[1.01] duration-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewDataUrl}
                      alt="Polaroid Memory Preview"
                      className="w-full h-auto rounded-xl shadow-xl border border-slate-200/90 mx-auto"
                    />
                  </div>
                ) : (
                  <div className="text-center space-y-2 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-rose-500" />
                    <p className="text-xs">Rendering vintage frame...</p>
                  </div>
                )}
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
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <Printer className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <strong className="text-slate-900 font-bold">Physical Gifting:</strong> Export as{' '}
                  <strong>Print-Ready A4 PDF</strong> and print on <strong>240–300 GSM photo paper</strong> with scissor cut guides.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Celebratory Completion Modal with Preview */}
        <FileReadyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          downloadUrl={downloadUrl}
          fileName={downloadFileName}
          fileSizeKb={downloadType === 'pdf' ? 140 : 380}
          previewUrl={previewDataUrl}
          fileType={downloadType === 'pdf' ? 'pdf' : 'image'}
          title="Your Vintage Memory Card is Ready"
          subtitle={
            downloadType === 'pdf'
              ? 'Multi-up A4 printable PDF generated with subtle dotted scissor cutting guides.'
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
