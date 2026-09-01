import { Topbar } from '@/components/layout/Topbar'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { NoteCard } from '@/components/notes/NoteCard'
import { NoteEditor } from '@/components/notes/NoteEditor'
import { useAuth } from '@/hooks/useAuth'
import { useNotes } from '@/hooks/useNotes'
import { useRecordDialog } from '@/hooks/useRecordDialog'
import { useNoteActions } from '@/hooks/useNoteActions'
import { Note } from '@/types/note'

const GRID_CLASS = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'

export function NotesPage() {
  const { user } = useAuth()
  const { notes, loading } = useNotes()
  const dialog = useRecordDialog<Note>()
  const actions = useNoteActions()

  if (!user) return null

  return (
    <div>
      <Topbar
        title="ملاحظاتي"
        actions={
          <Button onClick={dialog.openCreate}>
            <Icon name="plus" />
            ملاحظة جديدة
          </Button>
        }
      />

      {loading ? (
        <div className={GRID_CLASS}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <EmptyState message="ما عندك ملاحظات حتى الآن." icon={<Icon name="note" className="w-6 h-6" />} />
      ) : (
        <div className={GRID_CLASS}>
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onOpen={dialog.openEdit} />
          ))}
        </div>
      )}

      <NoteEditor dialog={dialog} actions={actions} />
    </div>
  )
}
