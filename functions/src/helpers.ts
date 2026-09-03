import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { sendEmail } from './mailer.js'
import { UserSettingsDoc } from './types.js'

/** Ids of every user document — the scheduled jobs iterate all users. */
export async function getAllUserIds(): Promise<string[]> {
  const snap = await getFirestore().collection('users').get()
  return snap.docs.map((doc) => doc.id)
}

/** Reference to a user's settings document (`users/{uid}/meta/settings`). */
export function userSettingsRef(uid: string) {
  return getFirestore().collection('users').doc(uid).collection('meta').doc('settings')
}

/** Reference to a user's tasks collection. */
export function userTasksRef(uid: string) {
  return getFirestore().collection('users').doc(uid).collection('tasks')
}

export async function getUserSettings(uid: string): Promise<UserSettingsDoc | undefined> {
  const snap = await userSettingsRef(uid).get()
  return snap.data() as UserSettingsDoc | undefined
}

/** Sends an email to a user, looked up by uid. No-op when the user has no email. */
export async function emailUser(uid: string, subject: string, html: string): Promise<void> {
  const user = await getAuth().getUser(uid)
  if (user.email) {
    await sendEmail(user.email, subject, html)
  }
}
