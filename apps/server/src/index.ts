import { createServer } from "node:http";
import "dotenv/config";

import Fastify from "fastify";
import fastifyCors from "@fastify/cors";

import { apiHandler, rpcHandler } from "@shared/orpc";
import { createContext } from "./lib/context";

const baseCorsConfig = {
  origin: process.env.CORS_ORIGIN || "",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
};

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
