import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ShieldAlert, CheckCircle, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - FileZenith',
  description: 'Review the Terms of Service and usage conditions for FileZenith online PDF and image processing tools.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-12 space-y-6 sm:space-y-10 text-slate-700">
      {/* Header Banner */}
      <div className="space-y-3 p-5 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black border border-indigo-200/80">
          <Scale className="w-3.5 h-3.5 text-indigo-600" />
          <span>User Agreement & Terms</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Last Updated: August 31, 2026 | Effective Date: Immediately
        </p>
      </div>

      {/* Section 1: Acceptance of Terms */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">1. Acceptance of Terms</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          By accessing or using <strong>FileZenith</strong> (accessible at <Link href="/" className="text-indigo-600 hover:underline">filezenith.com</Link>), you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, you must not access or use our web tools.
        </p>
      </section>

      {/* Section 2: Services Provided */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">2. Service Description & Client-Side Execution</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          FileZenith provides online file processing utilities including PDF editing, PDF compression, image format conversion, background removal, and quick developer utilities. All file conversions are executed directly inside your web browser using WebAssembly. FileZenith does not upload, inspect, or store your documents on remote servers.
        </p>
      </section>

      {/* Section 3: Acceptable Use */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">3. Acceptable Use Policy</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          You agree to use FileZenith only for lawful purposes. You must not:
        </p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1.5 pl-2">
          <li>Process documents or images that violate local, state, national, or international copyright or intellectual property laws.</li>
          <li>Use automated bots, scrapers, or scripts to overload or abuse site functionality.</li>
          <li>Attempt to reverse-engineer, decompile, or modify proprietary site assets or scripts outside open-source licensed components.</li>
        </ul>
      </section>

      {/* Section 4: Disclaimer of Warranties */}
      <section className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <span>4. Disclaimer of Warranties</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          FileZenith and all tools are provided on an <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong> basis without warranties of any kind, whether express or implied. While we strive for maximum accuracy, fidelity, and stability, FileZenith does not guarantee that converted files will be entirely error-free or uninterrupted. Users are advised to retain copies of their original documents.
        </p>
      </section>

      {/* Section 5: Limitation of Liability */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">5. Limitation of Liability</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          In no event shall FileZenith, its creators, or partners be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the website or file tools.
        </p>
      </section>

      {/* Section 6: Advertising & Links to Third Parties */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">6. Advertising & Third-Party Websites</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          FileZenith displays advertisements via Google AdSense and third-party networks. Our site may contain links to external sites that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of third-party websites or services.
        </p>
      </section>

      {/* Section 7: Contact Information */}
      <section className="space-y-3 border-t border-slate-200 pt-6">
        <h2 className="text-xl font-extrabold text-slate-900">7. Contact Information</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          FileZenith is a product by <strong>Snab</strong> (Nashik, Maharashtra, India 422005). Questions regarding these Terms of Service should be directed to us via our <Link href="/contact" className="text-indigo-600 hover:underline font-semibold">Contact Page</Link>, <a href="https://www.snab.co.in/contact" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">Snab Contact Page</a>, or via email at <a href="mailto:hello@snab.co.in" className="text-indigo-600 hover:underline font-semibold">hello@snab.co.in</a>.
        </p>
      </section>
    </div>
  );
}
