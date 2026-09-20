import { useCallback, useEffect, useState } from 'react'
import { useGoogleCalendar } from './useGoogleCalendar'
import { fetchCalendarEvents, GoogleCalendarError, mapGoogleCalendarError } from '@/services/googleCalendarService'
import { GoogleCalendarEvent } from '@/types/googleCalendar'

/** Fetches Google Calendar events for [rangeStartISO, rangeEndISO] (inclusive) while connected. */
export function useGoogleCalendarEvents(rangeStartISO: string, rangeEndISO: string) {
  const { status, getAccessToken, markExpired } = useGoogleCalendar()
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (status !== 'connected') {
      setEvents([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const token = getAccessToken()
      const items = await fetchCalendarEvents(token, rangeStartISO, rangeEndISO)
      setEvents(items)
    } catch (err) {
      if (err instanceof GoogleCalendarError && err.reason === 'expired') {
        markExpired(err.message)
      }
      setError(mapGoogleCalendarError(err))
      setEvents([])
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, rangeStartISO, rangeEndISO])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { events, loading, error, refresh }
}
