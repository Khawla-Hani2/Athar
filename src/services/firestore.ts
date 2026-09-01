import type { FirestoreError, QuerySnapshot } from 'firebase/firestore'

/** Maps a query snapshot to plain objects, folding each document id into the data. */
export function docsWithId<T>(snapshot: QuerySnapshot): T[] {
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T)
}

/**
 * Logs a failed realtime listener. Snapshot errors are otherwise silent, which
 * hides real problems (missing database, denied security rules, offline).
 */
export function logSnapshotError(source: string) {
  return (error: FirestoreError) => {
    console.error(`[athar] تعذّر الاستماع إلى ${source}:`, error.code, error.message)
  }
}
