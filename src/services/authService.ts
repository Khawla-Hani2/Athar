import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  updatePassword as firebaseUpdatePassword,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth } from '@/firebase/config'

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function logout() {
  return firebaseSignOut(auth)
}

export async function requestPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email)
}

export async function confirmPasswordReset(code: string, newPassword: string) {
  return firebaseConfirmPasswordReset(auth, code, newPassword)
}

export async function changePassword(newPassword: string) {
  if (!auth.currentUser) throw new Error('لا يوجد مستخدم مسجّل الدخول')
  return firebaseUpdatePassword(auth.currentUser, newPassword)
}

export function mapAuthError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'صيغة البريد الإلكتروني غير صحيحة.'
    case 'auth/user-disabled':
      return 'تم تعطيل هذا الحساب.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
    case 'auth/too-many-requests':
      return 'محاولات كثيرة جدًا، حاولي مرة أخرى لاحقًا.'
    case 'auth/network-request-failed':
      return 'تعذّر الاتصال بالخادم، تحققي من اتصالك بالإنترنت.'
    case 'auth/expired-action-code':
      return 'انتهت صلاحية الرابط، اطلبي رابطًا جديدًا.'
    case 'auth/invalid-action-code':
      return 'الرابط غير صالح أو تم استخدامه من قبل.'
    case 'auth/weak-password':
      return 'كلمة المرور ضعيفة جدًا، اختاري كلمة مرور أقوى.'
    case 'auth/requires-recent-login':
      return 'لأمان حسابك، يرجى تسجيل الخروج والدخول مرة أخرى ثم إعادة المحاولة.'
    default:
      return 'حدث خطأ غير متوقع، حاولي مرة أخرى.'
  }
}
