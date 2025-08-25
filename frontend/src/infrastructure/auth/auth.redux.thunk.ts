import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  selectUser as selectTenant,
  tenantApi,
} from "../tenants/tenant.redux.slice";
import {
  selectUser as selectOwner,
  ownerApi,
} from "../owner/owner.redux.slice";
import {
  selectUser as selectAdmin,
  adminApi,
} from "../admin/admin.redux.slice";

import { UserRole } from "../user/user.types";
import { Admin } from "../admin/admin.types";
import { Tenant } from "../tenants/tenant.types";
import { Owner } from "../owner/owner.types";

type Args = { id: number; role: UserRole };

export const fetchUserDataThunk = createAsyncThunk<void, Args>(
  "auth/fetchUserDataThunk",
  async ({ id, role }, { dispatch }) => {
    let result;

    if (role === UserRole.TENANT) {
      result = await dispatch(tenantApi.endpoints.getOne.initiate(id)).unwrap();
      dispatch(selectTenant(result as Tenant));
    } else if (role === UserRole.OWNER) {
      result = await dispatch(ownerApi.endpoints.getOne.initiate(id)).unwrap();
      dispatch(selectOwner(result as Owner));
    } else if (role === UserRole.ADMIN) {
      result = await dispatch(adminApi.endpoints.getOne.initiate(id)).unwrap();
      dispatch(selectAdmin(result as Admin));
    } else {
      throw new Error("Invalid role");
    }

    // Optional: logging
    // console.log("Fetched user data:", result);
  }
);
