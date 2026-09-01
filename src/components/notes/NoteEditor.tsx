import { NoteEditorModal } from './NoteEditorModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { RecordDialog } from '@/hooks/useRecordDialog'
import { useNoteActions } from '@/hooks/useNoteActions'
import { Note } from '@/types/note'
import { confirmMessages } from '@/lib/messages'

interface NoteEditorProps {
  dialog: RecordDialog<Note>
  actions: ReturnType<typeof useNoteActions>
}

/** The create/edit note modal plus its delete confirmation. */
export function NoteEditor({ dialog, actions }: NoteEditorProps) {
  const { editing, pendingDelete } = dialog

  return (
    <>
      <NoteEditorModal
        open={dialog.isFormOpen}
        onClose={dialog.closeForm}
        note={editing}
        onSubmit={(input) => actions.saveNote(input, editing)}
        onDelete={editing ? () => dialog.requestDelete(editing) : undefined}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={confirmMessages.deleteNoteTitle}
        description={confirmMessages.deleteNoteBody}
        onConfirm={async () => {
          try {
            if (pendingDelete) await actions.removeNote(pendingDelete)
          } finally {
            dialog.finishDelete()
          }
        }}
        onCancel={dialog.cancelDelete}
      />
    </>
  )
}
