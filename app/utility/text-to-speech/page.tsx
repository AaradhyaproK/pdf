'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { Play, Pause, StopCircle, Volume2, Download, RefreshCcw, Activity, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function TextToSpeechPage() {
  const [text, setText] = useState('Hello! Welcome to FileZenith free Text to Speech generator. Type anything here and I will read it out loud for you.');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        const availableVoices = synthRef.current?.getVoices() || [];
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !selectedVoice) {
          // Default to a Google US English voice if available, else first English voice, else first voice
          const defaultVoice = availableVoices.find(v => v.name.includes('Google US English')) 
            || availableVoices.find(v => v.lang.startsWith('en')) 
            || availableVoices[0];
          setSelectedVoice(defaultVoice.name);
        }
      };

      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const handleSpeak = () => {
    if (!synthRef.current || !text.trim()) return;

    if (synthRef.current.speaking) {
      if (isPaused) {
        synthRef.current.resume();
        setIsPaused(false);
        setIsSpeaking(true);
      }
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
      setIsPaused(false);
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        toast.error('Failed to play audio. Please try another voice or browser.');
      }
    };

    synthRef.current.speak(utterance);
  };

  const handlePause = () => {
    if (synthRef.current?.speaking) {
      synthRef.current.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const clearText = () => {
    handleStop();
    setText('');
  };

  return (
    <ToolLayout
      slug="/utility/text-to-speech"
      title="Free AI Text to Speech Generator (No Limit)"
      subtitle="Convert text to natural-sounding human voices instantly. 100% free online TTS reader with zero character limits and no sign-up required."
      badgeText="Most Popular"
    >
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Main Text Area */}
        <div className="w-full lg:w-2/3 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm p-1">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              Text Content
            </h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              {text.length} Characters
            </span>
          </div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full flex-1 min-h-[350px] p-6 focus:outline-none resize-none text-slate-700 text-lg leading-relaxed placeholder:text-slate-300 bg-transparent"
          />

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-[1.4rem] flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={clearText}
              className="text-sm font-semibold text-slate-500 hover:text-rose-600 transition-colors px-3 py-2 rounded-xl hover:bg-rose-50"
            >
              Clear Text
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleStop}
                disabled={!isSpeaking && !isPaused}
                className="p-3 rounded-xl bg-slate-200 text-slate-600 hover:bg-rose-100 hover:text-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Stop"
              >
                <StopCircle className="w-6 h-6" />
              </button>
              
              {isSpeaking ? (
                <button
                  onClick={handlePause}
                  className="px-8 py-3 rounded-xl bg-amber-500 text-white font-bold flex items-center gap-2 hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  <Pause className="w-5 h-5 fill-current" />
                  PAUSE
                </button>
              ) : (
                <button
                  onClick={handleSpeak}
                  disabled={!text.trim()}
                  className="px-10 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <Play className="w-5 h-5 fill-current relative" />
                  <span className="relative">{isPaused ? 'RESUME' : 'PLAY AUDIO'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Volume2 className="w-5 h-5 text-indigo-500" />
              Voice Settings
            </h3>
            
            {/* Voice Selection */}
            <div className="space-y-2 mb-6">
              <label className="text-sm font-semibold text-slate-600 flex justify-between">
                Language & Voice
                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{voices.length} Available</span>
              </label>
              <div className="relative">
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 appearance-none bg-slate-50 font-medium text-slate-700 text-sm"
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <Activity className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Speed / Rate */}
            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-sm">
                <label className="font-semibold text-slate-600">Reading Speed</label>
                <span className="font-bold text-indigo-600">{rate}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>

            {/* Pitch */}
            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-sm">
                <label className="font-semibold text-slate-600">Voice Pitch</label>
                <span className="font-bold text-indigo-600">{pitch.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>Deep</span>
                <span>Normal</span>
                <span>High</span>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => { setRate(1); setPitch(1); }}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-50 hover:text-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Reset Settings
            </button>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5 flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-indigo-900 mb-1">How to Download?</h4>
              <p className="text-sm text-indigo-700/80 leading-relaxed font-medium">
                Native browser TTS engines don't support direct MP3 downloads due to privacy restrictions. You can use a free system audio recorder to capture the speech output.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
