import { FileFormat, PermitStatus, PermitType } from '@prisma/client';

export interface PermitMetaData {
  id: number;
  ownerId: number;
  fileFormat: FileFormat;
  type: PermitType;
  url: string;
  expiresAt: string;
  status: PermitStatus;
  verifiedById?: number | null; // nullable
  verifiedAt?: string | null;
  approvedAt?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
