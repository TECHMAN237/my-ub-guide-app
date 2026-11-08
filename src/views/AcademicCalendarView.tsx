import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

const monthLabel = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
};

export const AcademicCalendarView: React.FC = () => {
  const { goBack, calendarEvents } = useApp();

  const sorted = [...calendarEvents].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const groups = sorted.reduce<{ month: string; events: typeof sorted }[]>((acc, event) => {
    const month = monthLabel(event.startDate);
    const existing = acc.find((group) => group.month === month);
    if (existing) existing.events.push(event);
    else acc.push({ month, events: [event] });
    return acc;
  }, []);

  const nextEvent = sorted.find(
    (event) => event.status === 'ongoing' || event.status === 'upcoming'
  );

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
          <h1 className="page-title text-ink">Academic calendar</h1>
          <p className="page-lede mt-1">
            Dates for the 2025/2026 session, in order.
          </p>
        </div>
      </div>

      <div className="mt-8">
        {groups.map((group) => (
          <section key={group.month} className="mt-6 first:mt-0">
            <h2 className="text-[14px] font-medium text-muted">{group.month}</h2>
            <div className="mt-1">
              {group.events.map((event) => {
                const isNext = event.id === nextEvent?.id;
                return (
                  <div key={event.id} className="row-link items-start">
                    <span className="flex min-w-0 items-start gap-3">
                      <span
                        className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${
                          isNext ? 'bg-accent' : 'bg-rule'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block text-[16px] font-medium text-ink">
                          {event.title}
                          {isNext && <span className="ml-2 text-[14px] font-normal text-accent">Next</span>}
                        </span>
                        <span className="mt-0.5 block text-[14px] leading-relaxed text-muted">
                          {event.description}
                        </span>
                        <span className="mt-1 block text-[14px] text-muted">
                          {event.displayDate} · {event.semester} ·{' '}
                          {event.status === 'ongoing'
                            ? 'Ongoing'
                            : event.status === 'upcoming'
                              ? 'Upcoming'
                              : 'Completed'}
                        </span>
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-8 border-t border-rule pt-4 text-[14px] text-muted">
        The full calendar is published in the official student handbook.
      </p>
    </div>
  );
};
