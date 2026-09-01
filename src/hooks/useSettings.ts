import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { subscribeToSettings } from '@/services/settingsService'
import { DEFAULT_SETTINGS, UserSettings } from '@/types/settings'

export function useSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setSettings(DEFAULT_SETTINGS)
      setLoading(false)
      return
    }
    setLoading(true)
    const unsubscribe = subscribeToSettings(user.uid, (s) => {
      setSettings(s)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  return { settings, loading }
}
