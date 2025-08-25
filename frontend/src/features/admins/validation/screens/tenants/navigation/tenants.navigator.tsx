import TenantsInfoScreen from '../screens/tenants.info.screen';
import TenantsMainScreen from '../screens/tenants.main.screen';
import TenantsLayout from './tenants.layout';

export default function TenantsValidationNavigator() {
  return {
    path: 'tenants', //* route
    element: <TenantsLayout />,
    children: [
      //* registering navigators
      { index: true, element: <TenantsMainScreen /> }, //* default screen
      { path: ':id', element: <TenantsInfoScreen /> },
    ],
  };
}
