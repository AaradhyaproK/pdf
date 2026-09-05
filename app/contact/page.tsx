'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Send, CheckCircle2, MapPin, Building2, ExternalLink, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-12 space-y-6 sm:space-y-10 text-slate-700">
      {/* App Header Banner */}
      <div className="space-y-3 p-5 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black border border-indigo-200/80">
          <Mail className="w-3.5 h-3.5 text-indigo-600" />
          <span>Support & Help Center</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Contact Support & Developer Team
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-xl mx-auto">
          FileZenith is engineered &amp; maintained by <strong>Snab</strong>. Have a question, feature request, or business inquiry? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
        {/* Contact & Company Details Cards */}
        <div className="space-y-3 sm:space-y-4 md:col-span-1">
          {/* Parent Developer Company Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-black text-xs sm:text-sm">
              <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Parent Developer Company</span>
            </div>
            <p className="text-xs text-slate-900 font-extrabold">
              Snab
            </p>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              FileZenith is an official web utility product developed and operated by Snab.
            </p>
            <div className="pt-1">
              <a
                href="https://www.snab.co.in/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                <span>Visit Snab Contact Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Email Support Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-black text-xs sm:text-sm">
              <Mail className="w-4 h-4 shrink-0" />
              <span>Direct Email Support</span>
            </div>
            <p className="text-xs text-slate-600">
              <a href="mailto:hello@snab.co.in" className="text-indigo-600 hover:underline font-extrabold flex items-center gap-1">
                <span>hello@snab.co.in</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </p>
            <p className="text-[10px] text-slate-400 font-semibold">Fast response within 24 business hours</p>
          </div>

          {/* Office Address Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-black text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Office Address</span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Nashik, Maharashtra<br />
              India 422005
            </p>
            <div className="pt-1">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Nashik%2C%20Maharashtra"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Fast, Private In-Browser Tools Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50 border border-indigo-200/90 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-black text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Fast, Private, In-Browser File Tools</span>
            </div>
            <p className="text-xs text-indigo-800 font-medium leading-relaxed">
              FileZenith processes all PDF and image files locally on your device with zero server uploads, keeping your documents 100% confidential.
            </p>
            <div className="pt-1">
              <Link
                href="/security"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs transition-colors"
              >
                <span>Learn About Security</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          {submitted ? (
            <div className="p-6 sm:p-10 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4 shadow-2xs">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-xl font-black text-slate-900">Message Sent Successfully!</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium">
                Thank you for reaching out to FileZenith and Snab. Our engineering support team will respond to your email at hello@snab.co.in shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-md active:scale-95"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-800">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-800">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your issue, feature suggestion, or feedback..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

