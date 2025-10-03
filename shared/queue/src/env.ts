import path from "node:path";
import * as v from "valibot";
import { config } from "dotenv";

config({ path: path.join(import.meta.dirname, "..", ".env") });

export const envSchema = v.object({
  SMTP_HOST: v.optional(v.string(), "smtp.gmail.com"),
  SMTP_PORT: v.fallback(
    v.pipe(v.string(), v.transform(Number), v.number(), v.integer()),
    465,
  ),
  SMTP_SECURE: v.fallback(
    v.pipe(
      v.string(),
      v.transform((v) => v === "true"),
      v.boolean(),
    ),
    true,
  ),
  SMTP_USER: v.pipe(v.string(), v.includes("@")),
  SMTP_PASSWORD: v.pipe(v.string(), v.minLength(3)),

  REDIS_HOST: v.optional(v.string(), "127.0.0.1"),
  REDIS_PORT: v.pipe(v.string(), v.transform(Number), v.number(), v.integer()),
  REDIS_PASSWORD: v.optional(v.string()),
});

export const env = v.parse(envSchema, process.env);
export type Env = v.InferOutput<typeof envSchema>;
