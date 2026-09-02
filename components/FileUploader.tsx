'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <motion.div
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative w-full border-2 border-dashed rounded-2xl sm:rounded-3xl p-5 sm:p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/80 scale-[1.01] shadow-lg ring-4 ring-indigo-500/10'
            : 'border-slate-300/90 bg-slate-50/70 hover:border-indigo-400 hover:bg-slate-100/60 shadow-2xs'
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

        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 border border-indigo-100 shadow-2xs">
          <UploadCloud className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 animate-bounce duration-1000" />
        </div>

        <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1 px-2 leading-snug">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mb-3 sm:mb-4 max-w-md px-2 font-medium leading-relaxed">
          {subtitle}
        </p>

        <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all">
          <FolderPlus className="w-4 h-4" />
          <span>Browse Files from Device</span>
        </div>
      </motion.div>

      {/* Processing Progress Bar */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-indigo-50/90 rounded-2xl p-4 border border-indigo-200 space-y-2"
          >
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-indigo-800 font-bold truncate pr-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span>{progressStatus || 'Processing files locally...'}</span>
              </span>
              <span className="text-indigo-600 font-black shrink-0">{progressPercent}%</span>
            </div>
            <div className="w-full bg-indigo-200/80 h-2.5 rounded-full overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-full transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected File List / Previews */}
      {files.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>Selected Files</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold border border-indigo-100">
                {files.length}
              </span>
            </span>
            {multiple && (
              <button
                onClick={() => inputRef.current?.click()}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-xl border border-indigo-100 active:scale-95 transition-all cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Add More</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2.5 max-h-80 overflow-y-auto pr-0.5">
            <AnimatePresence initial={false}>
              {files.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-3 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-slate-300 transition-all gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-1">
                    {/* Sequence Order Number Badge */}
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black flex items-center justify-center shrink-0 border border-slate-200">
                      #{index + 1}
                    </span>

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
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {onReorderFiles && multiple && files.length > 1 && (
                      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/70">
                        <button
                          onClick={() => moveItem(index, 'up')}
                          disabled={index === 0}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-20 transition-all cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveItem(index, 'down')}
                          disabled={index === files.length - 1}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white disabled:opacity-20 transition-all cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {onRemoveFile && (
                      <button
                        onClick={() => onRemoveFile(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
