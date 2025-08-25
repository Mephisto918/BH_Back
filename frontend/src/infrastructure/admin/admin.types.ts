/*
  id           Int
  username     String
  firstname    String
  lastname     String
  email        String
  password     String
  role         UserRole
  isActive     Boolean
  isVerified   Boolean
  createdAt    DateTime
  updatedAt    DateTime
  age          Int
  address      String
  phone_number String
*/

import { BaseUser } from '../user/user.types';

export interface Admin extends BaseUser {
  role: 'ADMIN';
}

export interface AdminState {
  selectedUser: Admin | null;
  filter: string;
  loading: boolean;
  error: string | null;
}

export interface AdminState {
  users: User[]; // list of all users visible to admin
  selectedUser: User | null; // currently selected user (for edit/view)
  loading: boolean;
  error: string | null;
  filter: string; // search/filter term
}
