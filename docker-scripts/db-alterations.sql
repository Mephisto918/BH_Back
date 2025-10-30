CREATE EXTENSION IF NOT EXISTS postgis;


ALTER TABLE "BoardingHouse" ALTER COLUMN "amenities" TYPE jsonb USING "amenities"::jsonb;
ALTER TABLE "AuditLog" ALTER COLUMN "user" TYPE jsonb USING "user"::jsonb;

UPDATE "BoardingHouse" SET "amenities" = '[]'::jsonb WHERE "amenities" IS NULL;
UPDATE "AuditLog" SET "user" = '{}'::jsonb WHERE "user" IS NULL;

CREATE INDEX IF NOT EXISTS gin_idx_boardinghouse_amenities ON "BoardingHouse" USING GIN ("amenities");
CREATE INDEX IF NOT EXISTS gin_idx_auditlog_user ON "AuditLog" USING GIN ("user");

ALTER TABLE "Image" ADD CONSTRAINT IF NOT EXISTS check_one_relation CHECK (
  "boardingHouseId" IS NOT NULL OR
  "roomId" IS NOT NULL OR
  "ownerId" IS NOT NULL OR
  "tenantId" IS NOT NULL OR
  "adminId" IS NOT NULL
);

