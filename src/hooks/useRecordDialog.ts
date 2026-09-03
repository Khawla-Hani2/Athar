import { useState } from 'react'

/**
 * Manages the "create / edit / confirm-delete" modal state shared by the task
 * and note pages: a form that is either empty (create) or bound to a record
 * (edit), plus a separate delete-confirmation for the record being edited.
 */
export function useRecordDialog<T>() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [pendingDelete, setPendingDelete] = useState<T | null>(null)

  const openCreate = () => {
    setEditing(null)
    setIsFormOpen(true)
  }

  const openEdit = (record: T) => {
    setEditing(record)
    setIsFormOpen(true)
  }

  const closeForm = () => setIsFormOpen(false)

  const requestDelete = (record: T) => setPendingDelete(record)
  const cancelDelete = () => setPendingDelete(null)

  /** Called after a delete succeeds: clears the confirmation and the form. */
  const finishDelete = () => {
    setPendingDelete(null)
    setIsFormOpen(false)
  }

  return {
    isFormOpen,
    editing,
    pendingDelete,
    openCreate,
    openEdit,
    closeForm,
    requestDelete,
    cancelDelete,
    finishDelete,
  }
}

export type RecordDialog<T> = ReturnType<typeof useRecordDialog<T>>
