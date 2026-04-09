FROM node:18-alpine

WORKDIR /app

# copy everything
COPY . .

# enable pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# install dependencies
RUN pnpm install

# 🔥 CRITICAL FIX (run from root)
RUN npx prisma generate --schema=packages/db/prisma/schema.prisma

# ALSO keep this (monorepo safety)
RUN pnpm --filter @raysstream/db prisma generate

# build web
RUN pnpm --filter @raysstream/web build

# start app
CMD ["pnpm", "--filter", "@raysstream/web", "start"]  


 
