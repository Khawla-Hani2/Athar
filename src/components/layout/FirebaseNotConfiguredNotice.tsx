import { authMessages } from '@/lib/messages'

/** Inline hint shown on the auth forms when Firebase env vars are missing. */
export function FirebaseNotConfiguredNotice() {
  return (
    <div className="mt-4 bg-sand-tint text-sand-700 rounded-lg p-3.5 text-[12.5px] leading-relaxed">
      {authMessages.firebaseNotConfiguredHint}
    </div>
  )
}
