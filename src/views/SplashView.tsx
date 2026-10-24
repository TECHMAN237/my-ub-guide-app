import React, { useState } from 'react';
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Mic,
  Languages,
  ShieldCheck,
  ChevronRight,
  Bot,
  Volume2,
  Award,
  Search,
  Building2,
  FileText,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DemoPrompt {
  id: string;
  question: string;
  answer: string;
  source: string;
  category: string;
}

const DEMO_PROMPTS: DemoPrompt[] = [
  {
    id: 'fees',
    question: 'What are the tuition fees for the Faculty of Engineering & Technology?',
    answer: 'At the University of Buea, state-subsidized tuition for Cameroonian students is 50,000 FCFA per academic year (payable in two installments). Registration for foreign students is 600,000 FCFA.',
    source: 'UB Tuition Fee Regulations & Circular No. 2024/002',
    category: 'Admissions & Fees'
  },
  {
    id: 'credits',
    question: 'How many credits can an enrolled student register per semester?',
    answer: 'The standard registration limit is 30 to 36 credits per academic session. Students with a Cumulative GPA of 3.0 or higher may apply for an overload of up to 42 credits with Dean approval.',
    source: 'Academic Regulations, Section 4.2 (Credit System)',
    category: 'Academic Rules'
  },
  {
    id: 'programs',
    question: 'What undergraduate programs are offered in ASTI and FHS?',
    answer: 'ASTI offers Specialized Translation and Interpretation degrees. The Faculty of Health Sciences (FHS) offers Medicine (MD), Nursing Science, and Medical Laboratory Sciences.',
    source: 'University of Buea Program Catalog 2025/2026',
    category: 'Programs'
  }
];

