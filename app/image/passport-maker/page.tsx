'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { toast } from 'sonner';
import {
  Upload,
  Download,
  RefreshCw,
  UserCheck,
  Grid,
  Sliders,
  RotateCcw,
  FlipHorizontal,
  Sun,
  Palette,
  Eye,
  Printer,
  Sparkles,
  Maximize2,
  Check,
} from 'lucide-react';

export interface PassportPreset {
  id: string;
  name: string;
  country: string;
  widthMm: number;
  heightMm: number;
  pxWidth: number;
  pxHeight: number;
  label: string;
}

export const PASSPORT_PRESETS: PassportPreset[] = [
  { id: 'us', name: 'US Passport & Visa', country: 'United States', widthMm: 51, heightMm: 51, pxWidth: 600, pxHeight: 600, label: '2 x 2 inches (51 x 51 mm)' },
  { id: 'schengen', name: 'Schengen Visa', country: 'Europe / France / Germany', widthMm: 35, heightMm: 45, pxWidth: 413, pxHeight: 531, label: '35 x 45 mm' },
  { id: 'uk', name: 'UK Passport', country: 'United Kingdom', widthMm: 35, heightMm: 45, pxWidth: 413, pxHeight: 531, label: '35 x 45 mm' },
  { id: 'india_pass', name: 'India Passport', country: 'India', widthMm: 51, heightMm: 51, pxWidth: 600, pxHeight: 600, label: '2 x 2 inches (51 x 51 mm)' },
  { id: 'india_pan', name: 'India PAN / Driving License', country: 'India', widthMm: 35, heightMm: 45, pxWidth: 413, pxHeight: 531, label: '35 x 45 mm' },
  { id: 'canada', name: 'Canada Passport', country: 'Canada', widthMm: 50, heightMm: 70, pxWidth: 591, pxHeight: 827, label: '50 x 70 mm' },
  { id: 'australia', name: 'Australia Passport', country: 'Australia', widthMm: 35, heightMm: 45, pxWidth: 413, pxHeight: 531, label: '35 x 45 mm' },
  { id: 'japan', name: 'Japan Passport', country: 'Japan', widthMm: 45, heightMm: 45, pxWidth: 531, pxHeight: 531, label: '45 x 45 mm' },
  { id: 'china', name: 'China Visa', country: 'China', widthMm: 33, heightMm: 48, pxWidth: 390, pxHeight: 567, label: '33 x 48 mm' },
  { id: 'uae', name: 'UAE / Dubai Visa', country: 'United Arab Emirates', widthMm: 40, heightMm: 60, pxWidth: 472, pxHeight: 709, label: '40 x 60 mm' },
];

export const BACKGROUND_COLORS = [
  { id: 'original', name: 'Original Photo Background', value: 'transparent', border: 'border-slate-300' },
  { id: 'white', name: 'Biometric White', value: '#FFFFFF', border: 'border-slate-300' },
  { id: 'offwhite', name: 'Off-White / Light Grey', value: '#F4F5F7', border: 'border-slate-300' },
  { id: 'light_blue', name: 'US / Europe Light Blue', value: '#D0E8FF', border: 'border-blue-200' },
  { id: 'royal_blue', name: 'Asian Royal Blue', value: '#0055A5', border: 'border-blue-600' },
  { id: 'red', name: 'China / Vietnam Red', value: '#E50914', border: 'border-red-600' },
];

export const SHEET_LAYOUTS = [
  { id: '4x6_6', name: '4x6" Print Sheet (6 Photos)', paper: '4x6 inch', cols: 3, rows: 2, sheetW: 1200, sheetH: 1800 },
  { id: '4x6_8', name: '4x6" Print Sheet (8 Photos)', paper: '4x6 inch', cols: 4, rows: 2, sheetW: 1200, sheetH: 1800 },
  { id: '5x7_8', name: '5x7" Print Sheet (8 Photos)', paper: '5x7 inch', cols: 4, rows: 2, sheetW: 1500, sheetH: 2100 },
  { id: '5x7_12', name: '5x7" Print Sheet (12 Photos)', paper: '5x7 inch', cols: 4, rows: 3, sheetW: 1500, sheetH: 2100 },
  { id: 'a4_12', name: 'A4 Print Sheet (12 Photos)', paper: 'A4 Paper', cols: 3, rows: 4, sheetW: 2480, sheetH: 3508 },
  { id: 'a4_18', name: 'A4 Print Sheet (18 Photos)', paper: 'A4 Paper', cols: 3, rows: 6, sheetW: 2480, sheetH: 3508 },
  { id: 'a4_24', name: 'A4 Print Sheet (24 Photos)', paper: 'A4 Paper', cols: 4, rows: 6, sheetW: 2480, sheetH: 3508 },
  { id: 'a4_30', name: 'A4 Print Sheet (30 Photos)', paper: 'A4 Paper', cols: 5, rows: 6, sheetW: 2480, sheetH: 3508 },
];

