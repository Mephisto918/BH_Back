// src/navigation/useTypedNavigate.ts
import { useNavigate } from 'react-router-dom';
import type { RootRoutes } from './types';

export function useTypedRootNavigation() {
  const navigate = useNavigate();

  return function navigateTo<T extends keyof RootRoutes>(
    route: T,
    params?: RootRoutes[T],
  ) {
    let path: string = route as string; // <-- cast to string

    // Replace params if any (for dynamic routes)
    if (params) {
      Object.keys(params).forEach((key) => {
        path = path.replace(`:${key}`, (params as any)[key]);
      });
    }

    navigate(path);
  };
}
