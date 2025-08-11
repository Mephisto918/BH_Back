// export interface FDF

// id           Int
// ownerId      Int
// fileFormat   FileFormat
// type         PermitType
// url          String
// expiresAt    DateTime
// status       PermitStatus
// verifiedById Int? // FK to Admin who verified
// verifiedBy   Admin?       @relation(fields: [verifiedById], references: [id])
// verifiedAt   DateTime?
// approvedAt   DateTime?
// owner        Owner        @relation(fields: [ownerId], references: [id])
// isDeleted    Boolean      @default(false)
// deletedAt    DateTime?
// createdAt    DateTime     @default(now())
// updatedAt    DateTime     @updatedAt

//* ownerId Int
//* fileFormat FileFormat
//* type PermitType
//* url String
//* expiresAt DateTime
//* verifiedById Int?
//* approvedAt DateTime?
