'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Send,
  CheckCircle2,
  MapPin,
  Building2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Clock,
  User,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill out all required fields.');
      return;
    }
    setSubmitted(true);
    toast.success('Thank you! Your message has been sent successfully.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-12 text-slate-700">
      {/* App Header Banner */}
      <section className="space-y-4 p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-2xs text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black border border-indigo-200/80">
          <Mail className="w-3.5 h-3.5 text-indigo-600" />
          <span>Support & Help Center</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Contact Support &amp; Developer Team
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-xl mx-auto">
          FileZenith is engineered and operated by <strong>Snab Studio</strong>. Have a technical question, preset request, or feedback? We are here to help.
        </p>
      </section>

      {/* Main Unified 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* Left Column: Unified Studio & Contact Info Card (lg:col-span-5) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Header info */}
            <div className="space-y-1.5 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2 text-indigo-900 font-black text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Parent Engineering Studio</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">Snab Studio</h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Independent software engineering studio building zero-latency, privacy-first web utilities.
              </p>
            </div>

            {/* Direct Email */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Direct Email Support
              </span>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/80">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <a
                    href="mailto:hello@snab.co.in"
                    className="text-xs sm:text-sm font-black text-indigo-700 hover:text-indigo-900 hover:underline truncate block"
                  >
                    hello@snab.co.in
                  </a>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium pt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Response within 24 business hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Address */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Physical Headquarters
              </span>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <MapPin className="w-4 h-4 text-rose-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    Nashik, Maharashtra, India (PIN: 422005)
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Nashik%2C%20Maharashtra"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 pt-0.5"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Meet Founder & Team Link */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Human Accountability & Team
              </span>
              <Link
                href="/about"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                    AP
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors block">
                      Aaradhya Pathak
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Founder &amp; Lead Architect</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
              </Link>
            </div>
          </div>

          {/* Privacy Guarantee Footer Note */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-800 font-semibold bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Client-Side Privacy: Your documents never leave your browser memory.</span>
          </div>
        </div>

        {/* Right Column: Contact Form (lg:col-span-7) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-center">
          {submitted ? (
            <div className="p-6 sm:p-10 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-4 shadow-2xs my-auto">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Message Sent Successfully!</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium leading-relaxed">
                Thank you for contacting FileZenith and Snab Studio. Our developer team will review your message and respond directly to your email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">Send Us a Direct Message</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Fill out the form below and we will get back to you within 24 hours.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Feature request, bug report, or partnership"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your issue, feature suggestion, or question in detail..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
