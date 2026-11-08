import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserTypeSelectionView: React.FC = () => {
  const { navigateTo, setUserCategory } = useApp();

  const handleSelect = (category: 'prospective' | 'enrolled') => {
    setUserCategory(category);
    navigateTo('/setup/profile', { category });
  };

  const options = [
    {
      id: 'prospective' as const,
      title: 'I am applying',
      description:
        'Programmes, entry requirements, school fees and application steps for a place at the University of Buea.',
    },
    {
      id: 'enrolled' as const,
      title: 'I am enrolled',
      description:
        'Course registration, credit limits, examinations and the rules that apply to your level.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col justify-center bg-ground px-5 py-10">
      <div className="mx-auto w-full max-w-[560px]">
        <button
          type="button"
          onClick={() => navigateTo('/welcome')}
          className="-ml-2 mb-6 flex h-11 w-11 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-ink"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <h1 className="page-title text-ink">Where are you now?</h1>
        <p className="page-lede mt-1">
          This sets the guidance you see. You can change it later in the menu.
        </p>

        <div className="mt-6 space-y-3">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              className="flex w-full items-start justify-between gap-4 rounded-[10px] bg-surface p-5 text-left transition-colors hover:bg-raised"
            >
              <span>
                <span className="block text-[18px] font-semibold text-ink">{option.title}</span>
                <span className="mt-1 block text-[14px] leading-relaxed text-muted">
                  {option.description}
                </span>
              </span>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
