'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import {
  Play,
  Pause,
  StopCircle,
  Volume2,
  VolumeX,
  Download,
  RefreshCcw,
  Activity,
  FileText,
  Sparkles,
  Mic,
  Radio,
  Sliders,
  Globe,
  Clock,
  Headphones,
  Search,
  CheckCircle2,
  ChevronDown,
  Zap,
  Music2,
  Trash2,
  Copy,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface PresetScript {
  id: string;
  emoji: string;
  title: string;
  badge: string;
  rate: number;
  pitch: number;
  text: string;
}

const PRESETS: PresetScript[] = [
  {
    id: 'youtube',
    emoji: '🎬',
    title: 'YouTube Intro',
    badge: 'High Engagement',
    rate: 1.05,
    pitch: 1.0,
    text: "Welcome back to the channel! In today's video, we are breaking down the exact step-by-step blueprint to scale your digital presence from zero to full-time income in 2026. Make sure to hit subscribe, ring the bell, and let's dive right in!"
  },
  {
    id: 'reels',
    emoji: '📱',
    title: 'TikTok / Reels Hook',
    badge: 'Viral Retention',
    rate: 1.15,
    pitch: 1.05,
    text: "Stop scrolling! If you are still doing this manually in 2026, here is the secret high-speed workflow top digital creators use to automate their entire production in under sixty seconds."
  },
  {
    id: 'podcast',
    emoji: '🎙️',
    title: 'Podcast Narration',
    badge: 'Conversational',
    rate: 1.0,
    pitch: 0.95,
    text: "Welcome to The Zenith Dialogue, episode 48. Today, we sit down with industry architects to explore how autonomous artificial intelligence and privacy-first web platforms are reshaping the creative economy."
  },
  {
    id: 'meditation',
    emoji: '🧘',
    title: 'Meditation & Calm',
    badge: 'Deep Relaxation',
    rate: 0.8,
    pitch: 0.9,
    text: "Take a slow, deep breath in through your nose... hold it for three gentle seconds... and slowly exhale through your mouth. Let go of all tension and allow your mind to settle peacefully in this present moment."
  },
  {
    id: 'audiobook',
    emoji: '📚',
    title: 'Audiobook Chapter',
    badge: 'Storytelling',
    rate: 0.95,
    pitch: 1.0,
    text: "Chapter One. The morning mist hung low over the quiet cobblestone alleys of the mountain village. In the distance, an ancient cathedral bell resonated across the valley, announcing the arrival of an unexpected traveler."
  },
  {
    id: 'business',
    emoji: '💼',
    title: 'Executive Briefing',
    badge: 'Professional',
    rate: 1.0,
    pitch: 1.0,
    text: "Good morning team. Thank you for attending our quarterly performance review. Over the preceding ninety days, our user acquisition velocity exceeded all baseline forecast models by thirty-four percent."
  }
];

// Helper: Convert decoded Web Audio AudioBuffer to standard 16-bit PCM WAV Blob
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataLength = buffer.length * blockAlign;
  const bufferLength = 44 + dataLength;

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF container header
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');

  // Format chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // 16 for PCM
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // Data chunk
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  // Write PCM audio samples
  let offset = 44;
  const channels: Float32Array[] = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      let sample = channels[channel][i];
      sample = Math.max(-1, Math.min(1, sample));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

