import "dotenv/config";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";

import { OpenAPIHandler } from "@orpc/openapi/node";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { RPCHandler } from "@orpc/server/node";
import { CORSPlugin } from "@orpc/server/plugins";
import { onError } from "@orpc/server";
import { appRouter } from "./routers/index";
import { createServer } from "node:http";

const baseCorsConfig = {
  origin: process.env.CORS_ORIGIN || "",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
};

const rpcHandler = new RPCHandler(appRouter, {
  plugins: [
    new CORSPlugin({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
      allowHeaders: ["Content-Type", "Authorization"],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

const fastify = Fastify({
  logger: true,
  serverFactory: (fastifyHandler) => {
    const server = createServer(async (req, res) => {
      const { matched } = await rpcHandler.handle(req, res, {
        context: await createContext(req.headers),
        prefix: "/rpc",
      });

      if (matched) {
        return;
      }

      const apiResult = await apiHandler.handle(req, res, {
        context: await createContext(req.headers),
        prefix: "/api",
      });

      if (apiResult.matched) {
        return;
      }

      fastifyHandler(req, res);
    });

    return server;
  },
});

fastify.register(fastifyCors, baseCorsConfig);

fastify.get("/", async () => {
  return "OK";
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log("Server running on port 3000");
});
