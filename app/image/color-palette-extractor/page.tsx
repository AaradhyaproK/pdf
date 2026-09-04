'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Upload, Droplet, Palette, Copy, Trash2, Eye, PaintBucket, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { toast } from 'sonner';

// Type for the EyeDropper API
declare global {
  interface Window {
    EyeDropper: any;
  }
}

// Color Utility Functions
const hexToRgbStr = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : '';
};

const hexToHslStr = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '';
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

const generateShades = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [];
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
  
  const shades = [];
  // Generate 5 shades (mix with white/black)
  for (let i = 0.8; i >= 0.2; i -= 0.2) {
    const nr = Math.round(r + (255 - r) * i);
    const ng = Math.round(g + (255 - g) * i);
    const nb = Math.round(b + (255 - b) * i);
    shades.push('#' + [nr, ng, nb].map(x => { const h = x.toString(16); return h.length === 1 ? '0'+h : h; }).join(''));
  }
  shades.push(hex);
  for (let i = 0.2; i <= 0.8; i += 0.2) {
    const nr = Math.round(r * (1 - i));
    const ng = Math.round(g * (1 - i));
    const nb = Math.round(b * (1 - i));
    shades.push('#' + [nr, ng, nb].map(x => { const h = x.toString(16); return h.length === 1 ? '0'+h : h; }).join(''));
  }
  return shades;
};

