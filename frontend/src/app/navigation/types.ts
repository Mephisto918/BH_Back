export interface RootRoutes {
  '/': undefined;
  '/auth/login': undefined;
  '/auth/signup': undefined;
  '/admin': undefined;
  '*': undefined;
}

export interface AdminRoutes {
  '/admin/users/:id': { id: string };
}
