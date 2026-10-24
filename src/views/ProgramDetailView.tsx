import React, { useState } from 'react';
import { ArrowLeft, Bookmark, Bot, CheckCircle2, DollarSign, Clock, Globe2, Sparkles, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_PROGRAMS } from '../data/mockData';

export const ProgramDetailView: React.FC = () => {
  const { routeParams, goBack, navigateTo, isItemSaved, saveItem, removeItem, sendMessage } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'fees'>('overview');

  const programId = routeParams?.programId || 'prog-cs';
  const program = INITIAL_PROGRAMS.find((p) => p.id === programId) || INITIAL_PROGRAMS[0];

  const isSaved = isItemSaved('program', program.id);

  const handleToggleSave = () => {
    if (isSaved) {
      removeItem(program.id);
    } else {
      saveItem({
        type: 'program',
        title: program.name,
        subtitle: `${program.degreeType} • ${program.facultyName}`,
        data: program
      });
    }
  };

  const handleAskAI = async () => {
    navigateTo('/chat');
    await sendMessage(`Tell me more about the ${program.name} program in the ${program.facultyName}, including duration, career paths, and admission requirements.`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSaved
                ? 'bg-[#1463F3] text-white border-[#1463F3]'
                : 'bg-white text-slate-700 border-[#E1E8F2] hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('/program-comparison')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-[#E1E8F2] hover:bg-slate-50"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Compare</span>
          </button>
        </div>
      </div>

      {/* Program Hero Title Card */}
      <div className="bg-gradient-to-br from-[#102A56] via-[#144796] to-[#1463F3] text-white rounded-3xl p-6 mb-5 shadow-sm">
        <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-md">
          {program.facultyName}
        </span>
        <h1 className="text-2xl font-bold tracking-tight mt-2 mb-1 text-white">
          {program.name}
        </h1>
        <p className="text-xs text-blue-100/90 leading-relaxed max-w-lg">
          {program.overview}
        </p>

        {/* Quick specs pill bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/15 text-xs">
          <div>
            <span className="text-[10px] text-blue-200 block">Degree Type</span>
            <span className="font-semibold text-white">{program.degreeType}</span>
          </div>
          <div>
            <span className="text-[10px] text-blue-200 block">Duration</span>
            <span className="font-semibold text-white">{program.duration}</span>
          </div>
          <div>
            <span className="text-[10px] text-blue-200 block">Language</span>
            <span className="font-semibold text-white">{program.language}</span>
          </div>
          <div>
            <span className="text-[10px] text-blue-200 block">Study Mode</span>
            <span className="font-semibold text-white">{program.mode}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E1E8F2] mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-[#1463F3] text-[#1463F3]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('requirements')}
          className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-all ${
            activeTab === 'requirements'
              ? 'border-[#1463F3] text-[#1463F3]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Requirements
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('fees')}
          className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-all ${
            activeTab === 'fees'
              ? 'border-[#1463F3] text-[#1463F3]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Fees & Aid
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E1E8F2] rounded-2xl p-4 shadow-2xs">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                About the Programme
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {program.description}
              </p>

              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Career Opportunities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {program.careerOpportunities.map((career, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2 text-xs text-slate-700 bg-[#F6F8FC] p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{career}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requirements' && (
          <div className="bg-white border border-[#E1E8F2] rounded-2xl p-4 shadow-2xs space-y-3">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Admission Requirements
            </h2>
            <div className="space-y-2">
              {program.requirements.map((req, rIdx) => (
                <div key={rIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#1463F3] font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {rIdx + 1}
                  </span>
                  <span className="pt-0.5 leading-normal">{req}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Application Deadline: </span>
              {program.applicationDeadline}
            </div>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="bg-white border border-[#E1E8F2] rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E8F2]">
              <div>
                <span className="text-[11px] text-slate-400 block">Total Annual Fees</span>
                <span className="text-xl font-bold text-[#102A56]">
                  {program.annualFee.toLocaleString()} {program.currency}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                Official Scale 2025/2026
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span>Tuition Fee</span>
                <span className="font-semibold">250,000 FCFA</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span>Development & Infrastructure</span>
                <span className="font-semibold">25,000 FCFA</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span>Library, Tech & Medical Coverage</span>
                <span className="font-semibold">15,000 FCFA</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic pt-2">
              Source: {program.officialSource}
            </p>
          </div>
        )}
      </div>

      {/* Floating Bottom Sticky Bar */}
      <div className="fixed bottom-16 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#E1E8F2] z-30">
        <div className="max-w-2xl mx-auto flex gap-2">
          <button
            type="button"
            onClick={handleAskAI}
            className="flex-1 h-11 rounded-xl bg-[#EEF5FF] hover:bg-blue-100 text-[#1463F3] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI About This Program</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('/admissions/checklist')}
            className="flex-1 h-11 rounded-xl bg-[#1463F3] hover:bg-[#104fc2] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            <span>View Admission Checklist</span>
          </button>
        </div>
      </div>
    </div>
  );
};
