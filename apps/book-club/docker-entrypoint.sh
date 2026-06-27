#!/bin/sh
set -e

echo "Running Prisma generate..."
npx prisma generate

echo "Running seed..."
npx tsx prisma/seed.ts

echo "Starting application..."
exec node server.js
