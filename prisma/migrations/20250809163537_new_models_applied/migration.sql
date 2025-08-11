/*
  Warnings:

  - The values [BIR,FIRE_CERTIFICATE,MAYORS_PERMIT] on the enum `PermitType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `boardingHouseId` on the `Permit` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `Permit` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Permit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Permit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileFormat" AS ENUM ('IMAGE', 'PDF', 'VIDEO', 'AUDIO', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('PFP', 'THUMBNAIL', 'MAIN', 'GALLERY', 'BANNER', 'FLOORPLAN', 'DOCUMENT', 'QR', 'MAP', 'ROOM', 'VALID_ID');

-- CreateEnum
CREATE TYPE "PermitStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- AlterEnum
BEGIN;
CREATE TYPE "PermitType_new" AS ENUM ('BUSINESS_PERMIT', 'DTI', 'SEC');
ALTER TABLE "Permit" ALTER COLUMN "type" TYPE "PermitType_new" USING ("type"::text::"PermitType_new");
ALTER TYPE "PermitType" RENAME TO "PermitType_old";
ALTER TYPE "PermitType_new" RENAME TO "PermitType";
DROP TYPE "PermitType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Permit" DROP CONSTRAINT "Permit_boardingHouseId_fkey";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "fileFormat" "FileFormat" NOT NULL DEFAULT 'IMAGE',
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "type",
ADD COLUMN     "type" "MediaType" NOT NULL;

-- AlterTable
ALTER TABLE "Permit" DROP COLUMN "boardingHouseId",
DROP COLUMN "fileUrl",
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fileFormat" "FileFormat" NOT NULL DEFAULT 'PDF',
ADD COLUMN     "status" "PermitStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedById" INTEGER;

-- DropEnum
DROP TYPE "ImageType";

-- AddForeignKey
ALTER TABLE "Permit" ADD CONSTRAINT "Permit_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
