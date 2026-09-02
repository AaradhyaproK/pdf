'use client';

import { useState, useRef } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import {
  FileText,
  Download,
  Copy,
  Check,
  Printer,
  Sparkles,
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Code,
  List,
  ListOrdered,
  CheckSquare,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Table as TableIcon,
  Minus,
  Trash2,
  Columns,
  Rows,
  Eye,
  Edit3,
  Type,
  Clock,
  Code2,
  ArrowRightLeft,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

type LayoutMode = 'stacked' | 'side' | 'editor' | 'preview';

export default function MarkdownEditorPage() {
  const [markdownText, setMarkdownText] = useState<string>(`# Welcome to FileZenith Live Markdown Studio

## Fast, Private & 100% Free Live Markdown Editor

Write or paste Markdown documentation, blog posts, or README files with instant live preview.

### Key Features
- **Full Width Stacked Mode**: Editor on top, Preview at bottom (or swap!).
- **Side-by-Side Split**: Dual pane editor and preview.
- **1-Click Swap Places**: Swap top/bottom or left/right positions instantly.
- **Export to PDF**: Print or save cleanly as PDF.
- **100% Client-Side**: Your text stays on your device.

---

### Task List Example
- [x] Create project architecture
- [x] Build interactive client-side tools
- [x] Add Full-Width Stacked layout & Swap Places
- [ ] Launch mobile app build

### Code Snippet Example
\`\`\`javascript
// Example JavaScript Snippet
function calculateWordCount(text) {
  return text.trim().split(/\\s+/).filter(Boolean).length;
}
console.log("Markdown Live Editor Studio");
\`\`\`

> *"Simplicity is prerequisite for reliability."* — Edsger W. Dijkstra

| Feature | FileZenith | Standard Web Apps |
| :--- | :---: | :---: |
| Private Local Processing | ✅ Yes | ❌ No |
| Swap Box Positions | ✅ Yes | ❌ No |
| Full-Width Stacked View | ✅ Yes | ❌ No |
| Instant PDF Export | ✅ Yes | ⚠️ Partial |
`);

  const [layoutMode, setLayoutMode] = useState<LayoutMode>('stacked');
  const [isSwapped, setIsSwapped] = useState<boolean>(false);
  const [copiedMd, setCopiedMd] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Live Stats
  const wordCount = markdownText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = markdownText.length;
  const lineCount = markdownText.split('\n').length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Markdown to HTML parser
  const renderMarkdownToHTML = (md: string) => {
    let html = md
      // Escaping HTML elements for security
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Code blocks
      .replace(/```(\w*)\n([\s\S]*?)```/gim, (match, lang, code) => {
        return `<div className="my-3 rounded-2xl bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800 shadow-md">
          <div className="text-[10px] font-black uppercase text-slate-500 pb-2 mb-2 border-b border-slate-800 flex justify-between">
            <span>${lang || 'CODE'}</span>
            <span>UTF-8</span>
          </div>
          <pre><code>${code.trim()}</code></pre>
        </div>`;
      })
      // Tables
      .replace(/^\|(.+)\|$/gim, (match, content) => {
        const cols = content.split('|').map((c: string) => c.trim());
        const isHeader = match.includes('---') || match.includes(':---');
        if (isHeader) return '';
        const cells = cols.map((cell: string) => `<td className="p-2.5 border border-slate-200">${cell}</td>`).join('');
        return `<tr className="hover:bg-slate-50/80">${cells}</tr>`;
      })
      // Headings
      .replace(/^#### (.*$)/gim, '<h4 className="text-sm font-black text-slate-900 mt-3 mb-1">$1</h4>')
      .replace(/^### (.*$)/gim, '<h3 className="text-base font-black text-slate-900 mt-4 mb-1.5 flex items-center gap-1.5"><span className="w-1.5 h-4 bg-rose-500 rounded-full inline-block"></span>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 className="text-lg font-black text-slate-900 mt-5 mb-2 border-b border-slate-200 pb-1.5">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 className="text-2xl font-black text-slate-900 mt-6 mb-3 border-b-2 border-rose-500 pb-2">$1</h1>')
      // Blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote className="border-l-4 border-rose-500 pl-3.5 py-1.5 my-3 text-slate-600 italic font-medium bg-rose-50/50 rounded-r-2xl">$1</blockquote>')
      // Formatting
      .replace(/\*\*(.*?)\*\*/gim, '<strong className="font-black text-slate-900">$1</strong>')
      .replace(/~~(.*?)~~/gim, '<del className="line-through text-slate-400">$1</del>')
      .replace(/\*(.*?)\*/gim, '<em className="italic">$1</em>')
      // Checkboxes & Task lists
      .replace(/^\- \[x\] (.*$)/gim, '<div className="flex items-center gap-2 my-1 text-slate-800 font-medium"><input type="checkbox" checked disabled className="w-4 h-4 accent-rose-600 rounded" /> <span className="line-through text-slate-400">$1</span></div>')
      .replace(/^\- \[ \] (.*$)/gim, '<div className="flex items-center gap-2 my-1 text-slate-800 font-medium"><input type="checkbox" disabled className="w-4 h-4 rounded" /> <span>$1</span></div>')
      // Lists
      .replace(/^\- (.*$)/gim, '<li className="ml-4 list-disc text-slate-700 font-medium my-0.5">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li className="ml-4 list-decimal text-slate-700 font-medium my-0.5">$1</li>')
      // Links & Images
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" className="max-h-72 rounded-2xl shadow-md my-3 border border-slate-200" />')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener" className="text-rose-600 font-bold hover:underline">$1</a>')
      // Inline Code
      .replace(/`([^`]+)`/gim, '<code className="bg-slate-100 px-1.5 py-0.5 rounded-md text-xs font-mono text-rose-600 border border-slate-200 font-semibold">$1</code>')
      // Horizontal Rule
      .replace(/^---$/gim, '<hr className="my-6 border-t border-slate-200" />')
      // Linebreaks
      .replace(/\n/g, '<br />');

    return html;
  };

  // Insert syntax helper
  const insertSyntax = (prefix: string, suffix: string = '', defaultText: string = 'text') => {
    if (!editorRef.current) return;
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdownText.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;

    const newText = markdownText.substring(0, start) + replacement + markdownText.substring(end);
    setMarkdownText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  };

  // Toggle Swap Boxes
  const handleSwapPositions = () => {
    setIsSwapped((prev) => !prev);
    toast.success(isSwapped ? 'Restored default position' : 'Swapped Editor & Preview positions!');
  };

  // Copy Raw Markdown
  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdownText);
    setCopiedMd(true);
    toast.success('Raw Markdown copied to clipboard!');
    setTimeout(() => setCopiedMd(false), 2000);
  };

  // Copy Rendered HTML
  const copyHTML = () => {
    const html = renderMarkdownToHTML(markdownText);
    navigator.clipboard.writeText(html);
    setCopiedHtml(true);
    toast.success('Formatted HTML copied to clipboard!');
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  // Download .md File
  const handleDownloadMD = () => {
    const blob = new Blob([markdownText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    toast.success('Downloaded document.md!');
  };

  // Export PDF
  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Markdown Document</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            h1, h2, h3 { color: #0f172a; }
            code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #e11d48; }
            blockquote { border-left: 4px solid #e11d48; padding-left: 12px; margin: 12px 0; color: #475569; font-style: italic; background: #fff1f2; }
          </style>
        </head>
        <body>${renderMarkdownToHTML(markdownText)}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Component for Editor Panel
  const renderEditorPanel = () => (
    <div className="space-y-1.5 flex flex-col w-full">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
          <Edit3 className="w-3.5 h-3.5 text-rose-600" />
          <span>Markdown Source Code (Full Width Editor)</span>
        </span>
        <span className="text-[10px] font-bold text-slate-400 font-mono">
          UTF-8 Plain Text
        </span>
      </div>
      <textarea
        ref={editorRef}
        value={markdownText}
        onChange={(e) => setMarkdownText(e.target.value)}
        placeholder="Write Markdown here..."
        rows={16}
        className={`w-full p-4 bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed rounded-3xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30 shadow-inner resize-none select-text ${
          layoutMode === 'stacked' ? 'min-h-[380px] h-[450px]' : 'min-h-[500px] h-[calc(100vh-280px)]'
        }`}
      />
    </div>
  );

  // Component for Preview Panel
  const renderPreviewPanel = () => (
    <div className="space-y-1.5 flex flex-col w-full">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          <span>Live Formatted Preview (Full Width Output)</span>
        </span>
        <span className="text-[10px] font-bold text-slate-400 font-mono">
          HTML Rendered
        </span>
      </div>
      <div
        ref={previewRef}
        className={`w-full p-6 bg-white rounded-3xl border border-slate-200 overflow-y-auto shadow-inner space-y-2 text-slate-800 leading-relaxed text-sm select-text ${
          layoutMode === 'stacked' ? 'min-h-[380px] h-[450px]' : 'min-h-[500px] h-[calc(100vh-280px)]'
        }`}
        dangerouslySetInnerHTML={{ __html: renderMarkdownToHTML(markdownText) }}
      />
    </div>
  );

  return (
    <ToolLayout
      slug="/utility/markdown-editor"
      title="Markdown Live Editor Studio"
      subtitle="Write Markdown documentation with real-time preview, HTML export, and 1-click PDF printing."
    >
      <div className="space-y-4">
        {/* Top Control Bar & Stats Ribbon */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 sm:p-4 bg-slate-50 rounded-3xl border border-slate-200">
          {/* Left: Layout Mode & Swap Controls */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs self-start">
            {/* Stacked Top & Bottom Mode (Recommended Full Width) */}
            <button
              onClick={() => setLayoutMode('stacked')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === 'stacked'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Top & Bottom Full Width Stacked View"
            >
              <Rows className="w-3.5 h-3.5" />
              <span>Full Stacked</span>
            </button>

            {/* Side-by-Side Dual View */}
            <button
              onClick={() => setLayoutMode('side')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === 'side'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Side-by-Side Dual Column View"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>

            <button
              onClick={() => setLayoutMode('editor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === 'editor'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor Only</span>
            </button>

            <button
              onClick={() => setLayoutMode('preview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                layoutMode === 'preview'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Only</span>
            </button>

            {/* SWAP PLACES BUTTON */}
            {(layoutMode === 'stacked' || layoutMode === 'side') && (
              <button
                onClick={handleSwapPositions}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isSwapped
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
                title="Swap Editor and Preview Box Places"
              >
                {layoutMode === 'stacked' ? (
                  <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>Swap Places</span>
              </button>
            )}
          </div>

          {/* Center: Live Text Statistics Ribbon */}
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 overflow-x-auto no-scrollbar py-1">
            <span className="flex items-center gap-1 shrink-0">
              <Type className="w-3.5 h-3.5 text-rose-600" />
              <strong className="text-slate-900">{wordCount}</strong> words
            </span>
            <span className="text-slate-300">•</span>
            <span className="shrink-0">
              <strong className="text-slate-900">{charCount}</strong> chars
            </span>
            <span className="text-slate-300">•</span>
            <span className="shrink-0">
              <strong className="text-slate-900">{lineCount}</strong> lines
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <strong className="text-slate-900">{readTime}</strong> min read
            </span>
          </div>

          {/* Right: Export & Copy Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={copyMarkdown}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 transition-all"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMd ? 'Copied MD' : 'Copy MD'}</span>
            </button>
            <button
              onClick={copyHTML}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 transition-all"
            >
              {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code2 className="w-3.5 h-3.5" />}
              <span>{copiedHtml ? 'Copied HTML' : 'Copy HTML'}</span>
            </button>
            <button
              onClick={handleDownloadMD}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.MD</span>
            </button>
            <button
              onClick={handlePrintPDF}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Rich Desktop Formatting Toolbar */}
        <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { label: 'H1', icon: Heading1, action: () => insertSyntax('# ', '', 'Heading 1') },
            { label: 'H2', icon: Heading2, action: () => insertSyntax('## ', '', 'Heading 2') },
            { label: 'H3', icon: Heading3, action: () => insertSyntax('### ', '', 'Heading 3') },
            { label: 'Bold', icon: Bold, action: () => insertSyntax('**', '**', 'bold text') },
            { label: 'Italic', icon: Italic, action: () => insertSyntax('*', '*', 'italic text') },
            { label: 'Strikethrough', icon: Strikethrough, action: () => insertSyntax('~~', '~~', 'strikethrough') },
            { label: 'Code', icon: Code, action: () => insertSyntax('`', '`', 'code') },
            { label: 'Code Block', icon: Code2, action: () => insertSyntax('```javascript\n', '\n```', 'code here') },
            { label: 'List', icon: List, action: () => insertSyntax('- ', '', 'List item') },
            { label: 'Ordered', icon: ListOrdered, action: () => insertSyntax('1. ', '', 'Numbered item') },
            { label: 'Task List', icon: CheckSquare, action: () => insertSyntax('- [ ] ', '', 'Task item') },
            { label: 'Quote', icon: Quote, action: () => insertSyntax('> ', '', 'Quote text') },
            { label: 'Link', icon: LinkIcon, action: () => insertSyntax('[', '](https://example.com)', 'Link Title') },
            { label: 'Image', icon: ImageIcon, action: () => insertSyntax('![', '](https://picsum.photos/600/400)', 'Alt text') },
            { label: 'Table', icon: TableIcon, action: () => insertSyntax('| Col 1 | Col 2 |\n| :--- | :--- |\n| Val 1 | Val 2 |', '') },
            { label: 'Divider', icon: Minus, action: () => insertSyntax('\n---\n', '') },
          ].map((btn) => {
            const IconComp = btn.icon;
            return (
              <button
                key={btn.label}
                onClick={btn.action}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 active:scale-95 transition-all cursor-pointer shrink-0"
                title={btn.label}
                aria-label={btn.label}
              >
                <IconComp className="w-4 h-4" />
              </button>
            );
          })}

          <div className="w-px h-6 bg-slate-200 mx-1 shrink-0" />

          <button
            onClick={() => setMarkdownText('')}
            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 active:scale-95 transition-all cursor-pointer shrink-0 ml-auto"
            title="Clear all text"
            aria-label="Clear all text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Main Grid / Stacked Workspace Area */}
        <div className="space-y-6">
          {/* LAYOUT MODE 1: FULL STACKED (Top Box & Bottom Box - Full Width!) */}
          {layoutMode === 'stacked' && (
            <div className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
              {!isSwapped ? (
                <>
                  {renderEditorPanel()}
                  {renderPreviewPanel()}
                </>
              ) : (
                <>
                  {renderPreviewPanel()}
                  {renderEditorPanel()}
                </>
              )}
            </div>
          )}

          {/* LAYOUT MODE 2: SIDE BY SIDE (Split Columns) */}
          {layoutMode === 'side' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full animate-in fade-in duration-200">
              {!isSwapped ? (
                <>
                  {renderEditorPanel()}
                  {renderPreviewPanel()}
                </>
              ) : (
                <>
                  {renderPreviewPanel()}
                  {renderEditorPanel()}
                </>
              )}
            </div>
          )}

          {/* LAYOUT MODE 3: EDITOR ONLY */}
          {layoutMode === 'editor' && (
            <div className="w-full animate-in fade-in duration-200">
              {renderEditorPanel()}
            </div>
          )}

          {/* LAYOUT MODE 4: PREVIEW ONLY */}
          {layoutMode === 'preview' && (
            <div className="w-full animate-in fade-in duration-200">
              {renderPreviewPanel()}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
