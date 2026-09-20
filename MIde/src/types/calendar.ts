export type CalendarEventType = 'post' | 'deadline' | 'campaign' | 'meeting';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: CalendarEventType;
  color: string;
  platform?: string;
  campaignId?: string;
  postId?: string;
  description?: string;
}
