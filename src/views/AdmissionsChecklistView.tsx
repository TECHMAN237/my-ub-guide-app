import React from 'react';
import { ArrowLeft, CheckCircle2, Circle, RefreshCw, Bot, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdmissionsChecklistView: React.FC = () => {
  const { checklist, toggleChecklistItem, resetChecklist, goBack, navigateTo, sendMessage } = useApp();

  const completedCount = checklist.filter((i) => i.completed).length;
  const totalCount = checklist.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleAskHelp = async () => {
    navigateTo('/chat');
    await sendMessage('Can you explain the exact required admission documents, submission steps, and deadlines for 2025/2026?');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
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

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset all checklist items to incomplete?')) {
              resetChecklist();
            }
          }}
          className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Progress Hero */}
      <div className="bg-gradient-to-r from-[#102A56] to-[#1463F3] text-white rounded-3xl p-5 mb-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
            Admission Readiness
          </span>
          <span className="text-sm font-bold text-white bg-white/20 px-2.5 py-0.5 rounded-full">
            {progressPercent}% Complete
          </span>
        </div>

        <h1 className="text-xl font-bold tracking-tight mb-2">
          Application Checklist
        </h1>
        <p className="text-xs text-blue-100/90 leading-relaxed mb-4">
          Complete each item before the deadline to ensure your application dossier is validly registered.
        </p>

        {/* Progress bar */}
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-[11px] text-blue-200 text-right mt-1.5 font-medium">
          {completedCount} of {totalCount} tasks completed
        </div>
      </div>

      {/* Checklist items list */}
      <div className="space-y-2.5 mb-6">
        {checklist.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleChecklistItem(item.id)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
              item.completed
                ? 'bg-emerald-50/50 border-emerald-200'
                : 'bg-white border-[#E1E8F2] hover:border-[#1463F3]'
            }`}
          >
            <button
              type="button"
              className="mt-0.5 shrink-0 focus:outline-hidden"
              aria-label={item.completed ? 'Mark incomplete' : 'Mark complete'}
            >
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300" />
              )}
            </button>

            <div className="flex-1">
              <h3
                className={`text-xs font-bold ${
                  item.completed ? 'text-slate-500 line-through' : 'text-[#17233B]'
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`text-[11px] mt-0.5 leading-normal ${
                  item.completed ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Assistant Help Card */}
      <div className="bg-white border border-[#E1E8F2] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1463F3] flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#17233B]">Need help with required documents?</h4>
            <p className="text-[11px] text-slate-500">Ask XENA AI to verify specific faculty requirements.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAskHelp}
          className="text-xs font-semibold bg-[#1463F3] text-white px-3 py-1.5 rounded-xl hover:bg-[#104fc2] transition-colors shrink-0"
        >
          Ask AI
        </button>
      </div>
    </div>
  );
};
