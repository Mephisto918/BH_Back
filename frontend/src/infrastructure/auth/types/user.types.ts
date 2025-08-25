export interface BaseUser {
  id?: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  role?: UserRole; // Assuming your UserRole enum resolves like this
  isActive?: boolean;
  isVerified?: boolean;
  createdAt?: string; // Prisma will return ISO string
  updatedAt?: string;
  age: number;
  address: string;
  phone_number: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}

export const roleToSliceMap = {
  ADMIN: 'admins',
  GUEST: 'GUEST',
} as const;

export interface Admin extends BaseUser {
  role: UserRole.ADMIN;
}

export interface AdminData extends BaseUser {
  role: UserRole.ADMIN; // ensures type safety
}

export interface AdminState {
  selectedUser: Admin | null;
  filter: string;
  loading: boolean;
  error: string | null;
}
