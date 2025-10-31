import path from "node:path";
import * as v from "valibot";
import dotenv from "@dotenvx/dotenvx";

dotenv.config({
  path: path.join(import.meta.dirname, "..", ".env"),
});

export const envSchema = v.object({
  ENV: v.picklist(["development", "production", "staging"]),
  SERVER_AUTH_SECRET: v.pipe(v.string(), v.minLength(1)),

  PUBLIC_SERVER_URL: v.pipe(v.string(), v.url()),
  PUBLIC_WEB_URL: v.pipe(v.string(), v.url()),
  PUBLIC_ADMIN_URL: v.pipe(v.string(), v.url()),

  MINIO_ACCESS_KEY: v.pipe(v.string(), v.minLength(12)),
  MINIO_SECRET_KEY: v.pipe(v.string(), v.minLength(12)),
  MINIO_ENDPOINT: v.pipe(v.string(), v.nonEmpty()),
  MINIO_PUBLIC_URL: v.optional(v.pipe(v.string(), v.nonEmpty())),
});

export const env = v.parse(envSchema, process.env);
export type Env = v.InferOutput<typeof envSchema>;
