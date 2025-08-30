import { ApiResponseType } from '../common/types/backend-reponse.type';
import { CreateOwner, GetOwner } from '../owner/owner.types';
import { CreateTenant, GetTenant } from '../tenants/tenant.types';

import type {
  EndpointBuilder,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';

type Builder = EndpointBuilder<
  BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    object, // ✅ replaces {}
    FetchBaseQueryMeta
  >,
  'Admin' | 'Tenant' | 'Owner',
  'adminsApi'
>;

const adminApiRoute = `/admins`;
export const tenantEndpoints = (builder: Builder) => ({
  getAllTenants: builder.query<
    GetTenant[],
    { page?: number | undefined; search?: string }
  >({
    query: ({ page = 1 }) => `${adminApiRoute}/tenants?page=${page}`,
    transformResponse: (response: ApiResponseType<GetTenant[]>) =>
      (response.results ?? []).map((tenant) => ({
        ...tenant,
        fullname: `${tenant.firstname} ${tenant.lastname}`,
      })),
    providesTags: (result: GetTenant[] | undefined) =>
      result
        ? [
            ...result.map(({ id }) => ({ type: 'Tenant' as const, id })),
            { type: 'Tenant', id: 'LIST' },
          ]
        : [{ type: 'Tenant', id: 'LIST' }],
  }),
  createTenant: builder.mutation<
    CreateTenant,
    { id: number | undefined; data: Partial<CreateTenant> }
  >({
    query: ({ id, data }) => {
      if (!id) {
        throw new Error('Admin ID is required to create a tenant');
      }
      return {
        url: `${adminApiRoute}/${id}/tenants`,
        method: 'POST',
        body: data,
      };
    },
    invalidatesTags: [{ type: 'Tenant', id: 'LIST' }],
  }),

  deleteTenant: builder.mutation<void, { adminId: number; tenantId: number }>({
    query: ({ adminId, tenantId }) => ({
      url: `${adminApiRoute}/${adminId}/tenants/${tenantId}`,
      method: 'DELETE',
    }),
    invalidatesTags: [{ type: 'Tenant', id: 'LIST' }],
  }),
});

export const ownerEndpoints = (builder: Builder) => ({
  getAllOwners: builder.query<
    GetOwner[],
    { page?: number | undefined; search?: string }
  >({
    query: ({ page = 1 }) => `${adminApiRoute}/owners?page=${page}`,
    transformResponse: (response: ApiResponseType<GetOwner[]>) =>
      (response.results ?? []).map((owner) => ({
        ...owner,
        fullname: `${owner.firstname} ${owner.lastname}`,
      })),
    providesTags: (result: GetOwner[] | undefined) =>
      result
        ? [
            ...result.map(({ id }) => ({ type: 'Owner' as const, id })),
            { type: 'Owner', id: 'LIST' },
          ]
        : [{ type: 'Owner', id: 'LIST' }],
  }),
  createOwner: builder.mutation<
    CreateOwner,
    { id: number | undefined; data: Partial<CreateOwner> }
  >({
    query: ({ id, data }) => {
      if (!id) {
        throw new Error('Admin ID is required to create an owner');
      }
      return {
        url: `${adminApiRoute}/${id}/owners`,
        method: 'POST',
        body: data,
      };
    },
    invalidatesTags: [{ type: 'Owner', id: 'LIST' }],
  }),
  deleteOwner: builder.mutation<void, { adminId: number; ownerId: number }>({
    query: ({ adminId, ownerId }) => ({
      url: `${adminApiRoute}/${adminId}/owners/${ownerId}`,
      method: 'DELETE',
    }),
    invalidatesTags: [{ type: 'Owner', id: 'LIST' }],
  }),
});
