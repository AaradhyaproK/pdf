'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { resizeImage } from '@/lib/image-engine';
import { toast } from 'sonner';
import { Download, Link as LinkIcon, Unlink } from 'lucide-react';

export default function ResizeImagePage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleResize = async () => {
    if (files.length === 0) {
      toast.error('Please upload an image.');
      return;
    }

    setIsProcessing(true);
    try {
      const blob = await resizeImage(files[0].file, width, height, lockAspect);
      setDownloadUrl(URL.createObjectURL(blob));
      toast.success('Image resized successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to resize image.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/image/resize"
      title="Batch Image Resizer (Pixels & %)"
      subtitle="Resize JPG, PNG, and WebP images by exact pixel dimensions or percentage scaling with aspect ratio lock."
    >
      <div className="space-y-6">
        <FileUploader
          accept="image/*"
          multiple={false}
          files={files}
          onFilesSelected={setFiles}
          onRemoveFile={() => {
            setFiles([]);
            setDownloadUrl(null);
          }}
          title="Upload image to resize"
        />

        {files.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-bold text-slate-500">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm"
                />
              </div>

              <button
                type="button"
                onClick={() => setLockAspect(!lockAspect)}
                className={`p-3 rounded-2xl border mt-5 transition-colors ${
                  lockAspect
                    ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600'
                    : 'border-slate-300 dark:border-slate-700 text-slate-400'
                }`}
                title={lockAspect ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
              >
                {lockAspect ? <LinkIcon className="w-5 h-5" /> : <Unlink className="w-5 h-5" />}
              </button>

              <div className="flex-1 space-y-1">
                <label className="text-xs font-bold text-slate-500">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleResize}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg transition-all"
            >
              {isProcessing ? 'Resizing Image...' : 'Resize Image Now'}
            </button>
          </div>
        )}

        {downloadUrl && (
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold">Resized Image Ready!</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">Scaled to {width}x{height} px.</p>
            </div>
            <a
              href={downloadUrl}
              download="resized-photo.jpg"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Image</span>
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
