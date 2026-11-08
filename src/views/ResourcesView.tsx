import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResourceDocument } from '../types';

const CATEGORY_LABELS: Record<ResourceDocument['category'], string> = {
  handbook: 'Handbook',
  regulations: 'Regulations',
  registration: 'Registration',
  'credit-system': 'Credit system',
  fees: 'Fees',
  exams: 'Examinations',
  accommodation: 'Accommodation',
  forms: 'Forms',
  guides: 'Guides',
};

export const ResourcesView: React.FC = () => {
  const { goBack, navigateTo, resources } = useApp();

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
          <h1 className="page-title text-ink">Resources</h1>
          <p className="page-lede mt-1">
            Official handbooks, regulations and guides for University of Buea students.
          </p>
        </div>
      </div>

      <div className="mt-6">
        {resources.map((resource) => (
          <button
            key={resource.id}
            type="button"
            onClick={() => navigateTo(`/resources/${resource.id}`)}
            className="row-link w-full text-left"
          >
            <span className="min-w-0">
              <span className="block text-[14px] text-muted">
                {CATEGORY_LABELS[resource.category]}
              </span>
              <span className="mt-0.5 block text-[16px] font-medium text-ink">
                {resource.title}
              </span>
              <span className="mt-0.5 block text-[14px] leading-relaxed text-muted">
                {resource.description}
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
};
