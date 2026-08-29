'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { generateQRCodeDataUrl, generateQRCodeSVG } from '@/lib/utility-engine';
import { toast } from 'sonner';
import { Download, QrCode, UploadCloud, Palette } from 'lucide-react';

export default function QRGeneratorPage() {
  const [text, setText] = useState('https://omnitoolsuite.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvg, setQrSvg] = useState<string>('');

  useEffect(() => {
    async function updateQR() {
      if (!text.trim()) {
        setQrDataUrl('');
        setQrSvg('');
        return;
      }
      try {
        const dataUrl = await generateQRCodeDataUrl(text, { fgColor, bgColor, logoUrl });
        const svgStr = await generateQRCodeSVG(text, { fgColor, bgColor });
        setQrDataUrl(dataUrl);
        setQrSvg(svgStr);
      } catch (err) {
        console.error(err);
      }
    }
    updateQR();
  }, [text, fgColor, bgColor, logoUrl]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoUrl(URL.createObjectURL(file));
      toast.success('Center logo uploaded!');
    }
  };

  const downloadPNG = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'qrcode.png';
    a.click();
    toast.success('PNG QR code downloaded!');
  };

  const downloadSVG = () => {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.svg';
    a.click();
    toast.success('Vector SVG QR code downloaded!');
  };

  return (
    <ToolLayout
      slug="/utility/qr-generator"
      title="Dynamic QR Code Generator with Logo"
      subtitle="Generate custom QR codes for URLs, text, and Wi-Fi. Embed logo, pick custom colors, export PNG & vector SVG."
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Configuration Controls */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-indigo-500" />
              QR Code Content (URL or Text)
            </label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter website link, text, or phone number..."
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Color Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" /> Foreground Color
              </label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full h-11 rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-800 border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" /> Background Color
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-11 rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-800 border"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">Center Logo Overlay (PNG)</label>
            <div className="flex items-center gap-3">
              <label className="px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-indigo-500" />
                <span>{logoUrl ? 'Change Logo Image' : 'Upload PNG Logo'}</span>
                <input type="file" accept="image/png,image/jpeg" onChange={handleLogoUpload} className="hidden" />
              </label>
              {logoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoUrl(undefined)}
                  className="text-xs text-rose-500 font-bold hover:underline"
                >
                  Remove Logo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Canvas Preview Card */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-5 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Live Preview
          </span>

          <div className="p-4 bg-white rounded-2xl shadow-lg border">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Generated QR Code" className="w-48 h-48 object-contain" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                Enter text to preview
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              onClick={downloadPNG}
              disabled={!qrDataUrl}
              className="py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>PNG Image</span>
            </button>
            <button
              onClick={downloadSVG}
              disabled={!qrSvg}
              className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Vector SVG</span>
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
