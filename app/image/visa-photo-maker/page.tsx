'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { toast } from 'sonner';
import {
  ShieldCheck,
  UploadCloud,
  Download,
  RefreshCw,
  Sliders,
  Crop,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { FileReadyModal } from '@/components/FileReadyModal';

interface VisaPreset {
  id: string;
  name: string;
  country: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  maxKb: number;
  bgDefault: string;
  description: string;
}

const PRESETS: VisaPreset[] = [
  {
    id: 'us-visa',
    name: 'US Visa & Passport (DS-160)',
    country: 'United States',
    widthMm: 51,
    heightMm: 51,
    widthPx: 600,
    heightPx: 600,
    maxKb: 240,
    bgDefault: '#ffffff',
    description: 'Exact 2x2 inch (51x51mm). Head must occupy between 50% and 69% of image height.',
  },
  {
    id: 'schengen-visa',
    name: 'Schengen European Visa',
    country: 'European Union (29 countries)',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    maxKb: 300,
    bgDefault: '#f1f5f9',
    description: '35x45mm standard. 70-80% face coverage with neutral background.',
  },
  {
    id: 'uk-visa',
    name: 'UK Standard Visitor Visa',
    country: 'United Kingdom',
    widthMm: 35,
    heightMm: 45,
    widthPx: 413,
    heightPx: 531,
    maxKb: 300,
    bgDefault: '#f8fafc',
    description: '35x45mm dimensions. Clear cream or light grey background required.',
  },
  {
    id: 'canada-visa',
    name: 'Canadian Visa & PR (IRCC)',
    country: 'Canada',
    widthMm: 50,
    heightMm: 70,
    widthPx: 590,
    heightPx: 826,
    maxKb: 400,
    bgDefault: '#ffffff',
    description: '50x70mm. Chin to crown measurement between 31mm and 36mm.',
  },
  {
    id: 'india-passport',
    name: 'Indian Passport & OCI',
    country: 'India',
    widthMm: 51,
    heightMm: 51,
    widthPx: 600,
    heightPx: 600,
    maxKb: 200,
    bgDefault: '#ffffff',
    description: '51x51mm (2x2 inch) for OCI or 35x45mm for regular passport renewal.',
  },
];

export default function VisaPhotoMakerPage() {
  const [selectedPreset, setSelectedPreset] = useState<VisaPreset>(PRESETS[0]);
  const [file, setFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showGuides, setShowGuides] = useState(true);
  const [printableSheet, setPrintableSheet] = useState(false);
  const [modalDownloadUrl, setModalDownloadUrl] = useState<string | null>(null);
  const [modalFileName, setModalFileName] = useState('');
  const [modalPreviewUrl, setModalPreviewUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    setFile(uploaded);
    setZoom(1);
    setPanX(0);
    setPanY(0);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        imageObjRef.current = img;
        renderCanvas();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(uploaded);
    toast.success('Photo loaded! Center your face inside the guideline oval.');
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = selectedPreset.widthPx;
    const h = selectedPreset.heightPx;

    canvas.width = w;
    canvas.height = h;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    // Compute aspect and draw scaled image
    const imgAspect = img.width / img.height;
    const canvasAspect = w / h;

    let drawW = w * zoom;
    let drawH = h * zoom;

    if (imgAspect > canvasAspect) {
      drawW = drawH * imgAspect;
    } else {
      drawH = drawW / imgAspect;
    }

    const drawX = (w - drawW) / 2 + panX;
    const drawY = (h - drawH) / 2 + panY;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Reset filter
    ctx.filter = 'none';

    // Draw Face Biometric Guidelines if toggled
    if (showGuides) {
      ctx.save();
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);

      // Oval Head Guide (55% to 65% of height)
      const headCenterX = w / 2;
      const headCenterY = h * 0.45;
      const headRadiusX = w * 0.24;
      const headRadiusY = h * 0.28;

      ctx.beginPath();
      ctx.ellipse(headCenterX, headCenterY, headRadiusX, headRadiusY, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Eye line guide
      ctx.strokeStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(w * 0.25, h * 0.42);
      ctx.lineTo(w * 0.75, h * 0.42);
      ctx.stroke();

      // Chin guide line
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(w * 0.3, h * 0.72);
      ctx.lineTo(w * 0.7, h * 0.72);
      ctx.stroke();

      ctx.restore();
    }
  };

  useEffect(() => {
    if (imageObjRef.current) {
      renderCanvas();
    }
  }, [selectedPreset, zoom, panX, panY, brightness, contrast, bgColor, showGuides]);

  const handleDownloadSingle = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObjRef.current) return;

    // Temporarily hide guides for clean export
    const wasGuides = showGuides;
    setShowGuides(false);

    setTimeout(() => {
      renderCanvas();
      const exportCanvas = canvasRef.current;
      if (!exportCanvas) return;

      exportCanvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const fname = `${selectedPreset.id}_photo_${selectedPreset.widthMm}x${selectedPreset.heightMm}mm.jpg`;
          const preview = exportCanvas.toDataURL('image/jpeg', 0.85);
          setShowGuides(wasGuides);
          setModalDownloadUrl(url);
          setModalFileName(fname);
          setModalPreviewUrl(preview);
          setIsModalOpen(true);
          toast.success(`Generated ${selectedPreset.name} photo!`);
        },
        'image/jpeg',
        0.92
      );
    }, 50);
  };

  const handleDownloadSheet = () => {
    // 4x6 inch printable sheet (1200 x 1800 px at 300 DPI)
    if (!imageObjRef.current) return;
    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = 1800; // 6 inch
    sheetCanvas.height = 1200; // 4 inch
    const ctx = sheetCanvas.getContext('2d');
    if (!ctx) return;

    // White sheet
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

    // Export single image without guides
    const singleCanvas = document.createElement('canvas');
    singleCanvas.width = selectedPreset.widthPx;
    singleCanvas.height = selectedPreset.heightPx;
    const sCtx = singleCanvas.getContext('2d');
    if (!sCtx) return;

    sCtx.fillStyle = bgColor;
    sCtx.fillRect(0, 0, singleCanvas.width, singleCanvas.height);
    sCtx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    const img = imageObjRef.current;
    const imgAspect = img.width / img.height;
    const canvasAspect = selectedPreset.widthPx / selectedPreset.heightPx;
    let drawW = selectedPreset.widthPx * zoom;
    let drawH = selectedPreset.heightPx * zoom;
    if (imgAspect > canvasAspect) drawW = drawH * imgAspect;
    else drawH = drawW / imgAspect;
    const drawX = (selectedPreset.widthPx - drawW) / 2 + panX;
    const drawY = (selectedPreset.heightPx - drawH) / 2 + panY;
    sCtx.drawImage(img, drawX, drawY, drawW, drawH);

    // Grid layout: 2 rows of 3 photos or 2 rows of 4 photos
    const cols = 3;
    const rows = 2;
    const cellW = selectedPreset.widthPx * 0.9;
    const cellH = selectedPreset.heightPx * 0.9;
    const startX = (sheetCanvas.width - cols * cellW - (cols - 1) * 40) / 2;
    const startY = (sheetCanvas.height - rows * cellH - (rows - 1) * 40) / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (cellW + 40);
        const y = startY + r * (cellH + 40);
        ctx.drawImage(singleCanvas, x, y, cellW, cellH);

        // Subtle cutting border
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellW, cellH);
      }
    }

    sheetCanvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Printable_4x6_${selectedPreset.id}_sheet.jpg`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Downloaded 6-in-1 Printable 4x6 Sheet!');
      },
      'image/jpeg',
      0.95
    );
  };

  return (
    <ToolLayout
      slug="/image/visa-photo-maker"
      title="Online Visa & Passport Photo Maker (2x2 Inch / 35x45mm)"
      subtitle="Generate compliant passport and visa photos for US DS-160, Schengen, UK, Canada & India. Includes biometric head guide and 4x6 printable grid."
      badgeText="Official Embassy Specs"
    >
      <div className="space-y-6 text-slate-800">
        {/* Embassy Guarantee Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-950 space-y-1">
            <p className="font-bold">
              Guaranteed Embassy Biometric Sizing (ICAO &amp; US State Dept Standards)
            </p>
            <p className="text-indigo-800 leading-relaxed">
              Standardized pixel dimensions, strict millimeter proportions, and head-to-chin oval guides ensure your photo passes automated biometric visa checks without rejection.
            </p>
          </div>
        </div>

        {/* Preset Selector Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <label className="text-xs font-black text-slate-900 block uppercase tracking-wider">
            1. Select Destination Country / Visa Type:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPreset(preset);
                    setBgColor(preset.bgDefault);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between font-black text-xs">
                    <span>{preset.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-600 font-bold">
                      {preset.widthMm}x{preset.heightMm} mm
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload or Editor */}
        {!file ? (
          <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 sm:p-14 text-center bg-white hover:border-indigo-400 transition-colors cursor-pointer relative shadow-sm">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Upload Portrait Photo or Selfie
              </h3>
              <p className="text-xs text-slate-500">
                Look straight into camera with neutral expression. We will crop, zoom, center, and verify it against {selectedPreset.name} dimensions.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Sliders & Adjustments (lg:col-span-5) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="text-xs font-black text-slate-900">
                  Biometric Framing &amp; Filters
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Change Photo
                </button>
              </div>

              {/* Zoom & Positioning */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Face Scale / Zoom:</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={2.5}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Horizontal Shift:</span>
                      <span>{panX}px</span>
                    </div>
                    <input
                      type="range"
                      min={-200}
                      max={200}
                      value={panX}
                      onChange={(e) => setPanX(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Vertical Shift:</span>
                      <span>{panY}px</span>
                    </div>
                    <input
                      type="range"
                      min={-200}
                      max={200}
                      value={panY}
                      onChange={(e) => setPanY(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* Lighting & Contrast */}
              <div className="space-y-3 border-t border-slate-100 pt-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Brightness:</span>
                    <span>{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min={70}
                    max={140}
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Contrast:</span>
                    <span>{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min={70}
                    max={140}
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>

              {/* Background Color Picker */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <label className="text-xs font-bold text-slate-700 block">
                  Background Color:
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Pure White (US/India)', hex: '#ffffff' },
                    { label: 'Off-White (Schengen)', hex: '#f8fafc' },
                    { label: 'Light Grey (UK)', hex: '#e2e8f0' },
                    { label: 'Light Blue', hex: '#dbeafe' },
                  ].map((bg) => (
                    <button
                      key={bg.hex}
                      onClick={() => setBgColor(bg.hex)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        bgColor === bg.hex ? 'border-indigo-600 scale-110 shadow-sm' : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: bg.hex }}
                      title={bg.label}
                    />
                  ))}
                </div>
              </div>

              {/* Guide Overlay Toggle */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-slate-700">
                <span>Show Biometric Guide Oval:</span>
                <button
                  onClick={() => setShowGuides(!showGuides)}
                  className={`px-3 py-1 rounded-full text-[11px] font-black transition-colors ${
                    showGuides ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {showGuides ? 'Enabled' : 'Hidden'}
                </button>
              </div>

              {/* Download Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleDownloadSingle}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Single Visa Photo ({selectedPreset.widthMm}x{selectedPreset.heightMm}mm)
                </button>

                <button
                  onClick={handleDownloadSheet}
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  Download 6-Photo Printable Sheet (4x6 Inch)
                </button>
              </div>
            </div>

            {/* Right Column: Live Visual Canvas (lg:col-span-7) */}
            <div className="lg:col-span-7 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 text-center">
              <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                <span>Official Sizing Preview: {selectedPreset.widthMm} x {selectedPreset.heightMm} mm</span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {selectedPreset.widthPx} x {selectedPreset.heightPx} px @ 300 DPI
                </span>
              </div>

              <div className="flex items-center justify-center p-4 bg-slate-950/70 rounded-2xl border border-slate-800 min-h-[380px]">
                <canvas
                  ref={canvasRef}
                  className="rounded-lg shadow-2xl max-w-full max-h-[460px] border border-slate-700"
                />
              </div>

              <div className="text-left bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 text-[11px] text-slate-300 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  Biometric Guideline Legend:
                </div>
                <p>• <span className="text-indigo-400 font-bold">Purple Oval:</span> Fit your entire head and hair inside this perimeter.</p>
                <p>• <span className="text-cyan-400 font-bold">Cyan Line:</span> Align your eye line horizontally here.</p>
                <p>• <span className="text-emerald-400 font-bold">Green Line:</span> Align your lower chin here.</p>
              </div>
            </div>
          </div>
        )}

        {/* Celebratory Completion Modal with Preview & Confetti */}
        <FileReadyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          downloadUrl={modalDownloadUrl}
          fileName={modalFileName || 'Visa_Photo.jpg'}
          previewUrl={modalPreviewUrl}
          fileType="image"
          title="Your Visa Photo is Ready"
          subtitle={`Sized strictly to official ${selectedPreset.name} (${selectedPreset.widthMm}x${selectedPreset.heightMm}mm) biometric standards.`}
        />
      </div>
    </ToolLayout>
  );
}
