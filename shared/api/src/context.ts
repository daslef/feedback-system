import { os, implement } from "@orpc/server";
import { type ResponseHeadersPluginContext } from "@orpc/server/plugins";

import type { AuthInstance } from "@shared/auth";
import { db as dbInstance } from "@shared/database";
import { createLogger } from "@shared/logger";
import apiContract from "./contracts";

export const createORPCContext = async ({
  auth,
  db,
  logger,
  environment,
  headers,
}: {
  auth: AuthInstance;
  db: typeof dbInstance;
  logger: ReturnType<typeof createLogger>;
  environment: "production" | "development";
  headers: Headers;
}): Promise<{
  db: typeof dbInstance;
  logger: ReturnType<typeof createLogger>;
  session: AuthInstance["$Infer"]["Session"] | null;
  environment: "production" | "development";
}> => {
  const session = await auth.api.getSession({
    headers,
  });
  return {
    db,
    session,
    environment,
    logger,
  };
};

const timingMiddleware = os.middleware(async ({ next, path }) => {
  const logger = createLogger({ env: "development", service: "server" });
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
