import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdmissionsChecklistView: React.FC = () => {
  const { goBack, checklist, toggleChecklistItem } = useApp();

  const completed = checklist.filter((item) => item.completed).length;
  const progress = checklist.length > 0 ? Math.round((completed / checklist.length) * 100) : 0;

  const documents = [
    'Photocopy of national identity card or passport',
    'Result slips for GCE Ordinary and Advanced Level',
    'Passport-sized photograph',
    'Statement of purpose',
    'Recommendation letters',
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
          <h1 className="page-title text-ink">Application checklist</h1>
          <p className="page-lede mt-1">Track what you have done and what is still open.</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[14px] text-muted">Progress</p>
          <p className="tnum text-[14px] font-medium text-ink">
            {completed} of {checklist.length} steps done
          </p>
        </div>
        <div
          className="bar-track mt-2"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Application progress"
        >
          <div className="bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <ol className="mt-6">
        {checklist.map((item, index) => (
          <li key={item.id} className="flex items-start gap-3 border-t border-rule py-4 first:border-t-0">
            <button
              type="button"
              onClick={() => toggleChecklistItem(item.id)}
              aria-pressed={item.completed}
              aria-label={
                item.completed
                  ? `Mark "${item.title}" as not done`
                  : `Mark "${item.title}" as done`
              }
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] border transition-colors ${
                item.completed
                  ? 'border-accent bg-accent text-white'
                  : 'border-muted bg-transparent text-transparent hover:border-ink'
              }`}
            >
              <Check className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="flex items-baseline gap-2 text-[16px] font-medium text-ink">
                <span className="tnum text-[14px] text-muted">{index + 1}.</span>
                <span className={item.completed ? 'line-through' : ''}>{item.title}</span>
              </p>
              <p className="mt-0.5 text-[14px] leading-relaxed text-muted">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-8">
        <h2 className="text-[18px] font-semibold text-ink">Documents to prepare</h2>
        <ul className="mt-1">
          {documents.map((doc) => (
            <li key={doc} className="border-t border-rule py-3 text-[16px] text-ink">
              {doc}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
