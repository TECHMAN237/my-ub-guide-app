import React, { useState } from 'react';
import { ArrowLeft, ArrowUpDown, Check, X, Bot } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_PROGRAMS } from '../data/mockData';

export const ProgramComparisonView: React.FC = () => {
  const { goBack, navigateTo, sendMessage } = useApp();
  const [prog1Id, setProg1Id] = useState('prog-cs');
  const [prog2Id, setProg2Id] = useState('prog-se');

  const p1 = INITIAL_PROGRAMS.find((p) => p.id === prog1Id) || INITIAL_PROGRAMS[0];
  const p2 = INITIAL_PROGRAMS.find((p) => p.id === prog2Id) || INITIAL_PROGRAMS[1];

  const handleAskAICompare = async () => {
    navigateTo('/chat');
    await sendMessage(`Please compare the ${p1.name} program and the ${p2.name} program in terms of admission difficulty, curriculum focus, tuition costs, and career prospects.`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      {/* Header */}
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
            Compare Programmes
          </h1>
          <p className="text-xs text-slate-500">Side-by-side curriculum, tuition, and qualification analysis</p>
        </div>
      </div>

      {/* Program Selectors */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">First Programme</label>
          <select
            value={prog1Id}
            onChange={(e) => setProg1Id(e.target.value)}
            className="w-full bg-white border border-[#E1E8F2] rounded-xl px-2.5 py-2 text-xs font-semibold text-[#102A56] focus:outline-hidden focus:border-[#1463F3]"
          >
            {INITIAL_PROGRAMS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Second Programme</label>
          <select
            value={prog2Id}
            onChange={(e) => setProg2Id(e.target.value)}
            className="w-full bg-white border border-[#E1E8F2] rounded-xl px-2.5 py-2 text-xs font-semibold text-[#102A56] focus:outline-hidden focus:border-[#1463F3]"
          >
            {INITIAL_PROGRAMS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Matrix Cards */}
      <div className="space-y-3">
        {/* Row 1: Faculty & Department */}
        <div className="bg-white border border-[#E1E8F2] rounded-2xl p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Faculty & Department</span>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-[#102A56]">{p1.facultyName}</p>
              <p className="text-[11px] text-slate-500">{p1.departmentName}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#102A56]">{p2.facultyName}</p>
              <p className="text-[11px] text-slate-500">{p2.departmentName}</p>
            </div>
          </div>
        </div>

        {/* Row 2: Qualification & Duration */}
        <div className="bg-white border border-[#E1E8F2] rounded-2xl p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Qualification & Duration</span>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-[#1463F3]">{p1.degreeType}</p>
              <p className="text-[11px] text-slate-600 font-medium">{p1.duration} ({p1.mode})</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#1463F3]">{p2.degreeType}</p>
              <p className="text-[11px] text-slate-600 font-medium">{p2.duration} ({p2.mode})</p>
            </div>
          </div>
        </div>

        {/* Row 3: Tuition & Fees */}
        <div className="bg-white border border-[#E1E8F2] rounded-2xl p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Annual Tuition Scale</span>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-extrabold text-[#102A56]">
                {p1.annualFee.toLocaleString()} {p1.currency}
              </p>
              <p className="text-[10px] text-slate-400">Regular Session</p>
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#102A56]">
                {p2.annualFee.toLocaleString()} {p2.currency}
              </p>
              <p className="text-[10px] text-slate-400">Regular Session</p>
            </div>
          </div>
        </div>

        {/* Row 4: Entry Requirements */}
        <div className="bg-white border border-[#E1E8F2] rounded-2xl p-4 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Entry Qualifications</span>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
            <div>
              <p className="leading-relaxed">{p1.entryQualifications}</p>
            </div>
            <div>
              <p className="leading-relaxed">{p2.entryQualifications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Comparison CTA */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleAskAICompare}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#102A56] to-[#1463F3] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
        >
          <Bot className="w-4 h-4" />
          <span>Ask XENA AI to analyze differences and recommend one</span>
        </button>
      </div>
    </div>
  );
};
