#!/bin/sh

echo "Waiting for database..."
sleep 5

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Generating Prisma Client..."
npx prisma generate

echo "Seeding database..."
npx prisma db seed

echo "Starting application..."
npm run dev