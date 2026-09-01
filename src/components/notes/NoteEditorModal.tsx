import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { NewNoteInput, Note } from '@/types/note'

interface NoteEditorModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (input: NewNoteInput) => Promise<void>
  onDelete?: () => void
  note?: Note | null
}

export function NoteEditorModal({ open, onClose, onSubmit, onDelete, note }: NoteEditorModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setTitle(note?.title ?? '')
    setContent(note?.content ?? '')
  }, [open, note])

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await onSubmit({ title: title.trim(), content })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={note ? 'تعديل الملاحظة' : 'ملاحظة جديدة'} maxWidth={520}>
      <div className="flex flex-col gap-4">
        <Field label="العنوان">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الملاحظة" />
        </Field>
        <Field label="المحتوى">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="اكتبي ملاحظتك هنا…"
            className="min-h-[180px]"
          />
        </Field>
        <div className="flex gap-2.5">
          <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>
            حفظ
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={submitting}>
            إلغاء
          </Button>
        </div>
        {note && onDelete && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 self-center text-[12.5px] font-semibold text-crit-600 py-1"
            onClick={onDelete}
          >
            <Icon name="trash" className="w-4 h-4" />
            حذف هذه الملاحظة
          </button>
        )}
      </div>
    </Modal>
  )
}
