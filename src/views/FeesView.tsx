import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PAYMENT_METHODS = [
  {
    name: 'Approved university bank',
    description: 'Afriland First Bank or UBA Cameroon',
    method: 'Bank transfer',
  },
  {
    name: 'Mobile money',
    description: 'Orange Money or MTN MoMo through the student portal',
    method: 'Online',
  },
  {
    name: 'Finance office',
    description: 'Keep the official stamped receipt',
    method: 'On campus',
  },
];

export const FeesView: React.FC = () => {
  const { goBack, navigateTo, fees } = useApp();
  const primaryFee = fees[0];

  const grouped = fees.reduce<Record<string, typeof fees>>((groups, fee) => {
    groups[fee.facultyName] = groups[fee.facultyName] || [];
    groups[fee.facultyName].push(fee);
    return groups;
  }, {});

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
          <h1 className="page-title text-ink">School fees</h1>
          <p className="page-lede mt-1">
            Tuition and charges for the 2025/2026 session, by faculty.
          </p>
        </div>
      </div>

      <div className="mt-6">
        {Object.entries(grouped).map(([faculty, facultyFees]) => (
          <section key={faculty} className="mt-6 first:mt-0">
            <h2 className="text-[18px] font-semibold text-ink">{faculty}</h2>
            <div className="mt-1">
              {facultyFees.map((fee) => (
                <div key={fee.id} className="row-link">
                  <span className="min-w-0">
                    <span className="block text-[16px] font-medium text-ink">{fee.programName}</span>
                    <span className="block text-[14px] text-muted">
                      {fee.level === 'undergraduate' ? 'Undergraduate' : 'Postgraduate'} ·{' '}
                      {fee.academicYear}
                    </span>
                  </span>
                  <span className="tnum shrink-0 text-right text-[16px] font-medium text-ink">
                    {fee.totalFee.toLocaleString()} {fee.currency}
                    <span className="block text-[14px] font-normal text-muted">per year</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {primaryFee && (
        <section className="mt-10 border-t border-rule pt-5">
          <h2 className="text-[18px] font-semibold text-ink">What the fee covers</h2>
          <p className="mt-1 text-[14px] text-muted">
            Example: {primaryFee.programName}, {primaryFee.academicYear}
          </p>
          <dl className="measure mt-2">
            {[
              ['Tuition', primaryFee.tuitionFee],
              ['Development', primaryFee.developmentFee],
              ['Other charges', primaryFee.otherCharges],
            ].map(([label, amount]) => (
              <div
                key={label as string}
                className="flex items-baseline justify-between gap-4 border-b border-rule py-2"
              >
                <dt className="text-[16px] text-ink">{label}</dt>
                <dd className="tnum text-[16px] text-ink">
                  {(amount as number).toLocaleString()} {primaryFee.currency}
                </dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 py-2">
              <dt className="text-[16px] font-medium text-ink">Total</dt>
              <dd className="tnum text-[16px] font-semibold text-ink">
                {primaryFee.totalFee.toLocaleString()} {primaryFee.currency}
              </dd>
            </div>
          </dl>

          <div className="measure mt-4 space-y-1 text-[16px] leading-relaxed text-muted">
            <p>{primaryFee.paymentSchedule}</p>
            <p>
              Deadline: <span className="text-ink">{primaryFee.deadline}</span>
            </p>
            <p className="text-[14px]">Source: {primaryFee.officialSource}</p>
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-[18px] font-semibold text-ink">How to pay</h2>
        <div className="mt-1">
          {PAYMENT_METHODS.map((method) => (
            <div key={method.name} className="border-t border-rule py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                <p className="text-[16px] font-medium text-ink">{method.name}</p>
                <p className="text-[14px] text-muted">{method.method}</p>
              </div>
              <p className="mt-0.5 text-[14px] leading-relaxed text-muted">{method.description}</p>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigateTo('/resources/res-fees-guide')}
          className="mt-3 min-h-[44px] text-[14px] font-medium text-accent underline-offset-2 hover:underline"
        >
          Read the official fees guide
        </button>
      </section>
    </div>
  );
};
