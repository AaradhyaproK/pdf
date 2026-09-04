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
  Sparkles,
  Lock,
  Zap,
} from 'lucide-react';
import { VisitorCounter } from './VisitorCounter';

export function Footer() {
  const [openSection, setOpenSection] = useState<'pdf' | 'image' | 'company' | null>('pdf');

  const toggleSection = (section: 'pdf' | 'image' | 'company') => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer id="main-footer" className="w-full bg-white text-slate-600 border-t border-slate-200/80 pt-10 sm:pt-16 pb-16 sm:pb-12 mt-12 sm:mt-20 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Mobile Brand Card Header (Mobile Only) */}
        <div className="sm:hidden p-5 rounded-3xl bg-slate-900 text-white space-y-3 border border-slate-800 shadow-md">
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
            100% Free Client-Side PDF & Image Studio. All conversion engines execute strictly in your device memory with zero server file uploads.
          </p>
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
              <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-1 gap-2.5 animate-in fade-in duration-150">
                <Link href="/pdf/edit" className="p-2.5 rounded-xl bg-rose-50/50 hover:bg-rose-50 border border-rose-100/60 text-xs font-black text-rose-950 flex items-center justify-between">
                  <span>Edit PDF Online</span>
                  <span className="text-[9px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">Interactive</span>
                </Link>
                <Link href="/pdf/pdf-to-word" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-rose-600 hover:bg-slate-50 transition-all">PDF to Word (DOCX)</Link>
                <Link href="/pdf/word-to-pdf" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-rose-600 hover:bg-slate-50 transition-all">Word to PDF Converter</Link>
                <Link href="/pdf/compress" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-rose-600 hover:bg-slate-50 transition-all">Compress PDF (Auto)</Link>
                <Link href="/pdf/compress-to-200kb" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-rose-600 hover:bg-slate-50 transition-all">Compress PDF to 200KB</Link>
                <Link href="/pdf/merge" className="p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-slate-50 transition-all">Merge Multiple PDFs</Link>
                <Link href="/pdf/split" className="p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-slate-50 transition-all">Split & Extract Pages</Link>
                <Link href="/pdf/organize" className="p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-slate-50 transition-all">Organize & Rotate Pages</Link>
                <Link href="/pdf/ocr" className="p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-slate-50 transition-all">PDF OCR Text Extractor</Link>
                <Link href="/pdf/watermark" className="p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-slate-50 transition-all">Watermark PDF</Link>
                <Link href="/pdf/protect" className="p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-slate-50 transition-all">Password Protect PDF</Link>
                <Link href="/pdf/to-image" className="p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-slate-50 transition-all">PDF to JPG / PNG</Link>
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
                <Link href="/image/pics-to-pdf" className="p-2 rounded-xl text-xs font-black text-sky-900 bg-sky-50/50 border border-sky-100 flex items-center justify-between">
                  <span>Pics to PDF Converter</span>
                  <span className="text-[9px] bg-sky-600 text-white px-2 py-0.5 rounded-full font-bold">Popular</span>
                </Link>
                <Link href="/image/png-to-jpg" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-sky-600 hover:bg-slate-50 transition-all">PNG to JPG Converter</Link>
                <Link href="/image/png-to-pdf" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-sky-600 hover:bg-slate-50 transition-all">PNG to PDF Converter</Link>
                <Link href="/image/jpg-to-png" className="p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-sky-600 hover:bg-slate-50 transition-all">JPG to PNG Converter</Link>
                <Link href="/image/compress" className="p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-sky-600 hover:bg-slate-50 transition-all">Compress Image (Target KB)</Link>
                <Link href="/image/compress-to-50kb" className="p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-sky-600 hover:bg-slate-50 transition-all">Compress Image to 50KB</Link>
                <Link href="/image/compress-to-100kb" className="p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-sky-600 hover:bg-slate-50 transition-all">Compress Image to 100KB</Link>
                <Link href="/image/passport-maker" className="p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-sky-600 hover:bg-slate-50 transition-all">Passport Photo Maker</Link>
                <Link href="/image/remove-background" className="p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-sky-600 hover:bg-slate-50 transition-all">AI Background Remover</Link>
                <Link href="/image/convert-heic" className="p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-sky-600 hover:bg-slate-50 transition-all">Apple HEIC to JPG</Link>
                <Link href="/image/resize" className="p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-sky-600 hover:bg-slate-50 transition-all">Resize Image (Pixels / %)</Link>
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
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">Company & Utilities</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openSection === 'company' ? 'rotate-180 text-emerald-600' : ''}`} />
            </button>
            {openSection === 'company' && (
              <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-1 gap-2 animate-in fade-in duration-150">
                <Link href="/utility/age-calculator" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-all">Age Calculator & Birthday</Link>
                <Link href="/utility/percentage-calculator" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-all">Percentage Calculator</Link>
                <Link href="/utility/cgpa-to-percentage" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-all">CGPA to Percentage</Link>
                <Link href="/utility/typing-speed-test" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-all">Typing Speed Test (WPM)</Link>
                <Link href="/utility/fancy-text-generator" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-all">Fancy Text Generator</Link>
                <Link href="/utility/password-generator" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-all">Password Generator</Link>
                <Link href="/utility/number-to-words" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-all">Number to Words (Cheque)</Link>
                <Link href="/utility/qr-generator" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-all">QR Code Generator</Link>
                <Link href="/utility/word-counter" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-all">Word & Character Counter</Link>
                <Link href="/utility/json-formatter" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-all">JSON Formatter & CSV</Link>
                <div className="border-t border-slate-100 my-1 pt-2">
                  <Link href="/security" className="p-2 rounded-xl text-xs font-black text-emerald-700 hover:text-indigo-600 block">100% Secure Serverless</Link>
                  <Link href="/blog" className="p-2 rounded-xl text-xs font-black text-indigo-600 hover:text-indigo-700 block">Blog & Privacy Guides</Link>
                  <Link href="/privacy" className="p-2 rounded-xl text-xs font-black text-slate-900 hover:text-indigo-600 block">Privacy Policy</Link>
                  <Link href="/terms" className="p-2 rounded-xl text-xs font-black text-slate-900 hover:text-indigo-600 block">Terms of Service</Link>
                  <Link href="/about" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 block">About Us</Link>
                  <Link href="/contact" className="p-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 block">Contact Support</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop 4-Column Footer Navigation (Hidden on Mobile) */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <img src="/filezenith-logo.png" alt="FileZenith Logo" className="w-8 h-8 object-contain" />
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                FileZenith
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
              <li><Link href="/pdf/pdf-to-word" className="hover:text-indigo-600 font-bold text-slate-900 transition-colors">PDF to Word (DOCX)</Link></li>
              <li><Link href="/pdf/word-to-pdf" className="hover:text-indigo-600 font-bold text-slate-900 transition-colors">Word to PDF Converter</Link></li>
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
              <li><Link href="/image/pics-to-pdf" className="hover:text-indigo-600 transition-colors">Pics & Images to PDF</Link></li>
            </ul>
          </div>

          {/* Daily Quick Utilities & Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Company & Utilities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/download-app"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-extrabold shadow-sm hover:bg-indigo-500 transition-all"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Download Mobile App</span>
                </Link>
              </li>
              <li><Link href="/utility/pages-to-word" className="hover:text-indigo-600 font-bold text-slate-900 transition-colors">Pages to Word (DOCX)</Link></li>
              <li><Link href="/utility/numbers-to-excel" className="hover:text-indigo-600 font-bold text-slate-900 transition-colors">Numbers to Excel (XLSX)</Link></li>
              <li><Link href="/utility/epf-calculator" className="hover:text-indigo-600 font-bold text-emerald-600 transition-colors">EPF Balance Growth Calculator</Link></li>
              <li><Link href="/social/whatsapp-direct-chat" className="hover:text-indigo-600 font-bold text-emerald-600 transition-colors">WhatsApp Direct Chat Launcher</Link></li>
              <li><Link href="/utility/age-calculator" className="hover:text-indigo-600 font-bold text-slate-900 transition-colors">Age Calculator & Birthday</Link></li>
              <li><Link href="/utility/percentage-calculator" className="hover:text-indigo-600 transition-colors">Percentage Calculator</Link></li>
              <li><Link href="/utility/cgpa-to-percentage" className="hover:text-indigo-600 transition-colors">CGPA to Percentage</Link></li>
              <li><Link href="/utility/typing-speed-test" className="hover:text-indigo-600 transition-colors">Typing Speed Test (WPM)</Link></li>
              <li><Link href="/utility/fancy-text-generator" className="hover:text-indigo-600 transition-colors">Fancy Text Generator</Link></li>
              <li><Link href="/security" className="hover:text-indigo-600 font-bold text-emerald-700 transition-colors flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Secure Serverless</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* App-Centric Highlighted Mobile App Banner */}
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
                Install web app to use all 50+ PDF & image tools offline anytime without cellular data or Wi-Fi.
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

        {/* Footer Bottom Legal & Copyright Bar */}
        <div className="border-t border-slate-200/80 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-center sm:text-left">
          <p>© {new Date().getFullYear()} FileZenith. Product of <a href="https://www.snab.co.in/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 font-bold underline text-slate-800">Snab</a>. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3.5 text-slate-500 font-semibold text-[11px] sm:text-xs">
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
            <span>&bull;</span>
            <Link href="/about" className="hover:text-indigo-600 transition-colors">About Us</Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


