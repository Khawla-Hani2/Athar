import { NavLink } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { NAV_ITEMS } from './navItems'
import { cn } from '@/lib/cn'

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch justify-around bg-surface-raised border-t border-line pt-2 pb-[calc(env(safe-area-inset-bottom)+6px)]">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 text-[10px] font-semibold no-underline flex-1 py-1 min-h-[44px] justify-center',
              isActive ? 'text-teal-700' : 'text-ink-500'
            )
          }
        >
          <Icon name={item.icon} className="w-5 h-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
