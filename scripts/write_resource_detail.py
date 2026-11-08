"""Write the new ResourceDetailView.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'ResourceDetailView.tsx'))

JSX = r'''import React from 'react';
import { ArrowLeft, FileText, Download, Calendar, Users, Bookmark } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ResourceDetailView: React.FC = () => {
  const { goBack, navigateTo } = useApp();
  const resourceId = window.location.pathname.split('/')[2];
  const resources = {
    'res-course-reg': {
      title: 'Course Registration Guide',
      icon: FileText,
      description: 'A comprehensive guide to registering for courses at the University of Buea. Covers the registration process, credit rules, validation, and academic progression.',
      content: 'Course registration is a critical academic activity that determines your enrollment for a given semester. Students must register for the required number of credits as specified by their faculty and academic level.',
      keywords: ['registration', 'credit rules', 'validation'],
    },
    'res-credit-system': {
      title: 'Credit System & GPA',
      icon: Users,
      description: 'Understanding the credit system, credit limits, extra load rules, and GPA calculation at UB.',
      content: 'The standard registration limit is 30 to 36 credits per academic session. Students with a Cumulative GPA of 3.0 or higher may apply for an overload of up to 42 credits with Dean approval.',
      keywords: ['credit limits', 'GPA', 'academic progress'],
    },
    'res-student-handbook': {
      title: 'Student Handbook',
      icon: Download,
      description: 'The official University of Buea student handbook for the 2025/2026 session.',
      content: 'The Student Handbook is the authoritative reference for all academic regulations, policies, and procedures at the University of Buea. All students are expected to be familiar with its contents.',
      keywords: ['handbook', 'regulations', 'policy'],
    },
    'res-academic-calendar': {
      title: 'Academic Calendar',
      icon: Calendar,
      description: 'Key dates, exams, and milestones for the 2025/2026 academic year.',
      content: 'The academic calendar outlines all important dates including registration periods, exam schedules, holidays, and graduation dates for the 2025/2026 session.',
      keywords: ['calendar', 'exams', 'deadlines'],
    },
    'res-honor-code': {
      title: 'Academic Integrity & Honor Code',
      icon: FileText,
      description: 'Rules and procedures governing academic integrity at UB.',
      content: 'The University of Buea is committed to academic integrity. All students must adhere to the principles of honesty, fairness, and respect in all academic work.',
      keywords: ['academic integrity', 'honor code', 'plagiarism'],
    },
    'res-support': {
      title: 'Student Support Services',
      icon: Users,
      description: 'Counselling, disability support, and career guidance services at UB.',
      content: 'UB provides comprehensive student support services including academic advising, counselling, disability support, and career guidance to help students succeed.',
      keywords: ['support', 'counselling', 'career'],
    },
  };

  const resource = resourceId in resources ? resources[resourceId] : resources['res-course-reg'];
  const Icon = resource.icon;

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
          <h1 className="text-xl font-bold text-ink tracking-tight">{resource.title}</h1>
          <p className="text-xs text-muted">{resource.description}</p>
        </div>
      </div>

      <div className="bg-surface border border-ink/10 rounded-3xl p-5 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted leading-relaxed">{resource.content}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-ink/10 rounded-3xl p-5 shadow-2xs">
        <h2 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Quick Links</h2>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => navigateTo('/fees')}
            className="w-full flex items-center gap-2 text-xs font-semibold text-ink hover:text-accent transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5 text-muted" />
            <span>Fee Schedules & Payment</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('/academic-calendar')}
            className="w-full flex items-center gap-2 text-xs font-semibold text-ink hover:text-accent transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-muted" />
            <span>Academic Calendar</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('/departments')}
            className="w-full flex items-center gap-2 text-xs font-semibold text-ink hover:text-accent transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-muted" />
            <span>Faculties & Departments</span>
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
