'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Trash2, ArrowUp, ArrowDown, FolderPlus } from 'lucide-react';

export interface FileItem {
  id: string;
  file: File;
  previewUrl?: string;
}

export interface FileUploaderProps {
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: FileItem[]) => void;
  files: FileItem[];
  onRemoveFile?: (id: string) => void;
  onReorderFiles?: (reordered: FileItem[]) => void;
  isProcessing?: boolean;
  progressPercent?: number;
  progressStatus?: string;
  title?: string;
  subtitle?: string;
}

export function FileUploader({
  accept,
  multiple = true,
  onFilesSelected,
  files,
  onRemoveFile,
  onReorderFiles,
  isProcessing = false,
  progressPercent = 0,
  progressStatus = '',
  title = 'Drag & Drop files here',
  subtitle = 'or tap to browse files from your device',
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (newFiles: File[]) => {
    const fileItems: FileItem[] = newFiles.map((file) => {
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      let previewUrl: string | undefined = undefined;

      if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
      }

      return { id, file, previewUrl };
    });

    onFilesSelected(multiple ? [...files, ...fileItems] : fileItems);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!onReorderFiles) return;
    const newArr = [...files];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newArr.length) return;

    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    onReorderFiles(newArr);
  };

  return (
    <div className="w-full space-y-4">
      {/* Dropzone Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative w-full border-2 border-dashed rounded-3xl p-6 sm:p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/80 scale-[1.01]'
            : 'border-slate-300 bg-slate-50/60 hover:border-indigo-400 hover:bg-slate-100/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 sm:mb-4 border border-indigo-100">
          <UploadCloud className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 px-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-4 max-w-md px-2">
          {subtitle}
        </p>

        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all">
          <FolderPlus className="w-4 h-4" />
          <span>Browse Files</span>
        </div>
      </div>

      {/* Processing Progress Bar */}
      {isProcessing && (
        <div className="w-full bg-indigo-50/90 rounded-2xl p-4 border border-indigo-200 space-y-2 animate-pulse">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-indigo-800 font-bold truncate pr-2">
              {progressStatus || 'Processing files locally...'}
            </span>
            <span className="text-indigo-600 shrink-0">{progressPercent}%</span>
          </div>
          <div className="w-full bg-indigo-200/80 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Selected File List / Previews */}
      {files.length > 0 && (
        <div className="space-y-2.5 mt-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Selected Files ({files.length})
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {files.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  {item.previewUrl ? (
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="w-10 h-10 rounded-xl object-cover bg-slate-100 border shrink-0"
                    />
                  ) : item.file.type.includes('pdf') ? (
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                      <FileText className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.file.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {(item.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {onReorderFiles && multiple && files.length > 1 && (
                    <>
                      <button
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === files.length - 1}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {onRemoveFile && (
                    <button
                      onClick={() => onRemoveFile(item.id)}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
