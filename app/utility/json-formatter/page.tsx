'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { processJSON } from '@/lib/utility-engine';
import { toast } from 'sonner';
import {
  Copy,
  Download,
  Code2,
  AlertTriangle,
  Clipboard,
  Trash2,
  Check,
  FileCode,
  FileSpreadsheet,
  FileText,
  Sparkles,
  Zap,
} from 'lucide-react';

export const SAMPLE_ARRAY = `[
  { "id": 1, "name": "FileZenith ToolSuite", "category": "Client-Side Tools", "privacy": "100% Zero-Server", "status": "Active" },
  { "id": 2, "name": "PDF Compressor", "category": "PDF Studio", "privacy": "Client Wasm", "status": "Active" },
  { "id": 3, "name": "Passport Photo Maker", "category": "Image Studio", "privacy": "Client Canvas", "status": "Active" }
]`;

export const SAMPLE_NESTED = `{
  "status": "success",
  "data": {
    "user": {
      "id": 108,
      "name": "Sarah Connor",
      "email": "sarah@example.com",
      "roles": ["Admin", "Developer"]
    },
    "settings": {
      "theme": "Day Mode",
      "notifications": true
    }
  }
}`;

export default function JSONFormatterPage() {
  const [inputJSON, setInputJSON] = useState<string>(SAMPLE_ARRAY);
  const [outputResult, setOutputResult] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<'format2' | 'format4' | 'minify' | 'to-csv' | 'to-yaml'>('format2');

  const handleAction = (action: 'format2' | 'format4' | 'minify' | 'to-csv' | 'to-yaml') => {
    if (!inputJSON.trim()) {
      toast.error('Please enter or paste JSON text.');
      return;
    }

    setLastAction(action);
    const { result, isValid, error } = processJSON(inputJSON, action);
    if (isValid) {
      setOutputResult(result);
      setErrorMsg(null);
      toast.success(`JSON processed (${action})!`);
    } else {
      setErrorMsg(error || 'Invalid JSON syntax');
      setOutputResult('');
      toast.error('JSON syntax error detected.');
    }
  };

  // Live syntax validator & stats
  const jsonStats = useMemo(() => {
    if (!inputJSON.trim()) {
      return { isValid: true, keyCount: 0, rawBytes: 0, outputBytes: 0 };
    }
    try {
      const parsed = JSON.parse(inputJSON);
      const keyCount = typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 1;
      const rawBytes = new Blob([inputJSON]).size;
      const outputBytes = outputResult ? new Blob([outputResult]).size : 0;
      return { isValid: true, keyCount, rawBytes, outputBytes };
    } catch (e: any) {
      return { isValid: false, keyCount: 0, rawBytes: new Blob([inputJSON]).size, outputBytes: 0, error: e?.message };
    }
  }, [inputJSON, outputResult]);

  // Clipboard Paste
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setInputJSON(clipboardText);
        toast.success('Pasted JSON from clipboard!');
      } else {
        toast.error('Clipboard is empty.');
      }
    } catch {
      toast.error('Unable to access clipboard. Please paste manually using Ctrl+V / Cmd+V.');
    }
  };

  // Copy Output
  const copyResult = () => {
    const textToCopy = outputResult || inputJSON;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      toast.success('Copied output to clipboard!');
    }
  };

  // Download Output File with smart extension
  const downloadResult = () => {
    const content = outputResult || inputJSON;
    if (!content) return;

    let ext = 'json';
    if (lastAction === 'to-csv') ext = 'csv';
    if (lastAction === 'to-yaml') ext = 'yaml';

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-data-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded .${ext} file!`);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <ToolLayout
      slug="/utility/json-formatter"
      title="JSON Formatter, Validator & CSV/YAML Converter"
      subtitle="Format, prettify, minify, validate syntax, and convert JSON arrays to CSV or YAML structures locally in browser."
      badgeText="Client-Side JSON Engine"
    >
      <div className="space-y-6 pb-24 md:pb-6">
        {/* Real-Time JSON Stats Banner in Pure Day Mode */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between text-slate-900">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-500 block">Syntax Status</span>
              {jsonStats.isValid ? (
                <span className="text-xs font-black text-emerald-700 flex items-center gap-1 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Valid JSON
                </span>
              ) : (
                <span className="text-xs font-black text-rose-600 flex items-center gap-1 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Syntax Error
                </span>
              )}
            </div>
            <Zap className={`w-5 h-5 ${jsonStats.isValid ? 'text-emerald-600' : 'text-rose-500'}`} />
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between text-slate-900">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-500 block">Raw Input Size</span>
              <span className="text-sm font-black text-slate-900 mt-0.5 block">{formatBytes(jsonStats.rawBytes)}</span>
            </div>
            <FileCode className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between text-slate-900">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-500 block">Output Size</span>
              <span className="text-sm font-black text-slate-900 mt-0.5 block">
                {jsonStats.outputBytes ? formatBytes(jsonStats.outputBytes) : '—'}
              </span>
            </div>
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between text-slate-900">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-500 block">Root Elements</span>
              <span className="text-sm font-black text-slate-900 mt-0.5 block">{jsonStats.keyCount} Keys/Items</span>
            </div>
            <Code2 className="w-5 h-5 text-purple-600" />
          </div>
        </div>

        {/* Primary Action Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-md space-y-4 text-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Choose Formatting Action</span>
            </span>

            {/* Quick Sample Presets */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[10px] font-bold text-slate-500 hidden sm:inline">Load Sample:</span>
              <button
                type="button"
                onClick={() => setInputJSON(SAMPLE_ARRAY)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-[11px] cursor-pointer"
              >
                Sample Array
              </button>
              <button
                type="button"
                onClick={() => setInputJSON(SAMPLE_NESTED)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-[11px] cursor-pointer"
              >
                Nested Object
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleAction('format2')}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-indigo-200" />
              <span>Prettify (2 Spaces)</span>
            </button>

            <button
              onClick={() => handleAction('format4')}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-slate-300" />
              <span>Prettify (4 Spaces)</span>
            </button>

            <button
              onClick={() => handleAction('minify')}
              className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-purple-200" />
              <span>Minify JSON</span>
            </button>

            <button
              onClick={() => handleAction('to-csv')}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Convert to CSV</span>
            </button>

            <button
              onClick={() => handleAction('to-yaml')}
              className="px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-sky-200" />
              <span>Convert to YAML</span>
            </button>
          </div>
        </div>

        {/* Input & Output Dual Panel Grid (All White Textboxes with High Contrast Black Text) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-3 text-slate-900">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>Raw Input JSON</span>
              </label>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePaste}
                  className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                  title="Paste Clipboard Content"
                >
                  <Clipboard className="w-3.5 h-3.5" /> Paste
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInputJSON('');
                    setOutputResult('');
                    setErrorMsg(null);
                    toast.info('Cleared editor.');
                  }}
                  className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                  title="Clear Input"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <textarea
              rows={14}
              value={inputJSON}
              onChange={(e) => setInputJSON(e.target.value)}
              placeholder="Paste raw JSON payload or array of objects here..."
              className="w-full p-4 rounded-2xl border border-slate-300 bg-white font-mono text-xs font-bold text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs placeholder:text-slate-400"
            />
          </div>

          {/* Output Panel */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-3 text-slate-900">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Processed Output</span>
              </label>

              {(outputResult || inputJSON) && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyResult}
                    className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                    title="Copy Processed Result"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-600" /> Copy
                  </button>

                  <button
                    onClick={downloadResult}
                    className="px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" /> Download
                  </button>
                </div>
              )}
            </div>

            {errorMsg ? (
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 font-mono text-xs space-y-2 shadow-2xs">
                <span className="font-black text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> JSON Syntax Error Detected
                </span>
                <p className="font-bold text-rose-800 bg-white p-3 rounded-xl border border-rose-200">
                  {errorMsg}
                </p>
                <p className="text-[11px] text-rose-700">
                  Check for missing commas, trailing commas, or quotes around property names.
                </p>
              </div>
            ) : (
              <textarea
                readOnly
                rows={14}
                value={outputResult}
                placeholder="Resulting formatted JSON, CSV, or YAML will appear here in clean text..."
                className="w-full p-4 rounded-2xl border border-slate-300 bg-white font-mono text-xs font-bold text-slate-900 leading-relaxed focus:outline-none shadow-2xs placeholder:text-slate-400"
              />
            )}
          </div>
        </div>
      </div>

      {/* Floating Mobile Action Bottom Navbar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-3xl p-2.5 flex items-center justify-between gap-2 md:hidden text-slate-900">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 px-1 max-w-[60vw]">
          <button
            type="button"
            onClick={() => handleAction('format2')}
            className="px-2.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-[11px] shrink-0 cursor-pointer"
          >
            Prettify
          </button>

          <button
            type="button"
            onClick={() => handleAction('minify')}
            className="px-2.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 font-black text-[11px] shrink-0 cursor-pointer"
          >
            Minify
          </button>

          <button
            type="button"
            onClick={() => handleAction('to-csv')}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-[11px] shrink-0 cursor-pointer"
          >
            CSV
          </button>

          <button
            type="button"
            onClick={() => handleAction('to-yaml')}
            className="px-2.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 font-black text-[11px] shrink-0 cursor-pointer"
          >
            YAML
          </button>
        </div>

        <button
          type="button"
          onClick={copyResult}
          className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1 shrink-0 shadow-md cursor-pointer whitespace-nowrap"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy</span>
        </button>
      </div>
    </ToolLayout>
  );
}
