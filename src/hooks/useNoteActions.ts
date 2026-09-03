import { useAuth } from './useAuth'
import { useToast } from '@/components/ui/Toast'
import { Note, NewNoteInput } from '@/types/note'
import { createNote, updateNote, deleteNote } from '@/services/noteService'
import { noteMessages } from '@/lib/messages'

/** Note mutations for the notes page, each with its own success toast. */
export function useNoteActions() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const uid = user?.uid ?? null

  const saveNote = async (input: NewNoteInput, editing: Note | null) => {
    if (!uid) return
    if (editing) {
      await updateNote(uid, editing.id, input)
      showToast(noteMessages.saved)
    } else {
      await createNote(uid, input)
      showToast(noteMessages.created)
    }
  }

  const removeNote = async (note: Note) => {
    if (!uid) return
    await deleteNote(uid, note.id)
    showToast(noteMessages.deleted)
  }

  return { saveNote, removeNote }
}
