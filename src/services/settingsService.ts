import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { logSnapshotError } from './firestore'
import { DEFAULT_SETTINGS, UserSettings } from '@/types/settings'

function settingsDoc(uid: string) {
  return doc(db, 'users', uid, 'meta', 'settings')
}

export function subscribeToSettings(uid: string, callback: (settings: UserSettings) => void) {
  return onSnapshot(
    settingsDoc(uid),
    (snap) => {
      if (snap.exists()) {
        callback({ ...DEFAULT_SETTINGS, ...(snap.data() as UserSettings) })
      } else {
        callback(DEFAULT_SETTINGS)
      }
    },
    logSnapshotError('الإعدادات')
  )
}

export async function saveSettings(uid: string, settings: Partial<UserSettings>) {
  return setDoc(settingsDoc(uid), settings, { merge: true })
}
