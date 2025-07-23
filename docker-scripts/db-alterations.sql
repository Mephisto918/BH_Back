CREATE EXTENSION IF NOT EXISTS postgis;


ALTER TABLE "BoardingHouse" ALTER COLUMN "amenities" TYPE jsonb USING "amenities"::jsonb;
ALTER TABLE "BoardingHouse" ALTER COLUMN "properties" TYPE jsonb USING "properties"::jsonb;
ALTER TABLE "Room" ALTER COLUMN "features" TYPE jsonb USING "features"::jsonb;
ALTER TABLE "Room" ALTER COLUMN "tags" TYPE jsonb USING "tags"::jsonb;
ALTER TABLE "AuditLog" ALTER COLUMN "meta" TYPE jsonb USING "meta"::jsonb;
ALTER TABLE "AuditLog" ALTER COLUMN "user" TYPE jsonb USING "user"::jsonb;

UPDATE "BoardingHouse" SET "amenities" = '[]'::jsonb WHERE "amenities" IS NULL;
UPDATE "BoardingHouse" SET "properties" = '{}'::jsonb WHERE "properties" IS NULL;
UPDATE "Room" SET "features" = '{}'::jsonb WHERE "features" IS NULL;
UPDATE "Room" SET "tags" = '[]'::jsonb WHERE "tags" IS NULL;
UPDATE "AuditLog" SET "meta" = '{}'::jsonb WHERE "meta" IS NULL;
UPDATE "AuditLog" SET "user" = '{}'::jsonb WHERE "user" IS NULL;

CREATE INDEX IF NOT EXISTS gin_idx_boardinghouse_amenities ON "BoardingHouse" USING GIN ("amenities");
CREATE INDEX IF NOT EXISTS gin_idx_boardinghouse_properties ON "BoardingHouse" USING GIN ("properties");
CREATE INDEX IF NOT EXISTS gin_idx_room_features ON "Room" USING GIN ("features");
CREATE INDEX IF NOT EXISTS gin_idx_room_tags ON "Room" USING GIN ("tags");
CREATE INDEX IF NOT EXISTS gin_idx_auditlog_meta ON "AuditLog" USING GIN ("meta");
CREATE INDEX IF NOT EXISTS gin_idx_auditlog_user ON "AuditLog" USING GIN ("user");

ALTER TABLE "Image" ADD CONSTRAINT IF NOT EXISTS check_one_relation CHECK (
  "boardingHouseId" IS NOT NULL OR
  "roomId" IS NOT NULL OR
  "ownerId" IS NOT NULL OR
  "tenantId" IS NOT NULL OR
  "adminId" IS NOT NULL
);

