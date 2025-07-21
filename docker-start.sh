#!/bin/sh

echo "🏗️ Running Migrations..."
npx prisma migrate deploy || { echo "❌ Migration failed"; exit 1; }

echo "🌱 Running Seed..."
npm run seed || { echo "❌ Seeding failed"; exit 1; }

echo "🚀 Starting App..."
node dist/main
