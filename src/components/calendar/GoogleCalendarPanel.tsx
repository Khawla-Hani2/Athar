import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar'
import { useGoogleCalendarEvents } from '@/hooks/useGoogleCalendarEvents'
import { useGoogleCalendarActions } from '@/hooks/useGoogleCalendarActions'
import { useRecordDialog } from '@/hooks/useRecordDialog'
import { GoogleEventFormModal } from './GoogleEventFormModal'
import { GoogleCalendarEvent } from '@/types/googleCalendar'
import { isFirebaseConfigured } from '@/firebase/config'
import { confirmMessages, googleCalendarMessages } from '@/lib/messages'
import { formatArabicTime } from '@/utils/date'

interface GoogleCalendarPanelProps {
  selectedDate: string
  rangeStartISO: string
  rangeEndISO: string
}

export function GoogleCalendarPanel({ selectedDate, rangeStartISO, rangeEndISO }: GoogleCalendarPanelProps) {
  const { status, error: connectionError, connect, disconnect } = useGoogleCalendar()
  const { events, loading, error: fetchError, refresh } = useGoogleCalendarEvents(rangeStartISO, rangeEndISO)
  const actions = useGoogleCalendarActions()
  const dialog = useRecordDialog<GoogleCalendarEvent>()
  const { showToast } = useToast()
  const [confirmingDisconnect, setConfirmingDisconnect] = useState(false)

  const dayEvents = useMemo(
    () => events.filter((e) => e.date <= selectedDate && e.endDate >= selectedDate),
    [events, selectedDate]
  )

  if (!isFirebaseConfigured) return null

  const handleConnect = async () => {
    try {
      await connect()
      showToast(googleCalendarMessages.connected)
    } catch {
      // connect() already stores a mapped Arabic error shown below.
    }
  }

  const handleDisconnect = async () => {
    await disconnect()
    setConfirmingDisconnect(false)
    showToast(googleCalendarMessages.disconnected)
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[14px] font-bold flex items-center gap-2">
          <Icon name="cal-days" className="w-4 h-4 text-teal-700" />
          Google Calendar
        </h2>
        {status === 'connected' && (
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={() => refresh()}>
              تحديث
            </Button>
            <Button size="sm" onClick={dialog.openCreate}>
              <Icon name="plus" className="w-3.5 h-3.5" />
              حدث
            </Button>
          </div>
        )}
      </div>

      {status !== 'connected' ? (
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <EmptyState
            message={googleCalendarMessages.notConnectedBody}
            icon={<Icon name="link" className="w-6 h-6" />}
            compact
          />
          {connectionError && <p className="text-[12px] text-crit-600">{connectionError}</p>}
          <Button onClick={handleConnect} disabled={status === 'connecting'}>
            {status === 'connecting' ? 'جارٍ الربط…' : 'ربط تقويم Google'}
          </Button>
        </div>
      ) : (
        <>
          {loading && (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          )}

          {!loading && fetchError && (
            <div className="flex flex-col items-center text-center gap-2.5 py-2">
              <p className="text-[12.5px] text-crit-600">{fetchError}</p>
              <Button variant="secondary" size="sm" onClick={handleConnect}>
                إعادة الربط
              </Button>
            </div>
          )}

          {!loading && !fetchError && dayEvents.length === 0 && (
            <EmptyState message="لا توجد أحداث Google في هذا اليوم" icon={<Icon name="cal" className="w-6 h-6" />} compact />
          )}

          {!loading &&
            !fetchError &&
            dayEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between gap-2 py-2.5 border-b border-line-soft last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-[12.5px] font-semibold truncate">{event.title}</p>
                  <p className="text-[11px] text-ink-500">
                    {event.allDay ? 'طوال اليوم' : `${formatArabicTime(event.startTime)} – ${formatArabicTime(event.endTime)}`}
                    {event.location ? ` · ${event.location}` : ''}
                  </p>
                </div>
                {event.createdByAthar ? (
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => dialog.openEdit(event)} aria-label="تعديل">
                      <Icon name="pencil" className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => dialog.requestDelete(event)} aria-label="حذف">
                      <Icon name="trash" className="w-3.5 h-3.5 text-crit-600" />
                    </Button>
                  </div>
                ) : (
                  event.htmlLink && (
                    <a
                      href={event.htmlLink}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-ink-500 hover:text-teal-700"
                      aria-label="فتح في Google Calendar"
                    >
                      <Icon name="link" className="w-3.5 h-3.5" />
                    </a>
                  )
                )}
              </div>
            ))}

          <button
            type="button"
            className="mt-3.5 text-[11.5px] text-ink-500 hover:text-crit-600 underline"
            onClick={() => setConfirmingDisconnect(true)}
          >
            قطع الربط مع Google Calendar
          </button>
        </>
      )}

      <GoogleEventFormModal
        open={dialog.isFormOpen}
        onClose={dialog.closeForm}
        event={dialog.editing}
        createDefaults={{ date: selectedDate }}
        onSubmit={async (input) => {
          await actions.saveEvent(input, dialog.editing)
          await refresh()
        }}
        onDelete={dialog.editing ? () => dialog.requestDelete(dialog.editing!) : undefined}
      />

      <ConfirmDialog
        open={Boolean(dialog.pendingDelete)}
        title={confirmMessages.deleteEventTitle}
        description={dialog.pendingDelete ? confirmMessages.deleteEventBody(dialog.pendingDelete.title) : undefined}
        onConfirm={async () => {
          if (dialog.pendingDelete) {
            await actions.removeEvent(dialog.pendingDelete)
            await refresh()
          }
          dialog.finishDelete()
        }}
        onCancel={dialog.cancelDelete}
      />

      <ConfirmDialog
        open={confirmingDisconnect}
        title={confirmMessages.disconnectGoogleTitle}
        description={confirmMessages.disconnectGoogleBody}
        confirmLabel="قطع الربط"
        onConfirm={handleDisconnect}
        onCancel={() => setConfirmingDisconnect(false)}
      />
    </Card>
  )
}
