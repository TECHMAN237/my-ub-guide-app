"""Write the new AdmissionsChecklistView.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'AdmissionsChecklistView.tsx'))

JSX = r'''import React from 'react';
import { ArrowLeft, CheckSquare, Calendar, Download, FileText, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_CHECKLIST } from '../data/mockData';

export const AdmissionsChecklistView: React.FC = () => {
  const { goBack, navigateTo, savedItems, toggleSaveItem } = useApp();

  const completed = INITIAL_CHECKLIST.filter((item) => item.completed).length;

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
          <h1 className="text-xl font-bold text-ink tracking-tight">Application Checklist</h1>
          <p className="text-xs text-muted">Track your admission application progress.</p>
        </div>
      </div>

      <div className="bg-surface border border-ink/10 rounded-3xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-muted uppercase tracking-wider">Progress</h2>
          <span className="text-xs font-bold text-accent bg-accent-soft px-2.5 py-1 rounded-full border border-ink/10">
            {completed}/{INITIAL_CHECKLIST.length} Done
          </span>
        </div>
        <div className="space-y-2">
          {INITIAL_CHECKLIST.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${item.completed ? 'bg-accent-soft/40' : 'bg-raised/60'}`}
            >
              <button
                type="button"
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${item.completed ? 'bg-accent text-white' : 'border-ink/20 text-transparent'}`}
              >
                <CheckSquare className="w-3 h-3" />
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${item.completed ? 'text-ink line-through' : 'text-ink'}`}>{item.title}</p>
                <p className="text-[11px] text-muted">{item.description}</p>
              </div>
              {item.completed && (
                <span className="text-[10px] font-semibold text-accent shrink-0">Done</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-ink/10 rounded-3xl p-5 shadow-2xs">
        <h2 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Documents</h2>
        <div className="space-y-2">
          {['Photocopy of national ID / passport', 'Result slips (GCE O Level & A Level)', 'Passport-sized photograph', 'Statement of Purpose', 'Recommendation letters'].map((doc, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-raised transition-colors">
              <FileText className="w-4 h-4 text-muted shrink-0" />
              <span className="text-xs text-ink">{doc}</span>
              <Download className="w-3.5 h-3.5 text-muted shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
