import { z } from 'zod';

/** Reusable ISO-8601 date-time string (with timezone offset) */
export const ISODateString = z.string().datetime({ offset: true });

/** Enums */
export const FileFormatSchema = z.enum([
  'PDF',
  'IMAGE',
  'VIDEO',
  'AUDIO',
  'OTHER',
]);
export const PermitTypeSchema = z.enum([
  'BUSINESS_PERMIT',
  'DTI',
  'SEC',
  'FIRE_CERTIFICATE',
]);
export const PermitStatusSchema = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'EXPIRED',
]);

/** Full record shown to admins */
export const PermitMetaDataSchema = z
  .object({
    id: z.number().int().positive(),
    ownerId: z.number().int().positive(),
    fileFormat: FileFormatSchema,
    type: PermitTypeSchema,
    url: z.string().min(1),
    expiresAt: ISODateString,
    status: PermitStatusSchema,

    verifiedById: z.number().int().positive().nullable().optional(),
    verifiedAt: ISODateString.nullable().optional(),
    approvedAt: ISODateString.nullable().optional(),

    isDeleted: z.boolean(),
    deletedAt: ISODateString.nullable().optional(),

    createdAt: ISODateString,
    updatedAt: ISODateString,
    // owner: z.object({ firstname: z.string(), lastname: z.string() }),
    ownerFullName: z.string(),
  })
  .strict();

/** Array response helper */
export const PermitMetaDataArraySchema = z.array(PermitMetaDataSchema);

/** Payload for creating a permit (admin uploads file separately via Multer) */
export const CreatePermitSchema = z
  .object({
    ownerId: z.number().int().positive(),
    type: PermitTypeSchema,
    fileFormat: FileFormatSchema,
    expiresAt: ISODateString,

    // Optional on create; your service can set defaults (e.g., "PENDING")
    status: PermitStatusSchema.optional(),
  })
  .strict();

/** Payload for updating a permit (admin actions / auditing) */
export const UpdatePermitSchema = z
  .object({
    // Typically updatable fields:
    status: PermitStatusSchema.optional(),
    verifiedById: z.number().int().positive().nullable().optional(),
    verifiedAt: ISODateString.nullable().optional(),
    approvedAt: ISODateString.nullable().optional(),
    expiresAt: ISODateString.optional(),
    isDeleted: z.boolean().optional(),
    deletedAt: ISODateString.nullable().optional(),
  })
  .strict()
  // Example business rules (optional, tweak as you like):
  .refine((d) => !(d.status === 'APPROVED') || d.approvedAt != null, {
    message: 'approvedAt is required when status is APPROVED',
    path: ['approvedAt'],
  })
  .refine(
    (d) => !(d.status === 'REJECTED') || d.verifiedAt == null, // example rule: rejected shouldn’t have verifiedAt
    {
      message: 'verifiedAt should be null when status is REJECTED',
      path: ['verifiedAt'],
    },
  );

/** Inferred TS types (keep your types in sync with Zod) */
export type FileFormat = z.infer<typeof FileFormatSchema>;
export type PermitType = z.infer<typeof PermitTypeSchema>;
export type PermitStatus = z.infer<typeof PermitStatusSchema>;
export type PermitMetaData = z.infer<typeof PermitMetaDataSchema>;
export type CreatePermitDto = z.infer<typeof CreatePermitSchema>;
export type UpdatePermitDto = z.infer<typeof UpdatePermitSchema>;

export const EntityTypeSchema = z.enum(['tenants', 'owners']);

export type EntityType = z.infer<typeof EntityTypeSchema>;
