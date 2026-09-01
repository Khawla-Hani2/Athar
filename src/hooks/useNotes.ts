import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { subscribeToNotes } from '@/services/noteService'
import { Note } from '@/types/note'

export function useNotes() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setNotes([])
      setLoading(false)
      return
    }
    setLoading(true)
    const unsubscribe = subscribeToNotes(user.uid, (n) => {
      setNotes(n)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  return { notes, loading }
}
