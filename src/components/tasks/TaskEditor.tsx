import { TaskFormModal } from './TaskFormModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { RecordDialog } from '@/hooks/useRecordDialog'
import { useTaskActions } from '@/hooks/useTaskActions'
import { NewTaskInput, Task } from '@/types/task'
import { confirmMessages } from '@/lib/messages'

interface TaskEditorProps {
  dialog: RecordDialog<Task>
  actions: ReturnType<typeof useTaskActions>
  /** Extra fields merged into the input when creating (e.g. a pre-selected date). */
  createDefaults?: Partial<NewTaskInput>
}

/** The create/edit form modal plus its delete confirmation, wired to a dialog + actions. */
export function TaskEditor({ dialog, actions, createDefaults }: TaskEditorProps) {
  const { editing, pendingDelete } = dialog

  return (
    <>
      <TaskFormModal
        open={dialog.isFormOpen}
        onClose={dialog.closeForm}
        task={editing}
        onSubmit={(input) =>
          actions.saveTask(editing ? input : { ...input, ...createDefaults }, editing)
        }
        onDelete={editing ? () => dialog.requestDelete(editing) : undefined}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={confirmMessages.deleteTaskTitle}
        description={pendingDelete ? confirmMessages.deleteTaskBody(pendingDelete.title) : undefined}
        onConfirm={async () => {
          if (pendingDelete) await actions.removeTask(pendingDelete)
          dialog.finishDelete()
        }}
        onCancel={dialog.cancelDelete}
      />
    </>
  )
}
