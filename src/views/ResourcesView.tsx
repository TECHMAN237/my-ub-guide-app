import React, { useState } from 'react';
import { Search, ChevronRight, BookOpen, FileText, Bookmark, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResourceDocument } from '../types';

export const ResourcesView: React.FC = () => {
  const { resources, navigateTo, isItemSaved, saveItem, removeItem } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat =
      activeCategory === 'all' ||
      (activeCategory === 'guides' && (res.category === 'guides' || res.category === 'fees' || res.category === 'registration' || res.category === 'accommodation')) ||
      (activeCategory === 'forms' && res.category === 'forms') ||
      (activeCategory === 'policies' && (res.category === 'handbook' || res.category === 'regulations' || res.category === 'credit-system' || res.category === 'exams'));

    return matchesSearch && matchesCat;
  });

  const handleToggleSave = (e: React.MouseEvent, res: ResourceDocument) => {
    e.stopPropagation();
    if (isItemSaved('resource', res.id)) {
      removeItem(res.id);
    } else {
      saveItem({
        type: 'resource',
        title: res.title,
        subtitle: `${res.fileFormat} • ${res.lastUpdated}`,
        data: res
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-[#17233B] tracking-tight">
          Resources
        </h1>
        <p className="text-xs text-slate-500">
          Official regulations, student handbooks, and registration guides.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
        {[
          { id: 'all', label: 'All' },
          { id: 'guides', label: 'Guides' },
          { id: 'forms', label: 'Forms' },
          { id: 'policies', label: 'Policies' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-[#1463F3] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-[#E1E8F2] hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search handbooks, rules, guides..."
          className="w-full bg-white border border-[#E1E8F2] focus:border-[#1463F3] focus:ring-2 focus:ring-[#1463F3]/15 rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-[#17233B] focus:outline-hidden"
        />
      </div>

      {/* Resource Cards List */}
      <div className="space-y-2.5">
        {filteredResources.map((res) => {
          const isSaved = isItemSaved('resource', res.id);

          return (
            <div
              key={res.id}
              onClick={() => navigateTo(`/resources/${res.id}`, { resourceId: res.id })}
              className="bg-white hover:bg-[#EEF5FF]/50 border border-[#E1E8F2] hover:border-[#1463F3] rounded-2xl p-4 transition-all shadow-2xs hover:shadow-xs flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1463F3] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-[#17233B] group-hover:text-[#1463F3] transition-colors truncate">
                    {res.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {res.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <span>{res.fileFormat}</span>
                    <span>·</span>
                    <span>Updated {res.lastUpdated}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleToggleSave(e, res)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isSaved ? 'text-[#1463F3] bg-blue-50' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title={isSaved ? 'Saved' : 'Save resource'}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#1463F3] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
