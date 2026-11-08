import React, { useState } from 'react';
import { ArrowLeft, Search, Trash2, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HistoryView: React.FC = () => {
  const {
    conversations,
    selectConversation,
    deleteConversation,
    createNewConversation,
    clearAllConversations,
    goBack,
    navigateTo,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const filtered = conversations.filter(
    (conversation) =>
      conversation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.messages.some((message) =>
        message.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleOpenConversation = (id: string) => {
    selectConversation(id);
    navigateTo('/chat');
  };

  const handleNewConversation = () => {
    createNewConversation();
    navigateTo('/chat');
  };

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 pb-28 pt-4 sm:px-8 md:pb-16">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2">
          <button
            type="button"
            onClick={goBack}
            className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-ink"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 pt-1">
            <h1 className="page-title text-ink">Conversations</h1>
            <p className="page-lede mt-1">Questions you have asked before.</p>
          </div>
        </div>
        <button type="button" onClick={handleNewConversation} className="btn btn-secondary btn-sm">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New
        </button>
      </div>

      <div className="relative mt-6">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search conversations"
          aria-label="Search conversations"
          className="field pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <p className="text-[16px] text-ink">
            {conversations.length === 0 ? 'No conversations yet.' : 'No conversations match.'}
          </p>
          <p className="mt-1 text-[16px] leading-relaxed text-muted">
            {conversations.length === 0
              ? 'Ask a question from the home screen and it will appear here.'
              : 'Try a different search term.'}
          </p>
          {conversations.length === 0 && (
            <button
              type="button"
              onClick={() => navigateTo('/home')}
              className="mt-3 min-h-[44px] text-[14px] font-medium text-accent underline-offset-2 hover:underline"
            >
              Ask a question
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mt-4">
            {filtered.map((conversation) => {
              const lastMessage = conversation.messages[conversation.messages.length - 1];
              return (
                <div key={conversation.id} className="row-link items-start">
                  <button
                    type="button"
                    onClick={() => handleOpenConversation(conversation.id)}
                    className="min-w-0 flex-1 py-1 text-left"
                  >
                    <span className="block truncate text-[16px] font-medium text-ink">
                      {conversation.title}
                    </span>
                    {lastMessage && (
                      <span className="mt-0.5 block truncate text-[14px] text-muted">
                        {lastMessage.sender === 'user' ? 'You: ' : 'Answer: '}
                        {lastMessage.text}
                      </span>
                    )}
                    <span className="mt-0.5 block text-[14px] text-muted">
                      {conversation.messages.length}{' '}
                      {conversation.messages.length === 1 ? 'message' : 'messages'} ·{' '}
                      {new Date(conversation.updatedAt).toLocaleDateString()}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete this conversation?')) {
                        deleteConversation(conversation.id);
                      }
                    }}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-negative"
                    aria-label={`Delete ${conversation.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Clear all conversation history? This cannot be undone.')) {
                clearAllConversations();
              }
            }}
            className="mt-6 min-h-[44px] text-[14px] font-medium text-negative underline-offset-2 hover:underline"
          >
            Clear all conversations
          </button>
        </>
      )}
    </div>
  );
};
