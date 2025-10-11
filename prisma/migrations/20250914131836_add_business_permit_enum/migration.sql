/*
  Warnings:

  - The values [BUSINESS_PERMIT] on the enum `PermitType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PermitType_new" AS ENUM ('BIR', 'DTI', 'SEC', 'FIRE_CERTIFICATE', 'SANITARY_PERMIT');
ALTER TABLE "public"."Permit" ALTER COLUMN "type" TYPE "public"."PermitType_new" USING ("type"::text::"public"."PermitType_new");
ALTER TYPE "public"."PermitType" RENAME TO "PermitType_old";
ALTER TYPE "public"."PermitType_new" RENAME TO "PermitType";
DROP TYPE "public"."PermitType_old";
COMMIT;
