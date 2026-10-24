import React, { useState } from 'react';
import { ArrowLeft, Search, CreditCard, ShieldCheck, HelpCircle, Bot, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FeesView: React.FC = () => {
  const { fees, goBack, navigateTo, sendMessage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('all');

  const filteredFees = fees.filter((f) => {
    const matchesSearch =
      f.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.facultyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFaculty = selectedFaculty === 'all' || f.facultyName === selectedFaculty;
    return matchesSearch && matchesFaculty;
  });

  const handleAskFeesAI = async (programName: string) => {
    navigateTo('/chat');
    await sendMessage(`What are the exact school fees, installment payment deadlines, and bank details for ${programName}?`);
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-5 py-3 sm:py-4 pb-28">
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
            School Fees Guide
          </h1>
          <p className="text-xs text-slate-500">Official 2025/2026 tuition scale & payment schedules</p>
        </div>
      </div>

      {/* Official Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#1463F3] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <span className="font-bold text-[#102A56] block mb-0.5">Ministerial Approved Tuition Scale</span>
          Fees can be settled in two installments via partner banks (Afriland First Bank, UBA) or the student online MoMo portal. Never make cash payments to individuals.
        </div>
      </div>

      {/* Search & Faculty Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by program..."
            className="w-full bg-white border border-[#E1E8F2] focus:border-[#1463F3] rounded-xl pl-9.5 pr-3 py-2 text-xs text-[#17233B] focus:outline-hidden"
          />
        </div>

        <select
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
          className="bg-white border border-[#E1E8F2] rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-hidden focus:border-[#1463F3]"
        >
          <option value="all">All Faculties</option>
          <option value="Faculty of Science">Faculty of Science</option>
          <option value="Faculty of Engineering">Faculty of Engineering</option>
          <option value="Faculty of Law">Faculty of Law</option>
          <option value="Faculty of Social and Management Sciences">Social & Management Sciences</option>
          <option value="Faculty of Health Sciences">Faculty of Health Sciences</option>
        </select>
      </div>

      {/* Fee Cards List */}
      <div className="space-y-4">
        {filteredFees.map((fee) => (
          <div
            key={fee.id}
            className="bg-white border border-[#E1E8F2] rounded-3xl p-5 shadow-2xs hover:shadow-xs transition-all"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-semibold text-[#1463F3] bg-[#EEF5FF] px-2 py-0.5 rounded-md">
                  {fee.facultyName}
                </span>
                <h3 className="text-base font-bold text-[#17233B] mt-1">
                  {fee.programName}
                </h3>
                <span className="text-[11px] text-slate-500 capitalize">{fee.level} Program</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Annual Fee</span>
                <span className="text-lg font-extrabold text-[#102A56]">
                  {fee.totalFee.toLocaleString()} {fee.currency}
                </span>
              </div>
            </div>

            {/* Structured Breakdown */}
            <div className="py-3 text-xs text-slate-600 space-y-1.5 border-b border-slate-100">
              <div className="flex justify-between">
                <span>Tuition</span>
                <span className="font-semibold text-slate-800">{fee.tuitionFee.toLocaleString()} {fee.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Development Fee</span>
                <span className="font-semibold text-slate-800">{fee.developmentFee.toLocaleString()} {fee.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Other Charges (Library, Medical, Tech)</span>
                <span className="font-semibold text-slate-800">{fee.otherCharges.toLocaleString()} {fee.currency}</span>
              </div>
            </div>

            {/* Payment Schedule & Deadlines */}
            <div className="pt-3 text-xs text-slate-600 space-y-1">
              <div>
                <strong className="text-slate-800">Schedule: </strong>
                <span>{fee.paymentSchedule}</span>
              </div>
              <div>
                <strong className="text-slate-800">Strict Deadline: </strong>
                <span className="text-red-600 font-semibold">{fee.deadline}</span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 truncate max-w-[200px]">Source: {fee.officialSource}</span>
              <button
                type="button"
                onClick={() => handleAskFeesAI(fee.programName)}
                className="text-xs font-semibold text-[#1463F3] hover:text-[#102A56] flex items-center gap-1 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask AI Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