export const SplashView: React.FC = () => {
  const { navigateTo, userProfile, setUserCategory } = useApp();
  const [activeDemo, setActiveDemo] = useState<DemoPrompt>(DEMO_PROMPTS[0]);

  const handleStart = () => {
    if (userProfile) {
      navigateTo('/home');
    } else {
      navigateTo('/setup/user-type');
    }
  };

  const handleSelectCategory = (category: 'prospective' | 'enrolled') => {
    setUserCategory(category);
    navigateTo('/setup/profile', { category });
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col font-sans selection:bg-[#1463F3] selection:text-white">
      {/* 1. TOP HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#1463F3] text-white flex items-center justify-center shadow-xs shadow-[#1463F3]/20">
              <GraduationCap className="w-5.5 h-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight whitespace-nowrap">
                My UB Guide
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#pathways"
              className="hover:text-[#1463F3] transition-colors whitespace-nowrap"
            >
              Student Pathways
            </a>
            <a
              href="#capabilities"
              className="hover:text-[#1463F3] transition-colors whitespace-nowrap"
            >
              Capabilities
            </a>
            <a
              href="#demo-assistant"
              className="hover:text-[#1463F3] transition-colors whitespace-nowrap"
            >
              AI Preview
            </a>
            <button
              type="button"
              onClick={() => navigateTo('/programs')}
              className="hover:text-[#1463F3] transition-colors whitespace-nowrap cursor-pointer"
            >
              Explore Programs
            </button>
          </nav>

          {/* Zone 3: Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('/auth/login')}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#1463F3] hover:bg-slate-100/70 rounded-xl transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleStart}
              className="px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#1463F3] hover:bg-[#104fc2] rounded-xl transition-all shadow-xs shadow-blue-500/20 active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-8 pb-12 sm:pt-16 sm:pb-20 px-4 sm:px-8 bg-gradient-to-b from-[#F8FAFC] via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Hero Column 1: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Trust badge kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#1463F3] text-xs font-semibold mb-6 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#1463F3] shrink-0" />
              <span>Official University of Buea Information Assistant</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#0F172A] tracking-tight leading-[1.15] mb-5">
              Your Journey at the University of Buea Starts Here.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
              Get reliable guidance on programs, admissions, school fees, academic requirements, and university life — all in one place.
            </p>

            {/* CTA Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-4">
              <button
                type="button"
                onClick={handleStart}
                className="h-12 sm:h-13 px-7 rounded-xl bg-[#1463F3] hover:bg-[#104fc2] text-white font-semibold text-base flex items-center justify-center gap-2.5 shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => navigateTo('/programs')}
                className="h-12 sm:h-13 px-6 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-[#1463F3] font-semibold text-sm sm:text-base border border-slate-200/90 flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <Search className="w-4.5 h-4.5 text-slate-400" />
                <span>Explore Programs</span>
              </button>
            </div>

            {/* Supporting line */}
            <p className="text-xs sm:text-sm font-medium text-slate-500 mb-8 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>For prospective and enrolled students · Free instant access</span>
            </p>

            {/* Micro feature pills */}
            <div className="pt-4 border-t border-slate-200/70 w-full flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-[#1463F3]" />
                <span>Gemma AI Engine</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>UB Regulations Grounded</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-indigo-600" />
                <span>English & French</span>
              </div>
            </div>

          </div>

          {/* Hero Column 2: Interactive Assistant Showcase Card */}
          <div id="demo-assistant" className="lg:col-span-5 w-full">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xl shadow-slate-200/60 relative overflow-hidden">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1463F3] flex items-center justify-center font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Gemma Assistant</h3>
                    <p className="text-[11px] text-slate-500">Live Knowledge Base Preview</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Verified UB Source</span>
                </div>
              </div>

              {/* Sample Prompts Switcher */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">Click a sample question to test:</p>
                <div className="space-y-1.5">
                  {DEMO_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => setActiveDemo(prompt)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between gap-2 border cursor-pointer ${
                        activeDemo.id === prompt.id
                          ? 'bg-[#1463F3] text-white border-[#1463F3] shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200/70 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{prompt.question}</span>
                      <Sparkles className={`w-3.5 h-3.5 shrink-0 ${activeDemo.id === prompt.id ? 'text-blue-100' : 'text-slate-400'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Answer Preview Box */}
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-4 text-xs">
                <div className="flex items-center gap-2 text-slate-500 font-semibold mb-2 text-[11px]">
                  <Bot className="w-3.5 h-3.5 text-[#1463F3]" />
                  <span>Gemma Response</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">{activeDemo.category}</span>
                </div>
                
                <p className="text-slate-800 leading-relaxed font-normal mb-3">
                  "{activeDemo.answer}"
                </p>

                <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1 text-[#1463F3] font-medium truncate max-w-[220px]">
                    <FileText className="w-3 h-3 shrink-0" />
                    <span className="truncate">{activeDemo.source}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                    <Volume2 className="w-3.5 h-3.5" />
                    <Languages className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={handleStart}
                  className="text-xs font-bold text-[#1463F3] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Ask your own specific questions now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. KPI / TRUST SIGNALS BAR */}
      <section className="bg-[#F8FAFC] border-y border-slate-200/80 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-1">
              30+
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600">
              Faculties & Academic Departments
            </div>
          </div>

          <div className="p-3 border-l border-slate-200/60 lg:border-l">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-1">
              50,000 FCFA
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600">
              Official Subsidized Tuition Base
            </div>
          </div>

          <div className="p-3 border-l border-slate-200/60 lg:border-l">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-1">
              100%
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600">
              Grounded UB Regulations & Statutes
            </div>
          </div>

          <div className="p-3 border-l border-slate-200/60 lg:border-l">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-1">
              EN & FR
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600">
              Dual Language Voice & Text Guidance
            </div>
          </div>
        </div>
      </section>

      {/* 4. STUDENT PATHWAYS (Prospective vs Enrolled) */}
      <section id="pathways" className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mb-3">
            Tailored Guidance for Your Needs
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Select your status to personalize your assistant and access instant answers specific to your academic stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Card 1: Prospective Student Pathway */}
          <div className="bg-white border border-slate-200 hover:border-[#1463F3] rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1463F3] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-[#0F172A] mb-2 group-hover:text-[#1463F3] transition-colors">
                Prospective Students
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Explore degree programs, admission requirements, tuition fee structures, and application checklists for the University of Buea.
              </p>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1463F3] shrink-0" />
                  <span>Program qualifications across 30+ departments</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1463F3] shrink-0" />
                  <span>Official fee breakdowns (Cameroonian & Foreign)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1463F3] shrink-0" />
                  <span>Step-by-step admission application checklists</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectCategory('prospective')}
              className="w-full h-11 rounded-xl bg-slate-50 hover:bg-[#1463F3] text-slate-800 hover:text-white font-semibold text-sm border border-slate-200 hover:border-[#1463F3] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore as Prospective Student</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Enrolled Student Pathway */}
          <div className="bg-white border border-slate-200 hover:border-amber-500 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-[#0F172A] mb-2 group-hover:text-amber-600 transition-colors">
                Enrolled Students
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Get assistance with course registration limits, credit caps, continuous assessment rules, exam schedules, and department procedures.
              </p>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Credit limits (30-36 credits, overload up to 42)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Academic calendar, CA, and exam schedules</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Grading schemes, CGPA calculation, and re-sits</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectCategory('enrolled')}
              className="w-full h-11 rounded-xl bg-slate-50 hover:bg-amber-600 text-slate-800 hover:text-white font-semibold text-sm border border-slate-200 hover:border-amber-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue as Enrolled Student</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. CORE PLATFORM CAPABILITIES */}
      <section id="capabilities" className="py-12 sm:py-16 px-4 sm:px-8 bg-[#F8FAFC] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mb-3">
              Everything You Need for Academic Success
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Built specifically for the University of Buea community with verified institutional accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Capability 1 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1463F3] flex items-center justify-center mb-4">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-2">
                  Gemma AI Assistant
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Answers powered by Gemma and grounded directly in University of Buea regulations with citations.
                </p>
              </div>
            </div>

            {/* Capability 2 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-2">
                  30+ Programs Catalog
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Detailed entry requirements, department listings, degree duration, and credit rules across all faculties.
                </p>
              </div>
            </div>

            {/* Capability 3 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-2">
                  Fees & Checklists
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Official fee breakdown (50,000 FCFA local / 600,000 FCFA foreign) and interactive admission tracking.
                </p>
              </div>
            </div>

            {/* Capability 4 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <Mic className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-2">
                  Voice & Languages
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Speak questions naturally in English or French with speech-to-text and audio answer playback.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. BILINGUAL & VOICE HIGHLIGHT BANNER */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-blue-50/90 border border-blue-100 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-blue-200/80 text-[#1463F3] text-xs font-semibold mb-3">
              <Languages className="w-3.5 h-3.5" />
              <span>English & French Voice Interaction</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-2">
              Speak or type your questions in English or French
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              My UB Guide transcribes spoken questions and reads answers aloud using Google Speech technology.
            </p>
          </div>

          <button
            type="button"
            onClick={handleStart}
            className="px-6 py-3 rounded-xl bg-[#1463F3] hover:bg-[#104fc2] text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
          >
            Try Voice Interaction
          </button>

        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="mt-auto bg-slate-50 border-t border-slate-200/80 py-8 px-4 sm:px-8 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1463F3] text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-[#0F172A] text-sm">My UB Guide</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500">University of Buea Assistant</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 font-medium">
            <button
              type="button"
              onClick={() => navigateTo('/about')}
              className="hover:text-[#1463F3] transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => navigateTo('/privacy')}
              className="hover:text-[#1463F3] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => navigateTo('/help')}
              className="hover:text-[#1463F3] transition-colors cursor-pointer"
            >
              Help & Support
            </button>
          </div>

          <div className="text-slate-400">
            © 2026 My UB Guide. All rights reserved.
          </div>

        </div>
      </footer>
    </div>
  );
};
