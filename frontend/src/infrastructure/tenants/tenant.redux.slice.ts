import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tenant, TenantState } from './tenant.types';

//* -- Thunks --
//* this is a side effect, you can call it like a function
//* has no plan to use it for now
// export const fetchTenantsThunk = createAsyncThunk(
//   "tenants/fetchAll",
//   async () => {

//     const response = await tenantsApi.endpoints.getAll.initiate();

//     return response.results ?? [];
//   }
// );

//* -- Initial State --
const initialState: TenantState = {
  selectedUser: null,
  filter: '',
  loading: false,
  error: null,
};

//* -- Slice --
//* are the object state, in here you can redcuers that acts like actions
const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    selectUser(state, action: PayloadAction<Tenant>) {
      state.selectedUser = action.payload;
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
    // TODO: Add Filter
  },

  //* NOTE: Currently not using thunk (fetchTenantsThunk) for async fetching.
  //* This is left here as reference for future use when handling side effects
  //* such as API calls with preprocessing logic or orchestrated requests.
  //extraReducers: (builder) => {
  /*
   *builder
   *  .addCase(fetchTenantsThunk.pending, (state) => {
   *    state.loading = true;
   *    state.error = null;
   *  })
   *  .addCase(fetchTenantsThunk.fulfilled, (state, action) => {
   *    state.loading = false;
   *    state.tenants = action.payload;
   *  })
   *  .addCase(fetchTenantsThunk.rejected, (state, action) => {
   *    state.loading = false;
   *    state.error = action.error.message || "Failed to fetch tenants";
   *  });
   */
  //},
});

//* --- Selectors ---
export const { selectUser, clearSelectedUser } = tenantSlice.actions;

//* --- Export reducer ---
export default tenantSlice.reducer;

// * Usage *
/*
 * Inside your React Component file....
 *
 * import { useSelector, useDispatch } from "react-redux";
 * import { useGetAllQuery } from "@/stores/tenants/tenants";
 * // adjust depending on the path
 *
 * import type { RootState } from "@/stores"
 * // assuming you have a RootState type exported from your store setup
 *
 *
 * // inside the function of the component
 * const dispatch = useDispatch();
 *
 * // Get tenants and selectedTenant from the slice state
 * const {data: tenants, isLoading, isError} = useGetAllQuery();
 * 
 * // then `tenants` contains the array of tenants
 * 
 * 
 * // TIP!
 * // use this to preload the data and do caching
 * // dispatch(tenantsApi.endpoints.getAll.initiate());
 * 
 * // TIP!
 * // use `const { refetch } = useGetAllQuery();` to manually refetch the data
 * // refetch();

 */
