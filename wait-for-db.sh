#!/bin/sh

echo "⏳ Waiting for Postgres at $DATABASE_URL..."

until pg_isready -h db -p 5432 -U mephiscus > /dev/null 2>&1; do
  echo "⛔ Postgres is unavailable - sleeping"
  sleep 2
done

echo "✅ Postgres is up - continuing"
