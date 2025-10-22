import { Hono } from "hono";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";
import { requestId } from "hono/request-id";

import { createAuth } from "@shared/auth";
import { db } from "@shared/database";
import { createHttpMiddleware } from "@shared/logger";

import apiRouter from "./router";
import { createApi } from "./api";
import { type Env } from "./env";

export default function createApp(env: Env) {
  const trustedOrigins = [env.PUBLIC_WEB_URL, env.PUBLIC_ADMIN_URL].map(
    (url) => new URL(url).origin,
  ).concat(['localhost']);

  const auth = createAuth({
    trustedOrigins,
    serverUrl: env.PUBLIC_SERVER_URL,
    apiPath: '/api',
    authSecret: env.SERVER_AUTH_SECRET,
    db,
  });

  const api = createApi({
    apiRouter,
    auth,
    db,
    environment: env.ENV,
    serverUrl: env.PUBLIC_SERVER_URL,
    apiPath: "/api",
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

  app.use("*", requestId());

  app.use(
    "*",
    bodyLimit({
      maxSize: 100 * 1024 * 1024,
      onError: (c) => {
        return c.json(
          {
            error: "Request body too large",
          },
          413,
        );
      },
    }),
  );

  app.use("*", async (c: any, next) => {
    // const requestId = c.var.requestId;

    const pinoMiddleware = createHttpMiddleware({
      env: env.ENV,
    });

    await new Promise<void>((resolve) =>
      pinoMiddleware(c.env.incoming, c.env.outgoing, () => resolve()),
    );

    return next();
  });

  app.use(
    `/api/auth/*`,
    cors({
      origin: trustedOrigins,
      credentials: true,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
    }),
  );

  app.on(["POST", "GET"], `/api/auth/*`, (c) =>
    auth.handler(c.req.raw),
  );

  app.use(
    `/api/*`,
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
