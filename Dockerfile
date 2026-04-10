FROM node:18

WORKDIR /app

COPY . .

RUN corepack enable
RUN pnpm install
RUN pnpm --filter @raysstream/db prisma generate
RUN pnpm --filter @raysstream/web build

EXPOSE 3000

CMD ["pnpm", "--filter", "@raysstream/web", "start"]  
