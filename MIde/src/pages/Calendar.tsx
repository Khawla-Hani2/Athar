import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { calendarEvents as initialEvents } from '@/data';
import type { CalendarEvent } from '@/types';
import { cn } from '@/utils/cn';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TYPE_LABELS: Record<CalendarEvent['type'], string> = {
  post: 'Post',
  deadline: 'Deadline',
  campaign: 'Campaign',
  meeting: 'Meeting',
};

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [view, setView] = useState<'month' | 'week'>('month');
  const [cursor, setCursor] = useState(new Date(2026, 6, 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [dragEventId, setDragEventId] = useState<string | null>(null);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }
    return map;
  }, [events]);

  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const gridDays = useMemo(() => {
    if (view === 'week') {
      const start = new Date(cursor);
      start.setDate(start.getDate() - start.getDay());
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
      });
    }
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
    return Array.from({ length: totalCells }, (_, i) => new Date(year, month, i - startOffset + 1));
  }, [cursor, view]);

  const shiftPeriod = (dir: 1 | -1) => {
    const next = new Date(cursor);
    if (view === 'month') next.setMonth(next.getMonth() + dir);
    else next.setDate(next.getDate() + dir * 7);
    setCursor(next);
  };

  const handleDrop = (dateKey: string) => {
    if (!dragEventId) return;
    setEvents((prev) => prev.map((e) => (e.id === dragEventId ? { ...e, date: dateKey } : e)));
    setDragEventId(null);
  };

  const selectedEvents = selectedDay ? eventsByDate.get(selectedDay) ?? [] : [];

  return (
    <div>
      <PageHeader
        title="Publishing Calendar"
        description="Plan, schedule, and track content across every channel."
        action={
          <Button size="sm" onClick={() => setSelectedDay(toDateKey(new Date()))}>
            <Plus className="size-4" /> New Event
          </Button>
        }
      />

      <Card className="p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => shiftPeriod(-1)} aria-label="Previous">
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-[160px] text-center text-sm font-semibold text-slate-800 dark:text-slate-100">
              {monthLabel}
            </span>
            <Button variant="outline" size="icon" onClick={() => shiftPeriod(1)} aria-label="Next">
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {(['month', 'week'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium capitalize transition',
                  view === v
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400',
                )}
              >
                {v}ly
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl bg-slate-100 text-center text-xs font-semibold text-slate-400 dark:bg-slate-800">
          {WEEKDAYS.map((d) => (
            <div key={d} className="bg-white py-2 dark:bg-slate-900">
              {d}
            </div>
          ))}
        </div>
        <div className={cn('grid grid-cols-7 gap-px overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800', view === 'week' ? 'auto-rows-[160px]' : 'auto-rows-[100px]')}>
          {gridDays.map((date) => {
            const dateKey = toDateKey(date);
            const dayEvents = eventsByDate.get(dateKey) ?? [];
            const isCurrentMonth = date.getMonth() === cursor.getMonth();
            const isToday = toDateKey(date) === toDateKey(new Date(2026, 6, 16));
            return (
              <div
                key={dateKey}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(dateKey)}
                onClick={() => setSelectedDay(dateKey)}
                className={cn(
                  'flex cursor-pointer flex-col gap-1 bg-white p-1.5 text-left transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/70',
                  !isCurrentMonth && view === 'month' && 'opacity-40',
                )}
              >
                <span
                  className={cn(
                    'inline-flex size-6 items-center justify-center rounded-full text-xs font-medium',
                    isToday ? 'bg-brand-500 text-white' : 'text-slate-500 dark:text-slate-400',
                  )}
                >
                  {date.getDate()}
                </span>
                <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                  {dayEvents.slice(0, view === 'week' ? 6 : 2).map((event) => (
                    <div
                      key={event.id}
                      draggable
                      onDragStart={(e) => {
                        e.stopPropagation();
                        setDragEventId(event.id);
                      }}
                      className="truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium text-white"
                      style={{ backgroundColor: event.color }}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > (view === 'week' ? 6 : 2) && (
                    <span className="text-[10px] text-slate-400">
                      +{dayEvents.length - (view === 'week' ? 6 : 2)} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Modal isOpen={!!selectedDay} onClose={() => setSelectedDay(null)} title={selectedDay ? new Date(selectedDay).toDateString() : ''}>
        <div className="flex flex-col gap-3">
          {selectedEvents.length === 0 && (
            <p className="text-sm text-slate-400">No events scheduled for this day yet.</p>
          )}
          {selectedEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: event.color }} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{event.title}</p>
                <p className="text-xs text-slate-400">{event.time}</p>
              </div>
              <Badge>{TYPE_LABELS[event.type]}</Badge>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
