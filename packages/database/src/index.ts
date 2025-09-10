import path from "path";
import SqliteDatabase from "better-sqlite3";
import { Pool, type PoolConfig } from "pg";
import { Kysely, SqliteDialect, PostgresDialect } from "kysely";
import type { Database } from "./schema";

const environment = process.env.ENVIRONMENT;

const dialect =
  environment === "prod"
    ? new PostgresDialect({
        pool: new Pool(process.env.DATABASE_URL as PoolConfig),
      })
    : new SqliteDialect({
        database: new SqliteDatabase(
          path.join(import.meta.dirname, "..", "data.db"),
        ),
      });

export const db = new Kysely<Database>({
  dialect,
});
