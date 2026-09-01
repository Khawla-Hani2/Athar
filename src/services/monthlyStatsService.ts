import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { MonthlyHistoryEntry } from '@/types/stats'

function historyCol(uid: string) {
  return collection(db, 'users', uid, 'monthlyHistory')
}

export function subscribeToMonthlyHistory(uid: string, callback: (entries: MonthlyHistoryEntry[]) => void) {
  const q = query(historyCol(uid), orderBy('month', 'asc'))
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => d.data() as MonthlyHistoryEntry))
  })
}
