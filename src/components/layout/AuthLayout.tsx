import { ReactNode } from 'react'
import { Logo } from './Logo'
import { AuthArtwork } from './AuthArtwork'
import { FirebaseNotConfiguredNotice } from './FirebaseNotConfiguredNotice'

interface AuthLayoutProps {
  title: string
  subtitle: string
  /** When true, renders the "Firebase not configured" hint below the subtitle. */
  showFirebaseNotice?: boolean
  children: ReactNode
  footer: ReactNode
}

/** Split-screen shell for the primary auth screens (login / signup). */
export function AuthLayout({ title, subtitle, showFirebaseNotice, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-paper">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[360px]">
          <Logo withWordmark={false} size={42} className="mb-4.5" />
          <h1 className="text-[24px] sm:text-[26px]">{title}</h1>
          <p className="text-[13.5px] text-ink-500 mt-2 leading-relaxed">{subtitle}</p>

          {showFirebaseNotice && <FirebaseNotConfiguredNotice />}

          {children}

          <p className="text-[12.5px] text-ink-500 mt-6 text-center">{footer}</p>
        </div>
      </div>

      <AuthArtwork />
    </div>
  )
}
