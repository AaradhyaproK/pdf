# FileZenith ⚡ — Privacy-First In-Browser File & Utility Studio

> **Official Live Production Platform:** [https://www.filezenith.com](https://www.filezenith.com)

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![WebAssembly](https://img.shields.io/badge/Engine-WebAssembly%20%2B%20Canvas%20GPU-purple?style=flat)](https://www.filezenith.com)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20In--Browser%20(Zero%20Uploads)-emerald?style=flat)](https://www.filezenith.com/security)
[![License](https://img.shields.io/badge/License-Proprietary%20(All%20Rights%20Reserved)-red.svg)](LICENSE)

**[FileZenith](https://www.filezenith.com)** is an all-in-one private online file studio engineered with Next.js 16, TypeScript, WebAssembly, and Canvas GPU acceleration. Unlike traditional file conversion sites that upload your sensitive documents to remote servers, **FileZenith executes 100% of its file processing locally inside your browser's RAM.**

---

## 🚀 Key Feature Suites & Tools

### 1. 📄 Comprehensive PDF Studio
* **[Compress PDF to 100KB & 1MB](https://www.filezenith.com/pdf/compress-to-100kb):** Target file size optimizer with multi-stage resampling algorithms.
* **[Edit PDF Online](https://www.filezenith.com/pdf/edit):** Interactive text addition, whiteout redaction, markup drawing, and digital signatures.
* **[Merge & Split PDF](https://www.filezenith.com/pdf/merge):** Combine multiple documents or extract custom page ranges without data loss.
* **[Word to PDF & PDF to Word](https://www.filezenith.com/pdf/word-to-pdf):** In-browser bidirectional document conversion.
* **[PDF OCR Text Extractor](https://www.filezenith.com/pdf/ocr):** WebAssembly Tesseract-powered optical character recognition.
* **[Protect & Unlock PDF](https://www.filezenith.com/pdf/protect):** Standard 128-bit/256-bit encryption and password removal.

### 2. 🖼️ Image Engineering & Converters
* **[WebP to JPG & JPG to WebP](https://www.filezenith.com/image/webp-to-jpg):** Batch conversion with customizable compression quality and alpha-channel white fills.
* **[Color Palette Extractor](https://www.filezenith.com/image/color-palette-extractor):** K-Means clustering color analysis directly from uploaded images.
* **[Pics to PDF & SVG Converters](https://www.filezenith.com/image/pics-to-pdf):** Multi-resolution vector and raster rendering.

### 3. 🏛️ Government Exam & Recruitment Form Resizers
* **[Railway RRB Photo Resizer](https://www.filezenith.com/tools/railway-rrb-photo-resizer):** 20–50KB (320x240px / 35x45mm) and signature 10–20KB.
* **[IBPS & SBI PO Resizers](https://www.filezenith.com/tools/ibps-photo-resizer):** 200x230px 20–50KB photo, left thumb impression, and handwritten declaration.
* **[JEE Main & CUET Resizer](https://www.filezenith.com/tools/jee-photo-resizer):** 10–200KB 80% face coverage with automated Date of Photograph (DOP) stamp.
* **[Aadhaar Print Studio](https://www.filezenith.com/tools/aadhaar-card-print):** Exact 85.6mm x 54mm standard PVC card print generator.

### 4. 🛠️ Developer & Everyday Utilities
* **[Hash Generator](https://www.filezenith.com/utility/hash-generator):** Live MD5, SHA-1, SHA-256, and SHA-512 checksum calculator for strings and binary files.
* **[URL Encoder / Decoder](https://www.filezenith.com/utility/url-encoder-decoder):** RFC 3986 compliant query parameter inspector.
* **[Electricity Bill Calculator](https://www.filezenith.com/utility/electricity-bill-calculator):** Multi-state tariff slab calculator with solar net-metering deductions.

---

## 🛡️ Privacy & Zero-Knowledge Architecture

1. **Zero Remote Uploads:** Files selected in the UI are processed using `ArrayBuffer`, `CanvasRenderingContext2D`, and WebAssembly binaries. Your files **never leave your device**.
2. **Sub-second Edge Speed:** Deployed on global edge nodes with Core Web Vitals (CLS = 0) and sub-100ms TTFB.
3. **No Account Required:** Completely open and free with zero paywalls.

---

## 💻 Local Development

Clone the repository and run the local development server:

```bash
# Clone the repository
git clone https://github.com/AaradhyaproK/pdf.git

# Navigate into the project
cd pdf

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 👨‍💻 Founder & Creator

* **Architect & Developer:** [Aaradhya Pathak](https://github.com/AaradhyaproK)
* **Website:** [https://www.filezenith.com](https://www.filezenith.com)
* **Sibling FinTech Project:** [FeeKit](https://www.usefeekit.com)
* **Inquiries & Partnerships:** [hello@snab.co.in](mailto:hello@snab.co.in)

---

## 📄 License

This software is **Proprietary & Confidential**. All rights reserved. Copyright &copy; 2026 [Aaradhya Pathak](https://github.com/AaradhyaproK). 

Unauthorized copying, cloning, distribution, or commercial deployment of this codebase or its algorithms is strictly prohibited. For licensing inquiries, contact [hello@snab.co.in](mailto:hello@snab.co.in). See the [LICENSE](LICENSE) file for complete legal terms.
