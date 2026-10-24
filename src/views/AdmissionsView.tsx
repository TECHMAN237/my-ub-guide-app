import React, { useState } from 'react';
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
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#17233B] tracking-tight">
            Admission Information
          </h1>
          <p className="text-xs text-slate-500">
            Official guidelines, criteria, and procedures for 2025/2026 admissions.
          </p>
        </div>
      </div>

      {/* Level Filter Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-100 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setLevel('undergraduate')}
          className={`py-2 text-xs font-semibold rounded-lg transition-all ${
            level === 'undergraduate'
              ? 'bg-[#1463F3] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Undergraduate
        </button>
        <button
          type="button"
          onClick={() => setLevel('postgraduate')}
          className={`py-2 text-xs font-semibold rounded-lg transition-all ${
            level === 'postgraduate'
              ? 'bg-[#1463F3] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Postgraduate
        </button>
      </div>

      {/* Checklist Action Card */}
      <div
        onClick={() => navigateTo('/admissions/checklist')}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 mb-4 flex items-center justify-between cursor-pointer hover:shadow-xs transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1463F3] text-white flex items-center justify-center shadow-xs">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#17233B] group-hover:text-[#1463F3] transition-colors">
              Interactive Application Checklist
            </h2>
            <p className="text-xs text-slate-600">
              Track required documents, dates, and application milestones.
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#1463F3] group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* Admission Sections List */}
      <div className="space-y-3">
        {/* Section 1: Admission Requirements */}
        <div className="bg-white border border-[#E1E8F2] rounded-2xl overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('requirements')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1463F3] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17233B]">Admission requirements</h3>
                <p className="text-xs text-slate-500">Entry qualifications and documents</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedSection === 'requirements' ? 'rotate-90' : ''}`} />
          </button>

          {expandedSection === 'requirements' && (
            <div className="p-4 pt-1 border-t border-slate-100 text-xs text-slate-600 space-y-2 bg-[#F6F8FC]/50">
              <p className="font-semibold text-slate-800">
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
        <div className="bg-white border border-[#E1E8F2] rounded-2xl overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('apply')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17233B]">How to apply</h3>
                <p className="text-xs text-slate-500">Step-by-step application process</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedSection === 'apply' ? 'rotate-90' : ''}`} />
          </button>

          {expandedSection === 'apply' && (
            <div className="p-4 pt-1 border-t border-slate-100 text-xs text-slate-600 space-y-2 bg-[#F6F8FC]/50">
              <ol className="list-decimal pl-5 space-y-1.5">
                <li><strong className="text-slate-800">Online Registration:</strong> Visit portal.uniguide.edu.cm and create an applicant profile.</li>
                <li><strong className="text-slate-800">Application Fee:</strong> Pay the 10,000 FCFA processing fee via mobile money or partner bank.</li>
                <li><strong className="text-slate-800">Document Upload:</strong> Upload clear scans of your birth certificate, result slips, and ID card.</li>
                <li><strong className="text-slate-800">Dossier Submission:</strong> Deposit physical copies of your documents at the respective Faculty Registry before the deadline.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Section 3: Application Deadlines */}
        <div className="bg-white border border-[#E1E8F2] rounded-2xl overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('deadlines')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17233B]">Application deadlines</h3>
                <p className="text-xs text-slate-500">Important dates for 2025/2026 session</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedSection === 'deadlines' ? 'rotate-90' : ''}`} />
          </button>

          {expandedSection === 'deadlines' && (
            <div className="p-4 pt-1 border-t border-slate-100 text-xs text-slate-600 space-y-2 bg-[#F6F8FC]/50">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="font-medium text-slate-700">Online Applications Open</span>
                <span className="font-semibold text-[#1463F3]">1 August 2025</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="font-medium text-slate-700">Health Sciences Deadline</span>
                <span className="font-semibold text-red-600">20 September 2025</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="font-medium text-slate-700">General Undergraduate Deadline</span>
                <span className="font-semibold text-red-600">30 September 2025</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium text-slate-700">Postgraduate Application Deadline</span>
                <span className="font-semibold text-amber-600">15 October 2025</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: FAQs */}
        <div className="bg-white border border-[#E1E8F2] rounded-2xl overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('faqs')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17233B]">Frequently asked questions</h3>
                <p className="text-xs text-slate-500">Common admission questions</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedSection === 'faqs' ? 'rotate-90' : ''}`} />
          </button>

          {expandedSection === 'faqs' && (
            <div className="p-4 pt-1 border-t border-slate-100 text-xs text-slate-600 space-y-2.5 bg-[#F6F8FC]/50">
              <div>
                <p className="font-bold text-slate-800">Can I apply with awaiting GCE results?</p>
                <p className="text-slate-600 mt-0.5">Yes, provisional applications are accepted pending official release of national results.</p>
              </div>
              <div>
                <p className="font-bold text-slate-800">Is English fluency mandatory?</p>
                <p className="text-slate-600 mt-0.5">The university is bilingual. Courses in Science and Engineering are taught in English with bilingual tutorial support.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
