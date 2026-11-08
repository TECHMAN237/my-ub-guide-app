"""Write the new ChatMessageItem.tsx (taste-direction redesign)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'components', 'chat', 'ChatMessageItem.tsx'))

JSX = r'''import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
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

  // Synchronize playing state with global TTS service
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
      subtitle: message.sources && message.sources.length > 0 ? message.sources[0].title : 'Gemma AI Guidance',
      data: message,
    });
  };

  // Text-to-Speech Playback Controls
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
        onStart: () => { setIsPlaying(true); setIsPaused(false); },
        onEnd: () => { setIsPlaying(false); setIsPaused(false); },
        onPause: () => { setIsPlaying(false); setIsPaused(true); },
        onResume: () => { setIsPlaying(true); setIsPaused(false); },
        onError: () => { setIsPlaying(false); setIsPaused(false); },
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
      <div className="flex justify-end mb-4 animate-fadeIn">
        <div className="max-w-[85%] sm:max-w-[75%] bg-surface border border-ink rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs shadow-ink">
          <p className="text-sm font-normal leading-relaxed whitespace-pre-wrap text-ink">{message.text}</p>
          <div className="flex items-center justify-end gap-1 text-[10px] text-muted mt-1">
            {message.isVoiceInput && (
              <span className="flex items-center gap-0.5" title="Sent via voice input">
                <Mic className="w-2.5 h-2.5" />
              </span>
            )}
            <span>{message.timestamp}</span>
          </div>
        </div>
      </div>
    );
  }

  // Format simple markdown into styled elements (bullet points, bold, headings)
  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="font-bold text-sm text-ink mt-2 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="font-bold text-base text-ink mt-2 mb-1">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="font-bold text-base text-ink mt-2 mb-1">{line.replace('# ', '')}</h2>;
      }
      if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
        const itemContent = line.replace(/^[•\-\*]\s+/, '');
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-accent text-xs font-bold leading-none mt-1">●</span>
            <span className="text-sm text-ink leading-relaxed">{parseBold(itemContent)}</span>
          </div>
        );
      }
      if (/^\d+\.\s+/.test(line)) {
        const match = line.match(/^(\d+)\.\s+(.*)/);
        if (match) {
          return (
            <div key={idx} className="flex items-start gap-2 my-1 pl-1">
              <span className="text-accent text-xs font-bold w-4 shrink-0">{match[1]}.</span>
              <span className="text-sm text-ink leading-relaxed">{parseBold(match[2])}</span>
            </div>
          );
        }
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return <p key={idx} className="text-sm text-ink leading-relaxed my-0.5">{parseBold(line)}</p>;
    });
  };

  const parseBold = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex items-start gap-2.5 mb-5 animate-fadeIn">
      <RobotAvatar size="sm" className="mt-1" />
      <div className="flex-1 max-w-[90%] sm:max-w-[85%]">
        <div className="text-sm text-ink leading-relaxed">
          {renderFormattedText(message.text)}
        </div>

        {/* Sources Section */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-ink/10">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>{language === 'fr' ? 'Sources officielles' : 'Official Sources'}</span>
            </div>
            <div className="space-y-1.5">
              {message.sources.map((src, i) => (
                <button
                  key={i}
                  onClick={() => { if (src.url) navigate(src.url); }}
                  className="w-full flex items-center justify-between gap-2 p-2 rounded-lg bg-raised border border-ink/10 transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <div className="truncate">
                      <p className="text-xs font-medium text-ink group-hover:text-accent truncate">
                        {src.title}
                      </p>
                      <p className="text-[10px] text-muted">
                        {src.category} {src.lastUpdated ? `· ${src.lastUpdated}` : ''}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-accent shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Bar: Timestamp, Copy, Save */}
        <div className="mt-3 pt-2 flex items-center justify-between text-xs text-muted">
          <span className="text-[10px]">{message.timestamp}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              title="Copy answer"
              className="flex items-center gap-1 p-1 hover:text-accent transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleToggleSave}
              title="Save answer"
              className={`flex items-center gap-1 p-1 transition-colors cursor-pointer ${isSaved ? 'text-accent font-medium' : 'hover:text-accent'}`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-accent' : ''}`} />
              <span className="text-[11px]">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Follow-ups */}
      {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && onSelectFollowUp && (
        <div className="mt-2.5 flex flex-wrap gap-1.5 pl-1">
          {message.suggestedFollowUps.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onSelectFollowUp(q)}
              className="text-xs bg-accent-soft text-accent hover:bg-accent-edge border border-ink/10 rounded-full px-3 py-1 font-medium transition-colors text-left cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
