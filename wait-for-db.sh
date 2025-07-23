#!/bin/sh
# Wait until PostgreSQL is ready

echo "Waiting for Postgres at $DATABASE_URL..."

until nc -z db 5432; do
  echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Postgres is up - executing command"
exec "$@"
