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

# Navigate into the project.
cd pdf

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📢 Google AdSense Setup

Ads are served exclusively through **Google AdSense**. There is no support for — and no code path
for — any competing ad network, because serving them alongside AdSense breaches the AdSense
programme policies.

### 1. Environment variables

Copy `.env.example` to `.env.local` and fill in the values. See
[`.env.example`](.env.example) for the full annotated list.

```bash
cp .env.example .env.local
```

The variables that matter for ads:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` | Your publisher id (`ca-pub-…`). Defaults to the current one. |
| `NEXT_PUBLIC_ADSENSE_SLOT_HEADER` | Slot id for the 728×90 leaderboard. |
| `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR` | Slot id for the 300×600 sidebar unit. |
| `NEXT_PUBLIC_ADSENSE_SLOT_POST_DOWNLOAD` | Slot id for the 336×280 in-feed unit. |

**Each slot id is optional.** If a slot id is not set, that placement renders *nothing at all* —
no empty `<ins>` unit is shipped. AdSense **Auto Ads** still work regardless, because they only
require the `adsbygoogle.js` loader, which is present on every page.

> All `NEXT_PUBLIC_*` values are inlined at **build** time. Changing a slot id requires a rebuild
> and redeploy.

### 2. AdSense console checklist

1. **Privacy & messaging → European regulations**: enable a **Google-certified CMP** (Google
   Funding Choices / UMP). This is required to serve ads to EEA, UK and Switzerland traffic.
   The in-app cookie banner in `components/CookieConsent.tsx` is a *preferences manager*; it
   mirrors your choice into Consent Mode v2 but it is **not** a certified CMP.
2. **Privacy & messaging → Ads**: confirm the site URL and publisher id.
3. **Ad units**: create the units and copy their numeric slot ids into the env vars above.
4. **Auto ads**: optional. Enable if you want placements beyond the three built-in slots.

### 3. What is already handled

- ✅ `ads.txt` and `app-ads.txt` are served from the domain root and generated from the publisher
  id, so they can never drift from the id used in the page tags.
- ✅ `ads.txt` is served on **both** `filezenith.com` and `www.filezenith.com` without a redirect.
- ✅ Consent Mode v2 defaults are set to `denied` **before** any Google tag executes.
- ✅ Global Privacy Control (GPC) is honoured as a valid opt-out signal.
- ✅ Every ad unit carries a visible, neutral **"Advertisement"** label.
- ✅ Space is reserved up-front, so ads never shift the surrounding content (CLS = 0).
- ✅ Ads are kept well clear of download buttons to avoid accidental clicks.
- ✅ `ads_data_redaction` and `anonymize_ip` are enabled; Google Signals are disabled.
- ✅ Users can revisit and withdraw consent via **Cookie Settings** in the footer.

### 4. Contact form

Set `CONTACT_WEBHOOK_URL` to an HTTPS endpoint that accepts a JSON POST (Formspree, Zapier, Make,
Slack, Discord, …). Without it the form returns a clear "delivery not configured" error and asks
the visitor to email `contact@filezenith.com` — it never claims a message was sent when it was
not.

### 5. Admin console

The admin login at `/admin/login` is validated **on the server** by `POST /api/admin/login`.
Set these server-side secrets (no `NEXT_PUBLIC_` prefix — they must never reach the browser):

```bash
ADMIN_EMAIL=admin@filezenith.com
ADMIN_PASSWORD=<a long, unique passphrase>
ADMIN_SESSION_SECRET=<optional, separate secret for signing session tokens>
```

If they are not configured, **every** login attempt is rejected. A successful login returns a
signed, 8-hour session token; expired sessions are treated as signed out.

---

## 🚀 Deployment (Cloudflare Workers)

The site runs on Cloudflare Workers via `@opennextjs/cloudflare`.

```bash
# 1. Install dependencies
npm install

# 2. Set the environment variables (see .env.example)
cp .env.example .env.local

# 3. Build + preview locally
npm run build:cloudflare
npm run preview:cloudflare

# 4. Deploy
npm run deploy
```

### Important: build-time vs runtime variables

`NEXT_PUBLIC_*` variables are **inlined into the client bundle at build time**.
Changing one requires a **rebuild and redeploy** — setting it only in the
Cloudflare dashboard will have no effect on the client-side code.

| Variable | When it takes effect |
| --- | --- |
| `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` | build time |
| `NEXT_PUBLIC_ADSENSE_SLOT_*` | build time |
| `NEXT_PUBLIC_SITE_URL` | build time |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | build time |
| `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` | build time |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` | runtime (Worker secret) |
| `CONTACT_WEBHOOK_URL` | runtime (Worker secret) |

Server-side secrets are set with Wrangler so they never enter the bundle:

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
npx wrangler secret put CONTACT_WEBHOOK_URL
```

For build-time variables, put them in `.env.local` (or your CI's secret store)
**before** running `npm run build:cloudflare`.

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
