#!/bin/sh

echo "⏳ Waiting for Postgres at $DATABASE_URL..."

while ! getent hosts db > /dev/null; do
  echo "🕸️ Waiting for DNS to resolve db..."
  sleep 2
done

echo "✅ DNS resolved db"

while ! pg_isready -h db -p 5432 -U mephiscus > /dev/null 2>&1; do
  echo "⛔ Postgres is unavailable - sleeping"
  sleep 2
done

echo "✅ Postgres is up - waiting a few seconds for stability"
sleep 5

