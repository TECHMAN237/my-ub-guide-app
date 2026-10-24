import React, { useRef, useEffect } from 'react';
import { Bot, Plus, Trash2, History, ArrowLeft, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessageItem } from '../components/chat/ChatMessageItem';
import { ChatComposer } from '../components/chat/ChatComposer';

export const DedicatedChatView: React.FC = () => {
  const {
    activeConversation,
    createNewConversation,
    deleteConversation,
    sendMessage,
    isSendingMessage,
    chatError,
    retryLastMessage,
    navigateTo
  } = useApp();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isSendingMessage]);

  const handleFollowUp = async (question: string) => {
    await sendMessage(question);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.25rem-4rem)] pb-28 max-w-4xl mx-auto px-3 sm:px-5 pt-3 font-sans">
      {/* Conversation Top Action Bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E1E8F2] gap-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigateTo('/home')}
            className="w-9 h-9 rounded-xl bg-white border border-[#E1E8F2] text-slate-700 hover:text-[#1463F3] hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
            title="Return to main dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1463F3] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-[#17233B] leading-tight truncate max-w-[180px] sm:max-w-md">
                  {activeConversation?.title || 'My UB Guide Assistant'}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Full Chat Mode</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                <span>Google Gemma 4 • {activeConversation?.messages.length || 0} messages in thread</span>
              </p>
            </div>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => navigateTo('/history')}
            className="w-9 h-9 rounded-xl bg-white border border-[#E1E8F2] text-slate-600 hover:text-[#1463F3] hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
            title="Conversation history"
          >
            <History className="w-4.5 h-4.5" />
          </button>

          <button
            type="button"
            onClick={createNewConversation}
            className="flex items-center gap-1.5 text-xs font-semibold bg-[#1463F3] hover:bg-[#104fc2] text-white px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {activeConversation && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Delete this conversation?')) {
                  deleteConversation(activeConversation.id);
                  navigateTo('/home');
                }
              }}
              className="w-9 h-9 rounded-xl bg-white border border-[#E1E8F2] text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
              title="Delete conversation"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Full Conversation Thread */}
      <div className="flex-1 space-y-4 mb-6">
        {activeConversation?.messages.map((msg) => (
          <ChatMessageItem
            key={msg.id}
            message={msg}
            onSelectFollowUp={handleFollowUp}
          />
        ))}

        {isSendingMessage && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#EEF5FF] text-[#1463F3] border border-[#1463F3]/20 flex items-center justify-center animate-pulse shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white border border-[#E1E8F2] rounded-2xl px-4 py-3 shadow-xs flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#1463F3] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#1463F3] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#1463F3] animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-xs text-slate-500 font-medium">Consulting official university knowledge base...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Full Chat Composer */}
      <div className="sticky bottom-16 bg-[#F6F8FC] pt-2 pb-1">
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
