import { os, implement } from "@orpc/server";
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
  headers: Headers;
}> => {
  const session = await auth.api.getSession({
    headers,
  });
  return {
    db,
    session,
    headers,
  };
};

const timingMiddleware = os.middleware(async ({ next, path }) => {
  const start = Date.now();
  let waitMsDisplay = "";
  if (process.env.NODE_ENV !== "production") {
    // artificial delay in dev 100-500ms
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    waitMsDisplay = ` (artificial delay: ${waitMs}ms)`;
  }
  const result = await next();
  const end = Date.now();

  console.log(
    `\t[RPC] /${path.join("/")} executed after ${end - start}ms${waitMsDisplay}`,
  );
  return result;
});

const base = implement(apiContract);

export const publicProcedure = base
  .$context<Awaited<ReturnType<typeof createORPCContext>>>()
  .use(timingMiddleware);

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
