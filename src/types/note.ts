export interface Note {
  id: string
  userId: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

export type NewNoteInput = Pick<Note, 'title' | 'content'>
