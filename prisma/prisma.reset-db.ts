import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  // Disable referential integrity temporarily (PostgreSQL only)
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE
    "Image",
    "RoomAvailabilityLog",
    "Booking",
    "Room",
    "Permit",
    "BoardingHouse",
    "Location",
    "AuditLog",
    "Tenant",
    "Owner",
    "Admin"
    RESTART IDENTITY CASCADE;
  `);

  console.log('✅ Database cleared');
}

clearDatabase()
  .catch((e) => {
    console.error('❌ Failed to clear DB:', e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
