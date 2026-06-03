#!/bin/sh
set -e

echo "Running Prisma generate..."
prisma generate

echo "Running Prisma db push..."
prisma db push --accept-data-loss

echo "Running seed..."
tsx prisma/seed.ts

echo "Starting application..."
exec su -s /bin/sh -c "exec node server.js" nextjs
