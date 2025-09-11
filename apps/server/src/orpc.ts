import type {
  IncomingHttpHeaders,
  IncomingMessage,
  ServerResponse,
} from "node:http";
import { apiHandler, rpcHandler } from "@shared/orpc";

async function createContext(_: IncomingHttpHeaders) {
  // No auth configured
  return {
    session: null,
  };
}

export default async function orpcHandler(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) {
  const rpcResult = await rpcHandler.handle(req, res, {
    context: await createContext(req.headers),
    prefix: "/rpc",
  });

  if (rpcResult.matched) {
    return true;
  }

  const apiResult = await apiHandler.handle(req, res, {
    context: await createContext(req.headers),
    prefix: "/api",
  });

  if (apiResult.matched) {
    return true;
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>;
