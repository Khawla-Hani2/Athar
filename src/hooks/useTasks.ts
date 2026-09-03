import { useFirestoreSubscription } from './useFirestoreSubscription'
import { subscribeToTasks } from '@/services/taskService'
import { Task } from '@/types/task'

const NO_TASKS: Task[] = []

export function useTasks() {
  const { data: tasks, loading } = useFirestoreSubscription(subscribeToTasks, NO_TASKS)
  return { tasks, loading }
}
