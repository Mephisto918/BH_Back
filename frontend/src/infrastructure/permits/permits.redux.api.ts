import { BACKEND_API } from '@/app/config/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { EntityType, PermitMetaData } from './permits.types';
import { ApiResponseType } from '../common/types/backend-reponse.type';

const permitApiRoute = `permits`;
export const permitsApi = createApi({
  tagTypes: ['Permit'],
  reducerPath: 'permitsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_API,
    fetchFn: async (input, init) => {
      // console.log('FETCHING URL:', input);
      // console.log('FETCH INIT:', init);
      return fetch(input, init);
    },
  }),

  endpoints: (builder) => ({
    getAll: builder.query<PermitMetaData[], EntityType>({
      query: (entityType) => `${entityType}/${permitApiRoute}`,
      transformResponse: (response: ApiResponseType<PermitMetaData[]>) => {
        return (response.results ?? []).map((permit) => ({
          ...permit,
          ownerFullName: `${permit.owner.firstname} ${permit.owner.lastname}`, // add a computed field
        }));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Permit' as const, id })),
              { type: 'Permit', id: 'LIST' },
            ]
          : [{ type: 'Permit', id: 'LIST' }],
    }),
    getOne: builder.query<
      PermitMetaData | null,
      { entityType: EntityType; id: number }
    >({
      query: ({ entityType, id }) => `${entityType}/${id}/${permitApiRoute}`,
      transformResponse: (response: ApiResponseType<PermitMetaData>) => {
        const result = response.results ?? null;
        if (!result) return null;
        return {
          ...result,
          ownerFullName: `${result.owner.firstname} ${result.owner.lastname}`,
        };
      },
      providesTags: (result, error, { id }) => [{ type: 'Permit', id }],
    }),
  }),
});

export const {
  useGetAllQuery,
  useGetOneQuery,
  // useCreateMutation,
  // usePatchMutation,
  // useDeleteMutation,
} = permitsApi;
