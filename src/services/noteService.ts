import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { docsWithId, logSnapshotError } from './firestore'
import { NewNoteInput, Note } from '@/types/note'

function notesCol(uid: string) {
  return collection(db, 'users', uid, 'notes')
}

export function subscribeToNotes(uid: string, callback: (notes: Note[]) => void) {
  const q = query(notesCol(uid), orderBy('updatedAt', 'desc'))
  return onSnapshot(q, (snapshot) => callback(docsWithId<Note>(snapshot)), logSnapshotError('الملاحظات'))
}

export async function createNote(uid: string, input: NewNoteInput) {
  const now = Date.now()
  return addDoc(notesCol(uid), { ...input, userId: uid, createdAt: now, updatedAt: now })
}

export async function updateNote(uid: string, noteId: string, input: Partial<NewNoteInput>) {
  return updateDoc(doc(db, 'users', uid, 'notes', noteId), { ...input, updatedAt: Date.now() })
}

export async function deleteNote(uid: string, noteId: string) {
  return deleteDoc(doc(db, 'users', uid, 'notes', noteId))
}
