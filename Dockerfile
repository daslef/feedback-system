FROM node:22-alpine AS base

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN corepack enable pnpm

# =========================================================================== #

FROM base AS installer

COPY . /app
WORKDIR /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --global serve

# =========================================================================== #

FROM installer AS deploy-admin

RUN pnpm -F admin deploy --legacy ./prod/admin

WORKDIR /app/prod/admin

RUN pnpm build

# =========================================================================== #

FROM installer AS deploy-web

RUN pnpm -F web deploy --legacy ./prod/web

WORKDIR /app/prod/web

RUN pnpm build

# =========================================================================== #

FROM installer AS deploy-server

RUN pnpm -F server deploy --legacy ./prod/server

# =========================================================================== #

FROM devforth/spa-to-http:latest AS prod-admin

COPY --from=deploy-admin /app/prod/admin/dist .

# =========================================================================== #

FROM installer AS prod-server

COPY --from=deploy-server /app/prod/server /app
COPY ./apps/server/.env /app
WORKDIR /app

# =========================================================================== #

FROM base AS prod-web

COPY --from=deploy-web /app/prod/web/dist /app
WORKDIR /app
