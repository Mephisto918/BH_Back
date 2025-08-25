import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/stores';

interface PrivateRouteGuardProps {
  redirectTo?: string;
  children?: React.ReactNode;
  bypass?: boolean;
}

export function PrivateRouteGuard({
  redirectTo = '/auth/login',
  children,
  bypass = false,
}: PrivateRouteGuardProps) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  // If bypass is ON → always allow
  if (bypass) {
    return children ? <>{children}</> : <Outlet />;
  }

  // If not logged in → redirect
  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  // Otherwise → render
  return children ? <>{children}</> : <Outlet />;
}
