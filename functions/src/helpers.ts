import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { sendEmail } from './mailer.js'
import { UserSettingsDoc } from './types.js'

/**
 * Ids of every user document — the scheduled jobs iterate all users.
 * Paged, and fetching no document fields (`.select()`), so a growing `users`
 * collection (or one user flooding it with sibling docs) can't blow the job's
 * memory or read cost.
 */
export async function getAllUserIds(): Promise<string[]> {
  const pageSize = 500
  const usersCol = getFirestore().collection('users')
  const ids: string[] = []
  let page = await usersCol.orderBy('__name__').select().limit(pageSize).get()
  while (!page.empty) {
    for (const doc of page.docs) ids.push(doc.id)
    if (page.size < pageSize) break
    const last = page.docs[page.docs.length - 1]
    page = await usersCol.orderBy('__name__').select().startAfter(last).limit(pageSize).get()
  }
  return ids
}

/**
 * Runs `fn` over every item with at most `limit` concurrent executions, so a
 * job's wall-clock time doesn't grow linearly with the user count. A failure on
 * one item is logged and does not abort the rest.
 */
export async function forEachLimit<T>(
  items: readonly T[],
  limit: number,
  fn: (item: T) => Promise<void>
): Promise<void> {
  let cursor = 0
  const runNext = async (): Promise<void> => {
    while (cursor < items.length) {
      const item = items[cursor++]
      try {
        await fn(item)
      } catch (err) {
        console.error('[athar] فشلت معالجة عنصر في مهمة مجدولة:', err)
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runNext))
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

/**
 * Escapes user-supplied text before it is interpolated into an email's HTML body
 * or subject. Task titles and notes are attacker-controlled, so every such value
 * must pass through here to avoid HTML/markup injection into the message.
 */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      default:
        return '&#39;'
    }
  })
}

/**
 * Sends an email to a user, looked up by uid. No-op unless the account has a
 * verified email address — accounts can be created with any email string
 * (`createUserWithEmailAndPassword` does not prove ownership), so sending to an
 * unverified address would let anyone make the app email an arbitrary person.
 */
export async function emailUser(uid: string, subject: string, html: string): Promise<void> {
  const user = await getAuth().getUser(uid)
  if (user.email && user.emailVerified) {
    await sendEmail(user.email, subject, html)
  }
}
