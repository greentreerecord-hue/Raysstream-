@echo off
cd /d C:\users\Lenovo\downloads\raysstream_ready\raysstream\packages\db
npx prisma generate
npx prisma db push

cd /d C:\users\Lenovo\Downloads\raysstream_ready\raysstream\apps\web
pnpm dev

pause