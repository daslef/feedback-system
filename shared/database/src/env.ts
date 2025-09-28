import path from "node:path";

import * as v from "valibot";
import dotenv from "dotenv";

dotenv.config({ path: path.join(import.meta.dirname, "..", ".env") });

import "dotenv/config";

export const envSchema = v.union([
  v.object({
    ENV: v.literal("production"),
    SQLITE_DATABASE_URI: v.optional(v.string()),
    POSTGRES_DATABASE_URI: v.string(),
  }),
  v.object({
    ENV: v.literal("development"),
    SQLITE_DATABASE_URI: v.string(),
    POSTGRES_DATABASE_URI: v.optional(v.string()),
  }),
]);

export const env = v.parse(envSchema, process.env);
