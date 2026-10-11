'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Smartphone,
  Download,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Wrench,
  Mail,
  ExternalLink,
} from 'lucide-react';

export function Footer() {
  const [openSection, setOpenSection] = useState<'pdf' | 'image' | 'company' | null>('pdf');

  const toggleSection = (section: 'pdf' | 'image' | 'company') => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer id="main-footer" className="w-full bg-white text-slate-600 border-t border-slate-200/80 pt-10 sm:pt-16 pb-16 sm:pb-12 mt-12 sm:mt-20 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Mobile Brand Card Header (Mobile Only) */}
        <div className="sm:hidden p-5 rounded-3xl bg-slate-900 text-white space-y-3.5 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src="/filezenith-logo.png" alt="FileZenith Logo" className="w-8 h-8 object-contain" />
              <span className="font-black text-lg text-white tracking-tight">FileZenith</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> 100% Client-Side
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            100% Free Client-Side Document &amp; Image Studio. All conversion engines execute strictly in browser RAM with zero cloud uploads.
          </p>
          <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3">
            <a
              href="mailto:hello@snab.co.in"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white font-bold transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>hello@snab.co.in</span>
            </a>
            <a
              href="https://www.producthunt.com/products/filezenith?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-filezenith"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:opacity-95 transition-opacity"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1271104&theme=light&t=1791285270103"
                alt="FileZenith - 100% private in-browser PDF, image & document studio | Product Hunt"
                width={180}
                height={40}
                className="w-[150px] h-auto rounded-lg"
              />
            </a>
          </div>
        </div>

        {/* Mobile Accordion Nav Links (< sm) */}
        <div className="sm:hidden space-y-3">
          {/* PDF Studio Accordion */}
          <div className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden shadow-2xs">
            <button
              onClick={() => toggleSection('pdf')}
              className="w-full p-4 flex items-center justify-between text-left font-black text-slate-900 bg-slate-50/50 hover:bg-slate-100/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">PDF Studio</span>
                <span className="text-[10px] bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded-full">12 Tools</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openSection === 'pdf' ? 'rotate-180 text-rose-600' : ''}`} />
            </button>
            {openSection === 'pdf' && (
              <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-1 gap-2 animate-in fade-in duration-150">
                <Link href="/pdf/edit" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Edit PDF Online</Link>
                <Link href="/pdf/pdf-to-word" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">PDF to Word (DOCX)</Link>
                <Link href="/pdf/word-to-pdf" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Word to PDF Converter</Link>
                <Link href="/pdf/compress" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Compress PDF (Auto)</Link>
                <Link href="/pdf/compress-to-100kb" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Compress PDF to 100KB</Link>
                <Link href="/pdf/compress-to-200kb" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Compress PDF to 200KB</Link>
                <Link href="/pdf/merge" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Merge PDF</Link>
                <Link href="/pdf/split" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Split PDF</Link>
                <Link href="/pdf/organize" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Organize &amp; Rotate PDF</Link>
                <Link href="/pdf/ocr" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">PDF OCR (Text Extractor)</Link>
                <Link href="/pdf/protect" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Password Protect PDF</Link>
                <Link href="/pdf/remove-password" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Unlock / Remove Password</Link>
              </div>
            )}
          </div>

          {/* Image Studio Accordion */}
          <div className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden shadow-2xs">
            <button
              onClick={() => toggleSection('image')}
              className="w-full p-4 flex items-center justify-between text-left font-black text-slate-900 bg-slate-50/50 hover:bg-slate-100/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">Image Studio</span>
                <span className="text-[10px] bg-sky-100 text-sky-700 font-extrabold px-2 py-0.5 rounded-full">12 Tools</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openSection === 'image' ? 'rotate-180 text-sky-600' : ''}`} />
            </button>
            {openSection === 'image' && (
              <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-1 gap-2 animate-in fade-in duration-150">
                <Link href="/image/pics-to-pdf" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Pics to PDF (Photos to PDF)</Link>
                <Link href="/image/webp-to-jpg" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">WebP to JPG Converter</Link>
                <Link href="/image/jpg-to-webp" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">JPG to WebP Converter</Link>
                <Link href="/image/png-to-jpg" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">PNG to JPG Converter</Link>
                <Link href="/image/png-to-pdf" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">PNG to PDF Converter</Link>
                <Link href="/image/jpg-to-png" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">JPG to PNG Converter</Link>
                <Link href="/image/compress" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Compress Image (Target KB)</Link>
                <Link href="/image/compress-to-50kb" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Compress Image to 50KB</Link>
                <Link href="/image/compress-to-100kb" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Compress Image to 100KB</Link>
                <Link href="/image/passport-maker" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Passport Photo Maker</Link>
                <Link href="/image/remove-background" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">AI Background Remover</Link>
                <Link href="/image/convert-heic" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Apple HEIC to JPG</Link>
              </div>
            )}
          </div>

          {/* Company & Legal Accordion */}
          <div className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden shadow-2xs">
            <button
              onClick={() => toggleSection('company')}
              className="w-full p-4 flex items-center justify-between text-left font-black text-slate-900 bg-slate-50/50 hover:bg-slate-100/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">Company &amp; Legal</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openSection === 'company' ? 'rotate-180 text-indigo-600' : ''}`} />
            </button>
            {openSection === 'company' && (
              <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-1 gap-2 animate-in fade-in duration-150">
                <Link href="/about" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">About Us (Founder &amp; Team)</Link>
                <Link href="/contact" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Contact Support</Link>
                <Link href="/security" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Security &amp; Zero-Server Architecture</Link>
                <Link href="/privacy" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Terms of Service</Link>
                <Link href="/blog" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Guides &amp; Exam Blog</Link>
                <Link href="/download-app" className="p-2 rounded-xl text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors">Download Offline Mobile App</Link>
                <a href="mailto:hello@snab.co.in" className="p-2 rounded-xl text-xs font-medium text-indigo-600 hover:underline flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>hello@snab.co.in</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Desktop 4-Column Footer Navigation (Unified & Standardized) */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <img src="/filezenith-logo.png" alt="FileZenith Logo" className="w-8 h-8 object-contain" />
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                FileZenith
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              100% Client-Side PDF, Image, and Utility Studio. All document tools execute locally in your browser memory with zero cloud file uploads.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full w-fit font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Server Guaranteed</span>
            </div>

            {/* Official Support Email */}
            <div className="pt-1">
              <a
                href="mailto:hello@snab.co.in"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 w-fit"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>hello@snab.co.in</span>
              </a>
            </div>

            {/* Product Hunt Featured Badge */}
            <div className="pt-1">
              <a
                href="https://www.producthunt.com/products/filezenith?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-filezenith"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-95 transition-opacity"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1271104&theme=light&t=1791285270103"
                  alt="FileZenith - 100% private in-browser PDF, image & document studio | Product Hunt"
                  width={250}
                  height={54}
                  className="w-[195px] h-auto rounded-lg shadow-2xs border border-slate-200/70"
                />
              </a>
            </div>
          </div>

          {/* PDF Studio Links (Standard Typography) */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              PDF Studio
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/pdf/edit" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Edit PDF Online</Link></li>
              <li><Link href="/pdf/pdf-to-word" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">PDF to Word (DOCX)</Link></li>
              <li><Link href="/pdf/word-to-pdf" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Word to PDF Converter</Link></li>
              <li><Link href="/pdf/compress" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Compress PDF (Auto)</Link></li>
              <li><Link href="/pdf/compress-to-100kb" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Compress PDF to 100KB</Link></li>
              <li><Link href="/pdf/compress-to-200kb" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Compress PDF to 200KB</Link></li>
              <li><Link href="/pdf/merge" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Merge PDF</Link></li>
              <li><Link href="/pdf/split" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Split PDF</Link></li>
              <li><Link href="/pdf/organize" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Organize &amp; Rotate PDF</Link></li>
              <li><Link href="/pdf/ocr" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">PDF OCR (Text Extractor)</Link></li>
              <li><Link href="/pdf/watermark" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Watermark PDF</Link></li>
              <li><Link href="/pdf/protect" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Password Protect PDF</Link></li>
              <li><Link href="/pdf/remove-password" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Unlock / Remove Password</Link></li>
            </ul>
          </div>

          {/* Image Studio Links (Standard Typography) */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Image Studio
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/image/pics-to-pdf" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Pics to PDF (Photos to PDF)</Link></li>
              <li><Link href="/image/webp-to-jpg" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">WebP to JPG Converter</Link></li>
              <li><Link href="/image/jpg-to-webp" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">JPG to WebP Converter</Link></li>
              <li><Link href="/image/png-to-jpg" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">PNG to JPG Converter</Link></li>
              <li><Link href="/image/png-to-pdf" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">PNG to PDF Converter</Link></li>
              <li><Link href="/image/jpg-to-png" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">JPG to PNG Converter</Link></li>
              <li><Link href="/image/compress" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Compress Image (Target KB)</Link></li>
              <li><Link href="/image/compress-to-50kb" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Compress Image to 50KB</Link></li>
              <li><Link href="/image/compress-to-100kb" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Compress Image to 100KB</Link></li>
              <li><Link href="/image/passport-maker" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Passport Photo Maker</Link></li>
              <li><Link href="/image/remove-background" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">AI Background Remover</Link></li>
              <li><Link href="/image/convert-heic" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Apple HEIC to JPG</Link></li>
              <li><Link href="/image/resize" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Resize Image (Pixels / %)</Link></li>
            </ul>
          </div>

          {/* Company & Utilities Links (Standard Typography) */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Company &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">About Us (Founder &amp; Team)</Link></li>
              <li><Link href="/contact" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Contact Support</Link></li>
              <li><Link href="/security" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Security &amp; Zero-Server Tech</Link></li>
              <li><Link href="/privacy" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Terms of Service</Link></li>
              <li><Link href="/blog" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Guides &amp; Exam Blog</Link></li>
              <li><Link href="/download-app" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Download Offline App (PWA)</Link></li>
              <li><Link href="/utility/electricity-bill-calculator" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Electricity Bill Calculator</Link></li>
              <li><Link href="/utility/epf-calculator" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">EPF Balance Calculator</Link></li>
              <li><Link href="/utility/age-calculator" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Age Calculator &amp; Birthday</Link></li>
              <li><Link href="/utility/percentage-calculator" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Percentage Calculator</Link></li>
              <li><Link href="/social/whatsapp-direct-chat" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">WhatsApp Direct Chat</Link></li>
              <li>
                <a
                  href="https://www.snab.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>Snab Software Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Highlighted Mobile App Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 border border-slate-800">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-black text-white flex items-center justify-center md:justify-start gap-2">
                <span>Download FileZenith Mobile App</span>
                <span className="text-[9px] bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-black uppercase">
                  100% Offline
                </span>
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium leading-normal">
                Install our verified web app to use all 50+ document tools offline without cellular data or Wi-Fi.
              </p>
            </div>
          </div>

          <Link
            href="/download-app"
            className="w-full md:w-auto px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-indigo-200" />
            <span>Download Mobile App Now</span>
          </Link>
        </div>

        {/* Footer Bottom Legal & Copyright Bar (Unified Standard) */}
        <div className="border-t border-slate-200/80 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-center sm:text-left text-slate-500 font-medium">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} FileZenith. Product of <a href="https://www.snab.co.in/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 font-bold underline text-slate-800">Snab Studio</a>. All rights reserved.</p>
            <p className="text-[11px] text-slate-400 font-medium">Nashik, Maharashtra, India (PIN: 422005) &bull; Zero Server Processing Architecture</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3.5 text-[11px] sm:text-xs font-semibold">
            <a href="mailto:hello@snab.co.in" className="text-indigo-600 hover:underline flex items-center gap-1 font-bold">
              <Mail className="w-3 h-3 text-indigo-500" />
              <span>hello@snab.co.in</span>
            </a>
            <span>&bull;</span>
            <Link href="/about" className="hover:text-indigo-600 transition-colors">About Us</Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
            <span>&bull;</span>
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link>
            <span>&bull;</span>
            <Link href="/security" className="hover:text-indigo-600 transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
