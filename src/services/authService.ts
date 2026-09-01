import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  updatePassword as firebaseUpdatePassword,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'
import { DEFAULT_SETTINGS } from '@/types/settings'

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function signup(name: string, email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  const displayName = name.trim()
  if (displayName) {
    await updateProfile(cred.user, { displayName })
  }
  // Bootstrap the user's Firestore records so the scheduled Cloud Functions
  // (which iterate the `users` collection) and the settings listener find them.
  // The account already exists at this point; a Firestore hiccup here (offline,
  // database not provisioned yet) must not block sign-in — the app falls back to
  // DEFAULT_SETTINGS and these docs get created on next settings save.
  try {
    await Promise.all([
      setDoc(doc(db, 'users', cred.user.uid), {
        email,
        displayName: displayName || null,
        createdAt: serverTimestamp(),
      }),
      setDoc(doc(db, 'users', cred.user.uid, 'meta', 'settings'), DEFAULT_SETTINGS),
    ])
  } catch (err) {
    console.error('[athar] فشل تهيئة مستندات المستخدم بعد إنشاء الحساب:', err)
  }
  return cred
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

/** Safely reads the Firebase `auth/*` error code from an unknown thrown value. */
function firebaseErrorCode(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String((error as { code: unknown }).code ?? '')
  }
  return ''
}

export function mapAuthError(error: unknown): string {
  const code = typeof error === 'string' ? error : firebaseErrorCode(error)
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
    case 'auth/email-already-in-use':
      return 'هذا البريد الإلكتروني مسجّل مسبقًا، سجّلي الدخول بدلًا من ذلك.'
    case 'auth/operation-not-allowed':
    case 'auth/configuration-not-found':
    case 'auth/admin-restricted-operation':
      return 'تسجيل الدخول بالبريد الإلكتروني/كلمة المرور غير مُفعّل. فعّليه من Firebase Console ← Authentication ← Sign-in method.'
    case 'auth/requires-recent-login':
      return 'لأمان حسابك، يرجى تسجيل الخروج والدخول مرة أخرى ثم إعادة المحاولة.'
    default:
      return 'حدث خطأ غير متوقع، حاولي مرة أخرى.'
  }
}
