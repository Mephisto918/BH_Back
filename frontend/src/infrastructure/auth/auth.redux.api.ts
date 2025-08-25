import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiResponseType } from '../common/types/backend-reponse.type';
import { AdminData } from './types/user.types';
import { BACKEND_API } from '@/app/config/api';
import { LoginResults } from './auth.types';

const authApiRoute = '/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_API,
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<
      LoginResults,
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: `${authApiRoute}/login`,
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: ApiResponseType<LoginResults>) => {
        // Make sure the backend response matches LoginResults
        // It should contain: { token: string, userData: AdminData }
        return response.results;
      },
      invalidatesTags: ['Auth'], // optional: refetch or invalidate auth-related data
    }),

    // Example: fetch current user (could be extended)
    getCurrentUser: builder.query<AdminData, void>({
      query: () => `${authApiRoute}/me`,
      providesTags: ['Auth'],
    }),
  }),
});

//* Export hooks for usage in funcitonal components
export const { useLoginMutation, useGetCurrentUserQuery } = authApi;

//* Usage
/*
 * const onLogin = async () => {
 * const { results } = await login(credentials).unwrap();
 *   dispatch(setAuth({ token: results.access_token, user: results.user }));
 * };
 *
 * // then anywhere
 * const user = useSelector((state: RootState) => state.auth.user);
 * if (user?.isVerified) {
 *   // show badge
 * }
 */
