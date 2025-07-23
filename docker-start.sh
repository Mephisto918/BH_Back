#!/bin/sh

./wait-for-db.sh

echo "⚙️ Running prisma generate..."
npx prisma generate

echo "⚙️ Applying pending migrations..."
npx prisma migrate deploy

echo "🚀 Starting NestJS..."
node dist/main
