import type { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";

export default function withCors(fastifyInstance: FastifyInstance) {
  fastifyInstance.register(fastifyCors, baseCorsConfig);
  return fastifyInstance;
}

const baseCorsConfig = {
  origin: process.env.CORS_ORIGIN || "",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
};
