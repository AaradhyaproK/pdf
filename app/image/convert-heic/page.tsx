'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { convertHEICToJPG } from '@/lib/image-engine';
import JSZip from 'jszip';
import { toast } from 'sonner';
import { Download, Smartphone } from 'lucide-react';

export default function ConvertHEICPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedBlobs, setConvertedBlobs] = useState<{ name: string; url: string; blob: Blob }[]>([]);
  const [zipUrl, setZipUrl] = useState<string | null>(null);

  const handleConvertHEIC = async () => {
    if (files.length === 0) {
      toast.error('Please select Apple HEIC/HEIF photos.');
      return;
    }

    setIsProcessing(true);
    setConvertedBlobs([]);
    setZipUrl(null);

    try {
      const results: { name: string; url: string; blob: Blob }[] = [];
      const zip = new JSZip();

      for (const item of files) {
        const jpgBlob = await convertHEICToJPG(item.file);
        const name = item.file.name.replace(/\.(heic|heif)$/i, '.jpg');
        const url = URL.createObjectURL(jpgBlob);

        results.push({ name, url, blob: jpgBlob });
        zip.file(name, jpgBlob);
      }

      setConvertedBlobs(results);
      if (results.length > 1) {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setZipUrl(URL.createObjectURL(zipBlob));
      }

      toast.success(`Converted ${results.length} HEIC photos to JPG!`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to convert HEIC photos.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/image/convert-heic"
      title="Apple HEIC to JPG/PNG Converter (Batch)"
      subtitle="Convert Apple iPhone HEIC and HEIF photos to universal JPG or PNG format. 100% client-side decoding."
    >
      <div className="space-y-6">
        <FileUploader
          accept=".heic,.heif,image/heic,image/heif"
          multiple={true}
          files={files}
          onFilesSelected={setFiles}
          onRemoveFile={(id) => setFiles(files.filter((f) => f.id !== id))}
          title="Upload Apple HEIC / HEIF Photos"
        />

        {files.length > 0 && (
          <button
            onClick={handleConvertHEIC}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Smartphone className="w-5 h-5" />
            <span>{isProcessing ? 'Decoding HEIC Photos...' : `Convert ${files.length} HEIC Photos to JPG`}</span>
          </button>
        )}

        {convertedBlobs.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Converted Photos ({convertedBlobs.length})
              </span>
              {zipUrl && (
                <a
                  href={zipUrl}
                  download="converted-heic-photos.zip"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All ZIP</span>
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {convertedBlobs.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{(item.blob.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <a
                    href={item.url}
                    download={item.name}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shrink-0 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
