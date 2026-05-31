FROM node:20-slim AS base
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN corepack enable pnpm

# --- deps ---
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/web/package.json apps/web/tsconfig.json apps/web/
COPY packages/contracts/package.json packages/contracts/tsconfig.json packages/contracts/
COPY packages/persistence/package.json packages/persistence/tsconfig.json packages/persistence/
COPY packages/orchestrator/package.json packages/orchestrator/tsconfig.json packages/orchestrator/
COPY packages/graph/package.json packages/graph/tsconfig.json packages/graph/
RUN pnpm install --frozen-lockfile

# --- build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/ ./
COPY packages/contracts/src packages/contracts/src
COPY packages/persistence/src packages/persistence/src
COPY packages/orchestrator/src packages/orchestrator/src
COPY packages/graph/src packages/graph/src
COPY apps/web/ apps/web/
RUN mkdir -p apps/web/public

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @umbral/contracts build && \
    pnpm --filter @umbral/persistence build && \
    pnpm --filter @umbral/orchestrator build && \
    pnpm --filter @umbral/graph build && \
    pnpm --filter @umbral/web build

# --- runner ---
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
