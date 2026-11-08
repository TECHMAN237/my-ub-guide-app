"""Write the new FeesView.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'FeesView.tsx'))

JSX = r'''import React from 'react';
import { ArrowLeft, CreditCard, Clock, MapPin, Download, Monitor } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_FEES, INITIAL_FEE_PAYMENT_METHODS } from '../data/mockData';

export const FeesView: React.FC = () => {
  const { goBack, navigateTo } = useApp();
  const primaryFee = INITIAL_FEES[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-ink hover:bg-raised transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">School Fees Guide</h1>
          <p className="text-xs text-muted">Tuition, fees, and payment instructions for the 2025/2026 session.</p>
        </div>
      </div>

      {/* Primary Fee Card */}
      <div className="bg-surface border border-ink/10 rounded-3xl p-5 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-ink">{primaryFee.programName}</h1>
            <p className="text-xs text-muted">{primaryFee.faculty} • {primaryFee.program}</p>
            <p className="text-xl font-extrabold text-ink mt-2">
              {primaryFee.totalFee.toLocaleString()} {primaryFee.currency} / year
            </p>
            <p className="text-xs text-muted">{primaryFee.discount}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-0.5">First Installment</p>
            <p className="font-bold text-ink">60% due upon registration</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-0.5">Second Installment</p>
            <p className="font-bold text-ink">40% due mid-session</p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-surface border border-ink/10 rounded-3xl p-5 shadow-2xs">
        <h2 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Payment Options</h2>
        <div className="space-y-3">
          {INITIAL_FEE_PAYMENT_METHODS.map((method) => (
            <div key={method.id} className="flex items-center gap-3 p-3 rounded-xl bg-raised/60">
              <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center shrink-0">
                {method.icon === 'card' && <CreditCard className="w-4 h-4" />}
                {method.icon === 'phone' && <Monitor className="w-4 h-4" />}
                {method.icon === 'bank' && <MapPin className="w-4 h-4" />}
                {method.icon === 'down' && <Download className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink truncate">{method.name}</p>
                <p className="text-[11px] text-muted truncate">{method.description}</p>
              </div>
              <span className="text-[10px] font-semibold text-accent bg-accent-soft px-2 py-0.5 rounded-full border border-ink/10">
                {method.method}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-ink/10 rounded-3xl p-5 shadow-2xs">
        <h2 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Need Help?</h2>
        <p className="text-xs text-muted">Contact the Finance Office or visit the student portal for payment assistance.</p>
        <button
          type="button"
          onClick={() => navigateTo('/fees')}
          className="mt-3 text-xs font-semibold text-accent hover:underline"
        >
          Visit Finance Office
        </button>
      </div>
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
