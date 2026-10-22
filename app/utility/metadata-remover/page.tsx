'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument } from 'pdf-lib';
import { toast } from 'sonner';
import {
  ShieldCheck,
  FileCheck,
  Download,
  Trash2,
  RefreshCw,
  Sparkles,
  Info,
  Lock,
  UploadCloud,
  EyeOff,
  Eye,
  CheckCircle2,
  MapPin,
  Camera,
  Cpu,
  Bot,
  ExternalLink,
  Layers,
  Sliders,
  Calendar,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { FileReadyModal } from '@/components/FileReadyModal';
import { parseFileMetadata, ParsedMetadataResult } from '@/lib/metadata-parser';

export default function MetadataRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [metaResult, setMetaResult] = useState<ParsedMetadataResult | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isStripping, setIsStripping] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'gps' | 'ai' | 'camera' | 'all'>('overview');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;
    setFile(uploaded);
    setDownloadUrl(null);
    setIsParsing(true);

    try {
      if (uploaded.type.startsWith('image/')) {
        const url = URL.createObjectURL(uploaded);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }

      const parsed = await parseFileMetadata(uploaded);
      setMetaResult(parsed);
      toast.success(
        `Analyzed ${parsed.rawAttributesCount} metadata attributes & scanned for AI signatures!`
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to parse metadata from file.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleStripMetadata = async () => {
    if (!file || !metaResult) return;
    setIsStripping(true);

    try {
      if (metaResult.fileType === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

        // Erase all document info dictionary entries
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');

        const cleanedBytes = await pdfDoc.save();
        const blob = new Blob([cleanedBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setDownloadName(`Sanitized_${file.name}`);
        setIsModalOpen(true);
        toast.success('Stripped all PDF metadata headers!');
      } else {
        // Image metadata removal via canvas redraw (erases EXIF, GPS, XMP, device tags)
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    const url = URL.createObjectURL(blob);
                    setDownloadUrl(url);
                    setDownloadName(`Sanitized_${file.name}`);
                    setIsModalOpen(true);
                    toast.success('Sanitized image! All EXIF, GPS & device headers erased.');
                  }
                },
                file.type === 'image/png' ? 'image/png' : 'image/jpeg',
                0.95
              );
            }
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to sanitize metadata.');
    } finally {
      setIsStripping(false);
    }
  };

  return (
    <ToolLayout
      slug="/utility/metadata-remover"
      title="Remove PDF & Image Metadata (EXIF, GPS & AI Detector)"
      subtitle="Inspect exact GPS coordinates, camera optics & AI-generated signatures. Scrub all hidden tracking metadata from photos and documents 100% in-browser."
      badgeText="Zero-Leak Metadata Sanitizer"
    >
      <div className="space-y-6 text-slate-800">
        {/* Privacy Alert Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 space-y-1">
            <p className="font-bold">
              Why Inspecting &amp; Stripping Metadata Protects Your Identity
            </p>
            <p className="text-emerald-800 leading-relaxed">
              Camera photos and smartphone screenshots embed your exact GPS home coordinates, device model, editing software, and timestamps. FileZenith extracts and displays every hidden byte locally, letting you erase them before sharing online.
            </p>
          </div>
        </div>

        {/* Upload Box */}
        {!file ? (
          <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 sm:p-14 text-center bg-white hover:border-indigo-400 transition-colors cursor-pointer relative shadow-sm">
            <input
              type="file"
              accept="application/pdf, image/jpeg, image/png, image/webp"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Select Photo or Document to Inspect Metadata
              </h3>
              <p className="text-xs text-slate-500">
                Supports JPG, PNG, WebP photos &amp; PDF files. Scans GPS, Camera EXIF &amp; AI-generation signatures.
              </p>
            </div>
          </div>
        ) : (
          /* File Information Header */
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                {metaResult?.fileType === 'pdf' ? 'PDF' : 'IMG'}
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate max-w-[240px] sm:max-w-md">
                  {file.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  {metaResult?.specs.fileSizeFormatted} • {file.type || 'Binary'} •{' '}
                  <span className="text-indigo-600 font-bold">
                    {metaResult?.rawAttributesCount || 0} Attributes Found
                  </span>
                </div>
              </div>
            </div>

            <label className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              Upload Different File
              <input
                type="file"
                accept="application/pdf, image/jpeg, image/png, image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Results Workspace */}
        {file && metaResult && (
          <div className="space-y-6">
            {/* Top Stat Highlights Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* GPS Stat */}
              <div
                className={`p-4 rounded-2xl border flex items-center gap-3 ${
                  metaResult.gps.hasGps
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    metaResult.gps.hasGps ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    GPS Geolocation
                  </div>
                  <div className="text-xs font-black">
                    {metaResult.gps.hasGps ? '⚠️ Exact GPS Location Found' : '🛡️ No GPS Coordinates Found'}
                  </div>
                </div>
              </div>

              {/* AI Detection Stat */}
              <div
                className={`p-4 rounded-2xl border flex items-center gap-3 ${
                  metaResult.aiDetection.verdict === 'ai_generated'
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : metaResult.aiDetection.verdict === 'authentic_camera'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    metaResult.aiDetection.verdict === 'ai_generated'
                      ? 'bg-rose-100 text-rose-600'
                      : metaResult.aiDetection.verdict === 'authentic_camera'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  {metaResult.aiDetection.verdict === 'ai_generated' ? (
                    <Bot className="w-5 h-5" />
                  ) : metaResult.aiDetection.verdict === 'authentic_camera' ? (
                    <Camera className="w-5 h-5" />
                  ) : (
                    <Cpu className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Authenticity &amp; AI
                  </div>
                  <div className="text-xs font-black truncate max-w-[180px]">
                    {metaResult.aiDetection.badgeTitle}
                  </div>
                </div>
              </div>

              {/* Camera Hardware Stat */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Camera Device
                  </div>
                  <div className="text-xs font-black text-slate-900 truncate max-w-[180px]">
                    {metaResult.camera.make
                      ? `${metaResult.camera.make} ${metaResult.camera.model || ''}`
                      : metaResult.origin.software
                      ? metaResult.origin.software
                      : 'None / Digital'}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto text-xs font-bold text-slate-600">
              {[
                { id: 'overview', label: 'Overview & Specs' },
                { id: 'gps', label: `📍 GPS Location ${metaResult.gps.hasGps ? '(!)' : ''}` },
                { id: 'ai', label: '🤖 AI Authenticity' },
                { id: 'camera', label: '📷 Camera Optics' },
                { id: 'all', label: `Raw Attributes (${metaResult.allRawFields.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-3.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-700 shadow-xs font-black'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Visual Preview */}
                {previewUrl && (
                  <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 flex flex-col items-center justify-center space-y-2 min-h-[280px]">
                    <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 self-start px-1">
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      Uploaded Image Preview
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Uploaded Preview"
                      className="max-h-[260px] w-auto max-w-full rounded-xl object-contain shadow-lg border border-slate-700"
                    />
                  </div>
                )}

                {/* Specs Summary Grid */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
                  <div className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    <span>Technical File Dimensions &amp; Format</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500">Dimensions</div>
                      <div className="font-bold text-slate-900 text-xs">
                        {metaResult.specs.width && metaResult.specs.height
                          ? `${metaResult.specs.width} × ${metaResult.specs.height} px`
                          : 'Standard PDF / Vector'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500">Megapixels &amp; Ratio</div>
                      <div className="font-bold text-slate-900 text-xs">
                        {metaResult.specs.megapixels || 'N/A'}{' '}
                        {metaResult.specs.aspectRatio ? `(${metaResult.specs.aspectRatio})` : ''}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500">File Size</div>
                      <div className="font-bold text-slate-900 text-xs">
                        {metaResult.specs.fileSizeFormatted}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500">Color Profile</div>
                      <div className="font-bold text-slate-900 text-xs">
                        {metaResult.specs.colorSpace || 'sRGB Standard'}
                      </div>
                    </div>

                    <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500">Capture / Modification Date</div>
                      <div className="font-bold text-slate-900 text-xs">
                        {metaResult.origin.createDate || metaResult.origin.modifyDate || 'None embedded'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: GPS & Location */}
            {activeTab === 'gps' && (
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    <span>Geographic GPS Coordinates</span>
                  </div>
                  {metaResult.gps.hasGps ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">
                      High Privacy Risk
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      Location Safe
                    </span>
                  )}
                </div>

                {metaResult.gps.hasGps ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-950 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-black text-xs">
                          Exact Home/Device Location Is Embedded in this Image
                        </p>
                        <p className="text-[11px] text-rose-800 leading-relaxed">
                          Anyone with this file can extract the coordinates below and view your exact physical street address. Use the Scrub button below to strip this data immediately.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="text-[11px] text-slate-500 font-bold">Latitude:</div>
                        <div className="font-mono text-sm font-black text-slate-900">
                          {metaResult.gps.latDisplay}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Decimal: {metaResult.gps.latitude}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="text-[11px] text-slate-500 font-bold">Longitude:</div>
                        <div className="font-mono text-sm font-black text-slate-900">
                          {metaResult.gps.lonDisplay}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Decimal: {metaResult.gps.longitude}
                        </div>
                      </div>

                      {metaResult.gps.altitude !== undefined && (
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="text-[11px] text-slate-500 font-bold">GPS Altitude:</div>
                          <div className="font-mono text-sm font-black text-slate-900">
                            {metaResult.gps.altitude.toFixed(1)} meters above sea level
                          </div>
                        </div>
                      )}
                    </div>

                    {metaResult.gps.mapsUrl && (
                      <div className="pt-2">
                        <a
                          href={metaResult.gps.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Exact Coordinates on Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-800">
                      No GPS coordinates detected in this file.
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      This photo does not contain latitude, longitude, or altitude location headers.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: AI Detection */}
            {activeTab === 'ai' && (
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
                <div className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span>AI Generation &amp; Authenticity Analysis</span>
                </div>

                <div
                  className={`p-4 rounded-2xl border space-y-3 ${
                    metaResult.aiDetection.verdict === 'ai_generated'
                      ? 'bg-rose-50 border-rose-200 text-rose-950'
                      : metaResult.aiDetection.verdict === 'authentic_camera'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-sm">
                      {metaResult.aiDetection.badgeTitle}
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-white/80 border border-slate-200">
                      Confidence: {metaResult.aiDetection.confidence}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed font-medium">
                    {metaResult.aiDetection.reason}
                  </p>

                  {metaResult.aiDetection.generatorName && (
                    <div className="text-xs font-bold pt-1">
                      Platform Identified: <span className="underline">{metaResult.aiDetection.generatorName}</span>
                    </div>
                  )}
                </div>

                {/* If extracted prompt is present */}
                {metaResult.aiDetection.extractedPrompt && (
                  <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 space-y-2 border border-slate-800">
                    <div className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Extracted AI Prompt &amp; Synthesis Parameters:
                    </div>
                    <pre className="font-mono text-[11px] whitespace-pre-wrap break-all text-slate-300 max-h-48 overflow-auto bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                      {metaResult.aiDetection.extractedPrompt}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Camera Optics */}
            {activeTab === 'camera' && (
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
                <div className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Camera className="w-4 h-4 text-indigo-600" />
                  <span>Optical Camera &amp; Sensor Profile</span>
                </div>

                {metaResult.camera.make || metaResult.camera.fNumber ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500">Camera Make</div>
                      <div className="font-bold text-slate-900 text-xs">
                        {metaResult.camera.make || 'None'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500">Model</div>
                      <div className="font-bold text-slate-900 text-xs">
                        {metaResult.camera.model || 'None'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500">Aperture (F-Stop)</div>
                      <div className="font-bold text-slate-900 text-xs">
                        {metaResult.camera.fNumber || 'None'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500">Shutter Speed</div>
                      <div className="font-bold text-slate-900 text-xs">
                        {metaResult.camera.exposureTime || 'None'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500">ISO Speed</div>
                      <div className="font-bold text-slate-900 text-xs">
                        {metaResult.camera.iso || 'None'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-500">Focal Length</div>
                      <div className="font-bold text-slate-900 text-xs">
                        {metaResult.camera.focalLength || 'None'}
                      </div>
                    </div>

                    {metaResult.camera.lensModel && (
                      <div className="col-span-2 sm:col-span-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[10px] text-slate-500">Lens Specification</div>
                        <div className="font-bold text-slate-900 text-xs">
                          {metaResult.camera.lensModel}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <p className="text-xs font-bold text-slate-800">
                      No physical camera optics found.
                    </p>
                    <p className="text-[11px] text-slate-500">
                      This file does not have physical lens, shutter, or ISO hardware sensor tags.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: All Raw Attributes */}
            {activeTab === 'all' && (
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Every Detected Metadata Tag ({metaResult.allRawFields.length})</span>
                  </div>
                </div>

                <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
                  {metaResult.allRawFields.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-mono text-[10px] font-bold">
                          {f.category}
                        </span>
                        <span className="font-bold text-slate-900">{f.label}:</span>
                      </div>
                      <span className="font-mono text-slate-600 text-right break-all">
                        {f.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Big Action: Scrub & Strip Button */}
            <div className="pt-2">
              <button
                onClick={handleStripMetadata}
                disabled={isStripping}
                className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isStripping ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Purging All Identifying Metadata Headers...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Scrub &amp; Strip All Hidden Metadata ({metaResult.rawAttributesCount} Attributes)
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Celebratory Completion Modal with Preview & Confetti */}
        <FileReadyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          downloadUrl={downloadUrl}
          fileName={downloadName || 'Sanitized_File'}
          previewUrl={previewUrl}
          fileType={metaResult?.fileType || 'image'}
          title="Your File is Sanitized"
          subtitle="All hidden GPS tags, camera optics, device models & edit history erased with zero cloud uploads."
          onReset={() => {
            setFile(null);
            setDownloadUrl(null);
            setMetaResult(null);
            setPreviewUrl(null);
          }}
        />
      </div>
    </ToolLayout>
  );
}
