import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SavedItem } from '../types';

const TYPE_LABELS: Record<SavedItem['type'], string> = {
  program: 'Programme',
  answer: 'Answer',
  resource: 'Resource',
  event: 'Date',
};

export const SavedItemsView: React.FC = () => {
  const { goBack, navigateTo, savedItems, removeItem } = useApp();

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
          <h1 className="page-title text-ink">Saved</h1>
          <p className="page-lede mt-1">
            Answers, programmes and documents you kept for later.
          </p>
        </div>
      </div>

      {savedItems.length === 0 ? (
        <div className="measure mt-8">
          <p className="text-[16px] text-ink">Nothing saved yet.</p>
          <p className="mt-1 text-[16px] leading-relaxed text-muted">
            Use the bookmark control on an answer or a programme to keep it here.
          </p>
          <button
            type="button"
            onClick={() => navigateTo('/home')}
            className="mt-3 min-h-[44px] text-[14px] font-medium text-accent underline-offset-2 hover:underline"
          >
            Ask a question
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-[14px] text-muted">
            {savedItems.length} {savedItems.length === 1 ? 'item' : 'items'}
          </p>
          <div className="mt-1">
            {savedItems.map((item) => (
              <div key={item.id} className="row-link items-start">
                <div className="min-w-0 flex-1 py-1">
                  <p className="text-[14px] text-muted">{TYPE_LABELS[item.type]}</p>
                  <p className="mt-0.5 text-[16px] font-medium text-ink">{item.title}</p>
                  {item.subtitle && (
                    <p className="mt-0.5 text-[14px] leading-relaxed text-muted">
                      {item.subtitle}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-negative"
                  aria-label={`Remove ${item.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
