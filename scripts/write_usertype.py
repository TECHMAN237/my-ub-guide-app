"""Write the new UserTypeSelectionView.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'UserTypeSelectionView.tsx'))

JSX = r'''import React from 'react';
import { ArrowLeft, CheckCircle2, BookOpen, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserTypeSelectionView: React.FC = () => {
  const { navigateTo, setUserCategory } = useApp();

  const handleSelect = (category: 'prospective' | 'enrolled') => {
    setUserCategory(category);
    navigateTo('/setup/profile', { category });
  };

  return (
    <div className="min-h-screen bg-raised flex flex-col justify-center py-6 pb-28 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-semibold border border-ink/10 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official UB Assistant
          </span>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            Your journey at the University of Buea starts here.
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleSelect('prospective')}
            className="bg-surface border border-ink/10 rounded-3xl p-6 shadow-2xs hover:border-accent transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-2xl bg-accent-soft text-accent flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-ink mb-2">Prospective Student</h2>
            <p className="text-xs text-muted leading-relaxed mb-4">
              Explore degree programs, admission requirements, tuition fees, and application checklists.
            </p>
            <span className="text-xs font-semibold text-accent bg-accent-soft px-3 py-1 rounded-full border border-ink/10">
              Explore
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelect('enrolled')}
            className="bg-surface border border-ink/10 rounded-3xl p-6 shadow-2xs hover:border-accent transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-2xl bg-accent-soft text-accent flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-ink mb-2">Enrolled Student</h2>
            <p className="text-xs text-muted leading-relaxed mb-4">
              Get assistance with course registration, credit limits, exams, and department procedures.
            </p>
            <span className="text-xs font-semibold text-accent bg-accent-soft px-3 py-1 rounded-full border border-ink/10">
              Continue
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
