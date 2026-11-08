"""Write the new AcademicCalendarView.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'AcademicCalendarView.tsx'))

JSX = r'''import React from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_CALENDAR_EVENTS } from '../data/mockData';

export const AcademicCalendarView: React.FC = () => {
  const { goBack, navigateTo } = useApp();

  const upcoming = INITIAL_CALENDAR_EVENTS.filter((e) => e.status === 'upcoming' || e.status === 'ongoing');

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
          <h1 className="text-xl font-bold text-ink tracking-tight">Academic Calendar</h1>
          <p className="text-xs text-muted">Key dates, deadlines, and milestones for the 2025/2026 session.</p>
        </div>
      </div>

      <div className="bg-surface border border-ink/10 rounded-3xl p-5 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
            <Calendar className="w-5.5 h-5.5" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-ink">2025/2026 Academic Session</h1>
            <p className="text-xs text-muted">Key dates for prospective and enrolled students.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {upcoming.map((event) => (
          <div
            key={event.id}
            className="bg-surface border border-ink/10 rounded-2xl p-4 shadow-2xs hover:border-accent transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-ink truncate">{event.title}</h3>
                  <span className="text-[10px] font-semibold text-accent bg-accent-soft px-1.5 py-0.5 rounded-full border border-ink/10">
                    {event.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-muted mt-1">{event.description}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-muted">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                  {event.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.date}</span>}
                  {event.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-muted">
        Full 2025/2026 academic calendar available in the official student handbook.
      </div>
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
