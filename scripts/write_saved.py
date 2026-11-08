"""Write the new SavedItemsView.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'SavedItemsView.tsx'))

JSX = r'''import React from 'react';
import { ArrowLeft, Bookmark, Trash2, FileText, Calendar, CreditCard, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SavedItemsView: React.FC = () => {
  const { goBack, navigateTo, savedItems, removeItem } = useApp();

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
          <h1 className="text-xl font-bold text-ink tracking-tight">Saved Items</h1>
          <p className="text-xs text-muted">Bookmark answers, programs, and resources for quick access.</p>
        </div>
      </div>

      {savedItems.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-ink/10 rounded-3xl shadow-2xs">
          <Bookmark className="w-10 h-10 text-muted mx-auto mb-2" />
          <p className="text-sm font-semibold text-ink mb-1">No saved items yet</p>
          <p className="text-xs text-muted mb-4">Save answers and programs while chatting with My UB Guide.</p>
          <button
            type="button"
            onClick={() => navigateTo('/chat')}
            className="text-xs font-semibold text-accent bg-accent-soft px-4 py-2 rounded-xl border border-ink/10 hover:bg-accent-edge transition-colors"
          >
            Start Chatting
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {savedItems.map((item) => (
            <div
              key={item.id}
              className="bg-surface border border-ink/10 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
                  {item.type === 'answer' && <MessageSquare className="w-4 h-4" />}
                  {item.type === 'program' && <GraduationCap className="w-4 h-4" />}
                  {item.type === 'resource' && <FileText className="w-4 h-4" />}
                  {item.type === 'fee' && <CreditCard className="w-4 h-4" />}
                  {item.type === 'calendar' && <Calendar className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-ink truncate">{item.title}</h3>
                  <p className="text-[11px] text-muted truncate">{item.subtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="p-2 text-muted hover:text-red-600 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
