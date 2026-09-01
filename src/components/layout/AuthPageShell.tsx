import { ReactNode } from 'react'
import { Logo } from './Logo'

interface AuthPageShellProps {
  children: ReactNode
}

/** Shared centered layout for secondary auth screens (forgot/reset password) — a quieter
 * echo of the login page's coastal identity, kept subtle since these are utility flows. */
export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-6 relative overflow-hidden">
      <svg
        viewBox="0 0 800 400"
        className="absolute bottom-0 inset-x-0 w-full h-[220px] opacity-[0.05] pointer-events-none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 280 Q200 240 400 280 T800 280" stroke="var(--teal-700)" strokeWidth="2" fill="none" />
        <path d="M0 320 Q200 290 400 320 T800 320" stroke="var(--sand-600)" strokeWidth="2" fill="none" />
      </svg>
      <div className="w-full max-w-[380px] relative">
        <Logo withWordmark={false} size={42} className="mb-4.5" />
        {children}
      </div>
    </div>
  )
}
