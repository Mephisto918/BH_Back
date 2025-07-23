#!/bin/sh

# Wait until Postgres is up
echo "⏳ Waiting for Postgres..."
until nc -z db 5432; do
  sleep 1
done

# Enable PostGIS extension if not already
echo "🧩 Enabling PostGIS if missing..."
npx prisma db execute --sql "CREATE EXTENSION IF NOT EXISTS postgis;" --preview-feature

# Apply migrations
echo "📦 Running Prisma Migrate Deploy..."
npx prisma migrate deploy

# (Optional) Run seeds
# npx prisma db seed

# Start server
echo "🚀 Starting NestJS app..."
node dist/main.js
