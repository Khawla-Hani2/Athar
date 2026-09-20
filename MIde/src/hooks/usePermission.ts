import { useAuthStore } from '@/store/authStore';
import { hasPermission } from '@/constants/roles';

export function usePermission() {
  const user = useAuthStore((s) => s.user);

  const can = (key: string): boolean => {
    if (!user) return false;
    return hasPermission(user.role, key);
  };

  return { can, role: user?.role };
}
