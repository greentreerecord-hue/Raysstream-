# Ray'sStream

Ray'sStream is a full-stack streaming-service starter built with Next.js, Prisma, PostgreSQL, Redis, Stripe, and a BullMQ worker.

## Stack
- Next.js 15 + React 19
- Prisma + PostgreSQL
- Redis + BullMQ
- Stripe checkout stub
- HLS playback via hls.js
- Worker process for transcoding jobs

## Local setup

```bash
pnpm install
cp .env.example .env
docker compose -f docker/docker-compose.yml up -d
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Web runs from `apps/web`.

## Demo account
- Email: `ray@raysstream.com`
- Password: `demo123`

## Deployment checklist
1. Create Neon Postgres and set both `DATABASE_URL` and `DIRECT_URL`.
2. Deploy `apps/web` to Vercel with root directory set to `apps/web`.
3. Deploy `apps/worker` to Railway, Render, or Fly as a long-running process.
4. Configure Redis and set `REDIS_URL` for both web and worker.
5. Replace Stripe placeholder price IDs before enabling billing.
6. Replace upload stubs with presigned S3 uploads before allowing real video ingestion.
