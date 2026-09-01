import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { EmptyState } from '@/components/ui/EmptyState'
import { NoteCard } from '@/components/notes/NoteCard'
import { NoteEditorModal } from '@/components/notes/NoteEditorModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAuth } from '@/hooks/useAuth'
import { useNotes } from '@/hooks/useNotes'
import { useToast } from '@/components/ui/Toast'
import { Note, NewNoteInput } from '@/types/note'
import { createNote, updateNote, deleteNote } from '@/services/noteService'

export function NotesPage() {
  const { user } = useAuth()
  const { notes, loading } = useNotes()
  const { showToast } = useToast()

  const [formOpen, setFormOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [deletingNote, setDeletingNote] = useState<Note | null>(null)

  if (!user) return null

  const handleSubmit = async (input: NewNoteInput) => {
    if (editingNote) {
      await updateNote(user.uid, editingNote.id, input)
      showToast('تم حفظ الملاحظة ✨')
    } else {
      await createNote(user.uid, input)
      showToast('تمت إضافة الملاحظة ✨')
    }
  }

  const handleDeleteConfirmed = async () => {
    if (!deletingNote) return
    try {
      await deleteNote(user.uid, deletingNote.id)
      showToast('تم حذف الملاحظة')
    } finally {
      setDeletingNote(null)
      setFormOpen(false)
    }
  }

  return (
    <div>
      <Topbar
        title="ملاحظاتي"
        actions={
          <Button
            onClick={() => {
              setEditingNote(null)
              setFormOpen(true)
            }}
          >
            <Icon name="plus" />
            ملاحظة جديدة
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 skeleton" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <EmptyState message="ما عندك ملاحظات حتى الآن." icon={<Icon name="note" className="w-6 h-6" />} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onOpen={(n) => {
                setEditingNote(n)
                setFormOpen(true)
              }}
            />
          ))}
        </div>
      )}

      <NoteEditorModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        note={editingNote}
        onDelete={editingNote ? () => setDeletingNote(editingNote) : undefined}
      />

      <ConfirmDialog
        open={Boolean(deletingNote)}
        title="هل أنتِ متأكدة من حذف هذه الملاحظة؟"
        description="لا يمكن التراجع عن هذا الإجراء."
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingNote(null)}
      />
    </div>
  )
}
