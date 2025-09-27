import { os, implement } from "@orpc/server";
import { type ResponseHeadersPluginContext } from "@orpc/server/plugins";

import type { AuthInstance } from "@shared/auth";
import { db as dbInstance } from "@shared/database";
import apiContract from "./contracts";

export const createORPCContext = async ({
  auth,
  db,
  headers,
}: {
  auth: AuthInstance;
  db: typeof dbInstance;
  headers: Headers;
}): Promise<{
  db: typeof dbInstance;
  session: AuthInstance["$Infer"]["Session"] | null;
}> => {
  const session = await auth.api.getSession({
    headers,
  });
  return {
    db,
    session,
  };
};

const timingMiddleware = os.middleware(async ({ next, path }) => {
  const start = Date.now();
  let waitMsDisplay = "";
  const result = await next();
  const end = Date.now();

  console.log(
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
