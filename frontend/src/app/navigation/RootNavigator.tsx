import { createBrowserRouter, Outlet } from 'react-router-dom';
import LandingPage from '@/features/landing/landing-page';
import { PrivateRouteGuard } from '@/infrastructure/guards/route-guards/private-routes.guard';
import AdminNavigator from '@/features/admins/navigation/admins.navigator';
import AuthNavigator from '@/features/auth/navigation/auth.navigator';
import Error404Page from '@/features/shared/screens/Error-404.page';

export default function RootNavigator() {
  const adminNav = AdminNavigator();
  return createBrowserRouter([
    {
      path: '/', //* route
      element: <RootLayout />, //* screen
      children: [
        { index: true, element: <LandingPage /> }, //* default screen
        { ...AuthNavigator() },
        {
          ...adminNav,
          element: (
            <PrivateRouteGuard bypass={false}>
              {adminNav.element}
            </PrivateRouteGuard>
          ),
        },
        { path: '*', element: <Error404Page /> },
      ],
    },
  ]);
}

function RootLayout() {
  return <Outlet />;
}
