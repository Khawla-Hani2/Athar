import { useAuth } from './useAuth'
import { useToast } from '@/components/ui/Toast'
import { Task, NewTaskInput } from '@/types/task'
import {
  createTask,
  updateTask,
  completeTask,
  reopenTask,
  deleteTask,
} from '@/services/taskService'
import { taskMessages } from '@/lib/messages'

/**
 * Task mutations shared by every page that can edit tasks (dashboard, calendar,
 * all-tasks). Each action owns its own success/error toast so pages stay
 * declarative. `saveTask` intentionally lets errors propagate so the form modal
 * can surface them inline.
 */
export function useTaskActions() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const uid = user?.uid ?? null

  const toggleComplete = async (task: Task) => {
    if (!uid) return
    try {
      if (task.status === 'completed') {
        await reopenTask(uid, task.id)
      } else {
        await completeTask(uid, task.id)
        showToast(taskMessages.completed)
      }
    } catch {
      showToast(taskMessages.updateFailed, 'error')
    }
  }

  const saveTask = async (input: NewTaskInput, editing: Task | null) => {
    if (!uid) return
    if (editing) {
      await updateTask(uid, editing.id, input)
      showToast(taskMessages.saved)
    } else {
      await createTask(uid, input)
      showToast(taskMessages.created)
    }
  }

  const removeTask = async (task: Task) => {
    if (!uid) return
    try {
      await deleteTask(uid, task.id)
      showToast(taskMessages.deleted)
    } catch {
      showToast(taskMessages.deleteFailed, 'error')
    }
  }

  return { toggleComplete, saveTask, removeTask }
}
