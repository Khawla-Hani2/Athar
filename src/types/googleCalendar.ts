/** Scope requested when linking/reauthenticating the Google account — least-privilege: event CRUD only. */
export const GOOGLE_CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events'

export interface GoogleCalendarEvent {
  id: string
  title: string
  description: string
  location: string
  /** yyyy-MM-dd */
  date: string
  /** yyyy-MM-dd, for multi-day all-day events */
  endDate: string
  /** HH:mm, null when it's an all-day event */
  startTime: string | null
  endTime: string | null
  allDay: boolean
  htmlLink: string
  /** true only for events ATHAR itself created (tagged via extendedProperties) — only these are editable/deletable here. */
  createdByAthar: boolean
}

export interface NewGoogleEventInput {
  title: string
  description: string
  location: string
  date: string
  endDate: string | null
  startTime: string | null
  endTime: string | null
}
