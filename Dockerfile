FROM node:18
WORKDIR /app
COPY . .
RUN corepack enable
RUN corepack prepare pnpm@8.15.0 --activate
RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @raysstream/web build
CMD ["pnpm","--filter","@raysstream/web","start"] 