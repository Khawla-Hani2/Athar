import { Navigate, Outlet } from 'react-router-dom';
import { usePermission } from '@/hooks/usePermission';

interface RoleRouteProps {
  permissionKey: string;
}

export function RoleRoute({ permissionKey }: RoleRouteProps) {
  const { can } = usePermission();

  if (!can(permissionKey)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
