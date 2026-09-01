'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { generateQRCodeDataUrl, generateQRCodeSVG } from '@/lib/utility-engine';
import { toast } from 'sonner';
import {
  Download,
  QrCode,
  UploadCloud,
  Palette,
  Globe,
  Wifi,
  FileText,
  MessageSquare,
  User,
  Trash2,
  Check,
  Sparkles,
  Maximize2,
} from 'lucide-react';

export type ContentType = 'url' | 'text' | 'wifi' | 'whatsapp' | 'vcard';

export const COLOR_PRESETS = [
  { id: 'classic', name: 'Classic Mono', fg: '#000000', bg: '#ffffff' },
  { id: 'indigo', name: 'Indigo Modern', fg: '#4f46e5', bg: '#ffffff' },
  { id: 'emerald', name: 'Emerald Clean', fg: '#059669', bg: '#ffffff' },
  { id: 'crimson', name: 'Crimson Red', fg: '#dc2626', bg: '#ffffff' },
  { id: 'navy', name: 'Deep Navy', fg: '#0f172a', bg: '#f8fafc' },
  { id: 'amber', name: 'Sunset Amber', fg: '#d97706', bg: '#fffbeb' },
];

export default function QRGeneratorPage() {
  const [contentType, setContentType] = useState<ContentType>('url');

  // Input states
  const [url, setUrl] = useState('https://omnitoolsuite.com');
  const [plainText, setPlainText] = useState('Welcome to FileZenith ToolSuite!');

  // Wi-Fi inputs
  const [wifiSsid, setWifiSsid] = useState('MyHomeWiFi');
  const [wifiPassword, setWifiPassword] = useState('SecretPassword123');
  const [wifiType, setWifiType] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // WhatsApp inputs
  const [waPhone, setWaPhone] = useState('919876543210');
  const [waMessage, setWaMessage] = useState('Hello! I would like to inquire about your services.');

  // VCard inputs
  const [vName, setVName] = useState('John Doe');
  const [vPhone, setVPhone] = useState('+1 234 567 8900');
  const [vEmail, setVEmail] = useState('johndoe@example.com');

  // Appearance states
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [exportWidth, setExportWidth] = useState<number>(1024);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

  // Generated outputs
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvg, setQrSvg] = useState<string>('');

  // Compute final QR text string based on selected content type
  const getComputedText = (): string => {
    if (contentType === 'url') return url.trim() || 'https://omnitoolsuite.com';
    if (contentType === 'text') return plainText.trim() || 'Hello World';
    if (contentType === 'wifi') {
      return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPassword};;`;
    }
    if (contentType === 'whatsapp') {
      const cleanPhone = waPhone.replace(/\D/g, '');
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
    }
    if (contentType === 'vcard') {
      return `BEGIN:VCARD\nVERSION:3.0\nN:${vName}\nFN:${vName}\nTEL:${vPhone}\nEMAIL:${vEmail}\nEND:VCARD`;
    }
    return url;
  };

  const finalQRText = getComputedText();

  useEffect(() => {
    async function updateQR() {
      if (!finalQRText.trim()) {
        setQrDataUrl('');
        setQrSvg('');
        return;
      }
      try {
        const dataUrl = await generateQRCodeDataUrl(finalQRText, {
          fgColor,
          bgColor,
          logoUrl,
          width: exportWidth,
        });
        const svgStr = await generateQRCodeSVG(finalQRText, { fgColor, bgColor });
        setQrDataUrl(dataUrl);
        setQrSvg(svgStr);
      } catch (err) {
        console.error(err);
      }
    }
    updateQR();
  }, [finalQRText, fgColor, bgColor, logoUrl, exportWidth]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoUrl(URL.createObjectURL(file));
      toast.success('PNG logo uploaded as center overlay!');
    }
  };

  const downloadPNG = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode-${Date.now()}.png`;
    a.click();
    toast.success('PNG QR code downloaded successfully!');
  };

  const downloadSVG = () => {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode-${Date.now()}.svg`;
    a.click();
    toast.success('Vector SVG QR code downloaded!');
  };

  return (
    <ToolLayout
      slug="/utility/qr-generator"
      title="Dynamic QR Code Generator with Logo"
      subtitle="Generate custom QR codes for URLs, Wi-Fi networks, WhatsApp chats, contact cards, and text. Embed logo overlay, select custom colors, and export HD PNG & SVG."
      badgeText="Vector QR Generator"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-24 md:pb-6">
        {/* Configuration Controls (Left Column) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-6 text-slate-900">
            {/* 1. Content Type Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                1. Select QR Content Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setContentType('url')}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    contentType === 'url' ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/80' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  <span>URL</span>
                </button>

                <button
                  onClick={() => setContentType('text')}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    contentType === 'text' ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/80' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Text</span>
                </button>

                <button
                  onClick={() => setContentType('wifi')}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    contentType === 'wifi' ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/80' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Wifi className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Wi-Fi</span>
                </button>

                <button
                  onClick={() => setContentType('whatsapp')}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    contentType === 'whatsapp' ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/80' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => setContentType('vcard')}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    contentType === 'vcard' ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/80' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>VCard</span>
                </button>
              </div>
            </div>

            {/* 2. QR Content Inputs in Pure Day Mode (White BG & Black Text) */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {contentType === 'url' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    <span>Website URL Link</span>
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                </div>
              )}

              {contentType === 'text' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Plain Text Content</span>
                  </label>
                  <textarea
                    rows={3}
                    value={plainText}
                    onChange={(e) => setPlainText(e.target.value)}
                    placeholder="Enter custom message, note, or code..."
                    className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                </div>
              )}

              {contentType === 'wifi' && (
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Wifi className="w-4 h-4 text-indigo-600" />
                    <span>Wi-Fi Network Credentials</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-700">Network Name (SSID):</span>
                      <input
                        type="text"
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        placeholder="MyHomeWiFi"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-700">Password:</span>
                      <input
                        type="text"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        placeholder="WiFiPassword123"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {contentType === 'whatsapp' && (
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <span>WhatsApp Direct Chat Link</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={waPhone}
                      onChange={(e) => setWaPhone(e.target.value)}
                      placeholder="Phone Number with Country Code (e.g. 919876543210)"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={waMessage}
                      onChange={(e) => setWaMessage(e.target.value)}
                      placeholder="Default message text"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              {contentType === 'vcard' && (
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-indigo-600" />
                    <span>Contact VCard Details</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={vName}
                      onChange={(e) => setVName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs"
                    />
                    <input
                      type="text"
                      value={vPhone}
                      onChange={(e) => setVPhone(e.target.value)}
                      placeholder="Phone Number"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs"
                    />
                    <input
                      type="email"
                      value={vEmail}
                      onChange={(e) => setVEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 3. Color Customization & Presets */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-indigo-600" />
                <span>3. QR Colors & Theme Presets</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setFgColor(preset.fg);
                      setBgColor(preset.bg);
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                      fgColor === preset.fg && bgColor === preset.bg
                        ? 'border-indigo-600 bg-indigo-50 font-black text-indigo-950 shadow-2xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs shrink-0"
                      style={{ backgroundColor: preset.fg }}
                    />
                    <span className="text-[11px] font-bold truncate">{preset.name}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">Foreground Color:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-white border border-slate-300 p-0.5"
                    />
                    <span className="text-xs font-bold text-slate-900 uppercase font-mono">{fgColor}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">Background Color:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-white border border-slate-300 p-0.5"
                    />
                    <span className="text-xs font-bold text-slate-900 uppercase font-mono">{bgColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Center Logo Overlay & HD Resolution */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex flex-wrap items-center justify-between gap-1">
                <span>4. Center Logo Overlay & HD Resolution</span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 shrink-0">
                  PNG / JPG Overlay
                </span>
              </label>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {/* Logo Upload Sub-Block */}
                <div className="space-y-1.5">
                  <span className="text-xs font-extrabold text-slate-700 block">Center Logo Overlay (Optional):</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-extrabold text-slate-900 shadow-2xs cursor-pointer">
                      <UploadCloud className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{logoUrl ? 'Change Center Logo' : 'Upload PNG Logo'}</span>
                      <input type="file" accept="image/png,image/jpeg" onChange={handleLogoUpload} className="hidden" />
                    </label>

                    {logoUrl && (
                      <button
                        type="button"
                        onClick={() => setLogoUrl(undefined)}
                        className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-extrabold transition-colors cursor-pointer shrink-0"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>

                {/* Resolution Selector Sub-Block */}
                <div className="space-y-1.5 pt-3 border-t border-slate-200/80">
                  <span className="text-xs font-extrabold text-slate-700 block">Export HD Resolution:</span>
                  <select
                    value={exportWidth}
                    onChange={(e) => setExportWidth(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-extrabold text-slate-900 shadow-2xs focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="512">512 × 512 px (Standard Web)</option>
                    <option value="1024">1024 × 1024 px (High Definition Print)</option>
                    <option value="2048">2048 × 2048 px (Ultra HD Vector Print)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Canvas Preview Card (Right Column) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5 text-center text-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Live Vector Preview
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Ready to Scan
            </span>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center min-h-[240px]">
            {qrDataUrl ? (
              <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                <img src={qrDataUrl} alt="Generated QR Code" className="w-56 h-56 object-contain" />
              </div>
            ) : (
              <div className="w-56 h-56 flex flex-col items-center justify-center text-slate-400 text-xs font-bold gap-2">
                <QrCode className="w-8 h-8 opacity-40" />
                <span>Enter text above to preview QR code</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 w-full pt-2">
            <button
              onClick={downloadPNG}
              disabled={!qrDataUrl}
              className="py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={downloadSVG}
              disabled={!qrSvg}
              className="py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Vector SVG</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Mobile Action Navbar */}
      {qrDataUrl && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-3xl p-2.5 flex items-center justify-between gap-2 md:hidden text-slate-900">
          <div className="flex items-center gap-2 pl-2">
            <QrCode className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-black text-slate-900">QR Code Ready</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadPNG}
              className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PNG</span>
            </button>

            <button
              onClick={downloadSVG}
              className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>SVG</span>
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
