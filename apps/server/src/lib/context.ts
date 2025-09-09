import type { IncomingHttpHeaders } from "node:http";

export async function createContext(req: IncomingHttpHeaders) {
  // No auth configured
  return {
    session: null,
  };
}


export type Context = Awaited<ReturnType<typeof createContext>>;
