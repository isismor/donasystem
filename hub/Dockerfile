FROM node:22-alpine AS base
RUN apk add --no-cache python3 make g++ && corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG AUTH_USER=admin
ARG AUTH_PASS=change-me
ARG API_KEY=default-key
ARG AUTH_SECRET=default-secret
ARG MC_ALLOW_ANY_HOST=true
ENV AUTH_USER=$AUTH_USER AUTH_PASS=$AUTH_PASS API_KEY=$API_KEY AUTH_SECRET=$AUTH_SECRET
ENV MC_ALLOW_ANY_HOST=$MC_ALLOW_ANY_HOST
ENV MC_DEFAULT_GATEWAY_NAME=Dona
ENV NEXT_PUBLIC_GATEWAY_CLIENT_ID=torre-dona
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=deps /app/node_modules ./node_modules
RUN mkdir -p /app/.data && chown nextjs:nodejs /app/.data
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
