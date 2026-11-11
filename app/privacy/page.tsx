import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Eye,
  Cookie,
  FileText,
  Mail,
  ServerOff,
  BarChart3,
  Settings,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - FileZenith',
  description:
    'Learn about FileZenith privacy practices, 100% client-side zero-server file processing, cookie policies, Google AdSense and Google Analytics disclosures, and how to control your data.',
  alternates: {
    canonical: 'https://www.filezenith.com/privacy',
  },
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
          Last Updated: November 11, 2026 | Effective Date: Immediately
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
            All PDF, image, and document conversions happen 100% inside your web browser. Your files
            are never uploaded to any cloud server or stored anywhere. The only data that leaves your
            device is the URL of a webpage you explicitly ask us to convert to PDF.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-black text-xs sm:text-sm">
            <Cookie className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Advertising &amp; Cookie Transparency</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            We use Google AdSense to display advertisements and Google Analytics to measure traffic.
            These services use cookies and similar technologies. You can review and change your
            choices at any time using the &ldquo;Cookie Settings&rdquo; link in our footer.
          </p>
        </div>
      </div>

      {/* Section 1: Introduction */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">1. Introduction</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Welcome to <strong>FileZenith</strong> (accessible at{' '}
          <Link href="/" className="text-indigo-600 hover:underline">
            filezenith.com
          </Link>
          ). We are deeply committed to respecting your privacy and protecting your personal data.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information
          when you visit our website and use our suite of online PDF, image, and utility tools.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          This document is designed to comply with the Google AdSense programme requirements for
          publishers, the EU General Data Protection Regulation (GDPR), the ePrivacy Directive, and
          the California Consumer Privacy Act (CCPA/CPRA).
        </p>
      </section>

      {/* Section 2: Browser-Native Computation & Document Security */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">
          2. Browser-Native Client-Side Processing (Zero Server Upload)
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          FileZenith is engineered as a serverless client-side web application. When you select,
          compress, edit, convert, or process PDF documents or image files on our platform:
        </p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1.5 pl-2">
          <li>
            <strong>No File Transfers:</strong> Your PDF is processed directly in your browser,
            helping keep your document processing private.
          </li>
          <li>
            <strong>No Cloud Storage:</strong> Your documents are never uploaded to, transmitted
            across, or saved on remote web servers.
          </li>
          <li>
            <strong>Immediate Clearance:</strong> All temporary browser memory allocation for file
            processing is immediately freed once you complete your task or close the browser tab.
          </li>
          <li>
            <strong>Limited Exceptions:</strong> Two optional tools operate with server assistance.
            The &ldquo;HTML to PDF&rdquo; tool can fetch a webpage URL you provide in order to render
            it, and the &ldquo;YouTube Thumbnail&rdquo; tool can retrieve a publicly available
            thumbnail image on request. Neither accepts or stores personal files or accounts.
          </li>
        </ul>
      </section>

      {/* Section 3: Information We Collect */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">3. Information We Collect</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          We do not require user accounts, passwords, or personal identity details to use our tools.
          We do not knowingly collect personally identifiable information such as your name, address,
          or phone number through the tools themselves. We do collect the following categories of
          information automatically:
        </p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-2 pl-2">
          <li>
            <strong>Device &amp; Usage Information (Google Analytics):</strong> We use Google
            Analytics 4 to understand aggregate site usage. This may include your browser type,
            operating system, device category, referring URL, pages visited, approximate
            general geographic location (country and city level), and site interaction events. IP
            addresses are anonymised. You can opt out at any time via the &ldquo;Cookie
            Settings&rdquo; link in our footer or the{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline font-semibold"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </li>
          <li>
            <strong>Aggregate Traffic Measurement (Cloudflare Web Analytics):</strong> We use
            Cloudflare Web Analytics for privacy-friendly, aggregated pageview counting. It is
            cookie-free and does not track individuals across sites.
          </li>
          <li>
            <strong>Advertising Data (Google AdSense):</strong> Google and its certified ad
            vendors may set cookies to serve ads based on your prior visits to this or other
            websites. See Section 4 for full details and your opt-out options.
          </li>
          <li>
            <strong>Local Storage (Your Device Only):</strong> We use your browser&apos;s{' '}
            <code className="text-[11px] bg-slate-100 px-1 rounded">localStorage</code> to store
            purely functional preferences on your own device. This includes your consent choice, a
            locally generated anonymous visitor identifier, a local counter of pageviews and ad
            impressions, and a local log of which tools you have used. This data never leaves your
            browser, is not linked to any account, and is erased when you clear your browser
            storage. It is used for first-party performance measurement and for remembering your
            settings &mdash; it is not used to build an advertising profile.
          </li>
          <li>
            <strong>Contact Form Submissions:</strong> If you voluntarily contact us through our
            contact form, we collect the name, email address, subject, and message you provide, in
            order to respond to you. See Section 9.
          </li>
        </ul>
      </section>

      {/* Section 4: Google AdSense & Third-Party Cookies */}
      <section className="space-y-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl p-6">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Cookie className="w-5 h-5 text-amber-600" />
          <span>4. Cookies, Google AdSense &amp; Third-Party Advertising</span>
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          FileZenith displays advertisements served by third-party advertising vendors, including{' '}
          <strong>Google AdSense</strong>, to keep our document tools 100% free. Please review how
          third-party advertising cookies are used:
        </p>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-2 pl-2">
          <li>
            <strong>Third-Party Vendor Cookies:</strong> Google and other third-party vendors use
            cookies to serve ads based on your prior visits to FileZenith or other websites on the
            Internet.
          </li>
          <li>
            <strong>Google&apos;s Advertising Cookie (DART):</strong> Google&apos;s use of
            advertising cookies enables it and its partners to serve ads to you based on your visit
            to our site and/or other sites on the Internet.
          </li>
          <li>
            <strong>Opting Out of Personalized Advertising:</strong> Users may opt out of
            personalized advertising by visiting{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline font-semibold"
            >
              Google Ads Settings
            </a>
            . Alternatively, you can opt out of third-party vendor use of cookies for personalized
            advertising by visiting{' '}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline font-semibold"
            >
              www.aboutads.info
            </a>
            . You can also opt out of interest-based advertising on{' '}
            <a
              href="https://www.youronlinechoices.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline font-semibold"
            >
              Your Online Choices
            </a>
            .
          </li>
          <li>
            <strong>Google Partner Sites Policy:</strong> To learn how Google collects, uses, and
            protects data when you visit sites that display Google AdSense ads, please visit
            Google&apos;s official policy page:{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline font-semibold inline-flex items-center gap-1"
            >
              How Google uses information from sites or apps that use our services
            </a>
            .
          </li>
          <li>
            <strong>Advertising Labels:</strong> Every advertisement we serve is clearly labelled
            &ldquo;Advertisement&rdquo; so that it is always distinguishable from our own content
            and navigation.
          </li>
        </ul>
      </section>

      {/* Section 5: Consent & European Regulations */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <span>5. Consent Management &amp; European Regulations</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          For visitors in the European Economic Area (EEA), the United Kingdom, and Switzerland, we
          rely on Google&apos;s certified consent management platform (Google Funding Choices / User
          Consent Management) to ask for permission before any personalised advertising or
          analytics cookies are stored.
        </p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-2 pl-2">
          <li>
            <strong>Consent Mode v2:</strong> Before any Google tag loads, we set the default
            consent state to &ldquo;denied&rdquo; for advertising and analytics storage. Nothing is
            stored for advertising purposes until you actively opt in.
          </li>
          <li>
            <strong>Your Choice Persists:</strong> Your decision is saved in your browser&apos;s
            local storage and is honoured on every subsequent visit.
          </li>
          <li>
            <strong>Change Your Mind Anytime:</strong> Use the &ldquo;Cookie Settings&rdquo; link
            in our footer to reopen the preferences panel at any time and withdraw or change your
            consent.
          </li>
          <li>
            <strong>Global Privacy Control:</strong> If your browser sends the Global Privacy
            Control (GPC) signal, we treat it as a valid opt-out request and keep optional
            advertising and analytics cookies disabled.
          </li>
          <li>
            <strong>Withdrawal:</strong> You may withdraw consent at any time, with effect going
            forward, without any detriment to your use of the tools.
          </li>
        </ul>
      </section>

      {/* Section 6: Web Analytics */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          <span>6. Web Analytics Services</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          We use two analytics services to measure how our site performs:
        </p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-2 pl-2">
          <li>
            <strong>Google Analytics 4:</strong> Provides aggregated pageview, engagement, and
            traffic-source reporting. IP addresses are anonymised, Google Signals are disabled, and
            ad data redaction is enabled. It respects your consent choice.
          </li>
          <li>
            <strong>Cloudflare Web Analytics:</strong> A cookie-free, privacy-friendly counter that
            measures aggregate traffic without identifying individual users or building cross-site
            behavioural profiles.
          </li>
        </ul>
        <p className="text-sm text-slate-600 leading-relaxed">
          Neither service is used to build advertising profiles on our own site. Where analytics
          storage is denied, these services operate in a limited, cookieless mode.
        </p>
      </section>

      {/* Section 7: Children's Privacy */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">7. Children&apos;s Privacy (COPPA)</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Our website and utility tools are intended for general audiences. We do not knowingly
          collect or solicit any personal information from children under the age of 13. If you
          believe a child has provided us with personal information, please contact us at{' '}
          <a href="mailto:privacy@filezenith.com" className="text-indigo-600 hover:underline font-semibold">
            privacy@filezenith.com
          </a>{' '}
          and we will delete it promptly. Because our services are entirely client-side, we do not
          knowingly build behavioural profiles of children.
        </p>
      </section>

      {/* Section 8: Your Rights (GDPR / CCPA) */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-600" />
          <span>8. Your Data Rights (GDPR &amp; CCPA/CPRA)</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Depending on where you live, you may have the right to:
        </p>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1.5 pl-2">
          <li>Request access to the personal data we hold about you.</li>
          <li>Request correction of inaccurate personal data.</li>
          <li>Request erasure of your personal data.</li>
          <li>Object to, or request restriction of, certain processing.</li>
          <li>Request a portable copy of your data.</li>
          <li>
            Opt out of the sale or sharing of personal information for cross-context behavioural
            advertising (California residents).
          </li>
          <li>Complain to your local data protection supervisory authority.</li>
        </ul>
        <p className="text-sm text-slate-600 leading-relaxed">
          Because the analytics and advertising data described in this policy is either stored only
          in your own browser or held by Google under your own Google account, you can exercise most
          of these rights directly with us, with Google, or by clearing your browser storage. To
          make a request to us, email{' '}
          <a
            href="mailto:privacy@filezenith.com"
            className="text-indigo-600 hover:underline font-semibold"
          >
            privacy@filezenith.com
          </a>
          . We respond to verified requests within 30 days.
        </p>
      </section>

      {/* Section 9: Contact Form Data */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">
          9. Data You Submit Through the Contact Form
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          When you send us a message through our contact form, we use the name, email address,
          subject, and message you provide solely to respond to your enquiry. We do not sell this
          information, we do not add you to a marketing list without your separate consent, and we
          do not retain the message longer than necessary to deal with your request and meet any
          legal obligations. You may ask us to delete your message at any time.
        </p>
      </section>

      {/* Section 10: Data Retention & Security */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-600" />
          <span>10. Data Retention &amp; Security
          </span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Your files are never stored, so there is nothing for us to retain. Locally stored
          preferences and counters remain on your device until you clear your browser storage.
          Contact-form messages are retained only for as long as needed to resolve your enquiry.
          The site is served over HTTPS, and all processing of your documents happens in an isolated
          browser sandbox on your own device.
        </p>
      </section>

      {/* Section 11: Third-Party Links */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">
          11. Third-Party Links &amp; Embedded Content
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Some of our guides link to external websites, including official government recruitment
          portals and documentation pages. We do not control and are not responsible for the
          content, privacy policies, or practices of those third-party sites. We recommend that you
          review their privacy policies before providing any personal information.
        </p>
      </section>

      {/* Section 12: Updates */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-slate-900">12. Changes to This Privacy Policy</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          We may update this Privacy Policy from time to time to reflect changes in web practices,
          technical architecture, or legal requirements. Any modifications will be posted directly
          on this page with an updated effective date. We will post a notice on the homepage for any
          material change.
        </p>
      </section>

      {/* Section 13: Contact Information */}
      <section className="space-y-3 border-t border-slate-200 pt-6">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-600" />
          <span>13. Contact Information</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          FileZenith is developed and operated by <strong>Snab Innovations</strong> (Nashik,
          Maharashtra, India 422005). If you have any questions, privacy inquiries, or data
          protection requests regarding this Privacy Policy, please contact us via our{' '}
          <Link href="/contact" className="text-indigo-600 hover:underline font-semibold">
            Contact Page
          </Link>
          , or email our dedicated data protection desk directly at{' '}
          <a
            href="mailto:privacy@filezenith.com"
            className="text-indigo-600 hover:underline font-semibold"
          >
            privacy@filezenith.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
