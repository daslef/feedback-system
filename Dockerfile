FROM node:22-alpine AS base

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ARG VITE_API_BASE_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

ARG SERVER_HOST
ARG SERVER_PORT

ENV SERVER_HOST=$SERVER_HOST
ENV SERVER_PORT=$SERVER_PORT

RUN corepack enable pnpm

# =========================================================================== #

FROM base AS installer

COPY . /app
WORKDIR /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# =========================================================================== #

FROM installer AS deploy-admin

RUN pnpm -F admin deploy --legacy ./prod/admin

WORKDIR /app/prod/admin

RUN pnpm build

# =========================================================================== #

FROM installer AS deploy-server

RUN pnpm -F server deploy --legacy ./prod/server

# =========================================================================== #

FROM devforth/spa-to-http:latest AS prod-admin

COPY --from=deploy-admin /app/prod/admin/dist .

# =========================================================================== #

FROM base AS prod-server

COPY --from=deploy-server /app/prod/server /app
WORKDIR /app