import { os, implement } from "@orpc/server";
import { type ResponseHeadersPluginContext } from "@orpc/server/plugins";

import type { AuthInstance } from "@shared/auth";
import { db as dbInstance } from "@shared/database";
import { createLogger } from "@shared/logger";
import apiContract from "./contracts";

type Env = {
  ENV: "production" | "staging" | "development";
  SERVER_AUTH_SECRET: string;
  PUBLIC_SERVER_URL: string;
  PUBLIC_WEB_URL: string;
  PUBLIC_ADMIN_URL: string;
  PUBLIC_BOT_URL: string;
  MINIO_ACCESS_KEY: string;
  MINIO_SECRET_KEY: string;
  MINIO_ENDPOINT: string;
  MINIO_PUBLIC_URL?: string | undefined;
};

type CreateORPCContext = {
  auth: AuthInstance;
  db: typeof dbInstance;
  environment: Env;
  headers: Headers;
};

export const createORPCContext = async ({
  auth,
  db,
  environment,
  headers,
}: CreateORPCContext): Promise<{
  db: typeof dbInstance;
  session: AuthInstance["$Infer"]["Session"] | null;
  environment: Env;
}> => {
  const session = await auth.api.getSession({
    headers,
  });
  return {
    db,
    session,
    environment,
  };
};

const timingMiddleware = os.middleware(async ({ next, path }) => {
  const logger = createLogger({ env: "development" });
  const start = Date.now();
  let waitMsDisplay = "";
  const result = await next();
  const end = Date.now();

  logger.info(
    `\t[RPC] /${path.join("/")} executed after ${end - start}ms${waitMsDisplay}`,
  );
  return result;
});

const base = implement(apiContract);

export interface Context
  extends Awaited<ReturnType<typeof createORPCContext>>,
    ResponseHeadersPluginContext {}

export const publicProcedure = base.$context<Context>().use(timingMiddleware);

export const protectedProcedure = publicProcedure.use(
  ({ context, next, errors }) => {
    if (!context.session?.user) {
      throw errors.UNAUTHORIZED();
    }
    return next({
      context: {
        session: { ...context.session },
      },
    });
  },
);
