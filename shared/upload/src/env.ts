import * as v from "valibot";
import "dotenv/config";

export const envSchema = v.object({
  MINIO_ACCESS_KEY: v.pipe(v.string(), v.minLength(12)),
  MINIO_SECRET_KEY: v.pipe(v.string(), v.minLength(12)),
  MINIO_ENDPOINT: v.pipe(v.string(), v.url()),
  MINIO_PORT: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(4000),
    v.maxValue(9000),
  ),
});

export const env = v.parse(envSchema, process.env);
export type Env = v.InferInput<typeof envSchema>;
