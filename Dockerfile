FROM node:18

WORKDIR /app

COPY . .

RUN corepack enable
RUN pnpm install

EXPOSE 3000

CMD ["pnpm", "--filter", "@raysstream/web", "dev"] 
