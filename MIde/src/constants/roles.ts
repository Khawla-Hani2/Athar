import type { UserRole } from '@/types';

export const ALL_ROLES: UserRole[] = [
  'Admin',
  'Media Leader',
  'Content Writer',
  'Designer',
  'Photographer',
  'Video Editor',
  'Member',
];

export const ROLE_COLORS: Record<UserRole, string> = {
  Admin: '#7c3aed',
  'Media Leader': '#0ea5e9',
  'Content Writer': '#f59e0b',
  Designer: '#ec4899',
  Photographer: '#14b8a6',
  'Video Editor': '#22c55e',
  Member: '#64748b',
};

// Permission keys guard route/feature access. Admin & Media Leader are treated as superset roles.
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  Admin: ['*'],
  'Media Leader': [
    'dashboard', 'calendar', 'campaigns', 'content-planner', 'content-requests',
    'tasks', 'design-requests', 'media-library', 'brand-center', 'team',
    'analytics', 'reports', 'notifications', 'ai-assistant', 'profile', 'settings',
  ],
  'Content Writer': [
    'dashboard', 'calendar', 'content-planner', 'content-requests', 'tasks',
    'media-library', 'brand-center', 'notifications', 'ai-assistant', 'profile', 'settings',
  ],
  Designer: [
    'dashboard', 'calendar', 'design-requests', 'tasks', 'media-library',
    'brand-center', 'notifications', 'ai-assistant', 'profile', 'settings',
  ],
  Photographer: [
    'dashboard', 'calendar', 'tasks', 'media-library', 'notifications',
    'ai-assistant', 'profile', 'settings',
  ],
  'Video Editor': [
    'dashboard', 'calendar', 'tasks', 'media-library', 'notifications',
    'ai-assistant', 'profile', 'settings',
  ],
  Member: ['dashboard', 'calendar', 'tasks', 'notifications', 'profile', 'settings'],
};

export function hasPermission(role: UserRole, key: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return perms.includes('*') || perms.includes(key);
}