export default function PassportMakerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Preset Selection
  const [selectedPreset, setSelectedPreset] = useState<PassportPreset>(PASSPORT_PRESETS[0]);
  const [customWidth, setCustomWidth] = useState<number>(51);
  const [customHeight, setCustomHeight] = useState<number>(51);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // Studio Adjustments
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [flipX, setFlipX] = useState<boolean>(false);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [showBiometricGuide, setShowBiometricGuide] = useState<boolean>(true);
  const [drawCutLines, setDrawCutLines] = useState<boolean>(true);

  // Sheet Layout Selection
  const [selectedSheetLayout, setSelectedSheetLayout] = useState(SHEET_LAYOUTS[0]);

  // Output URLs
  const [singlePhotoUrl, setSinglePhotoUrl] = useState<string | null>(null);
  const [sheetPhotoUrl, setSheetPhotoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, WebP, HEIC).');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setFilePreview(url);
    // Reset studio adjustments
    setZoom(100);
    setRotation(0);
    setFlipX(false);
    setPanX(0);
    setPanY(0);
    setBrightness(100);
    setContrast(100);
    toast.success('Photo loaded into Passport Studio.');
  };

  // Live Canvas Renderer
  useEffect(() => {
    if (!filePreview || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetW = isCustom ? Math.round(customWidth * 11.81) : selectedPreset.pxWidth;
    const targetH = isCustom ? Math.round(customHeight * 11.81) : selectedPreset.pxHeight;

    canvas.width = targetW;
    canvas.height = targetH;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = filePreview;

    img.onload = () => {
      ctx.clearRect(0, 0, targetW, targetH);

      // Background Fill
      if (bgColor !== 'transparent') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, targetW, targetH);
      }

      ctx.save();

      // Apply Filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

      // Transform origin center
      ctx.translate(targetW / 2 + panX, targetH / 2 + panY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipX ? -1 : 1, 1);

      const scaleFactor = zoom / 100;
      const drawW = img.width * scaleFactor;
      const drawH = img.height * scaleFactor;

      // Fit cover base math
      const coverScale = Math.max(targetW / img.width, targetH / img.height);
      const finalW = img.width * coverScale * scaleFactor;
      const finalH = img.height * coverScale * scaleFactor;

      ctx.drawImage(img, -finalW / 2, -finalH / 2, finalW, finalH);
      ctx.restore();
    };
  }, [
    filePreview,
    selectedPreset,
    isCustom,
    customWidth,
    customHeight,
    zoom,
    rotation,
    flipX,
    panX,
    panY,
    brightness,
    contrast,
    bgColor,
  ]);

  // Generate Passport Photos and Sheet
  const handleGeneratePassport = async () => {
    if (!previewCanvasRef.current) return;
    setIsGenerating(true);
    toast.info('Generating high-resolution passport photos & print sheet...');

    try {
      const singleCanvas = previewCanvasRef.current;
      const singleDataUrl = singleCanvas.toDataURL('image/jpeg', 0.95);
      setSinglePhotoUrl(singleDataUrl);

      // Render Print Sheet Canvas
      const sheet = selectedSheetLayout;
      const sheetCanvas = document.createElement('canvas');
      sheetCanvas.width = sheet.sheetW;
      sheetCanvas.height = sheet.sheetH;
      const sheetCtx = sheetCanvas.getContext('2d');

      if (sheetCtx) {
        sheetCtx.fillStyle = '#FFFFFF';
        sheetCtx.fillRect(0, 0, sheet.sheetW, sheet.sheetH);

        const cardW = singleCanvas.width * 0.75;
        const cardH = singleCanvas.height * 0.75;
        const totalW = sheet.cols * cardW + (sheet.cols - 1) * 30;
        const totalH = sheet.rows * cardH + (sheet.rows - 1) * 30;
        const startX = (sheet.sheetW - totalW) / 2;
        const startY = (sheet.sheetH - totalH) / 2;

        for (let r = 0; r < sheet.rows; r++) {
          for (let c = 0; c < sheet.cols; c++) {
            const posX = startX + c * (cardW + 30);
            const posY = startY + r * (cardH + 30);

            sheetCtx.drawImage(singleCanvas, posX, posY, cardW, cardH);

            if (drawCutLines) {
              sheetCtx.strokeStyle = '#D1D5DB';
              sheetCtx.lineWidth = 2;
              sheetCtx.setLineDash([6, 6]);
              sheetCtx.strokeRect(posX, posY, cardW, cardH);
              sheetCtx.setLineDash([]);
            }
          }
        }

        const sheetDataUrl = sheetCanvas.toDataURL('image/jpeg', 0.95);
        setSheetPhotoUrl(sheetDataUrl);
      }

      toast.success('Passport photos & printable sheet generated!');
    } catch {
      toast.error('Failed to generate passport photo sheet.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToolLayout
      slug="/image/passport-maker"
      title="Passport & Visa Photo Maker (US, Schengen, UK, India, Canada)"
      subtitle="Studio-grade biometric passport photo creator. Auto face alignment guides, background color changer, custom sizes, and multi-photo A4/4x6 print sheet generator."
      badgeText="Biometric Passport Studio"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {!filePreview ? (
          <div className="p-8 sm:p-14 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-all text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Upload Front-Facing Portrait Photo</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Upload a clear portrait photo taken against a plain wall. Works with smartphone photos, camera rolls, and digital portraits.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Select Portrait Photo</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Live Interactive Studio Canvas (Left Column) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-indigo-600" /> Live Studio Canvas Preview
                  </span>
                  <label className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer">
                    Change Photo
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                {/* Canvas Container with Biometric Guide Overlay */}
                <div className="relative w-full aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
                  <canvas ref={previewCanvasRef} className="max-w-full max-h-full object-contain" />

                  {/* Biometric Face Outline Overlay */}
                  {showBiometricGuide && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
                      {/* Head Ellipse */}
                      <div className="w-[55%] h-[65%] border-2 border-dashed border-emerald-400/80 rounded-full relative">
                        {/* Eye level line */}
                        <div className="absolute top-[42%] left-0 right-0 border-t border-emerald-400/70" />
                        <span className="absolute top-[43%] right-1 text-[9px] font-bold text-emerald-600 bg-white/80 px-1 rounded">
                          EYE LINE
                        </span>
                        {/* Chin level line */}
                        <div className="absolute bottom-[8%] left-0 right-0 border-b border-emerald-400/70" />
                        <span className="absolute bottom-[2%] left-1/2 -translate-x-1/2 text-[9px] font-bold text-emerald-600 bg-white/80 px-1 rounded">
                          CHIN
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    onClick={() => setShowBiometricGuide(!showBiometricGuide)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                      showBiometricGuide
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showBiometricGuide ? 'Hide Face Guide' : 'Show Face Guide'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setZoom(100);
                      setRotation(0);
                      setFlipX(false);
                      setPanX(0);
                      setPanY(0);
                      setBrightness(100);
                      setContrast(100);
                      setBgColor('#FFFFFF');
                    }}
                    className="text-slate-500 hover:text-slate-900 text-xs font-bold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Adjustments
                  </button>
                </div>
              </div>
            </div>

            {/* Studio Control Tabs & Settings (Right Column) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                {/* 1. Country & Specification Preset */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-indigo-600" /> 1. Passport & Visa Standard
                    </label>
                    <button
                      onClick={() => setIsCustom(!isCustom)}
                      className="text-xs text-indigo-600 font-extrabold hover:underline"
                    >
                      {isCustom ? 'Choose Country Presets' : '+ Custom Size (mm)'}
                    </button>
                  </div>

                  {!isCustom ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {PASSPORT_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => {
                            setSelectedPreset(preset);
                            setIsCustom(false);
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all flex items-start justify-between ${
                            selectedPreset.id === preset.id && !isCustom
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-extrabold shadow-sm'
                              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 text-slate-800'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-extrabold">{preset.name}</div>
                            <div className="text-[10px] text-slate-500 font-semibold">{preset.label}</div>
                          </div>
                          {selectedPreset.id === preset.id && !isCustom && <Check className="w-4 h-4 text-indigo-600 mt-0.5" />}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-700">Width (mm):</span>
                        <input
                          type="number"
                          value={customWidth}
                          onChange={(e) => setCustomWidth(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-700">Height (mm):</span>
                        <input
                          type="number"
                          value={customHeight}
                          onChange={(e) => setCustomHeight(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Studio Photo Crop & Zoom Adjustments */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <label className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-600" /> 2. Crop, Zoom & Position
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Zoom ({zoom}%):</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="250"
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Rotation ({rotation}°):</span>
                      </div>
                      <input
                        type="range"
                        min="-45"
                        max="45"
                        value={rotation}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Move Horizontal (X):</span>
                      </div>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        value={panX}
                        onChange={(e) => setPanX(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Move Vertical (Y):</span>
                      </div>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        value={panY}
                        onChange={(e) => setPanY(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFlipX(!flipX)}
                      className={`px-3 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                        flipX ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" /> Flip Mirror Photo
                    </button>
                  </div>
                </div>

                {/* 3. Background Color & Image Enhancements */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <label className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-indigo-600" /> 3. Background Color & Light Enhancements
                  </label>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Studio Background Color:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {BACKGROUND_COLORS.map((bg) => (
                        <button
                          key={bg.id}
                          onClick={() => setBgColor(bg.value)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                            bgColor === bg.value
                              ? 'border-indigo-600 bg-indigo-50 font-extrabold text-slate-900 shadow-sm'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border ${bg.border} shadow-sm shrink-0`}
                            style={{ backgroundColor: bg.value === 'transparent' ? '#FFFFFF' : bg.value }}
                          />
                          <span className="text-[11px] font-bold truncate">{bg.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-amber-500" /> Brightness ({brightness}%):
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Contrast ({contrast}%):</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Multiple Print Sheet Options (More Photos on 1 Page) */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <label className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                    <Printer className="w-4 h-4 text-indigo-600" /> 4. Print Sheet Layout (Photos Per Page)
                  </label>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Select Paper Size & Photo Count:</span>
                    <select
                      value={selectedSheetLayout.id}
                      onChange={(e) => {
                        const layout = SHEET_LAYOUTS.find((l) => l.id === e.target.value);
                        if (layout) setSelectedSheetLayout(layout);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    >
                      {SHEET_LAYOUTS.map((layout) => (
                        <option key={layout.id} value={layout.id}>
                          {layout.name} ({layout.paper})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={drawCutLines}
                        onChange={(e) => setDrawCutLines(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-bold text-slate-700">Draw Scissor Cut Lines around photos</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleGeneratePassport}
                  disabled={isGenerating}
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Generate Passport Photos & Print Sheet</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results & Download Cards */}
        {singlePhotoUrl && sheetPhotoUrl && (
          <div className="space-y-6 pt-6 border-t border-slate-200 animate-in fade-in duration-300">
            <h3 className="text-lg font-black text-slate-900 text-center">🎉 Passport Photos & Print Sheet Ready</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Single Biometric Photo Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-center">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                  Single Biometric Photo
                </span>
                <div className="w-44 h-44 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-slate-200 bg-slate-50">
                  <img src={singlePhotoUrl} alt="Passport Single" className="w-full h-full object-contain" />
                </div>
                <div className="text-xs font-bold text-slate-700">
                  {selectedPreset.name} • {selectedPreset.label}
                </div>
                <a
                  href={singlePhotoUrl}
                  download={`passport-single-${selectedPreset.id}.jpg`}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Single Biometric Photo</span>
                </a>
              </div>

              {/* Printable Grid Sheet Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-center">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block flex items-center justify-center gap-1">
                  <Grid className="w-4 h-4 text-emerald-600" />
                  {selectedSheetLayout.name}
                </span>
                <div className="w-44 h-56 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-slate-200 bg-white p-1">
                  <img src={sheetPhotoUrl} alt="Printable Sheet" className="w-full h-full object-contain" />
                </div>
                <div className="text-xs font-bold text-slate-700">
                  {selectedSheetLayout.paper} • Ready for Home or Photo Studio Printing
                </div>
                <a
                  href={sheetPhotoUrl}
                  download={`passport-sheet-${selectedSheetLayout.id}.jpg`}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Multi-Photo Print Sheet</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

