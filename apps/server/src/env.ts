import path from "node:path";
import * as v from "valibot";
import dotenv from "dotenv";

dotenv.config({ path: path.join(import.meta.dirname, "..", ".env") });

export const envSchema = v.object({
  ENV: v.picklist(["development", "production"]),
  SERVER_PORT: v.pipe(
    v.string(),
    v.transform((s) => parseInt(s, 10)),
    v.integer(),
    v.minValue(0),
    v.maxValue(65535),
  ),
  SERVER_HOST: v.pipe(v.string(), v.minLength(1)),
  SERVER_AUTH_SECRET: v.pipe(v.string(), v.minLength(1)),

  // Backend URL, used to configure Scalar
  PUBLIC_SERVER_URL: v.pipe(v.string(), v.url()),
  PUBLIC_SERVER_API_PATH: v.optional(
    v.custom<`/${string}`>(
      (input) => typeof input === "string" && input.startsWith("/"),
      'API Path must start with "/" if provided.',
    ),
    "/api",
  ),

  // Frontend URL, used to configure CORS
  PUBLIC_WEB_URL: v.pipe(v.string(), v.url()),
  PUBLIC_ADMIN_URL: v.pipe(v.string(), v.url()),
});

export const env = v.parse(envSchema, process.env);
export type Env = v.InferOutput<typeof envSchema>;
