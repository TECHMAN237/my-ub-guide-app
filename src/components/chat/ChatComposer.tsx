import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square, X, Loader2, RotateCcw, Pause, Play, Volume2 } from 'lucide-react';
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
  const [composerState, setComposerState] = useState<'idle' | 'recording' | 'transcribing'>('idle');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [isVoiceTranscribed, setIsVoiceTranscribed] = useState(false);

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeLoading = Boolean(isLoading || isSending);
  const sendHandler = onSendMessage || onSend;

  const isFr = language === 'fr';

  const defaultPlaceholder = isFr
    ? 'Posez votre question sur l’université…'
    : 'Ask anything about the university…';

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    setVoiceError(null);
    setAudioPreviewUrl(null);
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
      setVoiceError(err.message || 'Unable to access the microphone.');
    }
  };

  const handleStopRecording = async () => {
    try {
      setComposerState('transcribing');
      const { blob, durationSeconds, previewUrl } = await voiceService.stopRecording();
      setAudioPreviewUrl(previewUrl);

      try {
        const result = await voiceService.transcribeAudio(
          blob,
          (language as Language) || 'en',
          durationSeconds
        );
        if (result.text) {
          setText(result.text);
          setIsVoiceTranscribed(true);
        }
      } catch {
        setVoiceError(
          isFr
            ? "La transcription automatique est indisponible. Vous pouvez saisir votre question par texte."
            : 'Automatic transcription is unavailable. You can type your question instead.'
        );
      }
      setComposerState('idle');
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err: any) {
      setComposerState('idle');
      setVoiceError(err.message || 'The recording could not be processed.');
    }
  };

  const handleCancelRecording = () => {
    voiceService.cancelRecording();
    setComposerState('idle');
    setRecordingSeconds(0);
  };

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
      previewAudioRef.current
        .play()
        .then(() => setIsPreviewPlaying(true))
        .catch(() => setIsPreviewPlaying(false));
    }
  };

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
    setIsVoiceTranscribed(false);
    setVoiceError(null);
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
  };

  return (
    <div className="w-full">
      {(error || voiceError) && (
        <div className="mb-2.5 flex items-start justify-between gap-3 rounded-[10px] bg-raised px-4 py-3">
          <p className="text-[14px] leading-relaxed text-ink">{voiceError || error}</p>
          <div className="flex shrink-0 items-center gap-1">
            {voiceError && (
              <button
                type="button"
                onClick={() => setVoiceError(null)}
                className="min-h-[32px] px-2 text-[14px] font-medium text-muted transition-colors hover:text-ink"
              >
                {isFr ? 'Fermer' : 'Dismiss'}
              </button>
            )}
            {error && onRetry && (
              <button
                type="button"
                onClick={() => onRetry()}
                className="inline-flex min-h-[32px] items-center gap-1.5 px-2 text-[14px] font-semibold text-accent transition-colors hover:text-accent-edge"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                {isFr ? 'Réessayer' : 'Retry'}
              </button>
            )}
          </div>
        </div>
      )}

      {isVoiceTranscribed && (
        <div className="mb-2.5 flex items-center justify-between gap-3 text-[14px] text-accent">
          <span className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            {isFr
              ? 'Transcrit depuis la voix. Modifiez si besoin avant d’envoyer.'
              : 'Transcribed from voice. Edit it if needed before sending.'}
          </span>
          {audioPreviewUrl && (
            <button
              type="button"
              onClick={handleTogglePreviewAudio}
              className="inline-flex min-h-[32px] shrink-0 items-center gap-1.5 font-medium underline underline-offset-2"
            >
              {isPreviewPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isPreviewPlaying ? (isFr ? 'Pause' : 'Pause') : isFr ? 'Écouter' : 'Listen'}
            </button>
          )}
        </div>
      )}

      {composerState === 'recording' && (
        <div className="flex items-center justify-between gap-3 rounded-[10px] border border-rule bg-surface px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-negative" />
            <div className="min-w-0">
              <p className="text-[16px] font-medium leading-tight text-ink">
                {isFr ? 'Enregistrement en cours' : 'Recording'}
              </p>
              <p className="tnum text-[14px] leading-tight text-muted">
                {formatTime(recordingSeconds)} / 02:00
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCancelRecording}
              className="flex h-11 w-11 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-ink"
              aria-label={isFr ? 'Annuler l’enregistrement' : 'Cancel recording'}
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleStopRecording}
              className="btn btn-primary btn-sm"
              aria-label={isFr ? 'Terminer et transcrire' : 'Finish and transcribe'}
            >
              <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              {isFr ? 'Terminer' : 'Done'}
            </button>
          </div>
        </div>
      )}

      {composerState === 'transcribing' && (
        <div className="flex items-center gap-2.5 rounded-[10px] border border-rule bg-surface px-4 py-4 text-[14px] text-muted">
          <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden="true" />
          {isFr ? 'Transcription de l’audio…' : 'Transcribing your recording…'}
        </div>
      )}

      {composerState === 'idle' && (
        <div className="chat-composer flex items-center gap-1 rounded-[10px] border border-rule bg-surface p-1.5 transition-colors focus-within:border-accent">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={activeLoading}
            placeholder={placeholder || defaultPlaceholder}
            aria-label={isFr ? 'Votre question' : 'Your question'}
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-[16px] text-ink placeholder:text-faint focus:outline-none disabled:opacity-60"
          />

          <button
            type="button"
            onClick={handleStartRecording}
            disabled={activeLoading}
            aria-label={isFr ? 'Poser une question à la voix' : 'Ask by voice'}
            title={isFr ? 'Parler au micro' : 'Speak your question'}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-ink disabled:opacity-50"
          >
            <Mic className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!text.trim() || activeLoading}
            aria-label={isFr ? 'Envoyer le message' : 'Send message'}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] transition-colors ${
              text.trim() && !activeLoading
                ? 'bg-accent text-white hover:bg-accent-edge'
                : 'bg-raised text-faint'
            }`}
          >
            {activeLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
