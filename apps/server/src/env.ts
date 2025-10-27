import path from "node:path";
import * as v from "valibot";
import dotenv from "@dotenvx/dotenvx";

dotenv.config({ path: path.join(import.meta.dirname, "..", ".env") });

export const envSchema = v.object({
  ENV: v.picklist(["development", "production", "staging"]),
  SERVER_AUTH_SECRET: v.pipe(v.string(), v.minLength(1)),

  PUBLIC_SERVER_URL: v.pipe(v.string(), v.url()),
  PUBLIC_WEB_URL: v.pipe(v.string(), v.url()),
  PUBLIC_ADMIN_URL: v.pipe(v.string(), v.url()),
});

export const env = v.parse(envSchema, process.env);
export type Env = v.InferOutput<typeof envSchema>;
