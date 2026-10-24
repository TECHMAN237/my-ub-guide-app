import React, { useState } from 'react';
import { ArrowLeft, Bookmark, Trash2, ExternalLink, Bot, BookOpen, Calendar, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SavedItem } from '../types';

export const SavedItemsView: React.FC = () => {
  const { savedItems, removeItem, goBack, navigateTo } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = savedItems.filter((i) => (filterType === 'all' ? true : i.type === filterType));

  const handleOpenItem = (item: SavedItem) => {
    if (item.type === 'program') {
      navigateTo(`/programs/${item.data?.id || 'prog-cs'}`, { programId: item.data?.id });
    } else if (item.type === 'resource') {
      navigateTo(`/resources/${item.data?.id || 'res-handbook'}`, { resourceId: item.data?.id });
    } else if (item.type === 'event') {
      navigateTo('/academic-calendar');
    } else if (item.type === 'answer') {
      navigateTo('/chat');
    }
  };

  const getIcon = (type: SavedItem['type']) => {
    switch (type) {
      case 'program':
        return <Compass className="w-4 h-4 text-blue-600" />;
      case 'answer':
        return <Bot className="w-4 h-4 text-indigo-600" />;
      case 'resource':
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={goBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#17233B] tracking-tight">
            Saved Items
          </h1>
          <p className="text-xs text-slate-500">Bookmarked programs, AI answers, and regulations</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'program', label: 'Programs' },
          { id: 'answer', label: 'AI Answers' },
          { id: 'resource', label: 'Resources' },
          { id: 'event', label: 'Calendar Events' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterType === tab.id
                ? 'bg-[#1463F3] text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-[#E1E8F2] hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#E1E8F2] p-6 shadow-2xs">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 mb-1">No saved items found</p>
          <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
            You can bookmark programs, official fee structures, calendar events, or helpful AI answers.
          </p>
          <button
            type="button"
            onClick={() => navigateTo('/home')}
            className="text-xs font-semibold text-white bg-[#1463F3] hover:bg-[#104fc2] px-4 py-2 rounded-xl cursor-pointer"
          >
            Explore University Assistant
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenItem(item)}
              className="bg-white hover:bg-[#EEF5FF]/50 border border-[#E1E8F2] hover:border-[#1463F3] rounded-2xl p-4 transition-all shadow-2xs hover:shadow-xs flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-[#17233B] group-hover:text-[#1463F3] transition-colors truncate">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                  )}
                  <span className="text-[10px] text-slate-400">Saved {item.savedAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item.id);
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#1463F3]" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
