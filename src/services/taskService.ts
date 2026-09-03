import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { docsWithId, logSnapshotError } from './firestore'
import { NewTaskInput, Task } from '@/types/task'

function tasksCol(uid: string) {
  return collection(db, 'users', uid, 'tasks')
}

export function subscribeToTasks(uid: string, callback: (tasks: Task[]) => void) {
  const q = query(tasksCol(uid), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => callback(docsWithId<Task>(snapshot)), logSnapshotError('المهام'))
}

export async function createTask(uid: string, input: NewTaskInput) {
  return addDoc(tasksCol(uid), {
    ...input,
    userId: uid,
    status: 'pending',
    createdAt: Date.now(),
    completedAt: null,
    reminderSentAt: null,
  })
}

export async function updateTask(uid: string, taskId: string, input: Partial<NewTaskInput>) {
  const resetReminder =
    'deadlineDate' in input || 'deadlineTime' in input || 'reminder' in input ? { reminderSentAt: null } : {}
  return updateDoc(doc(db, 'users', uid, 'tasks', taskId), { ...input, ...resetReminder })
}

export async function completeTask(uid: string, taskId: string) {
  return updateDoc(doc(db, 'users', uid, 'tasks', taskId), {
    status: 'completed',
    completedAt: Date.now(),
  })
}

export async function reopenTask(uid: string, taskId: string) {
  return updateDoc(doc(db, 'users', uid, 'tasks', taskId), {
    status: 'pending',
    completedAt: null,
  })
}

export async function deleteTask(uid: string, taskId: string) {
  return deleteDoc(doc(db, 'users', uid, 'tasks', taskId))
}
