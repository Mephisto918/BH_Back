import {
  FileFormat,
  VerificationStatus,
  VerificationType,
} from '@prisma/client';

export interface VerificationDocumentMetaData {
  id: number;
  ownerId: number;
  fileFormat: FileFormat;
  type: VerificationStatus;
  url: string;
  expiresAt: string;
  status: VerificationType;
  verifiedById?: number | null; // nullable
  verifiedAt?: string | null;
  approvedAt?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
