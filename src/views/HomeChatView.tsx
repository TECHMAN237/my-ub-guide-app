import React, { useRef, useEffect } from 'react';
import { Bot, Sparkles, Plus, Compass, FileCheck2, CreditCard, Calendar, BookOpen, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessageItem } from '../components/chat/ChatMessageItem';
import { ChatComposer } from '../components/chat/ChatComposer';

export const HomeChatView: React.FC = () => {
  const {
    userProfile,
    userCategory,
    activeConversation,
    createNewConversation,
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

  const studentName = userProfile?.name?.split(' ')[0] || (userCategory === 'enrolled' ? 'Ferdinand' : 'Student');
  const isEnrolled = userCategory === 'enrolled';

  const popularQuestions = isEnrolled
    ? [
        'How many credit units can I take?',
        'How much are the school fees for Computer Science?',
        'How do I register my courses?',
        'When do first semester exams start?',
        'Can I register additional credits with a 3.2 GPA?'
      ]
    : [
        'What programs are offered?',
        'How much are the school fees for Computer Science?',
        'What are the admission requirements?',
        'When is the application deadline?',
        'What documents do I need to apply?'
      ];

  const handleQuestionClick = async (question: string) => {
    await sendMessage(question);
  };

  const hasMessages = activeConversation && activeConversation.messages.length > 0;

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem-4rem)] pb-20 max-w-2xl mx-auto px-4 pt-3">
      {/* AI Welcome Banner */}
      <div className="bg-gradient-to-r from-[#102A56] via-[#144796] to-[#1463F3] text-white rounded-3xl p-5 mb-4 shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute right-6 top-3 w-16 h-16 rounded-full bg-blue-300/20 blur-md pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="max-w-[75%]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-200 mb-1">
              <span>{isEnrolled ? `Welcome back, ${studentName}! 👋` : 'Hi there! 👋'}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-1 text-white">
              {isEnrolled ? `I'm your academic assistant` : `I'm XENA AI`}
            </h2>
            <p className="text-xs text-blue-100/90 leading-relaxed">
              {isEnrolled
                ? `Ask me anything about your studies in ${userProfile?.faculty || 'Faculty of Science'}, credit limits, course registration, and exams.`
                : 'Ask me anything about the university. I can help with admission, school fees, degree programs, and certificates.'}
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shrink-0 shadow-inner">
            <Bot className="w-8 h-8 text-white drop-shadow-sm" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Official University Intelligence</span>
          </div>

          <button
            type="button"
            onClick={createNewConversation}
            className="flex items-center gap-1 text-[11px] font-semibold bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {isEnrolled ? (
          <>
            <button
              type="button"
              onClick={() => navigateTo('/academic-calendar')}
              className="bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all shadow-2xs group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1463F3] flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 leading-tight">Calendar</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/resources/res-course-reg')}
              className="bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all shadow-2xs group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 leading-tight">Registration</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/resources/res-credit-system')}
              className="bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all shadow-2xs group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 leading-tight">Credit Rules</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/fees')}
              className="bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all shadow-2xs group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 leading-tight">Fee Deadlines</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => navigateTo('/programs')}
              className="bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all shadow-2xs group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1463F3] flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 leading-tight">Programs</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/admissions')}
              className="bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all shadow-2xs group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 leading-tight">Admission</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/fees')}
              className="bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all shadow-2xs group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 leading-tight">School Fees</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/academic-calendar')}
              className="bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all shadow-2xs group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 leading-tight">Calendar</span>
            </button>
          </>
        )}
      </div>

      {/* Popular questions list */}
      <div className="mb-4 bg-white border border-[#E1E8F2] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Popular questions
          </h3>
          <span className="text-[11px] text-[#1463F3] font-semibold">Tap to ask</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {popularQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isSendingMessage}
              onClick={() => handleQuestionClick(q)}
              className="text-left text-xs text-[#1463F3] hover:text-[#102A56] hover:bg-[#EEF5FF] px-3 py-2 rounded-xl transition-colors font-medium flex items-center gap-2 border border-transparent hover:border-[#1463F3]/20 cursor-pointer"
            >
              <span className="text-[#1463F3] font-bold">•</span>
              <span className="truncate">{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 space-y-3 mb-4">
        {hasMessages &&
          activeConversation.messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              message={msg}
              onSelectFollowUp={handleQuestionClick}
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
              <span className="text-xs text-slate-500 font-medium">
                Consulting official university regulations...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Chat Composer at Bottom */}
      <div className="sticky bottom-16 bg-[#F6F8FC] pt-2 pb-1">
        <ChatComposer
          onSendMessage={sendMessage}
          isSending={isSendingMessage}
          error={chatError}
          onRetry={retryLastMessage}
          placeholder={
            isEnrolled
              ? 'Ask about credits, exams, course registration...'
              : 'Ask about programs, admission requirements, fees...'
          }
        />
      </div>
    </div>
  );
};
