import { useFirestoreSubscription } from './useFirestoreSubscription'
import { subscribeToNotes } from '@/services/noteService'
import { Note } from '@/types/note'

const NO_NOTES: Note[] = []

export function useNotes() {
  const { data: notes, loading } = useFirestoreSubscription(subscribeToNotes, NO_NOTES)
  return { notes, loading }
}
