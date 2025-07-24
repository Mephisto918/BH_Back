#!/bin/sh

./wait-for-db.sh

echo "⚙️ Running prisma generate..."
npx prisma generate

echo "⚙️ Applying pending migrations..."
npx prisma migrate deploy

echo "📦 Applying custom SQL alterations..."
psql $DATABASE_URL -f docker-scripts/db-alterations.sql

echo "🚀 Starting NestJS..."
node dist/main
