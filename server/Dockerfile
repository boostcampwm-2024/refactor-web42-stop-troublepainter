FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest-9 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

ARG REDIS_HOST
ARG REDIS_PORT

ENV NODE_ENV=production
ENV PORT=3000
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PORT=$REDIS_PORT

EXPOSE 3000

CMD ["node", "dist/main.js"]