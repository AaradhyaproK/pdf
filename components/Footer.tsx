import Link from 'next/link';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-white text-slate-600 border-t border-slate-200/80 pt-16 pb-12 mt-20 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <img src="/1.png" alt="Aurea Logo" className="w-8 h-8 object-contain" />
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                Aurea
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              100% Client-Side PDF, Image, and Daily Utility Platform. Engineered for privacy and speed.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full w-fit font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Server Guaranteed</span>
            </div>
          </div>

          {/* PDF Studio Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              PDF Studio
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/pdf/edit" className="hover:text-indigo-600 font-bold text-slate-900 transition-colors">Edit PDF Online</Link></li>
              <li><Link href="/pdf/compress" className="hover:text-indigo-600 transition-colors">Compress PDF</Link></li>
              <li><Link href="/pdf/compress-to-200kb" className="hover:text-indigo-600 transition-colors">Compress PDF to 200KB</Link></li>
              <li><Link href="/pdf/merge" className="hover:text-indigo-600 transition-colors">Merge PDF</Link></li>
              <li><Link href="/pdf/split" className="hover:text-indigo-600 transition-colors">Split PDF</Link></li>
              <li><Link href="/pdf/organize" className="hover:text-indigo-600 transition-colors">Organize & Rotate PDF</Link></li>
              <li><Link href="/pdf/ocr" className="hover:text-indigo-600 transition-colors">PDF OCR (Text Extractor)</Link></li>
              <li><Link href="/pdf/watermark" className="hover:text-indigo-600 transition-colors">Watermark PDF</Link></li>
              <li><Link href="/pdf/protect" className="hover:text-indigo-600 transition-colors">Password Protect PDF</Link></li>
              <li><Link href="/pdf/to-image" className="hover:text-indigo-600 transition-colors">PDF to JPG / PNG</Link></li>
            </ul>
          </div>

          {/* Image Studio Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Image Studio
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/image/pics-to-pdf" className="hover:text-indigo-600 font-bold text-slate-900 transition-colors">Pics to PDF (Photos to PDF)</Link></li>
              <li><Link href="/image/png-to-jpg" className="hover:text-indigo-600 font-bold text-slate-900 transition-colors">PNG to JPG Converter</Link></li>
              <li><Link href="/image/png-to-pdf" className="hover:text-indigo-600 font-bold text-slate-900 transition-colors">PNG to PDF Converter</Link></li>
              <li><Link href="/image/jpg-to-png" className="hover:text-indigo-600 transition-colors">JPG to PNG Converter</Link></li>
              <li><Link href="/image/compress" className="hover:text-indigo-600 transition-colors">Compress Image (Target KB)</Link></li>
              <li><Link href="/image/compress-to-50kb" className="hover:text-indigo-600 transition-colors">Compress Image to 50KB</Link></li>
              <li><Link href="/image/compress-to-100kb" className="hover:text-indigo-600 transition-colors">Compress Image to 100KB</Link></li>
              <li><Link href="/image/resize" className="hover:text-indigo-600 transition-colors">Resize Image (Pixels / %)</Link></li>
              <li><Link href="/image/passport-maker" className="hover:text-indigo-600 transition-colors">Passport Photo Maker</Link></li>
              <li><Link href="/image/remove-background" className="hover:text-indigo-600 transition-colors">AI Background Remover</Link></li>
              <li><Link href="/image/convert-heic" className="hover:text-indigo-600 transition-colors">Apple HEIC to JPG</Link></li>
              <li><Link href="/image/to-pdf" className="hover:text-indigo-600 transition-colors">Image to PDF Converter</Link></li>
            </ul>
          </div>

          {/* Daily Quick Utilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Daily Quick Utilities
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/utility/qr-generator" className="hover:text-indigo-600 transition-colors">QR Code Generator</Link></li>
              <li><Link href="/utility/word-counter" className="hover:text-indigo-600 transition-colors">Word Counter & Density</Link></li>
              <li><Link href="/utility/json-formatter" className="hover:text-indigo-600 transition-colors">JSON Formatter & CSV</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Aurea. All rights reserved. 100% Client-Side Computation.</p>
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>by</span>
            <a
              href="https://snab.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold text-indigo-600 hover:text-indigo-700 underline flex items-center gap-0.5"
            >
              <span>SNAB</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
