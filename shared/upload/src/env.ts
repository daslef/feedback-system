import path from "node:path";
import * as v from "valibot";
import { config } from "dotenv";

config({ path: path.join(import.meta.dirname, "..", ".env") });

export const envSchema = v.object({
  MINIO_ACCESS_KEY: v.pipe(v.string(), v.minLength(12)),
  MINIO_SECRET_KEY: v.pipe(v.string(), v.minLength(12)),
  MINIO_ENDPOINT: v.pipe(v.string(), v.nonEmpty()),
  MINIO_PORT: v.pipe(
    v.string(),
    v.transform(Number),
    v.number(),
    v.integer(),
    v.minValue(4000),
    v.maxValue(10000),
  ),
});

export const env = v.parse(envSchema, process.env);
export type Env = v.InferInput<typeof envSchema>;
