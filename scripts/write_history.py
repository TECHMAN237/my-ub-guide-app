"""Write the new HistoryView.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'HistoryView.tsx'))

JSX = r'''import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Trash2, Plus, Search, Calendar, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HistoryView: React.FC = () => {
  const {
    conversations,
    selectConversation,
    deleteConversation,
    createNewConversation,
    clearAllConversations,
    goBack,
    navigateTo
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenConversation = (id: string) => {
    selectConversation(id);
    navigateTo('/chat');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-ink hover:bg-raised transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-ink tracking-tight">
              Chat History
            </h1>
            <p className="text-xs text-muted">Previous AI orientation conversations</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            createNewConversation();
            navigateTo('/chat');
          }}
          className="flex items-center gap-1 text-xs font-semibold bg-accent text-white px-3 py-1.5 rounded-xl hover:bg-accent-edge transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search past conversations..."
          className="w-full bg-surface border border-ink/10 focus:border-accent rounded-xl pl-9.5 pr-4 py-2 text-xs text-ink focus:outline-hidden"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-3xl border border-ink/10 p-6 shadow-2xs">
          <MessageSquare className="w-10 h-10 text-muted mx-auto mb-2" />
          <p className="text-sm font-semibold text-ink mb-1">No conversation history</p>
          <p className="text-xs text-muted mb-4">Start a new orientation chat with My UB Guide.</p>
          <button
            type="button"
            onClick={() => {
              createNewConversation();
              navigateTo('/chat');
            }}
            className="text-xs font-semibold text-white bg-accent hover:bg-accent-edge px-4 py-2 rounded-xl cursor-pointer shadow-xs"
          >
            Start Conversation
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((conv) => {
            const lastMsg = conv.messages[conv.messages.length - 1];
            return (
              <div
                key={conv.id}
                onClick={() => handleOpenConversation(conv.id)}
                className="bg-surface border border-ink/10 hover:border-accent hover:bg-raised rounded-2xl p-4 transition-all shadow-2xs hover:shadow-xs flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-ink group-hover:text-accent transition-colors truncate">
                      {conv.title}
                    </h3>
                    {lastMsg && (
                      <p className="text-[11px] text-muted truncate mt-0.5">
                        {lastMsg.sender === 'user' ? 'You: ' : 'AI: '}
                        {lastMsg.text}
                      </p>
                    )}
                    <span className="text-[10px] text-muted">
                      {conv.messages.length} messages • {new Date(conv.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this conversation?')) {
                        deleteConversation(conv.id);
                      }
                    }}
                    className="p-2 text-muted hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent" />
                </div>
              </div>
            );
          })}

          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Clear all conversation histories? This cannot be undone.')) {
                  clearAllConversations();
                }
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-800 cursor-pointer"
            >
              Clear All Chat Histories
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
