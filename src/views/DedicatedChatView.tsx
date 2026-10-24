import React, { useRef, useEffect } from 'react';
import { Bot, Plus, Trash2, History } from 'lucide-react';
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
    <div className="flex flex-col min-h-[calc(100vh-3.5rem-4rem)] pb-20 max-w-2xl mx-auto px-4 pt-2">
      {/* Conversation Top Action Bar */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#E1E8F2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1463F3] flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#17233B] leading-tight truncate max-w-[180px] sm:max-w-xs">
              {activeConversation?.title || 'Academic Assistant'}
            </h2>
            <p className="text-[10px] text-slate-400">
              {activeConversation?.messages.length || 0} messages in thread
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => navigateTo('/history')}
            className="p-1.5 text-slate-500 hover:text-[#1463F3] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Conversation history"
          >
            <History className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={createNewConversation}
            className="flex items-center gap-1 text-xs font-semibold bg-[#1463F3] hover:bg-[#104fc2] text-white px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>

          {activeConversation && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Delete this conversation?')) {
                  deleteConversation(activeConversation.id);
                }
              }}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 space-y-3 mb-4">
        {activeConversation?.messages.map((msg) => (
          <ChatMessageItem
            key={msg.id}
            message={msg}
            onSelectFollowUp={handleFollowUp}
          />
        ))}

        {isSendingMessage && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#EEF5FF] text-[#1463F3] border border-[#1463F3]/20 flex items-center justify-center animate-pulse">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white border border-[#E1E8F2] rounded-2xl px-4 py-3 shadow-xs flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#1463F3] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#1463F3] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#1463F3] animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-xs text-slate-500 font-medium">Generating verified response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Composer */}
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
