import React, { useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Clock, Bookmark, Check, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CalendarEvent } from '../types';

export const AcademicCalendarView: React.FC = () => {
  const { calendarEvents, goBack, isItemSaved, saveItem, removeItem } = useApp();
  const [selectedYear, setSelectedYear] = useState('2025/2026');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredEvents = calendarEvents.filter((ev) => {
    const matchesYear = ev.academicYear === selectedYear;
    const matchesCat = selectedFilter === 'all' || ev.category === selectedFilter;
    return matchesYear && matchesCat;
  });

  const handleToggleSave = (ev: CalendarEvent) => {
    if (isItemSaved('event', ev.id)) {
      removeItem(ev.id);
    } else {
      saveItem({
        type: 'event',
        title: ev.title,
        subtitle: `${ev.displayDate} • ${ev.semester}`,
        data: ev
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
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
              Academic Calendar
            </h1>
            <p className="text-xs text-slate-500">Official Senate-approved schedule</p>
          </div>
        </div>

        {/* Academic Year Selector */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-white border border-[#E1E8F2] text-xs font-semibold text-[#102A56] rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-[#1463F3]"
        >
          <option value="2025/2026">2025/2026</option>
          <option value="2026/2027">2026/2027 (Draft)</option>
        </select>
      </div>

      {/* Category filter chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {['all', 'registration', 'lectures', 'exams'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === cat
                ? 'bg-[#1463F3] text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-[#E1E8F2] hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'All Events' : cat}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E1E8F2]">
        {filteredEvents.map((ev) => {
          const isSaved = isItemSaved('event', ev.id);
          const isOngoing = ev.status === 'ongoing';

          return (
            <div key={ev.id} className="relative group">
              {/* Timeline circle node */}
              <div
                className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isOngoing
                    ? 'bg-[#1463F3] border-blue-200 ring-4 ring-blue-50'
                    : 'bg-white border-slate-300'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOngoing ? 'bg-white' : 'bg-slate-400'
                  }`}
                />
              </div>

              {/* Event Card */}
              <div className="bg-white border border-[#E1E8F2] hover:border-[#1463F3] rounded-2xl p-4 transition-all shadow-2xs hover:shadow-xs">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#17233B]">{ev.title}</span>
                      {isOngoing && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full">
                          Ongoing
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#1463F3]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ev.displayDate}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleSave(ev)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-blue-50 text-[#1463F3] border-[#1463F3]/30'
                        : 'text-slate-400 border-slate-200 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                    title={isSaved ? 'Saved to Bookmarks' : 'Save Event'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {ev.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{ev.semester}</span>
                  <span className="italic">{ev.officialSource}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
