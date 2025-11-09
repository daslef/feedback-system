FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS uv

ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy

ENV UV_PYTHON_DOWNLOADS=0

WORKDIR /app
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=./apps/bot/uv.lock,target=uv.lock \
    --mount=type=bind,source=./apps/bot/pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project --no-dev
COPY ./apps/bot /app
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev


FROM python:3.12-slim-bookworm AS prod-bot

RUN groupadd --system --gid 999 nonroot \
 && useradd --system --gid 999 --uid 999 --create-home nonroot

COPY --from=uv --chown=nonroot:nonroot /app /app

ENV PATH="/app/.venv/bin:$PATH"

USER nonroot

WORKDIR /app

CMD ["fastapi", "run", "--host", "0.0.0.0"]

# =========================================================================== #

FROM node:22-alpine AS base-node

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN corepack enable pnpm

# =========================================================================== #

FROM base-node AS installer

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

FROM base-node AS prod-web

COPY --from=deploy-web /app/prod/web/dist /app
WORKDIR /app
