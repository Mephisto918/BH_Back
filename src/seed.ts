import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    const sqlFile = path.resolve(
      __dirname,
      '..',
      'docker-scripts',
      'db-alterations.sql',
    );

    if (!fs.existsSync(sqlFile)) {
      throw new Error(`SQL file not found at: ${sqlFile}`);
    }

    const sql = fs.readFileSync(sqlFile, 'utf-8');

    console.log(`🔍 Running SQL from: ${sqlFile}`);
    await prisma.$executeRawUnsafe(sql);
    console.log('✅ Custom SQL script applied!');
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
