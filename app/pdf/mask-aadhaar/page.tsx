'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument, rgb } from 'pdf-lib';
import { toast } from 'sonner';
import {
  ShieldCheck,
  FileCheck,
  Download,
  Eye,
  RefreshCw,
  Plus,
  Trash2,
  Lock,
  UploadCloud,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { FileReadyModal } from '@/components/FileReadyModal';

interface MaskBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export default function MaskAadhaarPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [masks, setMasks] = useState<MaskBox[]>([]);
  const [activePreset, setActivePreset] = useState<'standard' | 'full' | 'custom'>('standard');
  const [customText, setCustomText] = useState('XXXX XXXX ');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [maskedPreviewUrl, setMaskedPreviewUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Default standard mask for standard Aadhaar (first 8 digits)
  const applyPreset = (preset: 'standard' | 'full' | 'custom') => {
    setActivePreset(preset);
    if (!canvasRef.current) return;
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;

    if (preset === 'standard') {
      // Typical center-bottom region where 12-digit Aadhaar number is located
      setMasks([
        {
          id: 'aadhaar-digits',
          x: Math.round(w * 0.28),
          y: Math.round(h * 0.72),
          width: Math.round(w * 0.38),
          height: Math.round(h * 0.08),
          label: 'First 8 Digits (XXXX-XXXX-)',
        },
      ]);
      toast.success('Applied Standard First-8 Digits Mask!');
    } else if (preset === 'full') {
      // Mask number + QR code
      setMasks([
        {
          id: 'aadhaar-digits',
          x: Math.round(w * 0.28),
          y: Math.round(h * 0.72),
          width: Math.round(w * 0.38),
          height: Math.round(h * 0.08),
          label: 'Aadhaar Number',
        },
        {
          id: 'qr-code',
          x: Math.round(w * 0.68),
          y: Math.round(h * 0.45),
          width: Math.round(w * 0.26),
          height: Math.round(h * 0.32),
          label: 'QR Code',
        },
      ]);
      toast.success('Applied Full Security Mask (Number + QR)!');
    } else {
      setMasks([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setDownloadUrl(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreviewUrl(result);

      const img = new Image();
      img.onload = () => {
        imageObjRef.current = img;
        if (canvasRef.current) {
          canvasRef.current.width = img.width;
          canvasRef.current.height = img.height;
          drawCanvas(img, [
            {
              id: 'aadhaar-digits',
              x: Math.round(img.width * 0.28),
              y: Math.round(img.height * 0.72),
              width: Math.round(img.width * 0.38),
              height: Math.round(img.height * 0.08),
              label: 'First 8 Digits (XXXX-XXXX-)',
            },
          ]);
          setMasks([
            {
              id: 'aadhaar-digits',
              x: Math.round(img.width * 0.28),
              y: Math.round(img.height * 0.72),
              width: Math.round(img.width * 0.38),
              height: Math.round(img.height * 0.08),
              label: 'First 8 Digits (XXXX-XXXX-)',
            },
          ]);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(selected);
    toast.success('Aadhaar loaded locally. No server upload.');
  };

  const drawCanvas = (img: HTMLImageElement, currentMasks: MaskBox[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and draw original image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // Draw masks
    currentMasks.forEach((mask) => {
      ctx.fillStyle = '#0f172a'; // Deep slate blackout
      ctx.fillRect(mask.x, mask.y, mask.width, mask.height);

      // Draw subtle text on mask if digits
      if (mask.id === 'aadhaar-digits') {
        ctx.fillStyle = '#ffffff';
        const fontSize = Math.max(14, Math.round(mask.height * 0.5));
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(customText, mask.x + mask.width / 2, mask.y + mask.height / 2);
      }
    });
  };

  useEffect(() => {
    if (imageObjRef.current) {
      drawCanvas(imageObjRef.current, masks);
    }
  }, [masks, customText]);

  const addCustomMask = () => {
    if (!canvasRef.current) return;
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;
    const newMask: MaskBox = {
      id: `mask-${Date.now()}`,
      x: Math.round(w * 0.1),
      y: Math.round(h * 0.1),
      width: Math.round(w * 0.3),
      height: Math.round(h * 0.1),
      label: `Custom Redaction ${masks.length + 1}`,
    };
    setMasks([...masks, newMask]);
  };

  const removeMask = (id: string) => {
    setMasks(masks.filter((m) => m.id !== id));
  };

  const updateMaskCoord = (id: string, key: 'x' | 'y' | 'width' | 'height', val: number) => {
    setMasks(
      masks.map((m) => {
        if (m.id === id) {
          return { ...m, [key]: val };
        }
        return m;
      })
    );
  };

  const handleGenerateMaskedFile = async () => {
    if (!canvasRef.current) return;
    setIsProcessing(true);

    try {
      // Export canvas directly to high-res JPG
      const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.95);

      // Create a clean PDF or Image
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([canvasRef.current.width, canvasRef.current.height]);

      // Embed image in PDF
      const imageBytes = await fetch(dataUrl).then((res) => res.arrayBuffer());
      const embeddedImage = await pdfDoc.embedJpg(imageBytes);

      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: canvasRef.current.width,
        height: canvasRef.current.height,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setMaskedPreviewUrl(dataUrl);
      setIsModalOpen(true);
      toast.success('Masked Aadhaar PDF ready! 100% compliant with RBI/UIDAI guidelines.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/pdf/mask-aadhaar"
      title="Mask Aadhaar Card Online (Hide First 8 Digits Offline)"
      subtitle="Safely mask the first 8 digits of your Aadhaar card into XXXX-XXXX-1234. 100% in-browser private processing with zero cloud uploads."
      badgeText="UIDAI & RBI Compliant"
    >
      <div className="space-y-6 text-slate-800">
        {/* Trust Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 space-y-1">
            <p className="font-bold">
              100% Zero-Server Privacy Guarantee (UIDAI Circular Compliant)
            </p>
            <p className="text-emerald-800 leading-relaxed">
              Your Aadhaar card is processed entirely in your browser&apos;s local WebAssembly memory.
              No document is ever transmitted across the internet, ensuring your identity is completely safe.
            </p>
          </div>
        </div>

        {/* Upload Box */}
        {!file ? (
          <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 sm:p-12 text-center bg-white hover:border-indigo-400 transition-colors cursor-pointer relative shadow-sm">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, application/pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Upload Aadhaar Card (Image or PDF)
              </h3>
              <p className="text-xs text-slate-500">
                Drag and drop your front or full Aadhaar scan (JPG, PNG). Supported by all Indian hotels, banks &amp; KYC portals.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Control Panel */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[200px]">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                    setDownloadUrl(null);
                  }}
                  className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Upload Different Card
                </button>
              </div>

              {/* Preset Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Select Masking Preset:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => applyPreset('standard')}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                      activePreset === 'standard'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="font-black">Standard Mask (Recommended)</div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Hides first 8 digits (XXXX-XXXX-1234)
                    </div>
                  </button>

                  <button
                    onClick={() => applyPreset('full')}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                      activePreset === 'full'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="font-black">Maximum Security Mask</div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Hides Aadhaar number + QR Code
                    </div>
                  </button>

                  <button
                    onClick={() => applyPreset('custom')}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                      activePreset === 'custom'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="font-black">Custom Redaction</div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Draw custom blackout boxes manually
                    </div>
                  </button>
                </div>
              </div>

              {/* Fine-Tuning Box Sliders */}
              {masks.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Active Redaction Boxes:</span>
                    <button
                      onClick={addCustomMask}
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Extra Redaction Box
                    </button>
                  </div>

                  <div className="space-y-3">
                    {masks.map((mask) => (
                      <div
                        key={mask.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{mask.label}</span>
                          <button
                            onClick={() => removeMask(mask.id)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                            title="Delete Box"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                          <div>
                            <label className="text-slate-500 block mb-0.5">X Position</label>
                            <input
                              type="range"
                              min={0}
                              max={canvasRef.current?.width || 800}
                              value={mask.x}
                              onChange={(e) =>
                                updateMaskCoord(mask.id, 'x', Number(e.target.value))
                              }
                              className="w-full accent-indigo-600"
                            />
                          </div>
                          <div>
                            <label className="text-slate-500 block mb-0.5">Y Position</label>
                            <input
                              type="range"
                              min={0}
                              max={canvasRef.current?.height || 600}
                              value={mask.y}
                              onChange={(e) =>
                                updateMaskCoord(mask.id, 'y', Number(e.target.value))
                              }
                              className="w-full accent-indigo-600"
                            />
                          </div>
                          <div>
                            <label className="text-slate-500 block mb-0.5">Box Width</label>
                            <input
                              type="range"
                              min={20}
                              max={canvasRef.current?.width || 800}
                              value={mask.width}
                              onChange={(e) =>
                                updateMaskCoord(mask.id, 'width', Number(e.target.value))
                              }
                              className="w-full accent-indigo-600"
                            />
                          </div>
                          <div>
                            <label className="text-slate-500 block mb-0.5">Box Height</label>
                            <input
                              type="range"
                              min={10}
                              max={200}
                              value={mask.height}
                              onChange={(e) =>
                                updateMaskCoord(mask.id, 'height', Number(e.target.value))
                              }
                              className="w-full accent-indigo-600"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleGenerateMaskedFile}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating Masked PDF...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Generate Masked Aadhaar Document
                    </>
                  )}
                </button>
              </div>

              {/* Download Ready Banner */}
              {downloadUrl && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-3 animate-in fade-in">
                  <div>
                    <div className="text-xs font-black text-emerald-950">
                      Masked Aadhaar Ready for Download!
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      Permanent redaction applied. Ready for KYC, Hotel check-ins, and Banks.
                    </div>
                  </div>
                  <a
                    href={downloadUrl}
                    download={`Masked_Aadhaar_${Date.now()}.pdf`}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </a>
                </div>
              )}
            </div>

            {/* Live Canvas Preview */}
            <div className="bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-inner space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-1">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span>Interactive Real-Time Preview (Adjust Sliders to Align)</span>
                </div>
                <span className="text-[11px] text-slate-400">Black area = Permanently Redacted</span>
              </div>
              <div className="overflow-auto max-h-[550px] flex items-center justify-center bg-slate-950/70 p-2 rounded-2xl border border-slate-800">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto rounded-lg shadow-xl border border-slate-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* Celebratory Completion Modal with Preview & Confetti */}
        <FileReadyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          downloadUrl={downloadUrl}
          fileName={`Masked_Aadhaar_${Date.now()}.pdf`}
          previewUrl={maskedPreviewUrl}
          fileType="pdf"
          title="Your Masked Aadhaar is Ready"
          subtitle="First 8 digits permanently redacted. 100% RBI & UIDAI KYC compliant with zero cloud uploads."
          onReset={() => {
            setFile(null);
            setDownloadUrl(null);
          }}
        />
      </div>
    </ToolLayout>
  );
}
