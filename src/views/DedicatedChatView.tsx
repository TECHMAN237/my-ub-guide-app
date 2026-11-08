import React, { useRef, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, History } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessageItem } from '../components/chat/ChatMessageItem';
import { ChatComposer } from '../components/chat/ChatComposer';
import { RobotAvatar } from '../components/common/RobotAvatar';

export const DedicatedChatView: React.FC = () => {
  const {
    activeConversation,
    createNewConversation,
    deleteConversation,
    sendMessage,
    isSendingMessage,
    chatError,
    retryLastMessage,
    navigateTo,
    language,
  } = useApp();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFr = language === 'fr';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [activeConversation?.messages, isSendingMessage]);

  const handleFollowUp = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[760px] flex-col px-5 pb-28 sm:px-8 md:pb-10">
      <div className="flex items-center justify-between gap-4 border-b border-rule py-3">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() => navigateTo('/home')}
            className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-ink"
            aria-label={isFr ? 'Retour à l’accueil' : 'Back to home'}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="min-w-0 truncate text-[18px] font-semibold text-ink">
            {activeConversation?.title || (isFr ? 'Discussion' : 'Chat')}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => navigateTo('/history')}
            className="flex h-11 w-11 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-ink"
            aria-label={isFr ? 'Historique des discussions' : 'Conversation history'}
          >
            <History className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={createNewConversation}
            className="flex h-11 items-center gap-1.5 rounded-[10px] px-3 text-[14px] font-medium text-ink transition-colors hover:bg-raised"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{isFr ? 'Nouveau' : 'New'}</span>
          </button>

          {activeConversation && (
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    isFr ? 'Supprimer cette discussion ?' : 'Delete this conversation?'
                  )
                ) {
                  deleteConversation(activeConversation.id);
                  navigateTo('/home');
                }
              }}
              className="flex h-11 w-11 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-negative"
              aria-label={isFr ? 'Supprimer la discussion' : 'Delete conversation'}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 py-5">
        {(!activeConversation || activeConversation.messages.length === 0) && (
          <div className="flex items-start gap-3">
            <RobotAvatar size="md" />
            <div className="rounded-[10px] bg-surface px-4 py-4">
              <p className="text-[16px] leading-relaxed text-ink">
                {isFr
                  ? 'Posez votre question sur les programmes, les admissions, les frais ou les dates académiques.'
                  : 'Ask about programmes, admissions, fees or academic dates.'}
              </p>
            </div>
          </div>
        )}

        {activeConversation?.messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} onSelectFollowUp={handleFollowUp} />
        ))}

        {isSendingMessage && (
          <div className="mb-5 flex items-center gap-3">
            <RobotAvatar size="sm" />
            <span className="flex items-center gap-2 text-[14px] text-muted">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              {isFr
                ? 'Consultation de la base de connaissances…'
                : 'Checking the university knowledge base…'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-20 bg-ground pt-2 md:bottom-0">
        <ChatComposer
          onSendMessage={sendMessage}
          isSending={isSendingMessage}
          error={chatError}
          onRetry={retryLastMessage}
        />
      </div>
    </div>
  );
};
