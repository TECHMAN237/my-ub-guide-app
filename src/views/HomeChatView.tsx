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
  Bell
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

  // Latest notification
  const latestNotification = INITIAL_NOTIFICATIONS[0];

  return (
    <div className="min-h-[calc(100vh-3.25rem-4rem)] pb-28 max-w-4xl mx-auto px-3 sm:px-5 pt-2 sm:pt-3 space-y-4 sm:space-y-5">
      {/* =========================================================================
          SECTION B: MAIN AI CHATBOT CONTAINER (CENTRAL PROMINENT FOCUS)
          ========================================================================= */}
      <section
        aria-label="University Assistant"
        className="bg-white border border-[#E1E8F2] rounded-3xl shadow-xs overflow-hidden flex flex-col transition-all"
      >
        {/* B.1 Assistant Identity & Status & B.2 Conversation Controls */}
        <div className="bg-gradient-to-r from-[#102A56] via-[#144796] to-[#1463F3] text-white p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute right-12 top-2 w-16 h-16 rounded-full bg-blue-300/20 blur-md pointer-events-none" />

          {/* Top Bar: Identity & Status + Action Controls */}
          <div className="relative z-10 flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shrink-0 shadow-inner">
                <Bot className="w-5 h-5 text-white drop-shadow-xs" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold tracking-tight text-white leading-tight">
                    My UB Guide
                  </h1>
                  <span className="flex items-center gap-1 bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Online</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-blue-200">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Google Gemma 4 • Verified Regulations</span>
                </div>
              </div>
            </div>

            {/* Conversation Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
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
                className="flex items-center gap-1 text-xs font-semibold bg-white/20 hover:bg-white/30 border border-white/25 text-white px-2.5 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-2xs"
                title="Start a new chat"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">New Chat</span>
              </button>
            </div>
          </div>

          {/* Student Welcome Greeting */}
          <div className="relative z-10 pt-1">
            <p className="text-xs font-semibold text-blue-200 mb-0.5">
              {isEnrolled ? `Welcome back, ${studentName}! 👋` : 'Welcome prospective student! 👋'}
            </p>
            <p className="text-xs text-blue-100/90 leading-relaxed max-w-2xl">
              {isEnrolled
                ? `I'm your academic orientation assistant for ${userProfile?.faculty || 'Faculty of Science'}. Ask about credit caps, course registration, exam regulations, or fee deadlines.`
                : 'I can guide you through accredited degree programs, entry requirements, tuition schedules, deadlines, and student life.'}
            </p>
          </div>
        </div>

        {/* B.3 Conversation Content Thread */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col justify-end min-h-[140px] max-h-[520px] overflow-y-auto space-y-3 bg-[#F6F8FC]/50">
          {!hasMessages ? (
            <div className="py-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1463F3] flex items-center justify-center mx-auto mb-2 border border-blue-100">
                <Bot className="w-6 h-6" />
              </div>
              <h2 className="text-sm font-bold text-[#17233B] mb-1">
                How can I assist you right now?
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Type your question or choose one of the suggested topics below. Voice recording and French translation are supported.
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
                  <div className="bg-white border border-[#E1E8F2] rounded-2xl px-4 py-2.5 shadow-2xs flex items-center gap-2">
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

        {/* B.4 Suggested Questions Chips */}
        <div className="px-3 sm:px-4 py-2 bg-white border-t border-[#E1E8F2]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Suggested questions
            </span>
            <span className="text-[10px] text-[#1463F3] font-semibold">1-Tap Prompt</span>
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

        {/* B.5 Message Input & B.6 Send / Mic Controls (ChatComposer) */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E1E8F2]">
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
                  <h3 className="text-xs font-bold text-[#17233B] leading-tight">Fee Deadlines</h3>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Installments & bank</p>
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
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Faculties & degrees</p>
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
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Criteria & checklist</p>
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
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Prospectus & totals</p>
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
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Academic dates</p>
                </div>
              </button>
            </>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION D: DASHBOARD AND OVERVIEW (BALANCED RESPONSIVE GRID)
          ========================================================================= */}
      <section aria-label="Dashboard & Overview">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Academic Overview & Milestones
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">Session 2025/2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {/* Card 1: Academic Calendar Milestone */}
          <div className="bg-white border border-[#E1E8F2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between hover:border-[#1463F3]/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Calendar className="w-4 h-4 text-[#1463F3]" />
                  <span>Next Milestone</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#1463F3] px-2 py-0.5 rounded-md">
                  {nextMilestone.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#17233B] mb-1">
                {nextMilestone.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                {nextMilestone.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E1E8F2] flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{nextMilestone.displayDate}</span>
              </span>
              <button
                type="button"
                onClick={() => navigateTo('/academic-calendar')}
                className="text-xs font-bold text-[#1463F3] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Schedule</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Admissions & Orientation Checklist */}
          <div className="bg-white border border-[#E1E8F2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between hover:border-[#1463F3]/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Orientation Progress</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {completedChecklistCount} of {INITIAL_CHECKLIST.length} Done
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-[#1463F3] h-full rounded-full transition-all duration-500"
                  style={{ width: `${(completedChecklistCount / INITIAL_CHECKLIST.length) * 100}%` }}
                />
              </div>

              <p className="text-xs text-slate-600 mb-1">
                <span className="font-semibold text-slate-800">Next Step: </span>
                {nextChecklistItem.title}
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                {nextChecklistItem.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E1E8F2] flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Personalized Checklist</span>
              <button
                type="button"
                onClick={() => navigateTo('/admissions/checklist')}
                className="text-xs font-bold text-[#1463F3] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Open Checklist</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: School Fees & Financial Overview */}
          <div className="bg-white border border-[#E1E8F2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between hover:border-[#1463F3]/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>Tuition & Fees</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Official Rate
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#17233B] mb-0.5">
                {primaryFee.programName}
              </h3>
              <p className="text-base font-extrabold text-[#102A56] mb-1">
                {primaryFee.totalFee.toLocaleString()} {primaryFee.currency}
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                {primaryFee.paymentSchedule}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E1E8F2] flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500">
                Deadline: 30 Oct 2025
              </span>
              <button
                type="button"
                onClick={() => navigateTo('/fees')}
                className="text-xs font-bold text-[#1463F3] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Fee Guide</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Latest University Notice */}
          <div className="bg-white border border-[#E1E8F2] rounded-2xl p-4 shadow-2xs flex flex-col justify-between hover:border-[#1463F3]/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Bell className="w-4 h-4 text-purple-600" />
                  <span>University Notice</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {latestNotification.date}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#17233B] mb-1">
                {latestNotification.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                {latestNotification.message}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E1E8F2] flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Academic Senate</span>
              <button
                type="button"
                onClick={() => navigateTo('/notifications')}
                className="text-xs font-bold text-[#1463F3] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>All Notices</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
