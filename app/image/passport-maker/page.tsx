'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUploader, FileItem } from '@/components/FileUploader';
import { cropToPassportPreset, PASSPORT_PRESETS } from '@/lib/image-engine';
import { toast } from 'sonner';
import { Download, UserCheck, Grid } from 'lucide-react';

export default function PassportMakerPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof PASSPORT_PRESETS>('us');
  const [isProcessing, setIsProcessing] = useState(false);
  const [singleUrl, setSingleUrl] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);

  const handleGeneratePassport = async () => {
    if (files.length === 0) {
      toast.error('Please upload a front-facing portrait photo.');
      return;
    }

    setIsProcessing(true);
    try {
      const { singleBlob, sheetBlob } = await cropToPassportPreset(files[0].file, selectedPreset);
      setSingleUrl(URL.createObjectURL(singleBlob));
      setSheetUrl(URL.createObjectURL(sheetBlob));
      toast.success('Passport photos generated!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to crop passport photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      slug="/image/passport-maker"
      title="Passport & Visa Photo Maker (US, Schengen, UK, India)"
      subtitle="Crop portrait photos to official biometric passport specifications. Export single photo or printable 4x6 sheet."
    >
      <div className="space-y-6">
        <FileUploader
          accept="image/*"
          multiple={false}
          files={files}
          onFilesSelected={setFiles}
          onRemoveFile={() => {
            setFiles([]);
            setSingleUrl(null);
            setSheetUrl(null);
          }}
          title="Upload clear portrait photo"
        />

        {files.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-indigo-500" />
                Select Passport Standard Specification
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(PASSPORT_PRESETS).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedPreset(key as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedPreset === key
                        ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-sm font-bold">{item.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGeneratePassport}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg transition-all"
            >
              {isProcessing ? 'Cropping Passport Photos...' : 'Generate Passport & Print Sheet'}
            </button>
          </div>
        )}

        {singleUrl && sheetUrl && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Single Passport Photo Card */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-5 border space-y-4 text-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Single Biometric Photo
                </span>
                <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-white">
                  <img src={singleUrl} alt="Passport Single" className="w-full h-full object-cover" />
                </div>
                <a
                  href={singleUrl}
                  download={`passport-${selectedPreset}.jpg`}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Single Photo</span>
                </a>
              </div>

              {/* 4x6 Printable Grid Sheet Card */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-5 border space-y-4 text-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block flex items-center justify-center gap-1">
                  <Grid className="w-4 h-4 text-emerald-500" />
                  4x6 Inch Printable Sheet (6 Photos)
                </span>
                <div className="w-40 h-52 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-white bg-white p-1">
                  <img src={sheetUrl} alt="Printable Sheet" className="w-full h-full object-contain" />
                </div>
                <a
                  href={sheetUrl}
                  download={`passport-sheet-4x6.jpg`}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download 4x6 Print Sheet</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
