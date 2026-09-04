'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import {
  MessageSquare,
  Send,
  QrCode,
  Download,
  Copy,
  Share2,
  ExternalLink,
  ShieldCheck,
  UserPlus,
  Sparkles,
} from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', country: 'India 🇮🇳', flag: '🇮🇳' },
  { code: '+1', country: 'United States / Canada 🇺🇸', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom 🇬🇧', flag: '🇬🇧' },
  { code: '+971', country: 'UAE 🇦🇪', flag: '🇦🇪' },
  { code: '+61', country: 'Australia 🇦🇺', flag: '🇦🇺' },
  { code: '+49', country: 'Germany 🇩🇪', flag: '🇩🇪' },
  { code: '+33', country: 'France 🇫🇷', flag: '🇫🇷' },
  { code: '+65', country: 'Singapore 🇸🇬', flag: '🇸🇬' },
  { code: '+966', country: 'Saudi Arabia 🇸🇦', flag: '🇸🇦' },
];

export default function WhatsAppDirectChatPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('+91');
  const [phoneNumber, setPhoneNumber] = useState<string>('9876543210');
  const [message, setMessage] = useState<string>('Hello! Reaching out via WhatsApp direct chat.');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const fullPhone = `${selectedCountry.replace('+', '')}${cleanPhone}`;
  const whatsappUrl = `https://wa.me/${fullPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  // Generate QR Code
  useEffect(() => {
    if (fullPhone.length >= 7) {
      QRCode.toDataURL(whatsappUrl, { width: 300, margin: 2, color: { dark: '#059669', light: '#ffffff' } })
        .then((url) => setQrDataUrl(url))
        .catch(() => {});
    } else {
      setQrDataUrl('');
    }
  }, [fullPhone, message, whatsappUrl]);

  const handleOpenWhatsApp = () => {
    if (cleanPhone.length < 7) {
      toast.error('Please enter a valid mobile phone number.');
      return;
    }
    window.open(whatsappUrl, '_blank');
    toast.success('Launching WhatsApp chat!');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(whatsappUrl);
    toast.success('Direct WhatsApp link copied to clipboard!');
  };

  const handleDownloadVCard = () => {
    if (cleanPhone.length < 7) {
      toast.error('Please enter a valid phone number.');
      return;
    }
    const vcardContent = `BEGIN:VCARD\nVERSION:3.0\nFN:WhatsApp Contact (${fullPhone})\nTEL;TYPE=CELL:${selectedCountry}${cleanPhone}\nEND:VCARD`;
    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Contact_${fullPhone}.vcf`;
    link.click();
    toast.success('vCard contact file downloaded!');
  };

  return (
    <ToolLayout
      slug="/social/whatsapp-direct-chat"
      title="WhatsApp Direct Chat Launcher Without Saving Number"
      subtitle="Send WhatsApp messages directly without saving phone numbers to your contacts. Instant wa.me link launcher, custom message generator & QR code scanner."
      badgeText="WhatsApp Direct Helper"
    >
      <div className="space-y-6 pb-24 md:pb-6 text-slate-900">
        {/* Input Form Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-emerald-600" />
                <span>Direct WhatsApp Chat Launcher</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                No need to save unknown contacts to phonebook. 100% official wa.me link.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
              No Contact Saved
            </span>
          </div>

          <div className="space-y-4">
            {/* Phone Number Inputs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Country Code & Mobile Phone Number
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-4 py-4 rounded-2xl border-2 border-slate-300 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:border-emerald-600 text-sm cursor-pointer"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.country})
                    </option>
                  ))}
                </select>

                <div className="relative flex-1">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-4 pr-4 py-4 rounded-2xl border-2 border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-mono text-xl font-black focus:outline-none focus:border-emerald-600 shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Optional Pre-filled Message */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Pre-filled Message (Optional)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full p-4 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white text-slate-900 font-medium text-sm focus:outline-none focus:border-emerald-600 shadow-inner"
              />
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="flex-1 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Send className="w-5 h-5" />
                <span>Open in WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="px-5 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm flex items-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadVCard}
                className="px-5 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm flex items-center gap-2 cursor-pointer"
                title="Download .vcf Contact Card"
              >
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>Save VCF</span>
              </button>
            </div>
          </div>
        </div>

        {/* QR Code & Deep Link Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white space-y-6 border border-slate-800 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Instant QR Code Scanner
              </span>
            </div>
            <span className="text-xs font-mono text-slate-300 truncate max-w-xs">{whatsappUrl}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 justify-center py-2">
            {qrDataUrl ? (
              <div className="p-4 bg-white rounded-3xl shadow-2xl border-4 border-emerald-500 shrink-0">
                <img src={qrDataUrl} alt="WhatsApp Direct QR Code" className="w-48 h-48 rounded-xl" />
              </div>
            ) : (
              <div className="w-48 h-48 rounded-3xl bg-white/10 flex items-center justify-center text-slate-400 text-xs font-bold">
                Enter Phone Number
              </div>
            )}

            <div className="space-y-3 text-center sm:text-left max-w-sm">
              <h3 className="text-xl font-black text-white">Scan to Chat Instantly</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Scan this QR code using your phone camera or WhatsApp scanner to open chat directly on your phone.
              </p>
              <div className="pt-2">
                <a
                  href={qrDataUrl}
                  download={`WhatsApp_QR_${fullPhone}.png`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download QR PNG</span>
                </a>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              100% Private. Phone numbers are never saved on FileZenith servers.
            </span>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
