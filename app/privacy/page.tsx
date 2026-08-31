import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, Cookie, FileText, Mail, ServerOff } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - FileZenith',
  description: 'Learn about FileZenith privacy practices, 100% client-side zero-server file processing, cookie policies, and Google AdSense compliance.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-12 space-y-6 sm:space-y-10 text-slate-700">
      {/* Header Banner */}
      <div className="space-y-3 p-5 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Client-Side Privacy Guaranteed</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Last Updated: August 31, 2026 | Effective Date: Immediately
        </p>
      </div>

      {/* Summary Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-950 font-black text-xs sm:text-sm">
            <ServerOff className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero Server File Uploads</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            All PDF, image, and document conversions happen 100% inside your web browser using client-side WebAssembly. Your files are never uploaded to any cloud server or stored anywhere.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-black text-xs sm:text-sm">
            <Cookie className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Advertising & Cookie Transparency</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            We partner with Google AdSense to serve non-intrusive advertisements. Third-party vendors, including Google, use cookies to serve ads based on prior website visits.
          </p>
        </div>
      </div>

      {/* Section 1: Introduction */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">1. Introduction</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Welcome to <strong>FileZenith</strong> (accessible at <Link href="/" className="text-indigo-600 hover:underline">filezenith.com</Link>). We are deeply committed to respecting your privacy and protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our suite of online PDF, image, and utility tools.
        </p>
      </section>

      {/* Section 2: Browser-Native Computation & Document Security */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">2. Browser-Native Client-Side Processing (Zero Server Upload)</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          FileZenith is engineered as a client-side web application. When you select, compress, edit, convert, or process PDF documents or image files on our platform:
        </p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1.5 pl-2">
          <li><strong>No File Transfers:</strong> Your source files are read directly into your device&apos;s local browser memory (RAM) using standard WebAssembly (Wasm) and HTML5 APIs.</li>
          <li><strong>No Cloud Storage:</strong> Your documents are never uploaded to, transmitted across, or saved on remote web servers.</li>
          <li><strong>Immediate Clearance:</strong> All temporary browser memory allocation for file processing is immediately freed once you complete your task or close the browser tab.</li>
        </ul>
      </section>

      {/* Section 3: Information We Collect */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">3. Information We Collect</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          We do not require user accounts, passwords, or personal identity details to use our tools. However, we collect non-personally identifiable information automatically:
        </p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1.5 pl-2">
          <li><strong>Usage & Device Information:</strong> Standard web analytics logs such as browser type, operating system, referrer URL, pages visited, and general geographic location (country/city level).</li>
          <li><strong>Local Storage:</strong> We use browser `localStorage` to save your interface preferences (such as light/dark mode theme or tool settings) locally on your device.</li>
        </ul>
      </section>

      {/* Section 4: Google AdSense & Third-Party Cookies (Mandatory AdSense Clause) */}
      <section className="space-y-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl p-6">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Cookie className="w-5 h-5 text-amber-600" />
          <span>4. Cookies, Google AdSense & Third-Party Advertising</span>
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          FileZenith displays advertisements served by third-party advertising vendors, including <strong>Google AdSense</strong>, to keep our document tools 100% free. Please review how third-party advertising cookies are used:
        </p>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-2 pl-2">
          <li>
            <strong>Third-Party Vendor Cookies:</strong> Google and other third-party vendors use cookies to serve ads based on your prior visits to FileZenith or other websites on the Internet.
          </li>
          <li>
            <strong>Google DART Cookie:</strong> Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet.
          </li>
          <li>
            <strong>Opting Out of Personalized Advertising:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">Google Ads Settings</a>. Alternatively, you can opt out of third-party vendor use of cookies for personalized advertising by visiting <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">www.aboutads.info</a>.
          </li>
        </ul>
      </section>

      {/* Section 5: Web Analytics */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">5. Web Analytics & Analytics Services</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          We use privacy-conscious analytics services (such as Cloudflare Web Analytics) to measure total pageviews and performance trends. These analytics tools measure aggregated traffic data without tracking individual user identities or building cross-site behavioral profiles.
        </p>
      </section>

      {/* Section 6: Children's Privacy */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">6. Children&apos;s Privacy (COPPA)</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Our website and utility tools are intended for general audiences. We do not knowingly collect or solicit any personal information from children under the age of 13.
        </p>
      </section>

      {/* Section 7: Updates to Policy */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">7. Changes to This Privacy Policy</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          We may update our Privacy Policy from time to time to reflect changes in web practices, technical architecture, or legal requirements. Any modifications will be posted directly on this page with an updated effective date.
        </p>
      </section>

      {/* Section 8: Contact Information */}
      <section className="space-y-3 border-t border-slate-200 pt-6">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-600" />
          <span>8. Contact Information</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          FileZenith is developed and operated by <strong>Snab</strong> (Nashik, Maharashtra, India 422005). If you have any questions, privacy inquiries, or feedback regarding this Privacy Policy, please contact us via our <Link href="/contact" className="text-indigo-600 hover:underline font-semibold">Contact Page</Link>, visit <a href="https://www.snab.co.in/contact" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">Snab Contact Page</a>, or email us directly at <a href="mailto:hello@snab.co.in" className="text-indigo-600 hover:underline font-semibold">hello@snab.co.in</a>.
        </p>
      </section>
    </div>
  );
}
