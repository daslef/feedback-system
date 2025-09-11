import path from "path";
import SqliteDatabase from "better-sqlite3";
import { Pool, type PoolConfig } from "pg";
import { Kysely, SqliteDialect, PostgresDialect } from "kysely";
import type { Database } from "./interface";

function getDialect() {
  const environment = process.env.ENVIRONMENT;

  if (environment === "prod") {
    return new PostgresDialect({
      pool: new Pool(process.env.DATABASE_URL as PoolConfig),
    });
  }

  return new SqliteDialect({
    database: new SqliteDatabase(
      path.join(import.meta.dirname, "..", "data.db"),
    ),
  });
}

export const db = new Kysely<Database>({
  dialect: getDialect(),
});
