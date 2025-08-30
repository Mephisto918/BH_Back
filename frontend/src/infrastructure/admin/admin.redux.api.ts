import { BACKEND_API } from '@/app/config/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiResponseType } from '../common/types/backend-reponse.type';
import { Admin } from './admin.types';
import { ownerEndpoints, tenantEndpoints } from './configs';

const adminApiRoute = `/admins`;
export const adminApi = createApi({
  tagTypes: ['Admin', 'Tenant', 'Owner'],
  reducerPath: 'adminsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_API,
    // skips the fetchFn that logs, for debugging only
    //  fetchFn: async (input, init) => {
    //   console.log("FETCHING URL:", input);
    //   console.log("FETCH INIT:", init);
    //   return fetch(input, init);
    // },
  }),

  endpoints: (builder) => ({
    getAll: builder.query<Admin[], void>({
      // TODO: add pagination
      query: () => adminApiRoute,
      transformResponse: (response: ApiResponseType<Admin[]>) =>
        response.results ?? [],
    }),
    getOne: builder.query<Admin, number>({
      query: (id) => `${adminApiRoute}/${id}`,
      transformResponse: (response: ApiResponseType<Admin>) =>
        response.results ?? null,
      providesTags: (result, error, id) => [{ type: 'Admin', id }],
    }),
    create: builder.mutation<Admin, Partial<Admin>>({
      query: (data) => ({
        url: adminApiRoute,
        method: 'POST',
        body: data,
      }),
      //* Optional: invalidates cache for "Admin"
      invalidatesTags: ['Admin'],
    }),
    patch: builder.mutation<Admin, { id: number; data: Partial<Admin> }>({
      query: ({ id, data }) => ({
        url: `${adminApiRoute}/${id}`,
        method: 'PATCH',
        body: data,
      }),
      //* Optional: invalidates cache for "Admin"
      invalidatesTags: ['Admin'],
    }),
    delete: builder.mutation<Admin, number>({
      query: (id) => ({
        url: `${adminApiRoute}/${id}`,
        method: 'DELETE',
      }),
      //* Optional: invalidates cache for "Admin"
      invalidatesTags: ['Admin'],
    }),
    ...tenantEndpoints(builder),
    ...ownerEndpoints(builder),
  }),
});
export const {
  useGetAllQuery,
  useGetOneQuery,
  useCreateMutation,
  usePatchMutation,
  useDeleteMutation,
  useGetAllTenantsQuery,
  useCreateTenantMutation,
  useDeleteTenantMutation,
  useGetAllOwnersQuery,
  useCreateOwnerMutation,
  useDeleteOwnerMutation,
} = adminApi;
