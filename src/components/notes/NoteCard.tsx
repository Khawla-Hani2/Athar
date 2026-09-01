import { Note } from '@/types/note'
import { Card } from '@/components/ui/Card'

interface NoteCardProps {
  note: Note
  onOpen: (note: Note) => void
}

export function NoteCard({ note, onOpen }: NoteCardProps) {
  return (
    <Card
      className="cursor-pointer hover:border-teal-500 transition-colors h-full flex flex-col"
      onClick={() => onOpen(note)}
    >
      <h3 className="text-[15px] font-semibold text-ink-900 truncate">{note.title || 'بلا عنوان'}</h3>
      <p className="text-[13px] text-ink-500 mt-2 line-clamp-4 whitespace-pre-wrap flex-1">{note.content}</p>
    </Card>
  )
}
