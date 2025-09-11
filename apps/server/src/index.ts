import { createServer } from "node:http";
import Fastify from "fastify";
import "dotenv/config";

import orpcHandler from "./orpc";
import withCors from "./cors";

const fastify = withCors(
  Fastify({
    logger: true,
    serverFactory: (fastifyHandler) => {
      const server = createServer(async (req, res) => {
        const isHandledByOrpc = await orpcHandler(req, res);

        if (!isHandledByOrpc) {
          fastifyHandler(req, res);
        }
      });

      return server;
    },
  }),
);

fastify.get("/", async () => {
  return "OK";
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log("Server running on localhost:3000");
  console.log("Scalar docs running on localhost:3000/api");
});
