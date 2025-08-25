// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/app/store/stores';
// import { UserRole } from '@/infrastructure/user/user.types';

// import {
//   useGetAllQuery as getAllTenant,
//   useGetOneQuery as getOneTenant,
//   useCreateMutation as createTenant,
//   usePatchMutation as patchTenant,
//   useDeleteMutation as deleteTenant,
// } from '@/infrastructure/tenants/tenant.redux.api';
// import { selectUser as selectTenant } from '../tenants/tenant.redux.slice';
// import { Tenant } from '@/infrastructure/tenants/tenant.types';

// import {
//   useGetAllQuery as getAllOwner,
//   useGetOneQuery as getOneOwner,
//   useCreateMutation as createOwner,
//   usePatchMutation as patchOwner,
//   useDeleteMutation as deleteOwner,
//   selectUser as selectOwner,
// } from '@/infrastructure/owner/owner.redux.slice';
// import { Owner } from '@/infrastructure/owner/owner.types';

// import {
//   useGetAllQuery as getAllAdmin,
//   useGetOneQuery as getOneAdmin,
//   useCreateMutation as createAdmin,
//   usePatchMutation as patchAdmin,
//   useDeleteMutation as deleteAdmin,
//   selectUser as selectAdmin,
// } from '@/infrastructure/admin/admin.redux.slice';
// import { Admin } from '@/infrastructure/admin/admin.types';

// // eslint-disable-next-line
// const noop = (...args: unknown[]) => {
//   throw new Error('NOOP: This operation is not supported for GUEST user.');
// };

// type ApiMapRecord = {
//   [UserRole.TENANT]: {
//     getAll: typeof getAllTenant;
//     getOne: typeof getOneTenant;
//     create: typeof createTenant;
//     patch: typeof patchTenant;
//     delete: typeof deleteTenant;
//     selector: (state: RootState) => Tenant | null;
//   };
//   [UserRole.OWNER]: {
//     getAll: typeof getAllOwner;
//     getOne: typeof getOneOwner;
//     create: typeof createOwner;
//     patch: typeof patchOwner;
//     delete: typeof deleteOwner;
//     selector: (state: RootState) => Owner | null;
//   };
//   [UserRole.ADMIN]: {
//     getAll: typeof getAllAdmin;
//     getOne: typeof getOneAdmin;
//     create: typeof createAdmin;
//     patch: typeof patchAdmin;
//     delete: typeof deleteAdmin;
//     selector: (state: RootState) => Admin | null;
//   };
//   [UserRole.GUEST]: {
//     getAll: () => undefined;
//     getOne: () => undefined;
//     create: () => undefined;
//     patch: () => undefined;
//     delete: () => undefined;
//     selector: () => undefined;
//   };
// };

// export const apiMap: ApiMapRecord = {
//   [UserRole.TENANT]: {
//     getAll: getAllTenant,
//     getOne: getOneTenant,
//     create: createTenant,
//     patch: patchTenant,
//     delete: deleteTenant,
//     selector: (state: RootState) => state.tenants.selectedUser,
//   },
//   [UserRole.OWNER]: {
//     getAll: getAllOwner,
//     getOne: getOneOwner,
//     create: createOwner,
//     patch: patchOwner,
//     delete: deleteOwner,
//     selector: (state: RootState) => state.owners.selectedUser,
//   },
//   [UserRole.ADMIN]: {
//     getAll: getAllAdmin,
//     getOne: getOneAdmin,
//     create: createAdmin,
//     patch: patchAdmin,
//     delete: deleteAdmin,
//     selector: (state: RootState) => state.admins.selectedUser,
//   },
//   [UserRole.GUEST]: {
//     getAll: () => noop(),
//     getOne: () => noop(),
//     create: () => noop(),
//     patch: () => noop(),
//     delete: () => noop(),
//     selector: () => undefined,
//   },
// };

// export function useDynamicUserApi() {
//   const dispatch = useDispatch();
//   const authUser = useSelector((state: RootState) => state.auth.userData);
//   const role = authUser?.role ?? UserRole.GUEST;
//   const id = authUser?.id;

