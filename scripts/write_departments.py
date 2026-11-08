"""Write the new DepartmentsView.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'DepartmentsView.tsx'))

JSX = r'''import React from 'react';
import { ArrowLeft, GraduationCap, BookOpen, Users, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_FACULTIES } from '../data/mockData';

export const DepartmentsView: React.FC = () => {
  const { goBack, navigateTo } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-28 space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-ink hover:bg-raised transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">Faculties & Departments</h1>
          <p className="text-xs text-muted">Explore all academic faculties and departments at the University of Buea.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {INITIAL_FACULTIES.map((faculty) => {
          const hasDepartments = faculty.departments && faculty.departments.length > 0;
          return (
            <div
              key={faculty.id}
              className="bg-surface border border-ink/10 rounded-2xl p-4 shadow-2xs hover:border-accent transition-all cursor-pointer group"
              onClick={() => hasDepartments ? navigateTo('/departments/' + faculty.id) : undefined}
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5.5 h-5.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-bold text-ink truncate">{faculty.name}</h2>
                  <p className="text-[11px] text-muted">{faculty.description}</p>
                  {hasDepartments && (
                    <p className="text-[11px] text-muted mt-1">{faculty.departments.length} departments</p>
                  )}
                </div>
              </div>
              {hasDepartments && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {faculty.departments.slice(0, 3).map((d) => (
                    <span key={d.id} className="text-[10px] font-semibold text-muted bg-raised px-2 py-0.5 rounded-full">{d.name}</span>
                  ))}
                  {faculty.departments.length > 3 && (
                    <span className="text-[10px] font-semibold text-muted">+{faculty.departments.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
