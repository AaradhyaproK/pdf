'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Download,
  RefreshCcw,
  Activity,
  FileText,
  Sparkles,
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
  HelpCircle,
  Video,
  Smartphone,
  Mic,
  Wind,
  BookOpen,
  Briefcase,
  ShieldCheck,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface PresetScript {
  id: string;
  icon: React.ElementType;
  title: string;
  badge: string;
  rate: number;
  pitch: number;
  text: string;
}

const PRESETS: PresetScript[] = [
  {
    id: 'youtube',
    icon: Video,
    title: 'YouTube Intro',
    badge: 'High Retention',
    rate: 1.05,
    pitch: 1.0,
    text: "Welcome back to the channel! In today's video, we are breaking down the exact step-by-step blueprint to scale your digital presence from zero to full-time income in 2026. Make sure to hit subscribe, ring the bell, and let's dive right in!"
  },
  {
    id: 'reels',
    icon: Smartphone,
    title: 'Shorts & Reels Hook',
    badge: 'Viral Pacing',
    rate: 1.15,
    pitch: 1.05,
    text: "Stop scrolling! If you are still doing this manually in 2026, here is the secret high-speed workflow top digital creators use to automate their entire production in under sixty seconds."
  },
  {
    id: 'podcast',
    icon: Mic,
    title: 'Podcast Narration',
    badge: 'Conversational',
    rate: 1.0,
    pitch: 0.95,
    text: "Welcome to The Zenith Dialogue, episode 48. Today, we sit down with industry architects to explore how autonomous artificial intelligence and privacy-first web platforms are reshaping the creative economy."
  },
  {
    id: 'meditation',
    icon: Wind,
    title: 'Meditation & Calm',
    badge: 'Relaxation',
    rate: 0.8,
    pitch: 0.9,
    text: "Take a slow, deep breath in through your nose... hold it for three gentle seconds... and slowly exhale through your mouth. Let go of all tension and allow your mind to settle peacefully in this present moment."
  },
  {
    id: 'audiobook',
    icon: BookOpen,
    title: 'Audiobook Chapter',
    badge: 'Storytelling',
    rate: 0.95,
    pitch: 1.0,
    text: "Chapter One. The morning mist hung low over the quiet cobblestone alleys of the mountain village. In the distance, an ancient cathedral bell resonated across the valley, announcing the arrival of an unexpected traveler."
  },
  {
    id: 'business',
    icon: Briefcase,
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
  view.setUint32(16, 16, true);
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
  const [isProcessingAudio, setIsProcessingAudio] = useState<boolean>(false);
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

    if (isRecording) {
      stopRecordingSession();
    }
  };

  // Test current selected voice
  const handleTestVoice = () => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const voice = voices.find((v) => v.name === selectedVoice);
    const sampleText = `Hello! This is ${voice?.name || 'your selected voice'} ready to speak your text.`;
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
    toast.success(`Loaded "${preset.title}" template.`);
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
        stream.getTracks().forEach((track) => track.stop());
        toast.error('No audio track selected! Please ensure "Share tab audio" is enabled in the browser dialog.', {
          duration: 6000
        });
        return;
      }

      mediaStreamRef.current = stream;
      recordedChunksRef.current = [];

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

            const sizeKb = (wavBlob.size / 1024).toFixed(1);
            setRecordedAudioSize(`${sizeKb} KB (WAV)`);

            // Automatic download trigger
            triggerDownload(wavUrl, 'wav');
          } catch (wavErr) {
            console.warn('WAV conversion fallback to WebM:', wavErr);
            setRecordedWavUrl(webmUrl);
            const sizeKb = (rawBlob.size / 1024).toFixed(1);
            setRecordedAudioSize(`${sizeKb} KB (WebM)`);
            triggerDownload(webmUrl, 'webm');
          }

          toast.success('Audio generated and downloaded successfully!');
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch (err) {
          console.error('Audio processing failed:', err);
          toast.error('Failed to process recorded audio.');
        } finally {
          setIsProcessingAudio(false);
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
          }
        }
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordingDuration(0);

      recordTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

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
          setTimeout(() => {
            stopRecordingSession();
          }, 400);
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
      toast.info('Recording cancelled.');
    }
  };

  // Download Trigger
  const triggerDownload = (url: string, extension: string) => {
    const a = document.createElement('a');
    a.href = url;
    const cleanName = text.slice(0, 24).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'speech_audio';
    a.download = `${cleanName}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy text to clipboard
  const copyText = () => {
    navigator.clipboard.writeText(text);
    toast.success('Script copied to clipboard.');
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
      <div className="absolute inset-0 p-5 overflow-y-auto bg-slate-900/95 text-slate-100 text-base leading-relaxed rounded-2xl select-none z-10 backdrop-blur-md">
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-700/60">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
            <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" />
            <span>Prompter Tracking</span>
          </div>
          <button
            onClick={() => setPrompterMode(false)}
            className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded-lg bg-slate-800 transition-colors"
          >
            Editor View
          </button>
        </div>
        <p className="font-normal text-slate-300">
          <span>{before}</span>
          <span className="bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded shadow inline-block mx-0.5">
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
      title="Free Text to Speech Online with Audio Download"
      subtitle="Convert text to natural human speech with direct audio export (WAV/WebM). Zero character caps, global voice accents, teleprompter tracking, and speed modulation."
      badgeText="Audio Download"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Clean Quick-Start Templates Bar (No Emojis, No Heavy Dark Box) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Voiceover Script Presets</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Click to load script with calibrated speed</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {PRESETS.map((p) => {
              const IconComp = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  className="flex flex-col items-start p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all text-left group"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="p-1 rounded-md bg-white border border-slate-200 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <IconComp className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                      {p.rate}x
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {p.title}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">{p.badge}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Script Editor & Controls (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
              {/* Editor Top Bar with Metrics & Tools */}
              <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-slate-800 text-sm">Script Editor</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                    {metrics.words} Words
                  </span>
                  <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-lg hidden sm:inline">
                    {metrics.chars} Chars
                  </span>
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~{metrics.durationFormatted}
                  </span>

                  <div className="h-4 w-[1px] bg-slate-300 mx-1 hidden sm:block" />

                  <button
                    onClick={() => setText('')}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs flex items-center gap-1"
                    title="Clear text"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                  <button
                    onClick={copyText}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors text-xs flex items-center gap-1"
                    title="Copy text"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copy</span>
                  </button>
                </div>
              </div>

              {/* Textarea Area */}
              <div className="relative flex-1 min-h-[260px] sm:min-h-[290px]">
                {prompterMode && renderHighlightedScript()}

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste your text here... Zero character caps. Perfect for video voiceovers, audiobooks, presentations, and language learning."
                  className="w-full h-full min-h-[260px] sm:min-h-[290px] p-5 focus:outline-none resize-none text-slate-800 text-base leading-relaxed placeholder:text-slate-300 font-normal bg-transparent"
                />
              </div>

              {/* Animated Equalizer Wave (Active during playback/recording) */}
              {(isSpeaking || isRecording) && (
                <div className="px-5 py-2.5 bg-indigo-50/80 border-t border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold">
                    <Activity className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                    <span>
                      {isRecording ? `Recording Audio (${formatSeconds(recordingDuration)})` : 'Playing Speech...'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[10, 20, 14, 28, 16, 24, 12, 26, 18, 14, 22, 12, 28, 16, 10].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-indigo-600 rounded-full animate-pulse"
                        style={{
                          height: `${h}px`,
                          animationDelay: `${i * 70}ms`,
                          animationDuration: '550ms'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Main Action Bar (Always Visible, Well-Spaced, Never Cut Off) */}
              <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200/90 flex flex-wrap items-center justify-between gap-3">
                {/* Prompter Toggle */}
                <button
                  onClick={() => setPrompterMode(!prompterMode)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    prompterMode
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Prompter View</span>
                </button>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleStop}
                    disabled={!isSpeaking && !isPaused && !isRecording}
                    className="p-2.5 rounded-xl bg-slate-200 text-slate-700 hover:bg-rose-100 hover:text-rose-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Stop playback"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>

                  {/* Play / Pause Button */}
                  {isSpeaking ? (
                    <button
                      onClick={handlePause}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePlay}
                      disabled={!text.trim()}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isPaused ? 'Resume' : 'Play Audio'}</span>
                    </button>
                  )}

                  {/* Proper Download Button */}
                  {isRecording ? (
                    <button
                      onClick={stopRecordingSession}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center gap-2 shadow-md animate-pulse transition-all active:scale-95"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                      <span>Stop & Save Audio</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowRecordModal(true)}
                      disabled={!text.trim() || isProcessingAudio}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Audio</span>
                      <span className="text-[10px] bg-emerald-700/60 px-1.5 py-0.5 rounded font-extrabold uppercase">
                        WAV
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Generated Audio Card (Appears after recording) */}
            {recordedWavUrl && (
              <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
                      <Music2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-emerald-950 text-sm">Audio File Ready</h4>
                        <span className="text-[11px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">
                          {recordedAudioSize}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-800">
                        Universal 16-bit PCM WAV. Compatible with CapCut, Premiere, DaVinci & phone editors.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerDownload(recordedWavUrl, 'wav')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save WAV</span>
                    </button>
                    {recordedWebmUrl && (
                      <button
                        onClick={() => triggerDownload(recordedWebmUrl, 'webm')}
                        className="px-3 py-2 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs flex items-center gap-1 transition-colors"
                        title="Download WebM format"
                      >
                        <Download className="w-3 h-3" />
                        <span>WebM</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200">
                  <audio
                    ref={audioPreviewRef}
                    src={recordedWavUrl}
                    controls
                    className="w-full h-10 rounded-lg accent-emerald-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Voice & Audio Settings (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  Voice & Accent Engine
                </h3>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {voices.length} Voices Detected
                </span>
              </div>

              {/* Accent / Region Filter Tabs (No Emojis) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400" />
                  Filter by Accent / Region
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'en-us', label: 'US English' },
                    { id: 'en-uk', label: 'UK English' },
                    { id: 'in', label: 'Indian (Hindi / en-IN)' },
                    { id: 'es', label: 'Spanish' },
                    { id: 'euro', label: 'European' },
                    { id: 'other', label: 'Global' }
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
                    className="w-full p-2.5 pr-8 rounded-xl border border-slate-200 focus:border-indigo-500 appearance-none bg-slate-50 font-medium text-slate-800 text-xs cursor-pointer"
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
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button
                  onClick={handleTestVoice}
                  disabled={isTestingVoice || !selectedVoice}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-200/80"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>{isTestingVoice ? 'Speaking sample...' : 'Test Selected Voice (1-sec sample)'}</span>
                </button>
              </div>

              {/* Speed / Rate */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Reading Speed
                  </label>
                  <span className="font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-xs">
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
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />

                <div className="flex items-center justify-between gap-1 pt-0.5">
                  {[0.75, 1.0, 1.15, 1.25, 1.5, 2.0].map((s) => (
                    <button
                      key={s}
                      onClick={() => setRate(s)}
                      className={`text-[11px] px-2 py-0.5 rounded font-bold transition-colors ${
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

              {/* Pitch */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                    Pitch Modulation
                  </label>
                  <span className="font-bold text-indigo-600 text-xs">
                    {pitch < 0.9 ? 'Deeper' : pitch > 1.1 ? 'Higher' : 'Balanced'} ({pitch.toFixed(1)})
                  </span>
                </div>

                <input
                  type="range"
                  min="0.6"
                  max="1.6"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Volume & Mute */}
              <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Volume</span>
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

              {/* Reset */}
              <button
                onClick={() => {
                  setRate(1.0);
                  setPitch(1.0);
                  setVolume(1.0);
                  setIsMuted(false);
                  toast.success('Settings reset.');
                }}
                className="w-full py-2 rounded-xl border border-slate-200 text-slate-500 font-semibold text-xs hover:bg-slate-50 hover:text-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Reset Parameters
              </button>
            </div>

            {/* Quick Benefits */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-4 space-y-2.5">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Private & Unlimited</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Zero character limits or word caps.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Direct 16-bit PCM WAV audio download.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>100% client-side privacy. No remote logging.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal: Audio Download Instructions */}
        {showRecordModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Export Audio (.WAV)</h3>
                    <p className="text-xs text-slate-500">Record high-definition audio directly in browser</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRecordModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-700">Follow these 2 steps in the browser prompt:</p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Select <strong>"This Tab"</strong> (or Current Tab).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Toggle <strong>"Share tab audio"</strong> to ON.</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Speech will play and capture automatically. Once finished, your <strong>.WAV</strong> file will download instantly.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowRecordModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={startRecordingSession}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Start & Download</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Creator Guide Section (No Emojis, Clean Layout) */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              Creator Workflow
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              Using Text to Speech for Video Production & Monetization
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Build faceless YouTube channels, high-retention Shorts, and automated audiobooks with zero external microphone equipment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Short-Form Pacing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Short-form video retention drops when narration is slow. Setting the reading speed between{' '}
                <strong>1.1x and 1.25x</strong> maintains engagement above 75%, helping satisfy algorithmic benchmarks.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Monetization Compliance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                YouTube approves monetization for synthetic voices when accompanied by original scripting, relevant
                B-roll footage, and dynamic editing rather than static slides.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Local Client-Side Privacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unlike cloud TTS vendors that train on user inputs, FileZenith processes everything locally inside your
                browser sandbox. No manuscripts or proprietary notes leave your machine.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h3>
              <p className="text-xs text-slate-500">Audio export, character limits, and commercial usage</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            {[
              {
                q: 'How do I download the speech as an audio file (.WAV)?',
                a: 'Click "Download Audio". In the browser dialog, pick "This Tab" and enable "Share tab audio". FileZenith records the voice in real time and automatically exports a lossless 16-bit PCM WAV audio file directly to your downloads folder.'
              },
              {
                q: 'Are there any character limits or subscription fees?',
                a: 'No. FileZenith utilizes your device native neural speech engine. There are zero artificial character caps, zero monthly subscriptions, and no sign-up required.'
              },
              {
                q: 'Can I monetize YouTube Shorts, TikToks, and Reels using these voices?',
                a: 'Yes. YouTube monetization policies permit synthetic voiceovers as long as the video provides original value (e.g. customized scripts, captions, and curated footage).'
              },
              {
                q: 'How do I access natural neural voices like Google or Microsoft Natural?',
                a: 'Voices are powered by your operating system and browser. In Google Chrome and Microsoft Edge, you will see natural voices like "Google US English" and "Microsoft Natural" in the voice dropdown.'
              },
              {
                q: 'Does FileZenith upload or store my text on any remote server?',
                a: 'No. All speech synthesis and audio recording take place entirely client-side inside your browser sandbox. Your private notes and scripts never leave your device.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200/80 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-slate-800 text-xs sm:text-sm flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-slate-600 text-xs leading-relaxed border-t border-slate-100 bg-slate-50/50">
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
