'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { processJSON } from '@/lib/utility-engine';
import { toast } from 'sonner';
import { Copy, Download, Code2, AlertTriangle } from 'lucide-react';

export default function JSONFormatterPage() {
  const [inputJSON, setInputJSON] = useState(`[
  { "id": 1, "name": "OmniTool Suite", "category": "Client-Side Tools", "privacy": "100% Zero-Server" },
  { "id": 2, "name": "PDF Compressor", "category": "PDF Studio", "privacy": "Client Wasm" }
]`);
  const [outputResult, setOutputResult] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAction = (action: 'format2' | 'format4' | 'minify' | 'to-csv' | 'to-yaml') => {
    if (!inputJSON.trim()) {
      toast.error('Please enter JSON text.');
      return;
    }

    const { result, isValid, error } = processJSON(inputJSON, action);
    if (isValid) {
      setOutputResult(result);
      setErrorMsg(null);
      toast.success(`JSON processed (${action})!`);
    } else {
      setErrorMsg(error || 'Invalid JSON format');
      setOutputResult('');
      toast.error('JSON syntax error detected.');
    }
  };

  const copyResult = () => {
    if (outputResult) {
      navigator.clipboard.writeText(outputResult);
      toast.success('Copied output to clipboard!');
    }
  };

  const downloadResult = () => {
    if (!outputResult) return;
    const blob = new Blob([outputResult], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed-data.txt';
    a.click();
  };

  return (
    <ToolLayout
      slug="/utility/json-formatter"
      title="JSON Formatter, Validator & CSV/YAML Converter"
      subtitle="Format, prettify, minify, validate syntax, and convert JSON arrays to CSV or YAML structures locally in browser."
    >
      <div className="space-y-6">
        {/* Action Toolbar */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleAction('format2')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Prettify (2 Spaces)
          </button>
          <button
            onClick={() => handleAction('format4')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Prettify (4 Spaces)
          </button>
          <button
            onClick={() => handleAction('minify')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Minify JSON
          </button>
          <button
            onClick={() => handleAction('to-csv')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Convert to CSV
          </button>
          <button
            onClick={() => handleAction('to-yaml')}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Convert to YAML
          </button>
        </div>

        {/* Input & Output Dual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-500" />
              Raw Input JSON
            </label>
            <textarea
              rows={14}
              value={inputJSON}
              onChange={(e) => setInputJSON(e.target.value)}
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Output Panel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Processed Output
              </label>
              {outputResult && (
                <div className="flex gap-2">
                  <button
                    onClick={copyResult}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    title="Copy Output"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={downloadResult}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    title="Download Output"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {errorMsg ? (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Syntax Error
                </span>
                <p>{errorMsg}</p>
              </div>
            ) : (
              <textarea
                readOnly
                rows={14}
                value={outputResult}
                placeholder="Resulting formatted JSON, CSV, or YAML will appear here..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-none"
              />
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
