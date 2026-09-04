'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Layers, Copy, RefreshCcw, Sliders, Hexagon } from 'lucide-react';
import { toast } from 'sonner';

export default function GlassmorphismGeneratorPage() {
  const [blur, setBlur] = useState(10);
  const [transparency, setTransparency] = useState(0.2);
  const [color, setColor] = useState('#ffffff');
  const [outline, setOutline] = useState(0.1);
  const [shadow, setShadow] = useState(0.1);
  const [borderRadius, setBorderRadius] = useState(24);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
  };

  const rgbColor = hexToRgb(color);

  const getCssCode = () => {
    return `/* Glassmorphism Effect */
background: rgba(${rgbColor}, ${transparency});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${borderRadius}px;
border: 1px solid rgba(255, 255, 255, ${outline});
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, ${shadow});`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCssCode()).then(() => {
      toast.success('CSS Copied to Clipboard!');
    });
  };

  const resetSettings = () => {
    setBlur(10);
    setTransparency(0.2);
    setColor('#ffffff');
    setOutline(0.1);
    setShadow(0.1);
    setBorderRadius(24);
  };

  return (
    <ToolLayout
      slug="/utility/glassmorphism-generator"
      title="Glassmorphism CSS Generator Online"
      subtitle="Create stunning frosted glass UI effects instantly. Generate cross-browser compatible CSS code for your modern web designs."
      badgeText="UI Design"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Top Section: Preview & Controls */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Left: Preview Area */}
          <div className="w-full lg:w-3/5">
            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-sm relative min-h-[500px] h-full flex items-center justify-center p-8 group">
            
            {/* Background Decorations */}
            <div className="absolute top-10 left-10 w-48 h-48 bg-purple-500 rounded-full mix-blend-screen filter blur-2xl opacity-70 animate-blob" />
            <div className="absolute top-10 right-10 w-48 h-48 bg-yellow-400 rounded-full mix-blend-screen filter blur-2xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-48 h-48 bg-pink-500 rounded-full mix-blend-screen filter blur-2xl opacity-70 animate-blob animation-delay-4000" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            {/* Glass Object Preview */}
            <div 
              className="relative z-10 w-full max-w-sm p-8 transition-all duration-300"
              style={{
                background: `rgba(${rgbColor}, ${transparency})`,
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                borderRadius: `${borderRadius}px`,
                border: `1px solid rgba(255, 255, 255, ${outline})`,
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, ${shadow})`,
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner">
                  <Hexagon className="w-6 h-6 text-white drop-shadow-md" />
                </div>
                <div>
                  <h4 className="font-bold text-white drop-shadow-md tracking-wide">Glassmorphism</h4>
                  <p className="text-white/80 text-xs font-medium uppercase tracking-widest">Premium UI Element</p>
                </div>
              </div>
              <p className="text-white/90 text-sm leading-relaxed drop-shadow-sm font-medium mb-6">
                This is a live preview of your generated glass effect. Adjust the settings on the right to see this card update in real-time.
              </p>
              
              <div className="flex gap-3">
                <div className="h-2 flex-1 bg-white/20 rounded-full shadow-inner" />
                <div className="h-2 w-1/3 bg-white/20 rounded-full shadow-inner" />
              </div>
            </div>

          </div>
        </div>

        {/* Right: Controls Area */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-500" />
                Effect Controls
              </h3>
              <button 
                onClick={resetSettings}
                className="text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-indigo-50"
                title="Reset All"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Blur Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="font-semibold text-slate-600">Blur ({blur}px)</label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={blur}
                  onChange={(e) => setBlur(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Transparency Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="font-semibold text-slate-600">Transparency ({(transparency * 100).toFixed(0)}%)</label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={transparency}
                  onChange={(e) => setTransparency(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Color Control */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-600 text-sm">Glass Color</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                  />
                  <div className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-600 font-bold uppercase flex items-center">
                    {color}
                  </div>
                </div>
              </div>

              {/* Outline Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="font-semibold text-slate-600">Border Outline</label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={outline}
                  onChange={(e) => setOutline(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Shadow Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="font-semibold text-slate-600">Box Shadow Depth</label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={shadow}
                  onChange={(e) => setShadow(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Border Radius Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="font-semibold text-slate-600">Border Radius ({borderRadius}px)</label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

            </div>
          </div>
        </div>
      </div>

        {/* Code Output (Full Width Below) */}
        <div className="w-full bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <h3 className="font-bold text-slate-200 flex items-center gap-2 text-sm md:text-base">
              <Layers className="w-5 h-5 text-emerald-400" />
              CSS Code
            </h3>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-xs md:text-sm font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors w-full md:w-auto justify-center"
            >
              <Copy className="w-4 h-4" />
              COPY CSS
            </button>
          </div>
          <pre className="text-emerald-400 font-mono text-sm md:text-base leading-relaxed overflow-x-auto p-4 md:p-6 bg-black/50 rounded-2xl shadow-inner border border-white/5">
            <code>{getCssCode()}</code>
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}
