"""Write the new ProgramDetailView.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'ProgramDetailView.tsx'))

JSX = r'''import React from 'react';
import { ArrowLeft, Bookmark, ChevronRight, Check, Calendar, CreditCard, FileText, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_PROGRAMS } from '../data/mockData';

export const ProgramDetailView: React.FC = () => {
  const { goBack, navigateTo, programs } = useApp();
  const program = programs.find((p) => p.id === window.location.pathname.split('/')[2]) || programs[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={goBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-ink hover:bg-raised transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => navigateTo('/programs')}
          className="text-xs font-semibold text-accent hover:underline"
        >
          Programs
        </button>
      </div>

      {/* Program Header Card */}
      <div className="bg-surface border border-ink/10 rounded-3xl p-5 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-ink leading-tight truncate">{program.name}</h1>
            <p className="text-sm text-ink font-semibold mt-1">{program.degreeType}</p>
            <p className="text-xs text-muted">{program.facultyName} • {program.departmentName}</p>
            <p className="text-xs text-muted mt-1">{program.duration} • {program.mode}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-xs font-semibold text-accent bg-accent-soft px-2.5 py-1 rounded-full border border-ink/10">
            {program.facultyName}
          </span>
          <span className="text-xs font-semibold text-accent bg-accent-soft px-2.5 py-1 rounded-full border border-ink/10">
            {program.departmentName}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-0.5">Annual Tuition</p>
            <p className="font-bold text-ink">{program.annualFee.toLocaleString()} {program.currency}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-0.5">Credits</p>
            <p className="font-bold text-ink">30–36 per semester</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-0.5">Duration</p>
            <p className="font-bold text-ink">{program.duration}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-0.5">Entry</p>
            <p className="font-bold text-ink">{program.entryQualifications}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => navigateTo('/fees')}
          className="bg-surface border border-ink/10 rounded-2xl p-4 text-left hover:border-accent transition-all shadow-2xs group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-2">
            <CreditCard className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-ink">Fees</p>
          <p className="text-[10px] text-muted">Schedules & Banks</p>
        </button>
        <button
          type="button"
          onClick={() => navigateTo('/academic-calendar')}
          className="bg-surface border border-ink/10 rounded-2xl p-4 text-left hover:border-accent transition-all shadow-2xs group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-2">
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-ink">Calendar</p>
          <p className="text-[10px] text-muted">Key dates</p>
        </button>
        <button
          type="button"
          onClick={() => navigateTo('/resources')}
          className="bg-surface border border-ink/10 rounded-2xl p-4 text-left hover:border-accent transition-all shadow-2xs group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-2">
            <FileText className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-ink">Resources</p>
          <p className="text-[10px] text-muted">Handbooks</p>
        </button>
      </div>

      {/* Description */}
      <div className="bg-surface border border-ink/10 rounded-3xl p-5 shadow-2xs">
        <h2 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Program Overview</h2>
        <p className="text-sm text-ink leading-relaxed">{program.description}</p>
      </div>

      {/* Admission Checklist */}
      <div className="bg-surface border border-ink/10 rounded-3xl p-5 shadow-2xs">
        <h2 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Admission Checklist</h2>
        <ul className="space-y-2.5">
          {['Check entry qualifications', 'Prepare supporting documents', 'Submit online application', 'Attend an interview (if required)'].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink">
              <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
