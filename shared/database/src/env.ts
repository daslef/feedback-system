import path from "node:path";
import * as v from "valibot";
import dotenv from "dotenv";

dotenv.config({ path: path.join(import.meta.dirname, "..", ".env") });

import "dotenv/config";

const DEFAULT_URI = path.join(import.meta.dirname, "..", "data.db");

export const envSchema = v.object({
  ENV: v.picklist(["production", "development"]),
  DATABASE_URI: v.pipe(v.optional(v.string(), DEFAULT_URI)),
});

export const env = v.parse(envSchema, process.env);
