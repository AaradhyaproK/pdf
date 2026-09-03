'use client';

import { useState, useMemo, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { generatePassword, evaluatePasswordStrength } from '@/lib/utility-engine';
import { toast } from 'sonner';
import {
  Lock,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Eye,
  EyeOff,
  Sliders,
  Sparkles,
  KeyRound,
} from 'lucide-react';

export default function PasswordGeneratorPage() {
  const [mode, setMode] = useState<'password' | 'passphrase'>('password');
  const [length, setLength] = useState<number>(16);
  const [wordCount, setWordCount] = useState<number>(4);

  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = () => {
    const pwd = generatePassword({
      length,
      wordCount,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      excludeSimilar,
      mode,
    });
    setPassword(pwd);
  };

  useEffect(() => {
    handleGenerate();
  }, [length, wordCount, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar, mode]);

  const strength = useMemo(() => {
    return evaluatePasswordStrength(password);
  }, [password]);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success('Copied password to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy password.');
    }
  };

  return (
    <ToolLayout
      slug="/utility/password-generator"
      title="Secure Random Password Generator & Strength Meter"
      subtitle="Generate strong, cryptographically secure passwords and memorable passphrases with zero server uploads and offline browser safety."
      badgeText="Web Crypto Security"
    >
      <div className="space-y-6 pb-24 md:pb-6 text-slate-900">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('password')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border cursor-pointer ${
              mode === 'password'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Random Password</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('passphrase')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border cursor-pointer ${
              mode === 'passphrase'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Memorable Passphrase</span>
          </button>
        </div>

        {/* Primary Generated Password Output Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-5 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> 100% Offline Client-Side Encryption
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Toggle Visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Generated Password Text Display */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div className="font-mono text-xl sm:text-3xl font-black tracking-wider break-all text-emerald-400 select-all">
              {showPassword ? password : '•'.repeat(password.length)}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shrink-0 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Password'}</span>
            </button>
          </div>

          {/* Password Strength Indicator Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Strength: <strong className="text-white">{strength.label}</strong> ({strength.entropyBits} bits entropy)</span>
              <span>Time to Crack: <strong className="text-emerald-400">{strength.timeToCrack}</strong></span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strength.colorClass}`}
                style={{ width: `${Math.min(100, Math.max(15, (strength.score / 4) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Customization Options Workspace */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Password Settings & Controls
          </h3>

          {mode === 'password' ? (
            <div className="space-y-5">
              {/* Length Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black text-slate-900">
                  <span>Password Length:</span>
                  <span className="text-rose-600 text-base">{length} Characters</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>

              {/* Character Checkbox Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-extrabold text-slate-900">
                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="w-4 h-4 accent-rose-600 rounded"
                  />
                  <span>Uppercase Letters (A-Z)</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="w-4 h-4 accent-rose-600 rounded"
                  />
                  <span>Lowercase Letters (a-z)</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="w-4 h-4 accent-rose-600 rounded"
                  />
                  <span>Numbers (0-9)</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="w-4 h-4 accent-rose-600 rounded"
                  />
                  <span>Special Symbols (!@#$%)</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={excludeSimilar}
                    onChange={(e) => setExcludeSimilar(e.target.checked)}
                    className="w-4 h-4 accent-rose-600 rounded"
                  />
                  <span>Exclude Ambiguous Characters (e.g. 1, l, I, 0, O)</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black text-slate-900">
                  <span>Number of Words:</span>
                  <span className="text-rose-600 text-base">{wordCount} Words</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
