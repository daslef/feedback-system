import path from "node:path";

import * as v from "valibot";
import dotenv from "@dotenvx/dotenvx";

dotenv.config({
  path: path.join(import.meta.dirname, "..", ".env"),
});

export const envSchema = v.union([
  v.object({
    ENV: v.picklist(["production", "staging"]),
    POSTGRES_HOST: v.string(),
    POSTGRES_PORT: v.string(),
    POSTGRES_USER: v.string(),
    POSTGRES_PASSWORD: v.string(),
    POSTGRES_DB: v.string(),
  }),
  v.object({
    ENV: v.literal("development"),
    SQLITE_DATABASE_URI: v.string(),
  }),
]);

export const env = v.parse(envSchema, process.env);
