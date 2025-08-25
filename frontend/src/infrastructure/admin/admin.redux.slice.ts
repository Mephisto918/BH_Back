import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Admin, AdminState } from './admin.types';

const initialState: AdminState = {
  selectedUser: null,
  filter: '',
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {
    selectUser(state, action: PayloadAction<Admin>) {
      state.selectedUser = action.payload;
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
  },
});

export const { selectUser, clearSelectedUser } = adminSlice.actions;
export default adminSlice.reducer;
