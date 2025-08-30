import { BACKEND_API } from '@/app/config/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiResponseType } from '../common/types/backend-reponse.type';
import { CreateTenant, GetTenant, Tenant } from './tenant.types';

//* createApi
//* For accessing the API with built-in abstractions
//* such as isLoading, error, and others.
const tenantApiRoute = `/tenants`;
export const tenantApi = createApi({
  tagTypes: ['Tenant'],
  reducerPath: 'tenantApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_API,
    fetchFn: async (input, init) => {
      console.log('FETCHING URL:', input);
      console.log('FETCH INIT:', init);
      return fetch(input, init);
    },
  }),

  endpoints: (builder) => ({
    getAll: builder.query<GetTenant[], void>({
      // TODO: add pagination
      query: () => tenantApiRoute,
      transformResponse: (response: ApiResponseType<GetTenant[]>) => {
        return (response.results ?? []).map((tenant) => ({
          ...tenant,
          fullname: `${tenant.firstname} ${tenant.lastname}`,
        }));
      },
    }),
    getOne: builder.query<Tenant, number>({
      query: (id) => `${tenantApiRoute}/${id}`,
      transformResponse: (response: ApiResponseType<Tenant>) =>
        response.results ?? null,
      //* Optional: invalidates cache for "Tenant"
      providesTags: (result, error, id) => [{ type: 'Tenant', id }],
    }),
    create: builder.mutation<CreateTenant, Partial<CreateTenant>>({
      query: (data) => {
        const trans = {
          ...data,
          age: data.age !== undefined ? Number(data.age) : undefined,
        };
        return {
          url: tenantApiRoute,
          method: 'POST',
          body: trans,
        };
      },
      //* Optional: invalidates cache for "Tenant"
      invalidatesTags: ['Tenant'],
    }),
    patch: builder.mutation<Tenant, { id: number; data: Partial<Tenant> }>({
      query: ({ id, data }) => ({
        url: `${tenantApiRoute}/${id}`,
        method: 'PATCH',
        body: data,
      }),
      //* Optional: invalidates cache for "Tenant"
      invalidatesTags: ['Tenant'],
    }),
    delete: builder.mutation<Tenant, number>({
      query: (id) => ({
        url: `${tenantApiRoute}/${id}`,
        method: 'DELETE',
      }),
      //* Optional: invalidates cache for "Tenant"
      invalidatesTags: ['Tenant'],
    }),
  }),
});
// Export hooks for usage in functional components
export const {
  useGetAllQuery,
  useGetOneQuery,
  useCreateMutation,
  usePatchMutation,
  useDeleteMutation,
} = tenantApi;

// * -- createApi Usage --
/*
 * // Fetch all tenants
 * const { data: tenants, isLoading, error } = useGetAllQuery();
 *
 * // Fetch a tenant by ID
 * const { data: tenant, isLoading: isTenantLoading, error: tenantError } = useGetOneQuery(id);
 *
 * // Create a tenant
 * const [createTenant, { isLoading: isCreating, error: createError }] = useCreateMutation();
 * // createTenant({ username: "john", ... });
 *
 * // Delete a tenant
 * const [deleteTenant, { isLoading: isDeleting, error: deleteError }] = useDeleteMutation();
 * // deleteTenant(id);
 */
