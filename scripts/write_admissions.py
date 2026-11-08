"""Write the new AdmissionsView.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'AdmissionsView.tsx'))

JSX = r'''import React, { useState } from 'react';
import { FileText, Calendar, CheckSquare, HelpCircle, ChevronRight, FileCheck, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdmissionsView: React.FC = () => {
  const { navigateTo, goBack } = useApp();
  const [level, setLevel] = useState<'undergraduate' | 'postgraduate'>('undergraduate');
  const [expandedSection, setExpandedSection] = useState<string | null>('requirements');

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-5 py-3 sm:py-4 pb-28">
      {/* Top Header */}
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={goBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-ink hover:bg-raised transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">
            Admission Information
          </h1>
          <p className="text-xs text-muted">
            Official guidelines, criteria, and procedures for 2025/2026 admissions.
          </p>
        </div>
      </div>

      {/* Level Filter Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-4 bg-raised p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setLevel('undergraduate')}
          className={`py-2 text-xs font-semibold rounded-lg transition-all ${level === 'undergraduate' ? 'bg-accent text-white shadow-xs' : 'text-muted hover:text-ink'}`}
        >
          Undergraduate
        </button>
        <button
          type="button"
          onClick={() => setLevel('postgraduate')}
          className={`py-2 text-xs font-semibold rounded-lg transition-all ${level === 'postgraduate' ? 'bg-accent text-white shadow-xs' : 'text-muted hover:text-ink'}`}
        >
          Postgraduate
        </button>
      </div>

      {/* Checklist Action Card */}
      <div
        onClick={() => navigateTo('/admissions/checklist')}
        className="bg-accent-soft border border-ink/10 rounded-2xl p-4 mb-4 flex items-center justify-between cursor-pointer hover:shadow-xs transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center shadow-xs">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-ink group-hover:text-accent transition-colors">
              Interactive Application Checklist
            </h2>
            <p className="text-xs text-muted">
              Track required documents, dates, and application milestones.
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* Admission Sections List */}
      <div className="space-y-3">
        {/* Section 1: Admission Requirements */}
        <div className="bg-surface border border-ink/10 rounded-2xl overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('requirements')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-raised transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Admission requirements</h3>
                <p className="text-xs text-muted">Entry qualifications and documents</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-muted transition-transform ${expandedSection === 'requirements' ? 'rotate-90' : ''}`} />
          </button>

          {expandedSection === 'requirements' && (
            <div className="p-4 pt-1 border-t border-ink/10 text-xs text-muted space-y-2 bg-raised/60">
              <p className="font-semibold text-ink">
                {level === 'undergraduate' ? 'Undergraduate Entry Criteria:' : 'Postgraduate Entry Criteria:'}
              </p>
              {level === 'undergraduate' ? (
                <ul className="list-disc pl-5 space-y-1">
                  <li>At least 2 GCE Advanced Level passes (excluding Religious Studies) OR Baccalauréat (C, D, A, TI).</li>
                  <li>At least 4 GCE Ordinary Level passes including English Language and Mathematics at Grade C or above.</li>
                  <li>Faculty specific prerequisites (e.g. Mathematics/Physics for Engineering and Computer Science; Biology/Chemistry for Health Sciences).</li>
                </ul>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  <li>Recognized Bachelor's Degree in a related field with at least Second Class Honours (GPA &gt;= 3.0/4.0).</li>
                  <li>Two confidential academic letters of recommendation from former professors.</li>
                  <li>A 500-word Statement of Purpose explaining your proposed research topic.</li>
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Section 2: How to Apply */}
        <div className="bg-surface border border-ink/10 rounded-2xl overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('apply')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-raised transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">How to apply</h3>
                <p className="text-xs text-muted">Step-by-step application process</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-muted transition-transform ${expandedSection === 'apply' ? 'rotate-90' : ''}`} />
          </button>

          {expandedSection === 'apply' && (
            <div className="p-4 pt-1 border-t border-ink/10 text-xs text-muted space-y-2 bg-raised/60">
              <ol className="list-decimal pl-5 space-y-1.5">
                <li><strong className="text-ink">Online Registration:</strong> Visit portal.uniguide.edu.cm and create an applicant profile.</li>
                <li><strong className="text-ink">Application Fee:</strong> Pay the 10,000 FCFA processing fee via mobile money or partner bank.</li>
                <li><strong className="text-ink">Document Upload:</strong> Upload clear scans of your birth certificate, result slips, and ID card.</li>
                <li><strong className="text-ink">Dossier Submission:</strong> Deposit physical copies of your documents at the respective Faculty Registry before the deadline.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Section 3: Application Deadlines */}
        <div className="bg-surface border border-ink/10 rounded-2xl overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('deadlines')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-raised transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Application deadlines</h3>
                <p className="text-xs text-muted">Important dates for 2025/2026 session</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-muted transition-transform ${expandedSection === 'deadlines' ? 'rotate-90' : ''}`} />
          </button>

          {expandedSection === 'deadlines' && (
            <div className="p-4 pt-1 border-t border-ink/10 text-xs text-muted space-y-2 bg-raised/60">
              <div className="flex justify-between py-1 border-b border-ink/10">
                <span className="font-medium text-ink">Online Applications Open</span>
                <span className="font-semibold text-accent">1 August 2025</span>
              </div>
              <div className="flex justify-between py-1 border-b border-ink/10">
                <span className="font-medium text-ink">Health Sciences Deadline</span>
                <span className="font-semibold text-negative">20 September 2025</span>
              </div>
              <div className="flex justify-between py-1 border-b border-ink/10">
                <span className="font-medium text-ink">General Undergraduate Deadline</span>
                <span className="font-semibold text-negative">30 September 2025</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium text-ink">Postgraduate Application Deadline</span>
                <span className="font-semibold text-accent/80">15 October 2025</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: FAQs */}
        <div className="bg-surface border border-ink/10 rounded-2xl overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('faqs')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-raised transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Frequently asked questions</h3>
                <p className="text-xs text-muted">Common admission questions</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-muted transition-transform ${expandedSection === 'faqs' ? 'rotate-90' : ''}`} />
          </button>

          {expandedSection === 'faqs' && (
            <div className="p-4 pt-1 border-t border-ink/10 text-xs text-muted space-y-2.5 bg-raised/60">
              <div>
                <p className="font-bold text-ink">Can I apply with awaiting GCE results?</p>
                <p className="text-muted mt-0.5">Yes, provisional applications are accepted pending official release of national results.</p>
              </div>
              <div>
                <p className="font-bold text-ink">Is English fluency mandatory?</p>
                <p className="text-muted mt-0.5">The university is bilingual. Courses in Science and Engineering are taught in English with bilingual tutorial support.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
