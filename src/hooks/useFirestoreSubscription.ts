import { useEffect, useState } from 'react'
import type { Unsubscribe } from 'firebase/firestore'
import { useAuth } from './useAuth'

type Subscribe<T> = (uid: string, onData: (value: T) => void) => Unsubscribe

/**
 * Subscribes to a per-user Firestore resource for as long as a user is signed in.
 * Resets to `emptyValue` when there is no user, and tracks a `loading` flag until
 * the first snapshot arrives.
 */
export function useFirestoreSubscription<T>(subscribe: Subscribe<T>, emptyValue: T) {
  const { user } = useAuth()
  const [data, setData] = useState<T>(emptyValue)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setData(emptyValue)
      setLoading(false)
      return
    }
    setLoading(true)
    const unsubscribe = subscribe(user.uid, (value) => {
      setData(value)
      setLoading(false)
    })
    return unsubscribe
    // `subscribe` and `emptyValue` are expected to be stable module-level values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return { data, loading }
}
