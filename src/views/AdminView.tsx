import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminView: React.FC = () => {
  const { goBack, resetAllData, simulateAiFailure, setSimulateAiFailure, navigateTo } = useApp();

  const sections = [
    {
      title: 'Content',
      rows: [
        { label: 'Programmes', detail: 'Programme data used across the guide', route: '/programs' },
        { label: 'Resources', detail: 'Handbooks, regulations and guides', route: '/resources' },
        { label: 'Faculties and departments', detail: 'Academic units', route: '/departments' },
      ],
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 pb-28 pt-4 sm:px-8 md:pb-16">
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
          <h1 className="page-title text-ink">Demo controls</h1>
          <p className="page-lede mt-1">
            Tools for testing this demonstration, not part of the student experience.
          </p>
        </div>
      </div>

      {sections.map((section) => (
        <section key={section.title} className="mt-8">
          <h2 className="text-[18px] font-semibold text-ink">{section.title}</h2>
          <div className="mt-1">
            {section.rows.map((row) => (
              <button
                key={row.route}
                type="button"
                onClick={() => navigateTo(row.route)}
                className="row-link w-full text-left"
              >
                <span className="min-w-0">
                  <span className="block text-[16px] text-ink">{row.label}</span>
                  <span className="block text-[14px] text-muted">{row.detail}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-8 border-t border-rule pt-5">
        <h2 className="text-[18px] font-semibold text-ink">AI failure simulation</h2>
        <p className="measure mt-1 text-[16px] leading-relaxed text-muted">
          {simulateAiFailure
            ? 'Simulation is on. Questions will fail so the error state can be checked.'
            : 'Simulation is off. Questions are sent to the model normally.'}
        </p>
        <button
          type="button"
          onClick={() => setSimulateAiFailure(!simulateAiFailure)}
          aria-pressed={simulateAiFailure}
          className="btn btn-secondary mt-3"
        >
          {simulateAiFailure ? 'Turn simulation off' : 'Turn simulation on'}
        </button>
      </section>

      <section className="mt-8 border-t border-rule pt-5">
        <h2 className="text-[18px] font-semibold text-ink">Reset</h2>
        <p className="measure mt-1 text-[16px] leading-relaxed text-muted">
          Removes locally stored profiles, conversations, saved items and checklist progress, then
          restores the demo data.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset all demo data? This cannot be undone.')) {
              resetAllData();
            }
          }}
          className="btn btn-secondary mt-3"
        >
          Reset demo data
        </button>
      </section>
    </div>
  );
};
