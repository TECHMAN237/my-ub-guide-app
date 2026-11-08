import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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

const QUICK_LINKS = [
  { label: 'Fee schedules and payment', route: '/fees' },
  { label: 'Academic calendar', route: '/academic-calendar' },
  { label: 'Faculties and departments', route: '/departments' },
];

export const ResourceDetailView: React.FC = () => {
  const { goBack, navigateTo, resources, routeParams } = useApp();
  const resourceId =
    routeParams?.resourceId || window.location.pathname.split('/')[2];
  const resource = resources.find((r) => r.id === resourceId) ?? resources[0];

  if (!resource) {
    return (
      <div className="mx-auto w-full max-w-[720px] px-5 pb-28 pt-4 sm:px-8 md:pb-16">
        <button
          type="button"
          onClick={goBack}
          className="-ml-2 flex h-11 w-11 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-ink"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="page-title mt-4 text-ink">Resource not found</h1>
        <p className="page-lede mt-1">This document is not available.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 pb-28 pt-4 sm:px-8 md:pb-16">
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
          <p className="text-[14px] text-muted">{CATEGORY_LABELS[resource.category]}</p>
          <h1 className="page-title mt-1 text-ink">{resource.title}</h1>
          <p className="page-lede mt-1">{resource.description}</p>
        </div>
      </div>

      <div className="measure mt-8 whitespace-pre-line text-[16px] leading-relaxed text-ink">
        {resource.content}
      </div>

      <dl className="measure mt-8 border-t border-rule pt-4 text-[14px]">
        <div className="flex flex-wrap justify-between gap-x-4 py-1">
          <dt className="text-muted">Format</dt>
          <dd className="text-ink">{resource.fileFormat}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 py-1">
          <dt className="text-muted">Last updated</dt>
          <dd className="text-ink">{resource.lastUpdated}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-4 py-1">
          <dt className="text-muted">Source</dt>
          <dd className="text-right text-ink">{resource.officialSource}</dd>
        </div>
      </dl>

      <section className="mt-8">
        <h2 className="text-[18px] font-semibold text-ink">Related</h2>
        <div className="mt-1">
          {QUICK_LINKS.map((link) => (
            <button
              key={link.route}
              type="button"
              onClick={() => navigateTo(link.route)}
              className="row-link w-full text-left"
            >
              <span className="text-[16px] text-ink">{link.label}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
