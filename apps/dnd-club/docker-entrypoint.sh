#!/bin/sh
set -e

echo "Running Prisma generate..."
npx prisma generate

echo "Starting application..."
exec node server.js
