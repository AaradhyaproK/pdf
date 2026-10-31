'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { PDFDocument } from 'pdf-lib';
import { toast } from 'sonner';
import { renderPDFPagesToImages } from '@/lib/pdf-engine';
import {
  ShieldCheck,
  FileCheck,
  Download,
  Eye,
  RefreshCw,
  Plus,
  Trash2,
  Lock,
  UploadCloud,
  Sparkles,
  RotateCw,
  RotateCcw,
  Sliders,
  Move,
  Layers,
  CheckCircle2,
  Maximize2,
  Copy,
  Info,
  Check,
} from 'lucide-react';
import { FileReadyModal } from '@/components/FileReadyModal';

export interface MaskBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // in degrees (-180 to 180)
  label: string;
  fillType: 'solid-black' | 'text';
  text: string;
}

export default function MaskAadhaarPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [masks, setMasks] = useState<MaskBox[]>([]);
  const [selectedMaskId, setSelectedMaskId] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<'standard' | 'full' | 'custom'>('standard');
  const [downloadPdfUrl, setDownloadPdfUrl] = useState<string | null>(null);
  const [downloadJpgUrl, setDownloadJpgUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [maskedPreviewUrl, setMaskedPreviewUrl] = useState<string | null>(null);

  // Drag & Interaction state
  const [dragMode, setDragMode] = useState<
    'move' | 'rotate' | 'nw' | 'ne' | 'se' | 'sw' | 'create' | null
  >(null);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    maskOrigX: number;
    maskOrigY: number;
    maskOrigW: number;
    maskOrigH: number;
    maskOrigRot: number;
    boxCenter: { x: number; y: number };
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Helper to re-draw canvas with all masks and interaction handles
  const renderCanvas = useCallback(
    (isExporting: boolean = false) => {
      const canvas = canvasRef.current;
      const img = imageObjRef.current;
      if (!canvas || !img) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw base Aadhaar image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 2. Render each mask
      masks.forEach((mask) => {
        ctx.save();
        const cx = mask.x + mask.width / 2;
        const cy = mask.y + mask.height / 2;
        ctx.translate(cx, cy);
        ctx.rotate((mask.rotation * Math.PI) / 180);

        // Proper solid pitch black (100% opaque true black #000000)
        ctx.fillStyle = '#000000';
        ctx.fillRect(-mask.width / 2, -mask.height / 2, mask.width, mask.height);

        // Optional UIDAI Mask Text (crisp white)
        if (mask.fillType === 'text') {
          ctx.fillStyle = '#ffffff';
          const fontSize = Math.max(13, Math.min(36, Math.round(mask.height * 0.52)));
          ctx.font = `bold ${fontSize}px monospace, ui-monospace, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(mask.text || 'XXXX XXXX ', 0, 0);
        }

        // 3. Draw on-screen interactive outline & handles if NOT exporting
        if (!isExporting) {
          const isSelected = mask.id === selectedMaskId;

          // Box border
          ctx.lineWidth = isSelected ? 3 : 1.5;
          ctx.strokeStyle = isSelected ? '#3b82f6' : 'rgba(255, 255, 255, 0.7)';
          ctx.setLineDash(isSelected ? [6, 4] : [3, 3]);
          ctx.strokeRect(-mask.width / 2, -mask.height / 2, mask.width, mask.height);
          ctx.setLineDash([]);

          // Selection Handles
          if (isSelected) {
            const handleSize = Math.max(12, Math.min(26, Math.round(canvas.width * 0.016)));
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#2563eb';
            ctx.lineWidth = 2.5;

            // 4 Corner handles
            const corners = [
              [-mask.width / 2, -mask.height / 2],
              [mask.width / 2, -mask.height / 2],
              [mask.width / 2, mask.height / 2],
              [-mask.width / 2, mask.height / 2],
            ];
            corners.forEach(([hx, hy]) => {
              ctx.fillRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
              ctx.strokeRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
            });

            // Top Rotation Handle (Stem + Circular Grab Knob)
            const handleOffset = Math.max(32, mask.height * 0.35);
            const rotY = -mask.height / 2 - handleOffset;

            // Stem line
            ctx.beginPath();
            ctx.moveTo(0, -mask.height / 2);
            ctx.lineTo(0, rotY);
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Knob circle
            ctx.beginPath();
            ctx.arc(0, rotY, handleSize * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = '#3b82f6';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Center pivot indicator dot
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, rotY, 3, 0, Math.PI * 2);
            ctx.fill();

            // Floating rotation degree pill
            if (mask.rotation !== 0) {
              const degText = `${mask.rotation > 0 ? '+' : ''}${mask.rotation}°`;
              ctx.font = 'bold 13px sans-serif';
              const textWidth = ctx.measureText(degText).width;
              ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
              ctx.fillRect(-textWidth / 2 - 8, rotY - 28, textWidth + 16, 20);
              ctx.fillStyle = '#38bdf8';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(degText, 0, rotY - 18);
            }
          }
        }

        ctx.restore();
      });
    },
    [masks, selectedMaskId]
  );

  useEffect(() => {
    renderCanvas(false);
  }, [renderCanvas]);

  // Apply default presets
  const applyPreset = (preset: 'standard' | 'full' | 'custom') => {
    setActivePreset(preset);
    if (!canvasRef.current) return;
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;

    if (preset === 'standard') {
      const standardBox: MaskBox = {
        id: 'aadhaar-digits',
        x: Math.round(w * 0.28),
        y: Math.round(h * 0.72),
        width: Math.round(w * 0.38),
        height: Math.round(h * 0.08),
        rotation: 0,
        label: 'First 8 Digits (XXXX-XXXX-)',
        fillType: 'text',
        text: 'XXXX XXXX ',
      };
      setMasks([standardBox]);
      setSelectedMaskId(standardBox.id);
      toast.success('Applied Standard First-8 Digits Mask!');
    } else if (preset === 'full') {
      const numberBox: MaskBox = {
        id: 'aadhaar-digits',
        x: Math.round(w * 0.28),
        y: Math.round(h * 0.72),
        width: Math.round(w * 0.38),
        height: Math.round(h * 0.08),
        rotation: 0,
        label: 'Aadhaar Number',
        fillType: 'solid-black',
        text: '',
      };
      const qrBox: MaskBox = {
        id: 'qr-code',
        x: Math.round(w * 0.68),
        y: Math.round(h * 0.44),
        width: Math.round(w * 0.26),
        height: Math.round(h * 0.32),
        rotation: 0,
        label: 'QR Code Redaction',
        fillType: 'solid-black',
        text: '',
      };
      setMasks([numberBox, qrBox]);
      setSelectedMaskId(numberBox.id);
      toast.success('Applied Maximum Security Mask (Number + QR)!');
    } else {
      // Custom mode: Keep existing or add one initial custom box
      if (masks.length === 0) {
        const customBox: MaskBox = {
          id: `mask-${Date.now()}`,
          x: Math.round(w * 0.25),
          y: Math.round(h * 0.68),
          width: Math.round(w * 0.4),
          height: Math.round(h * 0.09),
          rotation: 0,
          label: 'Custom Blackout Box',
          fillType: 'solid-black',
          text: '',
        };
        setMasks([customBox]);
        setSelectedMaskId(customBox.id);
      }
      toast.info('Custom Mode: Drag with fingers to move, rotate & resize any black box!');
    }
  };

  const loadDataUrl = (dataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      imageObjRef.current = img;
      if (canvasRef.current) {
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
        const initialBox: MaskBox = {
          id: 'aadhaar-digits',
          x: Math.round(img.width * 0.28),
          y: Math.round(img.height * 0.72),
          width: Math.round(img.width * 0.38),
          height: Math.round(img.height * 0.08),
          rotation: 0,
          label: 'First 8 Digits (XXXX-XXXX-)',
          fillType: 'text',
          text: 'XXXX XXXX ',
        };
        setMasks([initialBox]);
        setSelectedMaskId(initialBox.id);
      }
      toast.success('Aadhaar loaded locally. Ready to mask.');
    };
    img.src = dataUrl;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setDownloadPdfUrl(null);
    setDownloadJpgUrl(null);

    if (selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf')) {
      try {
        toast.info('Rendering PDF preview locally in browser...');
        const pages = await renderPDFPagesToImages(selected, 2.0);
        if (pages && pages.length > 0) {
          loadDataUrl(pages[0].dataUrl);
        } else {
          toast.error('Failed to render PDF. Please upload a clear image scan.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load PDF in browser.');
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        loadDataUrl(result);
      };
      reader.readAsDataURL(selected);
    }
  };

  // Canvas coordinates helper from screen touch/pointer events
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Pointer Down (Finger touch / Mouse click)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const coords = getCanvasCoords(e);
    const rect = canvas.getBoundingClientRect();
    const scaleFactor = canvas.width / rect.width;
    const hitRadius = Math.max(26, 26 * scaleFactor);

    // 1. Check if the currently selected mask's handles are hit
    const selMask = masks.find((m) => m.id === selectedMaskId);
    if (selMask) {
      const cx = selMask.x + selMask.width / 2;
      const cy = selMask.y + selMask.height / 2;
      const rad = (selMask.rotation * Math.PI) / 180;

      // Rotation Handle Hit Test
      const handleOffset = Math.max(32, selMask.height * 0.35);
      const rotHandleX = cx + (selMask.height / 2 + handleOffset) * Math.sin(rad);
      const rotHandleY = cy - (selMask.height / 2 + handleOffset) * Math.cos(rad);

      if (Math.hypot(coords.x - rotHandleX, coords.y - rotHandleY) <= hitRadius) {
        setDragMode('rotate');
        dragStartRef.current = {
          startX: coords.x,
          startY: coords.y,
          maskOrigX: selMask.x,
          maskOrigY: selMask.y,
          maskOrigW: selMask.width,
          maskOrigH: selMask.height,
          maskOrigRot: selMask.rotation,
          boxCenter: { x: cx, y: cy },
        };
        return;
      }

      // Corner Resize Handles Hit Test
      const corners: Array<{ name: 'nw' | 'ne' | 'se' | 'sw'; lx: number; ly: number }> = [
        { name: 'nw', lx: -selMask.width / 2, ly: -selMask.height / 2 },
        { name: 'ne', lx: selMask.width / 2, ly: -selMask.height / 2 },
        { name: 'se', lx: selMask.width / 2, ly: selMask.height / 2 },
        { name: 'sw', lx: -selMask.width / 2, ly: selMask.height / 2 },
      ];

      for (const c of corners) {
        const cornerCanvasX = cx + c.lx * Math.cos(rad) - c.ly * Math.sin(rad);
        const cornerCanvasY = cy + c.lx * Math.sin(rad) + c.ly * Math.cos(rad);
        if (Math.hypot(coords.x - cornerCanvasX, coords.y - cornerCanvasY) <= hitRadius) {
          setDragMode(c.name);
          dragStartRef.current = {
            startX: coords.x,
            startY: coords.y,
            maskOrigX: selMask.x,
            maskOrigY: selMask.y,
            maskOrigW: selMask.width,
            maskOrigH: selMask.height,
            maskOrigRot: selMask.rotation,
            boxCenter: { x: cx, y: cy },
          };
          return;
        }
      }
    }

    // 2. Check if clicked inside any mask's body (from top to bottom)
    for (let i = masks.length - 1; i >= 0; i--) {
      const m = masks[i];
      const cx = m.x + m.width / 2;
      const cy = m.y + m.height / 2;
      const rad = -(m.rotation * Math.PI) / 180;
      const dx = coords.x - cx;
      const dy = coords.y - cy;
      const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
      const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

      if (Math.abs(localX) <= m.width / 2 && Math.abs(localY) <= m.height / 2) {
        setSelectedMaskId(m.id);
        setDragMode('move');
        dragStartRef.current = {
          startX: coords.x,
          startY: coords.y,
          maskOrigX: m.x,
          maskOrigY: m.y,
          maskOrigW: m.width,
          maskOrigH: m.height,
          maskOrigRot: m.rotation,
          boxCenter: { x: cx, y: cy },
        };
        return;
      }
    }

    // 3. Clicked on empty space
    if (activePreset === 'custom') {
      // In custom mode, start drawing a new blackout box
      const newId = `mask-${Date.now()}`;
      const newMask: MaskBox = {
        id: newId,
        x: Math.round(coords.x),
        y: Math.round(coords.y),
        width: 40,
        height: 25,
        rotation: 0,
        label: `Custom Blackout ${masks.length + 1}`,
        fillType: 'solid-black',
        text: '',
      };
      setMasks((prev) => [...prev, newMask]);
      setSelectedMaskId(newId);
      setDragMode('create');
      dragStartRef.current = {
        startX: coords.x,
        startY: coords.y,
        maskOrigX: coords.x,
        maskOrigY: coords.y,
        maskOrigW: 40,
        maskOrigH: 25,
        maskOrigRot: 0,
        boxCenter: { x: coords.x, y: coords.y },
      };
    } else {
      setSelectedMaskId(null);
    }
  };

  // Pointer Move (Touch Drag / Rotate / Resize)
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragMode || !dragStartRef.current || !selectedMaskId) return;
    const coords = getCanvasCoords(e);
    const start = dragStartRef.current;

    if (dragMode === 'move') {
      const dx = coords.x - start.startX;
      const dy = coords.y - start.startY;
      setMasks((prev) =>
        prev.map((m) =>
          m.id === selectedMaskId
            ? {
                ...m,
                x: Math.round(start.maskOrigX + dx),
                y: Math.round(start.maskOrigY + dy),
              }
            : m
        )
      );
    } else if (dragMode === 'rotate') {
      const cx = start.boxCenter.x;
      const cy = start.boxCenter.y;
      let angle = (Math.atan2(coords.y - cy, coords.x - cx) * 180) / Math.PI + 90;
      while (angle > 180) angle -= 360;
      while (angle < -180) angle += 360;

      // Snap to 0 if within 2.5 degrees for easy leveling
      if (Math.abs(angle) < 2.5) angle = 0;

      setMasks((prev) =>
        prev.map((m) =>
          m.id === selectedMaskId ? { ...m, rotation: Math.round(angle) } : m
        )
      );
    } else if (['nw', 'ne', 'se', 'sw'].includes(dragMode)) {
      const cx = start.boxCenter.x;
      const cy = start.boxCenter.y;
      const rad = -(start.maskOrigRot * Math.PI) / 180;
      const dx = coords.x - cx;
      const dy = coords.y - cy;
      const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
      const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

      const newW = Math.max(30, Math.round(Math.abs(localX) * 2));
      const newH = Math.max(16, Math.round(Math.abs(localY) * 2));

      setMasks((prev) =>
        prev.map((m) =>
          m.id === selectedMaskId
            ? {
                ...m,
                width: newW,
                height: newH,
                x: Math.round(cx - newW / 2),
                y: Math.round(cy - newH / 2),
              }
            : m
        )
      );
    } else if (dragMode === 'create') {
      const minX = Math.min(start.startX, coords.x);
      const minY = Math.min(start.startY, coords.y);
      const w = Math.max(25, Math.abs(coords.x - start.startX));
      const h = Math.max(15, Math.abs(coords.y - start.startY));

      setMasks((prev) =>
        prev.map((m) =>
          m.id === selectedMaskId
            ? {
                ...m,
                x: Math.round(minX),
                y: Math.round(minY),
                width: Math.round(w),
                height: Math.round(h),
              }
            : m
        )
      );
    }
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if not captured
    }
    setDragMode(null);
    dragStartRef.current = null;
  };

  // Add custom blackout boxes
  const addCustomBlackout = (type: 'generic' | 'qr' | 'vid' | 'photo') => {
    if (!canvasRef.current) return;
    const w = canvasRef.current.width;
    const h = canvasRef.current.height;

    let newMask: MaskBox;

    if (type === 'qr') {
      newMask = {
        id: `mask-qr-${Date.now()}`,
        x: Math.round(w * 0.65),
        y: Math.round(h * 0.42),
        width: Math.round(w * 0.28),
        height: Math.round(h * 0.32),
        rotation: 0,
        label: 'QR Code Blackout',
        fillType: 'solid-black',
        text: '',
      };
    } else if (type === 'vid') {
      newMask = {
        id: `mask-vid-${Date.now()}`,
        x: Math.round(w * 0.28),
        y: Math.round(h * 0.82),
        width: Math.round(w * 0.38),
        height: Math.round(h * 0.06),
        rotation: 0,
        label: 'Virtual ID (VID) Blackout',
        fillType: 'solid-black',
        text: '',
      };
    } else if (type === 'photo') {
      newMask = {
        id: `mask-photo-${Date.now()}`,
        x: Math.round(w * 0.08),
        y: Math.round(h * 0.42),
        width: Math.round(w * 0.22),
        height: Math.round(h * 0.38),
        rotation: 0,
        label: 'Photo Privacy Redaction',
        fillType: 'solid-black',
        text: '',
      };
    } else {
      newMask = {
        id: `mask-${Date.now()}`,
        x: Math.round(w * 0.3),
        y: Math.round(h * 0.4),
        width: Math.round(w * 0.4),
        height: Math.round(h * 0.09),
        rotation: 0,
        label: `Blackout Box ${masks.length + 1}`,
        fillType: 'solid-black',
        text: '',
      };
    }

    setMasks((prev) => [...prev, newMask]);
    setSelectedMaskId(newMask.id);
    setActivePreset('custom');
    toast.success(`Added ${newMask.label}! Drag with your finger to position.`);
  };

  const removeMask = (id: string) => {
    setMasks((prev) => prev.filter((m) => m.id !== id));
    if (selectedMaskId === id) {
      setSelectedMaskId(null);
    }
  };

  const updateSelectedMask = (updates: Partial<MaskBox>) => {
    if (!selectedMaskId) return;
    setMasks((prev) =>
      prev.map((m) => (m.id === selectedMaskId ? { ...m, ...updates } : m))
    );
  };

  // Generate Final Clean PDF and JPG with zero handles
  const handleGenerateMaskedFile = async () => {
    if (!canvasRef.current || !imageObjRef.current) return;
    setIsProcessing(true);

    try {
      // 1. Render clean canvas with TRUE pitch black without UI handles
      renderCanvas(true);

      const highResCanvas = canvasRef.current;
      const dataUrl = highResCanvas.toDataURL('image/jpeg', 0.98);

      // Create download JPG url
      setDownloadJpgUrl(dataUrl);
      setMaskedPreviewUrl(dataUrl);

      // 2. Embed into PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([highResCanvas.width, highResCanvas.height]);
      const imageBytes = await fetch(dataUrl).then((res) => res.arrayBuffer());
      const embeddedImage = await pdfDoc.embedJpg(imageBytes);

      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: highResCanvas.width,
        height: highResCanvas.height,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);
      setDownloadPdfUrl(pdfUrl);

      // Restore interactive handles on canvas
      renderCanvas(false);

      setIsModalOpen(true);
      toast.success('Masked Aadhaar ready! Permanent solid black redaction applied.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedMask = masks.find((m) => m.id === selectedMaskId);

  return (
    <ToolLayout
      slug="/pdf/mask-aadhaar"
      title="Mask Aadhaar Card Online (Hide First 8 Digits Offline)"
      subtitle="Safely mask the first 8 digits of your Aadhaar card into XXXX-XXXX-1234. Drag, rotate and adjust proper solid blackout with zero server uploads."
      badgeText="UIDAI & RBI Compliant"
    >
      <div className="space-y-6 text-slate-800">
        {/* Trust Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 space-y-1">
            <p className="font-bold">
              100% Zero-Server Privacy Guarantee (UIDAI Circular Compliant)
            </p>
            <p className="text-emerald-800 leading-relaxed">
              Your Aadhaar is processed entirely inside your local browser memory via WebAssembly.
              Zero bytes ever travel over the internet, keeping your identity 100% confidential.
            </p>
          </div>
        </div>

        {/* Upload Box */}
        {!file ? (
          <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 sm:p-12 text-center bg-white hover:border-indigo-400 transition-colors cursor-pointer relative shadow-sm">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, application/pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Upload Aadhaar Card (Image or PDF)
              </h3>
              <p className="text-xs text-slate-500">
                Drag and drop your front or full Aadhaar scan (JPG, PNG, PDF). Supported by all Indian hotels, banks &amp; KYC portals.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header / Active File Info */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800 truncate max-w-[240px]">
                  {file.name}
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                  {masks.length} {masks.length === 1 ? 'Blackout Box' : 'Blackout Boxes'}
                </span>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setDownloadPdfUrl(null);
                  setDownloadJpgUrl(null);
                  setMasks([]);
                }}
                className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Upload Different Card
              </button>
            </div>

            {/* Presets & Quick Mode Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <label className="text-xs font-black text-slate-800 block">
                Select Masking Style:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => applyPreset('standard')}
                  className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                    activePreset === 'standard'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-black text-slate-900 flex items-center gap-1.5">
                    <span>Standard First-8 Digits</span>
                    {activePreset === 'standard' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Masks first 8 numbers (XXXX XXXX 1234)
                  </div>
                </button>

                <button
                  onClick={() => applyPreset('full')}
                  className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                    activePreset === 'full'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-black text-slate-900 flex items-center gap-1.5">
                    <span>Maximum Security (Number + QR)</span>
                    {activePreset === 'full' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Redacts numbers AND scannable QR code
                  </div>
                </button>

                <button
                  onClick={() => applyPreset('custom')}
                  className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                    activePreset === 'custom'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-black text-slate-900 flex items-center gap-1.5">
                    <span>Custom Blackout Filter</span>
                    {activePreset === 'custom' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Draw, drag, resize &amp; rotate any black box
                  </div>
                </button>
              </div>

              {/* Custom Quick Add Buttons */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">Quick Add Blackout:</span>
                <button
                  onClick={() => addCustomBlackout('generic')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3 h-3" />
                  + Blackout Box
                </button>
                <button
                  onClick={() => addCustomBlackout('qr')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3 h-3 text-indigo-600" />
                  + QR Code Box
                </button>
                <button
                  onClick={() => addCustomBlackout('vid')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3 h-3 text-indigo-600" />
                  + Virtual ID (VID)
                </button>
                <button
                  onClick={() => addCustomBlackout('photo')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3 h-3 text-indigo-600" />
                  + Photo Redactor
                </button>
              </div>
            </div>

            {/* Interactive Canvas Viewer with Direct Finger Touch / Mouse */}
            <div className="bg-slate-900 p-3 sm:p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-300 font-bold px-1 gap-2">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span>Interactive Live Canvas</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Move className="w-3 h-3 text-sky-400" /> Drag to move
                  </span>
                  <span className="flex items-center gap-1">
                    <RotateCw className="w-3 h-3 text-indigo-400" /> Blue top knob to rotate
                  </span>
                </div>
              </div>

              {/* Canvas viewport */}
              <div className="overflow-auto max-h-[550px] flex items-center justify-center bg-slate-950/80 p-2 sm:p-4 rounded-2xl border border-slate-800 touch-none select-none">
                <canvas
                  ref={canvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className="max-w-full h-auto rounded-lg shadow-2xl border border-slate-700 cursor-crosshair touch-none"
                  style={{ touchAction: 'none' }}
                />
              </div>

              <div className="text-center text-[11px] text-slate-400 font-medium">
                💡 <strong className="text-slate-300">Finger Controls:</strong> Touch inside the black box to drag • Touch the blue top knob to rotate • Touch corners to resize.
              </div>
            </div>

            {/* Selected Blackout Box Precision Controls */}
            {selectedMask && (
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-indigo-200 shadow-sm space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-600 shrink-0" />
                    <span className="text-xs font-black text-slate-900">
                      Selected: {selectedMask.label}
                    </span>
                  </div>
                  <button
                    onClick={() => removeMask(selectedMask.id)}
                    className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Box
                  </button>
                </div>

                {/* 1. Proper Solid Black Style Toggle */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block">
                    Redaction Blackout Style:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateSelectedMask({ fillType: 'solid-black', text: '' })}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        selectedMask.fillType === 'solid-black'
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 bg-black rounded-sm border border-slate-600" />
                      <span>Solid Pitch Black (#000000)</span>
                    </button>

                    <button
                      onClick={() =>
                        updateSelectedMask({
                          fillType: 'text',
                          text: selectedMask.text || 'XXXX XXXX ',
                        })
                      }
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        selectedMask.fillType === 'text'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-mono font-bold text-indigo-600">XXXX</span>
                      <span>Masked Format (XXXX-XXXX-)</span>
                    </button>
                  </div>
                </div>

                {/* 2. Finger Rotate & Quick Angle Controls */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Rotate Angle (Tilted Photo Correction):</span>
                    </label>
                    <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {selectedMask.rotation > 0 ? '+' : ''}
                      {selectedMask.rotation}°
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateSelectedMask({ rotation: (selectedMask.rotation - 1) % 360 })
                      }
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                      title="-1 Degree"
                    >
                      -1°
                    </button>
                    <input
                      type="range"
                      min={-180}
                      max={180}
                      value={selectedMask.rotation}
                      onChange={(e) =>
                        updateSelectedMask({ rotation: Number(e.target.value) })
                      }
                      className="w-full accent-indigo-600"
                    />
                    <button
                      onClick={() =>
                        updateSelectedMask({ rotation: (selectedMask.rotation + 1) % 360 })
                      }
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                      title="+1 Degree"
                    >
                      +1°
                    </button>
                  </div>

                  {/* Quick Angle Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-bold">Quick Snap:</span>
                    {[-15, -5, -2, 0, 2, 5, 15, 90].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => updateSelectedMask({ rotation: deg })}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          selectedMask.rotation === deg
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {deg === 0 ? '0° (Level)' : `${deg > 0 ? '+' : ''}${deg}°`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Size Sliders (Width & Height) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                      <span>Box Width:</span>
                      <span>{selectedMask.width} px</span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={canvasRef.current?.width || 1200}
                      value={selectedMask.width}
                      onChange={(e) =>
                        updateSelectedMask({ width: Number(e.target.value) })
                      }
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                      <span>Box Height:</span>
                      <span>{selectedMask.height} px</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={canvasRef.current?.height || 600}
                      value={selectedMask.height}
                      onChange={(e) =>
                        updateSelectedMask({ height: Number(e.target.value) })
                      }
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Generate Action Buttons */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <button
                onClick={handleGenerateMaskedFile}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Applying Solid Blackout &amp; Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Export Compliant Masked Document
                  </>
                )}
              </button>

              {/* Ready Downloads Bar (Both PDF & JPG) */}
              {(downloadPdfUrl || downloadJpgUrl) && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-950 font-black text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Masked Aadhaar Ready! Choose Download Format:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {downloadPdfUrl && (
                      <a
                        href={downloadPdfUrl}
                        download={`Masked_Aadhaar_${Date.now()}.pdf`}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download Masked PDF
                      </a>
                    )}
                    {downloadJpgUrl && (
                      <a
                        href={downloadJpgUrl}
                        download={`Masked_Aadhaar_${Date.now()}.jpg`}
                        className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download Masked JPG Image
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Celebratory Completion Modal */}
        <FileReadyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          downloadUrl={downloadPdfUrl}
          fileName={`Masked_Aadhaar_${Date.now()}.pdf`}
          previewUrl={maskedPreviewUrl}
          fileType="pdf"
          title="Your Masked Aadhaar is Ready"
          subtitle="Proper solid pitch black redaction applied. 100% compliant with RBI & UIDAI rules with zero cloud uploads."
          onReset={() => {
            setFile(null);
            setDownloadPdfUrl(null);
            setDownloadJpgUrl(null);
          }}
        />
      </div>
    </ToolLayout>
  );
}
