import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import { createApi } from "@shared/api";
import { createAuth } from "@shared/auth";
import { db } from "@shared/database";
import upload from "@shared/upload";

import { env } from "./env";
import apiRouter from "./router";

export default function createApp() {
  const trustedOrigins = [env.PUBLIC_WEB_URL, "http://localhost:5174"].map(
    (url) => new URL(url).origin,
  );

  const auth = createAuth({
    webUrl: env.PUBLIC_WEB_URL,
    serverUrl: env.PUBLIC_SERVER_URL,
    apiPath: env.PUBLIC_SERVER_API_PATH,
    authSecret: env.SERVER_AUTH_SECRET,
    db,
  });

  const api = createApi({
    auth,
    db,
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

  app.post("/api/upload", async (c) => {
    const contentType = c.req.header("content-type");

    if (!contentType?.includes("multipart/form-data")) {
      console.error("Invalid content type:", contentType);
      return c.json({ error: "Expected multipart/form-data" }, 400);
    }

    const formData = await c.req.formData();
    const feedback_id = Number(formData.get("feedback_id"));

    if (!isFinite(feedback_id)) {
      return c.json({ error: "Feedback ID is required" }, 400);
    }

    const images = formData.getAll("files") as File[];

    console.log("Form data parsed:", {
      feedback_id,
    });

    console.log(
      images.map((imageFile) => ({
        hasImage: !!imageFile,
        fileName: imageFile?.name,
        fileSize: imageFile?.size,
      })),
    );

    await Promise.all(
      images.map(async (file) => {
        console.log(file);
        try {
          const fileUrl = await upload(file, "upload");
          await db
            .insertInto("feedback_image")
            .values({
              feedback_id: feedback_id,
              link_to_s3: fileUrl,
            })
            .execute();
        } catch {
          throw new Error("Error on images upload");
        }
      }),
    );
  });

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
