"""Write the new ChatComposer.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'components', 'chat', 'ChatComposer.tsx'))

JSX = r'''import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  Square,
  X,
  Loader2,
  AlertCircle,
  RotateCcw,
  Pause,
  Play,
  Volume2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { voiceService } from '../../services/voiceService';
import { Language } from '../../types';

export interface ChatComposerProps {
  onSend?: (message: string) => void | Promise<void>;
  onSendMessage?: (message: string) => void | Promise<void>;
  isLoading?: boolean;
  isSending?: boolean;
  placeholder?: string;
  error?: string | null;
  onRetry?: () => void | Promise<void>;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  onSend,
  onSendMessage,
  isLoading,
  isSending,
  placeholder,
  error,
  onRetry,
}) => {
  const { language } = useApp();
  const [text, setText] = useState('');
  const [composerState, setComposerState] = useState<'idle' | 'recording' | 'transcribing' | 'preview'>('idle');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [lastAudioBlob, setLastAudioBlob] = useState<Blob | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [isVoiceTranscribed, setIsVoiceTranscribed] = useState(false);

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeLoading = Boolean(isLoading || isSending);
  const sendHandler = onSendMessage || onSend;

  const isFr = language === 'fr';

  const defaultPlaceholder = isFr
    ? 'Posez votre question à My UB Guide ou appuyez sur le micro...'
    : 'Ask anything about your university or tap mic...';

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // Start voice recording workflow
  const handleStartRecording = async () => {
    setVoiceError(null);
    setAudioPreviewUrl(null);
    setLastAudioBlob(null);
    setIsVoiceTranscribed(false);

    try {
      setRecordingSeconds(0);
      setComposerState('recording');

      await voiceService.startRecording({
        language: (language as Language) || 'en',
        maxDurationSeconds: 120,
        onDurationTick: (secs) => {
          setRecordingSeconds(secs);
        },
      });
    } catch (err: any) {
      setComposerState('idle');
      setVoiceError(err.message || 'Unable to access microphone.');
    }
  };

  // Stop recording and transcribe
  const handleStopRecording = async () => {
    try {
      setComposerState('transcribing');
      const { blob, durationSeconds, previewUrl } = await voiceService.stopRecording();
      setAudioPreviewUrl(previewUrl);
      setLastAudioBlob(blob);

      // Transcribe via Google Speech-to-Text / Audio understanding
      try {
        const result = await voiceService.transcribeAudio(blob, (language as Language) || 'en', durationSeconds);
        if (result.text) {
          setText(result.text);
          setIsVoiceTranscribed(true);
        }
      } catch (err: any) {
        setVoiceError(
          isFr
            ? "Impossible de transcrire automatiquement l'audio. Vous pouvez saisir votre question par texte."
            : "Automatic transcription unavailable. You can review your audio or type your question."
        );
      }
      setComposerState('idle');
      // Focus input so user can immediately review/edit
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err: any) {
      setComposerState('idle');
      setVoiceError(err.message || 'Failed to process voice recording.');
    }
  };

  // Cancel recording and reset
  const handleCancelRecording = () => {
    voiceService.cancelRecording();
    setComposerState('idle');
    setRecordingSeconds(0);
  };

  // Toggle preview playback
  const handleTogglePreviewAudio = () => {
    if (!audioPreviewUrl) return;

    if (!previewAudioRef.current) {
      previewAudioRef.current = new Audio(audioPreviewUrl);
      previewAudioRef.current.onended = () => setIsPreviewPlaying(false);
      previewAudioRef.current.onerror = () => setIsPreviewPlaying(false);
    }

    if (isPreviewPlaying) {
      previewAudioRef.current.pause();
      setIsPreviewPlaying(false);
    } else {
      previewAudioRef.current.play().then(() => {
        setIsPreviewPlaying(true);
      }).catch(() => {
        setIsPreviewPlaying(false);
      });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      voiceService.cleanup();
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim() || activeLoading || !sendHandler) return;
    sendHandler(text.trim());
    setText('');
    setAudioPreviewUrl(null);
    setLastAudioBlob(null);
    setIsVoiceTranscribed(false);
    setVoiceError(null);
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      {/* Error / Warning Banners */}
      {(error || voiceError) && (
        <div className="bg-surface border border-ink/10 text-ink px-3.5 py-2 rounded-xl text-xs flex items-center justify-between shadow-2xs animate-fadeIn">
          <div className="flex items-center gap-1.5 truncate mr-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-accent" />
            <span className="truncate">{voiceError || error}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {voiceError && (
              <button
                type="button"
                onClick={() => setVoiceError(null)}
                className="text-muted hover:text-ink px-1 py-0.5 text-[11px] hover:bg-raised rounded transition-colors"
              >
                Dismiss
              </button>
            )}
            {error && onRetry && (
              <button
                type="button"
                onClick={() => onRetry()}
                className="flex items-center gap-1 px-2.5 py-1 bg-ink text-white font-medium rounded-lg hover:bg-[#141414] transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Voice Review / Transcribed Indicator */}
      {isVoiceTranscribed && (
        <div className="flex items-center justify-between bg-accent-soft border border-ink/10 px-3 py-1.5 rounded-xl text-xs text-accent">
          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-accent" />
            <span>{isFr ? 'Transcrit depuis la voix. Vous pouvez modifier avant d’envoyer :' : 'Transcribed from voice. You may edit before sending:'}</span>
          </div>
          {audioPreviewUrl && (
            <button
              type="button"
              onClick={handleTogglePreviewAudio}
              className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-accent-edge underline cursor-pointer"
            >
              {isPreviewPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPreviewPlaying ? (isFr ? 'Pause' : 'Pause') : (isFr ? 'Écouter l’audio' : 'Listen')}</span>
            </button>
          )}
        </div>
      )}

      {/* Active Recording State UI */}
      {composerState === 'recording' && (
        <div className="bg-[#F8FAFC] border border-ink/10 rounded-2xl p-2.5 shadow-sm flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-accent animate-ping shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-ink">
                {isFr ? 'Enregistrement en cours...' : 'Listening to your voice...'}
              </span>
              <span className="text-[11px] font-mono text-accent font-semibold">
                {formatTime(recordingSeconds)} / 02:00
              </span>
            </div>
          </div>

          {/* Soundwave animation bars */}
          <div className="flex items-center gap-1 h-5 px-2">
            <div className="w-1 rounded-full bg-accent/60 animate-pulse h-3" />
            <div className="w-1 rounded-full bg-accent/60 animate-pulse h-5 delay-75" />
            <div className="w-1 rounded-full bg-accent/60 animate-pulse h-2 delay-150" />
            <div className="w-1 rounded-full bg-accent/60 animate-pulse h-4 delay-100" />
            <div className="w-1 rounded-full bg-accent/60 animate-pulse h-3 delay-200" />
          </div>

          {/* Recording Action Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCancelRecording}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-ink hover:bg-[#F8FAFC] transition-colors"
              title={isFr ? 'Annuler' : 'Cancel recording'}
              aria-label="Cancel recording"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleStopRecording}
              className="px-3 py-1.5 bg-ink text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#141414] shadow-md shadow-ink active:scale-95 transition-all"
              title={isFr ? 'Terminer et transcrire' : 'Done speaking'}
              aria-label="Done speaking"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>{isFr ? 'Terminer' : 'Done'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Transcribing State UI */}
      {composerState === 'transcribing' && (
        <div className="bg-[#F8FAFC] border border-ink/10 rounded-2xl p-3 flex items-center justify-center gap-2.5 text-xs text-ink animate-fadeIn">
          <Loader2 className="w-4 h-4 animate-spin text-accent" />
          <span className="font-medium">
            {isFr
              ? 'Transcription audio avec Google Speech en cours...'
              : 'Transcribing speech with Google Speech-to-Text...'}
          </span>
        </div>
      )}

      {/* Main Text & Mic Input UI (visible when not actively in recording/transcribing banner) */}
      {composerState === 'idle' && (
        <div className="bg-surface border border-ink/10 rounded-2xl p-1.5 shadow-sm focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-soft transition-all">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={activeLoading}
              placeholder={placeholder || defaultPlaceholder}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-ink placeholder-muted focus:outline-none"
            />

            {/* Real Microphone Recording Button */}
            <button
              type="button"
              onClick={handleStartRecording}
              disabled={activeLoading}
              aria-label={isFr ? 'Poser une question à la voix' : 'Speak question with voice'}
              title={isFr ? 'Parler au micro' : 'Speak with microphone'}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-accent hover:bg-[#F8FAFC] transition-colors shrink-0 active:scale-95 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-muted hover:text-accent" />
            </button>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!text.trim() || activeLoading}
              aria-label="Send message"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                text.trim() && !activeLoading
                  ? 'bg-accent text-white hover:bg-accent-edge active:scale-95 shadow-md shadow-accent/20'
                  : 'bg-[#F8FAFC] text-muted cursor-not-allowed'
              }`}
            >
              {activeLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
