import React from 'react';
import { GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SplashView: React.FC = () => {
  const { navigateTo, userProfile } = useApp();

  const handleStart = () => {
    if (userProfile) {
      navigateTo('/home');
    } else {
      navigateTo('/setup/user-type');
    }
  };

  return (
    <div className="min-h-screen bg-radial from-[#1A365D] via-[#102A56] to-[#0B1A33] text-white flex flex-col justify-between p-6 sm:p-8">
      {/* Top spacing */}
      <div className="pt-8 flex justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1463F3] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#1463F3]/30">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Main Hero Card */}
      <div className="text-center max-w-sm mx-auto my-auto py-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          XENA AI
        </h1>
        <p className="text-lg font-medium text-blue-200 mb-6">
          Your University Information Assistant
        </p>

        {/* Value pills / claims */}
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-400 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full mx-auto w-fit border border-white/15">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Ask. Explore. Get Answers.</span>
        </div>

        <p className="text-xs text-blue-100/70 mt-6 leading-relaxed">
          Comprehensive guidance on programs, tuition fees, course registration, credit rules, and campus life.
        </p>
      </div>

      {/* Bottom CTA section */}
      <div className="max-w-sm mx-auto w-full pb-6">
        <button
          type="button"
          onClick={handleStart}
          className="w-full h-13 rounded-2xl bg-[#1463F3] hover:bg-[#104fc2] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-center text-xs text-blue-200/60 mt-3.5">
          For prospective and enrolled students
        </p>
      </div>
    </div>
  );
};
