import React from 'react';
import { ChevronRight, ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserTypeSelectionView: React.FC = () => {
  const { navigateTo, setUserCategory } = useApp();

  const handleSelect = (category: 'prospective' | 'enrolled') => {
    setUserCategory(category);
    navigateTo('/setup/profile', { category });
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col justify-between p-6 max-w-md mx-auto">
      <div>
        <div className="flex items-center justify-between pt-2 mb-6">
          <button
            type="button"
            onClick={() => navigateTo('/')}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-200/60 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5">
            <span className="w-6 h-1.5 rounded-full bg-[#1463F3]" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
          </div>

          <div className="w-9" />
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#17233B] tracking-tight mb-2">
            Who are you?
          </h1>
          <p className="text-sm text-[#68758B] leading-relaxed">
            Personalize your experience to get the most relevant answers and tailored guidance.
          </p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => handleSelect('prospective')}
            className="w-full bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] rounded-2xl p-5 text-left transition-all shadow-xs hover:shadow-md flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1463F3] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>

            <div className="flex-1">
              <h2 className="text-base font-bold text-[#17233B] group-hover:text-[#1463F3] transition-colors mb-1">
                I'm not yet enrolled
              </h2>
              <p className="text-xs text-[#68758B] leading-normal">
                I want to know about programs, admission, school fees, degree types, and more.
              </p>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#1463F3] group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => handleSelect('enrolled')}
            className="w-full bg-white hover:bg-[#EEF5FF] border border-[#E1E8F2] hover:border-[#1463F3] rounded-2xl p-5 text-left transition-all shadow-xs hover:shadow-md flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>

            <div className="flex-1">
              <h2 className="text-base font-bold text-[#17233B] group-hover:text-[#1463F3] transition-colors mb-1">
                I'm already enrolled
              </h2>
              <p className="text-xs text-[#68758B] leading-normal">
                I want help with courses, registration, credit limits, exams, department info, and more.
              </p>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#1463F3] group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        </div>
      </div>

      <div className="py-6 text-center">
        <button
          type="button"
          onClick={() => handleSelect('prospective')}
          className="text-xs font-medium text-[#1463F3] hover:underline"
        >
          Not sure? You can change this later in settings
        </button>
      </div>
    </div>
  );
};
