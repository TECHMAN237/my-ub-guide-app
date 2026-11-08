import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_FACULTIES } from '../data/mockData';

export const DepartmentsView: React.FC = () => {
  const { goBack, navigateTo } = useApp();

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
          <h1 className="page-title text-ink">Faculties and departments</h1>
          <p className="page-lede mt-1">
            The academic units of the University of Buea.
          </p>
        </div>
      </div>

      <div className="mt-6">
        {INITIAL_FACULTIES.map((faculty) => (
          <div key={faculty.id} className="border-t border-rule py-4 first:border-t-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h2 className="text-[18px] font-semibold text-ink">{faculty.name}</h2>
              {faculty.departments && faculty.departments.length > 0 && (
                <span className="text-[14px] text-muted">
                  {faculty.departments.length}{' '}
                  {faculty.departments.length === 1 ? 'department' : 'departments'}
                </span>
              )}
            </div>

            <p className="mt-1 max-w-[65ch] text-[16px] leading-relaxed text-muted">
              {faculty.description}
            </p>

            {faculty.departments && faculty.departments.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {faculty.departments.map((department) => (
                  <li key={department} className="text-[14px] text-ink">
                    {department}
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={() => navigateTo('/programs')}
              className="mt-2 min-h-[44px] text-[14px] font-medium text-accent underline-offset-2 hover:underline"
            >
              Programmes in this faculty
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
