'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { toast } from 'sonner';
import {
  Link2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
  Settings,
  HelpCircle,
  Table as TableIcon,
  ShieldCheck,
} from 'lucide-react';

type EncodeMode = 'component' | 'full' | 'rfc3986';

export default function URLEncoderDecoderPage() {
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState<string>('https://example.com/search?q=hello world & science=100%&redirect=https://app.io/oauth?token=abc+123');
  const [encodeMode, setEncodeMode] = useState<EncodeMode>('component');
  const [copied, setCopied] = useState<boolean>(false);

  // RFC 3986 encoder
  const rfc3986Encode = (str: string) => {
    return encodeURIComponent(str).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
  };

  const outputText = useMemo(() => {
    if (!inputText) return '';
    try {
      if (activeTab === 'encode') {
        if (encodeMode === 'component') {
          return encodeURIComponent(inputText);
        } else if (encodeMode === 'full') {
          return encodeURI(inputText);
        } else {
          return rfc3986Encode(inputText);
        }
      } else {
        // Decode
        return decodeURIComponent(inputText.replace(/\+/g, ' '));
      }
    } catch {
      return 'Error: Malformed URL or URI sequence for decoding.';
    }
  }, [inputText, activeTab, encodeMode]);

  // Query Parameters Inspector (extracts params if input or output looks like a URL)
  const queryParams = useMemo(() => {
    const textToInspect = activeTab === 'encode' ? inputText : outputText;
    if (!textToInspect || !textToInspect.includes('?')) return [];
    try {
      const qIndex = textToInspect.indexOf('?');
      const hashIndex = textToInspect.indexOf('#');
      const queryString =
        hashIndex !== -1
          ? textToInspect.substring(qIndex + 1, hashIndex)
          : textToInspect.substring(qIndex + 1);

      const searchParams = new URLSearchParams(queryString);
      const params: Array<{ key: string; value: string }> = [];
      searchParams.forEach((val, key) => {
        params.push({ key, value: val });
      });
      return params;
    } catch {
      return [];
    }
  }, [inputText, outputText, activeTab]);

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      toast.success('Copied result to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard.');
    }
  };

  const handleSwap = () => {
    setInputText(outputText);
    setActiveTab((prev) => (prev === 'encode' ? 'decode' : 'encode'));
    toast.info('Swapped input and output.');
  };

  const handleClear = () => {
    setInputText('');
  };

  const loadSample = (sampleType: 'oauth' | 'search' | 'complex') => {
    if (sampleType === 'oauth') {
      setInputText('https://auth.company.com/login?client_id=web_app&redirect_uri=https%3A%2F%2Fmyapp.com%2Fcallback&scope=user%3Aemail&state=xyz123');
      setActiveTab('decode');
    } else if (sampleType === 'search') {
      setInputText('https://www.google.com/search?q=best online tools 2026&hl=en&gl=us');
      setActiveTab('encode');
    } else {
      setInputText('Special Symbols & Accents: café, résumé, 100% discount, user@test.com + #hashtag');
      setActiveTab('encode');
    }
  };

  return (
    <ToolLayout
      slug="/utility/url-encoder-decoder"
      title="URL Encoder & Decoder Online"
      subtitle="Encode or decode URLs, URI parameters, and percent-encoded query strings instantly. Features RFC 3986 support, query parameter inspector, and 100% private browser processing."
      badgeText="Developer Tool"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Tab & Mode Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-2 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('encode')}
              className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all ${
                activeTab === 'encode'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              URL Encoder
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('decode')}
              className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all ${
                activeTab === 'decode'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              URL Decoder
            </button>
          </div>

          {activeTab === 'encode' && (
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">Mode:</span>
              <button
                type="button"
                onClick={() => setEncodeMode('component')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  encodeMode === 'component' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="encodeURIComponent (recommended for query params)"
              >
                Component
              </button>
              <button
                type="button"
                onClick={() => setEncodeMode('full')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  encodeMode === 'full' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="encodeURI (keeps :// ? & intact)"
              >
                Full URL
              </button>
              <button
                type="button"
                onClick={() => setEncodeMode('rfc3986')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  encodeMode === 'rfc3986' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Strict RFC 3986 (encodes ! ' ( ) *)"
              >
                RFC 3986
              </button>
            </div>
          )}
        </div>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Quick Samples:</span>
          <button
            type="button"
            onClick={() => loadSample('oauth')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            OAuth URL (Decode)
          </button>
          <button
            type="button"
            onClick={() => loadSample('search')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            Search Query
          </button>
          <button
            type="button"
            onClick={() => loadSample('complex')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            Special Characters
          </button>
        </div>

        {/* Input Card */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-slate-700 tracking-wider">
              {activeTab === 'encode' ? 'Input Text / Plain URL to Encode' : 'Input Percent-Encoded String to Decode'}
            </label>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors"
            >
              Clear
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            placeholder={
              activeTab === 'encode'
                ? 'Enter text or URL to percent-encode...'
                : 'Enter encoded string (e.g. https%3A%2F%2Fexample.com%3Fname%3DJohn%20Doe)...'
            }
            className="w-full p-3.5 bg-white border border-slate-200 rounded-xl font-mono text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleSwap}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
            title="Swap input and output"
          >
            <ArrowRightLeft className="w-4 h-4" /> Swap Input / Output
          </button>
        </div>

        {/* Output Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              {activeTab === 'encode' ? 'Encoded Output (Percent-Encoded)' : 'Decoded Output (Human Readable)'}
            </label>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!outputText}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Output
                </>
              )}
            </button>
          </div>
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs sm:text-sm text-slate-900 break-all max-h-60 overflow-y-auto select-all">
            {outputText || <span className="text-slate-400 italic">Result will appear here...</span>}
          </div>
        </div>

        {/* Query Parameter Breakdown Table */}
        {queryParams.length > 0 && (
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs sm:text-sm font-black text-slate-900">
                Parsed URL Query Parameters ({queryParams.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 w-1/3">Key (Parameter)</th>
                    <th className="p-2.5">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {queryParams.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-indigo-600 break-all">{p.key}</td>
                      <td className="p-2.5 text-slate-800 break-all">{p.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
