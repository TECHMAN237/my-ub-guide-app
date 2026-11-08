import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdmissionsView: React.FC = () => {
  const { navigateTo, goBack } = useApp();
  const [level, setLevel] = useState<'undergraduate' | 'postgraduate'>('undergraduate');
  const [expandedSection, setExpandedSection] = useState<string | null>('requirements');

  const toggleSection = (id: string) => {
    setExpandedSection((prev) => (prev === id ? null : id));
  };

  const sections = [
    {
      id: 'requirements',
      title: 'Admission requirements',
      summary: 'Entry qualifications and documents',
      content:
        level === 'undergraduate' ? (
          <ul className="space-y-2">
            <li>
              At least two GCE Advanced Level passes, excluding Religious Studies, or a
              Baccalauréat in series C, D, A or TI.
            </li>
            <li>
              At least four GCE Ordinary Level passes, including English Language and Mathematics
              at grade C or above.
            </li>
            <li>
              Faculty prerequisites, for example Mathematics and Physics for Engineering and
              Computer Science, or Biology and Chemistry for Health Sciences.
            </li>
          </ul>
        ) : (
          <ul className="space-y-2">
            <li>A recognised bachelor’s degree in a related field, with at least Second Class Honours.</li>
            <li>Two confidential academic references from former lecturers.</li>
            <li>A statement of purpose describing your proposed research topic.</li>
          </ul>
        ),
    },
    {
      id: 'apply',
      title: 'How to apply',
      summary: 'The application process, step by step',
      content: (
        <ol className="space-y-2">
          <li>
            <span className="font-medium text-ink">Create a profile.</span> Register on the
            university application portal.
          </li>
          <li>
            <span className="font-medium text-ink">Pay the application fee.</span> The processing
            fee is paid by mobile money or at a partner bank.
          </li>
          <li>
            <span className="font-medium text-ink">Upload your documents.</span> Include your birth
            certificate, result slips and identity card.
          </li>
          <li>
            <span className="font-medium text-ink">Submit your dossier.</span> Deposit physical
            copies at your faculty registry before the deadline.
          </li>
        </ol>
      ),
    },
    {
      id: 'deadlines',
      title: 'Application deadlines',
      summary: 'Important dates for the 2025/2026 session',
      content: (
        <dl>
          {[
            ['Online applications open', '1 August 2025'],
            ['Health Sciences deadline', '20 September 2025'],
            ['General undergraduate deadline', '30 September 2025'],
            ['Postgraduate deadline', '15 October 2025'],
          ].map(([label, date]) => (
            <div
              key={label}
              className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-rule py-2 last:border-b-0"
            >
              <dt className="text-ink">{label}</dt>
              <dd className="tnum font-medium text-ink">{date}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      id: 'faqs',
      title: 'Common questions',
      summary: 'Two questions applicants ask most',
      content: (
        <div className="space-y-4">
          <div>
            <p className="font-medium text-ink">Can I apply while awaiting GCE results?</p>
            <p className="mt-0.5">
              Yes. Provisional applications are accepted until the national results are released.
            </p>
          </div>
          <div>
            <p className="font-medium text-ink">Is English fluency required?</p>
            <p className="mt-0.5">
              The university is bilingual. Science and Engineering courses are taught in English,
              with bilingual tutorial support.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[880px] px-5 pb-28 pt-4 sm:px-8 md:pb-16">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={goBack}
          className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-ink"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 pt-1">
          <h1 className="page-title text-ink">Admissions</h1>
          <p className="page-lede mt-1">
            Entry criteria and application steps for the 2025/2026 session.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(['undergraduate', 'postgraduate'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setLevel(value)}
            aria-pressed={level === value}
            className="chip"
          >
            {value === 'undergraduate' ? 'Undergraduate' : 'Postgraduate'}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => navigateTo('/admissions/checklist')}
        className="row-link mt-4 w-full text-left"
      >
        <span>
          <span className="block text-[16px] font-medium text-ink">Application checklist</span>
          <span className="block text-[14px] text-muted">
            Track the documents and dates for your application.
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      </button>

      <div className="mt-4">
        {sections.map((section) => {
          const isOpen = expandedSection === section.id;
          return (
            <div key={section.id} className="border-t border-rule">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span>
                  <span className="block text-[16px] font-medium text-ink">{section.title}</span>
                  <span className="block text-[14px] text-muted">{section.summary}</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div className="measure pb-5 text-[16px] leading-relaxed text-muted">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
