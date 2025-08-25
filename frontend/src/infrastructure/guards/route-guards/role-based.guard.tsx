import { RootState } from '@/app/store/stores';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export function RoleProtectedRoute({
  roles,
  redirectTo = '/landing',
}: {
  roles: string[];
  redirectTo?: string;
}) {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  const userRole = user?.role; // <- get role from user object

  return isLoggedIn && userRole && roles.includes(userRole) ? (
    <Outlet />
  ) : (
    <Navigate to={redirectTo} replace />
  );
}
