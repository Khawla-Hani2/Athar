import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { subscribeToTasks } from '@/services/taskService'
import { Task } from '@/types/task'

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }
    setLoading(true)
    const unsubscribe = subscribeToTasks(user.uid, (t) => {
      setTasks(t)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  return { tasks, loading }
}
