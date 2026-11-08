"""Write the new ResourcesView.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'ResourcesView.tsx'))

JSX = r'''import React from 'react';
import { ArrowLeft, BookOpen, FileText, Users, GraduationCap, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ResourcesView: React.FC = () => {
  const { goBack, navigateTo } = useApp();

  const resources = [
    { id: 'res-course-reg', title: 'Course Registration Guide', type: 'guide', description: 'Step-by-step guide to registering for courses, credit rules, and validation.', icon: FileText },
    { id: 'res-credit-system', title: 'Credit System & GPA', type: 'guide', description: 'Understanding the credit system, credit limits, and GPA calculation.', icon: GraduationCap },
    { id: 'res-student-handbook', title: 'Student Handbook', type: 'document', description: 'The official University of Buea student handbook for the 2025/2026 session.', icon: Download },
    { id: 'res-academic-calendar', title: 'Academic Calendar', type: 'calendar', description: 'Key dates, exams, and milestones for the 2025/2026 academic year.', icon: GraduationCap },
    { id: 'res-honor-code', title: 'Academic Integrity & Honor Code', type: 'policy', description: 'Rules and procedures governing academic integrity at UB.', icon: FileText },
    { id: 'res-support', title: 'Student Support Services', type: 'service', description: 'Counselling, disability support, and career guidance services.', icon: Users },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-4">
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
          <h1 className="text-xl font-bold text-ink tracking-tight">Student Resources</h1>
          <p className="text-xs text-muted">Official guidelines, handbooks, and support services for UB students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {resources.map((res) => (
          <div
            key={res.id}
            className="bg-surface border border-ink/10 rounded-2xl p-4 shadow-2xs hover:border-accent transition-all cursor-pointer group"
            onClick={() => navigateTo(`/resources/${res.id}`)}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
                {res.icon === FileText && <FileText className="w-5 h-5" />}
                {res.icon === GraduationCap && <GraduationCap className="w-5 h-5" />}
                {res.icon === Download && <Download className="w-5 h-5" />}
                {res.icon === Users && <Users className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-ink truncate">{res.title}</h3>
                <p className="text-[11px] text-muted truncate">{res.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