export default function TextToSpeechPage() {
  const [text, setText] = useState(
    'Hello and welcome to FileZenith! This is a studio-grade text to speech converter with instant audio recording and download. Type anything here, choose your favorite voice accent, and listen or download crystal-clear audio.'
  );

  // Voice Engine State
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [searchVoiceQuery, setSearchVoiceQuery] = useState<string>('');
  const [rate, setRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Playback & Prompter State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTestingVoice, setIsTestingVoice] = useState<boolean>(false);
  const [charIndex, setCharIndex] = useState<number>(0);
  const [charLength, setCharLength] = useState<number>(0);
  const [prompterMode, setPrompterMode] = useState<boolean>(false);

  // Audio Recording & Download State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [showRecordModal, setShowRecordModal] = useState<boolean>(false);
  const [, setIsProcessingAudio] = useState<boolean>(false);
  const [recordedWavUrl, setRecordedWavUrl] = useState<string | null>(null);
  const [recordedWebmUrl, setRecordedWebmUrl] = useState<string | null>(null);
  const [recordedAudioSize, setRecordedAudioSize] = useState<string>('');

  // Refs
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Load voices from browser
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const loadVoices = () => {
        const availableVoices = synthRef.current?.getVoices() || [];
        setVoices(availableVoices);

        if (availableVoices.length > 0 && !selectedVoice) {
          const defaultVoice =
            availableVoices.find((v) => v.name.includes('Google US English')) ||
            availableVoices.find((v) => v.name.includes('Natural')) ||
            availableVoices.find((v) => v.lang === 'en-US') ||
            availableVoices.find((v) => v.lang.startsWith('en')) ||
            availableVoices[0];
          if (defaultVoice) {
            setSelectedVoice(defaultVoice.name);
          }
        }
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, [selectedVoice]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Filtered voice list
  const filteredVoices = useMemo(() => {
    return voices.filter((voice) => {
      // Language filter
      const lang = voice.lang.toLowerCase();
      let matchesLang = true;
      if (languageFilter === 'en-us') {
        matchesLang = lang === 'en-us' || lang.includes('en_us');
      } else if (languageFilter === 'en-uk') {
        matchesLang = lang === 'en-gb' || lang.includes('en_gb') || lang === 'en-uk';
      } else if (languageFilter === 'in') {
        matchesLang = lang.includes('-in') || lang.startsWith('hi') || lang.startsWith('ta') || lang.startsWith('te') || lang.startsWith('mr');
      } else if (languageFilter === 'es') {
        matchesLang = lang.startsWith('es');
      } else if (languageFilter === 'euro') {
        matchesLang = lang.startsWith('fr') || lang.startsWith('de') || lang.startsWith('it') || lang.startsWith('pt');
      } else if (languageFilter === 'other') {
        matchesLang = !lang.startsWith('en') && !lang.startsWith('es') && !lang.includes('-in') && !lang.startsWith('hi');
      }

      // Search query filter
      let matchesSearch = true;
      if (searchVoiceQuery.trim()) {
        const q = searchVoiceQuery.toLowerCase();
        matchesSearch = voice.name.toLowerCase().includes(q) || voice.lang.toLowerCase().includes(q);
      }

      return matchesLang && matchesSearch;
    });
  }, [voices, languageFilter, searchVoiceQuery]);

  // Text Analytics
  const metrics = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    // Average speech speed ~ 140 words per minute at 1.0x rate
    const estimatedSeconds = words > 0 ? Math.ceil((words / (140 * rate)) * 60) : 0;
    const mins = Math.floor(estimatedSeconds / 60);
    const secs = estimatedSeconds % 60;
    const durationFormatted = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

    return { words, chars, durationFormatted, estimatedSeconds };
  }, [text, rate]);

  // Handle Play / Resume
  const handlePlay = () => {
    if (!synthRef.current || !text.trim()) return;

    if (synthRef.current.speaking) {
      if (isPaused) {
        synthRef.current.resume();
        setIsPaused(false);
        setIsSpeaking(true);
        return;
      }
    }

    // Cancel any previous voice queue
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = isMuted ? 0 : volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setCharIndex(0);
      setCharLength(0);
    };

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        setCharIndex(e.charIndex);
        setCharLength(e.charLength || 6);
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCharIndex(0);
      setCharLength(0);
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
      setIsPaused(false);
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        toast.error('Failed to play audio. Please try another voice or browser.');
      }
    };

    activeUtteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  // Handle Pause
  const handlePause = () => {
    if (synthRef.current?.speaking) {
      synthRef.current.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  // Stop Recording Session helper
  const stopRecordingSession = () => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
    }

    setIsRecording(false);
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Handle Stop
  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCharIndex(0);
    setCharLength(0);

    // Stop recording if active
    if (isRecording) {
      stopRecordingSession();
    }
  };

  // Test current selected voice
  const handleTestVoice = () => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const voice = voices.find((v) => v.name === selectedVoice);
    const sampleText = `Hello! This is ${voice?.name || 'your chosen voice'} ready to narrate for you.`;
    const utterance = new SpeechSynthesisUtterance(sampleText);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = isMuted ? 0 : volume;

    setIsTestingVoice(true);
    utterance.onend = () => setIsTestingVoice(false);
    utterance.onerror = () => setIsTestingVoice(false);

    synthRef.current.speak(utterance);
  };

  // Apply a creator template preset
  const applyPreset = (preset: PresetScript) => {
    handleStop();
    setText(preset.text);
    setRate(preset.rate);
    setPitch(preset.pitch);
    toast.success(`Loaded "${preset.title}" preset template!`);
  };

  // Audio Recording Flow: Captures pristine tab audio while TTS plays and renders WAV / WebM
  const startRecordingSession = async () => {
    setShowRecordModal(false);

    if (!text.trim()) {
      toast.error('Please enter some text to record.');
      return;
    }

    if (!navigator.mediaDevices?.getDisplayMedia) {
      toast.error('Audio tab capture is not supported in this browser. Please use Chrome, Edge, or Firefox desktop.');
      return;
    }

    try {
      // Prompt user to pick this tab with audio enabled
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        // User forgot to check 'Share tab audio'
        stream.getTracks().forEach((track) => track.stop());
        toast.error('No audio track detected! Please make sure "Share tab audio" is checked in the browser prompt.', {
          duration: 6000
        });
        return;
      }

      mediaStreamRef.current = stream;
      recordedChunksRef.current = [];

      // Create audio-only media recorder
      const audioStream = new MediaStream(audioTracks);
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : '';

      const recorder = new MediaRecorder(audioStream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        setIsProcessingAudio(true);
        try {
          const rawBlob = new Blob(recordedChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          const webmUrl = URL.createObjectURL(rawBlob);
          setRecordedWebmUrl(webmUrl);

          // Convert to Lossless 16-bit PCM WAV via Web Audio API
          try {
            const arrayBuf = await rawBlob.arrayBuffer();
            const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            const audioCtx = new AudioCtxClass();
            const decodedBuffer = await audioCtx.decodeAudioData(arrayBuf);
            const wavBlob = audioBufferToWav(decodedBuffer);
            const wavUrl = URL.createObjectURL(wavBlob);
            setRecordedWavUrl(wavUrl);

            // Format size
            const sizeKb = (wavBlob.size / 1024).toFixed(1);
            setRecordedAudioSize(`${sizeKb} KB (WAV)`);
          } catch (wavErr) {
            console.warn('WAV conversion fallback to WebM:', wavErr);
            setRecordedWavUrl(webmUrl);
            const sizeKb = (rawBlob.size / 1024).toFixed(1);
            setRecordedAudioSize(`${sizeKb} KB (WebM)`);
          }

          toast.success('Audio recording complete! Ready for download.');
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.7 }
          });
        } catch (err) {
          console.error('Audio processing failed:', err);
          toast.error('Failed to process recorded audio.');
        } finally {
          setIsProcessingAudio(false);
          // Stop stream tracks
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
          }
        }
      };

      // Start recording
      recorder.start(100);
      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration ticker
      recordTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      // Handle user stopping stream from browser UI bar
      stream.getVideoTracks()[0]?.addEventListener('ended', () => {
        stopRecordingSession();
      });

      // Start Speech
      if (synthRef.current) {
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = voices.find((v) => v.name === selectedVoice);
        if (voice) utterance.voice = voice;

        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = isMuted ? 0 : volume;

        utterance.onstart = () => {
          setIsSpeaking(true);
          setIsPaused(false);
          setCharIndex(0);
          setCharLength(0);
        };

        utterance.onboundary = (e) => {
          if (e.name === 'word') {
            setCharIndex(e.charIndex);
            setCharLength(e.charLength || 6);
          }
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setIsPaused(false);
          setCharIndex(0);
          setCharLength(0);
          // Automatically finish recording after 0.5s padding
          setTimeout(() => {
            stopRecordingSession();
          }, 500);
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
          setIsPaused(false);
          stopRecordingSession();
        };

        activeUtteranceRef.current = utterance;
        synthRef.current.speak(utterance);
      }
    } catch (err) {
      console.error('Recording initialization error:', err);
      setIsRecording(false);
      toast.info('Recording cancelled or screen share declined.');
    }
  };

  // Download Trigger
  const triggerDownload = (url: string, extension: string) => {
    const a = document.createElement('a');
    a.href = url;
    const cleanName = text.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_') || 'filezenith_tts';
    a.download = `${cleanName}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
    toast.success(`Downloaded ${extension.toUpperCase()} audio file!`);
  };

  // Copy text to clipboard
  const copyText = () => {
    navigator.clipboard.writeText(text);
    toast.success('Script copied to clipboard!');
  };

  // Format recording seconds
  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Render Karaoke Highlighting text
  const renderHighlightedScript = () => {
    if (!text) return null;
    if ((!isSpeaking && !isRecording) || charIndex >= text.length) {
      return null;
    }

    const before = text.slice(0, charIndex);
    const active = text.slice(charIndex, charIndex + (charLength || 6));
    const after = text.slice(charIndex + (charLength || 6));

    return (
      <div className="absolute inset-0 p-6 overflow-y-auto bg-slate-900/95 text-slate-100 text-lg leading-relaxed rounded-2xl select-none z-10 backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <Radio className="w-4 h-4 animate-pulse text-rose-400" />
            <span>Live Prompter Tracking</span>
          </div>
          <button
            onClick={() => setPrompterMode(false)}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 transition-colors"
          >
            Switch to Editor View
          </button>
        </div>
        <p className="font-normal text-slate-300">
          <span>{before}</span>
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-2 py-1 rounded-md shadow-lg shadow-indigo-500/40 inline-block scale-105 mx-0.5 transition-all">
            {active}
          </span>
          <span>{after}</span>
        </p>
      </div>
    );
  };

  return (
    <ToolLayout
      slug="/utility/text-to-speech"
      title="Free AI Text to Speech Generator with Audio Download"
      subtitle="Convert text to ultra-natural human voices with studio audio download (WAV/WebM). Zero character caps, 100+ global accents, live karaoke word highlighting, and speed tuning for YouTube, Reels & podcasts."
      badgeText="Direct Audio Download"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Creator Template Bar */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 rounded-3xl p-6 text-white shadow-xl border border-indigo-800/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-2xl text-indigo-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-white">Creator Quick-Start Presets</h2>
                <p className="text-xs text-slate-300">1-click scripts with calibrated reading speeds for viral retention</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded-full text-indigo-200 border border-white/10">
              6 Pre-tuned Templates
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className="group flex flex-col items-start p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-indigo-400/50 transition-all text-left active:scale-95"
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="text-xl">{p.emoji}</span>
                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded">
                    {p.rate}x
                  </span>
                </div>
                <div className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {p.title}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1">{p.badge}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Script Editor & Controls (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              {/* Editor Header with Metrics */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-slate-800 text-sm">Script Editor</span>
                </div>

                <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-semibold text-slate-700">
                    {metrics.words} Words
                  </span>
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600">
                    {metrics.chars} Chars
                  </span>
                  <span className="bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 text-indigo-700 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{metrics.durationFormatted}
                  </span>
                </div>
              </div>

              {/* Text Area with Live Highlighting Overlay */}
              <div className="relative flex-1 min-h-[380px]">
                {prompterMode && renderHighlightedScript()}

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste your script here... Zero character limits! Create audio for YouTube Shorts, Reels, audiobooks, presentations, or study notes."
                  className="w-full h-full min-h-[380px] p-6 focus:outline-none resize-none text-slate-800 text-lg leading-relaxed placeholder:text-slate-300 font-normal bg-transparent"
                />
              </div>

              {/* Animated Sound Waveform (Active during speech/recording) */}
              {(isSpeaking || isRecording) && (
                <div className="px-6 py-3 bg-indigo-50/70 border-t border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold">
                    <Activity className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>
                      {isRecording ? `Recording Audio (${formatSeconds(recordingDuration)})` : 'Synthesizing Speech...'}
                    </span>
                  </div>
                  {/* Waveform bars */}
                  <div className="flex items-center gap-1">
                    {[12, 24, 16, 32, 20, 28, 14, 30, 22, 18, 26, 15, 34, 20, 12].map((height, i) => (
                      <span
                        key={i}
                        className="w-1 bg-indigo-600 rounded-full animate-pulse"
                        style={{
                          height: `${height}px`,
                          animationDelay: `${i * 80}ms`,
                          animationDuration: '600ms'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Editor Bottom Actions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setText('')}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-xs font-medium flex items-center gap-1.5"
                    title="Clear text"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                  <button
                    onClick={copyText}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors text-xs font-medium flex items-center gap-1.5"
                    title="Copy text"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </button>
                  <button
                    onClick={() => setPrompterMode(!prompterMode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      prompterMode
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Prompter Mode</span>
                  </button>
                </div>

                {/* Primary Playback Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStop}
                    disabled={!isSpeaking && !isPaused && !isRecording}
                    className="p-3 rounded-xl bg-slate-200 text-slate-700 hover:bg-rose-100 hover:text-rose-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Stop speech"
                  >
                    <StopCircle className="w-5 h-5" />
                  </button>

                  {isSpeaking ? (
                    <button
                      onClick={handlePause}
                      className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-bold flex items-center gap-2 hover:bg-amber-600 transition-all shadow-md shadow-amber-500/20 active:scale-95"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                      <span>PAUSE</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePlay}
                      disabled={!text.trim()}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isPaused ? 'RESUME' : 'PLAY AUDIO'}</span>
                    </button>
                  )}

                  {/* High Crowd Magnet: Studio Audio Download Button */}
                  <button
                    onClick={() => setShowRecordModal(true)}
                    disabled={!text.trim() || isRecording}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <Download className="w-4 h-4 relative" />
                    <span className="relative">RECORD & DOWNLOAD</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Audio Card (Appears after recording) */}
            {recordedWavUrl && (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-sm">
                      <Music2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-emerald-950 text-base">Studio Audio Ready!</h3>
                        <span className="text-[11px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                          {recordedAudioSize}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-800">
                        Pristine lossless recording. Ready for CapCut, Premiere, DaVinci & mobile apps.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerDownload(recordedWavUrl, 'wav')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>DOWNLOAD WAV</span>
                    </button>
                    {recordedWebmUrl && (
                      <button
                        onClick={() => triggerDownload(recordedWebmUrl, 'webm')}
                        className="px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                        title="Download WebM format"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>WEBM</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline HTML5 Audio Player */}
                <div className="pt-2 border-t border-emerald-200/60">
                  <audio
                    ref={audioPreviewRef}
                    src={recordedWavUrl}
                    controls
                    className="w-full h-11 rounded-xl accent-emerald-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Voice Library & Audio Modulation (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              {/* Panel Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
                  <Volume2 className="w-5 h-5 text-indigo-600" />
                  Voice & Acoustic Engine
                </h3>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  {voices.length} Voices Detected
                </span>
              </div>

              {/* Language Filter Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  Filter by Accent / Region
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'en-us', label: 'US 🇺🇸' },
                    { id: 'en-uk', label: 'UK 🇬🇧' },
                    { id: 'in', label: 'India 🇮🇳' },
                    { id: 'es', label: 'Spanish 🇪🇸' },
                    { id: 'euro', label: 'Euro 🇪🇺' },
                    { id: 'other', label: 'More 🌐' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setLanguageFilter(tab.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        languageFilter === tab.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Search & Selector */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchVoiceQuery}
                    onChange={(e) => setSearchVoiceQuery(e.target.value)}
                    placeholder="Search voice name (e.g. Google, Natural, Siri)..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 bg-slate-50"
                  />
                </div>

                <div className="relative">
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full p-3 pr-10 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 appearance-none bg-slate-50 font-medium text-slate-800 text-sm cursor-pointer"
                  >
                    {filteredVoices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                    {filteredVoices.length === 0 && (
                      <option disabled value="">
                        No voices matching this filter
                      </option>
                    )}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Voice Mini Test Button */}
                <button
                  onClick={handleTestVoice}
                  disabled={isTestingVoice || !selectedVoice}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200/80"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>{isTestingVoice ? 'Speaking sample...' : 'Test Selected Voice (1-sec sample)'}</span>
                </button>
              </div>

              {/* Reading Speed with Quick Presets */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Reading Speed
                  </label>
                  <span className="font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 text-sm">
                    {rate.toFixed(2)}x
                  </span>
                </div>

                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />

                {/* Speed Shortcut Chips */}
                <div className="flex items-center justify-between gap-1 pt-1">
                  {[0.75, 1.0, 1.15, 1.25, 1.5, 2.0].map((s) => (
                    <button
                      key={s}
                      onClick={() => setRate(s)}
                      className={`text-[11px] px-2 py-1 rounded-lg font-bold transition-colors ${
                        rate === s
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Pitch */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                    Voice Pitch Modulation
                  </label>
                  <span className="font-bold text-indigo-600 text-xs">
                    {pitch < 0.9 ? 'Deep / Warm' : pitch > 1.1 ? 'High / Energetic' : 'Natural'} ({pitch.toFixed(1)})
                  </span>
                </div>

                <input
                  type="range"
                  min="0.6"
                  max="1.6"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>Deeper (0.6x)</span>
                  <span>Normal (1.0x)</span>
                  <span>Higher (1.6x)</span>
                </div>
              </div>

              {/* Volume Slider & Mute */}
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-indigo-600 transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Output Volume</span>
                    <span>{isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    disabled={isMuted}
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Reset Controls Button */}
              <button
                onClick={() => {
                  setRate(1.0);
                  setPitch(1.0);
                  setVolume(1.0);
                  setIsMuted(false);
                  toast.success('Settings reset to default!');
                }}
                className="w-full py-2.5 rounded-2xl border border-slate-200 text-slate-500 font-semibold text-xs hover:bg-slate-50 hover:text-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Reset Voice Parameters
              </button>
            </div>

            {/* Direct Download Benefits Pill */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-indigo-900 font-bold text-sm">
                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Why FileZenith Audio Studio?</span>
              </div>
              <ul className="space-y-2 text-xs text-indigo-900/80 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>100% Free Forever:</strong> Zero character limits, zero monthly API fees, zero credit cards.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Studio Lossless WAV:</strong> Universal 16-bit PCM audio export ready for CapCut, Premiere, & DaVinci.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>100% Client-Side Privacy:</strong> Your confidential scripts and books never upload to any server.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Audio Recording Modal Guidance */}
        {showRecordModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Studio Audio Recorder</h3>
                    <p className="text-xs text-slate-500">Record in lossless quality directly in your browser</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRecordModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-sm text-slate-700">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  How In-Browser Audio Capture Works:
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">Click Start Recording</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Your browser will ask which screen or tab you wish to share audio from.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-200">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-indigo-950 text-xs">
                        Select "This Tab" & check "Share tab audio"
                      </h4>
                      <p className="text-xs text-indigo-800 mt-0.5">
                        Pick this browser tab and toggle the <strong>"Also share tab audio"</strong> switch ON.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">Automatic Capture & Download</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Speech will play. When it finishes, FileZenith automatically stops and generates your downloadable{' '}
                        <strong>.WAV</strong> file!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowRecordModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={startRecordingSession}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Start Recording Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Creator Deep Dive & Educational Guide */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Creator Masterclass
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              How to Leverage Free AI Text to Speech for Content Creation & Monetization
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed">
              Discover how modern creators build faceless YouTube channels, viral TikTok reels, automated podcasts, and
              audiobooks with zero recording equipment and zero monthly SaaS costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                📱
              </div>
              <h3 className="font-bold text-slate-800 text-base">Viral TikTok & Shorts Pacing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Short-form video retention drops when narration is sluggish. Setting the reading speed between{' '}
                <strong>1.1x and 1.25x</strong> keeps audience retention above 75%, which signals the algorithm to push your
                video to the For You Page.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                🎬
              </div>
              <h3 className="font-bold text-slate-800 text-base">YouTube Monetization Safe</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                YouTube's partner program approves monetization for channels using synthetic voices as long as you provide
                original scripting, relevant B-roll footage, and dynamic editing rather than generic spam slides.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                🔒
              </div>
              <h3 className="font-bold text-slate-800 text-base">Client-Side Privacy Advantage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unlike cloud TTS vendors who store your text in their training datasets, FileZenith processes everything
                locally inside your browser. No private scripts, unreleased books, or business reports leave your device.
              </p>
            </div>
          </div>

          {/* Step by step workflow */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              3-Step Video Voiceover Workflow with CapCut / Premiere Pro
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Generate & Tune Script</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Paste your script, adjust speed to 1.1x, and test with your preferred regional voice accent.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Record & Download WAV</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Click Record & Download Audio. FileZenith automatically captures the pristine digital audio as a .WAV file.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Drop into Video Editor</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Import the WAV file into CapCut or Premiere. Auto-generate captions and match with B-roll.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extensive Creator FAQ Accordion */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Frequently Asked Questions</h3>
              <p className="text-xs text-slate-500">Everything you need to know about FileZenith Text to Speech & Audio Export</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                q: 'How do I download the speech as an audio file (.WAV / .WebM)?',
                a: 'Click the "RECORD & DOWNLOAD" button next to Play. In the browser dialog, select "This Tab" and ensure the "Share tab audio" toggle is checked. FileZenith will record the voice in real time and automatically render a pristine, lossless 16-bit PCM WAV audio file with zero quality degradation.'
              },
              {
                q: 'Is this text to speech generator truly unlimited with no character caps?',
                a: 'Yes, 100%! Unlike commercial SaaS tools like ElevenLabs or Murf that charge monthly subscriptions or cap text at 300 characters, FileZenith utilizes your device\'s native neural speech synthesis engine. There are zero artificial character caps, zero API tokens, and no account signup required.'
              },
              {
                q: 'Can I monetize YouTube Shorts, TikToks, and Reels using these voices?',
                a: 'Yes! YouTube\'s monetization policies explicitly permit synthetic speech provided the video offers original educational or entertainment value (e.g. customized script, relevant B-roll, captions, sound effects). Thousands of successful faceless YouTube channels use native TTS voices.'
              },
              {
                q: 'How do I get high-quality natural voices like Google Neural or Microsoft Natural?',
                a: 'The available voices depend on your operating system and browser. In Google Chrome and Microsoft Edge, you will see high-fidelity voices like "Google US English", "Microsoft Jenny Natural", and "Apple Samantha". Selecting these produces natural, expressive human-grade intonation.'
              },
              {
                q: 'Does FileZenith store or upload my text scripts to any remote server?',
                a: 'No. FileZenith operates under a strict privacy-first architecture. All text processing, speech generation, and audio recording take place entirely client-side inside your browser sandbox. Your scripts never touch our servers.'
              },
              {
                q: 'What is Prompter Mode with karaoke highlighting?',
                a: 'Prompter Mode illuminates each word in an energetic indigo badge in real time as it is spoken. This is ideal for practicing pronunciation, rehearsing voiceovers, or proofreading manuscripts by reading and listening simultaneously.'
              },
              {
                q: 'Can I use this on mobile phones (Android / iPhone)?',
                a: 'Yes! Playback and prompter highlighting work natively across iOS Safari and Android Chrome. For direct audio recording, desktop browsers (Chrome, Edge, Firefox) provide the cleanest tab audio capture.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200/80 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-slate-800 text-sm sm:text-base flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 sm:p-5 pt-0 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
