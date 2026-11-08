import React, { useState } from 'react';
import { ArrowLeft, Bot } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProgramComparisonView: React.FC = () => {
  const { goBack, navigateTo, sendMessage, programs } = useApp();
  const [prog1Id, setProg1Id] = useState('prog-cs');
  const [prog2Id, setProg2Id] = useState('prog-se');

  const p1 = programs.find((p) => p.id === prog1Id) || programs[0];
  const p2 = programs.find((p) => p.id === prog2Id) || programs[1] || programs[0];

  const handleAskAICompare = async () => {
    navigateTo('/chat');
    await sendMessage(
      `Compare the ${p1.name} programme and the ${p2.name} programme in terms of admission requirements, curriculum focus, tuition costs and career prospects.`
    );
  };

  const rows = [
    {
      label: 'Faculty',
      a: p1.facultyName,
      b: p2.facultyName,
      noteA: p1.departmentName,
      noteB: p2.departmentName,
    },
    {
      label: 'Qualification',
      a: p1.degreeType,
      b: p2.degreeType,
      noteA: `${p1.duration} · ${p1.mode}`,
      noteB: `${p2.duration} · ${p2.mode}`,
    },
    {
      label: 'Annual fees',
      a: `${p1.annualFee.toLocaleString()} ${p1.currency}`,
      b: `${p2.annualFee.toLocaleString()} ${p2.currency}`,
      tnum: true,
    },
    {
      label: 'Entry qualifications',
      a: p1.entryQualifications,
      b: p2.entryQualifications,
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
          <h1 className="page-title text-ink">Compare programmes</h1>
          <p className="page-lede mt-1">Two programmes, side by side.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="compare-first" className="mb-1 block text-[14px] font-medium text-ink">
            First programme
          </label>
          <select
            id="compare-first"
            value={prog1Id}
            onChange={(e) => setProg1Id(e.target.value)}
            className="field"
          >
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="compare-second" className="mb-1 block text-[14px] font-medium text-ink">
            Second programme
          </label>
          <select
            id="compare-second"
            value={prog2Id}
            onChange={(e) => setProg2Id(e.target.value)}
            className="field"
          >
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-[minmax(0,120px)_1fr_1fr] gap-4 border-b border-rule pb-2 text-[14px] text-muted sm:grid-cols-[minmax(0,180px)_1fr_1fr]">
          <span />
          <span className="truncate font-medium text-ink">{p1.name}</span>
          <span className="truncate font-medium text-ink">{p2.name}</span>
        </div>

        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[minmax(0,120px)_1fr_1fr] gap-4 border-b border-rule py-4 sm:grid-cols-[minmax(0,180px)_1fr_1fr]"
          >
            <span className="text-[14px] text-muted">{row.label}</span>
            <div>
              <p className={`text-[16px] leading-relaxed text-ink ${row.tnum ? 'tnum font-medium' : ''}`}>
                {row.a}
              </p>
              {row.noteA && <p className="mt-0.5 text-[14px] text-muted">{row.noteA}</p>}
            </div>
            <div>
              <p className={`text-[16px] leading-relaxed text-ink ${row.tnum ? 'tnum font-medium' : ''}`}>
                {row.b}
              </p>
              {row.noteB && <p className="mt-0.5 text-[14px] text-muted">{row.noteB}</p>}
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={handleAskAICompare} className="btn btn-primary mt-6">
        <Bot className="h-4 w-4" aria-hidden="true" />
        Ask for a recommendation
      </button>
    </div>
  );
};
