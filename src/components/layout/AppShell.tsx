import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 py-6 sm:px-8 sm:py-7 pb-24 lg:pb-7 overflow-x-hidden">
        <div className="max-w-[1180px] mx-auto">{children}</div>
      </main>
      <MobileNav />
    </div>
  )
}
