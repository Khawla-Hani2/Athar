import type { CalendarEvent, CalendarEventType } from '@/types';

const typeColors: Record<CalendarEventType, string> = {
  post: '#7c3aed',
  deadline: '#ef4444',
  campaign: '#0ea5e9',
  meeting: '#f59e0b',
};

const events: Array<{ title: string; type: CalendarEventType; platform?: string }> = [
  { title: 'Instagram post: Giving Drive teaser', type: 'post', platform: 'Instagram' },
  { title: 'Design assets due', type: 'deadline' },
  { title: 'Campaign kickoff: Open Day', type: 'campaign' },
  { title: 'Content review meeting', type: 'meeting' },
  { title: 'LinkedIn post: Impact numbers', type: 'post', platform: 'LinkedIn' },
  { title: 'Video edit deadline', type: 'deadline' },
  { title: 'TikTok post: Volunteer spotlight', type: 'post', platform: 'TikTok' },
  { title: 'Sponsor sync call', type: 'meeting' },
  { title: 'X post: Weekly recap', type: 'post', platform: 'X' },
  { title: 'Campaign mid-point review', type: 'campaign' },
  { title: 'Facebook post: Event highlights', type: 'post', platform: 'Facebook' },
  { title: 'Report submission deadline', type: 'deadline' },
];

export const calendarEvents: CalendarEvent[] = Array.from({ length: 30 }).map((_, i) => {
  const item = events[i % events.length];
  const day = 1 + (i % 28);
  return {
    id: `ev${i + 1}`,
    title: item.title,
    date: `2026-07-${String(day).padStart(2, '0')}`,
    time: `${9 + (i % 8)}:00`,
    type: item.type,
    color: typeColors[item.type],
    platform: item.platform,
    campaignId: `c${1 + (i % 6)}`,
    description: 'Auto-generated schedule entry synced from the content plan.',
  };
});
