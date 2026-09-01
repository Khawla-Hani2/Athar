import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

export const isFirebaseConfigured =
  import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true' ||
  Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID &&
      import.meta.env.VITE_FIREBASE_APP_ID
  )

// Falls back to well-formed placeholder values when .env isn't filled in yet,
// so the SDK can initialize without crashing the whole app at import time.
// Real auth/Firestore calls will still fail gracefully until real credentials are added.
// The placeholder projectId MUST match .firebaserc's "default" project (demo-athar) —
// otherwise the emulator suite logs a project-ID-mismatch warning on every request.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key-placeholder',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-athar.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-athar',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-athar.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000000000',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}
