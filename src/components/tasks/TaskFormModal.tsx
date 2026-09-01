import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { ChipSelect } from '@/components/ui/ChipSelect'
import { Icon } from '@/components/ui/Icon'
import { SubtaskEditor } from './SubtaskEditor'
import { LinksEditor } from './LinksEditor'
import { NewTaskInput, ReminderOption, REMINDER_LABELS, Subtask, Task, TaskPriority, TaskType } from '@/types/task'
import { TYPE_CHIP_OPTIONS, PRIORITY_CHIP_OPTIONS } from '@/utils/taskVisuals'
import { todayISO } from '@/utils/date'

interface TaskFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (input: NewTaskInput) => Promise<void>
  onDelete?: () => void
  task?: Task | null
}

function emptyForm(): NewTaskInput {
  return {
    title: '',
    type: 'general',
    priority: 'medium',
    notes: '',
    links: [],
    subtasks: [],
    date: todayISO(),
    time: null,
    endDate: null,
    deadlineDate: null,
    deadlineTime: null,
    reminder: 'none',
  }
}

export function TaskFormModal({ open, onClose, onSubmit, onDelete, task }: TaskFormModalProps) {
  const [form, setForm] = useState<NewTaskInput>(emptyForm())
  const [showEndDate, setShowEndDate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    if (task) {
      const { id, userId, createdAt, completedAt, status, ...rest } = task
      setForm(rest)
      setShowEndDate(Boolean(task.endDate))
    } else {
      setForm(emptyForm())
      setShowEndDate(false)
    }
    setError('')
  }, [open, task])

  const set = <K extends keyof NewTaskInput>(key: K, value: NewTaskInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError('اسم المهمة مطلوب.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await onSubmit({ ...form, title: form.title.trim(), endDate: showEndDate ? form.endDate : null })
      onClose()
    } catch (e) {
      setError('تعذّر حفظ المهمة، حاولي مرة أخرى.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={task ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}>
      <div className="flex flex-col gap-4.5">
        <Field label="اسم المهمة">
          <Input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="مثال: تسليم تقرير الأسبوع"
            error={Boolean(error)}
          />
        </Field>

        <Field label="النوع">
          <ChipSelect options={TYPE_CHIP_OPTIONS} value={form.type} onChange={(v) => set('type', v as TaskType)} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="تاريخ المهمة">
            <Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </Field>
          <Field label="وقت المهمة" optionalLabel="(اختياري)">
            <Input type="time" value={form.time ?? ''} onChange={(e) => set('time', e.target.value || null)} />
          </Field>
        </div>

        {!showEndDate ? (
          <button
            type="button"
            className="text-[12px] text-teal-600 font-semibold text-start w-fit"
            onClick={() => setShowEndDate(true)}
          >
            + هذه المهمة تمتد لعدة أيام
          </button>
        ) : (
          <Field label="تاريخ نهاية المهمة">
            <Input
              type="date"
              value={form.endDate ?? ''}
              onChange={(e) => set('endDate', e.target.value || null)}
            />
          </Field>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field label="الموعد النهائي" optionalLabel="(اختياري)">
            <Input
              type="date"
              value={form.deadlineDate ?? ''}
              onChange={(e) => set('deadlineDate', e.target.value || null)}
            />
          </Field>
          <Field label="وقت الموعد النهائي" optionalLabel="(اختياري)">
            <Input
              type="time"
              value={form.deadlineTime ?? ''}
              onChange={(e) => set('deadlineTime', e.target.value || null)}
            />
          </Field>
        </div>

        <Field label="الأولوية">
          <ChipSelect
            options={PRIORITY_CHIP_OPTIONS}
            value={form.priority}
            onChange={(v) => set('priority', v as TaskPriority)}
          />
        </Field>

        {form.type === 'study' && (
          <Field label="مهام فرعية" optionalLabel="(اختياري)">
            <SubtaskEditor subtasks={form.subtasks} onChange={(s: Subtask[]) => set('subtasks', s)} />
          </Field>
        )}

        <Field label="تذكير الموعد النهائي">
          <Select value={form.reminder} onChange={(e) => set('reminder', e.target.value as ReminderOption)}>
            {(Object.keys(REMINDER_LABELS) as ReminderOption[]).map((key) => (
              <option key={key} value={key}>
                {REMINDER_LABELS[key]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="ملاحظات">
          <Textarea
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="أي تفاصيل إضافية…"
          />
        </Field>

        <Field label="الروابط">
          <LinksEditor links={form.links} onChange={(links) => set('links', links)} />
        </Field>

        {error && <p className="text-[12.5px] text-crit-600">{error}</p>}

        <div className="flex gap-2.5 mt-1">
          <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>
            {task ? 'حفظ التغييرات' : 'إضافة المهمة'}
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={submitting}>
            إلغاء
          </Button>
        </div>
        {task && onDelete && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 self-center text-[12.5px] font-semibold text-crit-600 py-1"
            onClick={onDelete}
          >
            <Icon name="trash" className="w-4 h-4" />
            حذف هذه المهمة
          </button>
        )}
      </div>
    </Modal>
  )
}
