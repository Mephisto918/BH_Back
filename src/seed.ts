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

    // Split the file content by semicolon to separate statements,
    // but also filter out empty statements caused by trailing semicolons or blank lines
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(
      `🔍 Running ${statements.length} SQL statements from: ${sqlFile}`,
    );

    for (const statement of statements) {
      console.log(`📝 Executing statement:\n${statement};`);
      await prisma.$executeRawUnsafe(statement);
    }

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
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Error during disconnect:', e);
  });
