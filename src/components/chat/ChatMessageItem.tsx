import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Bookmark,
  ExternalLink,
  Volume2,
  Square,
  Play,
  Pause,
  Mic,
} from 'lucide-react';
import { ChatMessage, Language } from '../../types';
import { RobotAvatar } from '../common/RobotAvatar';
import { useApp } from '../../context/AppContext';
import { ttsService } from '../../services/ttsService';

interface ChatMessageItemProps {
  message: ChatMessage;
  onSelectFollowUp?: (question: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, onSelectFollowUp }) => {
  const { toggleSaveItem, isItemSaved, navigate, language } = useApp();
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const isUser = message.sender === 'user';
  const isSaved = isItemSaved(message.text.substring(0, 40));
  const isFr = language === 'fr';

  useEffect(() => {
    const checkStatus = () => {
      const activeId = ttsService.getActiveMessageId();
      if (activeId === message.id) {
        setIsPlaying(!ttsService.isCurrentlyPaused(message.id));
        setIsPaused(ttsService.isCurrentlyPaused(message.id));
      } else {
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    const interval = setInterval(checkStatus, 300);
    return () => clearInterval(interval);
  }, [message.id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSave = () => {
    toggleSaveItem({
      type: 'answer',
      title: message.text.substring(0, 45) + '...',
      subtitle:
        message.sources && message.sources.length > 0
          ? message.sources[0].title
          : 'UB Compass answer',
      data: message,
    });
  };

  const handleTogglePlaySpeech = () => {
    if (isPlaying) {
      ttsService.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else if (isPaused) {
      ttsService.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      ttsService.speak(message.text, {
        messageId: message.id,
        language: (language as Language) || 'en',
        onStart: () => {
          setIsPlaying(true);
          setIsPaused(false);
        },
        onEnd: () => {
          setIsPlaying(false);
          setIsPaused(false);
        },
        onPause: () => {
          setIsPlaying(false);
          setIsPaused(true);
        },
        onResume: () => {
          setIsPlaying(true);
          setIsPaused(false);
        },
        onError: () => {
          setIsPlaying(false);
          setIsPaused(false);
        },
      });
    }
  };

  const handleStopSpeech = () => {
    ttsService.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (isUser) {
    return (
      <div className="mb-4 flex justify-end">
        <div className="max-w-[85%] rounded-[10px] bg-raised px-4 py-3 sm:max-w-[75%]">
          <p className="whitespace-pre-wrap text-[16px] leading-relaxed text-ink">{message.text}</p>
          <div className="mt-1.5 flex items-center justify-end gap-1.5 text-[14px] text-muted">
            {message.isVoiceInput && (
              <span title={isFr ? 'Envoyé par la voix' : 'Sent by voice'}>
                <Mic className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            )}
            <span>{message.timestamp}</span>
          </div>
        </div>
      </div>
    );
  }

  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="mb-1 mt-3 text-[16px] font-semibold text-ink">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="mb-1 mt-3 text-[18px] font-semibold text-ink">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h3 key={idx} className="mb-1 mt-3 text-[18px] font-semibold text-ink">
            {line.replace('# ', '')}
          </h3>
        );
      }
      if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
        const itemContent = line.replace(/^[•\-\*]\s+/, '');
        return (
          <div key={idx} className="my-1 flex items-start gap-2.5">
            <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-muted" aria-hidden="true" />
            <span className="text-[16px] leading-relaxed text-ink">{parseBold(itemContent)}</span>
          </div>
        );
      }
      if (/^\d+\.\s+/.test(line)) {
        const match = line.match(/^(\d+)\.\s+(.*)/);
        if (match) {
          return (
            <div key={idx} className="my-1 flex items-start gap-2.5">
              <span className="tnum w-5 shrink-0 text-[16px] leading-relaxed text-muted">
                {match[1]}.
              </span>
              <span className="text-[16px] leading-relaxed text-ink">{parseBold(match[2])}</span>
            </div>
          );
        }
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="my-0.5 text-[16px] leading-relaxed text-ink">
          {parseBold(line)}
        </p>
      );
    });
  };

  const parseBold = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-ink">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="mb-5 flex items-start gap-3">
      <RobotAvatar size="sm" />
      <div className="min-w-0 flex-1">
        <div className="rounded-[10px] bg-surface px-4 py-4 sm:px-5">
          <div className="text-ink">{renderFormattedText(message.text)}</div>

          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 border-t border-rule pt-3">
              <p className="mb-1 text-[14px] font-medium text-muted">
                {isFr ? 'Sources officielles' : 'Official sources'}
              </p>
              <div>
                {message.sources.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (src.url) navigate(src.url);
                    }}
                    className="row-link w-full min-h-[52px] text-left"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[16px] font-medium text-ink">
                        {src.title}
                      </span>
                      <span className="block text-[14px] text-muted">
                        {src.category} {src.lastUpdated ? `· ${src.lastUpdated}` : ''}
                      </span>
                    </span>
                    {src.url && (
                      <ExternalLink className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[14px] text-muted">
          <span>{message.timestamp}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleTogglePlaySpeech}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-[10px] px-2 transition-colors hover:bg-raised hover:text-ink"
              aria-label={
                isPlaying
                  ? isFr
                    ? 'Mettre la réponse en pause'
                    : 'Pause reading the answer'
                  : isFr
                    ? 'Lire la réponse à voix haute'
                    : 'Read the answer aloud'
              }
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isPlaying ? (isFr ? 'Pause' : 'Pause') : isFr ? 'Lire' : 'Listen'}</span>
            </button>
            {(isPlaying || isPaused) && (
              <button
                type="button"
                onClick={handleStopSpeech}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-[10px] px-2 transition-colors hover:bg-raised hover:text-ink"
                aria-label={isFr ? 'Arrêter la lecture' : 'Stop reading'}
              >
                <Square className="h-3.5 w-3.5 fill-current" />
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-[10px] px-2 transition-colors hover:bg-raised hover:text-ink"
              aria-label={isFr ? 'Copier la réponse' : 'Copy the answer'}
            >
              {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? (isFr ? 'Copié' : 'Copied') : isFr ? 'Copier' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={handleToggleSave}
              className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-[10px] px-2 transition-colors hover:bg-raised ${
                isSaved ? 'font-medium text-accent' : 'hover:text-ink'
              }`}
              aria-label={isFr ? 'Enregistrer la réponse' : 'Save the answer'}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? (isFr ? 'Enregistré' : 'Saved') : isFr ? 'Enregistrer' : 'Save'}</span>
            </button>
          </div>
        </div>

        {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && onSelectFollowUp && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {message.suggestedFollowUps.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectFollowUp(q)}
                className="min-h-[36px] text-left text-[14px] font-medium text-accent underline-offset-2 transition-colors hover:underline"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
