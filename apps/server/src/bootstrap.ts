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

  app.post("/api/feedback", async (c) => {
    console.log(c.req.method, c.req.path, "here");
    if (c.req.method === "POST" && c.req.path === "/api/feedback") {
      const contentType = c.req.header("content-type");

      if (!contentType?.includes("multipart/form-data")) {
        console.log("Invalid content type:", contentType);
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

      // Create the todo first
      // const db = createDatabaseConnection();
      // const result = await db
      //   .insert(todo)
      //   .values({
      //     text: text.trim(),
      //     imageUrl: null,
      //   })
      //   .returning();

      // const createdTodo = result[0];
      // console.log("Todo created:", createdTodo);

      // if (imageFile && imageFile.size > 0) {
      //   try {
      //     console.log("Uploading image to R2...");
      //     const r2 = createR2Client(c.env);

      //     // Generate unique key for the image
      //     const key = generateImageKey(createdTodo.id, imageFile.name);

      //     // Upload image to R2
      //     await uploadImage(
      //       r2,
      //       "ecomantem-todo-images",
      //       key,
      //       imageFile,
      //       imageFile.type,
      //     );

      //     console.log("Image uploaded successfully");

      //     // Store the R2 key in the imageUrl field (not a signed URL)
      //     console.log("Generated image key:", key);

      //     // // Update todo with image key (stored as imageUrl)
      //     // const updatedResult = await db
      //     //   .update(todo)
      //     //   .set({ imageUrl: key })
      //     //   .where(eq(todo.id, createdTodo.id))
      //     //   .returning();

      //     console.log("Todo updated with image URL");

      //     return c.json(updatedResult[0]);
      //   } catch (error) {
      //     console.error("Failed to upload image:", error);
      //     // Return the todo without image rather than failing completely
      //     return c.json(createdTodo);
      //   }
      // }

      // return c.json(createdTodo);
    }
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
