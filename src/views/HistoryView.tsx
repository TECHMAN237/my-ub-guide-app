import React, { useState } from 'react';
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
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#17233B] tracking-tight">
              Chat History
            </h1>
            <p className="text-xs text-slate-500">Previous AI orientation conversations</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            createNewConversation();
            navigateTo('/chat');
          }}
          className="flex items-center gap-1 text-xs font-semibold bg-[#1463F3] text-white px-3 py-1.5 rounded-xl hover:bg-[#104fc2] transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search past conversations..."
          className="w-full bg-white border border-[#E1E8F2] focus:border-[#1463F3] rounded-xl pl-9.5 pr-4 py-2 text-xs text-[#17233B] focus:outline-hidden"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#E1E8F2] p-6 shadow-2xs">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 mb-1">No conversation history</p>
          <p className="text-xs text-slate-400 mb-4">Start a new orientation chat with My UB Guide.</p>
          <button
            type="button"
            onClick={() => {
              createNewConversation();
              navigateTo('/chat');
            }}
            className="text-xs font-semibold text-white bg-[#1463F3] hover:bg-[#104fc2] px-4 py-2 rounded-xl cursor-pointer"
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
                className="bg-white hover:bg-[#EEF5FF]/50 border border-[#E1E8F2] hover:border-[#1463F3] rounded-2xl p-4 transition-all shadow-2xs hover:shadow-xs flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1463F3] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-[#17233B] group-hover:text-[#1463F3] transition-colors truncate">
                      {conv.title}
                    </h3>
                    {lastMsg && (
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {lastMsg.sender === 'user' ? 'You: ' : 'AI: '}
                        {lastMsg.text}
                      </p>
                    )}
                    <span className="text-[10px] text-slate-400">
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
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1463F3]" />
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