//   if (role === UserRole.GUEST) {
//     const patchUser = async () => {
//       throw new Error('No patch for guest');
//     };
//     return {
//       role,
//       id,
//       selectedUser: null,
//       allQuery: null,
//       oneQuery: null,
//       createMutation: () => {
//         throw new Error('No create for guest');
//       },
//       patchUser,
//       deleteMutation: () => {
//         throw new Error('No delete for guest');
//       },
//       fetchAndSelect: async () => {
//         throw new Error('No fetchAndSelect for guest');
//       },
//     };
//   }

//   const apis = apiMap[role];

//   //* Access Queries Mutation
//   const allQuery = apis.getAll();
//   const oneQuery = id ? apis.getOne(id, { skip: !id }) : null;

//   //* create mutation
//   const [createMutation] = apis.create();

//   //* path
//   const [tenantPatch] = patchTenant();
//   const [ownerPatch] = patchOwner();
//   const [adminPatch] = patchAdmin();

//   const patchUser: (
//     id: number,
//     data: Partial<Tenant> | Partial<Owner> | Partial<Admin>,
//   ) => Promise<Tenant | Owner | Admin> = async (id, data) => {
//     if (role === UserRole.TENANT) {
//       return tenantPatch({ id, data: data as Partial<Tenant> }).unwrap();
//     }
//     if (role === UserRole.OWNER) {
//       return ownerPatch({ id, data: data as Partial<Owner> }).unwrap();
//     }
//     if (role === UserRole.ADMIN) {
//       return adminPatch({ id, data: data as Partial<Admin> }).unwrap();
//     }
//     throw new Error('Patch not allowed for this role');
//   };

//   const [deleteMutation] = apis.delete();

//   // TODO: fix
//   const selectedTenant = useSelector(
//     (state: RootState) => state.tenants.selectedUser,
//   );
//   const selectedOwner = useSelector(
//     (state: RootState) => state.owners.selectedUser,
//   );
//   const selectedAdmin = useSelector(
//     (state: RootState) => state.admins.selectedUser,
//   );

//   const selectedUser =
//     role === UserRole.TENANT
//       ? selectedTenant
//       : role === UserRole.OWNER
//         ? selectedOwner
//         : selectedAdmin;

//   //* TODO: Explain!
//   const fetchAndSelect = async (id: number) => {
//     if (!apis.getOne) throw new Error('getOne is not defined for this role');
//     const res = await apis.getOne(id)?.refetch();
//     if (res?.data) {
//       if (role === UserRole.TENANT) {
//         dispatch(selectTenant(res.data as Tenant));
//       } else if (role === UserRole.OWNER) {
//         dispatch(selectOwner(res.data as Owner));
//       } else if (role === UserRole.ADMIN) {
//         dispatch(selectAdmin(res.data as Admin));
//       }
//     }
//   };

//   return {
//     role,
//     id,
//     selectedUser,
//     allQuery,
//     oneQuery,
//     createMutation,
//     patchUser,
//     deleteMutation,
//     fetchAndSelect,
//   };
// }

// //* Usage
// /*
// * const {
// *   selectedUser,
// *   oneQuery,
// *   allQuery,
// *   createMutation,
// *   patchMutation,
// *   deleteMutation,
// *   fetchAndSelect
// * } = useDynamicUserApi();
// *
// * // Example: prefill form
// * useEffect(() => {
// *   if (oneQuery?.data) {
// *     setForm(oneQuery.data);
// *   }
// * }, [oneQuery?.data]);
// *
// * // Example: create new
// * const handleCreate = (data) => {
// *   createMutation(data).unwrap().then(() => {
// *     console.log("Created!");
// *   });
// * };
// *
// * // Example: update
// * const handleUpdate = (data) => {
// *   patchMutation({ id: selectedUser.id, data }).unwrap().then(() => {
// *     console.log("Updated!");
// *   });
// * };
// *
// * // Good for refinement later on
// * export function useDynamicUserOne(id: number) { ... }
// * export function useDynamicUserAll() { ... }
// * export function useDynamicUserCreate() { ... }

// */
