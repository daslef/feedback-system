import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import { createApi } from "@shared/api";
import { createAuth } from "@shared/auth";
import { db } from "@shared/database";

import { type Env } from "./env";
import apiRouter from "./router";

export default function createApp(env: Env) {
  const trustedOrigins = [env.PUBLIC_WEB_URL, env.PUBLIC_ADMIN_URL].map(
    (url) => new URL(url).origin,
  );

  const auth = createAuth({
    trustedOrigins,
    serverUrl: env.PUBLIC_SERVER_URL,
    apiPath: env.PUBLIC_SERVER_API_PATH,
    authSecret: env.SERVER_AUTH_SECRET,
    db,
  });

  const api = createApi({
    auth,
    db,
    environment: env.ENV,
    serverUrl: env.PUBLIC_SERVER_URL,
    apiPath: env.PUBLIC_SERVER_API_PATH,
    appRouter: apiRouter,
  });

  const app = new Hono<{
    Variables: {
      user: typeof auth.$Infer.Session.user | null;
      session: typeof auth.$Infer.Session.session | null;
    };
  }>();

  app.get("/healthcheck", (c) => {
    return c.text("OK");
  });

  app.use(logger());

  app.use(
    `${env.PUBLIC_SERVER_API_PATH}/auth/*`,
    cors({
      origin: trustedOrigins,
      credentials: true,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
    }),
  );

  app.on(["POST", "GET"], `${env.PUBLIC_SERVER_API_PATH}/auth/*`, (c) =>
    auth.handler(c.req.raw),
  );

  app.use(
    `${env.PUBLIC_SERVER_API_PATH}/*`,
    cors({
      origin: trustedOrigins,
      credentials: true,
      allowHeaders: ["Content-Type", "x-total-count"],
      exposeHeaders: ["x-total-count"],
    }),
    async (c, next) => {
      const { matched, response } = await api.handler(c.req.raw);
      if (matched) {
        return c.newResponse(response.body, response);
      }

      await next();
    },
  );

  return app;
}
