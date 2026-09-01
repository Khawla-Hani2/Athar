import { NavLink } from 'react-router-dom'
import { Logo } from './Logo'
import { Icon } from '@/components/ui/Icon'
import { NAV_ITEMS } from './navItems'
import { cn } from '@/lib/cn'
import { useAuth } from '@/hooks/useAuth'

export function Sidebar() {
  const { user } = useAuth()
  const initial = user?.email?.trim()?.[0]?.toUpperCase() ?? 'أ'

  return (
    <aside className="hidden lg:flex w-[236px] shrink-0 bg-surface-raised border-s border-line flex-col p-4">
      <div className="flex items-center gap-2.5 px-2 pt-1.5 pb-5">
        <Logo />
      </div>
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[13.5px] font-semibold no-underline transition-colors duration-150',
                isActive ? 'bg-teal-tint text-teal-700' : 'text-ink-700 hover:bg-paper-alt hover:text-ink-900'
              )
            }
          >
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto flex items-center gap-2.5 p-3 border-t border-line-soft rounded-lg">
        <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-teal-600 to-palm-700 shrink-0 flex items-center justify-center text-white font-display text-[13px] font-bold">
          {initial}
        </div>
        <div className="min-w-0">
          <div className="text-[12.5px] font-semibold text-ink-900 truncate">{user?.email ?? 'مساحتي'}</div>
          <div className="text-[11px] text-ink-500">مساحتي الخاصة</div>
        </div>
      </div>
    </aside>
  )
}
