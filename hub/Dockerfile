FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build args for env vars needed at build time
ARG AUTH_USER=admin
ARG AUTH_PASS=change-me
ARG API_KEY=default-key
ARG AUTH_SECRET=default-secret
ARG MC_ALLOW_ANY_HOST=true
ARG OPENCLAW_HOME=/home/openclaw/.openclaw
ARG OPENCLAW_GATEWAY_HOST=127.0.0.1
ARG OPENCLAW_GATEWAY_PORT=18789
ARG MC_DEFAULT_GATEWAY_NAME=Dona
ARG NEXT_PUBLIC_GATEWAY_HOST=127.0.0.1
ARG NEXT_PUBLIC_GATEWAY_PORT=18789
ARG NEXT_PUBLIC_GATEWAY_CLIENT_ID=torre-dona
ENV AUTH_USER=$AUTH_USER AUTH_PASS=$AUTH_PASS API_KEY=$API_KEY AUTH_SECRET=$AUTH_SECRET
ENV MC_ALLOW_ANY_HOST=$MC_ALLOW_ANY_HOST OPENCLAW_HOME=$OPENCLAW_HOME
ENV OPENCLAW_GATEWAY_HOST=$OPENCLAW_GATEWAY_HOST OPENCLAW_GATEWAY_PORT=$OPENCLAW_GATEWAY_PORT
ENV MC_DEFAULT_GATEWAY_NAME=$MC_DEFAULT_GATEWAY_NAME
ENV NEXT_PUBLIC_GATEWAY_HOST=$NEXT_PUBLIC_GATEWAY_HOST NEXT_PUBLIC_GATEWAY_PORT=$NEXT_PUBLIC_GATEWAY_PORT
ENV NEXT_PUBLIC_GATEWAY_CLIENT_ID=$NEXT_PUBLIC_GATEWAY_CLIENT_ID
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
RUN mkdir -p /app/.data && chown nextjs:nodejs /app/.data
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
