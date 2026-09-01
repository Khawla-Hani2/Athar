export interface NavItem {
  to: string
  label: string
  icon: string
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'الرئيسية', icon: 'home' },
  { to: '/tasks', label: 'كل المهام', icon: 'list' },
  { to: '/calendar', label: 'التقويم', icon: 'cal' },
  { to: '/statistics', label: 'إحصائياتي', icon: 'chart' },
  { to: '/notes', label: 'ملاحظاتي', icon: 'note' },
  { to: '/settings', label: 'الإعدادات', icon: 'gear' },
]
