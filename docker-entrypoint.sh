#!/bin/sh
set -e
SCHEMA="./prisma/schema.prisma"

echo "Running Prisma generate..."
npx prisma generate --schema="$SCHEMA"

echo "Running Prisma db push..."
npx prisma db push --schema="$SCHEMA" --accept-data-loss

echo "Running seed..."
npx tsx prisma/seed.ts

echo "Starting application..."
exec node server.js
