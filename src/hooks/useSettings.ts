import { useFirestoreSubscription } from './useFirestoreSubscription'
import { subscribeToSettings } from '@/services/settingsService'
import { DEFAULT_SETTINGS } from '@/types/settings'

export function useSettings() {
  const { data: settings, loading } = useFirestoreSubscription(subscribeToSettings, DEFAULT_SETTINGS)
  return { settings, loading }
}
