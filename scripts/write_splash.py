"""Write the new SplashView.tsx (taste-direction redesign)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'SplashView.tsx'))

JSX = r'''import React from 'react';
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
  Search,
  Building2,
  FileText,
  UserCheck,
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
    category: 'Admissions & Fees',
  },
  {
    id: 'credits',
    question: 'How many credits can an enrolled student register per semester?',
    answer: 'The standard registration limit is 30 to 36 credits per academic session. Students with a Cumulative GPA of 3.0 or higher may apply for an overload of up to 42 credits with Dean approval.',
    source: 'Academic Regulations, Section 4.2 (Credit System)',
    category: 'Academic Rules',
  },
  {
    id: 'programs',
    question: 'What undergraduate programs are offered in ASTI and FHS?',
    answer: 'ASTI offers Specialized Translation and Interpretation degrees. The Faculty of Health Sciences (FHS) offers Medicine (MD), Nursing Science, and Medical Laboratory Sciences.',
    source: 'University of Buea Program Catalog 2025/2026',
    category: 'Programs',
  },
];

export const SplashView: React.FC = () => {
  const { navigateTo, userProfile, setUserCategory } = useApp();
  const [activeDemo, setActiveDemo] = React.useState<DemoPrompt>(DEMO_PROMPTS[0]);

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
    <div className="min-h-screen bg-ground text-ink flex flex-col antialiased selection:bg-accent selection:text-white">
      {/* 1. TOP HEADER BAR — consistent 2-row brand */}
      <header className="sticky top-0 z-40 bg-surface border-b border-ink/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center shadow-xs shadow-ink">
              <GraduationCap className="w-5.5 h-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-ink whitespace-nowrap">
                My UB Guide
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
            <a href="#pathways" className="hover:text-accent transition-colors whitespace-nowrap">
              Pathways
            </a>
            <a href="#capabilities" className="hover:text-accent transition-colors whitespace-nowrap">
              Capabilities
            </a>
            <a href="#demo-assistant" className="hover:text-accent transition-colors whitespace-nowrap">
              AI Preview
            </a>
            <button
              type="button"
              onClick={() => navigateTo('/programs')}
              className="hover:text-accent transition-colors whitespace-nowrap cursor-pointer"
            >
              Explore Programs
            </button>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('/auth/login')}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-muted hover:text-accent hover:bg-raised rounded-xl transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleStart}
              className="px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-accent hover:bg-accent-edge rounded-xl transition-all shadow-xs shadow-accent shadow-2xs active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION — editorial, left-aligned, serif display */}
      <section className="relative pt-8 pb-12 sm:pt-16 sm:pb-20 px-4 sm:px-8 bg-gradient-to-b from-surface via-[#F8FAFC] to-[#F8FAFC] border-b border-ink/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Hero Column 1: Copy & Actions — left-aligned */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-soft border border-ink/10 text-accent text-xs font-semibold mb-6 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
              <span>Official University of Buea Information Assistant</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-ink tracking-tight leading-[1.15] mb-5">
              Your Journey at the University of Buea Starts Here.
            </h1>

            <p className="text-base sm:text-lg text-muted leading-relaxed mb-8 max-w-2xl">
              Get reliable guidance on programs, admissions, school fees, academic requirements, and university life — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-4">
              <button
                type="button"
                onClick={handleStart}
                className="h-12 sm:h-13 px-7 rounded-xl bg-accent hover:bg-accent-edge text-white font-semibold text-base flex items-center justify-center gap-2.5 shadow-md shadow-accent/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => navigateTo('/programs')}
                className="h-12 sm:h-13 px-6 rounded-xl bg-surface border border-ink/10 hover:bg-raised text-ink hover:text-accent font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <Search className="w-4.5 h-4.5 text-muted" />
                <span>Explore Programs</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm font-medium text-muted mb-8 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>For prospective and enrolled students · Free instant access</span>
            </p>

            <div className="pt-4 border-t border-ink/10 w-full flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-muted">
              <div className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-accent" />
                <span>Gemma AI Engine</span>
              </div>
              <span className="text-ink/30">·</span>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-accent" />
                <span>UB Regulations Grounded</span>
              </div>
              <span className="text-ink/30">·</span>
              <div className="flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-accent" />
                <span>English & French</span>
              </div>
            </div>
          </div>

          {/* Hero Column 2: Interactive Assistant Showcase Card — right-aligned */}
          <div id="demo-assistant" className="lg:col-span-5 w-full">
            <div className="bg-surface border border-ink rounded-2xl p-5 sm:p-6 shadow-xl shadow-ink">
              <div className="flex items-center justify-between pb-4 border-b border-ink/10 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-accent-soft text-accent flex items-center justify-center font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink">Gemma Assistant</h3>
                    <p className="text-[11px] text-muted">Live Knowledge Base Preview</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-soft text-accent text-xs font-medium border border-ink/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>Verified UB Source</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-muted mb-2">Click a sample question to test:</p>
                <div className="space-y-1.5">
                  {DEMO_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => setActiveDemo(prompt)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between gap-2 border cursor-pointer ${
                        activeDemo.id === prompt.id
                          ? 'bg-accent text-white border-accent shadow-2xs'
                          : 'bg-surface text-ink border-ink/10 hover:bg-raised'
                      }`}
                    >
                      <span className="truncate">{prompt.question}</span>
                      <Sparkles className={`w-3.5 h-3.5 shrink-0 ${activeDemo.id === prompt.id ? 'text-white/60' : 'text-muted'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-surface-border border border-ink/10 rounded-xl p-4 text-xs">
                <div className="flex items-center gap-2 text-muted font-semibold mb-2 text-[11px]">
                  <Bot className="w-3.5 h-3.5 text-accent" />
                  <span>Gemma Response</span>
                  <span className="text-ink/30">·</span>
                  <span className="text-muted">{activeDemo.category}</span>
                </div>
                <p className="text-ink/80 leading-relaxed font-normal mb-3">
                  &ldquo;{activeDemo.answer}&rdquo;
                </p>
                <div className="pt-2.5 border-t border-ink/10 flex items-center justify-between text-[11px] text-muted">
                  <div className="flex items-center gap-1 text-accent font-medium truncate max-w-[220px]">
                    <FileText className="w-3 h-3 shrink-0" />
                    <span className="truncate">{activeDemo.source}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-muted">
                    <Volume2 className="w-3.5 h-3.5" />
                    <Languages className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-ink/10 text-center">
                <button
                  type="button"
                  onClick={handleStart}
                  className="text-xs font-bold text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"
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
      <section className="bg-surface border-y border-ink/10 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mb-1">30+</div>
            <div className="text-xs sm:text-sm font-medium text-muted">
              Faculties & Academic Departments
            </div>
          </div>
          <div className="p-3 border-l border-ink/10 lg:border-l">
            <div className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mb-1">50,000 FCFA</div>
            <div className="text-xs sm:text-sm font-medium text-muted">
              Official Subsidized Tuition Base
            </div>
          </div>
          <div className="p-3 border-l border-ink/10 lg:border-l">
            <div className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mb-1">100%</div>
            <div className="text-xs sm:text-sm font-medium text-muted">
              Grounded UB Regulations & Statutes
            </div>
          </div>
          <div className="p-3 border-l border-ink/10 lg:border-l">
            <div className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mb-1">EN & FR</div>
            <div className="text-xs sm:text-sm font-medium text-muted">
              Dual Language Voice & Text Guidance
            </div>
          </div>
        </div>
      </section>

      {/* 4. STUDENT PATHWAYS (Prospective vs Enrolled) */}
      <section id="pathways" className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
            Tailored Guidance for Your Needs
          </h2>
          <p className="text-sm sm:text-base text-muted">
            Select your status to personalize your assistant and access instant answers specific to your academic stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-surface border border-ink rounded-2xl p-6 sm:p-8 shadow-xs shadow-ink transition-all hover:shadow-md flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-2 group-hover:text-accent transition-colors">
                Prospective Students
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6">
                Explore degree programs, admission requirements, tuition fee structures, and application checklists for the University of Buea.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-ink mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>Program qualifications across 30+ departments</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>Official fee breakdowns (Cameroonian & Foreign)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>Step-by-step admission application checklists</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => handleSelectCategory('prospective')}
              className="w-full h-11 rounded-xl bg-surface-border border border-ink/10 hover:bg-accent text-ink hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore as Prospective Student</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-surface border border-ink rounded-2xl p-6 sm:p-8 shadow-xs shadow-ink transition-all hover:shadow-md flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-raised text-muted flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-2 group-hover:text-accent transition-colors">
                Enrolled Students
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6">
                Get assistance with course registration limits, credit caps, continuous assessment rules, exam schedules, and department procedures.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-ink mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>Credit limits (30-36 credits, overload up to 42)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>Academic calendar, CA, and exam schedules</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>Grading schemes, CGPA calculation, and re-sits</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => handleSelectCategory('enrolled')}
              className="w-full h-11 rounded-xl bg-surface-border border border-ink/10 hover:bg-accent text-ink hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue as Enrolled Student</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. CORE PLATFORM CAPABILITIES */}
      <section id="capabilities" className="py-12 sm:py-16 px-4 sm:px-8 bg-surface-border border-t border-ink/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
              Everything You Need for Academic Success
            </h2>
            <p className="text-sm sm:text-base text-muted">
              Built specifically for the University of Buea community with verified institutional accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface border border-ink rounded-2xl p-6 shadow-xs shadow-ink transition-all hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-4">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2">Gemma AI Assistant</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Answers powered by Gemma and grounded directly in University of Buea regulations with citations.
                </p>
              </div>
            </div>
            <div className="bg-surface border border-ink rounded-2xl p-6 shadow-xs shadow-ink transition-all hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2">30+ Programs Catalog</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Detailed entry requirements, department listings, degree duration, and credit rules across all faculties.
                </p>
              </div>
            </div>
            <div className="bg-surface border border-ink rounded-2xl p-6 shadow-xs shadow-ink transition-all hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2">Fees & Checklists</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Official fee breakdown (50,000 FCFA local / 600,000 FCFA foreign) and interactive admission tracking.
                </p>
              </div>
            </div>
            <div className="bg-surface border border-ink rounded-2xl p-6 shadow-xs shadow-ink transition-all hover:shadow-md flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-4">
                  <Mic className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-ink mb-2">Voice & Languages</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Speak questions naturally in English or French with speech-to-text and audio answer playback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BILINGUAL & VOICE HIGHLIGHT BANNER */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-accent-soft/40 border border-ink/10 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-border border border-ink/10 text-accent text-xs font-semibold mb-3">
              <Languages className="w-3.5 h-3.5" />
              <span>English & French Voice Interaction</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-ink tracking-tight mb-2">
              Speak or type your questions in English or French
            </h3>
            <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
              My UB Guide transcribes spoken questions and reads answers aloud using Google Speech technology.
            </p>
          </div>
          <button
            type="button"
            onClick={handleStart}
            className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-edge text-white font-semibold text-sm shadow-md shadow-accent/20 transition-all shrink-0 cursor-pointer"
          >
            Try Voice Interaction
          </button>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="mt-auto bg-surface border-t border-ink/10 py-8 px-4 sm:px-8 text-muted text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-ink text-sm">My UB Guide</span>
            <span className="text-ink/30">·</span>
            <span className="text-muted">University of Buea Assistant</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-muted font-medium">
            <button type="button" onClick={() => navigateTo('/about')} className="hover:text-accent transition-colors cursor-pointer">
              About
            </button>
            <button type="button" onClick={() => navigateTo('/privacy')} className="hover:text-accent transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button type="button" onClick={() => navigateTo('/help')} className="hover:text-accent transition-colors cursor-pointer">
              Help & Support
            </button>
          </div>
          <div className="text-ink/30">
            © 2026 My UB Guide. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export const Bot = React.memo(({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <circle cx="9" cy="9" r="2" />
    <path d="M21 12h-5l-2 3l-2-3h-3" />
  </svg>
));
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
