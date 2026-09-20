import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsLeft, ChevronsRight, Sparkles, X } from 'lucide-react';
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from '@/constants/nav';
import { usePermission } from '@/hooks/usePermission';
import { useUiStore } from '@/store/uiStore';
import { cn } from '@/utils/cn';

function NavLinkItem({
  item,
  collapsed,
  onNavigate,
}: {
  item: (typeof NAV_ITEMS)[number];
  collapsed: boolean;
  onNavigate: () => void;
}) {
  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-brand-500/10 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active-pill"
              className="absolute inset-y-1 left-0 w-1 rounded-full bg-brand-500"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <item.icon className="size-[18px] shrink-0" />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );
}

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  const { can } = usePermission();
  const isCollapsed = useUiStore((s) => s.isSidebarCollapsed);
  const toggleCollapsed = useUiStore((s) => s.toggleSidebarCollapsed);

  const visibleItems = NAV_ITEMS.filter((item) => can(item.permissionKey));
  const visibleBottomItems = BOTTOM_NAV_ITEMS.filter((item) => can(item.permissionKey));

  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex items-center gap-2 px-4 py-5', isCollapsed && 'justify-center px-2')}>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
          <Sparkles className="size-5" />
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900 dark:text-white">Capsule Media</p>
            <p className="truncate text-xs text-slate-400">OS</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {visibleItems.map((item) => (
          <NavLinkItem key={item.path} item={item} collapsed={isCollapsed} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="space-y-1 border-t border-slate-100 px-3 py-3 dark:border-slate-800">
        {visibleBottomItems.map((item) => (
          <NavLinkItem key={item.path} item={item} collapsed={isCollapsed} onNavigate={onNavigate} />
        ))}
        <button
          onClick={toggleCollapsed}
          className="hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:flex dark:hover:bg-slate-800/70 dark:hover:text-slate-200"
        >
          {isCollapsed ? <ChevronsRight className="size-[18px]" /> : <ChevronsLeft className="size-[18px]" />}
          {!isCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const isCollapsed = useUiStore((s) => s.isSidebarCollapsed);
  const isMobileOpen = useUiStore((s) => s.isMobileSidebarOpen);
  const closeMobileSidebar = useUiStore((s) => s.closeMobileSidebar);

  return (
    <>
      <aside
        className={cn(
          'sticky top-0 hidden h-svh shrink-0 border-r border-slate-100 bg-white transition-[width] duration-200 lg:flex dark:border-slate-800 dark:bg-slate-900',
          isCollapsed ? 'w-[76px]' : 'w-64',
        )}
      >
        <SidebarContent onNavigate={() => {}} />
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/50"
              onClick={closeMobileSidebar}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="relative flex h-full w-72 flex-col bg-white shadow-2xl dark:bg-slate-900"
            >
              <button
                onClick={closeMobileSidebar}
                aria-label="Close menu"
                className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="size-5" />
              </button>
              <SidebarContent onNavigate={closeMobileSidebar} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
