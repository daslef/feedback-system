FROM node:22-alpine AS base

WORKDIR /app

ENV TURBO_TELEMETRY_DISABLED=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=1
ENV NODE_ENV=production

RUN corepack enable pnpm \
    && pnpm install --global turbo@^2

# =========================================================================== #

FROM base AS builder

COPY . .

RUN turbo prune @shared/database --docker

# =========================================================================== #

FROM base AS runner

COPY --from=builder /app/out/json/ .

RUN pnpm --filter=@shared/database add dotenv-cli drizzle-kit \
     && pnpm install --filter=@shared/database --prod --frozen-lockfile \
     && pnpm store prune \
     && rm -rf /root/.cache

COPY --from=builder /app/out/full/ .

CMD ["/bin/sh"]