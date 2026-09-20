import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { GoogleCalendarEvent, NewGoogleEventInput } from '@/types/googleCalendar'
import { todayISO } from '@/utils/date'

interface GoogleEventFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (input: NewGoogleEventInput) => Promise<void>
  onDelete?: () => void
  event?: GoogleCalendarEvent | null
  /** Extra fields merged in when creating (e.g. the day selected on the calendar). */
  createDefaults?: Partial<NewGoogleEventInput>
}

function emptyForm(): NewGoogleEventInput {
  return {
    title: '',
    description: '',
    location: '',
    date: todayISO(),
    endDate: null,
    startTime: '09:00',
    endTime: '10:00',
  }
}

export function GoogleEventFormModal({
  open,
  onClose,
  onSubmit,
  onDelete,
  event,
  createDefaults,
}: GoogleEventFormModalProps) {
  const [form, setForm] = useState<NewGoogleEventInput>(emptyForm())
  const [allDay, setAllDay] = useState(false)
  const [showEndDate, setShowEndDate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    if (event) {
      setForm({
        title: event.title,
        description: event.description,
        location: event.location,
        date: event.date,
        endDate: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
      })
      setAllDay(event.allDay)
      setShowEndDate(event.endDate !== event.date)
    } else {
      setForm({ ...emptyForm(), ...createDefaults })
      setAllDay(false)
      setShowEndDate(false)
    }
    setError('')
  }, [open, event, createDefaults])

  const set = <K extends keyof NewGoogleEventInput>(key: K, value: NewGoogleEventInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError('اسم الحدث مطلوب.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        endDate: showEndDate ? form.endDate : null,
        startTime: allDay ? null : form.startTime,
        endTime: allDay ? null : form.endTime,
      })
      onClose()
    } catch (err) {
      console.error('[athar] فشل حفظ حدث Google Calendar:', err)
      setError('تعذّر حفظ الحدث، حاولي مرة أخرى.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={event ? 'تعديل حدث Google Calendar' : 'إضافة حدث Google Calendar'}>
      <div className="flex flex-col gap-4.5">
        <Field label="اسم الحدث">
          <Input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="مثال: اجتماع الفريق"
            error={Boolean(error)}
          />
        </Field>

        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold">طوال اليوم</p>
          <Switch checked={allDay} onChange={setAllDay} aria-label="طوال اليوم" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="التاريخ">
            <Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </Field>
          {!allDay && (
            <Field label="وقت البداية">
              <Input type="time" value={form.startTime ?? ''} onChange={(e) => set('startTime', e.target.value)} />
            </Field>
          )}
        </div>

        {!showEndDate ? (
          <button
            type="button"
            className="text-[12px] text-teal-600 font-semibold text-start w-fit"
            onClick={() => setShowEndDate(true)}
          >
            + هذا الحدث يمتد لعدة أيام
          </button>
        ) : (
          <Field label="تاريخ النهاية">
            <Input type="date" value={form.endDate ?? ''} onChange={(e) => set('endDate', e.target.value || null)} />
          </Field>
        )}

        {!allDay && (
          <Field label="وقت النهاية">
            <Input type="time" value={form.endTime ?? ''} onChange={(e) => set('endTime', e.target.value)} />
          </Field>
        )}

        <Field label="الموقع" optionalLabel="(اختياري)">
          <Input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="مثال: قاعة الاجتماعات" />
        </Field>

        <Field label="الوصف" optionalLabel="(اختياري)">
          <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="أي تفاصيل إضافية…" />
        </Field>

        {error && <p className="text-[12.5px] text-crit-600">{error}</p>}

        <div className="flex gap-2.5 mt-1">
          <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>
            {event ? 'حفظ التغييرات' : 'إضافة الحدث'}
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={submitting}>
            إلغاء
          </Button>
        </div>
        {event && onDelete && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 self-center text-[12.5px] font-semibold text-crit-600 py-1"
            onClick={onDelete}
          >
            <Icon name="trash" className="w-4 h-4" />
            حذف هذا الحدث
          </button>
        )}
      </div>
    </Modal>
  )
}
