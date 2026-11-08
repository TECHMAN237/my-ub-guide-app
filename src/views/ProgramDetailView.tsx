import React, { useState } from 'react';
import { ArrowLeft, Bookmark, Bot } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProgramDetailView: React.FC = () => {
  const { routeParams, goBack, navigateTo, isItemSaved, saveItem, removeItem, sendMessage, programs } =
    useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'fees'>('overview');

  const programId = routeParams?.programId || 'prog-cs';
  const program = programs.find((p) => p.id === programId) || programs[0];

  const isSaved = isItemSaved('program', program.id);

  const handleToggleSave = () => {
    if (isSaved) {
      removeItem(program.id);
    } else {
      saveItem({
        type: 'program',
        title: program.name,
        subtitle: `${program.degreeType} · ${program.facultyName}`,
        data: program,
      });
    }
  };

  const handleAskAI = async () => {
    navigateTo('/chat');
    await sendMessage(
      `Tell me more about the ${program.name} programme in the ${program.facultyName}, including duration, career paths and admission requirements.`
    );
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'requirements' as const, label: 'Requirements' },
    { id: 'fees' as const, label: 'Fees' },
  ];

  return (
    <div className="mx-auto w-full max-w-[880px] px-5 pb-44 pt-4 sm:px-8 md:pb-28">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goBack}
          className="-ml-2 flex h-11 w-11 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-ink"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleSave}
            className={`flex h-11 items-center gap-1.5 rounded-[10px] px-3 text-[14px] font-medium transition-colors ${
              isSaved ? 'text-accent' : 'text-muted hover:bg-raised hover:text-ink'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => navigateTo('/program-comparison')}
            className="flex h-11 items-center rounded-[10px] px-3 text-[14px] font-medium text-muted transition-colors hover:bg-raised hover:text-ink"
          >
            Compare
          </button>
        </div>
      </div>

      <p className="mt-4 text-[14px] text-muted">{program.facultyName}</p>
      <h1 className="page-title mt-1 text-ink">{program.name}</h1>
      <p className="page-lede mt-2">{program.overview}</p>

      <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 border-y border-rule py-4 sm:grid-cols-4">
        {[
          ['Degree', program.degreeType],
          ['Duration', program.duration],
          ['Language', program.language],
          ['Mode', program.mode],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-[14px] text-muted">{label}</dt>
            <dd className="mt-0.5 text-[16px] text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex gap-1 border-b border-rule" role="tablist" aria-label="Programme detail">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-[44px] border-b-2 px-4 text-[14px] font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="measure">
            <h2 className="text-[18px] font-semibold text-ink">About the programme</h2>
            <p className="mt-2 text-[16px] leading-relaxed text-muted">{program.description}</p>

            <h2 className="mt-6 text-[18px] font-semibold text-ink">Career opportunities</h2>
            <ul className="mt-2 space-y-1.5 text-[16px] text-ink">
              {program.careerOpportunities.map((career, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-muted" aria-hidden="true" />
                  {career}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'requirements' && (
          <div className="measure">
            <h2 className="text-[18px] font-semibold text-ink">Admission requirements</h2>
            <ol className="mt-2 space-y-2">
              {program.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-[16px] text-ink">
                  <span className="tnum w-5 shrink-0 text-muted">{index + 1}.</span>
                  <span>{req}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 border-t border-rule pt-3 text-[14px] text-muted">
              Application deadline: <span className="text-ink">{program.applicationDeadline}</span>
            </p>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="measure">
            <h2 className="text-[18px] font-semibold text-ink">Annual fees</h2>
            <p className="tnum mt-2 text-[24px] font-semibold text-ink">
              {program.annualFee.toLocaleString()} {program.currency}
            </p>
            <p className="mt-1 text-[16px] text-muted">
              Official scale for the 2025/2026 academic year.
            </p>
            <button
              type="button"
              onClick={() => navigateTo('/fees')}
              className="mt-3 min-h-[44px] text-[14px] font-medium text-accent underline-offset-2 hover:underline"
            >
              See the full fee schedule
            </button>
            <p className="mt-5 border-t border-rule pt-3 text-[14px] text-muted">
              Source: {program.officialSource}
            </p>
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-rule bg-surface px-5 py-3 md:bottom-0">
        <div className="mx-auto flex max-w-[880px] gap-2">
          <button type="button" onClick={handleAskAI} className="btn btn-secondary flex-1">
            <Bot className="h-4 w-4" aria-hidden="true" />
            Ask about this programme
          </button>
          <button
            type="button"
            onClick={() => navigateTo('/admissions/checklist')}
            className="btn btn-primary flex-1"
          >
            Admission checklist
          </button>
        </div>
      </div>
    </div>
  );
};
