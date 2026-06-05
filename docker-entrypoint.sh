#!/bin/sh
set -e

echo "Running Prisma generate..."
npx prisma generate

echo "Running Prisma db push..."
npx prisma db push --accept-data-loss

echo "Running seed..."
npx tsx prisma/seed.ts

echo "Starting application..."
exec node server.js