export default function ColorPaletteExtractorPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number, y: number, srcX: number, srcY: number, clientX: number, clientY: number } | null>(null);
  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0, moved: false });
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
      setPalette([]);
      setDominantColor(null);
      setActiveColor(null);
      setHoverPos(null);
      setHoverColor(null);
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const handleImageLoad = async () => {
    if (!imageRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0, img.width, img.height);

    try {
      const colorThiefModule: any = await import('colorthief');
      const colorThief = colorThiefModule.default || colorThiefModule;
      
      const domColor = await colorThief.getColor(img);
      const palColors = await colorThief.getPalette(img, 8);
      
      if (domColor) {
        const dColor = domColor.hex();
        setDominantColor(dColor);
        setActiveColor(dColor);
      }
      
      if (palColors) {
        setPalette(palColors.map((c: any) => c.hex()));
      }
    } catch (error) {
      console.error('Error extracting colors:', error);
      toast.error('Failed to extract color palette.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Copied ${text} to clipboard!`);
    });
  };

  const handleColorSelect = (color: string) => {
    copyToClipboard(color);
    setActiveColor(color);
    if (!savedColors.includes(color)) {
      setSavedColors(prev => [color, ...prev].slice(0, 20));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1 && scrollRef.current) {
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: scrollRef.current.scrollLeft,
        scrollTop: scrollRef.current.scrollTop,
        moved: false
      };
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [isDragging]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && scrollRef.current) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        dragStart.current.moved = true;
      }
      
      if (dragStart.current.moved) {
        scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
        scrollRef.current.scrollTop = dragStart.current.scrollTop - dy;
        setHoverPos(null);
        setHoverColor(null);
        return;
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    
    const srcX = x * scaleX;
    const srcY = y * scaleY;
    
    const pixel = ctx.getImageData(srcX, srcY, 1, 1).data;
    const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(val => {
      const h = val.toString(16);
      return h.length === 1 ? '0' + h : h;
    }).join('');
    
    setHoverColor(hex);
    setHoverPos({ x, y, srcX, srcY, clientX: e.clientX, clientY: e.clientY });
  };

  const handleCanvasClick = () => {
    if (dragStart.current.moved) return;
    if (hoverColor) {
      handleColorSelect(hoverColor);
    }
  };

  const pickWithEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        handleColorSelect(result.sRGBHex);
      } catch (e) {
        console.log('EyeDropper closed');
      }
    } else {
      toast.error('Your browser does not support the EyeDropper API.');
    }
  };

  return (
    <ToolLayout
      slug="/image/color-palette-extractor"
      title="Image Color Picker & Palette Extractor"
      subtitle="Upload an image to instantly extract its dominant colors and color palette. Pick precise pixel colors from the image."
      badgeText="Design Tool"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Upload Area */}
        {!imageSrc && (
          <div className="bg-white p-8 md:p-12 rounded-3xl border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-colors shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
              <Palette className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Upload Image to Extract Colors</h3>
            <p className="text-slate-500 font-medium mb-8 max-w-md">
              Drop an image here or browse your files. We'll automatically generate a beautiful color palette based on its contents.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png, image/jpeg, image/webp, image/gif"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Browse Image
            </button>

            {/* Native Eyedropper CTA (if supported and no image uploaded yet) */}
            {isClient && 'EyeDropper' in window && (
              <div className="mt-12 max-w-md w-full bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-2 flex items-center justify-center gap-2">
                  <Droplet className="w-5 h-5 text-indigo-500" />
                  Or pick from anywhere on your screen
                </h4>
                <button
                  onClick={pickWithEyeDropper}
                  className="w-full mt-4 px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl border-2 border-indigo-100 hover:border-indigo-300 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Open Native EyeDropper
                </button>
              </div>
            )}
          </div>
        )}

        {/* Workspace */}
        {imageSrc && (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column: Image & Picker */}
            <div className="w-full lg:w-1/2 xl:w-3/5 space-y-6">
              <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm relative group overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-indigo-500" />
                    Color Picker
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      <button onClick={() => setZoom(z => Math.max(1, z - 0.5))} className="p-1.5 hover:bg-white rounded-lg shadow-sm text-slate-600 transition-all" title="Zoom Out">
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button onClick={() => setZoom(1)} className="p-1.5 hover:bg-white rounded-lg shadow-sm text-slate-600 transition-all font-mono text-xs font-bold w-10 text-center" title="Reset Zoom">
                        {Math.round(zoom * 100)}%
                      </button>
                      <button onClick={() => setZoom(z => Math.min(5, z + 0.5))} className="p-1.5 hover:bg-white rounded-lg shadow-sm text-slate-600 transition-all" title="Zoom In">
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => setImageSrc(null)}
                      className="text-xs md:text-sm font-bold text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl transition-colors"
                    >
                      Clear Image
                    </button>
                  </div>
                </div>

                <div 
                  ref={scrollRef}
                  className={`relative rounded-2xl overflow-auto flex items-center justify-center bg-slate-50/50 h-[500px] lg:h-[600px] w-full shadow-inner border border-slate-100 ${isDragging ? 'cursor-grabbing' : ''}`}
                >
                  {/* Hidden image used for color thief */}
                  <img 
                    src={imageSrc} 
                    ref={imageRef} 
                    alt="Upload" 
                    crossOrigin="anonymous"
                    className="hidden"
                    onLoad={handleImageLoad}
                  />
                  {/* Canvas for exact pixel picking */}
                  <div className="relative flex items-center justify-center m-auto">
                    <canvas 
                      ref={canvasRef}
                      className={`rounded-2xl transition-transform origin-center ${isDragging ? 'cursor-grabbing' : 'cursor-crosshair'}`}
                      style={{
                        maxWidth: zoom === 1 ? '100%' : 'none',
                        maxHeight: zoom === 1 ? '100%' : 'none',
                        width: zoom === 1 ? 'auto' : `${(canvasRef.current?.width || 0) * (zoom * 0.75)}px`
                      }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={() => setHoverColor(null)}
                      onClick={handleCanvasClick}
                    />
                  </div>
                </div>

                {/* Hover Color Tooltip / Magnifier */}
                {hoverColor && hoverPos && !isDragging && (
                  <div 
                    className="fixed pointer-events-none z-50 flex flex-col items-center gap-2 transform -translate-x-1/2 -translate-y-[calc(100%+1rem)]"
                    style={{ left: hoverPos.clientX, top: hoverPos.clientY }}
                  >
                      {/* Magnifier Glass */}
                      <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden relative bg-white/50 backdrop-blur-sm ring-1 ring-black/10 flex items-center justify-center">
                         <div 
                           className="absolute inset-0"
                           style={{
                             backgroundImage: `url(${imageSrc})`,
                             backgroundRepeat: 'no-repeat',
                             backgroundSize: `${canvasRef.current?.width ? canvasRef.current.width * 5 : 0}px ${canvasRef.current?.height ? canvasRef.current.height * 5 : 0}px`,
                             backgroundPosition: `-${hoverPos.srcX * 5 - 48}px -${hoverPos.srcY * 5 - 48}px`,
                             imageRendering: 'pixelated'
                           }}
                         />
                         {/* Center crosshair */}
                         <div className="w-2 h-2 border-2 border-white/80 rounded-full z-10 shadow-sm mix-blend-difference" />
                         {/* Outer ring colored */}
                         <div className="absolute inset-0 rounded-full ring-4 ring-inset shadow-inner pointer-events-none" style={{ borderColor: hoverColor }} />
                      </div>
                      
                      {/* Tooltip Tag */}
                      <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg shadow-lg font-mono text-sm font-bold flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shadow-inner ring-1 ring-white/20" style={{ backgroundColor: hoverColor }} />
                        {hoverColor.toUpperCase()}
                      </div>
                    </div>
                  )}
              </div>



            </div>

            {/* Right Column: Colors & Details */}
            <div className="w-full lg:w-1/2 xl:w-2/5 space-y-6">
              
              {/* Active Color Details (New Feature) */}
              {activeColor && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <PaintBucket className="w-5 h-5 text-indigo-500" />
                    Active Color
                  </h3>
                  
                  <div className="flex flex-col gap-5">
                    <div 
                      className="w-full h-32 md:h-40 shrink-0 rounded-2xl shadow-inner ring-1 ring-black/10 transition-colors duration-500"
                      style={{ backgroundColor: activeColor }}
                    />
                    <div className="w-full space-y-2">
                      
                      <button onClick={() => copyToClipboard(activeColor.toUpperCase())} className="w-full flex items-center p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors group">
                        <span className="text-xs font-bold text-slate-400 w-12 shrink-0 text-left">HEX</span>
                        <span className="font-mono font-bold text-slate-700 text-sm flex-1 text-left px-2 break-all">{activeColor.toUpperCase()}</span>
                        <Copy className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 shrink-0" />
                      </button>

                      <button onClick={() => copyToClipboard(hexToRgbStr(activeColor))} className="w-full flex items-center p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors group">
                        <span className="text-xs font-bold text-slate-400 w-12 shrink-0 text-left">RGB</span>
                        <span className="font-mono font-bold text-slate-700 text-sm flex-1 text-left px-2 break-all">{hexToRgbStr(activeColor)}</span>
                        <Copy className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 shrink-0" />
                      </button>

                      <button onClick={() => copyToClipboard(hexToHslStr(activeColor))} className="w-full flex items-center p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors group">
                        <span className="text-xs font-bold text-slate-400 w-12 shrink-0 text-left">HSL</span>
                        <span className="font-mono font-bold text-slate-700 text-sm flex-1 text-left px-2 break-all">{hexToHslStr(activeColor)}</span>
                        <Copy className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 shrink-0" />
                      </button>

                    </div>
                  </div>

                  {/* Shades Generator */}
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Color Shades</div>
                    <div className="flex h-12 rounded-xl overflow-hidden shadow-sm ring-1 ring-black/5">
                      {generateShades(activeColor).map((shade, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleColorSelect(shade)}
                          className="flex-1 hover:flex-[1.5] transition-all duration-200 group relative"
                          style={{ backgroundColor: shade }}
                          title={`Copy ${shade.toUpperCase()}`}
                        >
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Copy className="w-3 h-3 text-white drop-shadow-md" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Extracted Palette */}
              {palette.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                    <Palette className="w-5 h-5 text-indigo-500" />
                    Extracted Palette
                  </h3>
                  
                  {dominantColor && (
                    <div className="mb-6">
                      <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Dominant Color</div>
                      <button
                        onClick={() => handleColorSelect(dominantColor)}
                        className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-colors group ${activeColor === dominantColor ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-500/10' : 'border-slate-100 hover:bg-slate-50'}`}
                      >
                        <div className="w-12 h-12 rounded-xl shadow-inner ring-1 ring-black/10 transition-transform group-hover:scale-105" style={{ backgroundColor: dominantColor }} />
                        <div className="flex-1 text-left">
                          <div className={`font-mono font-bold text-lg ${activeColor === dominantColor ? 'text-indigo-700' : 'text-slate-700'}`}>{dominantColor.toUpperCase()}</div>
                        </div>
                        <Copy className={`w-5 h-5 ${activeColor === dominantColor ? 'text-indigo-500' : 'text-slate-300 group-hover:text-indigo-500'}`} />
                      </button>
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Palette Colors</div>
                    <div className="grid grid-cols-4 gap-2 md:gap-4">
                      {palette.map((color, index) => (
                        <div key={index} className="flex flex-col gap-1.5 items-center">
                          <button
                            onClick={() => handleColorSelect(color)}
                            className={`group w-full aspect-square rounded-2xl shadow-sm overflow-hidden relative transition-transform hover:scale-105 active:scale-95 ${activeColor === color ? 'ring-4 ring-indigo-500/30' : 'ring-1 ring-black/5'}`}
                            style={{ backgroundColor: color }}
                          >
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Copy className="w-6 h-6 text-white drop-shadow-md" />
                            </div>
                          </button>
                          <span className="font-mono text-[10px] md:text-xs font-bold text-slate-500 truncate w-full text-center" title={color.toUpperCase()}>{color.toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Saved Colors History */}
              {savedColors.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Droplet className="w-5 h-5 text-emerald-500" />
                      History
                    </h3>
                    <button
                      onClick={() => setSavedColors([])}
                      className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors p-2"
                      title="Clear History"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {savedColors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleColorSelect(color)}
                        className={`group w-10 h-10 rounded-full shadow-sm relative hover:scale-110 hover:z-10 transition-transform active:scale-95 ${activeColor === color ? 'ring-4 ring-indigo-500/30' : 'ring-1 ring-black/10'}`}
                        style={{ backgroundColor: color }}
                        title={`Copy ${color.toUpperCase()}`}
                      >
                        <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Copy className="w-4 h-4 text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
