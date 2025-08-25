// tenant.types.ts
import { BaseUserSchema } from '../user/user.types';
import { z } from 'zod';

// base schema
export const TenantSchema = BaseUserSchema.extend({
  role: z.literal('TENANT').optional(),
  guardian: z.string().nullable().optional(),
});
export type Tenant = z.infer<typeof TenantSchema>;

// for create
export const CreateTenantSchema = TenantSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateTenant = z.infer<typeof CreateTenantSchema>;

// for update
export const UpdateTenantSchema = CreateTenantSchema.partial();
export type UpdateTenant = z.infer<typeof UpdateTenantSchema>;

// for fetching/reading
export const GetTenantSchema = TenantSchema.extend({
  id: z.number(),
  fullname: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type GetTenant = z.infer<typeof GetTenantSchema>;

//  username: string;
//   firstname: string;
//   lastname: string;
//   email: string;
//   password: string;
//   phone_number: string;
//   address?: string;
//   guardian?: string;
//   age?: number;