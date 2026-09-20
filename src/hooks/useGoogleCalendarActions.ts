import { useGoogleCalendar } from './useGoogleCalendar'
import { useToast } from '@/components/ui/Toast'
import { GoogleCalendarEvent, NewGoogleEventInput } from '@/types/googleCalendar'
import {
  createCalendarEvent,
  deleteCalendarEvent,
  GoogleCalendarError,
  mapGoogleCalendarError,
  updateCalendarEvent,
} from '@/services/googleCalendarService'
import { googleCalendarMessages } from '@/lib/messages'

/**
 * Google Calendar event mutations. `saveEvent` lets errors propagate so the form
 * modal can show them inline, matching `useTaskActions().saveTask`.
 */
export function useGoogleCalendarActions() {
  const { getAccessToken, markExpired } = useGoogleCalendar()
  const { showToast } = useToast()

  const saveEvent = async (input: NewGoogleEventInput, editing: GoogleCalendarEvent | null) => {
    try {
      const token = getAccessToken()
      if (editing) {
        await updateCalendarEvent(token, editing.id, input)
        showToast(googleCalendarMessages.eventUpdated)
      } else {
        await createCalendarEvent(token, input)
        showToast(googleCalendarMessages.eventCreated)
      }
    } catch (err) {
      if (err instanceof GoogleCalendarError && err.reason === 'expired') markExpired(err.message)
      throw err
    }
  }

  const removeEvent = async (event: GoogleCalendarEvent) => {
    try {
      const token = getAccessToken()
      await deleteCalendarEvent(token, event.id)
      showToast(googleCalendarMessages.eventDeleted)
    } catch (err) {
      if (err instanceof GoogleCalendarError && err.reason === 'expired') markExpired(err.message)
      showToast(mapGoogleCalendarError(err), 'error')
    }
  }

  return { saveEvent, removeEvent }
}
