import { Hono } from "hono";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";
import { requestId } from "hono/request-id";

import { OpenAPIGenerator } from "@orpc/openapi";
import { Scalar } from "@scalar/hono-api-reference";

import { ValibotToJsonSchemaConverter } from "@shared/api";
import { createAuth } from "@shared/auth";
import { db } from "@shared/database";
import { createHttpMiddleware } from "@shared/logger";

import apiRouter from "./router";
import { createApi } from "./api";
import { type Env } from "./env";

export default function createApp(env: Env) {
  const trustedOrigins = [env.PUBLIC_WEB_URL, env.PUBLIC_ADMIN_URL]
    .map((url) => new URL(url).origin)
    .concat(["localhost"]);

  const auth = createAuth({
    trustedOrigins,
    serverUrl: env.PUBLIC_SERVER_URL,
    apiPath: "/api",
    authSecret: env.SERVER_AUTH_SECRET,
    db,
  });

  const api = createApi({
    apiRouter,
    auth,
    db,
    environment: env.ENV,
    apiPath: "/api",
  });

  const app = new Hono<{
    Variables: {
      user: typeof auth.$Infer.Session.user | null;
      session: typeof auth.$Infer.Session.session | null;
    };
  }>();

  app.get("/openapi.json", async (context) => {
    const generator = new OpenAPIGenerator({
      schemaConverters: [new ValibotToJsonSchemaConverter()],
    });
    const spec = await generator.generate(apiRouter);
    return context.json(spec);
  });

  app.get(
    "/docs",
    Scalar({
      defaultOpenAllTags: true,
      hideClientButton: false,
      pageTitle: "Feedback System | API Reference",
      servers: [
        {
          url: env.PUBLIC_SERVER_URL + "/api",
          description: "oRPC API",
        },
        {
          url: env.PUBLIC_SERVER_URL + "/api/auth",
          description: "Auth API",
        },
      ],
      sources: [
        {
          url: "/openapi.json",
          title: "oRPC API",
        },
        {
          url: "/api/auth/open-api/generate-schema",
          title: "Auth API",
        },
      ],
    }),
  );

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

  app.on(["POST", "GET"], `/api/auth/*`, (c) => auth.handler(c.req.raw));

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
