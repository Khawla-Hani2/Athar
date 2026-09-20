import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  CalendarDays,
  Megaphone,
  FileText,
  Inbox,
  KanbanSquare,
  PenTool,
  FolderOpen,
  Palette,
  Users,
  BarChart3,
  FileBarChart,
  Bell,
  Sparkles,
  UserCircle,
  Settings,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  permissionKey: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, permissionKey: 'dashboard' },
  { label: 'Calendar', path: '/calendar', icon: CalendarDays, permissionKey: 'calendar' },
  { label: 'Campaigns', path: '/campaigns', icon: Megaphone, permissionKey: 'campaigns' },
  { label: 'Content Planner', path: '/content-planner', icon: FileText, permissionKey: 'content-planner' },
  { label: 'Content Requests', path: '/content-requests', icon: Inbox, permissionKey: 'content-requests' },
  { label: 'Tasks', path: '/tasks', icon: KanbanSquare, permissionKey: 'tasks' },
  { label: 'Design Requests', path: '/design-requests', icon: PenTool, permissionKey: 'design-requests' },
  { label: 'Media Library', path: '/media-library', icon: FolderOpen, permissionKey: 'media-library' },
  { label: 'Brand Center', path: '/brand-center', icon: Palette, permissionKey: 'brand-center' },
  { label: 'Team Management', path: '/team', icon: Users, permissionKey: 'team' },
  { label: 'Analytics', path: '/analytics', icon: BarChart3, permissionKey: 'analytics' },
  { label: 'Reports', path: '/reports', icon: FileBarChart, permissionKey: 'reports' },
  { label: 'Notifications', path: '/notifications', icon: Bell, permissionKey: 'notifications' },
  { label: 'AI Assistant', path: '/ai-assistant', icon: Sparkles, permissionKey: 'ai-assistant' },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: 'Profile', path: '/profile', icon: UserCircle, permissionKey: 'profile' },
  { label: 'Settings', path: '/settings', icon: Settings, permissionKey: 'settings' },
];
