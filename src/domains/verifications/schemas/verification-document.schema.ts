import { z } from 'zod';
import { UserRole, VerificationType } from '@prisma/client';

export const VerificationInputSchema = z
  .object({
    ownerId: z.number().optional(),
    tenantId: z.number().optional(),
    type: z.nativeEnum(VerificationType),
    expiresAt: z.coerce.date(),
  })
  .refine((data) => data.ownerId || data.tenantId, {
    message: 'Either ownerId or tenantId must be provided',
  })
  .transform((data) => ({
    userId: data.ownerId ?? data.tenantId,
    userType: data.ownerId ? UserRole.OWNER : UserRole.TENANT,
    verificationType: data.type,
    expiresAt: data.expiresAt,
  }));

export const VerificationOutputSchema = z
  .object({
    id: z.number(),
    userId: z.number(),
    userType: z.nativeEnum(UserRole),
    verificationType: z.nativeEnum(VerificationType),
    expiresAt: z.date(),
    createdAt: z.date(),
  })
  .transform((data) => ({
    id: data.id,
    user: {
      type: data.userType,
      id: data.userId,
    },
    type: data.verificationType,
    expiresAt: data.expiresAt,
    createdAt: data.createdAt,
  }));

export type VerificationInput = z.infer<typeof VerificationInputSchema>;
export type VerificationOutput = z.infer<typeof VerificationOutputSchema>;
