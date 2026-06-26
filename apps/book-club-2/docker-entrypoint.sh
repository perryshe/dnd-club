#!/bin/sh
set -e

echo "Running database push..."
npx prisma db push --skip-generate

echo "Starting app..."
exec node server.js
