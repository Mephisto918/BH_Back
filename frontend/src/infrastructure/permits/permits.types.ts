import { z } from 'zod';

/** Reusable ISO-8601 date-time string (with timezone offset) */
export const ISODateString = z.string().datetime({ offset: true });

/** Enums based on Prisma */
export const FileFormatSchema = z.enum([
  'PDF',
  'IMAGE',
  'VIDEO',
  'AUDIO',
  'OTHER',
]);

export const MediaTypeSchema = z.enum([
  'PFP',
  'THUMBNAIL',
  'MAIN',
  'GALLERY',
  'BANNER',
  'FLOORPLAN',
  'DOCUMENT',
  'PAYMENT',
  'QR',
  'MAP',
  'ROOM',
  'VALID_ID',
]);

export const VerificationTypeSchema = z.enum([
  'BIR',
  'DTI',
  'SEC',
  'FIRE_CERTIFICATE',
  'SANITARY_PERMIT',
]);

export const VerificationStatusSchema = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'EXPIRED',
]);

export const UserRoleSchema = z.enum(['TENANT', 'OWNER', 'ADMIN']);

/** Full record for admin listing */
export const PermitMetaDataSchema = z
  .object({
    id: z.number().int().positive(),
    userId: z.number().int().positive(),
    userType: UserRoleSchema,
    fileFormat: FileFormatSchema,
    verificationType: VerificationTypeSchema,
    url: z.string().min(1),
    expiresAt: ISODateString,
    verificationStatus: VerificationStatusSchema,
    verifiedById: z.number().int().positive().nullable().optional(),
    verifiedAt: ISODateString.nullable().optional(),
    approvedAt: ISODateString.nullable().optional(),
    rejectionReason: z.string().nullable().optional(),
    uploadedAt: ISODateString,
    createdAt: ISODateString,
    updatedAt: ISODateString,
    isDeleted: z.boolean(),
    deletedAt: ISODateString.nullable().optional(),
    ownerFullName: z.string(),
  })
  .strict();

/** Array response */
export const PermitMetaDataArraySchema = z.array(PermitMetaDataSchema);

/** Payload for creating a permit */
export const CreatePermitSchema = z
  .object({
    userId: z.number().int().positive(),
    userType: UserRoleSchema,
    type: VerificationTypeSchema,
    fileFormat: FileFormatSchema,
    expiresAt: ISODateString,
    verificationStatus: VerificationStatusSchema.optional(), // default in Prisma is PENDING
  })
  .strict();

/** Payload for updating a permit */
export const UpdatePermitSchema = z
  .object({
    verificationStatus: VerificationStatusSchema.optional(),
    verifiedById: z.number().int().positive().nullable().optional(),
    verifiedAt: ISODateString.nullable().optional(),
    approvedAt: ISODateString.nullable().optional(),
    rejectionReason: z.string().nullable().optional(),
    expiresAt: ISODateString.optional(),
    isDeleted: z.boolean().optional(),
    deletedAt: ISODateString.nullable().optional(),
  })
  .strict()
  .refine(
    (d) => !(d.verificationStatus === 'APPROVED') || d.approvedAt != null,
    {
      message: 'approvedAt is required when verificationStatus is APPROVED',
      path: ['approvedAt'],
    },
  )
  .refine(
    (d) => !(d.verificationStatus === 'REJECTED') || d.rejectionReason != null,
    {
      message:
        'rejectionReason is required when verificationStatus is REJECTED',
      path: ['rejectionReason'],
    },
  );

/** TS types */
export type FileFormat = z.infer<typeof FileFormatSchema>;
export type MediaType = z.infer<typeof MediaTypeSchema>;
export type VerificationType = z.infer<typeof VerificationTypeSchema>;
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type PermitMetaData = z.infer<typeof PermitMetaDataSchema>;
export type CreatePermitDto = z.infer<typeof CreatePermitSchema>;
export type UpdatePermitDto = z.infer<typeof UpdatePermitSchema>;

export const EntityTypeSchema = z.enum(['tenants', 'owners']);

export type EntityType = z.infer<typeof EntityTypeSchema>;
