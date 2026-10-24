import React, { useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Plus,
  Compass,
  FileCheck2,
  CreditCard,
  Calendar,
  GraduationCap,
  History,
  ChevronRight,
  Clock,
  ArrowUpRight,
  Maximize2,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessageItem } from '../components/chat/ChatMessageItem';
import { ChatComposer } from '../components/chat/ChatComposer';
import { INITIAL_CALENDAR_EVENTS, INITIAL_CHECKLIST, INITIAL_FEES, INITIAL_NOTIFICATIONS } from '../data/mockData';

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
    if (activeConversation?.messages && activeConversation.messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
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

  const hasMessages = Boolean(activeConversation && activeConversation.messages.length > 0);

  // Completed checklist count
  const completedChecklistCount = INITIAL_CHECKLIST.filter((item) => item.completed).length;
  const nextChecklistItem = INITIAL_CHECKLIST.find((item) => !item.completed) || INITIAL_CHECKLIST[0];

  // Next upcoming calendar milestone
  const nextMilestone = INITIAL_CALENDAR_EVENTS.find((event) => event.status === 'ongoing' || event.status === 'upcoming') || INITIAL_CALENDAR_EVENTS[0];

  // Primary fee reference
  const primaryFee = INITIAL_FEES[0];

  return (
    <div className="min-h-[calc(100vh-3.25rem-4rem)] pb-28 max-w-4xl mx-auto px-3 sm:px-5 pt-2 sm:pt-3 space-y-4 sm:space-y-5 font-sans">
      {/* =========================================================================
          SECTION B: COMPACT MAIN AI CHATBOT CONTAINER
          ========================================================================= */}
      <section
        aria-label="University Assistant"
        className="bg-white border border-[#E1E8F2] rounded-3xl shadow-xs overflow-hidden flex flex-col transition-all"
      >
        {/* B.1 Compact Assistant Header */}
        <div className="bg-gradient-to-r from-[#102A56] via-[#144796] to-[#1463F3] text-white px-3.5 py-3 sm:px-5 sm:py-3.5 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute right-12 top-2 w-16 h-16 rounded-full bg-blue-300/20 blur-md pointer-events-none" />

          {/* Top Row: Identity & Primary Actions */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5">
            
            {/* Assistant Identity & Online Status */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shrink-0 shadow-inner">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold text-white leading-tight">
                    My UB Guide
                  </h1>
                  <span className="flex items-center gap-1 bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Online</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-blue-200">
                  <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-none">Google Gemma 4 • Verified Knowledge Base</span>
                </div>
              </div>
            </div>

            {/* Conversation Actions & Prominent Open Full Chat Button */}
            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              
              {/* Prominent Open Full Chat CTA */}
              <button
                type="button"
                onClick={() => navigateTo('/chat')}
                className="h-8 px-3 rounded-xl bg-white text-[#1463F3] hover:bg-blue-50 font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                title="Open full-screen chat interface"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#1463F3]" />
                <span>Open Full Chat</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/history')}
                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Conversation history"
                aria-label="Conversation history"
              >
                <History className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={createNewConversation}
                className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 border border-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Start a new chat"
                aria-label="Start a new chat"
              >
                <Plus className="w-4 h-4" />
              </button>

            </div>

          </div>

          {/* Compact Student Greeting */}
          <div className="relative z-10 pt-2 text-[11px] sm:text-xs text-blue-100/90 leading-tight">
            <span>
              {isEnrolled
                ? `Welcome back, ${studentName}! Ask about credits, registration, fees, or exam schedules.`
                : `Welcome ${studentName}! Ask about programs, entry criteria, tuition fees, or deadlines.`}
            </span>
          </div>
        </div>

        {/* B.2 Compact Conversation Preview Thread (Bounded max-height with internal scroll) */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col justify-end min-h-[120px] max-h-[260px] sm:max-h-[300px] overflow-y-auto space-y-3 bg-[#F6F8FC]/50 border-b border-[#E1E8F2]">
          {!hasMessages ? (
            <div className="py-3 text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1463F3] flex items-center justify-center mx-auto mb-1.5 border border-blue-100">
                <Bot className="w-5 h-5" />
              </div>
              <h2 className="text-xs font-bold text-[#17233B] mb-0.5">
                How can I assist you right now?
              </h2>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Ask a question or tap a suggested topic below. Voice recording supported.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeConversation?.messages.map((msg) => (
                <ChatMessageItem
                  key={msg.id}
                  message={msg}
                  onSelectFollowUp={handleQuestionClick}
                />
              ))}

              {isSendingMessage && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EEF5FF] text-[#1463F3] border border-[#1463F3]/20 flex items-center justify-center animate-pulse shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-[#E1E8F2] rounded-2xl px-3.5 py-2 shadow-2xs flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1463F3] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1463F3] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1463F3] animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      Consulting official university regulations...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* B.3 Suggested Questions Chips */}
        <div className="px-3 sm:px-4 py-2 bg-white border-b border-[#E1E8F2]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Suggested topics
            </span>
            <button
              type="button"
              onClick={() => navigateTo('/chat')}
              className="text-[10px] text-[#1463F3] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <span>Full Chat</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {popularQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isSendingMessage}
                onClick={() => handleQuestionClick(q)}
                className="whitespace-nowrap shrink-0 text-xs text-[#1463F3] hover:text-[#102A56] bg-[#EEF5FF] hover:bg-blue-100 border border-[#1463F3]/20 px-3 py-1.5 rounded-xl transition-all font-medium cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* B.4 Compact Message Composer */}
        <div className="p-3 sm:p-3.5 bg-white">
          <ChatComposer
            onSendMessage={sendMessage}
            isSending={isSendingMessage}
            error={chatError}
            onRetry={retryLastMessage}
            placeholder={
              isEnrolled
                ? 'Ask about credits, exams, registration...'
                : 'Ask about programs, fees, admissions...'
            }
          />
        </div>
      </section>

      {/* =========================================================================
          SECTION C: QUICK ACTIONS (COMPACT RESPONSIVE ROW / GRID)
          ========================================================================= */}
      <section aria-label="Quick Actions">
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Quick Actions
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">Academic Portal</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {isEnrolled ? (
            <>
              <button
                type="button"
                onClick={() => navigateTo('/academic-calendar')}
                className="bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] p-3 rounded-2xl flex items-center gap-3 transition-all shadow-2xs group cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1463F3] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#17233B] leading-tight">Calendar</h3>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Key dates & exams</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/resources/res-course-reg')}
                className="bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] p-3 rounded-2xl flex items-center gap-3 transition-all shadow-2xs group cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#17233B] leading-tight">Registration</h3>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Form A & validation</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/resources/res-credit-system')}
                className="bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] p-3 rounded-2xl flex items-center gap-3 transition-all shadow-2xs group cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#17233B] leading-tight">Credit Rules</h3>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Caps & extra load</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/fees')}
                className="bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] p-3 rounded-2xl flex items-center gap-3 transition-all shadow-2xs group cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#17233B] leading-tight">Fees & Bank</h3>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Installments & portal</p>
                </div>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigateTo('/programs')}
                className="bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] p-3 rounded-2xl flex items-center gap-3 transition-all shadow-2xs group cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1463F3] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#17233B] leading-tight">Programs</h3>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Degrees & faculties</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/admissions')}
                className="bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] p-3 rounded-2xl flex items-center gap-3 transition-all shadow-2xs group cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#17233B] leading-tight">Admissions</h3>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Requirements & steps</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/fees')}
                className="bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] p-3 rounded-2xl flex items-center gap-3 transition-all shadow-2xs group cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#17233B] leading-tight">School Fees</h3>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Tuition breakdown</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/academic-calendar')}
                className="bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] p-3 rounded-2xl flex items-center gap-3 transition-all shadow-2xs group cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#17233B] leading-tight">Calendar</h3>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Application dates</p>
                </div>
              </button>
            </>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION D: DASHBOARD OVERVIEW CARDS (INFORMATION RIGOR)
          ========================================================================= */}
      <section aria-label="Academic Dashboard Overview" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Academic Overview
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">Updated 2025/2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: Checklist Progress */}
          <div className="bg-white border border-[#E1E8F2] rounded-3xl p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Checklist Tracker
                </span>
                <span className="text-xs font-bold text-[#1463F3] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  {completedChecklistCount}/{INITIAL_CHECKLIST.length} Done
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#17233B] mb-1">
                {nextChecklistItem.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {nextChecklistItem.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigateTo('/admissions/checklist')}
                className="text-xs font-bold text-[#1463F3] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Checklist</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Card 2: Upcoming Calendar Milestone */}
          <div className="bg-white border border-[#E1E8F2] rounded-3xl p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Academic Calendar
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {nextMilestone.status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#17233B] mb-1">
                {nextMilestone.title}
              </h3>
              <p className="text-xs text-[#1463F3] font-semibold mb-1">
                {nextMilestone.displayDate}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed truncate">
                {nextMilestone.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigateTo('/academic-calendar')}
                className="text-xs font-bold text-[#1463F3] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Schedule</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Card 3: School Fees Primary Notice */}
          <div className="bg-white border border-[#E1E8F2] rounded-3xl p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Tuition Fee Reference
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                  INSTALLMENTS
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#17233B] mb-1">
                {primaryFee.programName}
              </h3>
              <p className="text-sm font-extrabold text-[#17233B] mb-1">
                {primaryFee.totalFee.toLocaleString()} {primaryFee.currency} <span className="text-xs font-normal text-slate-500">/ year</span>
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                60% 1st installment due upon registration.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigateTo('/fees')}
                className="text-xs font-bold text-[#1463F3] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Fee Schedules & Banks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
